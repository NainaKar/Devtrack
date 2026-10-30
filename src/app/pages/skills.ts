import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrackerService } from '../services/tracker.service';

@Component({
  selector: 'app-skills',
  imports: [RouterLink, FormsModule],
  template: `
  <div class="page">
    <!-- Header Section -->
    <div class="page-head row between">
      <div>
        <h1>Skills & Assessments</h1>
        <p class="muted" style="margin:2px 0 0">
          Track proficiency across essential engineering areas. Overall completed topics:
          <strong style="color:var(--color-primary)">{{ t.done().size }}</strong>
          (Coverage: <strong style="color:var(--color-text-primary)">{{ t.overallCoverage() }}%</strong>)
        </p>
      </div>
      <a routerLink="/app/roadmap" class="btn btn-secondary btn-sm">View in Roadmap →</a>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="card" style="padding:14px 18px; margin-bottom:20px">
      <div class="row between">
        <div class="row" style="gap:10px">
          <input
            type="search"
            style="width:250px; padding:8px 12px"
            placeholder="Search skills or topics..."
            [(ngModel)]="searchQuery"
          >
          <div class="tabs" style="margin-bottom:0">
            <button [class.on]="stageFilter() === 'ALL'" (click)="stageFilter.set('ALL')">All Areas</button>
            <button [class.on]="stageFilter() === 'REQUIRED'" (click)="stageFilter.set('REQUIRED')">Role Required</button>
            <button [class.on]="stageFilter() === 'IN_PROGRESS'" (click)="stageFilter.set('IN_PROGRESS')">In Progress</button>
            <button [class.on]="stageFilter() === 'COMPLETED'" (click)="stageFilter.set('COMPLETED')">Completed</button>
          </div>
        </div>
        <div class="small muted">
          {{ filteredStats().length }} skill domains
        </div>
      </div>
    </div>

    <!-- Skill Domain Cards Grid -->
    <div class="grid g3">
      @for (s of filteredStats(); track s.cat.id) {
        <a class="card hover" [routerLink]="['/app/skills', s.cat.id]" style="color:inherit; text-decoration:none; display:flex; flex-direction:column; justify-content:space-between">
          <div>
            <div class="row between">
              <div class="icon-box" style="font-size:1.35rem">{{ s.cat.icon }}</div>
              @if (s.weight > 0) {
                <span class="badge" [class]="s.coverage >= 1 ? 'green' : 'amber'">
                  {{ s.coverage >= 1 ? '● Requirement met' : s.remaining + ' required to go' }}
                </span>
              } @else {
                <span class="badge gray">Optional for role</span>
              }
            </div>

            <h3 style="margin:14px 0 4px; color:var(--color-text-primary)">{{ s.cat.name }}</h3>
            <p class="small muted" style="min-height:38px; line-height:1.45; margin-bottom:14px">
              {{ s.cat.blurb }}
            </p>
          </div>

          <div>
            <!-- Next Recommended Topic -->
            @if (s.nextTopics.length > 0) {
              <div class="small" style="padding:7px 10px; background:var(--color-surface-secondary); border-radius:var(--radius-sm); margin-bottom:12px">
                <span class="muted">Next:</span> <strong style="color:var(--color-text-primary)">{{ s.nextTopics[0].name }}</strong>
              </div>
            } @else {
              <div class="small muted" style="padding:7px 10px; background:var(--color-success-bg); color:var(--color-success-text); border-radius:var(--radius-sm); margin-bottom:12px">
                All topics completed in this domain ✓
              </div>
            }

            <div class="row between small" style="margin-bottom:6px">
              <span class="muted">{{ s.done }} of {{ s.total }} topics complete</span>
              <strong class="tabular" style="color:var(--color-text-primary)">{{ s.pct }}%</strong>
            </div>

            <div class="bar" [class.done]="s.pct === 100">
              <i [style.width.%]="s.pct"></i>
              @if (s.weight > 0) {
                <b [style.left.%]="s.weight * 100" title="Required threshold"></b>
              }
            </div>
          </div>
        </a>
      } @empty {
        <div class="card muted center" style="grid-column:1 / -1; padding:36px">
          No skills match your search or filter. Try clearing the filter.
        </div>
      }
    </div>
  </div>`,
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
      const matchSearch = !q || s.cat.name.toLowerCase().includes(q) || s.cat.blurb.toLowerCase().includes(q);
      if (!matchSearch) return false;

      if (filter === 'REQUIRED') return s.weight > 0;
      if (filter === 'IN_PROGRESS') return s.pct > 0 && s.pct < 100;
      if (filter === 'COMPLETED') return s.pct === 100;
      return true;
    });
  });
}
