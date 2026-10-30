import { AfterViewChecked, Component, ElementRef, ViewChild, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatService } from '../services/chat.service';
import { TrackerService } from '../services/tracker.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, DatePipe],
  template: `
  <div class="page">
    <div class="page-head row between">
      <div>
        <h1>AI Mentor & Career Coach</h1>
        <p class="muted" style="margin:2px 0 0">
          Informed by your active target ({{ t.goals().position }}), your completed topics, and required competencies.
        </p>
      </div>
      <button class="btn btn-secondary btn-sm" (click)="chat.clear()">Clear History</button>
    </div>

    <div class="chat">
      <!-- Chat Message Stream -->
      <div class="chat-body" #body aria-live="polite">
        @if (!msgs().length) {
          <div class="msg ai">
            <strong>Welcome, {{ firstName() }}!</strong> I am your DevTrack career intelligence mentor.
            I have analyzed your role requirements for <strong>{{ t.goals().position }}</strong>.
            Ask me about what topics to prioritize next, concept deep-dives, mock interview questions, or project architecture advice.
          </div>
        }

        @for (m of msgs(); track $index) {
          <div class="msg" [class.ai]="m.from === 'ai'" [class.user]="m.from === 'user'">
            <div>{{ m.text }}</div>
            <div class="small" [style.opacity]=".6" style="margin-top:6px; font-size:0.74rem">
              {{ m.at | date:'shortTime' }}
            </div>
          </div>
        }

        @if (chat.typing()) {
          <div class="msg ai" style="display:flex; align-items:center; gap:8px">
            <span style="display:inline-block; animation:pulse 1s infinite">Thinking...</span>
          </div>
        }
      </div>

      <!-- Quick Suggestion Prompts -->
      <div class="chips" style="justify-content:flex-start; padding:12px 18px; background:var(--color-surface); border-top:1px solid var(--color-border)">
        @for (s of suggestions; track s) {
          <button class="chip" (click)="send(s)">{{ s }}</button>
        }
      </div>

      <!-- Input Form -->
      <form class="chat-input" (ngSubmit)="send(text)">
        <input
          type="text"
          name="q"
          [(ngModel)]="text"
          placeholder="Ask a technical concept, roadmap guidance, or interview question..."
          autocomplete="off"
          aria-label="Message to mentor"
        >
        <button class="btn btn-primary" [disabled]="!text.trim() || chat.typing()">Send</button>
      </form>
    </div>
  </div>`,
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
}
