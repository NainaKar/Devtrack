import { Directive, ElementRef, inject, Input, OnInit, OnDestroy, NgZone } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private ngZone = inject(NgZone);
  private observer?: IntersectionObserver;

  @Input() revealDelay = '0s';

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const nativeEl = this.el.nativeElement;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      nativeEl.classList.add('in');
      return;
    }

    nativeEl.classList.add('rv');
    if (this.revealDelay) {
      nativeEl.style.setProperty('--d', this.revealDelay);
    }

    // Safety fallback: ensure element is always visible even if observer never triggers
    const fallbackTimer = setTimeout(() => {
      nativeEl.classList.add('in');
    }, 1800);

    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            clearTimeout(fallbackTimer);
            nativeEl.classList.add('in');
            this.observer?.unobserve(nativeEl);
            setTimeout(() => {
              nativeEl.classList.remove('rv', 'in');
            }, 1400);
          }
        });
      }, { threshold: 0.12 });

      this.observer.observe(nativeEl);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

