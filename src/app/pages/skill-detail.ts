import { Component, computed, inject, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TrackerService } from '../services/tracker.service';
import { CAT_BY_ID } from '../data/skills.data';

@Component({
  selector: 'app-skill-detail',
  imports: [RouterLink, DecimalPipe],
  template: `
  @if (cat(); as c) {
  <div class="page">
    <a routerLink="/app/skills" class="small" style="display:inline-flex; align-items:center; gap:6px; color:var(--color-text-secondary); text-decoration:none">
      ← Back to all skills
    </a>

    <div class="page-head row between" style="margin-top:10px; margin-bottom:24px">
      <div class="row" style="gap:16px">
        <div class="icon-box" style="width:54px; height:54px; font-size:1.75rem">{{ c.icon }}</div>
        <div>
          <h1>{{ c.name }}</h1>
          <p class="muted" style="margin:0; max-width:600px">{{ c.blurb }}</p>
        </div>
      </div>
      <div style="min-width:240px; background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-md); padding:12px 16px">
        <div class="row between">
          <strong style="color:var(--color-text-primary)">{{ stat()?.pct }}% complete</strong>
          <span class="small muted">{{ stat()?.done }} / {{ stat()?.total }} topics</span>
        </div>
        <div class="bar" [class.done]="stat()?.pct === 100" style="margin-top:8px">
          <i [style.width.%]="stat()?.pct"></i>
          @if (stat()!.weight > 0) {
            <b [style.left.%]="stat()!.weight * 100" title="Target threshold"></b>
          }
        </div>
        <p class="small muted" style="margin:6px 0 0; font-size:0.78rem">
          {{ stat()!.weight > 0 ? 'Goal requirement: ' + stat()!.needed + ' topics (' + (stat()!.weight * 100 | number:'1.0-0') + '%)' : 'Optional enrichment for role' }}
        </p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns:minmax(300px, 2fr) minmax(260px, 1.15fr); align-items:start; gap:20px">
      <!-- Topics List -->
      <div>
        <div class="row between" style="margin-bottom:12px">
          <h3 style="margin:0">Domain Topics ({{ c.topics.length }})</h3>
          <span class="small muted">Click any topic to view key study points</span>
        </div>

        @for (tp of c.topics; track tp.id; let i = $index) {
          <div class="topic" [class.done]="t.done().has(tp.id)">
            <div class="topic-head" (click)="toggleOpen(tp.id)">
              <button
                class="check"
                [class.on]="t.done().has(tp.id)"
                (click)="$event.stopPropagation(); t.toggleTopic(tp.id)"
                [attr.aria-label]="'Mark ' + tp.name + ' complete'"
                [attr.aria-pressed]="t.done().has(tp.id)"
              >
                ✓
              </button>
              <div class="grow">
                <strong style="color:var(--color-text-primary); font-size:0.92rem">{{ i + 1 }}. {{ tp.name }}</strong>
                <div class="small muted">~{{ tp.hours }}h study time</div>
              </div>
              <span class="small muted" style="padding:0 4px">
                {{ open() === tp.id ? '▲' : '▼' }}
              </span>
            </div>
            @if (open() === tp.id) {
              <div class="topic-body">
                <p style="color:var(--color-text-primary); margin-bottom:10px">{{ tp.summary }}</p>
                <strong class="small" style="color:var(--color-primary)">Key Concept Checklist:</strong>
                <ul style="margin:6px 0 12px; padding-left:20px">
                  @for (p of tp.points; track p) {
                    <li style="margin:4px 0">{{ p }}</li>
                  }
                </ul>
                <div class="small" style="padding:8px 12px; background:var(--color-surface-secondary); border-radius:var(--radius-sm)">
                  💡 <strong>Implementation Tip:</strong> Solidify this concept by building a focused 1-hour code sample or answering 2 mock questions with the AI Mentor.
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Right Column: Resources & Project Ideas -->
      <div class="stack">
        <!-- Recommended Resources -->
        <div class="card">
          <h3 style="margin-bottom:12px">Curated Resources</h3>
          <div style="display:flex; flex-direction:column; gap:8px">
            @for (r of c.resources; track r.url) {
              <a
                [href]="r.url"
                target="_blank"
                rel="noopener noreferrer"
                class="row between"
                style="padding:9px 12px; background:var(--color-surface-secondary); border-radius:var(--radius-sm); text-decoration:none; color:var(--color-text-primary)"
              >
                <span style="font-size:0.88rem; font-weight:500">{{ r.title }}</span>
                <span class="small" style="color:var(--color-primary)">↗</span>
              </a>
            }
          </div>
        </div>

        <!-- Project Ideas for this Domain -->
        <div class="card">
          <h3 style="margin-bottom:6px">Portfolio Project Ideas</h3>
          <p class="small muted" style="margin-bottom:14px">Build tangible proof for your resume:</p>
          <div style="display:flex; flex-direction:column; gap:12px">
            @for (p of c.projects; track p.id) {
              <div style="padding:12px; border:1px solid var(--color-border-subtle); border-radius:var(--radius-md); background:var(--color-surface)">
                <div class="row between">
                  <strong style="color:var(--color-text-primary); font-size:0.92rem">{{ p.title }}</strong>
                  <span class="badge" [class.green]="p.level==='Beginner'" [class.amber]="p.level==='Intermediate'" [class.terracotta]="p.level==='Advanced'">
                    {{ p.level }}
                  </span>
                </div>
                <p class="small muted" style="margin:6px 0 8px; line-height:1.45">{{ p.desc }}</p>
                <div class="small" style="color:var(--color-text-secondary); margin-bottom:10px">
                  {{ p.stack.join(' · ') }}
                </div>
                @if (added(p.id)) {
                  <span class="badge green">In your projects ✓</span>
                } @else {
                  <button class="btn btn-secondary btn-sm" (click)="t.startProject(p, c.id)">
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
    <div class="page">
      <p class="muted">Skill domain not found. <a routerLink="/app/skills">Back to skills</a></p>
    </div>
  }`,
})
export class SkillDetail {
  id = input.required<string>();
  t = inject(TrackerService);
  open = signal<string | null>(null);
  cat = computed(() => CAT_BY_ID.get(this.id()));
  stat = computed(() => this.t.analysis().stats.find(s => s.cat.id === this.id()));
  toggleOpen(id: string) { this.open.set(this.open() === id ? null : id); }
  added(ideaId: string) { return this.t.data()!.projects.some(p => p.ideaId === ideaId); }
}
