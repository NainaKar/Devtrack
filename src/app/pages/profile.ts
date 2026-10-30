import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TrackerService } from '../services/tracker.service';
import { COMPANY_SUGGESTIONS, LEVELS, ROLES, TIMELINES } from '../data/roles.data';
import { Goals, Level } from '../models';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  template: `
  <div class="page">
    <div class="page-head row between">
      <div>
        <h1>My Profile & Goals</h1>
        <p class="muted" style="margin:2px 0 0">
          Profile verification & completeness:
          <strong style="color:var(--color-primary)">{{ t.profileCompleteness() }}%</strong>
        </p>
      </div>
      <div class="bar" style="width:180px">
        <i [style.width.%]="t.profileCompleteness()"></i>
      </div>
    </div>

    @if (msg()) {
      <div class="success" role="status">{{ msg() }}</div>
    }

    <div class="grid g2" style="align-items:start; gap:20px">
      <!-- Target Goal Form -->
      <form class="card" (ngSubmit)="saveGoals()">
        <h3 style="margin-bottom:14px">Career Ambition & Target</h3>

        <div class="field">
          <label for="prof-role">Desired Role Domain</label>
          <select id="prof-role" name="role" [(ngModel)]="g.roleId" (ngModelChange)="onRole()">
            @for (r of roles; track r.id) {
              <option [value]="r.id">{{ r.name }}</option>
            }
          </select>
        </div>

        <div class="field">
          <label for="prof-pos">Target Position Title</label>
          <input id="prof-pos" name="pos" type="text" [(ngModel)]="g.position">
        </div>

        <div class="field">
          <label for="prof-co">Primary Target Company</label>
          <input id="prof-co" name="co" type="text" list="cos" [(ngModel)]="g.company" placeholder="e.g. Google, Stripe, or a startup">
          <datalist id="cos">
            @for (c of companies; track c) {
              <option [value]="c"></option>
            }
          </datalist>
        </div>

        <div class="field">
          <label for="prof-tl">Target Timeline</label>
          <select id="prof-tl" name="tl" [(ngModel)]="g.timelineMonths">
            @for (m of timelines; track m) {
              <option [ngValue]="m">{{ m }} months</option>
            }
          </select>
        </div>

        <div class="field">
          <label>Current Experience Baseline</label>
          <div class="choice">
            @for (l of levels; track l) {
              <button type="button" [class.on]="g.level === l" (click)="g.level = l">{{ l }}</button>
            }
          </div>
        </div>

        <div class="field">
          <div class="row between">
            <label for="prof-wh">Weekly Study Availability</label>
            <strong class="tabular" style="color:var(--color-primary)">{{ g.weeklyHours }} h/week</strong>
          </div>
          <input id="prof-wh" name="wh" type="range" min="2" max="60" [(ngModel)]="g.weeklyHours">
        </div>

        <button class="btn btn-primary" style="margin-top:6px">Save Career Goal</button>
      </form>

      <!-- Proof of Work & Account Actions -->
      <div class="stack">
        <!-- Links Form -->
        <form class="card" (ngSubmit)="saveLinks()">
          <h3 style="margin-bottom:14px">Professional Profiles</h3>
          <div class="field">
            <label for="prof-gh">GitHub Profile URL</label>
            <input id="prof-gh" name="gh" type="url" [(ngModel)]="github" placeholder="https://github.com/username">
          </div>
          <div class="field">
            <label for="prof-li">LinkedIn Profile URL</label>
            <input id="prof-li" name="li" type="url" [(ngModel)]="linkedin" placeholder="https://linkedin.com/in/username">
          </div>
          <button class="btn btn-primary">Save Profile Links</button>
        </form>

        <!-- Resume Card -->
        <div class="card">
          <h3 style="margin-bottom:8px">Resume & Credentials</h3>
          @if (t.data()!.resumeName) {
            <div style="padding:10px 12px; background:var(--color-surface-secondary); border-radius:var(--radius-sm); margin-bottom:12px" class="row between">
              <span style="font-size:0.88rem; font-weight:500; color:var(--color-text-primary)">
                📄 {{ t.data()!.resumeName }}
              </span>
              @if (t.data()!.resumeUrl) {
                <a class="small" [href]="t.data()!.resumeUrl" [download]="t.data()!.resumeName">Download ↗</a>
              }
            </div>
          }
          <input type="file" accept=".pdf,.doc,.docx" (change)="resume($event)" aria-label="Upload resume file">
          <p class="small muted" style="margin:8px 0 0; font-size:0.78rem">
            Accepted formats: PDF or DOCX (up to 1 MB saved to local storage account).
          </p>
        </div>

        <!-- Account Settings -->
        <div class="card">
          <h3 style="margin-bottom:6px">Account Settings</h3>
          <p class="small muted" style="margin-bottom:14px">
            Signed in as <strong style="color:var(--color-text-primary)">{{ auth.user()?.name }}</strong> ({{ auth.user()?.email }})
          </p>
          <div class="row" style="gap:10px">
            <button class="btn btn-secondary btn-sm" (click)="resetProgress()">Reset Progress</button>
            <button class="btn btn-danger btn-sm" (click)="del()">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  </div>`,
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
}
