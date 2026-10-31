import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TrackerService } from '../services/tracker.service';
import { COMPANY_GROUPS, COMPANY_SUGGESTIONS, ROLE_GROUPS, ROLES, TIERS, TIMELINES } from '../data/roles.data';
import { analyze, etaDate, etaWeeks } from '../engine';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [FormsModule, DatePipe, DecimalPipe],
  template: `
    <div class="calculator-page">
      <!-- Header Section -->
      <section class="hd rv" style="--i:1">
        <div>
          <h1>Readiness &amp; Timeline Calculator</h1>
          <p>
            Model "what-if" scenarios: see how varying target companies, weekly hours, and timelines impact your path to becoming job-ready.
          </p>
        </div>
      </section>

      <div class="calc-grid">
        <!-- Scenario Control Inputs -->
        <div class="card rv control-card" style="--i:2">
          <h2>Scenario Controls</h2>

          <div class="form-group" style="margin-top:16px">
            <label for="calc-role">Target Role</label>
            <select id="calc-role" [ngModel]="roleId()" (ngModelChange)="roleId.set($event)">
              @for (grp of roleGroups; track grp.name) {
                <optgroup [label]="grp.name">
                  @for (r of grp.roles; track r.id) {
                    <option [value]="r.id">{{ r.icon }} {{ r.name }}</option>
                  }
                </optgroup>
              }
            </select>
          </div>

          <div class="form-group">
            <label for="calc-company">Target Company Profile</label>
            <input
              id="calc-company"
              type="text"
              list="calc-cos"
              [ngModel]="company()"
              (ngModelChange)="company.set($event)"
              placeholder="e.g. Google, TCS, Zoho, or startup"
            />
            <datalist id="calc-cos">
              @for (cg of companyGroups; track cg.group) {
                @for (c of cg.companies; track c) {
                  <option [value]="c">{{ cg.group }}</option>
                }
              }
            </datalist>
          </div>

          <div class="form-group">
            <label for="calc-tier">Company Tier</label>
            <select id="calc-tier" [ngModel]="tier()" (ngModelChange)="tier.set($event)">
              <option value="">Auto-detect from company</option>
              @for (t of tiers; track t) {
                <option [value]="t">{{ t }}</option>
              }
            </select>
          </div>

          <div class="form-group">
            <div class="row between">
              <label for="calc-hours">Study Commitment</label>
              <strong class="hours-badge">{{ hours() }} h/week</strong>
            </div>
            <input
              id="calc-hours"
              class="range-slider"
              type="range"
              min="2"
              max="60"
              [ngModel]="hours()"
              (ngModelChange)="hours.set(+$event)"
            />
          </div>

          <div class="form-group">
            <label for="calc-timeline">Goal Timeline</label>
            <select id="calc-timeline" [ngModel]="timeline()" (ngModelChange)="timeline.set(+$event)">
              @for (m of timelines; track m) {
                <option [ngValue]="m">{{ m }} months</option>
              }
            </select>
          </div>

          <button
            type="button"
            class="btn g btn-sm"
            style="width:100%; margin-top:12px"
            (click)="reset()"
          >
            ↺ Reset to Active Goal
          </button>
        </div>

        <!-- Results & Breakdown Stack -->
        <div class="results-stack">
          <!-- 4 Stats Row -->
          <div class="stats-grid">
            <div class="card rv stat-card" style="--i:3">
              <span class="sub">Current Readiness</span>
              <div class="num">{{ a().readiness }}%</div>
            </div>
            <div class="card rv stat-card" style="--i:4">
              <span class="sub">Topics Remaining</span>
              <div class="num">{{ a().topicsLeft }}</div>
            </div>
            <div class="card rv stat-card" style="--i:5">
              <span class="sub">Projects Left</span>
              <div class="num">{{ a().projectsLeft }}</div>
            </div>
            <div class="card rv stat-card" style="--i:6">
              <span class="sub">Total Study Hours</span>
              <div class="num">{{ a().hoursLeft }}<small>h</small></div>
            </div>
          </div>

          <!-- Feasibility Status Banner Card -->
          <div
            class="card rv feasibility-banner"
            style="--i:7"
            [class.banner-ok]="ok()"
            [class.banner-warn]="!ok()"
          >
            @if (a().hoursLeft === 0) {
              <h3 class="banner-title">🎉 You meet every requirement for this scenario!</h3>
              <p class="sub" style="margin:0">Ready to start interviews and portfolio demonstrations.</p>
            } @else {
              <h3 class="banner-title">
                {{ ok() ? '● Schedule is Feasible on Current Pace' : '▲ Adjustment Needed to Meet Target' }}
              </h3>
              <p class="banner-text">
                At <b>{{ hours() }} hours/week</b>, you will need approximately
                <b>{{ weeks() }} weeks</b> ({{ weeks() / 4.345 | number:'1.1-1' }} months) to reach job readiness
                → expected finish by <b>{{ finish() | date:'mediumDate' }}</b>.
                @if (!ok()) {
                  <span class="adjust-note">
                    To complete within your {{ timeline() }}-month deadline, increase your study time to {{ needed() }} hours/week.
                  </span>
                }
              </p>
            }
          </div>

          <!-- Breakdown Domain Table Card -->
          <div class="card rv breakdown-card" style="--i:8">
            <div class="row between" style="margin-bottom:14px">
              <h2>Domain Breakdown</h2>
              <span class="chip">Role tier: {{ a().tier }}</span>
            </div>

            <div class="table-scroll">
              <table class="breakdown-table">
                <thead>
                  <tr>
                    <th>Domain</th>
                    <th>Required Topics</th>
                    <th>Completed</th>
                    <th>Remaining</th>
                    <th style="text-align:right">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  @for (s of rows(); track s.cat.id) {
                    <tr>
                      <td>
                        <span style="margin-right:8px">{{ s.cat.icon }}</span>
                        <strong>{{ s.cat.name }}</strong>
                      </td>
                      <td>{{ s.needed }} / {{ s.total }}</td>
                      <td><b>{{ s.done }}</b></td>
                      <td>
                        <span
                          class="chip"
                          [class.green]="s.remaining === 0"
                        >
                          {{ s.remaining }} to go
                        </span>
                      </td>
                      <td style="text-align:right">
                        <b>{{ s.hoursLeft }}h</b>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
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
      max-width: 780px;
    }

    .calc-grid {
      display: grid;
      grid-template-columns: minmax(280px, 1fr) 2fr;
      align-items: start;
      gap: 20px;
    }

    .control-card {
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

    .results-stack {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }

    .stat-card {
      padding: 18px;
    }

    .stat-card .num {
      font-size: 36px;
      margin-top: 8px;
    }

    .stat-card .num small {
      font-size: 18px;
      color: var(--db-mu);
    }

    /* Feasibility Banner */
    .feasibility-banner {
      padding: 20px;
    }

    .banner-ok {
      background: rgba(38, 74, 58, .12) !important;
      border-color: rgba(38, 74, 58, .3) !important;
      border-top-color: var(--db-gr) !important;
    }

    .banner-ok .banner-title {
      color: var(--db-gr);
    }

    .banner-warn {
      background: rgba(180, 86, 31, .1) !important;
      border-color: var(--db-ac2) !important;
      border-top-color: var(--db-ac) !important;
    }

    .banner-warn .banner-title {
      color: var(--db-ac);
    }

    .banner-title {
      font-size: 18px;
      margin-bottom: 8px;
    }

    .banner-text {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      color: var(--db-ink);
    }

    .adjust-note {
      display: block;
      margin-top: 8px;
      font-weight: 600;
    }

    /* Breakdown Table */
    .breakdown-card {
      padding: 22px;
    }

    .table-scroll {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .breakdown-table {
      width: 100%;
      min-width: 500px;
      border-collapse: collapse;
      font-size: 14px;
      text-align: left;
    }

    .breakdown-table th {
      padding: 10px 14px;
      background: var(--db-bg);
      color: var(--db-mu);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--db-ln);
    }

    .breakdown-table td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--db-ln);
      color: var(--db-ink);
    }

    @media (max-width: 900px) {
      .calc-grid {
        grid-template-columns: 1fr;
      }
      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 600px) {
      .hd {
        margin: 4px 0 18px;
      }
      .control-card {
        padding: 18px;
      }
      .breakdown-card {
        padding: 16px;
      }
    }

    @media (max-width: 500px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class Calculator {
  t = inject(TrackerService);
  roles = ROLES;
  roleGroups = ROLE_GROUPS;
  timelines = TIMELINES;
  companyGroups = COMPANY_GROUPS;
  tiers = TIERS;

  roleId = signal(this.t.goals().roleId);
  company = signal(this.t.goals().company);
  tier = signal<string>(this.t.goals().customTier || '');
  hours = signal(this.t.goals().weeklyHours);
  timeline = signal(this.t.goals().timelineMonths);

  a = computed(() => {
    const role = ROLES.find(r => r.id === this.roleId()) ?? ROLES[0];
    const g = this.t.goals();
    return analyze(role, this.company(), g.level, this.t.done(), this.t.completedProjects(), this.tier() || undefined);
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
    this.tier.set(g.customTier || '');
    this.hours.set(g.weeklyHours);
    this.timeline.set(g.timelineMonths);
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
