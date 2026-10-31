import { AfterViewChecked, Component, ElementRef, HostListener, ViewChild, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatService } from '../services/chat.service';
import { TrackerService } from '../services/tracker.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="chat-page">
      <!-- Header Section -->
      <section class="hd rv" style="--i:1">
        <div>
          <h1>AI Mentor &amp; Career Coach</h1>
          <p>
            Informed by your active target (<b>{{ t.goals().position }}</b>), your completed topics, and required competencies.
          </p>
        </div>
        <button type="button" class="btn g btn-sm" (click)="chat.clear()">
          Clear History
        </button>
      </section>

      <!-- Chat Shell Card -->
      <div class="card rv chat-card" style="--i:2">
        <!-- Message Stream -->
        <div class="chat-body" #body aria-live="polite">
          @if (!msgs().length) {
            <div class="msg ai">
              <div class="msg-header">
                <span class="ai-badge">🤖 Mentor</span>
              </div>
              <p>
                <strong>Welcome, {{ firstName() }}!</strong> I am your DevTrack career intelligence mentor.
                I have analyzed your role requirements for <b>{{ t.goals().position }}</b>.
                Ask me about what topics to prioritize next, concept deep-dives, mock interview questions, or project architecture advice.
              </p>
            </div>
          }

          @for (m of msgs(); track $index) {
            <div class="msg-wrap" [class.user-wrap]="m.from === 'user'" [class.ai-wrap]="m.from === 'ai'">
              <div class="msg" [class.ai]="m.from === 'ai'" [class.user]="m.from === 'user'">
                <div class="msg-text">{{ m.text }}</div>
                <div class="msg-time">{{ m.at | date:'shortTime' }}</div>
              </div>
            </div>
          }

          @if (chat.typing()) {
            <div class="msg-wrap ai-wrap">
              <div class="msg ai typing-msg">
                <span class="pulse-dot"></span>
                <span>Mentor is thinking...</span>
              </div>
            </div>
          }
        </div>

        <!-- Quick Suggestion Prompts -->
        <div class="suggestions-row">
          <span class="sub suggest-label">Suggestions:</span>
          <div class="suggest-pills">
            @for (s of suggestions; track s) {
              <button type="button" class="suggest-btn" (click)="send(s)">
                {{ s }}
              </button>
            }
          </div>
        </div>

        <!-- Input Form Bar -->
        <form class="chat-input-bar" (ngSubmit)="send(text)">
          <input
            type="text"
            name="q"
            [(ngModel)]="text"
            placeholder="Ask a technical concept, roadmap guidance, or interview question..."
            autocomplete="off"
            aria-label="Message to mentor"
          />
          <button type="submit" class="btn p" [disabled]="!text.trim() || chat.typing()">
            Send
          </button>
        </form>
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

    /* Main Chat Container */
    .chat-card {
      padding: 0;
      display: flex;
      flex-direction: column;
      height: calc(100vh - 220px);
      min-height: 520px;
      overflow: hidden;
    }

    .chat-body {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: var(--db-sf);
    }

    .msg-wrap {
      display: flex;
      width: 100%;
    }

    .msg-wrap.user-wrap {
      justify-content: flex-end;
    }

    .msg-wrap.ai-wrap {
      justify-content: flex-start;
    }

    .msg {
      max-width: min(720px, 85%);
      padding: 14px 18px;
      line-height: 1.5;
      font-size: 14px;
    }

    .msg.user {
      background: var(--db-ac);
      color: var(--db-on);
      border-radius: 18px 18px 4px 18px;
      box-shadow: 0 4px 12px rgba(180, 86, 31, .2);
    }

    .msg.ai {
      background: var(--db-bg);
      color: var(--db-ink);
      border: 1px solid var(--db-ln);
      border-radius: 18px 18px 18px 4px;
    }

    .msg.ai p {
      margin: 0;
    }

    .msg-header {
      margin-bottom: 8px;
    }

    .ai-badge {
      font-size: 11px;
      font-weight: 600;
      color: var(--db-ac);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .msg-text {
      white-space: pre-wrap;
      word-break: break-word;
    }

    .msg-time {
      font-size: 11px;
      opacity: 0.65;
      margin-top: 6px;
      text-align: right;
    }

    .typing-msg {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--db-mu);
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--db-ac);
      animation: pulse 1s infinite alternate;
    }

    @keyframes pulse {
      from { transform: scale(0.8); opacity: 0.4; }
      to { transform: scale(1.2); opacity: 1; }
    }

    /* Suggestions */
    .suggestions-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      background: var(--db-bg);
      border-top: 1px solid var(--db-ln);
      overflow-x: auto;
    }

    .suggest-label {
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }

    .suggest-pills {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .suggest-pills::-webkit-scrollbar {
      display: none;
    }

    .suggest-btn {
      background: var(--db-sf);
      border: 1px solid var(--db-ln);
      border-radius: 99px;
      padding: 5px 12px;
      font-size: 12px;
      color: var(--db-ink);
      font-family: var(--db-fb);
      cursor: pointer;
      white-space: nowrap;
      transition: all .2s ease;
    }

    .suggest-btn:hover {
      background: #fff;
      border-color: var(--db-ac);
      color: var(--db-ac);
      transform: translateY(-1px);
    }

    /* Input Bar */
    .chat-input-bar {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 14px 18px;
      background: var(--db-sf);
      border-top: 1px solid var(--db-ln);
    }

    .chat-input-bar input {
      flex: 1;
      height: 44px;
      border-radius: var(--db-r) !important;
    }

    @media (max-width: 600px) {
      .hd {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        margin: 4px 0 16px;
      }
      .chat-card {
        height: calc(100dvh - 240px);
        min-height: 420px;
      }
      .chat-body {
        padding: 16px 14px;
        gap: 12px;
      }
      .msg {
        max-width: 92%;
        padding: 12px 14px;
      }
      .suggest-label {
        display: none;
      }
      .suggest-pills {
        padding: 2px 0;
      }
      .suggest-btn {
        min-height: 36px;
        padding: 6px 14px;
      }
      .chat-input-bar {
        padding: 10px 14px;
        gap: 8px;
      }
      .chat-input-bar input {
        font-size: 16px !important;
        height: 44px;
      }
      .chat-input-bar button {
        min-height: 44px;
        padding: 0 16px;
      }
    }
  `],
})
export class Chat implements AfterViewChecked {
  chat = inject(ChatService);
  t = inject(TrackerService);
  auth = inject(AuthService);
  @ViewChild('body') body!: ElementRef<HTMLElement>;

  text = '';
  msgs = computed(() => this.t.data()!.chat);
  firstName = computed(() => this.auth.user()?.name.split(' ')[0] ?? 'there');

  suggestions = [
    'What should I learn next?',
    'Show my progress breakdown',
    'How long until I am job-ready?',
    'Explain Big-O Notation simply',
    'Recommend a portfolio project',
    'Common interview questions for my role',
  ];

  send(q: string) {
    q = q.trim();
    if (!q) return;
    this.text = '';
    this.chat.send(q);
  }

  ngAfterViewChecked() {
    const el = this.body?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
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
