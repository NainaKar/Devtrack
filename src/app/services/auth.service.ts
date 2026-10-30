import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Goals, User, UserData } from '../models';

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

    // Listen for auth state changes (e.g. token refresh, logout in another tab)
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        this.user.set(null);
        this.data.set(null);
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

    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error || !session?.user) return;

      const su = session.user;
      this.user.set({
        id: su.id,
        name: (su.user_metadata?.['name'] as string) || su.email?.split('@')[0] || 'Developer',
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
        this.data.set(data.data as UserData);
      }
    } catch (e) {
      console.warn('Failed to load user_data:', e);
    }
  }

  /**
   * Registers a new user with Supabase Auth and initializes their user_data row.
   * Returns an error message string or null on success.
   */
  async register(name: string, email: string, password: string, goals: Goals): Promise<string | null> {
    if (!this.isConfigured()) {
      return 'Supabase credentials not configured. Please add your SUPABASE_URL and SUPABASE_ANON_KEY in src/environments/environment.ts.';
    }

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();

      const { data, error } = await this.supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: { name: trimmedName },
        },
      });

      if (error) {
        return error.message;
      }

      const su = data.user;
      if (!su) {
        return 'Registration failed. Please try again.';
      }

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
        console.warn('Initial user_data insert error:', insertError);
      }

      return null;
    } catch (e: any) {
      return e?.message || 'Something went wrong during registration.';
    }
  }

  /**
   * Signs in an existing user with email and password.
   * Returns an error message string or null on success.
   */
  async login(email: string, password: string): Promise<string | null> {
    if (!this.isConfigured()) {
      return 'Supabase credentials not configured. Please add your SUPABASE_URL and SUPABASE_ANON_KEY in src/environments/environment.ts.';
    }

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        return error.message;
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

  async logout(): Promise<void> {
    this.update(d => d, 'logout', 'Logged out.');
    await this.flush();

    try {
      await this.supabase.auth.signOut();
    } catch {
      // Ignore signOut network errors
    }

    await this.router.navigateByUrl('/');
    this.user.set(null);
    this.data.set(null);
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
