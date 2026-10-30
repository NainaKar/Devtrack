---
name: code-review
description: >-
  Use this skill to conduct thorough, structured, and constructive code reviews
  of pull requests, git diffs, components, or proposed changes. Covers architecture,
  correctness, security, performance, accessibility, and clean code hygiene.
---

# Code Review Skill

This skill guides rigorous, structured, and empathetic code reviews to maintain high engineering standards and prevent regressions.

## Review Mindset & Tone

- **Constructive & Specific**: Explain *why* a change is recommended, not just *what* to change.
- **Actionable**: Provide concrete replacement code snippets or diffs where appropriate.
- **Categorized Severity**: Prefix comments with clear tags so the author knows what is mandatory vs optional:
  - `[BLOCKER]`: Critical bug, security flaw, data corruption risk, or breaking architectural defect. Must be resolved before merge.
  - `[WARNING]`: Sub-optimal pattern, performance bottleneck, accessibility regression, or missing test case. Should be addressed.
  - `[NIT]`: Minor styling, naming tweak, or optional simplification. Author's discretion.
  - `[PRAISE]`: Commend clever solutions, clean abstractions, or well-documented logic.

---

## 5-Pillar Code Review Checklist

### 1. Correctness & Architecture
- Does the implementation satisfy all requirements without introducing regressions?
- Are edge cases handled (empty lists, null/undefined values, network timeouts, offline states)?
- Is state cleanly managed without redundant sources of truth or synchronization issues?
- Are responsibilities separated cleanly between presentation components, services, and domain logic?

### 2. Security & Data Protection
- **Input Sanitization**: Are user inputs validated and sanitized against XSS or injection vulnerabilities?
- **Auth & Authorization**: Are protected routes and sensitive API endpoints safeguarded by route guards and token interceptors?
- **Secrets & Credentials**: Are API keys, tokens, or private credentials kept out of source code and client bundles?
- **Data Exposure**: Does the client only receive fields it is authorized to display?

### 3. Performance & Resource Efficiency
- **Re-renders & Change Detection**: Are expensive computations memoized via `computed()` signals or pure pipes? Is `ChangeDetectionStrategy.OnPush` used?
- **Leaks**: Are all timers (`setInterval`), DOM listeners, and RxJS subscriptions properly cleaned up when components are destroyed (`takeUntilDestroyed()`)?
- **Bundle & Network**: Are routes lazy-loaded? Are assets optimized? Is payload size kept minimal?

### 4. Accessibility (a11y) & UX Integrity
- Are interactive elements accessible via keyboard (`Tab`, `Space`, `Enter`)?
- Are ARIA attributes and labels accurate and semantic?
- Does the UI handle error states, empty states, and loading states smoothly?
- Does layout maintain responsiveness across mobile, tablet, and desktop viewports without overflow?

### 5. Maintainability & Code Hygiene
- Are function, variable, and component names intuitive, self-describing, and consistent with the codebase?
- Are TypeScript types explicit and strict (avoiding unnecessary `any` or untyped casts)?
- Is dead or commented-out code removed?
- Are unit tests added or updated to cover modified logic?

---

## Output Format for Code Reviews

When delivering a review summary:
```markdown
### Summary
[Brief summary of the changes and overall quality verdict: Approved / Request Changes / Needs Discussion]

### Key Findings
- **[BLOCKER]** `filename:line` — [Issue description and concrete solution]
- **[WARNING]** `filename:line` — [Issue description and recommendation]
- **[NIT]** `filename:line` — [Minor improvement suggestion]
- **[PRAISE]** `filename:line` — [Well executed implementation detail]

### Suggested Code Changes
```typescript
// Replacement snippet
```
```
