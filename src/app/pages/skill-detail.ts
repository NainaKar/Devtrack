import { Component, computed, HostListener, inject, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TrackerService } from '../services/tracker.service';
import { CAT_BY_ID } from '../data/skills.data';

@Component({
  selector: 'app-skill-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    @if (cat(); as c) {
      <div class="skill-detail-page">
        <!-- Back Link -->
        <a routerLink="/app/skills" class="lnk back-link rv" style="--i:0">
          ← Back to all skills
        </a>

        <!-- Header Section -->
        <section class="hd rv" style="--i:1">
          <div class="domain-header-left">
            <div class="domain-avatar">{{ c.icon }}</div>
            <div>
              <h1>{{ c.name }}</h1>
              <p class="sub domain-blurb">{{ c.blurb }}</p>
            </div>
          </div>

          <!-- Overall Domain Stat Card -->
          <div class="card domain-stat-card">
            <div class="row between">
              <strong class="pct-text">{{ stat()?.pct }}% complete</strong>
              <span class="sub">{{ stat()?.done }} / {{ stat()?.total }} topics</span>
            </div>
            <div class="tk" style="margin-top:10px">
              <i [style.width.%]="stat()?.pct"></i>
              @if (stat()!.weight > 0) {
                <u [style.left.%]="stat()!.weight * 100" title="Target threshold"></u>
              }
            </div>
            <p class="sub req-note">
              {{ stat()!.weight > 0 ? 'Goal requirement: ' + stat()!.needed + ' topics (' + (stat()!.weight * 100 | number:'1.0-0') + '%)' : 'Optional enrichment for role' }}
            </p>
          </div>
        </section>

        <!-- Main Content 2-Column Grid -->
        <div class="detail-grid">
          <!-- Left Column: Topics Accordion List -->
          <div class="topics-column">
            <div class="row between section-title-row">
              <h2>Domain Topics ({{ c.topics.length }})</h2>
              <span class="sub">Click any topic to view key study points</span>
            </div>

            <div class="topics-list">
              @for (tp of c.topics; track tp.id; let i = $index) {
                <div class="card rv topic-card" [style.--i]="i + 2" [class.done]="t.done().has(tp.id)">
                  <div class="topic-header" (click)="toggleOpen(tp.id)">
                    <button
                      type="button"
                      class="check-bubble"
                      [class.checked]="t.done().has(tp.id)"
                      (click)="$event.stopPropagation(); t.toggleTopic(tp.id)"
                      [attr.aria-label]="'Mark ' + tp.name + ' complete'"
                      [attr.aria-pressed]="t.done().has(tp.id)"
                    >
                      ✓
                    </button>

                    <div class="topic-title-box">
                      <strong class="topic-name">{{ i + 1 }}. {{ tp.name }}</strong>
                      <div class="sub">~{{ tp.hours }}h study time</div>
                    </div>

                    <span class="toggle-arrow" aria-hidden="true">
                      {{ open() === tp.id ? '▲' : '▼' }}
                    </span>
                  </div>

                  @if (open() === tp.id) {
                    <div class="topic-content">
                      <p class="topic-summary">{{ tp.summary }}</p>
                      <strong class="checklist-title">Key Concept Checklist:</strong>
                      <ul class="concept-points">
                        @for (p of tp.points; track p) {
                          <li>{{ p }}</li>
                        }
                      </ul>
                      <div class="tip-box">
                        💡 <strong>Implementation Tip:</strong> Solidify this concept by building a focused 1-hour code sample or answering 2 mock questions with the AI Mentor.
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Right Column: Resources & Project Ideas -->
          <div class="sidebar-column">
            <!-- Curated Resources Card -->
            <div class="card rv" style="--i:3">
              <h2>Curated Resources</h2>
              <div class="resource-stack">
                @for (r of c.resources; track r.url) {
                  <a
                    [href]="r.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="fr"
                  >
                    <span>{{ r.title }}</span>
                    <span class="lnk">↗</span>
                  </a>
                }
              </div>
            </div>

            <!-- Portfolio Projects Card -->
            <div class="card rv" style="--i:4">
              <h2>Portfolio Project Ideas</h2>
              <div class="sub" style="margin:4px 0 14px">Build tangible proof for your resume:</div>

              <div class="project-ideas-stack">
                @for (p of c.projects; track p.id) {
                  <div class="idea-box">
                    <div class="row between">
                      <strong>{{ p.title }}</strong>
                      <span
                        class="chip"
                        [class.green]="p.level === 'Beginner'"
                      >
                        {{ p.level }}
                      </span>
                    </div>
                    <p class="sub idea-desc">{{ p.desc }}</p>
                    <div class="sub tech-stack">
                      {{ p.stack.join(' · ') }}
                    </div>

                    @if (added(p.id)) {
                      <span class="chip green">In your projects ✓</span>
                    } @else {
                      <button
                        type="button"
                        class="btn g btn-sm"
                        style="width:100%; margin-top:8px"
                        (click)="t.startProject(p, c.id)"
                      >
                        + Add to my projects
                      </button>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="skill-detail-page">
        <div class="card empty-state">
          <p class="sub">Skill domain not found. <a routerLink="/app/skills" class="lnk">Back to skills</a></p>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      margin-bottom: 14px;
    }

    .hd {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .domain-header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .domain-avatar {
      width: 58px;
      height: 58px;
      border-radius: 14px;
      background: var(--db-sf);
      border: 1px solid var(--db-ln);
      border-top: 3px solid var(--db-ac);
      display: grid;
      place-items: center;
      font-size: 1.8rem;
      flex: none;
    }

    .hd h1 {
      font-size: clamp(28px, 3.5vw, 42px);
      line-height: 1.1;
      font-family: var(--db-fd);
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--db-ink);
    }

    .domain-blurb {
      max-width: 620px;
      margin-top: 4px;
    }

    .domain-stat-card {
      min-width: 260px;
      padding: 16px 20px;
    }

    .pct-text {
      font-family: var(--db-fd);
      color: var(--db-ink);
      font-size: 16px;
    }

    .req-note {
      margin-top: 8px;
      font-size: 12px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: minmax(300px, 2fr) minmax(280px, 1.15fr);
      gap: 20px;
      align-items: start;
    }

    .section-title-row {
      margin-bottom: 14px;
    }

    .topics-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .topic-card {
      padding: 16px 18px;
      transition: all .25s ease;
    }

    .topic-header {
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
    }

    .check-bubble {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1.5px solid var(--db-ln);
      background: var(--db-bg);
      color: transparent;
      display: grid;
      place-items: center;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      flex: none;
      transition: all .2s ease;
    }

    .check-bubble.checked {
      background: var(--db-ac);
      border-color: var(--db-ac);
      color: var(--db-on);
    }

    .topic-title-box {
      flex: 1;
    }

    .topic-name {
      font-size: 15px;
      color: var(--db-ink);
    }

    .toggle-arrow {
      color: var(--db-mu);
      font-size: 11px;
      padding: 4px;
    }

    .topic-content {
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid var(--db-ln);
    }

    .topic-summary {
      color: var(--db-ink);
      font-size: 14px;
      margin-bottom: 12px;
    }

    .checklist-title {
      font-size: 13px;
      color: var(--db-ac);
      display: block;
      margin-bottom: 6px;
    }

    .concept-points {
      margin: 0 0 12px;
      padding-left: 20px;
      font-size: 14px;
      color: var(--db-ink);
    }

    .concept-points li {
      margin: 4px 0;
    }

    .tip-box {
      font-size: 13px;
      padding: 10px 14px;
      background: var(--db-bg);
      border-radius: calc(var(--db-r) * 0.7);
      color: var(--db-ink);
    }

    .sidebar-column {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .resource-stack {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 12px;
    }

    .project-ideas-stack {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .idea-box {
      padding: 14px;
      border: 1px solid var(--db-ln);
      border-radius: var(--db-r);
      background: var(--db-bg);
    }

    .idea-desc {
      margin: 6px 0 8px;
      line-height: 1.45;
    }

    .tech-stack {
      margin-bottom: 8px;
      font-size: 12px;
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

    @media (max-width: 900px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class SkillDetail {
  id = input.required<string>();
  t = inject(TrackerService);
  open = signal<string | null>(null);
  cat = computed(() => CAT_BY_ID.get(this.id()));
  stat = computed(() => this.t.analysis().stats.find(s => s.cat.id === this.id()));
  toggleOpen(id: string) { this.open.set(this.open() === id ? null : id); }
  added(ideaId: string) { return this.t.data()!.projects.some(p => p.ideaId === ideaId); }

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
