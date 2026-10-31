import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  NgZone
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LandingNavComponent } from './home/landing-nav.component';
import { LandingFooterComponent } from './home/landing-footer.component';
import { RevealDirective } from '../directives/reveal.directive';
import { AuthService } from '../services/auth.service';

interface CorePillar {
  i: string;
  t: string;
  d: string;
}

interface TimelineMilestone {
  num: string;
  tag: string;
  t: string;
  d: string;
}

interface FaqItem {
  q: string;
  a: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    RouterLink,
    LandingNavComponent,
    LandingFooterComponent,
    RevealDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Sticky Glass Landing Navigation -->
    <app-landing-nav />

    <main class="about-main">
      <!-- Ambient Glow Blobs -->
      <div class="glow glow-1" aria-hidden="true"></div>
      <div class="glow glow-2" aria-hidden="true"></div>

      <!-- ===================================================================
           1. HERO SECTION
           =================================================================== -->
      <section class="sec hero-sec">
        <div class="w">
          <div class="hero-grid">
            <!-- Left Headline & Narrative -->
            <div class="hero-content">
              <div class="eyebrow-pill" appReveal revealDelay="0s">
                <span class="eyebrow-dot"></span>
                <span>Methodology & Architecture</span>
              </div>

              <h1 class="hero-title">
                @for (w of headlineWords; track $index) {
                  <span class="wd"><span [style.--i]="$index">{{ w }}</span></span>{{ ' ' }}
                }
              </h1>

              <p class="hero-lead" appReveal revealDelay="0.2s">
                Most aspiring engineers struggle not from a shortage of intelligence, but from fragmentation of guidance. DevTrack provides a unified, objective measurement of software engineering readiness.
              </p>

              <div class="hero-actions" appReveal revealDelay="0.3s">
                @if (auth.isLoggedIn()) {
                  <a class="btn primary-btn" routerLink="/app/dashboard">Open Workspace →</a>
                } @else {
                  <a class="btn primary-btn" routerLink="/register">Create Free Account</a>
                  <a class="btn outline-btn" routerLink="/">Return to Home</a>
                }
              </div>
            </div>

            <!-- Right Hero Photo Frame -->
            <div class="hero-visual" appReveal revealDelay="0.25s">
              <div class="photo-ambient-glow" aria-hidden="true"></div>
              <div class="photo-frame">
                <img
                  src="images/how-it-works.jpg"
                  alt="Developer analyzing architecture and readiness roadmap"
                  class="photo-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           2. CORE PILLARS / PRINCIPLES GRID
           =================================================================== -->
      <section class="sec principles-sec">
        <div class="w">
          <div class="sec-header" appReveal revealDelay="0s">
            <span class="sec-label">Foundational Principles</span>
            <h2 class="sec-title">Architected for engineering clarity</h2>
            <p class="sec-lead">
              Three pillars that guide how DevTrack measures, structures, and accelerates career progression.
            </p>
          </div>

