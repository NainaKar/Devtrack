# DevTrack — Developer Career Intelligence & Skills Platform

<p align="center">
  <img src="public/images/hero-welcome.jpg" alt="DevTrack Preview" width="750" style="border-radius: 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.12);" />
</p>

<p align="center">
  <b>Measure developer competencies, calculate realistic job readiness, and follow an adaptive, milestone-driven career roadmap.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-19.0-DD0031?style=flat-square&logo=angular&logoColor=white" alt="Angular 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js Express" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
</p>

---

## 📖 Overview

**DevTrack** is a modern career readiness and skill acceleration platform built for engineering students, self-taught developers, and transitioning professionals. Rather than viewing career preparation as an ambiguous checklist, DevTrack provides an intelligent, mathematical framework:

1. **Target Calibration**: Choose your desired role (e.g., Full-Stack, Frontend, DevOps, ML/AI), target company tier (Big Tech, IT Services, or Startups), and timeline.
2. **Diagnostic Assessment**: Track topics completed across 11 key software engineering categories and 76 core competencies.
3. **Readiness Calculation**: A deterministic engine computes an exact job readiness score, remaining study hours adjusted for your pace, and projected completion date.
4. **Phased Roadmap**: Automatically generates a structured, week-by-week learning plan with interleaved portfolio projects and interview prep.
5. **AI Career Mentor**: An in-platform mentor offering context-aware recommendations, roadmap next-steps, and technical explanations.

---

## ✨ Core Features

### 🎯 1. Target Role & Company Calibration
- **9 Engineering Roles**: Full-Stack, Frontend, Backend, DevOps & Cloud, Mobile (iOS/Android), Data Engineering, AI/Machine Learning, QA Automation, and Cybersecurity.
- **Company Tier Adjustment**: Adapts skill weightings and interview expectations for:
  - *Product / Big Tech* (e.g., Google, Amazon, Stripe) – high DSA, system design, and project bar.
  - *IT Services* (e.g., Infosys, TCS, Cognizant) – communication, enterprise frameworks, core CS.
  - *High-Growth Startups* – velocity, full-stack capability, cloud deployment.

### 📊 2. Dynamic Career Readiness Engine (`engine.ts`)
- **Formula-Driven Scoring**: Computes readiness as:
  $$\text{Readiness} = 85\% \times \text{Weighted Skill Coverage} + 15\% \times \left(\frac{\text{Completed Projects}}{\text{Target Projects}}\right)$$
- **Pace-Adjusted Forecast**: Calculates remaining study hours with multipliers based on student baseline (Beginner: 1.25x, Intermediate: 1.0x, Advanced: 0.8x).
- **ETA Calculator**: Forecasts the exact week of readiness against your personal study schedule (hrs/week).

### 🗺️ 3. Phased Milestone Roadmap
- **Stage 1: Foundations**: Core language fundamentals, version control, and data structures.
- **Stage 2: Core Specialization**: Frameworks, backend architecture, databases, APIs, and cloud infrastructure.
- **Stage 3: Career & Interview Prep**: System design, behavioral STAR stories, live mock practice, and portfolio polish.
- Automatically schedules portfolio project milestones between topic phases to ensure practical building.

### 📚 4. 76-Competency Skill Taxonomy
- Interactive tracker spanning:
  - Frontend Development (HTML/CSS, modern JavaScript, Angular/React, state management)
  - Backend Architecture (Node.js, REST/GraphQL, concurrency, microservices)
  - Databases (PostgreSQL, MongoDB, indexing, query optimization, caching)
  - Data Structures & Algorithms (Big-O, trees, graphs, dynamic programming)
  - Cloud & DevOps (Docker, CI/CD, Kubernetes, AWS/GCP basics)
  - Testing, Security, System Design, Computer Science Fundamentals, Soft Skills, and Interview Prep.
- Each topic features high-yield summaries, core principles, study checklists, and verified external learning resources.

### 💼 5. Job Application Pipeline Tracker
- Track applications across your target companies.
- Status stages: *Wishlist*, *Preparing*, *Applied*, *Interviewing*, *Offered*, and *Archived*.
- Note-taking per company with required competencies checklist.

### 🤖 6. AI Career Mentor
- Interactive career assistant that reads live progress data and answers questions like:
  - *"What should I learn next?"*
  - *"How ready am I for Google?"*
  - *"Explain closures and prototypes with examples"*
  - *"Review my interview preparation schedule"*

### 🎨 7. Craftsmanship & Visual Design
- **Editorial Typography**: Pairing Google Font `Fraunces` (high-contrast display serif) with `Instrument Sans` and `Caveat` handwritten accents.
- **Modern Color System**: Forest green canvas (`#264a3a`), warm cream surfaces (`#f8f1e7`), terracotta actions (`#b4561f`), and peach highlights (`#f0c9ad`).
- **Floating Glass Pill Navigation**: Floating curved sidebar with interactive inverted-radius active tabs, responsive collapse states, and mobile overlay drawer.
- **Responsive Layout**: Seamlessly adapted for 1920×1080 desktops, laptops (1366×768), tablets, and mobile (390px iPhone).

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | **Angular 19** | Standalone Components, `ChangeDetectionStrategy.OnPush` |
| **Reactivity** | **Angular Signals** | `signal()`, `computed()`, fine-grained reactive state without boilerplate |
| **Control Flow** | **Native Angular Syntax** | `@if`, `@for (...; track ...)`, `@switch` |
| **Routing & Protection** | **Angular Router** | Route-level lazy loading (`loadComponent`), functional `CanActivateFn` guards (`authGuard`, `guestGuard`) |
| **Styling** | **Vanilla Modern CSS** | CSS Custom Properties, flexbox/grid, backdrop-filter glassmorphism, responsive container rules |
| **Database & Auth** | **Supabase (PostgreSQL)** | Supabase Auth with client anon key, Row Level Security (RLS) policies for user data isolation |
| **Alternative Backend** | **Node.js + Express** | Optional local API with bcrypt password hashing, JWT bearer tokens, atomic JSON storage |

