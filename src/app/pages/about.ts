import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
  <section class="hero" style="padding:64px 0">
    <div class="container" style="max-width:840px">
      <span class="eyebrow">Methodology & Architecture</span>
      <h1 style="font-size:clamp(1.8rem,3.5vw,2.5rem); color:var(--color-text-primary)">
        Turning ambitious career goals into structured, deterministic milestones.
      </h1>
      <p class="lead muted">
        Most aspiring engineers struggle not from a shortage of intelligence, but from fragmentation of guidance. DevTrack provides a unified, objective measurement of software engineering readiness.
      </p>
    </div>
  </section>

  <!-- Core Pillars -->
  <section class="section">
    <div class="container grid g3">
      @for (v of values; track v.t) {
        <div class="card hover">
          <div class="icon-box" style="margin-bottom:14px">{{ v.i }}</div>
          <h3 style="margin-bottom:8px; color:var(--color-text-primary)">{{ v.t }}</h3>
          <p class="small muted" style="margin:0; line-height:1.55">{{ v.d }}</p>
        </div>
      }
    </div>
  </section>

  <!-- Algorithm Formula Explanation -->
  <section class="section" style="background:var(--color-surface); border-block:1px solid var(--color-border)">
    <div class="container" style="max-width:840px">
      <h2>The Readiness Algorithm</h2>
      <p class="muted">
        Every role requires a distinct weighting across engineering domains. A Frontend Specialist requires deep knowledge of DOM APIs, CSS architectures, and reactive frameworks; a Backend Engineer emphasizes distributed consensus, caching, and storage schemas.
      </p>

      <div class="card" style="background:var(--color-surface-secondary); border:1px solid var(--color-border); margin-top:20px">
        <code style="font-size:1rem; font-weight:600; color:var(--color-primary); display:block; font-family:monospace">
          Readiness Score = (85% × Weighted Skill Coverage) + (15% × Project Proof Progress)
        </code>
        <p class="small muted" style="margin:12px 0 0; line-height:1.6">
          <strong>Paced Time Calculation:</strong> Total Remaining Hours = Σ (Topic Hours × Pace Factor [Beginner: 1.25, Intermediate: 1.0, Advanced: 0.8]) + (Remaining Projects × 15h × Pace Factor). Estimated Weeks = Remaining Hours ÷ Weekly Hours.
        </p>
      </div>
    </div>
  </section>

  <!-- FAQs -->
  <section class="section">
    <div class="container" style="max-width:840px">
      <h2 style="margin-bottom:24px">Frequently Asked Questions</h2>
      @for (f of faqs; track f.q) {
        <div class="card" style="margin-bottom:14px">
          <h3 style="margin-bottom:6px; font-size:1.05rem; color:var(--color-text-primary)">{{ f.q }}</h3>
          <p class="small muted" style="margin:0; line-height:1.55">{{ f.a }}</p>
        </div>
      }

      <div class="row" style="margin-top:28px; gap:12px">
        <a class="btn btn-primary" routerLink="/register">Create Free Account</a>
        <a class="btn btn-secondary" routerLink="/">Return to Home</a>
      </div>
    </div>
  </section>`,
  styles: [`
    :host {
      display: block;
    }
    @media (max-width: 600px) {
      .hero {
        padding: 40px 0 !important;
      }
      .container {
        padding: 0 16px;
      }
      .row {
        flex-direction: column;
        width: 100%;
      }
      .row .btn {
        width: 100%;
        text-align: center;
      }
    }
  `],
})
export class About {
  values = [
    { i: '🎯', t: 'Target-First Calibration', d: 'Requirements shift based on target company tiers (Big Tech, Startups, Enterprise).' },
    { i: '🔍', t: 'Radical Transparency', d: 'Inspect the formula and exact breakdown behind every metric and timeline estimate.' },
    { i: '🤝', t: 'Integrated Ecosystem', d: 'Notes, resources, project tracking, and an AI mentor live in one polished environment.' },
  ];

  faqs = [
    { q: 'Is DevTrack completely free?', a: 'Yes. DevTrack is built for students, career switchers, and developers preparing for their next role.' },
    { q: 'How is data stored?', a: 'Your data is securely stored on the DevTrack backend API, protected with bcrypt password hashing and 7-day JWT bearer authentication.' },
    { q: 'Can I adjust my target role or company?', a: 'Yes. You can edit your target role, company, level, or weekly hours anytime in Profile → Goals. The entire roadmap and calculator will instantly recompute.' },
    { q: 'How does the AI Mentor work?', a: 'The built-in AI mentor reads your real progress data, target goals, and topic notes to provide personalized interview guidance and roadmap suggestions.' },
  ];
}
