import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Goals, User, UserData } from '../models';

/**
 * Talks to the Express API (server/index.js).
 * - JWT is kept in localStorage and attached by token.interceptor.ts
 * - `data` is a signal for instant UI updates; changes are saved to the server (debounced).
 */
const TOKEN = 'devtrack.token';
interface AuthResponse { token: string; user: User; data: UserData; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  user = signal<User | null>(null);
  data = signal<UserData | null>(null);
  isLoggedIn = computed(() => !!this.user());
  saveError = signal(false);
  /** Guards await this so a page refresh restores the session before routing. */
  ready: Promise<void>;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() { this.ready = this.restore(); }

  private token(v?: string | null): string | null {
    try {
      if (v === null) localStorage.removeItem(TOKEN);
      else if (v) localStorage.setItem(TOKEN, v);
      return localStorage.getItem(TOKEN);
    } catch { return null; }
  }

  private async restore() {
    if (!this.token()) return;
    try {
      const r = await firstValueFrom(this.http.get<{ user: User; data: UserData }>('/api/me'));
      this.user.set(r.user); this.data.set(r.data);
    } catch (e) {
      // only drop the session if the server says the token is bad (not if the API is just down)
      if (e instanceof HttpErrorResponse && e.status === 401) this.token(null);
    }
  }

  private message(e: unknown): string {
    if (e instanceof HttpErrorResponse) {
      if (e.status === 0) return 'Cannot reach the server. Run "npm start" so the API on port 3000 is running.';
      return e.error?.error ?? 'Something went wrong. Please try again.';
    }
    return 'Something went wrong. Please try again.';
  }

  /** Returns an error message, or null on success. */
  async register(name: string, email: string, password: string, goals: Goals): Promise<string | null> {
    try {
      const r = await firstValueFrom(this.http.post<AuthResponse>('/api/auth/register', { name, email, password, goals }));
      this.start(r);
      this.update(d => d, 'register', `Account created. Goal: ${goals.position} at ${goals.company || 'any company'}.`);
      return null;
    } catch (e) { return this.message(e); }
  }

  async login(email: string, password: string): Promise<string | null> {
    try {
      const r = await firstValueFrom(this.http.post<AuthResponse>('/api/auth/login', { email, password }));
      this.start(r);
      this.update(d => d, 'login', 'Logged in.');
      return null;
    } catch (e) { return this.message(e); }
  }

  async logout() {
    this.update(d => d, 'logout', 'Logged out.');
    await this.flush();
    this.token(null);
    // navigate away first so the app shell is destroyed before its data disappears
    await this.router.navigateByUrl('/');
    this.user.set(null); this.data.set(null);
  }

  async deleteAccount() {
    try { await firstValueFrom(this.http.delete('/api/me')); } catch { /* ignore */ }
    this.token(null);
    await this.router.navigateByUrl('/');
    this.user.set(null); this.data.set(null);
  }

  private start(r: AuthResponse) { this.token(r.token); this.user.set(r.user); this.data.set(r.data); }

  /** Single write path: every change to user data goes through here (and is optionally logged). */
  update(fn: (d: UserData) => UserData, logType?: string, logText?: string) {
    const cur = this.data(); if (!cur) return;
    const next = fn(structuredClone(cur));
    if (logType) next.activity = [{ at: new Date().toISOString(), type: logType, text: logText ?? '' }, ...next.activity].slice(0, 300);
    this.data.set(next);
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 400);
  }

  private async flush() {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    const d = this.data(); if (!d) return;
    try { await firstValueFrom(this.http.put('/api/data', d)); this.saveError.set(false); }
    catch (e) {
      this.saveError.set(true);
      if (e instanceof HttpErrorResponse && e.status === 401) { this.token(null); this.user.set(null); this.data.set(null); this.router.navigateByUrl('/login'); }
    }
  }
}
