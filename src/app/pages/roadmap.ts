import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrackerService } from '../services/tracker.service';

@Component({
  selector: 'app-roadmap',
  imports: [RouterLink],
  template: `
  <div class="page">
    <div class="page-head row between">
      <div>
        <h1>Career Roadmap</h1>
        <p class="muted" style="margin:2px 0 0">
          Structured milestones tailored for
          <strong style="color:var(--color-text-primary)">{{ t.goals().position }}</strong>
          @if (t.goals().company) {
            at <strong style="color:var(--color-primary)">{{ t.goals().company }}</strong>
          }
          · {{ t.goals().weeklyHours }}h/week pace
        </p>
      </div>
      <div class="row" style="gap:10px">
        <a routerLink="/app/calculator" class="btn btn-secondary btn-sm">Readiness Calculator →</a>
      </div>
    </div>

    <!-- Timeline Legend -->
    <div class="card" style="padding:12px 18px; margin-bottom:24px">
      <div class="row" style="gap:20px; font-size:0.84rem">
        <div class="row" style="gap:6px">
          <span style="width:10px; height:10px; border-radius:50%; background:var(--color-primary)"></span>
          <span class="muted">Active Focus Milestone</span>
        </div>
        <div class="row" style="gap:6px">
          <span style="width:10px; height:10px; border-radius:50%; background:var(--color-success)"></span>
          <span class="muted">Application & Career Phase</span>
        </div>
        <div class="row" style="gap:6px">
          <span style="width:10px; height:10px; border-radius:50%; background:var(--color-accent)"></span>
          <span class="muted">Portfolio Milestone</span>
        </div>
      </div>
    </div>

    <!-- Vertical Timeline -->
    <div class="timeline">
      @for (s of steps(); track s.n; let i = $index) {
        <div
          class="tl-item card"
          [class.project]="s.kind === 'project'"
          [class.apply]="s.kind === 'apply'"
          style="border-left: 3px solid var(--color-border); transition:all var(--transition-fast)"
          [style.border-left-color]="i === 0 ? 'var(--color-primary)' : s.kind === 'apply' ? 'var(--color-success)' : s.kind === 'project' ? 'var(--color-accent)' : 'var(--color-border)'"
        >
          <div class="tl-dot">{{ s.n }}</div>

          <div class="row between">
            <div class="row" style="gap:10px">
              <span
                class="badge"
                [class.terracotta]="s.kind==='learn'"
                [class.amber]="s.kind==='profile'"
                [class.green]="s.kind==='apply'"
              >
                {{ s.kind }}
              </span>
              <h3 style="margin:0; font-size:1.05rem; color:var(--color-text-primary)">{{ s.title }}</h3>
            </div>
            <span class="small muted tabular">
              Week {{ s.weekStart }}{{ s.weekEnd > s.weekStart ? '–' + s.weekEnd : '' }} · {{ s.hours }}h study
            </span>
          </div>

          <p class="muted" style="margin:10px 0 12px; line-height:1.5; font-size:0.9rem">
            {{ s.detail }}
          </p>

          @if (s.items.length > 0) {
            <div style="background:var(--color-surface-secondary); border-radius:var(--radius-sm); padding:10px 14px; margin-bottom:14px">
              <div class="small" style="font-weight:600; color:var(--color-text-primary); margin-bottom:6px">
                Required Deliverables:
              </div>
              <ul style="margin:0; padding-left:18px; font-size:0.86rem; color:var(--color-text-secondary)">
                @for (item of s.items; track item) {
                  <li style="margin:3px 0">{{ item }}</li>
                }
              </ul>
            </div>
          }

          <div class="row" style="gap:10px; margin-top:8px">
            @if (s.kind === 'learn') {
              <a class="btn btn-secondary btn-sm" [routerLink]="['/app/skills', s.catId]">
                Study These Topics →
              </a>
            }
            @if (s.kind === 'project') {
              <button
                class="btn btn-secondary btn-sm"
                (click)="t.startProject(s.idea!, s.catId!)"
                [disabled]="added(s.idea!.id)"
              >
                {{ added(s.idea!.id) ? 'Added to Portfolio ✓' : '+ Add to My Projects' }}
              </button>
            }
            @if (s.kind === 'profile') {
              <a class="btn btn-secondary btn-sm" routerLink="/app/profile">
                Complete Profile Proof →
              </a>
            }
            @if (s.kind === 'apply') {
              <a class="btn btn-primary btn-sm" routerLink="/app/jobs">
                Open Job Applications Tracker →
              </a>
            }
          </div>
        </div>
      }
    </div>
  </div>`,
})
export class Roadmap {
  t = inject(TrackerService);
  steps = this.t.roadmap;
  added(id: string) {
    return this.t.data()!.projects.some(p => p.ideaId === id);
  }
}
