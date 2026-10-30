import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TrackerService } from '../services/tracker.service';
import { AuthService } from '../services/auth.service';
import { etaDate, etaWeeks } from '../engine';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe],
  template: `
  <div class="page">
    <!-- Header Section -->
    <div class="page-head row between" style="margin-bottom:26px">
      <div>
        <h1>{{ greeting() }}, {{ firstName() }}</h1>
        <p class="muted" style="margin:2px 0 0">
          Your developer journey, all in one place · Goal:
          <strong style="color:var(--color-text-primary)">{{ t.goals().position }}</strong>
          @if (t.goals().company) {
            at <strong style="color:var(--color-primary)">{{ t.goals().company }}</strong>
          }
          · {{ a().tier }} profile
        </p>
      </div>
      <div class="row" style="gap:10px">
        <a class="btn btn-secondary btn-sm" routerLink="/app/jobs">Target Jobs ({{ t.jobs().length }})</a>
        <a class="btn btn-primary" routerLink="/app/skills">+ Update Progress</a>
      </div>
    </div>

    <!-- 4 High-Craft Metric Cards -->
    <div class="metric-grid-4">
      <!-- 1. Overall Readiness -->
      <div class="metric-card">
        <div class="metric-card-top">
          <span class="small muted" style="font-weight:600">Career Readiness</span>
          <div class="metric-icon-wrap">
            <svg style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
        </div>
        <div class="row-nowrap between" style="align-items:flex-end">
          <div>
            <div class="metric-val">{{ a().readiness }}%</div>
            <div class="metric-sub">
              <span class="badge" [class]="onTrack() ? 'green' : 'amber'">
                {{ onTrack() ? '● On track' : '▲ Needs more time' }}
              </span>
            </div>
          </div>
          <div class="ring" [style.--p]="a().readiness" style="width:58px;height:58px">
            <div style="width:44px;height:44px">
              <span style="font-size:0.75rem;font-weight:700">{{ a().readiness }}%</span>
            </div>
          </div>
        </div>
        <div class="small muted" style="margin-top:8px;font-size:0.78rem">
          @if (a().readiness >= 90) {
            Ready to apply to target roles 🎉
          } @else {
            Estimated target: <strong style="color:var(--color-text-primary)">{{ finish() | date:'mediumDate' }}</strong>
          }
        </div>
      </div>

      <!-- 2. Skills Progress -->
      <div class="metric-card">
        <div class="metric-card-top">
          <span class="small muted" style="font-weight:600">Skills & Topics</span>
          <div class="metric-icon-wrap">
            <svg style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
        </div>
        <div>
          <div class="metric-val">{{ t.done().size }} <span style="font-size:1.1rem;font-weight:400;color:var(--color-text-secondary)">/ {{ totalTopics() }}</span></div>
          <div class="metric-sub">
            <span>{{ a().topicsLeft }} required topics remaining</span>
          </div>
        </div>
        <div style="margin-top:8px">
          <div class="bar">
            <i [style.width.%]="t.overallCoverage()"></i>
          </div>
          <div class="row between small" style="margin-top:4px;font-size:0.76rem;color:var(--color-text-secondary)">
            <span>Coverage</span>
            <strong>{{ t.overallCoverage() }}%</strong>
          </div>
        </div>
      </div>

      <!-- 3. Projects -->
      <div class="metric-card">
        <div class="metric-card-top">
          <span class="small muted" style="font-weight:600">Proof of Work</span>
          <div class="metric-icon-wrap">
            <svg style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
        </div>
        <div>
          <div class="metric-val">{{ a().projectsDone }} <span style="font-size:1.1rem;font-weight:400;color:var(--color-text-secondary)">/ {{ a().projectsNeeded }}</span></div>
          <div class="metric-sub">
            <span class="badge primary">{{ userProjects().length }} tracked</span>
            <span>{{ activeProjectsCount() }} active</span>
          </div>
        </div>
        <div class="small muted" style="margin-top:8px;font-size:0.78rem">
          {{ a().projectsDone >= a().projectsNeeded ? 'Role project quota completed ✓' : (a().projectsNeeded - a().projectsDone) + ' projects needed for role' }}
        </div>
      </div>

      <!-- 4. Coding Activity & Streak -->
      <div class="metric-card">
        <div class="metric-card-top">
          <span class="small muted" style="font-weight:600">Tracked Activity</span>
          <div class="metric-icon-wrap">
            <svg style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
        </div>
        <div>
          <div class="metric-val">{{ activity().currentStreak }} <span style="font-size:1rem;font-weight:500;color:var(--color-text-secondary)">day streak</span></div>
          <div class="metric-sub">
            <span>{{ activity().totalSessions }} recorded study sessions</span>
          </div>
        </div>
        <!-- 14-day Mini Activity Bar Indicator -->
        <div class="activity-matrix" title="Activity frequency across recent sessions">
          @for (lvl of activity().bars; track $index) {
            <div class="activity-bar-col" [class]="'level-' + lvl" [style.height.px]="8 + lvl * 9"></div>
          }
        </div>
      </div>
    </div>

    <!-- Main Analytics & Interactive Overview Grid -->
    <div class="grid" style="grid-template-columns:minmax(320px,1.7fr) 1.15fr; gap:20px; align-items:start">
      <!-- Left Column: Skill Breakdown vs Role Requirement -->
      <div class="stack">
        <div class="card">
          <div class="card-title">
            <div>
              <h3 style="margin:0">Skill Coverage vs Role Requirement</h3>
              <p class="small muted" style="margin:2px 0 0">
                Level required for <strong style="color:var(--color-text-primary)">{{ t.goals().position }}</strong> (marker ▌ indicates job threshold)
              </p>
            </div>
            <a routerLink="/app/skills" class="btn btn-ghost btn-sm">All Skills →</a>
          </div>

          <div style="margin-top:14px">
            @for (s of a().stats; track s.cat.id) {
              <a class="skill-row" [routerLink]="['/app/skills', s.cat.id]">
                <div class="row-nowrap" style="gap:8px">
                  <span style="font-size:1.1rem; width:22px; text-align:center">{{ s.cat.icon }}</span>
                  <strong style="font-size:0.88rem; color:var(--color-text-primary)">{{ s.cat.name }}</strong>
                  @if (s.weight === 0) {
                    <span class="badge gray" style="font-size:0.68rem; padding:1px 6px">Optional</span>
                  }
                </div>
                <div class="bar" [class.done]="s.coverage >= 1 && s.weight > 0">
                  <i [style.width.%]="s.pct"></i>
                  @if (s.weight > 0) {
                    <b [style.left.%]="s.weight * 100" title="Required threshold"></b>
                  }
                </div>
                <div style="text-align:right">
                  <strong class="tabular" style="font-size:0.86rem; color:var(--color-text-primary)">{{ s.pct }}%</strong>
                </div>
              </a>
            }
          </div>
        </div>

        <!-- Next Milestones Queue -->
        <div class="card">
          <div class="card-title">
            <div>
              <h3 style="margin:0">Actionable Roadmap Next Steps</h3>
              <p class="small muted" style="margin:2px 0 0">Prioritized sequence based on target role algorithm</p>
            </div>
            <a routerLink="/app/roadmap" class="btn btn-ghost btn-sm">View Timeline →</a>
          </div>

          <div style="margin-top:12px">
            @for (s of nextMilestones(); track s.n) {
              <div style="display:flex; gap:14px; padding:12px 0; border-bottom:1px solid var(--color-border-subtle)">
                <div class="act-dot" style="font-weight:700; font-size:0.82rem">
                  {{ s.n }}
                </div>
                <div class="grow">
                  <div class="row between">
                    <strong style="font-size:0.92rem; color:var(--color-text-primary)">{{ s.title }}</strong>
                    <span class="badge" [class.terracotta]="s.kind==='learn'" [class.green]="s.kind==='project'">
                      {{ s.kind }}
                    </span>
                  </div>
                  <div class="small muted" style="margin-top:3px">
                    Weeks {{ s.weekStart }}–{{ s.weekEnd }} · ~{{ s.hours }}h estimated study
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Right Column: Weekly Focus, Target Companies Pulse, Profile Health -->
      <div class="stack">
        <!-- This Week's Focus -->
        <div class="card">
          <div class="row between" style="margin-bottom:12px">
            <h3 style="margin:0">This Week's Focus</h3>
            <span class="badge terracotta">{{ t.goals().weeklyHours }}h available</span>
          </div>
          <p class="small muted" style="margin-bottom:12px">
            Recommended topics for your weekly study allocation:
          </p>
          <div style="display:flex; flex-direction:column; gap:8px">
            @for (x of weekTopics(); track x.id) {
              <div class="row between" style="padding:8px 10px; background:var(--color-surface-secondary); border-radius:var(--radius-sm)">
                <span style="font-size:0.86rem; font-weight:500; color:var(--color-text-primary)">📘 {{ x.name }}</span>
                <span class="small muted">{{ x.hours }}h</span>
              </div>
            }
            @if (!weekTopics().length) {
              <div class="small muted" style="padding:10px; text-align:center">
                All priority topics complete for this week. Dive into your projects! 🚀
              </div>
            }
          </div>
        </div>

        <!-- Target Companies Pulse -->
        <div class="card">
          <div class="row between" style="margin-bottom:10px">
            <h3 style="margin:0">Target Companies</h3>
            <a routerLink="/app/jobs" class="small">Tracker ({{ t.jobs().length }}) →</a>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px">
            @for (j of topJobs(); track j.id) {
              <div class="row between" style="padding:8px 10px; border-bottom:1px solid var(--color-border-subtle)">
                <div>
                  <strong style="font-size:0.88rem; color:var(--color-text-primary)">{{ j.company }}</strong>
                  <div class="small muted">{{ j.role }}</div>
                </div>
                <span class="badge" [class]="t.jobStatusClass(j.status)">{{ j.status }}</span>
              </div>
            }
            @if (!t.jobs().length) {
              <p class="small muted">No target companies added yet. Track your first target.</p>
            }
          </div>
          <a routerLink="/app/jobs" class="btn btn-ghost btn-sm" style="margin-top:10px; width:100%">
            Manage Job Applications
          </a>
        </div>

        <!-- Profile & Proof Readiness -->
        <div class="card">
          <div class="row between" style="margin-bottom:8px">
            <h3 style="margin:0">Profile & Proof</h3>
            <strong style="color:var(--color-primary)">{{ t.profileCompleteness() }}%</strong>
          </div>
          <div class="bar">
            <i [style.width.%]="t.profileCompleteness()"></i>
          </div>
          <p class="small muted" style="margin:10px 0 12px; font-size:0.82rem">
            Complete GitHub, LinkedIn, uploaded resume, and initial project to maximize interview callbacks.
          </p>
          <a class="btn btn-ghost btn-sm" routerLink="/app/profile" style="width:100%">
            Review Profile
          </a>
        </div>
      </div>
    </div>
  </div>`,
})
export class Dashboard {
  t = inject(TrackerService);
  auth = inject(AuthService);

