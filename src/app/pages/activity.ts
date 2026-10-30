import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TrackerService } from '../services/tracker.service';

@Component({
  selector: 'app-activity',
  imports: [DatePipe],
  template: `
  <div class="page">
    <div class="page-head row between">
      <div>
        <h1>Activity Log & Reports</h1>
        <p class="muted" style="margin:2px 0 0">
          Chronological audit trail of milestone progress, completed topics, projects, and goal updates.
        </p>
      </div>
      <div class="small muted">
        <strong>{{ items().length }}</strong> recorded events
      </div>
    </div>

    <div class="card" style="padding:14px 22px">
      @for (a of items(); track $index) {
        <div class="activity">
          <div class="act-dot" style="font-size:1.1rem">
            {{ icon(a.type) }}
          </div>
          <div class="grow" style="display:flex; flex-direction:column; justify-content:center">
            <div style="font-weight:500; color:var(--color-text-primary); font-size:0.92rem">{{ a.text }}</div>
            <div class="small muted" style="margin-top:2px; font-size:0.78rem">
              {{ a.at | date:'medium' }} · <span class="badge gray" style="font-size:0.7rem; padding:1px 6px">{{ a.type }}</span>
            </div>
          </div>
        </div>
      } @empty {
        <div class="center muted" style="padding:36px">
          No activity recorded yet. Start by checking off a skill topic or adding a project.
        </div>
      }
    </div>
  </div>`,
})
export class ActivityPage {
  t = inject(TrackerService);
  items = computed(() => this.t.data()!.activity);

  icon(type: string) {
    const m: Record<string, string> = {
      register: '🎉',
      login: '🔑',
      logout: '🚪',
      'topic-done': '✓',
      'topic-undo': '↩',
      'project-add': '📁',
      'project-status': '📌',
      'project-remove': '✕',
      'job-add': '🏢',
      'job-update': '📝',
      'job-remove': '✕',
      chat: '💬',
      'chat-clear': '🧹',
      goals: '🎯',
      profile: '👤',
      resume: '📄',
    };
    return m[type] ?? '•';
  }
}
