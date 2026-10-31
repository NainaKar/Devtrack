import { Component, computed, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TrackerService } from '../services/tracker.service';
import { AuthService } from '../services/auth.service';
import { etaDate, etaWeeks } from '../engine';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <!-- Header / Hero Section -->
    <section class="hd rv" style="--i:1">
      <div>
        <h1>{{ greeting() }}, {{ firstName() }}</h1>
        <p>
          Your developer journey, all in one place · Goal:
          <b>{{ t.goals().position }}</b>
          @if (t.goals().company) {
            at <b>{{ t.goals().company }}</b>
          }
          · {{ a().tier }} profile
        </p>
      </div>
      <div class="hd-actions">
        <a class="btn g" routerLink="/app/jobs">Target Jobs ({{ t.jobs().length }})</a>
        <a class="btn p" routerLink="/app/skills">+ Update Progress</a>
      </div>
    </section>

    <!-- 4 High-Craft Stat Cards -->
    <section class="st">
      <!-- 1. Career Readiness -->
      <div class="card rv" style="--i:2">
        <h3>Career Readiness <span>📈</span></h3>
        <div class="num">
          <span>{{ a().readiness }}%</span>
        </div>
        <span class="chip" [class.green]="onTrack()">
          {{ onTrack() ? '● On track' : '▲ Needs more time' }}
        </span>
        <div class="sub">
          @if (a().readiness >= 90) {
            Ready to apply to target roles 🎉
          } @else {
            Estimated target: <b>{{ finish() | date:'mediumDate' }}</b>
          }
        </div>
        <div class="ring" [style.--v]="a().readiness" [attr.data-t]="a().readiness + '%'"></div>
      </div>

      <!-- 2. Skills & Topics -->
      <div class="card rv" style="--i:3">
        <h3>Skills &amp; Topics <span>📖</span></h3>
        <div class="num">
          <span>{{ t.done().size }}</span> <small>/ {{ totalTopics() }}</small>
        </div>
        <div class="sub">{{ a().topicsLeft }} required topics remaining</div>
        <div class="tk" style="margin-top:12px">
          <i [style.width.%]="t.overallCoverage()"></i>
        </div>
        <div class="row sub" style="margin-top:6px">
          <span>Coverage</span>
          <b>{{ t.overallCoverage() }}%</b>
        </div>
      </div>

      <!-- 3. Proof of Work -->
      <div class="card rv" style="--i:4">
        <h3>Proof of Work <span>📁</span></h3>
        <div class="num">
          <span>{{ a().projectsDone }}</span> <small>/ {{ a().projectsNeeded }}</small>
        </div>
        <div>
          <span class="chip">{{ userProjects().length }} tracked</span>
          <span class="chip">{{ activeProjectsCount() }} active</span>
        </div>
        <div class="sub">
          {{ a().projectsDone >= a().projectsNeeded ? 'Role project quota completed ✓' : (a().projectsNeeded - a().projectsDone) + ' projects needed for role' }}
        </div>
      </div>

      <!-- 4. Tracked Activity -->
      <div class="card rv" style="--i:5">
        <h3>Tracked Activity <span>🕘</span></h3>
        <div class="num">
          <span>{{ activity().currentStreak }}</span> <small>day streak</small>
        </div>
        <div class="sub">{{ activity().totalSessions }} recorded study sessions</div>
        <div class="bars">
          @for (lvl of activity().bars; track $index) {
            <i [style.height.%]="16 + lvl * 28" [style.--k]="$index"></i>
          }
        </div>
      </div>
    </section>

    <!-- Main Analytics 2-Column Body -->
    <section class="bd">
      <!-- Left Column: Skill Coverage vs Role Requirement -->
      <div>
        <div class="card rv" style="--i:6">
          <div class="row">
            <div>
              <h2>Skill Coverage vs Role Requirement</h2>
              <div class="sub">
                Level required for <b>{{ t.goals().position }}</b> (marker | indicates job threshold)
              </div>
            </div>
            <a class="btn g" style="margin:0" routerLink="/app/skills">All Skills →</a>
          </div>

          <div style="margin-top:14px">
            @for (s of a().stats; track s.cat.id) {
              <a class="sk" [routerLink]="['/app/skills', s.cat.id]">
                <span>{{ s.cat.icon }} {{ s.cat.name }}</span>
                <div class="tk">
                  <i [style.width.%]="s.pct"></i>
                  @if (s.weight > 0) {
                    <u [style.left.%]="s.weight * 100" title="Job requirement threshold"></u>
                  }
                </div>
                <em>{{ s.pct }}%</em>
              </a>
            }
          </div>
        </div>
      </div>

      <!-- Right Column: Focus & Companies -->
      <div>
        <!-- This Week's Focus -->
        <div class="card rv" style="--i:7">
          <div class="row">
            <h2>This Week's Focus</h2>
            <span class="chip">{{ t.goals().weeklyHours }}h available</span>
          </div>
          <div class="sub" style="margin-top:8px">
            Recommended topics for your weekly study allocation:
          </div>

          @for (x of weekTopics(); track x.id) {
            <div class="fr">
              <span>📘 {{ x.name }}</span>
              <span>{{ x.hours }}h</span>
            </div>
          }
          @if (!weekTopics().length) {
            <div class="sub" style="padding:12px 0">
              All priority topics complete for this week. Dive into your projects! 🚀
            </div>
          }
        </div>

        <!-- Target Companies -->
        <div class="card rv" style="--i:8">
          <div class="row">
            <h2>Target Companies</h2>
            <a class="lnk" routerLink="/app/jobs">Tracker ({{ t.jobs().length }}) →</a>
          </div>

          @for (j of topJobs(); track j.id) {
            <div class="fr">
              <span>
                <b>{{ j.company }}</b><br>
                <span class="sub">{{ j.role }}</span>
              </span>
              <span class="chip">{{ j.status }}</span>
            </div>
          }
          @if (!t.jobs().length) {
            <div class="sub" style="padding:12px 0">
              No target companies added yet. Track your first target role!
            </div>
          }
        </div>
      </div>
    </section>
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
      margin: 10px 0 26px;
    }

    .hd h1 {
      font-size: clamp(32px, 4vw, 52px);
      line-height: 1.05;
      font-family: var(--db-fd);
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--db-ink);
    }

    .hd p {
      color: var(--db-mu);
      margin: 8px 0 0;
      font-size: 15px;
    }

    .hd p b {
      color: var(--db-ink);
    }

    .hd-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .st {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .st .card h3 {
      font: 500 15px var(--db-fb);
      color: var(--db-mu);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 0 10px;
    }

    .num {
      font: 700 44px/1.1 var(--db-fd);
      margin: 10px 0 4px;
      letter-spacing: -0.04em;
      color: var(--db-ink);
    }

    .num small {
      font: 400 16px var(--db-fb);
      color: var(--db-mu);
    }

    .sub {
      color: var(--db-mu);
      font-size: 13px;
    }

    .st .card:first-child .chip {
      margin-top: 30px;
    }

    .st .card:first-child .num {
      padding-right: 80px;
    }

    .ring {
      --v: 0;
      width: 76px;
      aspect-ratio: 1;
      border-radius: 50%;
      background: conic-gradient(var(--db-ac) calc(var(--v) * 1%), var(--db-ac2) 0);
      display: grid;
      place-items: center;
      position: absolute;
      right: 20px;
      top: 46px;
      box-shadow: 0 4px 14px rgba(180, 86, 31, .15);
    }

    .ring::after {
      content: attr(data-t);
      width: 76%;
      aspect-ratio: 1;
      border-radius: 50%;
      background: var(--db-sf);
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 14px;
      font-family: var(--db-fd);
      color: var(--db-ink);
    }

    .bars {
      display: flex;
      gap: 5px;
      align-items: flex-end;
      height: 46px;
      margin-top: 10px;
    }

    .bars i {
      flex: 1;
      background: var(--db-ac2);
      border-radius: 4px;
      transform-origin: bottom;
      transition: height .3s ease;
    }

    .bars i:nth-child(3n) {
      background: var(--db-ac);
    }

    .bd {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }

    .bd > div {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sk {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 13px 0;
      border-top: 1px solid var(--db-ln);
      text-decoration: none;
      color: inherit;
      transition: transform .2s ease;
    }

    .sk:hover {
      transform: translateX(4px);
    }

    .sk > span:first-child {
      width: 190px;
      font-weight: 500;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tk {
      flex: 1;
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

    .tk u {
      position: absolute;
      top: -4px;
      width: 3px;
      height: 18px;
      background: var(--db-ink);
      border-radius: 2px;
    }

    .sk em {
      font-style: normal;
      width: 42px;
      text-align: right;
      font-weight: 600;
      font-size: 14px;
      font-family: var(--db-fd);
    }

    .fr {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--db-bg);
      border-radius: calc(var(--db-r) * .6);
      padding: 13px 16px;
      margin-top: 10px;
      font-weight: 500;
      transition: transform .25s ease;
      text-decoration: none;
      color: inherit;
    }

    .fr:hover {
      transform: translateX(6px);
    }

    .fr span:last-child {
      color: var(--db-mu);
    }

    .card h2 {
      font-size: 22px;
      font-family: var(--db-fd);
    }

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    @media (max-width: 1000px) {
      .st {
        grid-template-columns: 1fr 1fr;
      }
      .bd {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 560px) {
      .st {
        grid-template-columns: 1fr;
      }
      .sk > span:first-child {
        width: 120px;
      }
      .hd-actions {
        width: 100%;
        justify-content: flex-start;
      }
    }
  `],
})
export class Dashboard {
  t = inject(TrackerService);
  auth = inject(AuthService);

  a = this.t.analysis;
  userProjects = computed(() => this.t.data()?.projects ?? []);
  activeProjectsCount = computed(() => this.userProjects().filter(p => p.status === 'In progress').length);
  totalTopics = computed(() => this.a().stats.reduce((acc, s) => acc + s.total, 0));

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
