import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  OnDestroy,
  NgZone,
  HostListener,
  ElementRef
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ROLES } from '../../data/roles.data';

interface FeatureDropdownItem {
  icon: string;
  title: string;
  desc: string;
}

interface StepDropdownItem {
  num: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-landing-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [class.sc]="isScrolled()">
      <div class="w">
        <a class="logo" routerLink="/">
          <i>D</i>
          <span>DevTrack</span>
        </a>

        <!-- Desktop Navigation Links -->
        <div class="links desktop-only" role="menubar">
          <a
            routerLink="/about"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link"
          >
            About &amp; Methodology
          </a>

          <!-- Features Dropdown Wrapper -->
          <div
            class="nav-dropdown-wrapper"
            (mouseenter)="onDropdownMouseEnter('features')"
            (mouseleave)="onDropdownMouseLeave()"
            (focusin)="onDropdownFocusIn('features')"
            (focusout)="onDropdownFocusOut($event)"
          >
            <a
              [routerLink]="['/']"
              [fragment]="'features'"
              (click)="scrollToSection($event, 'features')"
              class="nav-link"
              [class.active]="activeSection() === 'features'"
              [attr.aria-expanded]="openDropdown() === 'features'"
              aria-haspopup="true"
              id="nav-trigger-features"
              (keydown)="onTriggerKeydown($event, 'features')"
            >
              <span>Features</span>
              <svg
                class="chevron"
                [class.rotated]="openDropdown() === 'features'"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </a>

            @if (openDropdown() === 'features') {
              <div
                class="nav-dropdown-panel features-panel"
                role="menu"
                aria-labelledby="nav-trigger-features"
                (keydown)="onMenuKeydown($event, 'features')"
              >
                <div class="dropdown-items-list">
                  @for (feat of features; track feat.title; let idx = $index) {
                    <a
                      [routerLink]="['/']"
                      [fragment]="'features'"
                      (click)="scrollToSection($event, 'features')"
                      class="dropdown-menu-item"
                      role="menuitem"
                      tabindex="0"
                      (keydown)="onMenuItemKeydown($event, 'features', idx)"
                    >
                      <div class="dropdown-icon-badge" aria-hidden="true">{{ feat.icon }}</div>
                      <div class="dropdown-item-body">
                        <div class="dropdown-item-title">{{ feat.title }}</div>
                        <div class="dropdown-item-desc">{{ feat.desc }}</div>
                      </div>
                    </a>
                  }
                </div>
              </div>
            }
          </div>

          <!-- How It Works Dropdown Wrapper -->
          <div
            class="nav-dropdown-wrapper"
            (mouseenter)="onDropdownMouseEnter('how')"
            (mouseleave)="onDropdownMouseLeave()"
            (focusin)="onDropdownFocusIn('how')"
            (focusout)="onDropdownFocusOut($event)"
          >
            <a
              [routerLink]="['/']"
              [fragment]="'how'"
              (click)="scrollToSection($event, 'how')"
              class="nav-link"
              [class.active]="activeSection() === 'how'"
              [attr.aria-expanded]="openDropdown() === 'how'"
              aria-haspopup="true"
              id="nav-trigger-how"
              (keydown)="onTriggerKeydown($event, 'how')"
            >
              <span>How it works</span>
              <svg
                class="chevron"
                [class.rotated]="openDropdown() === 'how'"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </a>

