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
        <div class="links">
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
      </div>
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
    @media (max-width: 900px) {
      .links a:not(.btn) {
        display: none;
      }
      .links {
        gap: 12px;
      }
    }
  `]
})
export class LandingNavComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  private ngZone = inject(NgZone);

  isScrolled = signal(false);
  private rafId?: number;

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
