import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TrackerService } from '../services/tracker.service';
import { COMPANY_SUGGESTIONS, LEVELS, ROLES, TIMELINES } from '../data/roles.data';
import { Goals, Level } from '../models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="profile-page">
      <!-- Header Section -->
      <section class="hd rv" style="--i:1">
        <div>
          <h1>My Profile &amp; Goals</h1>
          <p>
            Profile verification &amp; completeness:
            <b>{{ t.profileCompleteness() }}%</b>
          </p>
        </div>
        <div class="completion-bar-wrap">
          <div class="tk">
            <i [style.width.%]="t.profileCompleteness()"></i>
          </div>
        </div>
      </section>

      @if (msg()) {
        <div class="card rv alert-banner" style="--i:2" role="status">
          <span>✓ {{ msg() }}</span>
        </div>
      }

      <div class="profile-grid">
        <!-- Target Goal Form Card -->
        <form class="card rv form-card" style="--i:3" (ngSubmit)="saveGoals()">
          <h2>Career Ambition &amp; Target</h2>

          <div class="form-group" style="margin-top:16px">
            <label for="prof-role">Desired Role Domain</label>
            <select id="prof-role" name="role" [(ngModel)]="g.roleId" (ngModelChange)="onRole()">
              @for (r of roles; track r.id) {
                <option [value]="r.id">{{ r.name }}</option>
              }
            </select>
          </div>

          <div class="form-group">
            <label for="prof-pos">Target Position Title</label>
            <input id="prof-pos" name="pos" type="text" [(ngModel)]="g.position">
          </div>

          <div class="form-group">
            <label for="prof-co">Primary Target Company</label>
            <input id="prof-co" name="co" type="text" list="cos" [(ngModel)]="g.company" placeholder="e.g. Google, Stripe, or a startup">
            <datalist id="cos">
              @for (c of companies; track c) {
                <option [value]="c"></option>
              }
            </datalist>
          </div>

          <div class="form-group">
            <label for="prof-tl">Target Timeline</label>
            <select id="prof-tl" name="tl" [(ngModel)]="g.timelineMonths">
              @for (m of timelines; track m) {
                <option [ngValue]="m">{{ m }} months</option>
              }
            </select>
          </div>

          <div class="form-group">
            <label>Current Experience Baseline</label>
            <div class="level-choice">
              @for (l of levels; track l) {
                <button
                  type="button"
                  class="level-btn"
                  [class.on]="g.level === l"
                  (click)="g.level = l"
                >
                  {{ l }}
                </button>
              }
            </div>
          </div>

          <div class="form-group">
            <div class="row between">
              <label for="prof-wh">Weekly Study Availability</label>
              <strong class="hours-badge">{{ g.weeklyHours }} h/week</strong>
            </div>
            <input id="prof-wh" class="range-slider" name="wh" type="range" min="2" max="60" [(ngModel)]="g.weeklyHours">
          </div>

          <button type="submit" class="btn p" style="margin-top:10px">Save Career Goal</button>
        </form>

        <!-- Right Column Stack -->
        <div class="side-stack">
          <!-- Professional Profiles Card -->
          <form class="card rv form-card" style="--i:4" (ngSubmit)="saveLinks()">
            <h2>Professional Profiles</h2>
            <div class="form-group" style="margin-top:16px">
              <label for="prof-gh">GitHub Profile URL</label>
              <input id="prof-gh" name="gh" type="url" [(ngModel)]="github" placeholder="https://github.com/username">
            </div>
            <div class="form-group">
              <label for="prof-li">LinkedIn Profile URL</label>
              <input id="prof-li" name="li" type="url" [(ngModel)]="linkedin" placeholder="https://linkedin.com/in/username">
            </div>
            <button type="submit" class="btn p">Save Profile Links</button>
          </form>

          <!-- Resume Card -->
          <div class="card rv form-card" style="--i:5">
            <h2>Resume &amp; Credentials</h2>
            @if (t.data()!.resumeName) {
              <div class="fr" style="margin:12px 0">
                <span>📄 {{ t.data()!.resumeName }}</span>
                @if (t.data()!.resumeUrl) {
                  <a class="lnk" [href]="t.data()!.resumeUrl" [download]="t.data()!.resumeName">Download ↗</a>
                }
              </div>
            }
            <div style="margin-top:10px">
              <input type="file" accept=".pdf,.doc,.docx" (change)="resume($event)" aria-label="Upload resume file">
            </div>
            <p class="sub" style="margin:8px 0 0; font-size:12px">
              Accepted formats: PDF or DOCX (up to 1 MB saved to local storage account).
            </p>
          </div>

          <!-- Account Settings Card -->
          <div class="card rv form-card" style="--i:6">
            <h2>Account Settings</h2>
            <p class="sub" style="margin:6px 0 16px">
              Signed in as <b>{{ auth.user()?.name }}</b> ({{ auth.user()?.email }})
            </p>
            <div class="row" style="gap:10px">
              <button type="button" class="btn g btn-sm" (click)="resetProgress()">Reset Progress</button>
              <button type="button" class="btn g btn-sm danger-btn" (click)="del()">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .hd {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
      flex-wrap: wrap;
      margin: 10px 0 24px;
    }

    .hd h1 {
      font-size: clamp(30px, 3.5vw, 46px);
      line-height: 1.1;
      font-family: var(--db-fd);
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--db-ink);
    }

    .hd p {
      color: var(--db-mu);
      margin: 6px 0 0;
      font-size: 15px;
    }

    .hd p b {
      color: var(--db-ink);
    }

    .completion-bar-wrap {
      width: 200px;
    }

    .alert-banner {
      padding: 12px 18px;
      margin-bottom: 20px;
      background: rgba(38, 74, 58, .12);
      border-color: rgba(38, 74, 58, .3);
      border-top-color: var(--db-gr);
      color: var(--db-gr);
      font-weight: 600;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 20px;
      align-items: start;
    }

    .form-card {
      padding: 22px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 14px;
    }

    .form-group label {
      font-size: 13px;
      font-weight: 600;
      color: var(--db-ink);
    }

    .level-choice {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .level-btn {
      background: var(--db-bg);
      border: 1px solid var(--db-ln);
      color: var(--db-mu);
      font-family: var(--db-fb);
      font-size: 13px;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 99px;
      cursor: pointer;
      transition: all .2s ease;
    }

    .level-btn:hover {
      background: #fff;
      color: var(--db-ink);
    }

    .level-btn.on {
      background: var(--db-ac);
      border-color: var(--db-ac);
      color: var(--db-on);
      font-weight: 600;
    }

    .hours-badge {
      color: var(--db-ac);
      font-family: var(--db-fd);
      font-size: 14px;
    }

    .range-slider {
      accent-color: var(--db-ac);
      cursor: pointer;
      margin: 6px 0;
    }

    .side-stack {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .danger-btn {
      color: #c4452a;
      border-color: rgba(196, 69, 42, .3);
    }

    .danger-btn:hover {
      background: #c4452a;
      color: #fff;
    }

    .tk {
      height: 10px;
      border-radius: 9px;
      background: var(--db-ac2);
      position: relative;
    }

    .tk i {
      display: block;
      height: 100%;
      border-radius: 9px;
      background: var(--db-ac);
      transform-origin: left;
    }

    @media (max-width: 900px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class Profile {
  auth = inject(AuthService);
  t = inject(TrackerService);
  roles = ROLES;
  timelines = TIMELINES;
  levels = LEVELS;
  companies = COMPANY_SUGGESTIONS;

  msg = signal('');
  g: Goals = { ...this.t.goals() };
  github = this.t.data()!.github;
  linkedin = this.t.data()!.linkedin;

  private flash(m: string) {
    this.msg.set(m);
    setTimeout(() => this.msg.set(''), 3000);
  }

  onRole() {
    this.g.position = ROLES.find(r => r.id === this.g.roleId)!.name;
  }

  saveGoals() {
    const goals = {
      ...this.g,
      timelineMonths: +this.g.timelineMonths,
      weeklyHours: +this.g.weeklyHours,
    };
    this.auth.update(
      d => {
        d.goals = goals;
        return d;
      },
      'goals',
      `Goal updated: ${goals.position} at ${goals.company || 'any company'}, ${goals.timelineMonths} months, ${goals.weeklyHours}h/week.`
    );
    this.flash('Goal saved – roadmap and readiness recalculating.');
  }

  saveLinks() {
    this.auth.update(
      d => {
        d.github = this.github.trim();
        d.linkedin = this.linkedin.trim();
        return d;
      },
      'profile',
      'Updated GitHub / LinkedIn links.'
    );
    this.flash('Links saved.');
  }

  resume(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const save = (url: string) => {
      this.auth.update(
        d => {
          d.resumeName = f.name;
          d.resumeUrl = url;
          return d;
        },
        'resume',
        `Uploaded resume "${f.name}".`
      );
      this.flash('Resume uploaded successfully.');
    };
    if (f.size > 1_000_000) {
      save('');
      return;
    }
    const r = new FileReader();
    r.onload = () => save(String(r.result));
    r.readAsDataURL(f);
  }

  resetProgress() {
    if (confirm('Reset all completed topics and projects?')) {
      this.auth.update(
        d => {
          d.doneTopics = [];
          d.projects = [];
          return d;
        },
        'reset',
        'Progress reset.'
      );
      this.flash('Progress reset.');
    }
  }

  del() {
    if (confirm('Delete your account permanently?')) this.auth.deleteAccount();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const card = target?.closest?.('.card') as HTMLElement;
    if (card) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    }
  }
}