            @if (openDropdown() === 'how') {
              <div
                class="nav-dropdown-panel how-panel"
                role="menu"
                aria-labelledby="nav-trigger-how"
                (keydown)="onMenuKeydown($event, 'how')"
              >
                <div class="dropdown-items-list">
                  @for (step of steps; track step.title; let idx = $index) {
                    <a
                      [routerLink]="['/']"
                      [fragment]="'how'"
                      (click)="scrollToSection($event, 'how')"
                      class="dropdown-menu-item"
                      role="menuitem"
                      tabindex="0"
                      (keydown)="onMenuItemKeydown($event, 'how', idx)"
                    >
                      <div class="dropdown-num-badge" aria-hidden="true">{{ step.num }}</div>
                      <div class="dropdown-item-body">
                        <div class="dropdown-item-title">{{ step.title }}</div>
                        <div class="dropdown-item-desc">{{ step.desc }}</div>
                      </div>
                    </a>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Roles Dropdown Wrapper -->
          <div
            class="nav-dropdown-wrapper"
            (mouseenter)="onDropdownMouseEnter('roles')"
            (mouseleave)="onDropdownMouseLeave()"
            (focusin)="onDropdownFocusIn('roles')"
            (focusout)="onDropdownFocusOut($event)"
          >
            <a
              [routerLink]="['/']"
              [fragment]="'roles'"
              (click)="scrollToSection($event, 'roles')"
              class="nav-link"
              [class.active]="activeSection() === 'roles'"
              [attr.aria-expanded]="openDropdown() === 'roles'"
              aria-haspopup="true"
              id="nav-trigger-roles"
              (keydown)="onTriggerKeydown($event, 'roles')"
            >
              <span>Roles</span>
              <svg
                class="chevron"
                [class.rotated]="openDropdown() === 'roles'"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </a>

            @if (openDropdown() === 'roles') {
              <div
                class="nav-dropdown-panel roles-panel"
                role="menu"
                aria-labelledby="nav-trigger-roles"
                (keydown)="onMenuKeydown($event, 'roles')"
              >
                <div class="dropdown-roles-grid">
                  @for (role of roles; track role; let idx = $index) {
                    <button
                      type="button"
                      (click)="scrollToSection($event, 'roles')"
                      class="dropdown-role-pill"
                      role="menuitem"
                      tabindex="0"
                      (keydown)="onMenuItemKeydown($event, 'roles', idx)"
                    >
                      {{ role }}
                    </button>
                  }
                </div>
                <div class="dropdown-panel-footer">
                  <a
                    [routerLink]="['/']"
                    [fragment]="'roles'"
                    (click)="scrollToSection($event, 'roles')"
                  >
                    <span>Built for in-demand engineering roles</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            }
          </div>

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
            <!-- Features mobile item -->
            <div class="mobile-nav-group">
              <div class="mobile-nav-row">
                <a
                  [routerLink]="['/']"
                  [fragment]="'features'"
                  (click)="scrollToSection($event, 'features')"
                  class="mobile-link"
                >
                  Features
                </a>
                <button
                  type="button"
                  class="mobile-toggle-btn"
                  (click)="toggleMobileAccordion('features')"
                  [attr.aria-expanded]="mobileAccordion() === 'features'"
                  aria-label="Toggle features submenu"
                >
                  <svg
                    class="chevron"
                    [class.rotated]="mobileAccordion() === 'features'"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              @if (mobileAccordion() === 'features') {
                <div class="mobile-subitems">
                  @for (feat of features; track feat.title) {
                    <a
                      [routerLink]="['/']"
                      [fragment]="'features'"
                      (click)="scrollToSection($event, 'features')"
                      class="mobile-subitem"
                    >
                      <span class="mobile-sub-icon">{{ feat.icon }}</span>
                      <span class="mobile-sub-title">{{ feat.title }}</span>
                    </a>
                  }
                </div>
              }
            </div>

            <!-- How it works mobile item -->
            <div class="mobile-nav-group">
              <div class="mobile-nav-row">
                <a
                  [routerLink]="['/']"
                  [fragment]="'how'"
                  (click)="scrollToSection($event, 'how')"
                  class="mobile-link"
                >
                  How it works
                </a>
                <button
                  type="button"
                  class="mobile-toggle-btn"
                  (click)="toggleMobileAccordion('how')"
                  [attr.aria-expanded]="mobileAccordion() === 'how'"
                  aria-label="Toggle how it works submenu"
                >
                  <svg
                    class="chevron"
                    [class.rotated]="mobileAccordion() === 'how'"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              @if (mobileAccordion() === 'how') {
                <div class="mobile-subitems">
                  @for (step of steps; track step.title) {
                    <a
                      [routerLink]="['/']"
                      [fragment]="'how'"
                      (click)="scrollToSection($event, 'how')"
                      class="mobile-subitem"
                    >
                      <span class="mobile-sub-badge">{{ step.num }}</span>
                      <span class="mobile-sub-title">{{ step.title }}</span>
                    </a>
                  }
                </div>
              }
            </div>

            <!-- Roles mobile item -->
            <div class="mobile-nav-group">
              <div class="mobile-nav-row">
                <a
                  [routerLink]="['/']"
                  [fragment]="'roles'"
                  (click)="scrollToSection($event, 'roles')"
                  class="mobile-link"
                >
                  Roles
                </a>
                <button
                  type="button"
                  class="mobile-toggle-btn"
                  (click)="toggleMobileAccordion('roles')"
                  [attr.aria-expanded]="mobileAccordion() === 'roles'"
                  aria-label="Toggle roles submenu"
                >
                  <svg
                    class="chevron"
                    [class.rotated]="mobileAccordion() === 'roles'"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              @if (mobileAccordion() === 'roles') {
                <div class="mobile-subitems roles-pills-wrap">
                  @for (role of roles; track role) {
                    <button
                      type="button"
                      (click)="scrollToSection($event, 'roles')"
                      class="dropdown-role-pill"
                    >
                      {{ role }}
                    </button>
                  }
                </div>
              }
            </div>

            <!-- About & Methodology -->
            <a routerLink="/about" (click)="closeMobile()" class="mobile-link">About &amp; Methodology</a>

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
      gap: 20px;
      align-items: center;
      font-size: 15px;
    }
    .nav-link {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--ink, #2e1a10);
      font-weight: 500;
      text-decoration: none;
      padding: 8px 2px;
      background: transparent;
      border: 0;
      cursor: pointer;
      font-size: 15px;
      font-family: inherit;
      transition: color .2s ease;
    }
    .nav-link:hover {
      color: var(--ink, #2e1a10);
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2.5px;
      background: var(--ac, #b4561f);
      transform: scaleX(0);
      transform-origin: center;
      transition: transform .25s cubic-bezier(0.2, 0.8, 0.2, 1);
      border-radius: 2px;
    }
    .nav-link.active::after,
    .nav-link.router-link-active::after,
    .nav-link[aria-expanded="true"]::after {
      transform: scaleX(1);
    }
    .nav-link:hover::after {
      transform: scaleX(1);
    }
    .chevron {
      transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
      display: inline-block;
      vertical-align: middle;
      opacity: 0.7;
    }
    .chevron.rotated {
      transform: rotate(180deg);
      opacity: 1;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: calc(var(--r, 20px) * .6);
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid var(--ac, #b4561f);
      background: var(--ac, #b4561f);
      color: var(--on, #f6eddc);
      transition: transform .15s, box-shadow .15s, background .15s;
    }
    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(180, 86, 31, .3);
    }
    .btn.o {
      background: transparent;
      color: var(--ink, #2e1a10);
      border-color: var(--ln, #e0d1b8);
    }
    .btn.o:hover {
      border-color: var(--ink, #2e1a10);
      background: rgba(46, 26, 16, .04);
      box-shadow: none;
    }
    .btn.s {
      padding: 8px 14px;
      font-size: 13.5px;
    }

    /* Mobile Controls */
    .mobile-nav-bar {
      display: none;
    }
    .hamburger-btn {
      display: none;
      width: 44px;
      height: 44px;
      border: 0;
      background: rgba(46, 26, 16, .05);
      border-radius: 10px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      padding: 0;
      transition: background .2s;
    }
    .hamburger-btn:hover {
      background: rgba(46, 26, 16, .1);
    }
    .hamburger-btn span {
      display: block;
      width: 20px;
      height: 2px;
      background: var(--ink, #2e1a10);
      border-radius: 2px;
      transition: transform .25s, opacity .25s;
    }
    .hamburger-btn.active span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    .hamburger-btn.active span:nth-child(2) {
      opacity: 0;
    }
    .hamburger-btn.active span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    /* Mobile Drawer */
    .mobile-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(46, 26, 16, .45);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 99;
      animation: fadeIn .2s forwards;
    }
    .mobile-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: min(85vw, 360px);
      background: var(--sf, #fbf6ea);
      z-index: 100;
      box-shadow: -8px 0 28px rgba(46, 26, 16, .2);
      display: flex;
      flex-direction: column;
      padding: 20px;
      animation: slideIn .25s cubic-bezier(.2, .8, .2, 1) forwards;
      overflow-y: auto;
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
    }
    .mobile-nav-group {
      display: flex;
      flex-direction: column;
    }
    .mobile-nav-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .mobile-nav-row .mobile-link {
      flex: 1;
    }
    .mobile-link {
      color: var(--ink, #2e1a10);
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      padding: 10px 14px;
      border-radius: calc(var(--r, 20px) * .5);
      min-height: 44px;
      display: flex;
      align-items: center;
      transition: background .15s, color .15s;
    }
    .mobile-link:hover {
      background: var(--bg, #f4ecdc);
      color: var(--ac, #b4561f);
    }
    .mobile-toggle-btn {
      width: 44px;
      height: 44px;
      border: 0;
      background: transparent;
      border-radius: 8px;
      display: grid;
      place-items: center;
      color: var(--ink, #2e1a10);
      cursor: pointer;
    }
    .mobile-toggle-btn:hover {
      background: rgba(46, 26, 16, .06);
    }
    .mobile-subitems {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 4px 0 8px 12px;
    }
    .mobile-subitem {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      font-size: 13.5px;
      color: var(--mu, #7a5a47);
      text-decoration: none;
      border-radius: 8px;
      min-height: 40px;
      transition: background .15s, color .15s;
    }
    .mobile-subitem:hover {
      background: rgba(180, 86, 31, .08);
      color: var(--ink, #2e1a10);
    }
    .mobile-sub-icon {
      font-size: 16px;
    }
    .mobile-sub-badge {
      font-size: 11px;
      font-weight: 700;
      color: var(--ac, #b4561f);
      background: rgba(180, 86, 31, .12);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: var(--fd, Georgia, serif);
    }
    .roles-pills-wrap {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 6px;
      padding-left: 8px;
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isScrolled = signal(false);
  mobileOpen = signal(false);
  mobileAccordion = signal<'features' | 'how' | 'roles' | null>(null);
  openDropdown = signal<'features' | 'how' | 'roles' | null>(null);
  activeSection = signal<string>('');

  private rafId?: number;
  private closeTimeout?: any;
  private observer?: IntersectionObserver;
  private routerSub?: Subscription;

  readonly features: FeatureDropdownItem[] = [
    {
      icon: '📈',
      title: 'Fine-Grained Skill Tracking',
      desc: 'Check off concepts and watch your completion and role thresholds update live.'
    },
    {
      icon: '🗺️',
      title: 'Calculated Milestone Roadmap',
      desc: 'Weekly milestones with estimated hours, paced to the time you actually have.'
    },
    {
      icon: '🧮',
      title: 'Readiness Calculator',
      desc: 'Try what-if plans: more study hours, a different company tier, a new deadline.'
    },
    {
      icon: '🏢',
      title: 'Target Company Job Tracker',
      desc: 'Keep applications, required skills, interview dates and recruiter notes together.'
    },
    {
      icon: '🚀',
      title: 'Proof of Work Portfolio',
      desc: 'Pick vetted projects with the tech stack, repo link and live demo to show.'
    },
    {
      icon: '🤖',
      title: 'AI Mentor & Coach',
      desc: 'Get advice on what to learn next, clear explanations and interview tips.'
    }
  ];

  readonly steps: StepDropdownItem[] = [
    {
      num: '01',
      title: 'Set Your Target',
      desc: 'Choose a role, company tier, timeline and weekly study hours.'
    },
    {
      num: '02',
      title: 'Audit What You Know',
      desc: 'Mark skills you already have to get your starting readiness score.'
    },
    {
      num: '03',
      title: 'Execute The Roadmap',
      desc: 'Work through weekly topics and ship projects that prove it.'
    },
    {
      num: '04',
      title: 'Apply with Confidence',
      desc: 'At 90% readiness, manage every application in the job tracker.'
    }
  ];

  readonly roles: string[] = ROLES.map(r => r.name);

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
    this.mobileAccordion.set(null);
  }

  toggleMobileAccordion(name: 'features' | 'how' | 'roles'): void {
    this.mobileAccordion.update(curr => curr === name ? null : name);
  }

  onDropdownMouseEnter(menu: 'features' | 'how' | 'roles'): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = undefined;
    }
    this.openDropdown.set(menu);
  }

  onDropdownMouseLeave(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
    this.closeTimeout = setTimeout(() => {
      this.openDropdown.set(null);
    }, 180);
  }

  onDropdownFocusIn(menu: 'features' | 'how' | 'roles'): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = undefined;
    }
    this.openDropdown.set(menu);
  }

  onDropdownFocusOut(event: FocusEvent): void {
    const currentTarget = event.currentTarget as HTMLElement | null;
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (!currentTarget?.contains(relatedTarget)) {
      this.closeTimeout = setTimeout(() => {
        this.openDropdown.set(null);
      }, 180);
    }
  }

  onTriggerKeydown(event: KeyboardEvent, menu: 'features' | 'how' | 'roles'): void {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openDropdown.set(menu);
      setTimeout(() => {
        const panel = document.querySelector(`[aria-labelledby="nav-trigger-${menu}"]`);
        const firstItem = panel?.querySelector<HTMLElement>('[role="menuitem"]');
        firstItem?.focus();
      }, 50);
    } else if (event.key === 'Escape') {
      this.openDropdown.set(null);
    }
  }

  onMenuItemKeydown(event: KeyboardEvent, menu: 'features' | 'how' | 'roles', index: number): void {
    const panel = document.querySelector(`[aria-labelledby="nav-trigger-${menu}"]`);
    const items = panel ? Array.from(panel.querySelectorAll<HTMLElement>('[role="menuitem"]')) : [];

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIdx = (index + 1) % items.length;
      items[nextIdx]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIdx = (index - 1 + items.length) % items.length;
      items[prevIdx]?.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.openDropdown.set(null);
      const trigger = document.getElementById(`nav-trigger-${menu}`);
      trigger?.focus();
    } else if (event.key === 'Tab') {
      this.openDropdown.set(null);
    }
  }

  onMenuKeydown(event: KeyboardEvent, menu: 'features' | 'how' | 'roles'): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.openDropdown.set(null);
      const trigger = document.getElementById(`nav-trigger-${menu}`);
      trigger?.focus();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (!target.closest('.nav-dropdown-wrapper')) {
      this.openDropdown.set(null);
    }
  }

  @HostListener('document:keydown.escape')
  onDocumentEscape(): void {
    this.openDropdown.set(null);
    if (this.mobileOpen()) {
      this.closeMobile();
    }
  }

  scrollToSection(event: Event | undefined, fragment: string): void {
    this.openDropdown.set(null);
    this.closeMobile();

    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      if (event) {
        event.preventDefault();
      }
      const el = document.getElementById(fragment);
      if (el) {
        const prefersReducedMotion = typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
        try {
          history.pushState(null, '', `/#${fragment}`);
        } catch {}
        this.activeSection.set(fragment);
      }
    } else {
      this.router.navigate(['/'], { fragment });
    }
  }

  private setupScrollSpy(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    this.observer?.disconnect();

    const sectionIds = ['features', 'how', 'roles', 'demo'];
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        if (this.router.url !== '/' && !this.router.url.startsWith('/#')) {
          this.activeSection.set('');
          return;
        }

        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => {
            const topA = Math.abs(a.boundingClientRect.top);
            const topB = Math.abs(b.boundingClientRect.top);
            return topA - topB;
          });
          const id = visibleEntries[0].target.id;
          this.ngZone.run(() => {
            this.activeSection.set(id);
          });
        } else if (window.scrollY < 200) {
          this.ngZone.run(() => {
            this.activeSection.set('');
          });
        }
      },
      {
        rootMargin: '-80px 0px -40% 0px',
        threshold: [0, 0.25, 0.5]
      }
    );

    elements.forEach(el => this.observer!.observe(el));
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

    // Check fragment on initial arrival
    this.route.fragment.subscribe(fragment => {
      if (fragment && (this.router.url === '/' || this.router.url.startsWith('/#'))) {
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) {
            const prefersReducedMotion = typeof window !== 'undefined' &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            el.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
              block: 'start'
            });
            this.activeSection.set(fragment);
          }
        }, 100);
      }
    });

    // Re-setup scroll spy on router navigation
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url === '/' || this.router.url.startsWith('/#')) {
          setTimeout(() => this.setupScrollSpy(), 150);
        } else {
          this.activeSection.set('');
          this.observer?.disconnect();
        }
      });

    setTimeout(() => this.setupScrollSpy(), 200);
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
    this.routerSub?.unsubscribe();
    this.observer?.disconnect();
  }
}