import { Component, computed, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrackerService } from '../services/tracker.service';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="roadmap-page">
      <!-- Header Section -->
      <section class="hd rv" style="--i:1">
        <div>
          <h1>Career Roadmap</h1>
          <p>
            Structured milestones tailored for
            <b>{{ t.goals().position }}</b>
            @if (t.goals().company) {
              at <b>{{ t.goals().company }}</b>
            }
            · {{ t.goals().weeklyHours }}h/week pace
          </p>
        </div>
        <div>
          <a routerLink="/app/calculator" class="btn g">Readiness Calculator →</a>
        </div>
      </section>

      <!-- Timeline Legend Card -->
      <div class="card rv legend-card" style="--i:2">
        <div class="legend-row">
          <div class="legend-item">
            <span class="legend-dot dot-focus"></span>
            <span class="sub">Active Focus Milestone</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot dot-portfolio"></span>
            <span class="sub">Portfolio Milestone</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot dot-career"></span>
            <span class="sub">Application &amp; Career Phase</span>
          </div>
        </div>
      </div>

      <!-- Vertical Timeline Track -->
      <div class="timeline-container">
        @for (s of steps(); track s.n; let i = $index) {
          <div
            class="card rv tl-card"
            [style.--i]="i + 3"
            [class.apply-phase]="s.kind === 'apply'"
          >
            <!-- Step Badge Number -->
            <div class="tl-num-bubble">{{ s.n }}</div>

            <!-- Milestone Header -->
            <div class="tl-header">
              <div class="tl-title-group">
                <span
                  class="chip"
                  [class.green]="s.kind === 'apply'"
                  [class.amber]="s.kind === 'profile'"
                >
                  {{ s.kind }}
                </span>
                <h3 class="milestone-title">{{ s.title }}</h3>
              </div>

              <span class="sub week-badge">
                Week {{ s.weekStart }}{{ s.weekEnd > s.weekStart ? '–' + s.weekEnd : '' }} · {{ s.hours }}h study
              </span>
            </div>

            <p class="sub milestone-desc">
              {{ s.detail }}
            </p>

            <!-- Deliverables Box -->
            @if (s.items.length > 0) {
              <div class="deliverables-box">
                <strong class="deliv-title">Required Deliverables:</strong>
                <ul class="deliv-list">
                  @for (item of s.items; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
              </div>
            }

            <!-- Milestone Action Buttons -->
            <div class="tl-actions">
              @if (s.kind === 'learn') {
                <a class="btn g btn-sm" [routerLink]="['/app/skills', s.catId]">
                  Study These Topics →
                </a>
              }
              @if (s.kind === 'project') {
                <button
                  type="button"
                  class="btn g btn-sm"
                  (click)="t.startProject(s.idea!, s.catId!)"
                  [disabled]="added(s.idea!.id)"
                >
                  {{ added(s.idea!.id) ? 'Added to Portfolio ✓' : '+ Add to My Projects' }}
                </button>
              }
              @if (s.kind === 'profile') {
                <a class="btn g btn-sm" routerLink="/app/profile">
                  Complete Profile Proof →
                </a>
              }
              @if (s.kind === 'apply') {
                <a class="btn p btn-sm" routerLink="/app/jobs">
                  Open Job Applications Tracker →
                </a>
              }
            </div>
          </div>
        }
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

    .legend-card {
      padding: 14px 20px;
      margin-bottom: 24px;
    }

    .legend-row {
      display: flex;
      gap: 24px;
      align-items: center;
      flex-wrap: wrap;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex: none;
    }

    .dot-focus {
      background: var(--db-ac);
    }

    .dot-portfolio {
      background: var(--db-dk);
    }

    .dot-career {
      background: var(--db-gr);
    }

    .timeline-container {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 18px;
      padding-left: 32px;
    }

    .timeline-container::before {
      content: '';
      position: absolute;
      left: 12px;
      top: 24px;
      bottom: 24px;
      width: 2px;
      background: var(--db-ln);
    }

    .tl-card {
      position: relative;
      padding: 22px 24px;
    }

    .tl-num-bubble {
      position: absolute;
      left: -44px;
      top: 20px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--db-ac);
      color: var(--db-on);
      font-family: var(--db-fd);
      font-weight: 700;
      font-size: 13px;
      display: grid;
      place-items: center;
      box-shadow: 0 0 0 4px var(--db-bg);
      z-index: 2;
    }

    .tl-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }

    .tl-title-group {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .milestone-title {
      font-size: 18px;
      font-family: var(--db-fd);
      color: var(--db-ink);
      margin: 0;
    }

    .week-badge {
      font-family: var(--db-fb);
      font-size: 13px;
    }

    .milestone-desc {
      margin: 8px 0 14px;
      line-height: 1.5;
    }

    .deliverables-box {
      background: var(--db-bg);
      border-radius: calc(var(--db-r) * 0.7);
      padding: 12px 16px;
      margin-bottom: 14px;
    }

    .deliv-title {
      font-size: 13px;
      color: var(--db-ink);
      display: block;
      margin-bottom: 6px;
    }

    .deliv-list {
      margin: 0;
      padding-left: 20px;
      font-size: 13px;
      color: var(--db-mu);
    }

    .deliv-list li {
      margin: 4px 0;
    }

    .tl-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    @media (max-width: 640px) {
      .timeline-container {
        padding-left: 0;
      }
      .timeline-container::before {
        display: none;
      }
      .tl-num-bubble {
        position: static;
        margin-bottom: 10px;
        box-shadow: none;
      }
    }
  `],
})
export class Roadmap {
  t = inject(TrackerService);
  steps = this.t.roadmap;

  added(id: string) {
    return this.t.data()!.projects.some(p => p.ideaId === id);
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
