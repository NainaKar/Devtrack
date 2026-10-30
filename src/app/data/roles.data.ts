import { Role } from '../models';

/** weights = share (0..1) of each category's topics needed to be job-ready for the role. */
export const ROLES: Role[] = [
  { id: 'frontend', name: 'Frontend Developer', icon: '🎨', blurb: 'Craft the interfaces users touch.', projectsNeeded: 5,
    weights: { lang: .6, frontend: 1, backend: .3, db: .2, cs: .4, dsa: .5, cloud: .3, security: .3, comm: .6, interview: .7 } },
  { id: 'backend', name: 'Backend Developer', icon: '🛠️', blurb: 'Build APIs, services and data pipelines.', projectsNeeded: 5,
    weights: { lang: .7, frontend: .2, backend: 1, db: .9, cs: .6, dsa: .6, cloud: .5, security: .5, comm: .5, interview: .7 } },
  { id: 'fullstack', name: 'Full-Stack Web Developer', icon: '🌐', blurb: 'Own features from UI to database.', projectsNeeded: 6,
    weights: { lang: .7, frontend: .8, backend: .8, db: .7, cs: .5, dsa: .5, cloud: .4, security: .4, comm: .6, interview: .7 } },
  { id: 'python', name: 'Python Developer', icon: '🐍', blurb: 'Backends, automation and tooling in Python.', projectsNeeded: 5,
    weights: { lang: .9, frontend: .1, backend: .8, db: .7, cs: .5, dsa: .6, cloud: .4, security: .3, comm: .5, interview: .7, ai: .3 } },
  { id: 'ml', name: 'AI / ML Engineer', icon: '🤖', blurb: 'Train, ship and scale intelligent systems.', projectsNeeded: 6,
    weights: { lang: .7, backend: .3, db: .4, cs: .5, dsa: .6, cloud: .4, comm: .5, interview: .7, ai: 1 } },
  { id: 'datasci', name: 'Data Scientist', icon: '📊', blurb: 'Turn data into decisions.', projectsNeeded: 5,
    weights: { lang: .6, db: .7, cs: .3, dsa: .4, cloud: .2, comm: .7, interview: .7, ai: 1 } },
  { id: 'devops', name: 'DevOps / Cloud Engineer', icon: '☁️', blurb: 'Automate delivery and run reliable infrastructure.', projectsNeeded: 5,
    weights: { lang: .5, backend: .3, db: .3, cs: .7, dsa: .3, cloud: 1, security: .6, comm: .5, interview: .6 } },
  { id: 'security', name: 'Cybersecurity Analyst', icon: '🔐', blurb: 'Detect, prevent and respond to threats.', projectsNeeded: 5,
    weights: { lang: .5, backend: .3, db: .3, cs: .8, dsa: .3, cloud: .4, security: 1, comm: .5, interview: .6 } },
  { id: 'sde', name: 'Software Engineer (SDE)', icon: '💻', blurb: 'Generalist for product companies.', projectsNeeded: 5,
    weights: { lang: .8, frontend: .3, backend: .5, db: .5, cs: .8, dsa: 1, cloud: .3, security: .3, comm: .6, interview: .9 } },
];

export const TIMELINES = [3, 6, 9, 12, 18, 24];
export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;
export const COMPANY_SUGGESTIONS = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Adobe', 'Atlassian', 'Flipkart',
  'TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini', 'Early-stage Startup', 'Any good company',
];
