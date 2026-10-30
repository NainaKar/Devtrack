import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TrackerService } from '../services/tracker.service';
import { CATEGORIES } from '../data/skills.data';
import { ProjectStatus, UserProject } from '../models';

@Component({
  selector: 'app-projects',
  imports: [FormsModule, DatePipe],
  template: `
  <div class="page">
    <div class="page-head row between">
      <div>
        <h1>Projects & Proof of Work</h1>
        <p class="muted" style="margin:2px 0 0">
          Completed: <strong style="color:var(--color-primary)">{{ t.completedProjects() }}</strong> of
          {{ t.analysis().projectsNeeded }} required for {{ t.goals().position }}.
        </p>
      </div>
      <div class="tabs" style="margin-bottom:0">
        <button [class.on]="tab() === 'mine'" (click)="tab.set('mine')">My Projects ({{ projects().length }})</button>
        <button [class.on]="tab() === 'ideas'" (click)="tab.set('ideas')">Project Ideas Library</button>
      </div>
    </div>

    @if (tab() === 'mine') {
      <!-- Add Project Card -->
      <div class="card" style="padding:16px 20px; margin-bottom:20px">
        <form class="row" style="gap:12px" (ngSubmit)="add()">
          <input
            class="grow"
            style="min-width:220px; width:auto"
            type="text"
            name="title"
            [(ngModel)]="title"
            placeholder="Add new project title (e.g. Distributed Task Queue)"
            required
          >
          <input
            class="grow"
            style="min-width:220px; width:auto"
            type="url"
            name="repo"
            [(ngModel)]="repo"
            placeholder="GitHub repository URL (optional)"
          >
          <button class="btn btn-primary" [disabled]="!title.trim()">+ Add Project</button>
        </form>
      </div>

      <!-- Filters Toolbar -->
      <div class="row between" style="margin-bottom:16px">
        <div class="row" style="gap:8px">
          <button
            class="badge"
            [class.terracotta]="statusFilter() === 'ALL'"
            style="cursor:pointer; padding:6px 12px; font-size:0.8rem"
            (click)="statusFilter.set('ALL')"
          >
            All ({{ projects().length }})
          </button>
          <button
            class="badge"
            [class.amber]="statusFilter() === 'In progress'"
            style="cursor:pointer; padding:6px 12px; font-size:0.8rem"
            (click)="statusFilter.set('In progress')"
          >
            In Progress
          </button>
          <button
            class="badge"
            [class.green]="statusFilter() === 'Completed'"
            style="cursor:pointer; padding:6px 12px; font-size:0.8rem"
            (click)="statusFilter.set('Completed')"
          >
            Completed
          </button>
          <button
            class="badge"
            [class.gray]="statusFilter() === 'Planned'"
            style="cursor:pointer; padding:6px 12px; font-size:0.8rem"
            (click)="statusFilter.set('Planned')"
          >
            Planned
          </button>
        </div>
        <div class="small muted">
          {{ filteredProjects().length }} projects displayed
        </div>
      </div>

      <!-- Project Cards Grid -->
      <div class="grid g2">
        @for (p of filteredProjects(); track p.id) {
          <div class="card" style="display:flex; flex-direction:column; justify-content:space-between">
            <div>
              <div class="row between" style="align-items:flex-start">
                <div>
                  <h3 style="margin:0; font-size:1.05rem; color:var(--color-text-primary)">{{ p.title }}</h3>
                  @if (p.categoryId) {
                    <div class="small muted" style="margin-top:2px">{{ t.catName(p.categoryId) }}</div>
                  }
                </div>
                <span class="badge" [class]="t.statusClass(p.status)">{{ p.status }}</span>
              </div>

              <!-- Mini Progress Meter -->
              <div style="margin:14px 0 10px">
                <div class="bar" [class.done]="p.status === 'Completed'">
                  <i [style.width.%]="p.status === 'Completed' ? 100 : p.status === 'In progress' ? 50 : 15"></i>
                </div>
                <div class="row between small" style="margin-top:4px; font-size:0.75rem; color:var(--color-text-secondary)">
                  <span>{{ p.status === 'Completed' ? 'Finished & Documented' : p.status === 'In progress' ? 'Active Development' : 'Scope Planned' }}</span>
                  <span>{{ p.createdAt | date:'mediumDate' }}</span>
                </div>
              </div>
            </div>

            <div style="padding-top:12px; border-top:1px solid var(--color-border-subtle)">
              <div class="row" style="gap:10px">
                <select
                  style="width:auto; padding:6px 10px; font-size:0.82rem; border-radius:var(--radius-sm)"
                  [ngModel]="p.status"
                  (ngModelChange)="t.setProject(p.id, {status: $event})"
                  [attr.aria-label]="'Status of ' + p.title"
                >
                  @for (s of statuses; track s) {
                    <option [value]="s">{{ s }}</option>
                  }
                </select>

                <input
                  style="width:auto; padding:6px 10px; font-size:0.82rem"
                  class="grow"
                  type="url"
                  [ngModel]="p.repoUrl"
                  (change)="t.setProject(p.id, {repoUrl: $any($event.target).value})"
                  placeholder="Repo URL (https://...)"
                >

                <button class="btn btn-ghost btn-sm" style="color:var(--color-error); border-color:transparent" (click)="t.removeProject(p.id)">
                  Remove
                </button>
              </div>

              @if (p.repoUrl) {
                <div style="margin-top:8px">
                  <a class="small" [href]="p.repoUrl" target="_blank" rel="noopener noreferrer">
                    Open GitHub repository ↗
                  </a>
                </div>
              }
            </div>
          </div>
        } @empty {
          <div class="card muted center" style="grid-column:1 / -1; padding:36px">
            No projects in this category. Select from the Idea Library or add your custom project above.
          </div>
        }
      </div>
    } @else {
      <!-- Idea Library -->
      <div class="row between" style="margin-bottom:16px">
        <div class="row" style="gap:10px">
          <select style="width:auto; padding:8px 12px" [ngModel]="filter()" (ngModelChange)="filter.set($event)" aria-label="Filter by skill area">
            <option value="all">All Skill Domains ({{ cats.length }})</option>
            @for (c of cats; track c.id) {
              <option [value]="c.id">{{ c.icon }} {{ c.name }}</option>
            }
          </select>
        </div>
        <div class="small muted">
          {{ ideas().length }} vetted project ideas
        </div>
      </div>

      <div class="grid g3">
        @for (i of ideas(); track i.idea.id) {
          <div class="card hover" style="display:flex; flex-direction:column; justify-content:space-between">
            <div>
              <div class="row between">
                <span class="badge gray">{{ i.cat.icon }} {{ i.cat.name }}</span>
                <span class="badge" [class.green]="i.idea.level==='Beginner'" [class.amber]="i.idea.level==='Intermediate'" [class.terracotta]="i.idea.level==='Advanced'">
                  {{ i.idea.level }}
                </span>
              </div>
              <h3 style="margin:12px 0 6px; font-size:1.05rem; color:var(--color-text-primary)">{{ i.idea.title }}</h3>
              <p class="small muted" style="line-height:1.45; margin-bottom:10px">{{ i.idea.desc }}</p>
              <div class="small" style="color:var(--color-text-secondary); margin-bottom:14px">
                {{ i.idea.stack.join(' · ') }}
              </div>
            </div>

            <div>
              @if (has(i.idea.id)) {
                <span class="badge green">In your projects ✓</span>
              } @else {
                <button class="btn btn-secondary btn-sm" style="width:100%" (click)="t.startProject(i.idea, i.cat.id)">
                  + Add to my projects
                </button>
              }
            </div>
          </div>
        }
      </div>
    }
  </div>`,
})
export class Projects {
  t = inject(TrackerService);
  cats = CATEGORIES;
  statuses: ProjectStatus[] = ['Planned', 'In progress', 'Completed'];

  tab = signal<'mine' | 'ideas'>('mine');
  filter = signal('all');
  statusFilter = signal<string>('ALL');

  title = '';
  repo = '';

  projects = computed(() => this.t.data()!.projects);

  filteredProjects = computed(() => {
    const list = this.projects();
    const sf = this.statusFilter();
    if (sf === 'ALL') return list;
    return list.filter(p => p.status === sf);
  });

  ideas = computed(() =>
    CATEGORIES
      .filter(c => this.filter() === 'all' || c.id === this.filter())
      .flatMap(c => c.projects.map(idea => ({ cat: c, idea })))
  );

  has(id: string) {
    return this.projects().some(p => p.ideaId === id);
  }

  add() {
    if (!this.title.trim()) return;
    this.t.addCustomProject(this.title.trim(), this.repo.trim());
    this.title = '';
    this.repo = '';
  }
}
