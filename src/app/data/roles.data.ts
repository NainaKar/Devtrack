import { Role } from '../models';

/** weights = share (0..1) of each category's topics needed to be job-ready for the role. */
export const ROLES: Role[] = [
  // --- Existing Original Roles ---
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

  // --- New Web & Backend Roles ---
  { id: 'angular', name: 'Angular Developer', icon: '🅰️', blurb: 'Build scalable enterprise web applications with Angular and TypeScript.', projectsNeeded: 5,
    weights: { lang: .7, frontend: 1, backend: .2, db: .2, cs: .5, dsa: .5, cloud: .3, security: .3, comm: .6, interview: .7 } },
  { id: 'react', name: 'React Developer', icon: '⚛️', blurb: 'Build interactive client-side apps with React, Next.js and modern state management.', projectsNeeded: 5,
    weights: { lang: .8, frontend: 1, backend: .2, db: .2, cs: .5, dsa: .5, cloud: .3, security: .3, comm: .6, interview: .7 } },
  { id: 'java-backend', name: 'Java Backend Developer', icon: '☕', blurb: 'Enterprise APIs, microservices and high-throughput systems with Java & Spring.', projectsNeeded: 5,
    weights: { lang: .8, frontend: .1, backend: 1, db: .9, cs: .7, dsa: .6, cloud: .5, security: .5, comm: .5, interview: .7 } },
  { id: 'dotnet', name: '.NET Developer', icon: '🔷', blurb: 'Robust enterprise services, APIs and cloud applications with C# and .NET Core.', projectsNeeded: 5,
    weights: { lang: .8, frontend: .2, backend: 1, db: .9, cs: .6, dsa: .5, cloud: .5, security: .4, comm: .5, interview: .7 } },

  // --- Mobile Development Roles ---
  { id: 'android', name: 'Android Developer', icon: '📱', blurb: 'Native Android applications using Kotlin, Jetpack Compose and modern architecture.', projectsNeeded: 5,
    weights: { lang: .8, frontend: .5, backend: .3, db: .3, cs: .7, dsa: .6, cloud: .3, security: .4, comm: .5, interview: .7 } },
  { id: 'ios', name: 'iOS Developer', icon: '🍏', blurb: 'Fluid, high-performance native iOS apps using Swift and SwiftUI.', projectsNeeded: 5,
    weights: { lang: .8, frontend: .5, backend: .3, db: .3, cs: .7, dsa: .6, cloud: .3, security: .4, comm: .5, interview: .7 } },
  { id: 'mobile-cross', name: 'Cross-Platform Mobile Developer', icon: '📲', blurb: 'Single-codebase mobile applications for iOS and Android with Flutter or React Native.', projectsNeeded: 5,
    weights: { lang: .8, frontend: .8, backend: .3, db: .3, cs: .5, dsa: .5, cloud: .3, security: .3, comm: .6, interview: .7 } },

  // --- Data & AI Roles ---
  { id: 'data-eng', name: 'Data Engineer', icon: '🗄️', blurb: 'Construct reliable data pipelines, warehouses and distributed ETL systems.', projectsNeeded: 5,
    weights: { lang: .8, backend: .6, db: 1, cs: .6, dsa: .5, cloud: .8, comm: .5, interview: .7, ai: .4 } },
  { id: 'data-analyst', name: 'Data Analyst', icon: '📈', blurb: 'Extract actionable insights, craft KPI dashboards and model business metrics.', projectsNeeded: 4,
    weights: { lang: .6, db: .9, cs: .3, dsa: .3, comm: .8, interview: .7, ai: .7 } },
  { id: 'mlops', name: 'MLOps Engineer', icon: '🔄', blurb: 'Deploy, monitor, version and automate ML models in production environments.', projectsNeeded: 5,
    weights: { lang: .7, backend: .6, db: .5, cs: .6, dsa: .5, cloud: 1, security: .4, comm: .5, interview: .7, ai: .8 } },
  { id: 'genai', name: 'Generative AI Engineer', icon: '🧠', blurb: 'Architect RAG pipelines, fine-tune foundation models and build LLM-native products.', projectsNeeded: 5,
    weights: { lang: .8, backend: .6, db: .5, cs: .5, dsa: .5, cloud: .5, comm: .6, interview: .7, ai: 1 } },

  // --- Cloud, Infrastructure & Reliability Roles ---
  { id: 'qa', name: 'QA / Test Automation Engineer', icon: '🧪', blurb: 'Drive test automation frameworks, CI validation and bulletproof software quality.', projectsNeeded: 4,
    weights: { lang: .7, frontend: .5, backend: .6, db: .4, cs: .5, dsa: .4, cloud: .5, comm: .7, interview: .7 } },
  { id: 'sre', name: 'Site Reliability Engineer (SRE)', icon: '🛡️', blurb: 'Ensure high availability, latency targets, chaos testing and infrastructure resilience.', projectsNeeded: 5,
    weights: { lang: .6, backend: .5, db: .5, cs: .9, dsa: .4, cloud: 1, security: .6, comm: .6, interview: .7 } },
  { id: 'cloud-arch', name: 'Cloud Architect', icon: '🏗️', blurb: 'Design scalable, secure and multi-region cloud architectures across AWS/Azure/GCP.', projectsNeeded: 5,
    weights: { lang: .5, backend: .7, db: .7, cs: .8, dsa: .4, cloud: 1, security: .8, comm: .7, interview: .8 } },
  { id: 'dba', name: 'Database Administrator', icon: '💾', blurb: 'Optimize query execution plans, high-availability clusters, backups and schemas.', projectsNeeded: 4,
    weights: { lang: .5, backend: .4, db: 1, cs: .7, cloud: .6, security: .6, comm: .5, interview: .6 } },

  // --- Security & Low-Level / Specialized Systems ---
  { id: 'pentest', name: 'Penetration Tester', icon: '🎯', blurb: 'Ethical hacking, exploit simulation and defensive vulnerability assessments.', projectsNeeded: 5,
    weights: { lang: .6, backend: .4, db: .4, cs: .9, dsa: .4, cloud: .5, security: 1, comm: .6, interview: .7 } },
  { id: 'embedded', name: 'Embedded Systems Engineer', icon: '🔌', blurb: 'Low-level firmware, microcontrollers, real-time operating systems and hardware drivers.', projectsNeeded: 5,
    weights: { lang: 1, cs: 1, dsa: .7, security: .5, comm: .5, interview: .7 } },
  { id: 'gamedev', name: 'Game Developer', icon: '🎮', blurb: 'Real-time game mechanics, physics engines, shaders and interactive game loops.', projectsNeeded: 5,
    weights: { lang: 1, frontend: .3, cs: .9, dsa: .8, comm: .5, interview: .7 } },
  { id: 'blockchain', name: 'Blockchain Developer', icon: '⛓️', blurb: 'Smart contracts, decentralized protocols, cryptographic consensus and Web3 dApps.', projectsNeeded: 5,
    weights: { lang: .8, backend: .8, db: .5, cs: .8, dsa: .7, cloud: .4, security: .9, comm: .5, interview: .7 } },
];

