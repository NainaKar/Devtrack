import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { ROLES } from '../../data/roles.data';

@Component({
  selector: 'app-roles-band',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="sec band" id="roles">
      <div class="w">
        <h2 appReveal revealDelay="0s">Built for in-demand engineering roles</h2>
        <p class="sub" appReveal revealDelay="0.1s">
          Each role has weighted skill requirements, so your score reflects what hiring teams look for.
        </p>
        <div class="chips">
          @for (role of roles; track role; let idx = $index) {
            <span appReveal [revealDelay]="((idx % 6) * 0.06) + 's'">{{ role }}</span>
          }
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
    .band {
      background: var(--band-bg, #264a3a);
      color: var(--on, #f6eddc);
    }
    .band h2 {
      font-family: var(--fd, 'Fraunces', Georgia, serif);
      font-size: clamp(32px, 4vw, 52px);
      line-height: 1.08;
      letter-spacing: -0.01em;
      max-width: 15em;
      margin: 0;
      color: var(--on, #f6eddc);
    }
    .band .sub {
      color: color-mix(in srgb, var(--on, #f6eddc) 70%, transparent);
      margin-top: 14px;
      max-width: 34em;
      font-size: 17px;
      line-height: 1.6;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 36px;
    }
    .chips span {
      padding: 9px 18px;
      border-radius: 99px;
      border: 1px solid rgba(246, 237, 220, 0.35);
      font-size: 14px;
      cursor: pointer;
      transition: background .25s, color .25s, border-color .25s;
      user-select: none;
    }
    .chips span:hover {
      background: var(--on, #f6eddc);
      color: var(--dk, #3f1f12);
      border-color: var(--on, #f6eddc);
    }
    @media (max-width: 768px) {
      .sec {
        padding: 56px 0;
      }
      .w {
        padding: 0 24px;
      }
      .chips {
        gap: 8px;
        margin-top: 24px;
      }
      .chips span {
        padding: 8px 14px;
        font-size: 13px;
      }
    }
  `]
})
export class RolesBandComponent {
  roles = ROLES.map(r => r.name);
}
