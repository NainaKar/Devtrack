import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tech-marquee',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mq" aria-hidden="true">
      <div class="mq-track">
        <!-- Render duplicated list for seamless looping -->
        @for (item of skills; track $index) {
          <span>{{ item }}</span>
        }
        @for (item of skills; track ('dup-' + $index)) {
          <span>{{ item }}</span>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .mq {
      border-block: 1px solid var(--ln, #e0d1b8);
      background: var(--sf, #fbf6ea);
      overflow: hidden;
      padding: 20px 0;
      user-select: none;
    }
    .mq-track {
      display: flex;
      width: max-content;
      animation: mq 110s linear infinite;
    }
    .mq:hover .mq-track {
      animation-play-state: paused;
    }
    .mq span {
      display: flex;
      align-items: center;
      gap: 44px;
      margin-right: 44px;
      white-space: nowrap;
      font-family: var(--fh, 'Ghilbe', 'Gloock', Georgia, serif);
      font-weight: 400;
      font-size: 26px;
      color: var(--ink, #2e1a10);
    }
    .mq span::after {
      content: "";
      width: 9px;
      height: 9px;
      background: var(--ac, #b4561f);
      transform: rotate(45deg);
      flex-shrink: 0;
    }
    @keyframes mq {
      to {
        transform: translateX(-50%);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .mq-track {
        animation: none !important;
      }
    }
  `]
})
export class TechMarqueeComponent {
  skills = [
    'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue', 'HTML and CSS',
    'Node.js', 'Python', 'Java', 'C++', 'C#', 'Go', 'SQL', 'PostgreSQL',
    'MongoDB', 'Redis', 'REST APIs', 'GraphQL', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'Git', 'CI/CD', 'Linux', 'Networking', 'Data structures',
    'Algorithms', 'System design', 'Microservices', 'Testing', 'DevOps',
    'Machine learning', 'Data science', 'Cybersecurity', 'Agile'
  ];
}

