import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TrackerService } from '../services/tracker.service';

interface NavItem {
  label: string;
  route: string;
  exact: boolean;
  iconId: string;
}

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Hidden SVG Symbol Library -->
    <svg width="0" height="0" style="position:absolute; display:none" aria-hidden="true">
      <defs>
        <symbol id="i-grid" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
        </symbol>
        <symbol id="i-book" viewBox="0 0 24 24">
          <path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z"/>
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6-6 6"/>
        </symbol>
        <symbol id="i-folder" viewBox="0 0 24 24">
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </symbol>
        <symbol id="i-brief" viewBox="0 0 24 24">
          <rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
        </symbol>
        <symbol id="i-sliders" viewBox="0 0 24 24">
          <path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>
        </symbol>
        <symbol id="i-chat" viewBox="0 0 24 24">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/>
        </symbol>
        <symbol id="i-clock" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
        </symbol>
        <symbol id="i-user" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>
        </symbol>
        <symbol id="i-out" viewBox="0 0 24 24">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
        </symbol>
        <symbol id="i-chev" viewBox="0 0 24 24">
          <path d="M15 6l-6 6 6 6"/>
        </symbol>
      </defs>
    </svg>

    <div class="db-shell app" data-theme="b">
      <!-- Theme B Floating Command Rail -->
      <aside class="rail" [class.pin]="pinned()" aria-label="Main navigation">
        <!-- Rail Header: Brand + Pin Toggle -->
        <div class="rh">
          <i class="lgo">D</i>
          <b>DevTrack</b>
          <button
            type="button"
            class="cv"
            (click)="togglePin()"
            [attr.aria-label]="pinned() ? 'Unpin sidebar' : 'Pin sidebar open'"
          >
            <svg class="si"><use href="#i-chev"/></svg>
          </button>
        </div>

        <!-- Rail Main Nav (8 Items) -->
        <nav class="rn" aria-label="App Navigation">
          @for (item of menuItems; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="on"
              [routerLinkActiveOptions]="{ exact: item.exact }"
            >
              <span class="ic">
                <svg class="si"><use [attr.href]="'#' + item.iconId"/></svg>
              </span>
              <em>{{ item.label }}</em>
            </a>
          }
        </nav>

        <!-- Target Role & Readiness Mini-Card -->
        <div class="rt">
          <small>TARGET ROLE</small>
          <b>{{ t.goals().position || 'Full-Stack Developer' }}</b>
          <div class="rb">
            <span>Readiness</span>
            <span>{{ t.analysis().readiness }}%</span>
          </div>
          <div class="trk">
            <i [style.width.%]="t.analysis().readiness"></i>
          </div>
        </div>

        <!-- Rail Footer: My Profile & Log Out -->
        <div class="rf">
          <a routerLink="/app/profile" routerLinkActive="on">
            <span class="ic">
              <svg class="si"><use href="#i-user"/></svg>
            </span>
            <em>My Profile</em>
          </a>
          <a class="lo" href="javascript:void(0)" (click)="logout()">
            <span class="ic">
              <svg class="si"><use href="#i-out"/></svg>
            </span>
            <em>Log out</em>
          </a>
        </div>

        <!-- Right edge cutout strip -->
        <span class="strip" aria-hidden="true"></span>
      </aside>

      <!-- Main Sibling Content Area -->
      <main>
        <!-- Top Bar -->
        <div class="top rv" style="--i:0">
          <div class="bc">
            DevTrack / <b>{{ currentTitle() }}</b>
          </div>
          <div class="sr">
            <svg class="si" style="margin-right:8px; opacity:0.6" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="search"
              placeholder="Search skills, projects..."
              (keyup.enter)="onSearch($event)"
            />
          </div>
          <span class="bell" title="Notifications" role="button" tabindex="0">🔔</span>
          <a routerLink="/app/profile" class="av" [title]="auth.user()?.name || 'Profile'">{{ initial() }}</a>
        </div>

        <!-- Routed Views -->
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .si {
      width: 18px;
      height: 18px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
      flex: none;
    }

    .app {
      display: block;
      min-height: 100vh;
      background: var(--db-bg, #efe6d4);
      color: var(--db-ink, #2e1a10);
      position: relative;
    }

    main {
      margin-left: 104px;
      padding: 24px 28px 90px;
      min-width: 0;
      transition: margin-left .5s cubic-bezier(.2, .8, .2, 1);
    }

    .rail:is(:hover, :focus-within, .pin) ~ main {
      margin-left: 350px;
    }

    /* Floating Rail Navigation */
    .rail {
      --w: 76px;
      position: fixed;
      left: 14px;
      top: 14px;
      bottom: 14px;
      width: var(--w);
      z-index: 30;
      border-radius: 40px;
      background: linear-gradient(175deg, #935139 0%, #5d2f20 45%, #3a1b11 100%);
      box-shadow: 0 22px 50px rgba(63, 31, 18, .4), inset 0 0 0 1px rgba(255, 255, 255, .14);
      color: var(--db-on, #f6eddc);
      display: flex;
      flex-direction: column;
      padding: 14px 0;
      overflow: hidden;
      transition: width .5s cubic-bezier(.2, .8, .2, 1), box-shadow .4s;
    }

    .rail:is(:hover, :focus-within, .pin) {
      width: 322px;
      box-shadow: -26px 24px 46px -24px rgba(63, 31, 18, .55);
    }

    /* Header */
    .rh {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 14px 14px;
      flex: none;
    }

    .lgo {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 25%, #e9b9a3, #a05b45);
      display: grid;
      place-items: center;
      font: 700 22px var(--db-fd);
      font-style: normal;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .3);
      flex: none;
      color: #fff;
    }

    .rh b {
      font-family: var(--db-fd);
      font-size: 22px;
      white-space: nowrap;
      color: var(--db-on, #f6eddc);
    }

    .cv {
      margin-left: auto;
      margin-right: 26px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 0;
      background: rgba(255, 255, 255, .14);
      color: inherit;
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: transform .4s, background .2s;
    }

    .cv:hover {
      background: rgba(255, 255, 255, .25);
    }

    .rail.pin .cv {
      transform: rotate(180deg);
    }

    .rh b,
    .cv,
    .rail em,
    .rt {
      opacity: 0;
      transition: opacity .3s;
    }

    .rail:is(:hover, :focus-within, .pin) :is(.rh b, .cv, em, .rt) {
      opacity: 1;
      transition-delay: .12s;
    }

    /* Navigation Links */
    .rn {
      display: flex;
      flex-direction: column;
      gap: 6px;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: none;
      flex: 0 1 auto;
      min-height: 0;
      padding: 2px 0;
    }

    .rn::-webkit-scrollbar {
      display: none;
    }

    .rn a,
    .rf a {
      position: relative;
      display: flex;
      align-items: center;
      gap: 14px;
      margin: 0 14px;
      padding: 5px;
      border-radius: 99px;
      white-space: nowrap;
      color: rgba(246, 237, 220, .92);
      text-decoration: none;
      transition: background .25s, margin .5s cubic-bezier(.2, .8, .2, 1), color .25s;
    }

    .ic {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, .12);
      display: grid;
      place-items: center;
      flex: none;
      transition: transform .25s, background .25s, color .25s;
    }

    .rail em {
      font: 600 14px var(--db-fb);
      font-style: normal;
    }

    .rn a:hover .ic,
    .rf a:hover .ic {
      transform: scale(1.1);
    }

    .rn a.on .ic {
      background: #fff;
      color: var(--db-ac, #b4561f);
    }

    .rf .lo:hover .ic {
      background: #c4452a;
      color: #fff;
    }

    .rail:is(:hover, :focus-within, .pin) :is(.rn, .rf) a {
      margin-right: 38px;
    }

    .rail:is(:hover, :focus-within, .pin) :is(.rn, .rf) a:not(.on) {
      background: rgba(255, 255, 255, .1);
    }

    .rail:is(:hover, :focus-within, .pin) :is(.rn, .rf) a:not(.on):hover {
      background: rgba(255, 255, 255, .2);
    }

    /* Active Tab Join Effect */
    .rail:is(:hover, :focus-within, .pin) .rn a.on {
      margin-right: 24px;
      background: var(--db-bg, #efe6d4);
      color: var(--db-dk, #3f1f12);
      border-radius: 99px 0 0 99px;
    }

    .rail:is(:hover, :focus-within, .pin) .rn a.on .ic {
      background: var(--db-ac2, #ecd3b8);
      color: var(--db-ac, #b4561f);
    }

    .rn a.on::before,
    .rn a.on::after {
      content: '';
      position: absolute;
      right: 0;
      width: 22px;
      height: 22px;
      display: none;
    }

    .rail:is(:hover, :focus-within, .pin) .rn a.on::before,
    .rail:is(:hover, :focus-within, .pin) .rn a.on::after {
      display: block;
    }

    .rn a.on::before {
      bottom: 100%;
      background: radial-gradient(circle at 0 0, transparent 22px, var(--db-bg, #efe6d4) 22.5px);
    }

    .rn a.on::after {
      top: 100%;
      background: radial-gradient(circle at 0 100%, transparent 22px, var(--db-bg, #efe6d4) 22.5px);
    }

    /* Target Role Mini Card */
    .rt {
      margin: auto 38px 10px 14px;
      background: rgba(0, 0, 0, .28);
      border-radius: 18px;
      padding: 14px;
      flex: none;
      pointer-events: none;
    }

    .rt small {
      font-size: 11px;
      letter-spacing: .1em;
      opacity: .7;
      text-transform: uppercase;
    }

    .rt b {
      display: block;
      font: 600 16px var(--db-fd);
      margin: 2px 0 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rb {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      opacity: .85;
    }

    .trk {
      height: 6px;
      border-radius: 9px;
      background: rgba(255, 255, 255, .15);
      margin-top: 6px;
      overflow: hidden;
    }

    .trk i {
      display: block;
      height: 100%;
      background: var(--db-ac2, #ecd3b8);
      border-radius: 9px;
    }

    /* Footer */
    .rf {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: none;
    }

    /* Right edge strip */
    .strip {
      position: absolute;
      right: 0;
      top: 12px;
      bottom: 12px;
      width: 24px;
      background: var(--db-bg, #efe6d4);
      border-radius: 28px 0 0 28px;
      opacity: 0;
      pointer-events: none;
      transition: opacity .4s;
    }

    .rail:is(:hover, :focus-within, .pin) .strip {
      opacity: 1;
    }

    /* Top Bar */
    .top {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 24px;
    }

    .bc {
      color: var(--db-mu, #7a5a47);
      margin-right: auto;
      font-size: 14px;
    }

    .bc b {
      color: var(--db-ink, #2e1a10);
      font-weight: 600;
    }

    .sr {
      background: var(--db-sf, #fbf6ea);
      border: 1px solid var(--db-ln, #e0d1b8);
      border-radius: 8px;
      padding: 0 14px;
      display: flex;
      align-items: center;
      min-width: 260px;
      height: 42px;
    }

    .sr input {
      border: none !important;
      background: transparent !important;
      padding: 0 !important;
      width: 100%;
      box-shadow: none !important;
      font-size: 14px;
      color: var(--db-ink, #2e1a10);
      outline: none;
    }

    .bell {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--db-sf, #fbf6ea);
      border: 1px solid var(--db-ln, #e0d1b8);
      display: grid;
      place-items: center;
      animation: db-wig 7s infinite;
      position: relative;
      cursor: pointer;
      font-size: 16px;
      flex: none;
      outline: none;
    }

    .bell::after {
      content: '';
      position: absolute;
      top: 9px;
      right: 10px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--db-ac, #b4561f);
    }

    .av {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--db-ac, #b4561f);
      color: var(--db-on, #f6eddc);
      display: grid;
      place-items: center;
      font-weight: 700;
      text-decoration: none;
      flex: none;
      font-family: var(--db-fd);
      transition: transform .2s, box-shadow .2s;
    }

    .av:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(180, 86, 31, .3);
    }

    /* Responsive <= 1000px: Bottom Dock */
    @media (max-width: 1000px) {
      main,
      .rail:is(:hover, :focus-within, .pin) ~ main {
        padding-bottom: 110px;
        margin-left: 0;
        padding-left: 16px;
        padding-right: 16px;
      }

      .rail,
      .rail:is(:hover, :focus-within, .pin) {
        top: auto;
        left: 10px;
        right: 10px;
        bottom: 10px;
        width: auto;
        height: 66px;
        flex-direction: row;
        align-items: center;
        padding: 0 8px;
        border-radius: 33px;
      }

      .rh,
      .rt,
      .strip,
      .rail em {
        display: none;
      }

      .rn {
        flex-direction: row;
        overflow-x: auto;
        flex: 1;
      }

      .rf {
        flex-direction: row;
      }

      .rn a,
      .rf a,
      .rail:is(:hover, :focus-within, .pin) :is(.rn, .rf) a {
        margin: 0 2px;
        background: none !important;
        padding: 4px;
      }

      .rn a.on::before,
      .rn a.on::after {
        display: none !important;
      }

      .sr {
        display: none;
      }
    }
  `],
})
export class AppLayout {
  router = inject(Router);
  auth = inject(AuthService);
  t = inject(TrackerService);

  pinned = signal<boolean>(false);
  currentTitle = signal<string>('Overview');

  readonly menuItems: NavItem[] = [
    { label: 'Overview', route: '/app/dashboard', exact: true, iconId: 'i-grid' },
    { label: 'Skills & Assessments', route: '/app/skills', exact: false, iconId: 'i-book' },
    { label: 'Career Roadmap', route: '/app/roadmap', exact: false, iconId: 'i-arrow' },
    { label: 'Projects', route: '/app/projects', exact: false, iconId: 'i-folder' },
    { label: 'Target Companies & Jobs', route: '/app/jobs', exact: false, iconId: 'i-brief' },
    { label: 'Readiness Calculator', route: '/app/calculator', exact: false, iconId: 'i-sliders' },
    { label: 'AI Mentor & Prep', route: '/app/chat', exact: false, iconId: 'i-chat' },
    { label: 'Activity Log & Reports', route: '/app/activity', exact: false, iconId: 'i-clock' },
  ];

  initial = computed(() => {
    const name = this.auth.user()?.name || 'Developer';
    return name.charAt(0).toUpperCase();
  });

  constructor() {
    try {
      this.pinned.set(localStorage.getItem('devtrack.sidebarPinned') === 'true');
    } catch {
      this.pinned.set(false);
    }

    this.updateTitle(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateTitle(event.urlAfterRedirects || event.url);
      });
  }

  togglePin() {
    this.pinned.update(p => !p);
    try {
      localStorage.setItem('devtrack.sidebarPinned', String(this.pinned()));
    } catch {}
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  onSearch(e: Event) {
    const q = (e.target as HTMLInputElement).value?.trim();
    if (q) {
      this.router.navigate(['/app/skills'], { queryParams: { q } });
    }
  }

  private updateTitle(url: string) {
    if (url.includes('/dashboard')) this.currentTitle.set('Overview');
    else if (url.includes('/skills')) this.currentTitle.set('Skills & Assessments');
    else if (url.includes('/roadmap')) this.currentTitle.set('Career Roadmap');
    else if (url.includes('/projects')) this.currentTitle.set('Projects');
    else if (url.includes('/jobs')) this.currentTitle.set('Target Companies & Jobs');
    else if (url.includes('/calculator')) this.currentTitle.set('Readiness Calculator');
    else if (url.includes('/chat')) this.currentTitle.set('AI Mentor & Prep');
    else if (url.includes('/activity')) this.currentTitle.set('Activity Log & Reports');
    else if (url.includes('/profile')) this.currentTitle.set('My Profile');
    else this.currentTitle.set('Dashboard');
  }
}
