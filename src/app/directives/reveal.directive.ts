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

    if (prefersReducedMotion) {
      nativeEl.classList.remove('rv');
      return;
    }

    nativeEl.classList.add('rv');
    if (this.revealDelay) {
      nativeEl.style.setProperty('--d', this.revealDelay);
    }

    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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

