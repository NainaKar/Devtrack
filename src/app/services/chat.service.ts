import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { TrackerService } from './tracker.service';
import { ALL_TOPICS, CATEGORIES } from '../data/skills.data';
import { etaWeeks } from '../engine';

/**
 * AI Mentor.
 * DEMO MODE: a built-in rule-based mentor that knows the student's real data (progress, gaps, roadmap, topics).
 * REAL AI: set AI_ENDPOINT to YOUR backend route (e.g. POST /api/chat) that calls an LLM (Claude/OpenAI/Gemini).
 * Never put an LLM API key inside Angular code – anyone can read it in the browser.
 */
const AI_ENDPOINT = ''; // e.g. 'http://localhost:3000/api/chat'

@Injectable({ providedIn: 'root' })
export class ChatService {
  private auth = inject(AuthService);
  private tracker = inject(TrackerService);
  typing = signal(false);

  async send(text: string) {
    const now = () => new Date().toISOString();
    this.auth.update(d => { d.chat.push({ from: 'user', text, at: now() }); return d; }, 'chat', `Asked mentor: "${text.slice(0, 60)}"`);
    this.typing.set(true);
    let reply: string;
    try { reply = AI_ENDPOINT ? await this.remote(text) : this.local(text); }
    catch { reply = 'I could not reach the AI service. ' + this.local(text); }
    await new Promise(r => setTimeout(r, 450));
    this.typing.set(false);
    this.auth.update(d => { d.chat.push({ from: 'ai', text: reply, at: now() }); return d; });
  }

  clear() { this.auth.update(d => { d.chat = []; return d; }, 'chat-clear', 'Cleared chat history.'); }

  private async remote(text: string) {
    const a = this.tracker.analysis();
    const res = await fetch(AI_ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text, history: this.auth.data()!.chat.slice(-10),
        context: { goals: this.tracker.goals(), readiness: a.readiness, gaps: a.gaps.map(g => g.cat.name) },
      }),
    });
    return (await res.json()).reply as string;
  }

  // ---------------- local mentor ----------------
  private local(raw: string): string {
    const q = raw.toLowerCase();
    const g = this.tracker.goals();
    const a = this.tracker.analysis();
    const name = this.auth.user()?.name.split(' ')[0] ?? 'there';

    if (/^(hi|hello|hey|yo|good (morning|evening|afternoon))\b/.test(q))
      return `Hi ${name}! 👋 I'm your DevTrack mentor. You are ${a.readiness}% ready for ${g.position}. Ask me "what should I learn next?", "explain closures", "show my progress" or "interview tips".`;

    if (/(progress|status|how am i|readiness|how far)/.test(q)) {
      const top = a.gaps[0];
      return `You are ${a.readiness}% ready for ${g.position}${g.company ? ' at ' + g.company : ''}.\n• Skills score: ${a.skillScore}%\n• Topics left: ${a.topicsLeft}\n• Projects: ${a.projectsDone}/${a.projectsNeeded}\n` +
        (top ? `Biggest gap: ${top.cat.name} (${top.pct}% done, ${top.remaining} topics left).` : 'No skill gaps left – focus on projects and interviews!');
    }

    if (/(next|what should i|roadmap|plan|start|steps)/.test(q) && !/explain/.test(q)) {
      const step = this.tracker.roadmap()[0];
      return step
        ? `Your next step: ${step.title} (weeks ${step.weekStart}–${step.weekEnd}).\n${step.detail}\n` + step.items.slice(0, 5).map(i => '• ' + i).join('\n')
        : 'You have completed everything on your roadmap. Time to apply!';
    }

    if (/(when|how long|how many weeks|eta|finish|calculator|time left)/.test(q)) {
      const w = etaWeeks(a.hoursLeft, g.weeklyHours);
      return `You have about ${a.hoursLeft} study hours left. At ${g.weeklyHours} h/week that is ~${w} weeks (${(w / 4.345).toFixed(1)} months). Your target timeline is ${g.timelineMonths} months — ${w / 4.345 <= g.timelineMonths ? 'you are on track ✅' : 'consider increasing weekly hours.'}`;
    }

    if (/(project|idea|build)/.test(q)) {
      const cat = a.gaps[0]?.cat ?? CATEGORIES[1];
      const ideas = cat.projects.map(p => `• ${p.title} (${p.level}) – ${p.desc}`).join('\n');
      return `Project ideas for ${cat.name}:\n${ideas}\nOpen the Projects page to add one to your tracker.`;
    }

    if (/(interview|behavioral|star|mock)/.test(q))
      return 'Interview plan:\n• Solve 2–3 DSA problems daily (arrays → trees → graphs → DP)\n• Prepare 8 STAR stories\n• Practice explaining your projects in 2 minutes\n• Do a mock interview weekly\nOpen Skills → Interview Preparation for full topics.';

    if (/(resume|cv)/.test(q))
      return 'Resume checklist: one page, impact bullets ("Reduced API latency 40% by adding Redis caching"), projects with links, skills grouped by area, no photos. Upload it in Profile and tailor it per company.';
    if (/(github)/.test(q)) return 'GitHub tips: pin 3–6 best repos, write clear READMEs with screenshots, commit regularly, and add a profile README that states your target role.';
    if (/(linkedin)/.test(q)) return 'LinkedIn tips: headline = target role + key skills, a short About with outcomes, featured projects, and connect with engineers at your target company.';
    if (/(motivat|tired|give up|stuck|overwhelm|stress)/.test(q))
      return 'Feeling stuck is normal. Shrink the goal: pick ONE topic and spend 45 focused minutes today. Consistency beats intensity — small daily wins compound.';
    if (/(role|career|which|choose)/.test(q))
      return `Your target is ${g.position}. You can change role, company or timeline any time in Profile → Goals and the roadmap will recalculate.`;

    // topic lookup: "explain X", "what is X", or any topic name appearing in the message
    const hit = ALL_TOPICS
      .map(t => ({ t, score: this.match(q, t.name + ' ' + t.points.join(' ')) }))
      .filter(x => x.score > 0).sort((x, y) => y.score - x.score)[0];
    if (hit) {
      const t = hit.t;
      return `${t.name} (${t.catName})\n${t.summary}\nKey points:\n${t.points.map(p => '• ' + p).join('\n')}\n~${t.hours}h to learn. Open Skills → ${t.catName} to mark it complete.`;
    }
    return `I'm not sure about that yet. In this demo I'm best at your progress, next steps, time estimates, projects, interview/resume/GitHub/LinkedIn advice, and explaining any of the ${ALL_TOPICS.length} topics in DevTrack (try "explain Big-O" or "what is Docker"). Connect an LLM backend in chat.service.ts to chat about anything.`;
  }

  private match(q: string, hay: string): number {
    const stop = new Set(['what', 'is', 'are', 'the', 'explain', 'tell', 'about', 'me', 'how', 'does', 'work', 'and', 'a', 'an', 'of', 'to', 'in', 'for', 'learn', 'with', 'can', 'you', 'please']);
    const words = q.replace(/[^a-z0-9+#.\s]/g, ' ').split(/\s+/).filter(w => w.length > 1 && !stop.has(w));
    const h = hay.toLowerCase();
    return words.reduce((s, w) => s + (h.includes(w) ? (w.length > 3 ? 2 : 1) : 0), 0);
  }
}
