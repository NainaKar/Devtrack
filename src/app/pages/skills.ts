import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrackerService } from '../services/tracker.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="skills-page">
      <!-- Header Section -->
      <section class="hd rv" style="--i:1">
        <div>
          <h1>Skills & Assessments</h1>
          <p>
            Track proficiency across essential engineering areas. Overall completed topics:
            <b>{{ t.done().size }}</b>
            (Coverage: <b>{{ t.overallCoverage() }}%</b>)
          </p>
        </div>
        <div>
          <a routerLink="/app/roadmap" class="btn g">View in Roadmap →</a>
        </div>
      </section>

      <!-- Filter & Search Toolbar Card -->
      <div class="card rv filter-card" style="--i:2">
        <div class="filter-row">
          <div class="search-wrap">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="search"
              placeholder="Search skills or topics..."
              [(ngModel)]="searchQuery"
            />
          </div>

          <div class="pill-tabs" role="tablist">
            <button
              type="button"
              [class.on]="stageFilter() === 'ALL'"
              (click)="stageFilter.set('ALL')"
            >
              All Areas
            </button>
            <button
              type="button"
              [class.on]="stageFilter() === 'REQUIRED'"
              (click)="stageFilter.set('REQUIRED')"
            >
              Role Required
            </button>
            <button
              type="button"
              [class.on]="stageFilter() === 'IN_PROGRESS'"
              (click)="stageFilter.set('IN_PROGRESS')"
            >
              In Progress
            </button>
            <button
              type="button"
              [class.on]="stageFilter() === 'COMPLETED'"
              (click)="stageFilter.set('COMPLETED')"
            >
              Completed
            </button>
          </div>

          <div class="sub count-badge">
            <b>{{ filteredStats().length }}</b> skill domains
          </div>
        </div>
      </div>

      <!-- Skill Domain Cards Grid -->
      <div class="skills-grid">
        @for (s of filteredStats(); track s.cat.id; let idx = $index) {
          <a
            class="card rv skill-card"
            [style.--i]="idx + 3"
            [routerLink]="['/app/skills', s.cat.id]"
          >
            <div class="card-head">
              <div class="domain-icon-bubble">{{ s.cat.icon }}</div>
              @if (s.weight > 0) {
                <span class="chip" [class.green]="s.coverage >= 1">
                  {{ s.coverage >= 1 ? '● Requirement met' : s.remaining + ' required to go' }}
                </span>
              } @else {
                <span class="chip" style="opacity:0.8">Optional for role</span>
              }
            </div>

            <div class="card-body">
              <h3>{{ s.cat.name }}</h3>
              <p class="sub blurb-text">{{ s.cat.blurb }}</p>
            </div>

            <div class="card-footer">
              <!-- Next Topic Callout -->
              @if (s.nextTopics.length > 0) {
                <div class="next-box">
                  <span class="sub">Next:</span>
                  <b>{{ s.nextTopics[0].name }}</b>
                </div>
              } @else {
                <div class="next-box complete">
                  <span>All topics completed in this domain ✓</span>
                </div>
              }

              <!-- Progress Bar & Coverage -->
              <div class="coverage-row sub">
                <span>{{ s.done }} of {{ s.total }} topics complete</span>
                <b class="num-stat">{{ s.pct }}%</b>
              </div>

              <div class="tk">
                <i [style.width.%]="s.pct"></i>
                @if (s.weight > 0) {
                  <u [style.left.%]="s.weight * 100" title="Job requirement threshold"></u>
                }
              </div>
            </div>
          </a>
        } @empty {
          <div class="card rv empty-state" style="--i:3">
            <p class="sub">No skills match your search or filter. Try clearing the filter.</p>
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

    /* Filter Card */
    .filter-card {
      padding: 14px 20px;
      margin-bottom: 22px;
    }

    .filter-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .search-wrap {
      position: relative;
      display: flex;
      align-items: center;
      min-width: 240px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      width: 16px;
      height: 16px;
      color: var(--db-mu);
      pointer-events: none;
    }

    .search-wrap input {
      width: 100%;
      padding-left: 36px !important;
      border-radius: 99px !important;
    }

    .pill-tabs {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .pill-tabs button {
      background: var(--db-bg);
      border: 1px solid var(--db-ln);
      color: var(--db-mu);
      font-family: var(--db-fb);
      font-weight: 500;
      font-size: 13px;
      padding: 6px 14px;
      border-radius: 99px;
      cursor: pointer;
      transition: all .2s ease;
    }

    .pill-tabs button:hover {
      background: #fff;
      color: var(--db-ink);
    }

    .pill-tabs button.on {
      background: var(--db-ac);
      border-color: var(--db-ac);
      color: var(--db-on);
      font-weight: 600;
    }

    .count-badge {
      font-size: 13px;
    }

    /* Grid */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 18px;
    }

    .skill-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-decoration: none;
      color: inherit;
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }

    .domain-icon-bubble {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--db-bg);
      display: grid;
      place-items: center;
      font-size: 1.4rem;
      border: 1px solid var(--db-ln);
    }

    .card-body h3 {
      font-size: 19px;
      font-family: var(--db-fd);
      margin-bottom: 6px;
      color: var(--db-ink);
    }

    .blurb-text {
      min-height: 40px;
      line-height: 1.45;
      margin-bottom: 16px;
    }

    .next-box {
      padding: 8px 12px;
      background: var(--db-bg);
      border-radius: calc(var(--db-r) * 0.7);
      margin-bottom: 12px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .next-box b {
      color: var(--db-ink);
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .next-box.complete {
      background: rgba(38, 74, 58, .12);
      color: var(--db-gr);
      font-weight: 600;
    }

    .coverage-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .num-stat {
      font-family: var(--db-fd);
      color: var(--db-ink);
      font-weight: 700;
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

    .tk u {
      position: absolute;
      top: -4px;
      width: 3px;
      height: 18px;
      background: var(--db-ink);
      border-radius: 2px;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 48px;
    }

    @media (max-width: 768px) {
      .filter-row {
        flex-direction: column;
        align-items: stretch;
      }
      .search-wrap {
        width: 100%;
      }
    }
  `],
})
export class Skills {
  t = inject(TrackerService);
  searchQuery = '';
  stageFilter = signal<'ALL' | 'REQUIRED' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  filteredStats = computed(() => {
    const list = this.t.analysis().stats;
    const q = this.searchQuery.trim().toLowerCase();
    const filter = this.stageFilter();

    return list.filter(s => {
      const matchSearch =
        !q ||
        s.cat.name.toLowerCase().includes(q) ||
        s.cat.blurb.toLowerCase().includes(q);
      if (!matchSearch) return false;

      if (filter === 'REQUIRED') return s.weight > 0;
      if (filter === 'IN_PROGRESS') return s.pct > 0 && s.pct < 100;
      if (filter === 'COMPLETED') return s.pct === 100;
      return true;
    });
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
