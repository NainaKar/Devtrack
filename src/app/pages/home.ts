import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  NgZone,
  inject,
  signal
} from '@angular/core';
import { LandingNavComponent } from './home/landing-nav.component';
import { HeroComponent } from './home/hero.component';
import { ProductTourComponent } from './home/product-tour.component';
import { TechMarqueeComponent } from './home/tech-marquee.component';
import { FeatureGridComponent } from './home/feature-grid.component';
import { HowItWorksComponent } from './home/how-it-works.component';
import { RolesBandComponent } from './home/roles-band.component';
import { FinalCtaComponent } from './home/final-cta.component';
import { LandingFooterComponent } from './home/landing-footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LandingNavComponent,
    HeroComponent,
    ProductTourComponent,
    TechMarqueeComponent,
    FeatureGridComponent,
    HowItWorksComponent,
    RolesBandComponent,
    FinalCtaComponent,
    LandingFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Top Thin Scroll Progress Bar -->
    <div class="pg" [style.--p]="scrollProgress()"></div>

    <!-- Main Landing Sections -->
    <app-landing-nav />
    <app-hero />
    <app-product-tour />
    <app-tech-marquee />
    <app-feature-grid />
    <app-how-it-works />
    <app-roles-band />
    <app-final-cta />
    <app-landing-footer />
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      position: relative;
    }
  `]
})
export class Home implements OnInit, OnDestroy {
  private ngZone = inject(NgZone);

  scrollProgress = signal(0);
  private rafId?: number;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      const updateProgress = () => {
        const doc = document.documentElement;
        const totalHeight = doc.scrollHeight - window.innerHeight;
        const currentProgress = totalHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / totalHeight)) : 0;
        this.scrollProgress.set(currentProgress);
      };

      const onScroll = () => {
        if (!this.rafId) {
          this.rafId = requestAnimationFrame(() => {
            this.rafId = undefined;
            updateProgress();
          });
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      updateProgress();
    });
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
