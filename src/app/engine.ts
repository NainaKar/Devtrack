/**
 * DevTrack engine – pure functions (no Angular). Easy to explain in interviews and to unit-test.
 *  1. weightsFor()   : role requirements, adjusted by target-company tier
 *  2. analyze()      : per-skill %, gaps, readiness, hours/topics/projects left
 *  3. buildRoadmap() : ordered, week-by-week steps toward the goal
 */
import { CATEGORIES } from './data/skills.data';
import { ROLES } from './data/roles.data';
import { Category, Goals, Level, ProjectIdea, Role, Topic, UserData } from './models';

export type Tier = 'Product / Big Tech' | 'IT Services' | 'Startup' | 'General';

const PRODUCT = [
  // Global product & big tech
  'google', 'microsoft', 'amazon', 'meta', 'facebook', 'apple', 'netflix', 'adobe',
  'uber', 'atlassian', 'stripe', 'nvidia', 'salesforce', 'oracle', 'sap', 'intel',
  'qualcomm', 'walmart', 'goldman', 'jpmorgan', 'jp morgan',
  // Indian product unicorns & high-growth tech
  'zoho', 'freshworks', 'razorpay', 'flipkart', 'swiggy', 'zomato', 'phonepe',
  'paytm', 'cred', 'meesho', 'groww', 'postman', 'browserstack'
];

const SERVICES = [
  'tcs', 'infosys', 'wipro', 'accenture', 'cognizant', 'capgemini',
  'hcl', 'hcltech', 'tech mahindra', 'deloitte', 'ltimindtree', 'lti mindtree'
];

export function companyTier(company: string, customTier?: Tier | string): Tier {
  if (customTier && (customTier === 'Product / Big Tech' || customTier === 'IT Services' || customTier === 'Startup' || customTier === 'General')) {
    return customTier;
  }
  const c = (company || '').toLowerCase().trim();
  if (!c) return 'General';
  if (PRODUCT.some(p => c.includes(p))) return 'Product / Big Tech';
  if (SERVICES.some(p => c.includes(p))) return 'IT Services';
  if (c.includes('startup')) return 'Startup';
  return 'General';
}

export const PACE: Record<Level, number> = { Beginner: 1.25, Intermediate: 1, Advanced: 0.8 };

export function weightsFor(role: Role, company: string, customTier?: Tier | string): { w: Record<string, number>; projects: number; tier: Tier } {
  const tier = companyTier(company, customTier);
  const w: Record<string, number> = {};
  for (const c of CATEGORIES) w[c.id] = role.weights[c.id] ?? 0;
  const raise = (id: string, v: number) => { if ((w[id] ?? 0) > 0 || id === 'dsa' || id === 'interview') w[id] = Math.max(w[id] ?? 0, v); };
  let projects = role.projectsNeeded;
  if (tier === 'Product / Big Tech') { raise('dsa', .9); raise('cs', .7); raise('interview', .9); projects += 1; }
  if (tier === 'IT Services') { raise('comm', .7); raise('interview', .7); raise('dsa', .5); }
  if (tier === 'Startup') { raise('cloud', .4); projects += 1; }
  return { w, projects, tier };
}

export interface CatStat {
  cat: Category;
  done: number; total: number; pct: number;
  weight: number;        // required fraction for the role
  needed: number;        // topics required
  remaining: number;     // required topics still to do
  coverage: number;      // 0..1 progress toward the requirement
  nextTopics: Topic[];   // the specific topics to do next
  hoursLeft: number;
}
export interface Analysis {
  stats: CatStat[];
  readiness: number;     // 0..100 overall
  skillScore: number;    // 0..100 skills only
  topicsLeft: number; hoursLeft: number;
  projectsDone: number; projectsNeeded: number; projectsLeft: number;
  strengths: CatStat[]; gaps: CatStat[];
  tier: Tier;
}

export function analyze(
  role: Role,
  company: string,
  level: Level,
  done: Set<string>,
  projectsDone: number,
  customTier?: Tier | string
): Analysis {
  const { w, projects, tier } = weightsFor(role, company, customTier);
  const pace = PACE[level];
  const stats: CatStat[] = CATEGORIES.map(cat => {
    const total = cat.topics.length;
    const doneN = cat.topics.filter(t => done.has(t.id)).length;
    const weight = w[cat.id] ?? 0;
    const needed = Math.ceil(weight * total - 1e-9);
    const remaining = Math.max(0, needed - doneN);
    const nextTopics = cat.topics.filter(t => !done.has(t.id)).slice(0, remaining);
    return {
      cat, done: doneN, total, pct: Math.round((doneN / total) * 100), weight, needed, remaining,
      coverage: needed === 0 ? 1 : Math.min(1, doneN / needed), nextTopics,
      hoursLeft: Math.round(nextTopics.reduce((a, t) => a + t.hours, 0) * pace),
    };
  });
  const required = stats.filter(s => s.weight > 0);
  const sumW = required.reduce((a, s) => a + s.weight, 0) || 1;
  const skillScore = (required.reduce((a, s) => a + s.weight * s.coverage, 0) / sumW) * 100;
  const projectsLeft = Math.max(0, projects - projectsDone);
  const projScore = Math.min(1, projectsDone / projects) * 100;
  const projHours = Math.round(projectsLeft * 15 * pace);
  const topicsLeft = stats.reduce((a, s) => a + s.remaining, 0);
  return {
    stats,
    skillScore: Math.round(skillScore),
    readiness: Math.round(skillScore * 0.85 + projScore * 0.15),
    topicsLeft,
    hoursLeft: stats.reduce((a, s) => a + s.hoursLeft, 0) + projHours,
    projectsDone, projectsNeeded: projects, projectsLeft,
    strengths: required.filter(s => s.coverage >= 1).sort((a, b) => b.pct - a.pct),
    gaps: required.filter(s => s.coverage < 1).sort((a, b) => b.weight * (1 - b.coverage) - a.weight * (1 - a.coverage)),
    tier,
  };
}

