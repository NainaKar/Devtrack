import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TrackerService } from '../services/tracker.service';

/**
 * Logged-in App Layout:
 * Features a floating glass pill sidebar with terracotta gradient, glossy bubble logo,
 * rounded icon bubbles, and classic inverted-radius cream active tab merging into the main page.
 */
@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell" [class.collapsed]="collapsed()">
      <!-- Mobile Overlay Dimmed Backdrop (< 900px) -->
      @if (open()) {
        <div
          class="side-backdrop"
          (click)="open.set(false)"
          aria-hidden="true"
        ></div>
      }

      <!-- Floating Rounded Glass Pill Sidebar -->
      <aside
        class="side-shell"
        [class.collapsed]="collapsed()"
        [class.open]="open()"
        aria-label="Sidebar navigation"
      >
        <!-- Header: Glossy Logo Bubble + Wordmark + Collapse Chevron Button -->
        <div class="side-header">
          <a
            routerLink="/app/dashboard"
            class="side-logo-group"
            (click)="open.set(false)"
            aria-label="DevTrack Dashboard Home"
          >
            <div class="side-logo-bubble" aria-hidden="true">D</div>
            @if (!collapsed()) {
              <h1 class="side-logo-text">DevTrack</h1>
            }
          </a>

          <!-- Collapse / Expand Toggle Button -->
          <button
            type="button"
            class="side-collapse-btn"
            (click)="toggleCollapsed()"
            [attr.aria-expanded]="!collapsed()"
            [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          >
            @if (collapsed()) {
              <!-- Chevron Right › -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            } @else {
              <!-- Chevron Left ‹ -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            }
          </button>
        </div>

        <!-- Main Navigation Links -->
        <nav class="side-nav-group" aria-label="Main Navigation">
          @for (n of nav; track n.path) {
            <a
              class="side-item"
              [routerLink]="n.path"
              routerLinkActive="active"
              (click)="open.set(false)"
              [attr.aria-current]="router.url.includes(n.path) ? 'page' : null"
            >
              <div class="side-icon-bubble">
                <svg class="side-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path [attr.d]="n.svgPath" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>

              @if (!collapsed()) {
                <span class="side-label">{{ n.label }}</span>
              }

              @if (collapsed()) {
                <span class="side-tooltip" role="tooltip">{{ n.label }}</span>
              }
            </a>
          }
        </nav>

        <!-- Current Target Goal Progress Card (hidden when collapsed) -->
        @if (!collapsed()) {
          <div class="side-goal-card">
            <div class="side-goal-sub">TARGET ROLE</div>
            <strong class="side-goal-role">{{ t.goals().position }}</strong>
            <div class="side-goal-bar">
              <div class="side-goal-fill" [style.width.%]="t.analysis().readiness"></div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-size:0.75rem; color:var(--color-sidebar-muted, #D8C3B5);">
              <span>Readiness</span>
              <strong style="color:#ffffff;">{{ t.analysis().readiness }}%</strong>
            </div>
          </div>
        }

        <!-- Sidebar Bottom Footer: Profile & Logout -->
        <div class="side-footer">
          <a
            routerLink="/app/profile"
            class="side-item side-profile-item"
            routerLinkActive="active"
            (click)="open.set(false)"
            [attr.aria-label]="collapsed() ? 'My Profile' : null"
          >
            <div class="side-icon-bubble">
              <svg class="side-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            @if (!collapsed()) {
              <span class="side-label">My Profile</span>
            } @else {
              <span class="side-tooltip" role="tooltip">My Profile</span>
            }
          </a>

          <button
            type="button"
            class="side-logout-btn"
            (click)="auth.logout()"
            title="Log out"
            aria-label="Log out"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </aside>

      <!-- Main Content Area with Top Navigation Bar -->
      <div class="main">
        <header class="topbar">
          <div class="topbar-left">
            <button
              type="button"
              class="btn btn-ghost btn-sm menu-btn"
              (click)="open.set(!open())"
              aria-label="Toggle navigation drawer"
            >
              ☰
            </button>
            <div class="row" style="gap:8px">
              <span class="muted small">DevTrack /</span>
              <strong style="color:var(--color-text-primary); font-size:0.92rem">{{ currentTitle() }}</strong>
            </div>
          </div>

          <!-- Topbar Search & User Quick Actions -->
          <div class="topbar-right">
            <div class="topbar-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="search" placeholder="Search skills, projects..." (keyup.enter)="onSearch($event)">
            </div>

            <a routerLink="/app/skills" class="btn btn-primary btn-sm" style="display:none; @media(min-width:768px){display:inline-flex}">
              + Update Progress
            </a>

            <!-- Notification Bell -->
            <button type="button" class="btn-icon" title="Notifications" aria-label="Notifications">
              <svg style="width:17px; height:17px; stroke:currentColor; fill:none; stroke-width:2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="dot-indicator"></span>
            </button>

            <!-- User Avatar & Identity -->
            <a routerLink="/app/profile" style="display:flex; align-items:center; gap:8px; text-decoration:none">
              <div class="avatar">{{ initial() }}</div>
              <div style="line-height:1.2; display:none; @media(min-width:640px){display:block}">
                <div style="font-weight:600; font-size:0.86rem; color:var(--color-text-primary)">
                  {{ auth.user()?.name }}
                </div>
                <div class="small muted" style="font-size:0.75rem">
                  {{ t.goals().level }}
                </div>
              </div>
            </a>
          </div>
        </header>

        <main>
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AppLayout {
  auth = inject(AuthService);
  t = inject(TrackerService);
  router = inject(Router);

  open = signal(false);
  collapsed = signal(this.getInitialCollapsed());
  currentTitle = signal('Overview');

  nav = [
    {
      path: '/app/dashboard',
      label: 'Overview',
      svgPath: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'
    },
    {
      path: '/app/skills',
      label: 'Skills & Assessments',
      svgPath: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'
    },
    {
      path: '/app/roadmap',
      label: 'Career Roadmap',
      svgPath: 'M5 12h14M12 5l7 7-7 7'
    },
    {
      path: '/app/projects',
      label: 'Projects',
      svgPath: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'
    },
    {
      path: '/app/jobs',
      label: 'Target Companies & Jobs',
      svgPath: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'
    },
    {
      path: '/app/calculator',
      label: 'Readiness Calculator',
      svgPath: 'M4 6h16M4 12h16M4 18h16M8 4v4M16 10v4M10 16v4'
    },
    {
      path: '/app/chat',
      label: 'AI Mentor & Prep',
      svgPath: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'
    },
    {
      path: '/app/activity',
      label: 'Activity Log & Reports',
      svgPath: 'M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'
    },
  ];

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateTitle();
      });
    this.updateTitle();
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    if (this.open()) {
      this.open.set(false);
    }
  }

  private getInitialCollapsed(): boolean {
    try {
      const saved = localStorage.getItem('devtrack_sidebar_collapsed');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  }

  toggleCollapsed() {
    this.collapsed.update(curr => {
      const next = !curr;
      try {
        localStorage.setItem('devtrack_sidebar_collapsed', JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  updateTitle() {
    const url = this.router.url;
    if (url.includes('/skills')) this.currentTitle.set('Skills & Assessments');
    else if (url.includes('/roadmap')) this.currentTitle.set('Career Roadmap');
    else if (url.includes('/projects')) this.currentTitle.set('Projects & Portfolio');
    else if (url.includes('/jobs')) this.currentTitle.set('Target Companies & Jobs');
    else if (url.includes('/calculator')) this.currentTitle.set('Readiness Calculator');
    else if (url.includes('/chat')) this.currentTitle.set('AI Mentor & Prep');
    else if (url.includes('/activity')) this.currentTitle.set('Activity Log & Reports');
    else if (url.includes('/profile')) this.currentTitle.set('My Profile & Goals');
    else this.currentTitle.set('Overview');
  }

  initial() {
    return (this.auth.user()?.name ?? '?').charAt(0).toUpperCase();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.trim()) {
      this.router.navigate(['/app/skills']);
    }
  }
}