export interface RoleGroup {
  name: string;
  roles: Role[];
}

export const ROLE_GROUPS: RoleGroup[] = [
  {
    name: 'Web Development',
    roles: [
      ROLES.find(r => r.id === 'frontend')!,
      ROLES.find(r => r.id === 'backend')!,
      ROLES.find(r => r.id === 'fullstack')!,
      ROLES.find(r => r.id === 'angular')!,
      ROLES.find(r => r.id === 'react')!,
      ROLES.find(r => r.id === 'python')!,
      ROLES.find(r => r.id === 'java-backend')!,
      ROLES.find(r => r.id === 'dotnet')!,
    ],
  },
  {
    name: 'Mobile Development',
    roles: [
      ROLES.find(r => r.id === 'android')!,
      ROLES.find(r => r.id === 'ios')!,
      ROLES.find(r => r.id === 'mobile-cross')!,
    ],
  },
  {
    name: 'Data, AI & Machine Learning',
    roles: [
      ROLES.find(r => r.id === 'ml')!,
      ROLES.find(r => r.id === 'datasci')!,
      ROLES.find(r => r.id === 'data-eng')!,
      ROLES.find(r => r.id === 'data-analyst')!,
      ROLES.find(r => r.id === 'mlops')!,
      ROLES.find(r => r.id === 'genai')!,
    ],
  },
  {
    name: 'Cloud, DevOps & Infrastructure',
    roles: [
      ROLES.find(r => r.id === 'devops')!,
      ROLES.find(r => r.id === 'sre')!,
      ROLES.find(r => r.id === 'cloud-arch')!,
      ROLES.find(r => r.id === 'dba')!,
    ],
  },
  {
    name: 'Cybersecurity & Systems',
    roles: [
      ROLES.find(r => r.id === 'security')!,
      ROLES.find(r => r.id === 'pentest')!,
      ROLES.find(r => r.id === 'embedded')!,
    ],
  },
  {
    name: 'Software Engineering & Specialized',
    roles: [
      ROLES.find(r => r.id === 'sde')!,
      ROLES.find(r => r.id === 'qa')!,
      ROLES.find(r => r.id === 'gamedev')!,
      ROLES.find(r => r.id === 'blockchain')!,
    ],
  },
];

export const TIMELINES = [3, 6, 9, 12, 18, 24];
export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export interface CompanyGroup {
  group: string;
  tier: 'Product / Big Tech' | 'IT Services' | 'Startup' | 'General';
  companies: string[];
}

export const COMPANY_GROUPS: CompanyGroup[] = [
  {
    group: 'Global Product & Big Tech',
    tier: 'Product / Big Tech',
    companies: [
      'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Adobe',
      'Atlassian', 'Uber', 'Stripe', 'Nvidia', 'Salesforce', 'Oracle',
      'SAP', 'Intel', 'Qualcomm', 'Walmart Global Tech', 'Goldman Sachs', 'JPMorgan Chase'
    ]
  },
  {
    group: 'Indian Product & Unicorns',
    tier: 'Product / Big Tech',
    companies: [
      'Zoho', 'Freshworks', 'Razorpay', 'Flipkart', 'Swiggy', 'Zomato',
      'PhonePe', 'Paytm', 'CRED', 'Meesho', 'Groww', 'Postman', 'BrowserStack'
    ]
  },
  {
    group: 'Service & Consulting',
    tier: 'IT Services',
    companies: [
      'TCS', 'Infosys', 'Wipro', 'HCLTech', 'Cognizant', 'Accenture',
      'Capgemini', 'Tech Mahindra', 'LTIMindtree'
    ]
  },
  {
    group: 'Startups & Other',
    tier: 'Startup',
    companies: [
      'Early-stage Startup', 'Seed / Series-A Startup', 'Y Combinator Startup', 'Other / Custom Company'
    ]
  }
];

export const COMPANY_SUGGESTIONS: string[] = [
  ...COMPANY_GROUPS[0].companies,
  ...COMPANY_GROUPS[1].companies,
  ...COMPANY_GROUPS[2].companies,
  ...COMPANY_GROUPS[3].companies,
];

export const TIERS = ['Product / Big Tech', 'IT Services', 'Startup', 'General'] as const;
