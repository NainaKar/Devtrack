import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="hero">
      <div class="w">
        <div class="hero-content">
          <h1>
            @for (word of headlineWords; track $index) {
              <span class="wd"><span [style.--i]="$index">{{ word }}</span></span>{{ ' ' }}
            }
          </h1>
          <p class="lead">
            DevTrack measures your skills against what companies actually ask for, then builds a week-by-week plan to close the gap.
          </p>
          <div class="cta">
            @if (auth.isLoggedIn()) {
              <a class="btn" routerLink="/app/dashboard">Open Workspace →</a>
            } @else {
              <a class="btn" routerLink="/register">Create free account</a>
              <a class="btn o" href="#how">See how it works</a>
            }
          </div>
          <p class="fine">Free for developers. 76 curated topics and 33 vetted project ideas.</p>
        </div>

        <div class="hv">
          <img src="images/hero-welcome.jpg" alt="DevTrack welcome board on a desk with books and a mug">
          <div class="rc in">
            <b>Angular Developer, Stripe <span>On track</span></b>
            <div class="big">
              <em style="font-style:normal">{{ currentScore() }}</em>%<small>ready</small>
            </div>
            <div class="bar">
              <span>Angular components</span><span>85%</span>
              <div class="track"><div class="fill" style="width:85%"></div></div>
            </div>
            <div class="bar">
              <span>RxJS and state</span><span>68%</span>
              <div class="track"><div class="fill" style="width:68%"></div></div>
            </div>
            <div class="bar">
              <span>TypeScript</span><span>55%</span>
              <div class="track"><div class="fill" style="width:55%"></div></div>
            </div>
            <div class="bar">
              <span>Testing and performance</span><span>45%</span>
              <div class="track"><div class="fill" style="width:45%"></div></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
    .hero {
      padding: 72px 0 56px;
      position: relative;
      overflow: hidden;
    }
    .hero::before, .hero::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }
    .hero::before {
      width: 540px;
      height: 540px;
      top: -170px;
      right: -130px;
      background: radial-gradient(circle, rgba(180, 86, 31, .3), transparent 65%);
      animation: drift 14s ease-in-out infinite alternate;
    }
    .hero::after {
      width: 520px;
      height: 520px;
      bottom: -230px;
      left: -170px;
      background: radial-gradient(circle, rgba(38, 74, 58, .26), transparent 65%);
      animation: drift 18s ease-in-out infinite alternate-reverse;
    }
    @keyframes drift {
      to {
        transform: translate(-80px, 60px) scale(1.18);
      }
    }
    .w {
      max-width: 1180px;
      margin: 0 auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: 1.05fr 1fr;
      gap: 56px;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    .hero-content h1 {
      font-family: var(--fh, 'Ghilbe', 'Gloock', Georgia, serif);
      font-weight: 400;
      letter-spacing: -0.02em;
      font-size: clamp(30px, 5.6vw, 72px);
      line-height: 1.08;
      color: var(--ink, #2e1a10);
      margin: 0;
      overflow-wrap: break-word;
      word-break: normal;
    }
    .wd {
      display: inline-block;
      overflow: hidden;
      vertical-align: top;
      padding-bottom: .12em;
    }
    .wd > span {
      display: inline-block;
      transform: translateY(112%);
      animation: up .9s cubic-bezier(.2, .7, .2, 1) forwards;
      animation-delay: calc(.1s + var(--i, 0) * .08s);
    }
    @keyframes up {
      to {
        transform: none;
      }
    }
    .hero-content p.lead {
      font-size: 19px;
      color: var(--mu, #7a5a47);
      margin: 22px 0 32px;
      max-width: 30em;
      line-height: 1.6;
      opacity: 0;
      animation: rise .8s cubic-bezier(.2, .7, .2, 1) forwards;
      animation-delay: .25s;
    }
    .cta {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      opacity: 0;
      animation: rise .8s cubic-bezier(.2, .7, .2, 1) forwards;
      animation-delay: .4s;
    }
    .fine {
      margin-top: 20px;
      font-size: 14px;
      color: var(--mu, #7a5a47);
      opacity: 0;
      animation: rise .8s cubic-bezier(.2, .7, .2, 1) forwards;
      animation-delay: .55s;
    }
    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(22px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    .btn {
      display: inline-block;
      padding: 13px 24px;
      border-radius: calc(var(--r, 20px) * .6);
      background: var(--ac, #b4561f) !important;
      color: var(--on, #f6eddc) !important;
      font-weight: 600;
      font-size: 16px;
      border: 0;
      cursor: pointer;
      text-decoration: none !important;
      transition: transform .15s;
      position: relative;
      overflow: hidden;
    }
    .btn:visited,
    .btn:hover,
    .btn:focus,
    .btn:active {
      color: var(--on, #f6eddc) !important;
      background: var(--ac, #b4561f) !important;
      text-decoration: none !important;
    }
    .btn::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, .4) 50%, transparent 70%);
      transform: translateX(-130%);
    }
    .btn:hover::after {
      transition: transform .7s;
      transform: translateX(130%);
    }
    .btn:hover {
      transform: translateY(-2px);
    }
    .btn.o {
      background: transparent !important;
      color: var(--ink, #2e1a10) !important;
      border: 1.5px solid var(--ink, #2e1a10) !important;
    }
    .btn.o:visited,
    .btn.o:hover,
    .btn.o:focus,
    .btn.o:active {
      background: transparent !important;
      color: var(--ink, #2e1a10) !important;
      text-decoration: none !important;
    }
    .hv {
      position: relative;
    }
    :host-context(.hv.gone) .rc,
    .hv.gone .rc {
      visibility: hidden;
    }
    .hv img {
      width: 100%;
      display: block;
      border-radius: var(--r, 20px);
      aspect-ratio: 4/3;
      object-fit: cover;
      animation: wipe 1.1s cubic-bezier(.7, 0, .2, 1) .1s backwards;
    }
    @keyframes wipe {
      from {
        clip-path: inset(0 0 100% 0 round var(--r, 20px));
      }
      to {
        clip-path: inset(0 0 0 0 round var(--r, 20px));
      }
    }
    .rc {
      position: absolute;
      left: -36px;
      bottom: -30px;
      width: 300px;
      background: var(--dk, #3f1f12);
      color: var(--on, #f6eddc);
      border-radius: calc(var(--r, 20px) * .8);
      padding: 18px 20px;
      box-shadow: 0 18px 40px rgba(0,0,0,.25);
      font-size: 13px;
      opacity: 0;
      animation: rise .8s ease .8s forwards, fl 6s ease-in-out 1.8s infinite;
    }
    @keyframes fl {
      50% {
        transform: translateY(-9px);
      }
    }
    .rc b {
      font-size: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      color: var(--on, #f6eddc);
    }
    .rc b span {
      font-weight: 500;
      font-size: 12px;
      background: var(--ac2, #ecd3b8);
      color: var(--dk, #3f1f12);
      padding: 2px 9px;
      border-radius: 99px;
    }
    .big {
      font-family: var(--fh, 'Ghilbe', 'Gloock', Georgia, serif);
      font-weight: 400;
      font-size: 40px;
      line-height: 1;
      margin: 4px 0 6px;
      color: var(--on, #f6eddc);
    }
    .big small {
      font-family: var(--fb, 'Instrument Sans', sans-serif);
      font-weight: 500;
      font-size: 13px;
      opacity: .7;
      margin-left: 6px;
      color: var(--on, #f6eddc);
    }
    .rc .bar {
      display: grid !important;
      grid-template-columns: 1fr auto !important;
      gap: 2px 8px !important;
      margin-top: 9px !important;
      font-size: 13px !important;
      height: auto !important;
      background: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
    }
    .rc .bar span {
      color: var(--on, #f6eddc);
      line-height: 1.4;
    }
    .rc .track {
      grid-column: 1 / -1;
      height: 6px;
      border-radius: 9px;
      background: rgba(255, 255, 255, .14);
      overflow: hidden;
      display: block;
      margin: 0;
      padding: 0;
      border: none;
    }
    .rc .fill {
      display: block;
      height: 100%;
      border-radius: 9px;
      background: var(--lp-ac2, #ecd3b8);
      transform-origin: left;
      transform: scaleX(0);
      transition: transform 1.2s cubic-bezier(.2, .7, .2, 1) 1.1s;
    }
    .rc.in .fill {
      transform: none;
    }
    @media (max-width: 900px) {
      .w {
        grid-template-columns: 1fr;
      }
      .rc {
        left: 12px !important;
        right: auto !important;
        bottom: -24px;
      }
      .hv {
        margin-bottom: 30px;
      }
    }
    @media (max-width: 768px) {
      .hero {
        padding: 44px 0 32px;
      }
      .w {
        grid-template-columns: 1fr;
        gap: 36px;
        padding: 0 16px;
      }
      .hero-content h1 {
        font-size: clamp(28px, 7.5vw, 42px);
      }
      .hero-content p.lead {
        font-size: 16px;
        margin: 16px 0 24px;
      }
      .cta {
        flex-direction: column;
        width: 100%;
      }
      .cta .btn {
        width: 100%;
        text-align: center;
      }
      .hv {
        margin-bottom: 12px;
      }
      .rc {
        position: relative;
        left: auto !important;
        right: auto !important;
        bottom: auto !important;
        margin: -24px auto 0;
        width: 100%;
        max-width: 320px;
        box-sizing: border-box;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
      .wd > span, .hero-content p.lead, .cta, .fine, .rc {
        opacity: 1 !important;
        transform: none !important;
      }
      .rc .fill {
        transform: none !important;
      }
    }
  `]
})
export class HeroComponent implements OnInit {
  auth = inject(AuthService);

  headlineWords = 'Know exactly how ready you are for the role you want.'.split(' ');
  currentScore = signal(0);

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.currentScore.set(74);
      return;
    }

    setTimeout(() => {
      const startTime = performance.now();
      const duration = 1400;
      const target = 74;

      const step = (now: number) => {
        const p = Math.min(1, (now - startTime) / duration);
        const ease = 1 - Math.pow(1 - p, 3);
        this.currentScore.set(Math.round(target * ease));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 1000);
  }
}
