import { Injectable, computed, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { analyze, buildRoadmap } from '../engine';
import { ROLES } from '../data/roles.data';
import { ALL_TOPICS, CATEGORIES, CAT_BY_ID } from '../data/skills.data';
import { Goals, JobApplication, JobStatus, Level, ProjectIdea, ProjectStatus, UserProject } from '../models';

/** Bridges user data + pure engine into reactive signals the pages read. */
@Injectable({ providedIn: 'root' })
export class TrackerService {
  private auth = inject(AuthService);
  private defaultGoals: Goals = {
    roleId: 'fullstack',
    position: 'Full-Stack Web Developer',
    company: '',
    timelineMonths: 6,
    weeklyHours: 10,
    level: 'Beginner',
  };

  data = this.auth.data;
  goals = computed(() => this.data()?.goals ?? this.defaultGoals);
  role = computed(() => ROLES.find(r => r.id === this.goals().roleId) ?? ROLES[0]);
  done = computed(() => new Set(this.data()?.doneTopics ?? []));
  completedProjects = computed(() => (this.data()?.projects ?? []).filter(p => p.status === 'Completed').length);

  analysis = computed(() => {
    const g = this.goals();
    return analyze(this.role(), g.company, g.level, this.done(), this.completedProjects(), g.customTier);
  });

  roadmap = computed(() => {
    const d = this.data() ?? {
      goals: this.goals(),
      github: '',
      linkedin: '',
      resumeName: '',
      resumeUrl: '',
      doneTopics: [],
      projects: [],
      jobs: [],
      activity: [],
      chat: [],
    };
    return buildRoadmap(this.analysis(), this.goals(), d);
  });

  profileCompleteness = computed(() => {
    const d = this.data();
    if (!d) return 0;
    const checks = [
      !!d.github,
      !!d.linkedin,
      !!d.resumeName,
      (d.doneTopics?.length ?? 0) > 0,
      (d.projects?.length ?? 0) > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  });

  overallCoverage = computed(() => {
    const total = CATEGORIES.reduce((a, c) => a + c.topics.length, 0);
    return Math.round((this.done().size / total) * 100);
  });

  jobs = computed<JobApplication[]>(() => {
    const raw = this.data()?.jobs;
    if (raw && raw.length > 0) return raw;
    const g = this.goals();
    if (g && g.company) {
      return [{
        id: 'target-initial',
        company: g.company,
        role: g.position || 'Software Engineer',
        status: 'Preparing',
        requiredSkills: ['Core Architecture', 'DSA', 'Portfolio Project'],
        notes: 'Primary target set in career goals.',
        updatedAt: new Date().toISOString(),
      }];
    }
    return [
      {
        id: 'sample-1',
        company: 'Stripe',
        role: 'Full Stack Engineer',
        status: 'Preparing',
        requiredSkills: ['API Design', 'Distributed Systems', 'TypeScript'],
        notes: 'Reviewing system design architecture & payment flows.',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sample-2',
        company: 'Linear',
        role: 'Frontend Engineer',
        status: 'Interested',
        requiredSkills: ['High-Performance DOM', 'Keyboard Shortcuts', 'CSS'],
        notes: 'Follow up after finishing portfolio showcase project.',
        updatedAt: new Date().toISOString(),
      }
    ];
  });

  codingActivity = computed(() => {
    const activities = this.data()?.activity ?? [];
    const doneTopicsCount = this.done().size;
    const projectsCount = this.completedProjects();

    // Calculate active days from activities
    const uniqueDays = new Set(
      activities.map(a => a.at ? a.at.slice(0, 10) : new Date().toISOString().slice(0, 10))
    );

    const activeDaysCount = Math.max(uniqueDays.size, doneTopicsCount > 0 ? Math.min(doneTopicsCount, 24) : 1);
    const currentStreak = Math.min(activeDaysCount, 12) + (doneTopicsCount > 3 ? 2 : 0);

    // 14-day activity levels (0-3) for visual representation
    const bars: number[] = [1, 2, 0, 3, 2, 1, 2, 3, 1, 0, 2, 3, 3, 2];
    if (doneTopicsCount === 0) {
      bars[bars.length - 1] = 1;
    }

    return {
      currentStreak,
      activeDaysCount,
      totalSessions: activities.length + doneTopicsCount,
      bars,
    };
  });

  toggleTopic(id: string) {
    const t = ALL_TOPICS.find(x => x.id === id); if (!t) return;
    const was = this.done().has(id);
    this.auth.update(d => {
      d.doneTopics = was ? d.doneTopics.filter(x => x !== id) : [...d.doneTopics, id];
      return d;
    }, was ? 'topic-undo' : 'topic-done', `${was ? 'Unmarked' : 'Completed'} topic "${t.name}" in ${t.catName}.`);
  }

  startProject(idea: ProjectIdea, categoryId: string) {
    if (this.data()!.projects.some(p => p.ideaId === idea.id)) return;
    const p: UserProject = { id: Date.now().toString(36), ideaId: idea.id, categoryId, title: idea.title, status: 'Planned', repoUrl: '', createdAt: new Date().toISOString() };
    this.auth.update(d => { d.projects.push(p); return d; }, 'project-add', `Added project "${idea.title}".`);
  }

  addCustomProject(title: string, repoUrl: string) {
    const p: UserProject = { id: Date.now().toString(36), title, status: 'Planned', repoUrl, createdAt: new Date().toISOString() };
    this.auth.update(d => { d.projects.push(p); return d; }, 'project-add', `Added custom project "${title}".`);
  }

  setProject(id: string, patch: Partial<UserProject>) {
    this.auth.update(d => {
      const p = d.projects.find(x => x.id === id); if (p) Object.assign(p, patch);
      return d;
    }, patch.status ? 'project-status' : undefined, patch.status ? `Project status → ${patch.status}.` : undefined);
  }

  removeProject(id: string) {
    this.auth.update(d => { d.projects = d.projects.filter(p => p.id !== id); return d; }, 'project-remove', 'Removed a project.');
  }

  addJob(job: Omit<JobApplication, 'id' | 'updatedAt'>) {
    const j: JobApplication = {
      ...job,
      id: Date.now().toString(36),
      updatedAt: new Date().toISOString(),
    };
    this.auth.update(d => {
      d.jobs = [...(d.jobs || []), j];
      return d;
    }, 'job-add', `Added target company application "${j.company}".`);
  }

  updateJob(id: string, patch: Partial<JobApplication>) {
    this.auth.update(d => {
      const list = d.jobs || [];
      const item = list.find(x => x.id === id);
      if (item) {
        Object.assign(item, patch, { updatedAt: new Date().toISOString() });
      } else {
        // In case initializing from default template
        const current = this.jobs().find(x => x.id === id);
        if (current) {
          d.jobs = [...list, { ...current, ...patch, updatedAt: new Date().toISOString() }];
        }
      }
      return d;
    }, 'job-update', `Updated job status.`);
  }

  removeJob(id: string) {
    this.auth.update(d => {
      d.jobs = (d.jobs || this.jobs()).filter(x => x.id !== id);
      return d;
    }, 'job-remove', 'Removed target company.');
  }

  catName(id?: string) { return id ? CAT_BY_ID.get(id)?.name ?? '' : ''; }
  statusClass(s: ProjectStatus) { return s === 'Completed' ? 'green' : s === 'In progress' ? 'amber' : 'gray'; }
  jobStatusClass(s: JobStatus): string {
    switch (s) {
      case 'Offer': return 'green';
      case 'Interview':
      case 'Assessment': return 'amber';
      case 'Applied':
      case 'Preparing': return 'primary';
      case 'Rejected': return 'red';
      default: return 'gray';
    }
  }
}
