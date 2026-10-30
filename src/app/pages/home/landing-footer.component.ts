import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer>
      <div class="w">
        <span>© {{ currentYear }} DevTrack</span>
        <span class="footer-links">
          <a routerLink="/about">About & Methodology</a> · 
          <a routerLink="/login">Log in</a>
        </span>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
    footer {
      border-top: 1px solid var(--ln, #e0d1b8);
      padding: 28px 0;
      font-size: 14px;
      color: var(--mu, #7a5a47);
    }
    .w {
      max-width: 1180px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .footer-links a {
      color: inherit;
      text-decoration: none;
      transition: color .2s;
    }
    .footer-links a:hover {
      color: var(--ink, #2e1a10);
      text-decoration: underline;
    }
  `]
})
export class LandingFooterComponent {
  currentYear = new Date().getFullYear();
}