---

## 📁 Repository Structure

```text
devtrack/
├── public/                       # Static public assets & vector graphics
│   ├── images/                   # Screenshots, illustrations & brand assets
│   │   ├── devtrack-login-illustration.svg
│   │   ├── hero-welcome.jpg
│   │   └── features-dashboard.jpg
│   └── _redirects                # SPA redirect configuration for deployment
├── server/                       # Node.js + Express backend service
│   ├── index.js                  # Express API routes (Auth, User Data, Health)
│   └── data/                     # Local JSON storage fallback (git-ignored)
├── src/
│   ├── app/
│   │   ├── data/                 # Canonical taxonomy data (roles, skills, topics)
│   │   │   ├── roles.data.ts     # 9 engineering roles & company weight profiles
│   │   │   └── skills.data.ts    # 11 categories, 76 competencies, project ideas
│   │   ├── guards/               # Route security guards (auth.guard.ts)
│   │   ├── layouts/              # Multi-layout routing architecture
│   │   │   ├── app-layout.ts     # Floating glass pill authenticated sidebar
│   │   │   └── public-layout.ts  # Landing page navbar & footer
│   │   ├── pages/                # Route components (lazy-loaded)
│   │   │   ├── home.ts           # Product landing experience & interactive tour
│   │   │   ├── login.ts          # Authenticated login with organic wave shell
│   │   │   ├── register.ts       # 2-step registration & career goal setup
│   │   │   ├── dashboard.ts      # Core progress hub, gauge & quick actions
│   │   │   ├── skills.ts         # 11 category cards & competency breakdown
│   │   │   ├── skill-detail.ts   # Topic deep-dive, summaries & toggle checks
│   │   │   ├── roadmap.ts        # Chronological multi-stage milestone plan
│   │   │   ├── calculator.ts     # What-if readiness simulation calculator
│   │   │   ├── jobs.ts           # Kanban application pipeline tracker
│   │   │   ├── projects.ts       # Portfolio project builder & milestone tracker
│   │   │   ├── chat.ts           # AI career mentor conversation interface
│   │   │   ├── activity.ts       # Audit log of career preparation milestones
│   │   │   └── profile.ts        # Account management & career goal tuning
│   │   ├── services/             # Reactive signal services
│   │   │   ├── auth.service.ts   # Supabase authentication & user profile sync
│   │   │   ├── tracker.service.ts# Computed readiness metrics & topic signals
│   │   │   └── chat.service.ts   # AI mentor intelligence engine
│   │   ├── engine.ts             # Pure mathematical analysis algorithm
│   │   └── models.ts             # Shared TypeScript domain interfaces
│   ├── environments/             # Environment configuration (Supabase URL/Key)
│   ├── index.html                # HTML5 root with Fraunces & Instrument Sans
│   ├── main.ts                   # Angular application bootstrap
│   └── styles.css                # Global design system tokens & utility classes
├── supabase/
│   └── schema.sql                # PostgreSQL DDL schema & Row-Level Security rules
├── angular.json                  # Angular CLI configuration
├── package.json                  # Project dependencies & scripts
└── tsconfig.json                 # TypeScript compiler options
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.19.0 or higher (v20+ recommended)
- **npm**: v9+ (bundled with Node)

### 1. Clone & Install
```bash
git clone https://github.com/NainaKar/Devtrack.git
cd Devtrack
npm install
```

### 2. Configure Environment (Optional Supabase Backend)
DevTrack is pre-configured to connect to Supabase. If configuring your own Supabase instance:
1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL script located in `supabase/schema.sql` in the Supabase SQL Editor.
3. Update `src/environments/environment.ts` with your project URL and public anon key:
```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'sb_publishable_your_anon_key',
};
```

### 3. Run the Development Server
```bash
# Starts both the Express backend on port 3000 and the Angular dev server on port 4200:
npm start
```
Open **[http://localhost:4200](http://localhost:4200)** in your browser.

### 4. Build for Production
```bash
# Compiles the optimized Angular application:
npm run build

# Runs production build on a unified server (port 3000):
npm run serve:prod
```

---

## 📐 The Readiness Algorithm in Detail

The core calculation in `src/app/engine.ts` is purely functional and free of framework dependencies, making it directly testable:

1. **Category Weighting**: Each role defines a baseline completion ratio per skill category:
   $$\text{Coverage}_c = \min\left(1.0, \frac{\text{Completed Topics}_c}{\lceil \text{Weight}_{r,c} \times \text{Total Topics}_c \rceil}\right)$$
2. **Company Tier Modifiers**:
   - Big Tech targets increase required DSA and Interview weights to $\ge 0.9$ and add $+1$ required portfolio project.
   - Startups increase Cloud & DevOps requirements and emphasize full-stack delivery.
3. **Pace Factor**:
   $$\text{Adjusted Hours} = \sum (\text{Unfinished Required Topic Hours}) \times \text{Pace Factor} + (\text{Projects Left} \times 15\text{h} \times \text{Pace Factor})$$
4. **Timeline Feasibility**:
   $$\text{Estimated Weeks} = \frac{\text{Adjusted Hours}}{\text{Weekly Hours}}$$
   A user is flagged as "On Track" when $\frac{\text{Estimated Weeks}}{4.345} \le \text{Target Timeline in Months}$.

---

## 📄 License & Credits

- **Author**: Naina Kar
- **Project**: DevTrack Student Platform
- **License**: MIT License – open for educational and personal career advancement use.
