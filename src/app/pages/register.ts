import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { COMPANY_SUGGESTIONS, LEVELS, ROLES, TIMELINES } from '../data/roles.data';
import { Level } from '../models';

@Component({
  selector: 'app-register',
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
              <h2 class="auth-art-headline">
                {{ step() === 1 ? 'Pick a path. Get a plan.' : 'Calibrate your trajectory.' }}
              </h2>
              <p class="auth-art-script">small steps, big progress ♡</p>
            </div>

            <!-- Bottom Left Footer -->
            <p class="auth-art-footer-note">© 2026 DevTrack – student project</p>
          </div>
        </section>

        <!-- Right Panel: Forest Green Form -->
        <section class="auth-form-panel" [attr.aria-labelledby]="step() === 1 ? 'reg-step1-heading' : 'reg-step2-heading'">
          <div class="auth-form-inner">
            <!-- 4px Rounded Stepper Bars pinned to top -->
            <div class="auth-stepper-bars" aria-label="Registration progress">
              <div class="auth-step-bar active" [attr.aria-current]="step() === 1 ? 'step' : null"></div>
              <div class="auth-step-bar" [class.active]="step() === 2" [attr.aria-current]="step() === 2 ? 'step' : null"></div>
            </div>

            <!-- Vertically centered form block -->
            <div class="auth-form-center-block">
              <h1 [id]="step() === 1 ? 'reg-step1-heading' : 'reg-step2-heading'" class="auth-form-title">
                {{ step() === 1 ? 'Register' : 'Career Goals' }}
              </h1>

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

                <form (ngSubmit)="next()" #f="ngForm" novalidate>
                  @if (step() === 1) {
                    <!-- Full Name Field -->
                    <div class="auth-field">
                      <label for="reg-name" class="auth-field-label">Full Name</label>
                      <div class="auth-input-wrap">
                        <input
                          id="reg-name"
                          name="name"
                          type="text"
                          class="auth-pill-input"
                          [ngModel]="name()"
                          (ngModelChange)="name.set($event)"
                          (input)="onFieldInput('name', $event)"
                          (change)="onFieldInput('name', $event)"
                          required
                          minlength="2"
                          autocomplete="name"
                          placeholder="Alex Chen"
                        />
                      </div>
                    </div>

                    <!-- Email Field -->
                    <div class="auth-field">
                      <label for="reg-email" class="auth-field-label">Email</label>
                      <div class="auth-input-wrap">
                        <input
                          id="reg-email"
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
                    <div class="auth-field" style="margin-bottom: 20px;">
                      <label for="reg-password" class="auth-field-label">Password (min 6 characters)</label>
                      <div class="auth-input-wrap">
                        <input
                          id="reg-password"
                          name="password"
                          [type]="showPassword() ? 'text' : 'password'"
                          class="auth-pill-input has-eye"
                          [ngModel]="password()"
                          (ngModelChange)="password.set($event)"
                          (input)="onFieldInput('password', $event)"
                          (change)="onFieldInput('password', $event)"
                          required
                          minlength="6"
                          autocomplete="new-password"
                          placeholder="Create a strong password"
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

                    <!-- Continue Button: enables when name >= 2, email valid, password >= 6 -->
                    <button
                      type="submit"
                      class="auth-btn-primary"
                      [disabled]="!isStep1Valid()"
                    >
                      Continue to Career Goal →
                    </button>

                    @if (!isStep1Valid()) {
                      <p class="auth-helper-note">Fill in all fields to continue</p>
                    }

                    <!-- Switch to Login -->
                    <p class="auth-switch-text">
                      Already have an account?<br />
                      <a routerLink="/login">Sign in</a>
                    </p>
                  } @else {
                    <!-- Step 2: Career Goal Parameters -->
                    <!-- Target Role Domain -->
                    <div class="auth-field">
                      <label for="reg-role" class="auth-field-label">Target Role Domain</label>
                      <select
                        id="reg-role"
                        name="role"
                        class="auth-pill-select"
                        [(ngModel)]="roleId"
                        (ngModelChange)="onRole()"
                      >
                        @for (r of roles; track r.id) {
                          <option [value]="r.id">{{ r.icon }} {{ r.name }}</option>
                        }
                      </select>
                    </div>

                    <!-- Target Position Title -->
                    <div class="auth-field">
                      <label for="reg-pos" class="auth-field-label">Target Position Title</label>
                      <input
                        id="reg-pos"
                        name="pos"
                        type="text"
                        class="auth-pill-input"
                        [(ngModel)]="position"
                        placeholder="e.g. Frontend Engineer"
                      />
                    </div>

                    <!-- Target Company (Optional) -->
                    <div class="auth-field">
                      <label for="reg-co" class="auth-field-label">Target Company (Optional)</label>
                      <input
                        id="reg-co"
                        name="co"
                        type="text"
                        list="companies"
                        class="auth-pill-input"
                        [(ngModel)]="company"
                        placeholder="e.g. Stripe, Google, or startup"
                      />
                      <datalist id="companies">
                        @for (c of companies; track c) {
                          <option [value]="c"></option>
                        }
                      </datalist>
                    </div>

                    <!-- Timeline & Baseline Row -->
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                      <div class="auth-field">
                        <label for="reg-tl" class="auth-field-label">Timeline</label>
                        <select
                          id="reg-tl"
                          name="tl"
                          class="auth-pill-select"
                          [(ngModel)]="timeline"
                        >
                          @for (t of timelines; track t) {
                            <option [ngValue]="t">{{ t }} months</option>
                          }
                        </select>
                      </div>

                      <div class="auth-field">
                        <label for="reg-lvl" class="auth-field-label">Baseline Level</label>
                        <select
                          id="reg-lvl"
                          name="levelSelect"
                          class="auth-pill-select"
                          [(ngModel)]="level"
                        >
                          @for (l of levels; track l) {
                            <option [value]="l">{{ l }}</option>
                          }
                        </select>
                      </div>
                    </div>

                    <!-- Weekly Hours Slider -->
                    <div class="auth-field" style="margin-bottom: 16px;">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                        <label for="reg-wh" class="auth-field-label" style="margin-bottom:0;">Weekly Study Time</label>
                        <strong style="color:var(--auth-peach); font-size:13px; font-variant-numeric:tabular-nums;">
                          {{ hours }} hrs/week
                        </strong>
                      </div>
                      <input
                        id="reg-wh"
                        name="wh"
                        type="range"
                        min="2"
                        max="60"
                        class="auth-range-slider"
                        [(ngModel)]="hours"
                      />
                    </div>

                    <!-- Buttons Row -->
                    <div style="display:flex; gap:10px; margin-top:6px;">
                      <button
                        type="button"
                        class="auth-btn-secondary"
                        (click)="step.set(1)"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        class="auth-btn-primary"
                        style="flex:1;"
                        [disabled]="busy()"
                      >
                        {{ busy() ? 'Initializing…' : 'Start Roadmap' }}
                      </button>
                    </div>
                  }
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
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  roles = ROLES;
  timelines = TIMELINES;
  levels = LEVELS;
  companies = COMPANY_SUGGESTIONS;

  step = signal(1);
  error = signal('');
  infoMessage = signal('');
  busy = signal(false);
  showPassword = signal(false);

  name = signal('');
  email = signal('');
  password = signal('');

  roleId = 'fullstack';
  position = 'Full-Stack Web Developer';
  company = '';
  timeline = 12;
  level: Level = 'Beginner';
  hours = 10;

  isStep1Valid = computed(() => {
    const n = (this.name() || '').trim();
    const e = (this.email() || '').trim();
    const p = this.password() || '';
    const nameOk = n.length >= 2;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const emailOk = emailRegex.test(e);
    const passOk = p.length >= 6;
    return nameOk && emailOk && passOk;
  });

  onFieldInput(field: 'name' | 'email' | 'password', ev: Event) {
    const val = (ev.target as HTMLInputElement)?.value ?? '';
    if (field === 'name') this.name.set(val);
    else if (field === 'email') this.email.set(val);
    else if (field === 'password') this.password.set(val);
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onRole() {
    const matched = this.roles.find(r => r.id === this.roleId);
    if (matched) {
      this.position = matched.name;
    }
  }

  async next() {
    this.error.set('');
    this.infoMessage.set('');

    if (this.step() === 1) {
      const n = (this.name() || '').trim();
      const e = (this.email() || '').trim();
      const p = this.password() || '';

      if (n.length < 2) {
        this.error.set('Please enter your full name (at least 2 characters).');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      if (!emailRegex.test(e)) {
        this.error.set('Please enter a valid email address.');
        return;
      }
      if (p.length < 6) {
        this.error.set('Password must be at least 6 characters.');
        return;
      }

      this.step.set(2);
      return;
    }

    this.busy.set(true);
    const result = await this.auth.register(this.name(), this.email(), this.password(), {
      roleId: this.roleId,
      position: this.position,
      company: this.company.trim(),
      timelineMonths: +this.timeline,
      level: this.level,
      weeklyHours: +this.hours,
    });
    this.busy.set(false);

    if (result.error) {
      this.error.set(result.error);
      return;
    }

    if (result.confirmEmail) {
      this.infoMessage.set(`Account created! Check your email (${result.email || this.email()}) to confirm your account.`);
      this.step.set(1);
      return;
    }

    this.router.navigateByUrl('/app/dashboard');
  }
}