          <div class="principles-grid">
            @for (v of values; track v.t; let idx = $index) {
              <div
                class="principle-card"
                appReveal
                [revealDelay]="idx * 0.12 + 's'"
                (mousemove)="onCardMouseMove($event)"
              >
                <div class="principle-icon-wrap" aria-hidden="true">
                  <span class="principle-icon">{{ v.i }}</span>
                </div>
                <h3 class="principle-title">{{ v.t }}</h3>
                <p class="principle-desc">{{ v.d }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ===================================================================
           3. METHODOLOGY TIMELINE
           =================================================================== -->
      <section class="sec timeline-sec">
        <div class="w">
          <div class="sec-header" appReveal revealDelay="0s">
            <span class="sec-label">The Execution Blueprint</span>
            <h2 class="sec-title">How the methodology moves you forward</h2>
            <p class="sec-lead">
              Turning ambiguous role descriptions into a deterministic sequence of milestones.
            </p>
          </div>

          <div class="timeline-wrap" #timelineContainer>
            <!-- Vertical Scroll-Linked Guideline -->
            <div class="timeline-track" aria-hidden="true">
              <div
                class="timeline-fill"
                [style.height.%]="timelineProgress()"
              ></div>
            </div>

            <!-- Step Cards -->
            <div class="timeline-items">
              @for (m of milestones; track m.num; let idx = $index) {
                <div
                  class="timeline-item"
                  appReveal
                  [revealDelay]="idx * 0.15 + 's'"
                >
                  <div class="timeline-badge" aria-hidden="true">
                    <span>{{ m.num }}</span>
                  </div>
                  <div class="timeline-card">
                    <span class="timeline-tag">{{ m.tag }}</span>
                    <h3 class="timeline-title">{{ m.t }}</h3>
                    <p class="timeline-desc">{{ m.d }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           4. READINESS ALGORITHM & PACED TIME
           =================================================================== -->
      <section class="sec algorithm-sec">
        <div class="w">
          <div class="sec-header" appReveal revealDelay="0s">
            <span class="sec-label">Mathematical Precision</span>
            <h2 class="sec-title">The Readiness Algorithm</h2>
            <p class="sec-lead">
              Every role requires a distinct weighting across engineering domains. A Frontend Specialist requires deep knowledge of DOM APIs, CSS architectures, and reactive frameworks; a Backend Engineer emphasizes distributed consensus, caching, and storage schemas.
            </p>
          </div>

          <div class="algo-grid">
            <!-- Card 1: The Core Formula Breakdown -->
            <div class="algo-card" appReveal revealDelay="0.1s">
              <div class="algo-badge-row">
                <span class="algo-tag">Score Formula</span>
                <span class="algo-status">Deterministic</span>
              </div>

              <div class="formula-box">
                <code class="formula-code">
                  Readiness Score = (85% × Weighted Skill Coverage) + (15% × Project Proof Progress)
                </code>
              </div>

              <!-- Animated Dual-Ring & Percentage Split -->
              <div class="formula-visual">
                <div class="ring-wrap" aria-hidden="true">
                  <svg viewBox="0 0 100 100" class="ring-svg">
                    <circle class="ring-bg" cx="50" cy="50" r="42" />
                    <circle class="ring-skill" cx="50" cy="50" r="42" />
                    <circle class="ring-proj" cx="50" cy="50" r="42" />
                  </svg>
                  <div class="ring-center">
                    <span class="ring-pct">100%</span>
                    <span class="ring-name">Readiness</span>
                  </div>
                </div>

                <div class="bars-wrap">
                  <div class="bar-item">
                    <div class="bar-info">
                      <span class="bar-name">Weighted Skill Coverage</span>
                      <strong class="bar-weight">85%</strong>
                    </div>
                    <div class="bar-rail" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
                      <div class="bar-fill bar-fill-skill" style="width: 85%;"></div>
                    </div>
                  </div>

                  <div class="bar-item">
                    <div class="bar-info">
                      <span class="bar-name">Project Proof Progress</span>
                      <strong class="bar-weight">15%</strong>
                    </div>
                    <div class="bar-rail" role="progressbar" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">
                      <div class="bar-fill bar-fill-proj" style="width: 15%;"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card 2: Paced Time Calculation -->
            <div class="algo-card" appReveal revealDelay="0.22s">
              <div class="algo-badge-row">
                <span class="algo-tag">Paced Time Calculation</span>
                <span class="algo-status">Dynamic Velocity</span>
              </div>

              <div class="formula-box">
                <code class="formula-code">
                  Total Remaining Hours = Σ (Topic Hours × Pace Factor [Beginner: 1.25, Intermediate: 1.0, Advanced: 0.8]) + (Remaining Projects × 15h × Pace Factor). Estimated Weeks = Remaining Hours ÷ Weekly Hours.
                </code>
              </div>

              <div class="factors-grid">
                <div class="factor-pill">
                  <span class="factor-val">1.25×</span>
                  <span class="factor-lbl">Beginner Pace</span>
                </div>
                <div class="factor-pill">
                  <span class="factor-val">1.0×</span>
                  <span class="factor-lbl">Intermediate Pace</span>
                </div>
                <div class="factor-pill">
                  <span class="factor-val">0.8×</span>
                  <span class="factor-lbl">Advanced Pace</span>
                </div>
                <div class="factor-pill">
                  <span class="factor-val">15h</span>
                  <span class="factor-lbl">Per Proof Project</span>
                </div>
              </div>

              <p class="algo-note">
                Adaptive velocity recalibrates weekly based on recorded study hours and completed assessments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           5. FREQUENTLY ASKED QUESTIONS (ACCORDION)
           =================================================================== -->
      <section class="sec faq-sec">
        <div class="w" style="max-width: 860px;">
          <div class="sec-header" appReveal revealDelay="0s">
            <span class="sec-label">Clarifications</span>
            <h2 class="sec-title">Frequently Asked Questions</h2>
            <p class="sec-lead">
              Everything you need to know about DevTrack's architecture, security, and career roadmap model.
            </p>
          </div>

          <div class="faq-accordion" role="region" aria-label="Frequently Asked Questions">
            @for (f of faqs; track f.q; let idx = $index) {
              <div
                class="faq-card"
                [class.open]="isOpen(idx)"
                appReveal
                [revealDelay]="idx * 0.08 + 's'"
              >
                <button
                  type="button"
                  class="faq-trigger"
                  (click)="toggleFaq(idx)"
                  (keydown.enter)="toggleFaq(idx)"
                  (keydown.space)="toggleFaq(idx); $event.preventDefault()"
                  [attr.aria-expanded]="isOpen(idx)"
                  [attr.aria-controls]="'faq-body-' + idx"
                  [id]="'faq-head-' + idx"
                >
                  <span class="faq-query">{{ f.q }}</span>
                  <span class="faq-icon-indicator" aria-hidden="true">+</span>
                </button>

                <div
                  class="faq-body-collapse"
                  [class.expanded]="isOpen(idx)"
                  [id]="'faq-body-' + idx"
                  role="region"
                  [attr.aria-labelledby]="'faq-head-' + idx"
                >
                  <div class="faq-body-content">
                    <p class="faq-answer">{{ f.a }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ===================================================================
           6. CLOSING CALL TO ACTION
           =================================================================== -->
      <section class="sec cta-sec">
        <div class="w">
          <div class="cta-banner" appReveal revealDelay="0.1s">
            <div class="cta-glow" aria-hidden="true"></div>
            <div class="cta-inner">
              <span class="cta-kicker">Start Your Calibration</span>
              <h2 class="cta-headline">Master your engineering career with deterministic milestones.</h2>
              <p class="cta-sub">
                Join ambitious developers turning vague preparation into measurable, verifiable job readiness.
              </p>

              <div class="cta-button-cluster">
                @if (auth.isLoggedIn()) {
                  <a class="btn primary-btn" routerLink="/app/dashboard">Open Workspace →</a>
                } @else {
                  <a class="btn primary-btn" routerLink="/register">Create Free Account</a>
                  <a class="btn outline-btn" routerLink="/login">Sign In</a>
                }
                <a class="btn ghost-btn" routerLink="/">Return to Home</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Professional 4-Column Landing Footer -->
    <app-landing-footer />
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class About implements OnInit, OnDestroy {
  auth = inject(AuthService);
  private ngZone = inject(NgZone);

  @ViewChild('timelineContainer') timelineContainer?: ElementRef<HTMLElement>;

  headlineWords = 'Turning ambitious career goals into structured, deterministic milestones.'.split(' ');

  timelineProgress = signal(0);
  openFaq = signal<number | null>(0);

  private scrollCleanup?: () => void;

  values: CorePillar[] = [
    {
      i: '🎯',
      t: 'Target-First Calibration',
      d: 'Requirements shift based on target company tiers (Big Tech, Startups, Enterprise).'
    },
    {
      i: '🔍',
      t: 'Radical Transparency',
      d: 'Inspect the formula and exact breakdown behind every metric and timeline estimate.'
    },
    {
      i: '🤝',
      t: 'Integrated Ecosystem',
      d: 'Notes, resources, project tracking, and an AI mentor live in one polished environment.'
    },
  ];

  milestones: TimelineMilestone[] = [
    {
      num: '01',
      tag: 'Target-First Calibration',
      t: 'Role & Tier Calibration',
      d: 'Requirements shift based on target company tiers (Big Tech, Startups, Enterprise). Every role requires a distinct weighting across engineering domains.'
    },
    {
      num: '02',
      tag: 'Domain Specialization',
      t: 'Weighted Skill Auditing',
      d: 'A Frontend Specialist requires deep knowledge of DOM APIs, CSS architectures, and reactive frameworks; a Backend Engineer emphasizes distributed consensus, caching, and storage schemas.'
    },
    {
      num: '03',
      tag: 'Readiness Calculation',
      t: 'The Readiness Algorithm',
      d: 'Readiness Score = (85% × Weighted Skill Coverage) + (15% × Project Proof Progress). Balances theoretical mastery with proof of shipped engineering artifacts.'
    },
    {
      num: '04',
      tag: 'Velocity & Pacing',
      t: 'Paced Time Estimation',
      d: 'Total Remaining Hours = Σ (Topic Hours × Pace Factor [Beginner: 1.25, Intermediate: 1.0, Advanced: 0.8]) + (Remaining Projects × 15h × Pace Factor). Estimated Weeks = Remaining Hours ÷ Weekly Hours.'
    }
  ];

  faqs: FaqItem[] = [
    {
      q: 'Is DevTrack completely free?',
      a: 'Yes. DevTrack is built for students, career switchers, and developers preparing for their next role.'
    },
    {
      q: 'How is data stored?',
      a: 'Your data is securely stored on the DevTrack backend API, protected with bcrypt password hashing and 7-day JWT bearer authentication.'
    },
    {
      q: 'Can I adjust my target role or company?',
      a: 'Yes. You can edit your target role, company, level, or weekly hours anytime in Profile → Goals. The entire roadmap and calculator will instantly recompute.'
    },
    {
      q: 'How does the AI Mentor work?',
      a: 'The built-in AI mentor reads your real progress data, target goals, and topic notes to provide personalized interview guidance and roadmap suggestions.'
    },
  ];

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      const onScroll = () => {
        if (this.timelineContainer?.nativeElement) {
          const rect = this.timelineContainer.nativeElement.getBoundingClientRect();
          const vh = window.innerHeight;
          const totalHeight = rect.height;
          // Progress fills from when top reaches 65% of viewport to when bottom passes 50%
          const current = (vh * 0.65) - rect.top;
          const pct = Math.min(Math.max((current / totalHeight) * 100, 0), 100);
          this.timelineProgress.set(pct);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      this.scrollCleanup = () => window.removeEventListener('scroll', onScroll);
    });
  }

  ngOnDestroy(): void {
    if (this.scrollCleanup) {
      this.scrollCleanup();
    }
  }

  toggleFaq(index: number): void {
    this.openFaq.update(cur => cur === index ? null : index);
  }

  isOpen(index: number): boolean {
    return this.openFaq() === index;
  }

  onCardMouseMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    target.style.setProperty('--mouse-x', `${x}%`);
    target.style.setProperty('--mouse-y', `${y}%`);
  }
}
