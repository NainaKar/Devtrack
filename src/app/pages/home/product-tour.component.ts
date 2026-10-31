import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  ElementRef,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-product-tour',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="shw" id="demo" aria-label="30 second product tour" #sectionRef>
      <div class="stg">
        <div class="scr" [class.pa]="isPaused()" #scrRef>
          <!-- Tour Tabs Header -->
          <div class="tb">
            <span class="dots"><i></i><i></i><i></i></span>
            <button type="button" [class.on]="activeTab() === 0" (click)="goTo(0)">Target</button>
            <button type="button" [class.on]="activeTab() === 1" (click)="goTo(1)">Skills</button>
            <button type="button" [class.on]="activeTab() === 2" (click)="goTo(2)">Roadmap</button>
            <button type="button" [class.on]="activeTab() === 3" (click)="goTo(3)">Readiness</button>
            <button type="button" [class.on]="activeTab() === 4" (click)="goTo(4)">Jobs</button>
            <button type="button" [class.on]="activeTab() === 5" (click)="goTo(5)">Mentor</button>
            <button
              type="button"
              class="pp"
              [attr.aria-label]="isPaused() ? 'Play tour' : 'Pause tour'"
              (click)="togglePause()"
            >
              {{ isPaused() ? '▶' : '⏸' }}
            </button>
          </div>

          <!-- Tour Scenes Body -->
          <div class="bd">
            <!-- Scene 0: Target -->
            <div class="sc" [class.act]="activeTab() === 0">
              <h3>Set your target</h3>
              <p>Pick a role, company tier, timeline and weekly hours.</p>
              <div class="rw a" style="--d:.1s">
                <b>Role</b><span class="ty" style="--w:17ch;--d:.5s">Angular Developer</span>
              </div>
              <div class="rw a" style="--d:.6s">
                <b>Company tier</b>
                <span class="chp">Startup</span>
                <span class="chp">Product</span>
                <span class="chp s" style="--d:1.8s">Top tier</span>
              </div>
              <div class="rw a" style="--d:1s">
                <b>Timeline</b>
                <span class="chp">4 weeks</span>
                <span class="chp s" style="--d:2.4s">8 weeks</span>
                <span class="chp">12 weeks</span>
              </div>
              <div class="rw a" style="--d:1.4s">
                <b>Study hours</b>
                <span class="chp s" style="--d:2.8s">12 per week</span>
              </div>
              <span class="btn a" style="--d:3.3s;margin-top:8px">Build my roadmap</span>
            </div>

            <!-- Scene 1: Skills -->
            <div class="sc" [class.act]="activeTab() === 1">
              <h3>Audit what you know</h3>
              <p>Tick the skills you already have to get your starting score.</p>
              <div class="two">
                <div>
                  <div class="rw"><span class="ck" style="--d:.5s">✓</span>Angular components</div>
                  <div class="rw"><span class="ck" style="--d:1s">✓</span>TypeScript</div>
                  <div class="rw"><span class="ck" style="--d:1.5s">✓</span>Routing and guards</div>
                  <div class="rw"><span class="ck e"></span>RxJS operators</div>
                  <div class="rw"><span class="ck e"></span>Signals and NgRx</div>
                </div>
                <div class="ring" [style.--v]="ringScore1()">
                  <b>{{ ringScore1() }}%</b>
                </div>
              </div>
            </div>

            <!-- Scene 2: Roadmap -->
            <div class="sc" [class.act]="activeTab() === 2">
              <h3>Follow the roadmap</h3>
              <p>Weekly milestones with hours and a project to ship.</p>
              <div class="rw a" style="--d:.1s">
                <b>Week 1</b>Components and templates, 8h
                <div class="bt"><s style="width:100%;--d:.6s"></s></div>
              </div>
              <div class="rw a" style="--d:.5s">
                <b>Week 2</b>RxJS and state, 10h
                <div class="bt"><s style="width:100%;--d:1s"></s></div>
              </div>
              <div class="rw a" style="--d:.9s">
                <b>Week 3</b>Routing and forms, 10h
                <div class="bt"><s style="width:60%;--d:1.4s"></s></div>
              </div>
              <div class="rw a" style="--d:1.3s">
                <b>Week 4</b>Ship: task dashboard, 12h
                <div class="bt"><s style="width:25%;--d:1.8s"></s></div>
              </div>
            </div>

            <!-- Scene 3: Readiness -->
            <div class="sc" [class.act]="activeTab() === 3">
              <h3>Test what-if plans</h3>
              <p>Change your study hours and watch readiness move.</p>
              <div class="two">
                <div>
                  <b>Study hours per week: <span>{{ studyHours() }}</span></b>
                  <div class="sl"><i></i></div>
                  <div class="rw">Top tier, 8 weeks, Angular Developer</div>
                </div>
                <div class="ring r2" [style.--v]="ringScore2()">
                  <b>{{ ringScore2() }}%</b>
                </div>
              </div>
            </div>

            <!-- Scene 4: Jobs -->
            <div class="sc" [class.act]="activeTab() === 4">
              <h3>Track every application</h3>
              <p>Move each company from applied to offer.</p>
              <div class="kb">
                <div class="col">
                  <h4>Applied</h4>
                  <div class="jc me mv"><b>Stripe</b><br>Angular Developer</div>
                  <div class="jc"><b>Shopify</b><br>Frontend</div>
                  <div class="jc"><b>Atlassian</b><br>SDE</div>
                </div>
                <div class="col">
                  <h4>Interview</h4>
                </div>
                <div class="col">
                  <h4>Offer</h4>
                </div>
              </div>
            </div>

            <!-- Scene 5: Mentor -->
            <div class="sc" [class.act]="activeTab() === 5">
              <h3>Ask the AI mentor</h3>
              <p>Get a next step based on your gaps.</p>
              <div class="ch">
                <div class="bu u a" style="--d:.2s">What should I learn next for Stripe?</div>
                <div class="bu m a" style="--d:1s">
                  Your biggest gap is RxJS operators. Do these next:
                  <div class="a" style="--d:1.8s;margin-top:6px">● Build the Signals task dashboard</div>
                  <div class="a" style="--d:2.6s;margin-top:4px">● Practice switchMap and debounceTime</div>
                </div>
                <div class="rdy">Readiness 90%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    .shw {
      position: relative;
      z-index: 3;
      height: 240vh;
    }
    .stg {
      position: sticky;
      top: 0;
      height: 100vh;
      padding: 72px 16px 0;
      box-sizing: border-box;
      display: grid;
      place-items: center;
    }
    .scr {
      width: min(1060px, 100%);
      height: min(600px, calc(100vh - 150px));
      background: var(--sf, #fbf6ea);
      border: 1px solid var(--ln, #e0d1b8);
      border-radius: calc(var(--r, 20px) * 1.2);
      box-shadow: 0 30px 70px rgba(63, 31, 18, .28);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      will-change: transform, opacity;
      opacity: 0;
      transition: opacity .3s ease;
    }
    .tb {
      display: flex;
      align-items: center;
      gap: 4px;
      background: var(--dk, #3f1f12);
      color: var(--on, #f6eddc);
      padding: 8px 14px;
      overflow-x: auto;
      flex: none;
    }
    .dots {
      display: flex;
      gap: 6px;
      margin-right: 10px;
    }
    .dots i {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--ac, #b4561f);
    }
    .dots i + i {
      background: var(--ac2, #ecd3b8);
    }
    .dots i + i + i {
      background: #4f8a70;
    }
    .tb button {
      position: relative;
      font: 500 14px var(--fb, 'Instrument Sans', sans-serif);
      color: inherit;
      opacity: .65;
      background: none;
      border: 0;
      padding: 8px 12px;
      cursor: pointer;
      white-space: nowrap;
      transition: opacity .2s;
    }
    .tb button:hover {
      opacity: .9;
    }
    .tb button.on {
      opacity: 1;
    }
    .tb button.on::after {
      content: '';
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: 0;
      height: 3px;
      border-radius: 3px;
      background: var(--ac2, #ecd3b8);
      transform-origin: left;
      animation: tf 5s linear forwards;
    }
    @keyframes tf {
      from {
        transform: scaleX(0);
      }
    }
    .tb .pp {
      margin-left: auto;
      opacity: 1;
      font-size: 16px;
    }
    .pa * {
      animation-play-state: paused !important;
    }
    .bd {
      position: relative;
      flex: 1;
      overflow: hidden;
    }
    .sc {
      position: absolute;
      inset: 0;
      padding: clamp(16px, 3vw, 36px);
      opacity: 0;
      visibility: hidden;
      transition: opacity .4s;
      overflow-y: auto;
    }
    .sc.act {
      opacity: 1;
      visibility: visible;
    }
    .sc h3 {
      font-family: var(--fd, 'Fraunces', Georgia, serif);
      font-size: clamp(24px, 3vw, 34px);
      line-height: 1.1;
      margin: 0;
      color: var(--ink, #2e1a10);
    }
    .sc > p {
      color: var(--mu, #7a5a47);
      margin: 6px 0 20px;
      font-size: 15px;
    }
    .rw {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      padding: 12px 16px;
      border: 1px solid var(--ln, #e0d1b8);
      border-radius: calc(var(--r, 20px) / 2);
      background: var(--bg, #f4ecdc);
      margin-bottom: 10px;
      font-size: 15px;
      color: var(--ink, #2e1a10);
    }
    .rw b {
      font-weight: 600;
      min-width: 110px;
    }
    .chp {
      padding: 6px 14px;
      border-radius: 99px;
      border: 1px solid var(--ln, #e0d1b8);
      font-size: 14px;
      background: var(--sf, #fbf6ea);
      color: var(--ink, #2e1a10);
    }
    .chp.s {
      background: var(--ac, #b4561f);
      color: var(--on, #f6eddc);
      border-color: var(--ac, #b4561f);
    }
    .act .chp.s {
      animation: sel .4s backwards;
      animation-delay: var(--d, 0s);
    }
    @keyframes sel {
      from {
        background: transparent;
        color: var(--ink, #2e1a10);
        border-color: var(--ln, #e0d1b8);
      }
    }
    .bt {
      height: 8px;
      border-radius: 9px;
      background: var(--ac2, #ecd3b8);
      flex: 1;
      min-width: 80px;
      overflow: hidden;
      margin-left: auto;
    }
    .bt s {
      display: block;
      height: 100%;
      background: var(--ac, #b4561f);
      transform-origin: left;
      border-radius: 9px;
    }
    .act .a {
      animation: in .6s cubic-bezier(.2, .7, .2, 1) backwards;
      animation-delay: var(--d, 0s);
    }
    @keyframes in {
      from {
        opacity: 0;
        transform: translateY(14px);
      }
    }
    .act .bt s {
      animation: bf 1.2s ease-out backwards;
      animation-delay: var(--d, 0s);
    }
    @keyframes bf {
      from {
        transform: scaleX(0);
      }
    }
    .ty {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      vertical-align: bottom;
      width: var(--w, 17ch);
    }
    .act .ty {
      animation: ty 1.2s steps(17) var(--d, 0s) backwards;
    }
    @keyframes ty {
      from {
        width: 0;
      }
    }
    .ck {
      width: 22px;
      height: 22px;
      border-radius: 6px;
      background: var(--ac, #b4561f);
      color: var(--on, #f6eddc);
      display: grid;
      place-items: center;
      font-size: 14px;
      flex: none;
    }
    .ck.e {
      background: transparent;
      box-shadow: inset 0 0 0 2px var(--ln, #e0d1b8);
    }
    .act .ck:not(.e) {
      animation: ck .35s backwards;
      animation-delay: var(--d, 0s);
    }
    @keyframes ck {
      from {
        background: transparent;
        color: transparent;
        box-shadow: inset 0 0 0 2px var(--ln, #e0d1b8);
      }
    }
    .two {
      display: flex;
      gap: 32px;
      align-items: center;
      flex-wrap: wrap;
    }
    .two > div:first-child {
      flex: 1;
      min-width: 230px;
    }
    .ring {
      --v: 38;
      width: 150px;
      aspect-ratio: 1;
      border-radius: 50%;
      background: conic-gradient(var(--ac, #b4561f) calc(var(--v, 38) * 1%), var(--ac2, #ecd3b8) 0);
      display: grid;
      place-items: center;
      flex: none;
    }
    .ring b {
      width: 78%;
      aspect-ratio: 1;
      border-radius: 50%;
      background: var(--sf, #fbf6ea);
      display: grid;
      place-items: center;
      font-family: var(--fh, 'Ghilbe', 'Gloock', Georgia, serif);
      font-weight: 400;
      font-size: 34px;
      color: var(--ink, #2e1a10);
    }
    .sl {
      height: 8px;
      border-radius: 9px;
      background: var(--ac2, #ecd3b8);
      margin: 14px 0 24px;
    }
    .sl i {
      display: block;
      height: 100%;
      width: 80%;
      background: var(--ac, #b4561f);
      border-radius: 9px;
      position: relative;
    }
    .sl i::after {
      content: '';
      position: absolute;
      right: -10px;
      top: -6px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--on, #f6eddc);
      border: 3px solid var(--ac, #b4561f);
    }
    .act .sl i {
      animation: sw 3s ease-in-out .5s backwards;
    }
    @keyframes sw {
      from {
        width: 25%;
      }
    }
    .kb {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }
    .col {
      background: var(--bg, #f4ecdc);
      border: 1px solid var(--ln, #e0d1b8);
      border-radius: calc(var(--r, 20px) / 2);
      padding: 10px;
      min-height: 180px;
    }
    .col h4 {
      margin: 0 0 8px;
      font: 600 13px var(--fb, 'Instrument Sans', sans-serif);
      color: var(--mu, #7a5a47);
    }
    .jc {
      background: var(--sf, #fbf6ea);
      border: 1px solid var(--ln, #e0d1b8);
      border-radius: 10px;
      padding: 10px;
      font-size: 13px;
      margin-bottom: 8px;
    }
    .jc.me {
      border-color: var(--ac, #b4561f);
      box-shadow: 0 6px 16px rgba(180, 86, 31, .25);
      position: relative;
      z-index: 2;
    }
    .act .mv {
      animation: mv 4s ease-in-out .6s forwards;
    }
    @keyframes mv {
      0%, 15% {
        transform: none;
      }
      35%, 55% {
        transform: translateX(calc(100% + 24px));
      }
      75%, 100% {
        transform: translateX(calc(200% + 48px));
      }
    }
    .ch {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 640px;
    }
    .bu {
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 15px;
      max-width: 88%;
      line-height: 1.5;
    }
    .bu.u {
      align-self: flex-end;
      background: var(--ac, #b4561f);
      color: var(--on, #f6eddc);
    }
    .bu.m {
      background: var(--bg, #f4ecdc);
      border: 1px solid var(--ln, #e0d1b8);
      color: var(--ink, #2e1a10);
    }
    .rdy {
      align-self: flex-start;
      padding: 10px 18px;
      border-radius: 99px;
      background: #264a3a;
      color: var(--on, #f6eddc);
      font-weight: 600;
    }
    .act .rdy {
      animation: pop .6s backwards 3.8s;
    }
    @keyframes pop {
      from {
        opacity: 0;
        transform: scale(.6);
      }
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      border-radius: calc(var(--r, 20px) * .5);
      background: var(--ac, #b4561f);
      color: var(--on, #f6eddc);
      font-weight: 600;
      font-size: 14px;
      border: 0;
      cursor: pointer;
      text-decoration: none;
      align-self: flex-start;
    }
    @media (max-width: 768px) {
      .shw {
        height: auto;
        padding: 48px 0;
      }
      .stg {
        position: static;
        height: auto;
        padding: 0 16px;
        display: block;
      }
      .scr {
        width: 100% !important;
        height: 520px !important;
        max-height: 520px !important;
        opacity: 1 !important;
        transform: none !important;
        border-radius: 16px;
      }
      .tb {
        padding: 8px 10px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        gap: 2px;
      }
      .tb::-webkit-scrollbar {
        display: none;
      }
      .dots {
        display: none;
      }
      .tb button {
        padding: 8px 10px;
        font-size: 13px;
        min-height: 40px;
      }
      .sc {
        padding: 16px 14px;
      }
      .sc h3 {
        font-size: 20px;
      }
      .sc > p {
        font-size: 13px;
        margin: 4px 0 14px;
      }
      .rw {
        padding: 8px 10px;
        font-size: 13px;
        gap: 8px;
        margin-bottom: 8px;
      }
      .rw b {
        min-width: 0;
        width: 100%;
        font-size: 13px;
      }
      .chp {
        padding: 4px 10px;
        font-size: 12px;
      }
      .two {
        gap: 16px;
      }
      .two > div:first-child {
        min-width: 0;
        width: 100%;
      }
      .ring {
        width: 100px;
      }
      .ring b {
        font-size: 24px;
      }
      .kb {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .col {
        min-height: auto;
        padding: 8px;
      }
      .jc {
        padding: 8px;
        font-size: 12px;
        margin-bottom: 6px;
      }
      .bu {
        padding: 10px 12px;
        font-size: 13px;
        max-width: 100%;
      }
    }
    @media (max-width: 560px) {
      .rw b {
        min-width: 0;
        width: 100%;
      }
      .ring {
        width: 110px;
      }
      .kb {
        grid-template-columns: 1fr;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .scr {
        opacity: 1 !important;
        transform: none !important;
      }
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    }
  `]
})
export class ProductTourComponent implements OnInit, OnDestroy {
  private ngZone = inject(NgZone);

  @ViewChild('sectionRef', { static: true }) sectionRef!: ElementRef<HTMLElement>;
  @ViewChild('scrRef', { static: true }) scrRef!: ElementRef<HTMLElement>;

  activeTab = signal(0);
  isPaused = signal(false);

  // Dynamic animated numbers
  ringScore1 = signal(38);
  studyHours = signal(15);
  ringScore2 = signal(74);

  private timerId?: any;
  private scrollRafId?: number;
  private isLive = false;
  private prefersReducedMotion = false;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.ngZone.runOutsideAngular(() => {
      const handleScrollOrResize = () => {
        if (!this.scrollRafId) {
          this.scrollRafId = requestAnimationFrame(() => {
            this.scrollRafId = undefined;
            this.updateMorph();
          });
        }
      };

      window.addEventListener('scroll', handleScrollOrResize, { passive: true });
      window.addEventListener('resize', handleScrollOrResize, { passive: true });

      // Initial layout evaluation
      this.updateMorph();
    });

    // Start tour on scene 0
    this.goTo(0);
  }

  ngOnDestroy(): void {
    if (this.timerId) clearTimeout(this.timerId);
    if (this.scrollRafId) cancelAnimationFrame(this.scrollRafId);
  }

  goTo(sceneIndex: number): void {
    const next = (sceneIndex + 6) % 6;
    this.activeTab.set(next);

    if (this.timerId) clearTimeout(this.timerId);

    // Trigger number counts
    this.animateNumbers(next);

    if (this.isLive && !this.isPaused() && !this.prefersReducedMotion) {
      this.timerId = setTimeout(() => {
        this.goTo(next + 1);
      }, 5000);
    }
  }

  togglePause(): void {
    const nextPaused = !this.isPaused();
    this.isPaused.set(nextPaused);

    if (nextPaused) {
      if (this.timerId) clearTimeout(this.timerId);
    } else {
      this.goTo(this.activeTab());
    }
  }

  private animateNumbers(scene: number): void {
    if (this.prefersReducedMotion) return;

    if (scene === 1) {
      this.interpolate(0, 38, 2500, (v) => this.ringScore1.set(v));
    } else if (scene === 3) {
      this.interpolate(6, 15, 2500, (v) => this.studyHours.set(v));
      this.interpolate(52, 74, 2500, (v) => this.ringScore2.set(v));
    }
  }

  private interpolate(start: number, end: number, duration: number, callback: (v: number) => void): void {
    const startTime = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      callback(Math.round(start + (end - start) * ease));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  private updateMorph(): void {
    const S = this.sectionRef.nativeElement;
    const scr = this.scrRef.nativeElement;
    const hv = document.querySelector('.hv');
    const rc = document.querySelector('.rc');

    if (!S || !scr) return;

    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      scr.style.opacity = '1';
      scr.style.transform = 'none';
      if (hv) hv.classList.remove('gone');
      return;
    }

    const scrollY = window.scrollY;
    const sOffsetTop = S.offsetTop;
    const p = sOffsetTop > 0 ? Math.min(1, Math.max(0, scrollY / sOffsetTop)) : 0;
    const sr = S.getBoundingClientRect();

    if (hv) {
      hv.classList.toggle('gone', p > 0.06);
    }

    if (this.prefersReducedMotion) {
      scr.style.opacity = '1';
      scr.style.transform = 'none';
    } else if (rc) {
      const t = 1 - p * p * (3 - 2 * p); // smoothstep
      const r = rc.getBoundingClientRect();
      const W = scr.offsetWidth;
      const cx = document.documentElement.clientWidth / 2;
      const cy = Math.max(sr.top, 0) + 72 + (window.innerHeight - 72) / 2;
      const tx = (r.left + r.width / 2 - cx) * t;
      const ty = (r.top + r.height / 2 - cy) * t;
      const scale = 1 - (1 - r.width / W) * t;

      scr.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      scr.style.opacity = String(Math.min(1, p / 0.08));
    } else {
      scr.style.opacity = String(Math.min(1, p / 0.08));
    }

    // Live state: active when section is in viewport
    const isNowLive = !this.prefersReducedMotion && p > 0.95 && sr.bottom > window.innerHeight * 0.4;
    if (isNowLive !== this.isLive) {
      this.isLive = isNowLive;
      if (this.isLive && !this.isPaused()) {
        this.goTo(0);
      } else {
        if (this.timerId) clearTimeout(this.timerId);
      }
    }
  }
}

