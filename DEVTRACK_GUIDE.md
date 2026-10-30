# DevTrack – Project Guide & Interview Prep

> Read this before any interview. It explains WHAT was built, WHY, HOW it works and the questions you will be asked.

## 1. One-line pitch
DevTrack is an Angular web app where students pick a target role / company / timeline, track skill completion as percentages, and get a calculated roadmap, readiness score and an AI mentor.

## 2. Run it
```bash
npm install
npm start          # API on :3000 + Angular dev server on http://localhost:4200 (proxy forwards /api)
npm run serve:prod # build Angular, then ONE server (http://localhost:3000) serves API + site
```
Optional env vars: `PORT`, `JWT_SECRET`, `DB_FILE`. User data is stored in `server/data/db.json` (git-ignored).
Requires Node 18.19+ (Node 20/22 recommended).

## 3. Tech stack & why
| Choice | Why |
|---|---|
| Angular 19 (standalone components) | No NgModules → less boilerplate, lazy loading per route |
| Signals (`signal`, `computed`, `input`) | Fine-grained reactivity; derived data (readiness, roadmap) recalculates automatically |
| Angular Router + guards | Separates public site from logged-in app; `authGuard` / `guestGuard` |
| Template-driven forms (`ngModel`) | Simple forms; reactive forms would be the next step |
| Node + Express API (`server/index.js`) | Real accounts: bcrypt password hashes, JWT auth, login rate limiting, per-user data. JSON-file storage (swap for PostgreSQL/MongoDB) |
| HttpClient + interceptor | `token.interceptor.ts` adds the JWT to every `/api` call |
| Plain CSS design tokens | One `styles.css`, CSS variables for palette; no UI library dependency |

## 4. Folder map
```
server/index.js             Express API: /api/auth/register, /api/auth/login, /api/me, /api/data, DELETE /api/me
src/app/
  models.ts                 TypeScript interfaces (Topic, Category, Role, Goals, UserData…)
  engine.ts                 PURE logic: weightsFor(), analyze(), buildRoadmap()  ← core algorithm
  data/skills.data.ts       11 skill areas, 76 topics (summary + key points), resources, 33 project ideas
  data/roles.data.ts        9 roles with per-skill requirement weights, timelines, companies
  services/auth.service.ts  register/login/logout, per-user data, single update() write path + activity log
  services/tracker.service.ts  signals: analysis, roadmap, completeness; actions: toggleTopic, projects
  services/chat.service.ts  AI mentor (local rules now; LLM endpoint hook ready)
  guards/auth.guard.ts      authGuard, guestGuard
  layouts/public-layout.ts  navbar+footer (before login)
  layouts/app-layout.ts     sidebar+topbar (after login)
  pages/…                   home, about, login, register, dashboard, skills, skill-detail,
                            roadmap, calculator, projects, chat, activity, profile
```

## 5. Before vs after login
- **Before:** `/` Home, `/about`, `/login`, `/register` inside `PublicLayout`. Navbar shows "Log in / Get started"; if already logged in it shows "Open my tracker".
- **After:** `/app/**` inside `AppLayout` (sidebar tracker). `authGuard` redirects anonymous users to `/login`. `guestGuard` redirects logged-in users away from login/register.
- Session = JWT in localStorage; on refresh `AuthService.ready` calls `/api/me`, and the guards `await` it so a reload never kicks you to login by mistake.

