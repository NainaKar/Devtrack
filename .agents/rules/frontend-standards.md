# Frontend Design, Taste, and Code Standards

These rules apply whenever developing, refactoring, or reviewing frontend code in this project.

## 1. UI Taste & Visual Design Standards
- **Design Tokens**: Always use CSS variables (`var(--...)`) for colors, radii, spacing, and typography. Never hardcode random hex colors or arbitrary pixel values in component stylesheets.
- **Visual Polish**:
  - Maintain a clean, intentional hierarchy (primary heading, secondary labels, metadata).
  - Use subtle 1px hairline borders (`border: 1px solid var(--border)`) and tight, restrained shadows rather than oversized diffuse dropshadows.
  - Provide complete interaction states for all interactive elements: hover, active (press feedback), focus-visible, and disabled.
  - Ensure tabular numbers (`font-variant-numeric: tabular-nums`) on any counter, percentage, or currency metric to avoid layout jank.
- **Mobile First & Responsive**: Every view must adapt cleanly across viewports (`360px`, `768px`, `1024px`, `1440px`). Prevent horizontal scrollbars (`overflow-x: hidden` / robust flex/grid wrapping).

## 2. Angular Architecture & Reactivity
- **Component Model**:
  - Use standalone components (`standalone: true`).
  - Set `changeDetection: ChangeDetectionStrategy.OnPush` on all components.
  - Use modern Angular control flow syntax (`@if`, `@for`, `@switch`). Always specify track keys in `@for (item of items; track item.id)`.
- **State Management**:
  - Prefer Angular Signals (`signal()`, `computed()`) for component and service state.
  - Avoid triggering side effects inside `computed()`; use computed solely for pure derived calculations.
  - Clean up any RxJS observables using `takeUntilDestroyed()` or the `toSignal()` bridge.
- **Accessibility**:
  - Every button, input, and link must have clear accessible labels (`aria-label`, visible text, or associated `<label>`).
  - Maintain visible keyboard focus indicators (`:focus-visible`).

## 3. Code Review & Quality Gates
- **Type Safety**: Strictly type all variables, function arguments, and return types. Avoid `any`.
- **Clean Architecture**: Keep UI presentation components dumb/lightweight; encapsulate API calls and business calculation logic in dedicated services.
- **Review Severity**:
  - Any architectural issue, data loss risk, or security gap is marked as `[BLOCKER]`.
  - Performance bottlenecks, unhandled async errors, or accessibility issues are marked as `[WARNING]`.
  - Stylistic refinements are marked as `[NIT]`.
