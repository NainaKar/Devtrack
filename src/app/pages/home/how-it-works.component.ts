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
  selector: 'app-how-it-works',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="sec" id="how" style="padding-top:0">
      <div class="w">
        <h2 appReveal revealDelay="0s">From baseline to offer letter in four steps</h2>
        <p class="sub" appReveal revealDelay="0.1s">A measurable path, so you always know what to do next.</p>
        <div class="steps">
          <img
            appReveal
            revealDelay="0.15s"
            class="steps-img"
            src="images/how-it-works.jpg"
            alt="A developer studying at a sunny desk with plants"
          >
          <ol>
            <li appReveal revealDelay="0.05s">
              <h3>Set your target</h3>
              <p>Choose a role, company tier, timeline and weekly study hours.</p>
            </li>
            <li appReveal revealDelay="0.15s">
              <h3>Audit what you know</h3>
              <p>Mark skills you already have to get your starting readiness score.</p>
            </li>
            <li appReveal revealDelay="0.25s">
              <h3>Follow the roadmap</h3>
              <p>Work through weekly topics and ship projects that prove it.</p>
            </li>
            <li appReveal revealDelay="0.35s">
              <h3>Apply with confidence</h3>
              <p>At 90% readiness, manage every application in the job tracker.</p>
            </li>
          </ol>
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
    .steps {
      display: grid;
      grid-template-columns: 1fr 1.1fr;
      gap: 56px;
      align-items: center;
      margin-top: 48px;
    }
    .steps > img {
      width: 100%;
      border-radius: var(--r, 20px);
      aspect-ratio: 4/5;
      object-fit: cover;
      transition: object-position .1s ease-out;
    }
    ol {
      list-style: none;
      margin: 0;
      padding: 0;
      counter-reset: s;
    }
    ol li {
      counter-increment: s;
      display: grid;
      grid-template-columns: 52px 1fr;
      gap: 0 18px;
      padding: 22px 0;
      border-top: 1px solid var(--ln, #e0d1b8);
    }
    ol li::before {
      content: counter(s);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--ac, #b4561f);
      color: var(--on, #f6eddc);
      display: grid;
      place-items: center;
      font-family: var(--fd, 'Fraunces', Georgia, serif);
      font-size: 19px;
      font-weight: 700;
      grid-row: span 2;
      transition: transform .3s;
    }
    ol li:hover::before {
      transform: scale(1.12);
    }
    ol h3 {
      font-family: var(--fd, 'Fraunces', Georgia, serif);
      font-size: 23px;
      line-height: 1.15;
      margin: 0 0 4px;
      color: var(--ink, #2e1a10);
    }
    ol p {
      color: var(--mu, #7a5a47);
      font-size: 15px;
      margin: 0;
      line-height: 1.5;
    }
    @media (max-width: 900px) {
      .steps {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HowItWorksComponent implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private ngZone = inject(NgZone);
  private rafId?: number;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ngZone.runOutsideAngular(() => {
      const updateParallax = () => {
        const img = this.el.nativeElement.querySelector('.steps-img') as HTMLImageElement | null;
        if (!img) return;
        const rect = img.getBoundingClientRect();
        const h = window.innerHeight;
        const clamp = (v: number) => Math.max(0, Math.min(100, v));
        const offset = clamp(50 + ((rect.top + rect.height / 2) / h - 0.5) * 90);
        img.style.objectPosition = `${offset}% 50%`;
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
