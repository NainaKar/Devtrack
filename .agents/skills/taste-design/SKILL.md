---
name: taste-design
description: >-
  Use this skill when designing, building, or refining user interfaces to apply
  high-end UI/UX taste, typography, layout craftsmanship, micro-interactions,
  color harmony, and modern aesthetic standards, avoiding generic AI-generated looks.
---

# Design Taste & UI Craftsmanship Skill

This skill guides the design and visual refinement of frontend user interfaces to achieve professional, polished, high-taste digital products.

## Core Philosophy: Avoiding "AI Slop" & Generic Templates

Generic AI-generated interfaces often suffer from:
- Excessive, washed-out purple/indigo gradients.
- Identical pill-shaped badges, rounded-2xl cards with blurry excessive drop shadows (`box-shadow: 0 25px 50px ...`).
- Inconsistent spacing and visual hierarchy where everything competes for attention.
- Lack of tactile feedback and missing micro-states (hover, active, focus, disabled, empty, error, skeleton loading).

### Principles of High-Taste UI:
1. **Restraint Over Decoration**: Let content and typography lead. Use borders, shadows, and gradients subtly and with clear purpose.
2. **Cohesive Geometry**: Stick to consistent border radii across elements (e.g., if cards are `rounded-xl` (12px), buttons should be `rounded-lg` (8px) or `rounded-xl`, not mismatched).
3. **Intentional Depth**: Combine 1px hairline borders (`border: 1px solid var(--border)`) with subtle, tight shadows instead of loud blurry glows.
4. **Information Density**: Balance breathing room (whitespace) with density. Avoid sparse pages where users must scroll endlessly to see 3 cards.

---

## 1. Typography & Hierarchy

- **Font Hierarchy**:
  - Headings: Clean, confident, with tighter letter spacing (`letter-spacing: -0.02em` or `-0.03em` for large headings).
  - Body: Readable, comfortable line height (`1.5` to `1.6`), neutral color (e.g., `#0f172a` in light mode, `#e2e8f0` in dark mode).
  - Subtitles & Meta: Muted, clear secondary contrast (`#64748b` in light mode, `#94a3b8` in dark mode), never invisible or low-contrast.
  - Numbers & Metrics: Use `font-variant-numeric: tabular-nums` or monospace for metrics, scores, countdowns, and financial data to prevent layout jumps.
- **Scale**: Use a standard typographic scale (e.g., 12px, 14px, 16px, 18px, 24px, 30px, 36px, 48px).

---

## 2. Color System & Contrast

- **Color Roles**:
  - **Surface & Background**: Defined canvas levels (`bg-surface-0`, `bg-surface-1`, `bg-surface-2`) to build layering without relying solely on heavy shadows.
  - **Primary / Brand**: 1 primary accent used purposefully for key actions (e.g., submit, upgrade, primary CTA).
  - **Semantic Tints**: Danger/error (red/rose), warning (amber), success (emerald), info (sky/blue) — use desaturated backgrounds with crisp colored text and borders for badges.
- **Contrast**: Always maintain WCAG AA compliance (contrast ratio ≥ 4.5:1 for body text, 3:1 for large text).
- **Subtle Hairlines**: Use subtle borders (`rgba(0,0,0,0.06)` in light mode, `rgba(255,255,255,0.08)` in dark mode) to divide sections cleanly.

---

## 3. Spacing & Spatial Layout

- **Strict Spacing Scale**: Base layout on 4px/8px increments (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Grouping**: Elements that relate to each other must be closer together than elements that do not (Gestalt principle of proximity).
- **Edge Padding**: Container padding should adapt gracefully on mobile (`p-4`) vs desktop (`p-6` to `p-8`).

---

## 4. Tactile Interactions & Micro-Animations

- **Transitions**: Keep transitions swift (`150ms` to `200ms` with `cubic-bezier(0.4, 0, 0.2, 1)` or `ease-out`). Avoid long, sluggish animations (`> 400ms`).
- **Interactive Affordances**:
  - **Hover**: Subtle brightness change, slight border accentuation, or 1px translateY lift.
  - **Active / Press**: `transform: scale(0.98)` or slight inset to give a tactile click feel.
  - **Focus-Visible**: High-contrast outline or ring (`focus-visible:ring-2 focus-visible:ring-offset-2`) for accessibility.
- **Loading & Transitions**: Skeleton screens with matching dimensions rather than jarring spinners where possible.

---

## 5. Review Checklist for Any UI Screen

When reviewing or crafting a component or screen, verify:
- [ ] Is there an obvious primary action?
- [ ] Is the visual weight hierarchy clear at a glance?
- [ ] Are hover, active, focus, disabled, loading, and empty states designed and styled?
- [ ] Does it look balanced and readable in both mobile and desktop viewports?
- [ ] Are typography and spacing consistent with the design tokens?
- [ ] Does the UI feel refined, crisp, and intentional?
