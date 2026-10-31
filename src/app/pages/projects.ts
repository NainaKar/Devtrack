import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TrackerService } from '../services/tracker.service';
import { CATEGORIES } from '../data/skills.data';
import { ProjectStatus, UserProject } from '../models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="projects-page">
      <!-- Header Section -->
      <section class="hd rv" style="--i:1">
        <div>
          <h1>Projects &amp; Proof of Work</h1>
          <p>
            Completed: <b>{{ t.completedProjects() }}</b> of
            {{ t.analysis().projectsNeeded }} required for <b>{{ t.goals().position }}</b>.
          </p>
        </div>
        <div class="pill-tabs" role="tablist">
          <button
            type="button"
            [class.on]="tab() === 'mine'"
            (click)="tab.set('mine')"
          >
            My Projects ({{ projects().length }})
          </button>
          <button
            type="button"
            [class.on]="tab() === 'ideas'"
            (click)="tab.set('ideas')"
          >
            Project Ideas Library
          </button>
        </div>
      </section>

      @if (tab() === 'mine') {
        <!-- Add Project Input Card -->
        <div class="card rv add-project-card" style="--i:2">
          <form class="add-form" (ngSubmit)="add()">
            <input
              class="grow-input"
              type="text"
              name="title"
              [(ngModel)]="title"
              placeholder="Add new project title (e.g. Distributed Task Queue)"
              required
            />
            <input
              class="grow-input"
              type="url"
              name="repo"
              [(ngModel)]="repo"
              placeholder="GitHub repository URL (optional)"
            />
            <button class="btn p" [disabled]="!title.trim()">+ Add Project</button>
          </form>
        </div>

        <!-- Status Filter Toolbar -->
        <div class="filter-bar rv" style="--i:3">
          <div class="pill-tabs">
            <button
              type="button"
              [class.on]="statusFilter() === 'ALL'"
              (click)="statusFilter.set('ALL')"
            >
              All ({{ projects().length }})
            </button>
            <button
              type="button"
              [class.on]="statusFilter() === 'In progress'"
              (click)="statusFilter.set('In progress')"
            >
              In Progress
            </button>
            <button
              type="button"
              [class.on]="statusFilter() === 'Completed'"
              (click)="statusFilter.set('Completed')"
            >
              Completed
            </button>
            <button
              type="button"
              [class.on]="statusFilter() === 'Planned'"
              (click)="statusFilter.set('Planned')"
            >
              Planned
            </button>
          </div>
          <div class="sub">
            <b>{{ filteredProjects().length }}</b> projects displayed
          </div>
        </div>

        <!-- Project Cards Grid -->
        <div class="projects-grid">
          @for (p of filteredProjects(); track p.id; let idx = $index) {
            <div class="card rv project-card" [style.--i]="idx + 4">
              <div class="project-card-top">
                <div class="row between" style="align-items:flex-start">
                  <div>
                    <h3 class="project-title">{{ p.title }}</h3>
                    @if (p.categoryId) {
                      <div class="sub" style="margin-top:2px">{{ t.catName(p.categoryId) }}</div>
                    }
                  </div>
                  <span
                    class="chip"
                    [class.green]="p.status === 'Completed'"
                  >
                    {{ p.status }}
                  </span>
                </div>

                <!-- Mini Progress Bar -->
                <div class="progress-section">
                  <div class="tk">
                    <i [style.width.%]="p.status === 'Completed' ? 100 : p.status === 'In progress' ? 50 : 15"></i>
                  </div>
                  <div class="row between sub" style="margin-top:6px; font-size:12px">
                    <span>{{ p.status === 'Completed' ? 'Finished & Documented' : p.status === 'In progress' ? 'Active Development' : 'Scope Planned' }}</span>
                    <span>{{ p.createdAt | date:'mediumDate' }}</span>
                  </div>
                </div>
              </div>

              <!-- Controls & Repo Footer -->
              <div class="project-card-footer">
                <div class="controls-row">
                  <select
                    [ngModel]="p.status"
                    (ngModelChange)="t.setProject(p.id, {status: $event})"
                    [attr.aria-label]="'Status of ' + p.title"
                  >
                    @for (s of statuses; track s) {
                      <option [value]="s">{{ s }}</option>
                    }
                  </select>

                  <input
                    class="repo-input"
                    type="url"
                    [ngModel]="p.repoUrl"
                    (change)="t.setProject(p.id, {repoUrl: $any($event.target).value})"
                    placeholder="Repo URL (https://...)"
                  />

                  <button
                    type="button"
                    class="btn g btn-sm delete-btn"
                    (click)="t.removeProject(p.id)"
                    title="Remove project"
                  >
                    Remove
                  </button>
                </div>

                @if (p.repoUrl) {
                  <div style="margin-top:8px">
                    <a class="lnk sub" [href]="p.repoUrl" target="_blank" rel="noopener noreferrer">
                      Open GitHub repository ↗
                    </a>
                  </div>
                }
              </div>
            </div>
          } @empty {
            <div class="card rv empty-state" style="--i:4">
              <p class="sub">No projects in this category. Select from the Idea Library or add your custom project above.</p>
            </div>
          }
        </div>
      } @else {
        <!-- Idea Library -->
        <div class="filter-bar rv" style="--i:2">
          <div class="row" style="gap:10px">
            <select [ngModel]="filter()" (ngModelChange)="filter.set($event)" aria-label="Filter by skill area">
              <option value="all">All Skill Domains ({{ cats.length }})</option>
              @for (c of cats; track c.id) {
                <option [value]="c.id">{{ c.icon }} {{ c.name }}</option>
              }
            </select>
          </div>
          <div class="sub">
            <b>{{ ideas().length }}</b> vetted project ideas
          </div>
        </div>

        <div class="ideas-grid">
          @for (i of ideas(); track i.idea.id; let idx = $index) {
            <div class="card rv idea-card" [style.--i]="idx + 3">
              <div>
                <div class="row between">
                  <span class="chip">{{ i.cat.icon }} {{ i.cat.name }}</span>
                  <span
                    class="chip"
                    [class.green]="i.idea.level === 'Beginner'"
                  >
                    {{ i.idea.level }}
                  </span>
                </div>

                <h3 class="idea-title">{{ i.idea.title }}</h3>
                <p class="sub idea-desc">{{ i.idea.desc }}</p>
                <div class="sub tech-stack">{{ i.idea.stack.join(' · ') }}</div>
              </div>

              <div style="margin-top:14px">
                @if (has(i.idea.id)) {
                  <span class="chip green">In your projects ✓</span>
                } @else {
                  <button
                    type="button"
                    class="btn g btn-sm"
                    style="width:100%"
                    (click)="t.startProject(i.idea, i.cat.id)"
                  >
                    + Add to my projects
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
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

    .pill-tabs {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .pill-tabs button {
      background: var(--db-sf);
      border: 1px solid var(--db-ln);
      color: var(--db-mu);
      font-family: var(--db-fb);
      font-weight: 500;
      font-size: 13px;
      padding: 7px 16px;
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

    .add-project-card {
      padding: 16px 20px;
      margin-bottom: 20px;
    }

    .add-form {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .grow-input {
      flex: 1;
      min-width: 220px;
    }

    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      margin-bottom: 18px;
      flex-wrap: wrap;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
      gap: 18px;
    }

    .project-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px;
    }

    .project-title {
      font-size: 18px;
      font-family: var(--db-fd);
      color: var(--db-ink);
    }

    .progress-section {
      margin: 14px 0 10px;
    }

    .project-card-footer {
      padding-top: 14px;
      border-top: 1px solid var(--db-ln);
    }

    .controls-row {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .controls-row select {
      width: auto;
      padding: 6px 10px;
      font-size: 13px;
    }

    .repo-input {
      flex: 1;
      padding: 6px 10px !important;
      font-size: 13px !important;
      min-width: 140px;
    }

    .delete-btn {
      color: #c4452a;
    }

    .ideas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
      gap: 18px;
    }

    .idea-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px;
    }

    .idea-title {
      font-size: 18px;
      font-family: var(--db-fd);
      margin: 12px 0 6px;
      color: var(--db-ink);
    }

    .idea-desc {
      line-height: 1.45;
      margin-bottom: 10px;
    }

    .tech-stack {
      font-size: 12px;
      margin-bottom: 12px;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 48px;
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

    @media (max-width: 640px) {
      .hd {
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
        margin: 4px 0 18px;
      }
      .hd .pill-tabs {
        width: 100%;
      }
      .hd .pill-tabs button {
        flex: 1;
        text-align: center;
        padding: 8px 12px;
        min-height: 40px;
      }
      .add-form {
        flex-direction: column;
        align-items: stretch;
      }
      .grow-input {
        min-width: 0;
        width: 100%;
      }
      .add-form button {
        width: 100%;
        min-height: 44px;
      }
      .projects-grid,
      .ideas-grid {
        grid-template-columns: 1fr;
      }
      .controls-row {
        flex-direction: column;
        align-items: stretch;
      }
      .controls-row select,
      .controls-row input,
      .controls-row button {
        width: 100%;
        min-height: 40px;
      }
    }
  `],
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
