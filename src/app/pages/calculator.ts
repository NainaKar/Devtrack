import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TrackerService } from '../services/tracker.service';
import { ROLES, TIMELINES } from '../data/roles.data';
import { analyze, etaDate, etaWeeks } from '../engine';

@Component({
  selector: 'app-calculator',
  imports: [FormsModule, DatePipe, DecimalPipe],
  template: `
  <div class="page">
    <div class="page-head">
      <h1>Readiness & Timeline Calculator</h1>
      <p class="muted">
        Model "what-if" scenarios: see how varying target companies, weekly hours, and timelines impact your path to becoming job-ready.
      </p>
    </div>

    <div class="grid" style="grid-template-columns:minmax(280px,1fr) 2fr; align-items:start; gap:20px">
      <!-- Scenario Control Inputs -->
      <div class="card">
        <h3 style="margin-bottom:14px">Scenario Controls</h3>

        <div class="field">
          <label for="calc-role">Target Role</label>
          <select id="calc-role" [ngModel]="roleId()" (ngModelChange)="roleId.set($event)">
            @for (r of roles; track r.id) {
              <option [value]="r.id">{{ r.name }}</option>
            }
          </select>
        </div>

        <div class="field">
          <label for="calc-company">Target Company Profile</label>
          <input
            id="calc-company"
            type="text"
            [ngModel]="company()"
            (ngModelChange)="company.set($event)"
            placeholder="e.g. Google, Stripe, or a startup"
          >
        </div>

        <div class="field">
          <div class="row between">
            <label for="calc-hours">Study Commitment</label>
            <strong class="tabular" style="color:var(--color-primary)">{{ hours() }} h/week</strong>
          </div>
          <input
            id="calc-hours"
            type="range"
            min="2"
            max="60"
            [ngModel]="hours()"
            (ngModelChange)="hours.set(+$event)"
          >
        </div>

        <div class="field">
          <label for="calc-timeline">Goal Timeline</label>
          <select id="calc-timeline" [ngModel]="timeline()" (ngModelChange)="timeline.set(+$event)">
            @for (m of timelines; track m) {
              <option [ngValue]="m">{{ m }} months</option>
            }
          </select>
        </div>

        <button class="btn btn-secondary btn-sm" style="width:100%; margin-top:8px" (click)="reset()">
          ↺ Reset to Active Goal
        </button>
      </div>

      <!-- Results & Breakdown -->
      <div class="stack">
        <!-- 4 Metrics Row -->
        <div class="grid g4">
          <div class="card stat">
            <span class="v">{{ a().readiness }}%</span>
            <span class="l">Current Readiness</span>
          </div>
          <div class="card stat">
            <span class="v">{{ a().topicsLeft }}</span>
            <span class="l">Topics Remaining</span>
          </div>
          <div class="card stat">
            <span class="v">{{ a().projectsLeft }}</span>
            <span class="l">Projects Left</span>
          </div>
          <div class="card stat">
            <span class="v">{{ a().hoursLeft }}h</span>
            <span class="l">Total Study Hours</span>
          </div>
        </div>

        <!-- Feasibility Status Banner -->
        <div
          class="card"
          [style.background]="ok() ? 'var(--color-success-bg)' : 'var(--color-warning-bg)'"
          [style.border-color]="ok() ? '#D3D4BC' : '#EBD3BB'"
        >
          @if (a().hoursLeft === 0) {
            <h3 style="margin:0 0 6px; color:var(--color-success-text)">🎉 You meet every requirement for this scenario!</h3>
            <p class="small" style="margin:0; color:var(--color-success-text)">Ready to start interviews and portfolio demonstrations.</p>
          } @else {
            <h3 style="margin:0 0 6px" [style.color]="ok() ? 'var(--color-success-text)' : 'var(--color-warning-text)'">
              {{ ok() ? '● Schedule is Feasible on Current Pace' : '▲ Adjustment Needed to Meet Target' }}
            </h3>
            <p style="margin:0; font-size:0.92rem" [style.color]="ok() ? 'var(--color-success-text)' : 'var(--color-warning-text)'">
              At <strong>{{ hours() }} hours/week</strong>, you will need approximately
              <strong>{{ weeks() }} weeks</strong> ({{ weeks() / 4.345 | number:'1.1-1' }} months) to reach job readiness
              → expected finish by <strong>{{ finish() | date:'mediumDate' }}</strong>.
              @if (!ok()) {
                <span style="display:block; margin-top:6px; font-weight:600">
                  To complete within your {{ timeline() }}-month deadline, increase your study time to {{ needed() }} hours/week.
                </span>
              }
            </p>
          }
        </div>

        <!-- Breakdown Table -->
        <div class="card">
          <div class="row between" style="margin-bottom:12px">
            <h3 style="margin:0">Domain Breakdown</h3>
            <span class="small muted">Role tier: {{ a().tier }}</span>
          </div>
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Required Topics</th>
                  <th>Completed</th>
                  <th>Remaining</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                @for (s of rows(); track s.cat.id) {
                  <tr>
                    <td>
                      <span style="margin-right:6px">{{ s.cat.icon }}</span>
                      <strong>{{ s.cat.name }}</strong>
                    </td>
                    <td class="tabular">{{ s.needed }} / {{ s.total }}</td>
                    <td class="tabular">{{ s.done }}</td>
                    <td>
                      <span class="badge" [class.green]="s.remaining===0" [class.amber]="s.remaining>0">
                        {{ s.remaining }} to go
                      </span>
                    </td>
                    <td class="tabular">{{ s.hoursLeft }}h</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>`,
})
export class Calculator {
  t = inject(TrackerService);
  roles = ROLES;
  timelines = TIMELINES;

  roleId = signal(this.t.goals().roleId);
  company = signal(this.t.goals().company);
  hours = signal(this.t.goals().weeklyHours);
  timeline = signal(this.t.goals().timelineMonths);

  a = computed(() => {
    const role = ROLES.find(r => r.id === this.roleId())!;
    const g = this.t.goals();
    return analyze(role, this.company(), g.level, this.t.done(), this.t.completedProjects());
  });

  rows = computed(() => this.a().stats.filter(s => s.needed > 0));
  weeks = computed(() => etaWeeks(this.a().hoursLeft, this.hours()));
  finish = computed(() => etaDate(this.weeks()));
  ok = computed(() => this.weeks() / 4.345 <= this.timeline());
  needed = computed(() => Math.ceil(this.a().hoursLeft / (this.timeline() * 4.345)));

  reset() {
    const g = this.t.goals();
    this.roleId.set(g.roleId);
    this.company.set(g.company);
    this.hours.set(g.weeklyHours);
    this.timeline.set(g.timelineMonths);
  }
}