// ---------------- Roadmap ----------------
export interface Step {
  n: number;
  kind: 'learn' | 'project' | 'profile' | 'apply';
  title: string;
  detail: string;
  items: string[];
  hours: number;
  weekStart: number; weekEnd: number;
  catId?: string;
  idea?: ProjectIdea;
}

export function buildRoadmap(a: Analysis, goals: Goals, data: Pick<UserData, 'github' | 'linkedin' | 'resumeName' | 'projects'>): Step[] {
  const pace = PACE[goals.level];
  const perWeek = Math.max(1, goals.weeklyHours);
  const steps: Step[] = [];
  let cursor = 0;
  const push = (s: Omit<Step, 'n' | 'weekStart' | 'weekEnd'>) => {
    const start = Math.floor(cursor) + 1;
    cursor += s.hours / perWeek;
    steps.push({ ...s, n: steps.length + 1, weekStart: start, weekEnd: Math.max(start, Math.ceil(cursor - 1e-9)) });
  };

  const ordered = a.stats.filter(s => s.weight > 0).sort((x, y) => x.cat.stage - y.cat.stage || y.weight - x.weight);

  // choose project ideas for the projects still missing (spread across the strongest-weighted core skills)
  const usedIdeas = new Set(data.projects.map(p => p.ideaId).filter(Boolean));
  const planned = new Map<string, ProjectIdea>();
  let left = a.projectsLeft;
  const core = ordered.filter(s => s.cat.stage === 2 && s.weight >= 0.4);
  const pool = core.length ? core : ordered;
  // two passes: first one idea per core skill, then a second idea per skill if more are still needed
  for (let pass = 0; pass < 2; pass++) {
    for (const s of pool) {
      if (left <= 0) break;
      const idea = s.cat.projects.find(p => !usedIdeas.has(p.id));
      if (idea) { planned.set(`${s.cat.id}+${idea.id}`, idea); usedIdeas.add(idea.id); left--; }
    }
  }

  const projectsFor = (catId: string) => [...planned.entries()].filter(([k]) => k === catId || k.startsWith(catId + '+')).map(([, v]) => v);

  for (const s of ordered) {
    if (s.remaining > 0) {
      push({
        kind: 'learn', catId: s.cat.id,
        title: `Learn ${s.cat.name}`,
        detail: `Complete ${s.remaining} topic${s.remaining > 1 ? 's' : ''} to reach ${Math.round(s.weight * 100)}% coverage (you are at ${s.pct}%).`,
        items: s.nextTopics.map(t => t.name), hours: s.hoursLeft,
      });
    }
    for (const idea of projectsFor(s.cat.id)) {
      push({
        kind: 'project', catId: s.cat.id, idea,
        title: `Build: ${idea.title}`,
        detail: `${idea.desc} Push it to GitHub with a clear README.`,
        items: idea.stack, hours: Math.round(15 * pace),
      });
    }
  }
  const missing: string[] = [];
  if (!data.github) missing.push('Add your GitHub profile link and pin your best 3 repositories');
  if (!data.linkedin) missing.push('Add your LinkedIn link and write a headline for ' + goals.position);
  if (!data.resumeName) missing.push('Upload a one-page resume tailored to ' + goals.position);
  if (missing.length) push({ kind: 'profile', title: 'Polish your public profile', detail: 'Recruiters check these first.', items: missing, hours: 3 });
  push({
    kind: 'apply', title: `Apply for ${goals.position}${goals.company ? ' at ' + goals.company : ''}`,
    detail: 'Tailor your resume, ask for referrals and schedule mock interviews. Apply to 5–10 roles every week.',
    items: ['Shortlist 20 target roles', 'Request 3 referrals', 'Do 2 mock interviews per week'], hours: 6,
  });
  return steps;
}

export function etaWeeks(hoursLeft: number, weeklyHours: number) { return Math.ceil(hoursLeft / Math.max(1, weeklyHours)); }
export function etaDate(weeks: number) { const d = new Date(); d.setDate(d.getDate() + weeks * 7); return d; }
export { ROLES };
