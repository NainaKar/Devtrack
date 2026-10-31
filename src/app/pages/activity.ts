import { Component, computed, HostListener, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TrackerService } from '../services/tracker.service';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="activity-page">
      <!-- Header Section -->
      <section class="hd rv" style="--i:1">
        <div>
          <h1>Activity Log &amp; Reports</h1>
          <p>
            Chronological audit trail of milestone progress, completed topics, projects, and goal updates.
          </p>
        </div>
        <div class="sub count-badge">
          <b>{{ items().length }}</b> recorded events
        </div>
      </section>

      <!-- Activity Timeline Card -->
      <div class="card rv activity-card" style="--i:2">
        <div class="activity-list">
          @for (a of items(); track $index; let idx = $index) {
            <div class="activity-item">
              <div class="activity-icon-bubble">
                {{ icon(a.type) }}
              </div>
              <div class="activity-details">
                <div class="activity-text">{{ a.text }}</div>
                <div class="sub activity-meta">
                  <span>{{ a.at | date:'medium' }}</span>
                  <span class="chip" style="font-size:11px; padding:1px 8px">{{ a.type }}</span>
                </div>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <p class="sub">No activity recorded yet. Start by checking off a skill topic or adding a project.</p>
            </div>
          }
        </div>
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

    .count-badge {
      font-size: 14px;
    }

    .count-badge b {
      color: var(--db-ink);
    }

    .activity-card {
      padding: 16px 24px;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 0;
      border-bottom: 1px solid var(--db-ln);
      transition: background .2s ease;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon-bubble {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--db-bg);
      border: 1px solid var(--db-ln);
      display: grid;
      place-items: center;
      font-size: 1.15rem;
      flex: none;
    }

    .activity-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .activity-text {
      font-size: 14.5px;
      font-weight: 500;
      color: var(--db-ink);
    }

    .activity-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
    }

    @media (max-width: 600px) {
      .hd {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        margin: 4px 0 16px;
      }
      .activity-card {
        padding: 12px 16px;
      }
      .activity-item {
        gap: 12px;
        padding: 12px 0;
      }
      .activity-meta {
        flex-wrap: wrap;
        gap: 6px;
      }
    }
  `],
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
