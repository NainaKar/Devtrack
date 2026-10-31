import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer-root" role="contentinfo">
      <div class="w">
        <div class="footer-grid">
          <!-- Column 1: Brand -->
          <div class="footer-col brand-col" appReveal revealDelay="0s">
            <a class="brand-logo" routerLink="/" aria-label="DevTrack Home">
              <span class="logo-tile">D</span>
              <span class="brand-name">DevTrack</span>
            </a>
            <p class="brand-tagline">Master your skills. Land your target role.</p>
            @if (auth.isLoggedIn()) {
              <a class="btn primary-btn" routerLink="/app/dashboard">Open Workspace →</a>
            } @else {
              <a class="btn primary-btn" routerLink="/register">Create free account</a>
            }
          </div>

          <!-- Column 2: Product -->
          <div class="footer-col" appReveal revealDelay="0.08s">
            <h3 class="col-heading">Product</h3>
            <nav class="footer-col-nav" aria-label="Product navigation">
              <a
                [routerLink]="['/']"
                [fragment]="'features'"
                (click)="scrollToSection($event, 'features')"
              >
                Features
              </a>
              <a
                [routerLink]="['/']"
                [fragment]="'how'"
                (click)="scrollToSection($event, 'how')"
              >
                How it works
              </a>
              <a
                [routerLink]="['/']"
                [fragment]="'demo'"
                (click)="scrollToSection($event, 'demo')"
              >
                Product tour
              </a>
              <a
                [routerLink]="['/']"
                [fragment]="'roles'"
                (click)="scrollToSection($event, 'roles')"
              >
                Roles
              </a>
            </nav>
          </div>

          <!-- Column 3: Company -->
          <div class="footer-col" appReveal revealDelay="0.16s">
            <h3 class="col-heading">Company</h3>
            <nav class="footer-col-nav" aria-label="Company navigation">
              <a routerLink="/about">About &amp; Methodology</a>
              <a routerLink="/login">Log in</a>
              <a routerLink="/register">Create account</a>
            </nav>
          </div>

          <!-- Column 4: Support -->
          <div class="footer-col" appReveal revealDelay="0.24s">
            <h3 class="col-heading">Support</h3>
            <nav class="footer-col-nav" aria-label="Support navigation">
              <a href="mailto:support@devtrack.app">support&#64;devtrack.app</a>
              <span class="footer-link-text">Terms and Services</span>
            </nav>
          </div>
        </div>

        <!-- Big "DevTrack" Wordmark in the Middle -->
        <div class="footer-wordmark-row" appReveal revealDelay="0.25s">
          <div class="middle-wordmark" aria-hidden="true">DevTrack</div>
        </div>

        <!-- Bottom Bar -->
        <div class="bottom-bar" appReveal revealDelay="0.32s">
          <span class="copyright">© {{ currentYear }} DevTrack</span>
          <span class="ship-note">Built for developers who ship.</span>
          <button
            type="button"
            class="back-to-top-btn"
            (click)="scrollToTop()"
            aria-label="Back to top"
            title="Back to top"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .footer-root {
      position: relative;
      background: linear-gradient(180deg, #264a3a 0%, #1a3428 100%);
      border-top: 3px solid #ecd3b8;
      border-radius: 40px 40px 0 0;
      overflow: hidden;
      color: #f6eddc;
      box-sizing: border-box;
    }

    .w {
      position: relative;
      z-index: 1;
      max-width: 1180px;
      margin: 0 auto;
      padding: 72px 24px 32px;
      box-sizing: border-box;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr 1fr;
      gap: 48px;
      margin-bottom: 24px;
    }

    .footer-col {
      display: flex;
      flex-direction: column;
    }

    .brand-logo {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #f6eddc;
      margin-bottom: 12px;
      width: fit-content;
    }

    .logo-tile {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: #b4561f;
      color: #f6eddc;
      display: grid;
      place-items: center;
      font-family: var(--fd, 'Fraunces', Georgia, serif);
      font-size: 18px;
      font-weight: 700;
      font-style: normal;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .25);
    }

    .brand-name {
      font-family: var(--fh, 'Ghilbe', 'Gloock', Georgia, serif);
      font-size: 23px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #f6eddc;
    }

    .brand-tagline {
      color: rgba(246, 237, 220, .7);
      font-size: 14.5px;
      line-height: 1.55;
      margin: 0 0 20px;
      max-width: 280px;
    }

    .primary-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      background: #b4561f !important;
      color: #f6eddc !important;
      font-weight: 600;
      font-size: 14px;
      border-radius: 8px;
      text-decoration: none !important;
      min-height: 44px;
      width: fit-content;
      border: 1px solid rgba(246, 237, 220, .25) !important;
      cursor: pointer;
      transition: transform .15s ease, background .15s ease, box-shadow .15s ease, border-color .15s ease;
    }

    .primary-btn:hover {
      background: #c76123 !important;
      color: #ffffff !important;
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, .28);
      border-color: rgba(246, 237, 220, .4) !important;
    }

    .col-heading {
      font-family: var(--fb, 'Instrument Sans', sans-serif);
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #ecd3b8;
      margin: 0 0 16px;
    }

    .footer-col-nav {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .footer-col-nav a,
    .footer-col-nav .footer-link-text {
      position: relative;
      display: inline-flex;
      align-items: center;
      color: #ecd3b8;
      text-decoration: none;
      font-size: 15px;
      padding: 6px 0;
      min-height: 44px;
      width: fit-content;
      transition: color .2s ease, transform .2s ease;
    }

    .footer-col-nav a::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 8px;
      width: 100%;
      height: 1.5px;
      background: #b4561f;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform .25s ease;
    }

    .footer-col-nav a:hover {
      color: #ffffff;
      transform: translateX(3px);
    }

    .footer-col-nav a:hover::after {
      transform: scaleX(1);
    }

    .footer-col-nav .footer-link-text {
      color: rgba(246, 237, 220, .85);
      cursor: default;
    }

    a:focus-visible,
    button:focus-visible {
      outline: 2px solid #ecd3b8;
      outline-offset: 3px;
    }

    /* Big "DevTrack" Wordmark in the Middle */
    .footer-wordmark-row {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin: 24px 0;
      overflow: hidden;
    }

    .middle-wordmark {
      font-family: var(--fh, 'Ghilbe', 'Gloock', Georgia, serif);
      font-size: clamp(64px, 16vw, 220px);
      line-height: 1;
      letter-spacing: -0.02em;
      text-align: center;
      color: rgba(246, 237, 220, .09);
      user-select: none;
      pointer-events: none;
      white-space: nowrap;
      transition: color .3s ease;
    }

    .footer-root:hover .middle-wordmark {
      color: rgba(246, 237, 220, .14);
    }

    /* Bottom Bar */
    .bottom-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      padding-top: 24px;
      border-top: 1px solid rgba(246, 237, 220, .18);
      font-size: 14px;
      color: rgba(246, 237, 220, .7);
    }

    .ship-note {
      font-style: italic;
    }

    .back-to-top-btn {
      width: 44px;
      height: 44px;
      min-width: 44px;
      min-height: 44px;
      border-radius: 50%;
      background: #1e3d30;
      border: 1px solid #f6eddc;
      color: #f6eddc;
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: transform .2s ease, background .2s ease, border-color .2s ease, color .2s ease;
    }

    .back-to-top-btn:hover {
      transform: translateY(-3px);
      background: #34634e;
      border-color: #ffffff;
      color: #ffffff;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 36px;
        margin-bottom: 24px;
      }
    }

    @media (max-width: 560px) {
      .w {
        padding: 56px 16px 24px;
      }
      .footer-grid {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 32px;
      }
      .brand-col {
        align-items: center;
      }
      .brand-tagline {
        margin-left: auto;
        margin-right: auto;
      }
      .footer-col-nav {
        align-items: center;
      }
      .footer-col-nav a {
        justify-content: center;
      }
      .footer-col-nav a::after {
        left: 50%;
        transform: translateX(-50%) scaleX(0);
        transform-origin: center;
      }
      .footer-col-nav a:hover {
        transform: none;
      }
      .footer-col-nav a:hover::after {
        transform: translateX(-50%) scaleX(1);
      }
      .footer-wordmark-row {
        margin: 16px 0 20px;
      }
      .middle-wordmark {
        font-size: clamp(48px, 18vw, 96px);
      }
      .bottom-bar {
        flex-direction: column;
        gap: 14px;
        text-align: center;
        align-items: center;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
      .footer-col-nav a:hover {
        transform: none !important;
      }
      .back-to-top-btn:hover {
        transform: none !important;
      }
      .footer-wordmark-row {
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `]
})
export class LandingFooterComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  currentYear = new Date().getFullYear();

  scrollToSection(e: Event, fragment: string): void {
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      e.preventDefault();
      const el = document.getElementById(fragment);
      if (el) {
        const prefersReducedMotion = typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
        try {
          history.pushState(null, '', '#' + fragment);
        } catch {}
      }
    } else {
      this.router.navigate(['/'], { fragment });
    }
  }

  scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