## 6. Core algorithm (know this by heart)
**Role requirements** – each role has a weight 0–1 per skill area (share of that area's topics needed). Example: Frontend Dev needs Frontend = 1.0, Databases = 0.2.

**Company adjustment** (`weightsFor`) – target company → tier:
- Product / Big Tech (Google, Amazon…): DSA ≥ 0.9, Interview ≥ 0.9, CS ≥ 0.7, +1 project
- IT Services (TCS, Infosys…): Communication ≥ 0.7, Interview ≥ 0.7
- Startup: Cloud ≥ 0.4, +1 project

**Per-skill percentage** = completed topics ÷ total topics (shown on the skill card).

**Requirement coverage** = min(1, completed ÷ ceil(weight × total)).

**Readiness** = 85% × weighted average coverage (weighted by the role weights) + 15% × (completed projects ÷ projects needed).

**Hours left** = Σ hours of the *next required unfinished topics* × pace factor (Beginner 1.25, Intermediate 1.0, Advanced 0.8) + remaining projects × 15h × pace.

**Weeks to goal** = hours left ÷ weekly hours. On track if weeks ÷ 4.345 ≤ timeline months. Required weekly hours = hours ÷ (months × 4.345).

**Roadmap** (`buildRoadmap`) – skills sorted by stage (1 foundations → 2 core → 3 career) then by weight; each gets a "learn" step listing the exact next topics; project steps are interleaved (one idea per core skill, then second ideas); then profile polish (only for missing GitHub/LinkedIn/resume) and an "apply" step. Week ranges come from a running hour cursor ÷ weekly hours.

## 7. Data flow (what happens when a student ticks a topic)
1. `skill-detail` button → `TrackerService.toggleTopic(id)`
2. → `AuthService.update(fn, 'topic-done', text)`: clones data, applies fn, prepends an activity entry, sets the `data` signal (UI updates instantly), then saves to the server with a 400 ms debounce (`PUT /api/data`)
3. `TrackerService.analysis` (computed) recomputes → `roadmap` (computed) recomputes
4. Dashboard, skill %, sidebar readiness, calculator and chat answers all update with no manual refresh.

## 8. "What happened in the website" log
- In-app: **Activity Log** page (register, login, topic done/undone, projects, goal changes, chat, resume).
- In code: all writes go through `AuthService.update()` – the single place to add auditing.
- This file documents the design decisions.

## 9. AI mentor
`chat.service.ts`. Demo = rule-based mentor using the student's real data (progress, roadmap, ETA, topic explanations via keyword scoring over 76 topics). To chat about *anything*: build a backend route (Node/Express) that calls an LLM API and set `AI_ENDPOINT`. **Never put an API key in Angular** – the browser exposes it.

## 10. Honest limitations (say these in interviews – it shows maturity)
- Storage is a single JSON file – fine for a project/demo, not for many concurrent users (move to PostgreSQL/MongoDB). JWT sits in localStorage (production-grade apps often prefer httpOnly cookies). Needs HTTPS when deployed. Whole user data is saved as one document (simple, last-write-wins).
- Topic content is hand-written, not user-generated; role weights are reasonable estimates, not labour-market data.
- AI is rule-based until an LLM endpoint is connected.
- Resume files >1 MB are not stored (only the name).

## 11. Future improvements
PostgreSQL/MongoDB instead of the JSON file, refresh tokens / httpOnly cookies, email verification & password reset, real LLM mentor with streaming, GitHub API to auto-detect repos/languages, quiz per topic to verify completion, streaks & reminders, unit tests for `engine.ts`, admin panel for content, deploy on Vercel/Netlify + Render.

## 12. Likely interview questions
1. **Why Angular and standalone components?** No NgModule boilerplate, route-level lazy loading, better tree-shaking.
2. **What are signals vs RxJS?** Signals = synchronous reactive values for UI state; RxJS = async streams (HTTP, events). I used signals for state and would use RxJS for HTTP/websocket.
3. **How does `computed` help?** Derived state (readiness, roadmap) is memoized and recalculated only when inputs change.
4. **How do guards work?** `CanActivateFn` returns true or a `UrlTree` redirect; applied on the `/app` route so all children are protected.
5. **How did you separate pre- and post-login UI?** Two layout components used as parent routes.
6. **How is the readiness score computed?** Section 6.
7. **How does login work end to end?** Register/login → server hashes/verifies with bcrypt → returns a signed JWT (7 days) → stored client-side → interceptor sends `Authorization: Bearer` → `auth` middleware verifies it and loads the user.
8. **How do you keep passwords safe?** bcrypt (salted, slow) on the server, never stored or logged in plain text, login rate limiting (10 failures / 15 min / IP), generic error message so emails can't be enumerated by login, HTTPS in production.
9b. **Why did the guard fail once with NG0203?** `inject()` must run synchronously; after an `await` there is no injection context, so services are injected before awaiting.
9. **Why keep `engine.ts` pure?** No Angular dependency → trivially unit-testable and reusable (the calculator page reuses `analyze()` with what-if inputs).
10. **How is lazy loading done?** `loadComponent: () => import(...)` per route; the build output splits one chunk per page.
11. **How would you scale / test?** Jasmine/Jest for engine and services, Playwright E2E for flows, CI with GitHub Actions.
12. **Accessibility?** Semantic HTML, labels on inputs, `aria-pressed` on checkboxes, focus rings, `aria-live` on chat, responsive layout.
