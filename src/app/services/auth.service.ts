import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Goals, User, UserData } from '../models';

export interface RegisterResult {
  error: string | null;
  confirmEmail?: boolean;
  email?: string;
}

/**
 * Supabase Authentication & Data Persistence Service.
 * - Manages user authentication (sign up, login, logout, session restoration) via Supabase Auth.
 * - Stores user profile and career progress data in the `public.user_data` Supabase table.
 * - Debounces writes by 400ms to minimize database operations while providing instant reactive UI updates.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  readonly supabase: SupabaseClient;

  user = signal<User | null>(null);
  data = signal<UserData | null>(null);
  isLoggedIn = computed(() => !!this.user());
  saveError = signal(false);
  needsGoals = signal(false);
  oauthError = signal<string | null>(null);

  /** Guards await this promise so a page refresh restores the session before routing. */
  ready: Promise<void>;

  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Initialize Supabase client using environment config
    const url = environment.supabaseUrl && environment.supabaseUrl !== 'SUPABASE_URL'
      ? environment.supabaseUrl
      : 'https://placeholder-project.supabase.co';

    const key = environment.supabaseAnonKey && environment.supabaseAnonKey !== 'SUPABASE_ANON_KEY'
      ? environment.supabaseAnonKey
      : 'placeholder-key';

    this.supabase = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    // Listen for auth state changes (e.g. token refresh, OAuth callback, logout in another tab)
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        this.user.set(null);
        this.data.set(null);
        this.needsGoals.set(false);
      } else if (event === 'SIGNED_IN') {
        if (!this.user() || this.user()?.id !== session.user.id) {
          const su = session.user;
          const name = (su.user_metadata?.['full_name'] as string) ||
                       (su.user_metadata?.['name'] as string) ||
                       su.email?.split('@')[0] ||
                       'Developer';
          this.user.set({
            id: su.id,
            name,
            email: su.email || '',
            createdAt: su.created_at,
          });
          await this.loadUserData(su.id);
        }
      }
    });

    this.ready = this.restore();
  }

  private isConfigured(): boolean {
    return (
      !!environment.supabaseUrl &&
      environment.supabaseUrl !== 'SUPABASE_URL' &&
      !!environment.supabaseAnonKey &&
      environment.supabaseAnonKey !== 'SUPABASE_ANON_KEY'
    );
  }

  /** Restores user session and loads user_data from Supabase on app initialization or page refresh */
  private async restore(): Promise<void> {
    if (!this.isConfigured()) return;

    // Detect OAuth errors passed via URL hash or search (e.g. #error=access_denied&error_description=...)
    try {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash ? window.location.hash.substring(1) : '';
        const search = window.location.search ? window.location.search.substring(1) : '';
        const params = new URLSearchParams(hash || search);
        const errDesc = params.get('error_description') || params.get('error') || params.get('error_code');
        if (errDesc) {
          const clean = decodeURIComponent(errDesc.replace(/\+/g, ' '));
          this.oauthError.set(
            clean.toLowerCase().includes('denied') || clean.toLowerCase().includes('cancel')
              ? 'Google sign-in was cancelled. Please try again.'
              : `Google sign-in failed: ${clean}`
          );
        }
      }
    } catch { /* ignore URL parse errors */ }

    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error || !session?.user) return;

      const su = session.user;
      const name = (su.user_metadata?.['full_name'] as string) ||
                   (su.user_metadata?.['name'] as string) ||
                   su.email?.split('@')[0] ||
                   'Developer';
      this.user.set({
        id: su.id,
        name,
        email: su.email || '',
        createdAt: su.created_at,
      });

      await this.loadUserData(su.id);
    } catch (e) {
      console.warn('Session restoration failed:', e);
    }
  }

  private async loadUserData(userId: string): Promise<void> {
    try {
      const { data, error } = await this.supabase
        .from('user_data')
        .select('data')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data?.data) {
        const ud = data.data as UserData;
        this.data.set(ud);
        this.needsGoals.set(!!ud.needsGoals);
        return;
      }

      // If user_data row doesn't exist yet (e.g. first-time Google sign-in):
      // Automatically initialize default profile row with needsGoals: true so
      // the user is directed to the career goals setup step before accessing the dashboard.
      let savedGoals: Goals = {
        roleId: 'fullstack',
        position: 'Full-Stack Web Developer',
        company: '',
        timelineMonths: 12,
        level: 'Beginner',
        weeklyHours: 10,
      };

      try {
        const { data: authData } = await this.supabase.auth.getUser();
        if (authData?.user?.user_metadata?.['goals']) {
          savedGoals = authData.user.user_metadata['goals'] as Goals;
        }
      } catch { /* ignore metadata read error */ }

      const initialData: UserData = {
        goals: savedGoals,
        needsGoals: true,
        github: '',
        linkedin: '',
        resumeName: '',
        resumeUrl: '',
        doneTopics: [],
        projects: [],
        jobs: [
          {
            id: 'target-initial',
            company: savedGoals.company || 'Dream Company',
            role: savedGoals.position || 'Software Engineer',
            status: 'Preparing',
            requiredSkills: ['Core Architecture', 'DSA', 'Portfolio Project'],
            notes: 'Primary target set in career goals.',
            updatedAt: new Date().toISOString(),
          }
        ],
        chat: [],
        activity: [
          {
            at: new Date().toISOString(),
            type: 'register',
            text: `Account initialized with Google. Set career goals to begin.`,
          },
        ],
      };

      this.data.set(initialData);
      this.needsGoals.set(true);

      // Save initial row now that user has an authenticated session
      const { error: upsertErr } = await this.supabase
        .from('user_data')
        .upsert({
          user_id: userId,
          data: initialData,
          updated_at: new Date().toISOString(),
        });

      if (upsertErr) {
        console.warn('Failed to insert default user_data:', upsertErr);
      }
    } catch (e) {
      console.warn('Failed to load user_data:', e);
    }
  }

  /**
   * Registers a new user with Supabase Auth and initializes their user_data row.
   * Returns a structured RegisterResult with error, or confirmEmail flag.
   */
  async register(name: string, email: string, password: string, goals: Goals): Promise<RegisterResult> {
    if (!this.isConfigured()) {
      return {
        error: 'Supabase credentials not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY in src/environments/environment.ts.',
      };
    }

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();

      const { data, error } = await this.supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            name: trimmedName,
            goals,
          },
        },
      });

      if (error) {
        console.error('Supabase signUp error:', error);
        const msg = error.message || '';
        if (error.status === 429 || msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('too many requests')) {
          return { error: 'Too many sign-up attempts. Please wait a few minutes before trying again.' };
        }
        if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('user already exists') || msg.toLowerCase().includes('already been taken')) {
          return { error: 'An account with this email already exists. Please log in instead.' };
        }
        if (error.status === 401 || msg.toLowerCase().includes('invalid api key')) {
          return { error: 'Authentication configuration error (Invalid Supabase API key).' };
        }
        return { error: msg || 'Registration failed. Please verify your details and try again.' };
      }

      const su = data.user;
      if (!su) {
        return { error: 'Registration failed. No user was returned by authentication service.' };
      }

      // Check if user already exists (Supabase anti-enumeration returns user with empty identities array)
      if (su.identities && su.identities.length === 0) {
        return { error: 'An account with this email already exists. Please sign in instead.' };
      }

      // Check if email confirmation is required (user returned but session is null)
      if (!data.session) {
        return {
          error: null,
          confirmEmail: true,
          email: trimmedEmail,
        };
      }

      // User has an active session immediately (auto-confirm enabled)
      const userObj: User = {
        id: su.id,
        name: trimmedName,
        email: trimmedEmail,
        createdAt: su.created_at || new Date().toISOString(),
      };

      const initialData: UserData = {
        goals,
        github: '',
        linkedin: '',
        resumeName: '',
        resumeUrl: '',
        doneTopics: [],
        projects: [],
        jobs: [
          {
            id: 'target-initial',
            company: goals.company || 'Dream Company',
            role: goals.position || 'Software Engineer',
            status: 'Preparing',
            requiredSkills: ['Core Architecture', 'DSA', 'Portfolio Project'],
            notes: 'Primary target set in career goals.',
            updatedAt: new Date().toISOString(),
          }
        ],
        chat: [],
        activity: [
          {
            at: new Date().toISOString(),
            type: 'register',
            text: `Account created. Goal: ${goals.position} at ${goals.company || 'any company'}.`,
          },
        ],
      };

      this.user.set(userObj);
      this.data.set(initialData);

      // Create the user_data row in Supabase
      const { error: insertError } = await this.supabase
        .from('user_data')
        .upsert({
          user_id: su.id,
          data: initialData,
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Initial user_data insert error:', insertError);
        const errMsg = insertError.message || '';
        if (insertError.code === '42501' || errMsg.toLowerCase().includes('permission denied') || errMsg.toLowerCase().includes('row-level security')) {
          return { error: 'Account created, but database write was denied by Row-Level Security. Please verify schema.sql policies in Supabase.' };
        }
        return { error: `Account created, but could not save profile: ${errMsg}` };
      }

      return { error: null };
    } catch (e: any) {
      console.error('Unexpected error in register():', e);
      return { error: e?.message || 'An unexpected error occurred during registration. Please try again.' };
    }
  }

  /**
   * Signs in an existing user with email and password.
   * Returns an error message string or null on success.
   */
  async login(email: string, password: string): Promise<string | null> {
    if (!this.isConfigured()) {
      return 'Supabase credentials not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY in src/environments/environment.ts.';
    }

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        const msg = error.message || '';
        if (error.status === 429 || msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('too many requests')) {
          return 'Too many login attempts. Please wait a few minutes and try again.';
        }
        if (msg.toLowerCase().includes('invalid login credentials')) {
          return 'Incorrect email or password. Please try again.';
        }
        if (msg.toLowerCase().includes('email not confirmed')) {
          return 'Please check your email and confirm your account before logging in.';
        }
        return msg || 'Login failed. Please check your credentials.';
      }

      const su = data.user;
      if (!su) {
        return 'Login failed. Please check your credentials.';
      }

      const userObj: User = {
        id: su.id,
        name: (su.user_metadata?.['name'] as string) || su.email?.split('@')[0] || 'Developer',
        email: su.email || trimmedEmail,
        createdAt: su.created_at,
      };

      this.user.set(userObj);
      await this.loadUserData(su.id);

      // Log login activity
      this.update(d => d, 'login', 'Logged in.');

      return null;
    } catch (e: any) {
      return e?.message || 'Invalid email or password.';
    }
  }

  /**
   * Initiates Google OAuth sign in or registration with Supabase Auth.
   * Uses window.location.origin so redirects work automatically across localhost:4200 and Netlify.
   */
  async signInWithGoogle(): Promise<{ error: string | null }> {
    if (!this.isConfigured()) {
      return {
        error: 'Supabase credentials not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY in src/environments/environment.ts.',
      };
    }

    try {
      const redirectUrl = window.location.origin + '/app/dashboard';
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('Supabase signInWithOAuth error:', error);
        return { error: error.message || 'Google sign-in failed. Please try again.' };
      }

      return { error: null };
    } catch (e: any) {
      console.error('Unexpected error in signInWithGoogle():', e);
      return { error: e?.message || 'Google sign-in failed. Please try again.' };
    }
  }

  /**
   * Completes career goals onboarding for OAuth (Google) users.
   * Updates user_data with target goals, clears needsGoals flag, and flushes to Supabase.
   */
  async completeGoals(goals: Goals): Promise<string | null> {
    const u = this.user();
    if (!u) return 'User session not found. Please try logging in again.';

    try {
      const cur = this.data();
      const updatedData: UserData = {
        ...(cur || {
          github: '',
          linkedin: '',
          resumeName: '',
          resumeUrl: '',
          doneTopics: [],
          projects: [],
          chat: [],
          activity: [],
        }),
        goals,
        needsGoals: false,
        jobs: [
          {
            id: 'target-initial',
            company: goals.company || 'Dream Company',
            role: goals.position || 'Software Engineer',
            status: 'Preparing',
            requiredSkills: ['Core Architecture', 'DSA', 'Portfolio Project'],
            notes: 'Primary target set in career goals.',
            updatedAt: new Date().toISOString(),
          },
        ],
        activity: [
          {
            at: new Date().toISOString(),
            type: 'register',
            text: `Career goals calibrated: ${goals.position} at ${goals.company || 'any company'}.`,
          },
          ...(cur?.activity || []),
        ],
      };

      this.data.set(updatedData);
      this.needsGoals.set(false);

      const { error } = await this.supabase
        .from('user_data')
        .upsert({
          user_id: u.id,
          data: updatedData,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Failed to save career goals:', error);
        return 'Failed to save career goals: ' + error.message;
      }

      return null;
    } catch (e: any) {
      console.error('Error in completeGoals():', e);
      return e?.message || 'Failed to save career goals.';
    }
  }

  async logout(): Promise<void> {
    this.update(d => d, 'logout', 'Logged out.');
    await this.flush();

    try {
      await this.supabase.auth.signOut();
    } catch {
      // Ignore signOut network errors
    }

    this.user.set(null);
    this.data.set(null);
    this.needsGoals.set(false);
    await this.router.navigateByUrl('/');
  }

  async deleteAccount(): Promise<void> {
    const u = this.user();
    if (u) {
      try {
        await this.supabase.from('user_data').delete().eq('user_id', u.id);
        await this.supabase.auth.signOut();
      } catch {
        // Ignore
      }
    }
    await this.router.navigateByUrl('/');
    this.user.set(null);
    this.data.set(null);
  }

  /**
   * Single write path: every change to user data goes through here.
   * Updates reactive signal immediately for instant UI feedback and debounces database persistence.
   */
  update(fn: (d: UserData) => UserData, logType?: string, logText?: string): void {
    const cur = this.data();
    if (!cur) return;

    const next = fn(structuredClone(cur));
    if (logType) {
      next.activity = [
        { at: new Date().toISOString(), type: logType, text: logText ?? '' },
        ...(next.activity || []),
      ].slice(0, 300);
    }

    this.data.set(next);

    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 400);
  }

  /** Flushes any debounced data writes to Supabase */
  async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const u = this.user();
    const d = this.data();
    if (!u || !d || !this.isConfigured()) return;

    try {
      const { error } = await this.supabase
        .from('user_data')
        .upsert({
          user_id: u.id,
          data: d,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Supabase user_data save error:', error);
        this.saveError.set(true);
      } else {
        this.saveError.set(false);
      }
    } catch (e) {
      console.error('Failed to flush data to Supabase:', e);
      this.saveError.set(true);
    }
  }
}
