// ---------- Static content models ----------
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Topic {
  id: string;
  name: string;
  hours: number; // typical study hours for an average learner
  summary: string; // in-app explanation so students never have to leave
  points: string[]; // key things to know
}
export interface Resource { title: string; url: string; }
export interface ProjectIdea { id: string; title: string; desc: string; level: Level; stack: string[]; }

export interface Category {
  id: string;
  name: string;
  icon: string;
  stage: 1 | 2 | 3; // 1 foundations, 2 core, 3 career
  blurb: string;
  topics: Topic[];
  resources: Resource[];
  projects: ProjectIdea[];
}

export interface Role {
  id: string;
  name: string;
  icon: string;
  blurb: string;
  /** Fraction (0..1) of each category's topics required to be job-ready. */
  weights: Partial<Record<string, number>>;
  projectsNeeded: number;
}

// ---------- User data models ----------
export interface Goals {
  roleId: string;
  company: string;
  position: string;
  timelineMonths: number;
  level: Level;
  weeklyHours: number;
  customTier?: string;
}
export type ProjectStatus = 'Planned' | 'In progress' | 'Completed';
export interface UserProject {
  id: string;
  ideaId?: string;
  categoryId?: string;
  title: string;
  status: ProjectStatus;
  repoUrl: string;
  createdAt: string;
}

export type JobStatus = 'Interested' | 'Preparing' | 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  postingUrl?: string;
  requiredSkills: string[];
  status: JobStatus;
  appliedDate?: string;
  interviewDate?: string;
  notes?: string;
  updatedAt: string;
}

export interface ChatMsg { from: 'user' | 'ai'; text: string; at: string; }
export interface Activity { at: string; type: string; text: string; }

export interface User { id: string; name: string; email: string; createdAt: string; }
export interface UserData {
  goals: Goals;
  github: string;
  linkedin: string;
  resumeName: string;
  resumeUrl: string; // data URL (small files only, demo storage)
  doneTopics: string[];
  projects: UserProject[];
  jobs?: JobApplication[];
  chat: ChatMsg[];
  activity: Activity[];
}
