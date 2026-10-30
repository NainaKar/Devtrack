# DevTrack Development & Design Guidelines

This workspace follows modern frontend engineering standards, high-taste visual design principles, and strict code review practices.

## General Principles
- **Design Taste**: Prioritize clean typography, coherent color tokens, restrained shadows, smooth micro-interactions, and responsive layouts across all device sizes.
- **Frontend Standards (Angular 19)**:
  - Standalone components with `ChangeDetectionStrategy.OnPush`.
  - Reactivity powered by Angular Signals (`signal`, `computed`).
  - Native control flow (`@if`, `@for (item of items; track item.id)`, `@switch`).
  - Strict semantic HTML and WCAG AA accessibility compliance.
- **Code Review**: Every proposed change must be evaluated for correctness, security, performance, accessibility, and architectural clean code standards.

For detailed procedures, refer to:
- **Design & Taste Skill**: `.agents/skills/taste-design/SKILL.md`
- **Frontend Engineering Skill**: `.agents/skills/frontend-engineering/SKILL.md`
- **Code Review Skill**: `.agents/skills/code-review/SKILL.md`
- **Frontend Standards Rule**: `.agents/rules/frontend-standards.md`
