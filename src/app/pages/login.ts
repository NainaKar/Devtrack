import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-shell">
      <!-- Ambient Glow Blobs -->
      <div class="auth-bg-blob auth-bg-blob-1" aria-hidden="true"></div>
      <div class="auth-bg-blob auth-bg-blob-2" aria-hidden="true"></div>
      <div class="auth-bg-blob auth-bg-blob-3" aria-hidden="true"></div>
      <div class="auth-bg-blob auth-bg-blob-4" aria-hidden="true"></div>
      <div class="auth-bg-blob auth-bg-blob-5" aria-hidden="true"></div>

      <!-- Top-Left Back Navigation -->
      <nav class="auth-top-nav" aria-label="Back to home">
        <a routerLink="/" class="auth-back-link">
          <span aria-hidden="true">←</span>
          <span>Back to home</span>
        </a>
      </nav>

      <!-- Main Auth Card -->
      <main class="auth-card-container">
        <!-- Left Panel: Cream with Organic S-Curve -->
        <section class="auth-art-panel" aria-label="Platform preview">
          <!-- Wavy S-Curve SVG Divider: exact 100x100 aspect ratio meeting top & bottom edges with zero hard cut -->
          <svg class="auth-wave-bg" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <path d="M 0 0 L 100 0 C 100 20, 88 35, 88 50 C 88 65, 100 80, 100 100 L 0 100 Z" fill="#f8f1e7" />
          </svg>

          <div class="auth-art-content">
            <!-- Brand Logo -->
            <a routerLink="/" class="auth-brand-logo" aria-label="DevTrack Home">
              <span class="auth-brand-badge">D</span>
              <span class="auth-brand-title">DevTrack</span>
            </a>

            <!-- Center Illustration: explicit sizing, fills cream panel -->
            <div class="auth-art-wrap">
              <img
                src="images/devtrack-login-illustration.svg"
                alt="DevTrack skills progress tracker illustration"
                class="auth-art"
              />
            </div>

            <!-- Tagline & Handwritten Accent: sits right below illustration -->
            <div class="auth-art-tagline-wrap">
              <h2 class="auth-art-headline">Know exactly how ready you are.</h2>
              <p class="auth-art-script">small steps, big progress ♡</p>
            </div>

            <!-- Bottom Left Footer -->
            <p class="auth-art-footer-note">© 2026 DevTrack – student project</p>
          </div>
        </section>

        <!-- Right Panel: Forest Green Form -->
        <section class="auth-form-panel" aria-labelledby="login-heading">
          <div class="auth-form-inner">
            <!-- Vertically centered form block -->
            <div class="auth-form-center-block">
              <h1 id="login-heading" class="auth-form-title">Log in</h1>

              <div class="auth-form-scrollable">
                @if (error()) {
                  <div class="auth-alert-error" role="alert">
                    {{ error() }}
                  </div>
                }

                @if (infoMessage()) {
                  <div class="auth-alert-info" role="status">
                    {{ infoMessage() }}
                  </div>
                }

                <form (ngSubmit)="submit()" #f="ngForm" novalidate>
                  <!-- Email Field -->
                  <div class="auth-field">
                    <label for="login-email" class="auth-field-label">Email</label>
                    <div class="auth-input-wrap">
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        class="auth-pill-input"
                        [ngModel]="email()"
                        (ngModelChange)="email.set($event)"
                        (input)="onFieldInput('email', $event)"
                        (change)="onFieldInput('email', $event)"
                        required
                        email
                        autocomplete="email"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <!-- Password Field -->
                  <div class="auth-field">
                    <label for="login-password" class="auth-field-label">Password</label>
                    <div class="auth-input-wrap">
                      <input
                        id="login-password"
                        name="password"
                        [type]="showPassword() ? 'text' : 'password'"
                        class="auth-pill-input has-eye"
                        [ngModel]="password()"
                        (ngModelChange)="password.set($event)"
                        (input)="onFieldInput('password', $event)"
                        (change)="onFieldInput('password', $event)"
                        required
                        autocomplete="current-password"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        class="auth-eye-btn"
                        (click)="togglePassword()"
                        [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                      >
                        @if (showPassword()) {
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        } @else {
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        }
                      </button>
                    </div>
                  </div>

                  <!-- Forgot Password -->
                  <button type="button" class="auth-forgot-link" (click)="onForgot()">
                    Forgot password?
                  </button>

                  <!-- Submit Pill Button -->
                  <button
                    type="submit"
                    class="auth-btn-primary"
                    [disabled]="busy()"
                  >
                    {{ busy() ? 'Signing in…' : 'Log in' }}
                  </button>

                  <!-- Switch to Register -->
                  <p class="auth-switch-text">
                    Don't have an account?<br />
                    <a routerLink="/register">Register now</a>
                  </p>
                </form>
              </div>
            </div>

            <!-- Bottom Legal & Support Footer: always docked and visible inside card -->
            <div class="auth-panel-footer">
              <a href="#terms" (click)="$event.preventDefault()">Terms and Services</a>
              <span>Need help? <a href="mailto:support@devtrack.app">support&#64;devtrack.app</a></span>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  error = signal('');
  infoMessage = signal('');
  busy = signal(false);
  showPassword = signal(false);

  isLoginValid = computed(() => {
    const e = (this.email() || '').trim();
    const p = this.password() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return emailRegex.test(e) && p.length >= 1;
  });

  onFieldInput(field: 'email' | 'password', ev: Event) {
    const val = (ev.target as HTMLInputElement)?.value ?? '';
    if (field === 'email') this.email.set(val);
    else if (field === 'password') this.password.set(val);
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onForgot() {
    this.error.set('');
    this.infoMessage.set('Password reset instructions will be sent if an account matches this email.');
  }

  async submit() {
    this.error.set('');
    this.infoMessage.set('');
    const e = (this.email() || '').trim();
    const p = this.password() || '';

    if (!e || !p) {
      this.error.set('Please enter your email and password to log in.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(e)) {
      this.error.set('Please enter a valid email address.');
      return;
    }

    this.busy.set(true);
    const err = await this.auth.login(e, p);
    this.busy.set(false);
    if (err) {
      this.error.set(err);
    } else {
      this.router.navigateByUrl('/app/dashboard');
    }
  }
}
