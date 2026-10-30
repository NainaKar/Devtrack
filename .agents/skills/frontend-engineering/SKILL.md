---
name: frontend-engineering
description: >-
  Use this skill when developing frontend web features, architecting UI components,
  implementing state management (Angular signals, RxJS), writing modern responsive CSS,
  optimizing web performance, and ensuring WCAG accessibility.
---

# Frontend Engineering & Modern Web Standards Skill

This skill provides patterns, architecture guidelines, and engineering best practices for building robust, scalable frontend web applications (specifically Angular 19+ and modern TypeScript/CSS).

## 1. Angular Modern Architecture (v18+)

- **Standalone Components**: Always prefer standalone components, directives, and pipes (`standalone: true` or default in v19).
- **Angular Signals Reactivity**:
  - State: Use `signal(initialValue)` for mutable component state.
  - Derived Values: Use `computed(() => ...)` for derived calculations. Avoid recalculating derived values inside template interpolation functions.
  - Effects: Keep `effect()` limited to external side-effects (e.g., logging, manual DOM interop, analytics), never for syncing state back into another signal.
  - Component Inputs/Outputs: Prefer signal inputs (`input()`, `input.required()`) and outputs (`output()`) over legacy decorators (`@Input`, `@Output`).
  - Model Signals: Use `model()` for two-way binding with child components.
- **Change Detection**:
  - Always declare `changeDetection: ChangeDetectionStrategy.OnPush` on components to optimize performance and take advantage of signal-level fine-grained updates.
- **Control Flow**:
  - Use Angular modern control flow syntax (`@if`, `@for (item of items; track item.id)`, `@switch`, `@defer`) rather than legacy structural directives (`*ngIf`, `*ngFor`).
  - Always provide a unique tracking key in `@for` (`track item.id` or `track $index`).
- **Deferred Loading (`@defer`)**:
  - Use `@defer (on viewport)` or `@defer (on idle)` for below-the-fold or heavy components (charts, rich editors, code viewers) to speed up initial page load.

---

## 2. CSS & Responsive Design Standards

- **CSS Tokens & Design System**:
  - Define colors, spacing, typography, and shadows as CSS custom properties (`--color-primary`, `--space-4`, etc.) in the root stylesheet.
  - Use semantic class names or utility classes with consistent spacing.
- **Fluid & Responsive Layouts**:
  - Use CSS Grid and Flexbox for structural layouts.
  - Use responsive breakpoints cleanly:
    - Mobile: `< 640px`
    - Tablet: `640px - 1024px`
    - Desktop: `> 1024px`
  - Avoid fixed pixel widths (`width: 500px`) that cause horizontal overflow on mobile screens; prefer `max-width` with percentage widths (`max-width: 32rem; width: 100%`).
- **Touch & Mobile Targets**:
  - All interactive tap targets (buttons, links, inputs) must measure at least `44px x 44px` on touch devices.

---

## 3. Accessibility (a11y) & Semantic HTML

- **Semantic HTML**: Use `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`, `<button>`, and `<a>` appropriately. Never use a `<div (click)="...">` when a `<button>` is intended.
- **Form Controls & Labels**:
  - Every form input must have an associated `<label for="...">` or `aria-label`.
  - Provide inline validation messages with `aria-describedby` and `aria-invalid="true"` when in an error state.
- **Keyboard Navigation**:
  - Ensure all interactive elements can be reached via `Tab` and triggered via `Enter`/`Space`.
  - Provide visible focus indicators: never remove `outline: none` without supplying an explicit `focus-visible` replacement.
- **Color & Text**:
  - Never convey status purely through color; accompany badges and alerts with descriptive icons and text (e.g., "Error: ...", "Success: ...").

---

## 4. Performance & Resource Hygiene

- **Bundle Size**:
  - Lazy load routes using `loadComponent: () => import('./...')`.
  - Avoid importing entire monolithic libraries when only a single helper is needed.
- **Memory & Subscriptions**:
  - When using RxJS Observables, use `takeUntilDestroyed()`, the `async` pipe, or `toSignal()` to prevent memory leaks from unclosed subscriptions.
- **Image & Media Optimization**:
  - Use modern formats (`.webp`, `.avif`, `.svg`).
  - Specify `width` and `height` attributes or aspect ratios to eliminate layout shifts (CLS).
