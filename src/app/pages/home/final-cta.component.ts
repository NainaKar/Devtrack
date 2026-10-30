import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="sec" id="start" style="padding-bottom:0">
      <div class="w">
        <div class="fin" appReveal revealDelay="0.1s">
          <div class="fin-text">
            <h2>Small steps, big progress.</h2>
            <p>Set your target role and see your readiness score in about five minutes.</p>
            <div class="cta">
              @if (auth.isLoggedIn()) {
                <a class="btn" routerLink="/app/dashboard">Open Workspace →</a>
              } @else {
                <a class="btn" routerLink="/register">Create free account</a>
                <a class="btn o" routerLink="/login">Sign in</a>
              }
            </div>
          </div>
          <img src="images/hero-welcome.jpg" alt="DevTrack: Track. Build. Grow.">
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
    .fin {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 48px;
      align-items: center;
      background: var(--ac2, #ecd3b8);
      border-radius: calc(var(--r, 20px) * 1.4);
      padding: 48px;
      margin-bottom: 84px;
    }
    .fin img {
      width: 100%;
      border-radius: var(--r, 20px);
      aspect-ratio: 4/3;
      object-fit: cover;
    }
    .fin h2 {
      font-family: var(--fd, 'Fraunces', Georgia, serif);
      font-size: clamp(30px, 3.6vw, 46px);
      line-height: 1.08;
      letter-spacing: -0.01em;
      color: var(--ink, #2e1a10);
      margin: 0;
    }
    .fin p {
      margin: 16px 0 26px;
      color: var(--mu, #7a5a47);
      font-size: 17px;
      line-height: 1.6;
    }
    .cta {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-block;
      padding: 13px 24px;
      border-radius: calc(var(--r, 20px) * .6);
      background: var(--ac, #b4561f);
      color: var(--on, #f6eddc);
      font-weight: 600;
      font-size: 16px;
      border: 0;
      cursor: pointer;
      text-decoration: none;
      transition: transform .15s;
      position: relative;
      overflow: hidden;
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
      background: transparent;
      color: var(--ink, #2e1a10);
      border: 1.5px solid var(--ink, #2e1a10);
    }
    @media (max-width: 900px) {
      .fin {
        grid-template-columns: 1fr;
        padding: 28px;
      }
    }
  `]
})
export class FinalCtaComponent {
  auth = inject(AuthService);
}
