import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ElementRef,
  NgZone,
  inject
} from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-feature-grid',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="sec" id="features">
      <div class="w">
        <h2 appReveal revealDelay="0s">Everything you need to go from “learning” to “hired”</h2>
        <p class="sub" appReveal revealDelay="0.1s">
          Structured skill metrics, live analytics and proof-of-work tracking in one place.
        </p>
        <div class="grid">
          <div class="card" appReveal revealDelay="0s">
            <div class="ic">📈</div>
            <h3>Skill tracking</h3>
            <p>Check off concepts and watch your completion and role thresholds update live.</p>
          </div>
          <div class="card" appReveal revealDelay="0.09s">
            <div class="ic">🗺️</div>
            <h3>Milestone roadmap</h3>
            <p>Weekly milestones with estimated hours, paced to the time you actually have.</p>
          </div>
          <div class="ph" appReveal revealDelay="0.18s">
            <img class="parallax-img" src="images/features-skills.jpg" alt="Skill progress bars for Java, React, SQL and DSA on a laptop">
          </div>
          <div class="ph l" appReveal revealDelay="0.27s">
            <img class="parallax-img" src="images/features-dashboard.jpg" alt="DevTrack dashboard showing career readiness">
          </div>
          <div class="card" appReveal revealDelay="0s">
            <div class="ic">🧮</div>
            <h3>Readiness calculator</h3>
            <p>Try what-if plans: more study hours, a different company tier, a new deadline.</p>
          </div>
          <div class="card" appReveal revealDelay="0.09s">
            <div class="ic">🏢</div>
            <h3>Company job tracker</h3>
            <p>Keep applications, required skills, interview dates and recruiter notes together.</p>
          </div>
          <div class="card" appReveal revealDelay="0.18s">
            <div class="ic">🚀</div>
            <h3>Portfolio projects</h3>
            <p>Pick vetted projects with the tech stack, repo link and live demo to show.</p>
          </div>
          <div class="card" appReveal revealDelay="0.27s">
            <div class="ic">🤖</div>
            <h3>AI mentor</h3>
            <p>Get advice on what to learn next, clear explanations and interview tips.</p>
          </div>
          <div class="ph l" appReveal revealDelay="0s">
            <img class="parallax-img" src="images/features-readiness.jpg" alt="Career plan and interview readiness screen">
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    .sec {
      padding: 84px 0;
    }
    .w {
      max-width: 1180px;
      margin: 0 auto;
      padding: 0 24px;
    }
    h2 {
      font-family: var(--fd, 'Fraunces', Georgia, serif);
      font-size: clamp(32px, 4vw, 52px);
      line-height: 1.08;
      letter-spacing: -0.01em;
      max-width: 15em;
      margin: 0;
      color: var(--ink, #2e1a10);
    }
    .sub {
      color: var(--mu, #7a5a47);
      margin-top: 14px;
      max-width: 34em;
      font-size: 17px;
      line-height: 1.6;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 48px;
    }
    .card, .ph {
      border-radius: var(--r, 20px);
      overflow: hidden;
    }
    .card {
      background: var(--sf, #fbf6ea);
      border: 1px solid var(--ln, #e0d1b8);
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 260px;
      transition: transform .3s, box-shadow .3s, border-color .3s;
    }
    .card:hover {
      transform: translateY(-6px);
      box-shadow: 0 18px 34px rgba(63, 31, 18, .14);
      border-color: var(--ac, #b4561f);
    }
    .card .ic {
      width: 44px;
      height: 44px;
      border-radius: calc(var(--r, 20px) / 2);
      background: var(--ac2, #ecd3b8);
      display: grid;
      place-items: center;
      font-size: 21px;
      margin-bottom: auto;
      transition: transform .3s;
    }
    .card:hover .ic {
      transform: rotate(-8deg) scale(1.1);
    }
    .card h3 {
      font-family: var(--fd, 'Fraunces', Georgia, serif);
      font-size: 24px;
      line-height: 1.1;
      margin: 0;
      color: var(--ink, #2e1a10);
    }
    .card p {
      font-size: 15px;
      color: var(--mu, #7a5a47);
      margin: 0;
      line-height: 1.5;
    }
    .ph {
      grid-column: span 2;
      position: relative;
      min-height: 260px;
    }
    .ph img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform .9s cubic-bezier(.2, .7, .2, 1);
    }
    .ph:hover img {
      transform: scale(1.06);
    }
    .ph.l {
      grid-column: span 2;
    }
    @media (max-width: 1024px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
      .ph, .ph.l {
        grid-column: span 2;
      }
    }
    @media (max-width: 768px) {
      .sec {
        padding: 56px 0;
      }
      .w {
        padding: 0 16px;
      }
      .grid {
        grid-template-columns: 1fr;
        gap: 16px;
        margin-top: 36px;
      }
      .card {
        padding: 22px;
        min-height: auto;
      }
      .ph, .ph.l {
        grid-column: 1 / -1;
        width: 100%;
        min-height: 220px;
        aspect-ratio: 16/10;
      }
    }
  `]
})
export class FeatureGridComponent implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private ngZone = inject(NgZone);
  private rafId?: number;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ngZone.runOutsideAngular(() => {
      const updateParallax = () => {
        const imgs = this.el.nativeElement.querySelectorAll('.parallax-img');
        const h = window.innerHeight;
        const clamp = (v: number) => Math.max(0, Math.min(100, v));

        imgs.forEach((node: Element) => {
          const img = node as HTMLImageElement;
          const parent = img.parentElement;
          if (!parent) return;
          const rect = parent.getBoundingClientRect();
          const offset = clamp(50 + ((rect.top + rect.height / 2) / h - 0.5) * 90);
          img.style.objectPosition = `50% ${offset}%`;
        });
      };

      const onScroll = () => {
        if (!this.rafId) {
          this.rafId = requestAnimationFrame(() => {
            this.rafId = undefined;
            updateParallax();
          });
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      updateParallax();
    });
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
