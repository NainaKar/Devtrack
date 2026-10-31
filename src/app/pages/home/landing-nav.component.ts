import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  OnDestroy,
  NgZone
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing-nav',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [class.sc]="isScrolled()">
      <div class="w">
        <a class="logo" routerLink="/">
          <i>D</i>
          <span>DevTrack</span>
        </a>

        <!-- Desktop Navigation Links -->
        <div class="links desktop-only">
          <a routerLink="/about">About & Methodology</a>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#roles">Roles</a>
          @if (auth.isLoggedIn()) {
            <a class="btn s" routerLink="/app/dashboard">Open Workspace →</a>
          } @else {
            <a class="btn o s" routerLink="/login">Sign in</a>
            <a class="btn s" routerLink="/register">Get started free</a>
          }
        </div>

        <!-- Mobile Controls (<= 768px) -->
        <div class="mobile-nav-bar">
          @if (auth.isLoggedIn()) {
            <a class="btn s mobile-main-btn" routerLink="/app/dashboard">Open Workspace →</a>
          } @else {
            <a class="btn s mobile-main-btn" routerLink="/register">Get started free</a>
          }

          <button
            type="button"
            class="hamburger-btn"
            [class.active]="mobileOpen()"
            (click)="toggleMobile()"
            [attr.aria-expanded]="mobileOpen()"
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Slide-In Drawer -->
      @if (mobileOpen()) {
        <div class="mobile-backdrop" (click)="closeMobile()" aria-hidden="true"></div>
        <div class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div class="mobile-drawer-header">
            <span class="mobile-drawer-title">Navigation</span>
            <button
              type="button"
              class="mobile-close-btn"
              (click)="closeMobile()"
              aria-label="Close navigation menu"
            >
              ✕
            </button>
          </div>
          <div class="mobile-drawer-links">
            <a href="#features" (click)="closeMobile()">Features</a>
            <a href="#how" (click)="closeMobile()">How it works</a>
            <a href="#roles" (click)="closeMobile()">Roles</a>
            <a routerLink="/about" (click)="closeMobile()">About & Methodology</a>

            <div class="mobile-divider"></div>

            @if (auth.isLoggedIn()) {
              <a class="btn" routerLink="/app/dashboard" (click)="closeMobile()">Open Workspace →</a>
            } @else {
              <a class="btn o" routerLink="/login" (click)="closeMobile()">Sign in</a>
              <a class="btn" routerLink="/register" (click)="closeMobile()">Get started free</a>
            }
          </div>
        </div>
      }
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    nav {
      background: color-mix(in srgb, var(--bg, #f4ecdc) 88%, transparent);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--ln, #e0d1b8);
      transition: box-shadow .3s;
    }
    nav.sc {
      box-shadow: 0 6px 24px rgba(63, 31, 18, .1);
    }
    .w {
      max-width: 1180px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 68px;
    }
    .logo {
      display: flex;
      gap: 10px;
      align-items: center;
      font-family: var(--fd, 'Fraunces', Georgia, serif);
      font-weight: 700;
      font-size: 21px;
      color: var(--ink, #2e1a10);
      text-decoration: none;
    }
    .logo i {
      width: 32px;
      height: 32px;
      border-radius: calc(var(--r, 20px) / 2.5);
      background: var(--ac, #b4561f);
      color: var(--on, #f6eddc);
      display: grid;
      place-items: center;
      font-family: var(--fd, 'Fraunces', Georgia, serif);
      font-size: 17px;
      font-weight: 700;
      font-style: normal;
    }
    .links {
      display: flex;
      gap: 24px;
      align-items: center;
      font-size: 15px;
      color: var(--mu, #7a5a47);
    }
    .links a {
      color: inherit;
      text-decoration: none;
      transition: color .2s;
    }
    .links a:hover {
      color: var(--ink, #2e1a10);
    }
    .btn {
      display: inline-block;
      padding: 13px 24px;
      border-radius: calc(var(--r, 20px) * .6);
      background: var(--ac, #b4561f) !important;
      color: var(--on, #f6eddc) !important;
      font-weight: 600;
      font-size: 16px;
      border: 0;
      cursor: pointer;
      text-decoration: none !important;
      transition: transform .15s;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
    }
    .btn:visited,
    .btn:hover,
    .btn:focus,
    .btn:active {
      color: var(--on, #f6eddc) !important;
      background: var(--ac, #b4561f) !important;
      text-decoration: none !important;
    }
    .btn::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, .4) 50%, transparent 70%);
      transform: translateX(-130%);
    }
    .btn:hover::after {
      transition: transform .7s;
      transform: translateX(130%);
    }
    .btn:hover {
      transform: translateY(-2px);
    }
    .btn.o {
      background: transparent !important;
      color: var(--ink, #2e1a10) !important;
      border: 1.5px solid var(--ink, #2e1a10) !important;
    }
    .btn.o:visited,
    .btn.o:hover,
    .btn.o:focus,
    .btn.o:active {
      background: transparent !important;
      color: var(--ink, #2e1a10) !important;
      text-decoration: none !important;
    }
    .btn.s {
      padding: 9px 18px;
      font-size: 14px;
    }

    .mobile-nav-bar {
      display: none;
    }

    .hamburger-btn {
      display: none;
      width: 44px;
      height: 44px;
      padding: 10px 8px;
      background: transparent;
      border: 1px solid var(--ln, #e0d1b8);
      border-radius: calc(var(--r, 20px) * .4);
      cursor: pointer;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      transition: background .2s, border-color .2s;
    }

    .hamburger-btn span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--ink, #2e1a10);
      border-radius: 2px;
      transition: transform .25s ease, opacity .25s ease;
    }

    .hamburger-btn.active span:nth-child(1) {
      transform: translateY(6px) rotate(45deg);
    }
    .hamburger-btn.active span:nth-child(2) {
      opacity: 0;
    }
    .hamburger-btn.active span:nth-child(3) {
      transform: translateY(-6px) rotate(-45deg);
    }

    .mobile-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(46, 26, 16, .45);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      z-index: 55;
      animation: fadeIn .2s ease;
    }

    .mobile-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: min(320px, 85vw);
      background: var(--sf, #fbf6ea);
      border-left: 1px solid var(--ln, #e0d1b8);
      box-shadow: -10px 0 35px rgba(63, 31, 18, .2);
      z-index: 60;
      display: flex;
      flex-direction: column;
      padding: 20px;
      animation: slideIn .25s cubic-bezier(.2, .8, .2, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    .mobile-drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--ln, #e0d1b8);
    }

    .mobile-drawer-title {
      font-family: var(--fd, 'Fraunces', Georgia, serif);
      font-weight: 700;
      font-size: 18px;
      color: var(--ink, #2e1a10);
    }

    .mobile-close-btn {
      width: 44px;
      height: 44px;
      border: 0;
      background: rgba(46, 26, 16, .08);
      border-radius: 50%;
      font-size: 16px;
      color: var(--ink, #2e1a10);
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: background .2s;
    }

    .mobile-close-btn:hover {
      background: rgba(46, 26, 16, .15);
    }

    .mobile-drawer-links {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 18px;
      overflow-y: auto;
    }

    .mobile-drawer-links a {
      color: var(--ink, #2e1a10);
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      padding: 12px 14px;
      border-radius: calc(var(--r, 20px) * .5);
      min-height: 44px;
      display: flex;
      align-items: center;
      transition: background .15s, color .15s;
    }

    .mobile-drawer-links a:not(.btn):hover {
      background: var(--bg, #f4ecdc);
      color: var(--ac, #b4561f);
    }

    .mobile-divider {
      height: 1px;
      background: var(--ln, #e0d1b8);
      margin: 12px 0;
    }

    .mobile-drawer-links .btn {
      text-align: center;
      justify-content: center;
      margin-top: 4px;
      width: 100%;
    }

    @media (max-width: 768px) {
      .desktop-only {
        display: none !important;
      }
      .mobile-nav-bar {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .hamburger-btn {
        display: flex;
      }
      .w {
        padding: 0 16px;
      }
      .mobile-main-btn {
        padding: 8px 14px;
        font-size: 13px;
        min-height: 40px;
        display: inline-flex;
        align-items: center;
      }
    }
  `]
})
export class LandingNavComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  private ngZone = inject(NgZone);

  isScrolled = signal(false);
  mobileOpen = signal(false);
  private rafId?: number;

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      const onScroll = () => {
        if (!this.rafId) {
          this.rafId = requestAnimationFrame(() => {
            this.rafId = undefined;
            const scrolled = window.scrollY > 10;
            if (this.isScrolled() !== scrolled) {
              this.isScrolled.set(scrolled);
            }
          });
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