  a = this.t.analysis;
  userProjects = computed(() => this.t.data()?.projects ?? []);
  activeProjectsCount = computed(() => this.userProjects().filter(p => p.status === 'In progress').length);
  plannedProjectsCount = computed(() => this.userProjects().filter(p => p.status === 'Planned').length);
  totalTopics = computed(() => this.a().stats.reduce((acc, s) => acc + s.total, 0));

  nextMilestones = computed(() => this.t.roadmap().slice(0, 3));
  weeks = computed(() => etaWeeks(this.a().hoursLeft, this.t.goals().weeklyHours));
  finish = computed(() => etaDate(this.weeks()));
  onTrack = computed(() => this.weeks() / 4.345 <= this.t.goals().timelineMonths);
  activity = this.t.codingActivity;
  topJobs = computed(() => this.t.jobs().slice(0, 3));

  firstName = computed(() => {
    const full = this.auth.user()?.name ?? 'Developer';
    return full.split(' ')[0];
  });

  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  });

  weekTopics = computed(() => {
    let budget = this.t.goals().weeklyHours;
    const out: { id: string; name: string; hours: number }[] = [];
    const sorted = [...this.a().stats]
      .filter(s => s.remaining > 0)
      .sort((x, y) => x.cat.stage - y.cat.stage || y.weight - x.weight);

    for (const s of sorted) {
      for (const tp of s.nextTopics) {
        if (budget <= 0) return out;
        out.push(tp);
        budget -= tp.hours;
      }
    }
    return out;
  });
}
