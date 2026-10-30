import { Category, Level, ProjectIdea, Resource, Topic } from '../models';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const T = (cat: string, name: string, hours: number, summary: string, points: string[]): Topic =>
  ({ id: `${cat}:${slug(name)}`, name, hours, summary, points });
const P = (cat: string, title: string, level: Level, stack: string[], desc: string): ProjectIdea =>
  ({ id: `${cat}:${slug(title)}`, title, level, stack, desc });
const R = (title: string, url: string): Resource => ({ title, url });

export const CATEGORIES: Category[] = [
  {
    id: 'lang', name: 'Programming Languages', icon: '⌨️', stage: 1,
    blurb: 'The tools you think in. Master one language deeply, then learn others quickly.',
    topics: [
      T('lang', 'Programming basics', 8, 'Variables, data types, operators, conditionals and loops are the building blocks of every language.', ['Variables & primitive types', 'if/else, switch, loops', 'Functions, parameters and return values']),
      T('lang', 'Python essentials', 15, 'Python is readable and versatile, used in web, automation, data science and AI.', ['Lists, dicts, sets, tuples', 'Comprehensions & generators', 'Modules, venv and pip']),
      T('lang', 'JavaScript & TypeScript', 20, 'JavaScript runs the web; TypeScript adds static types that catch bugs before runtime.', ['Closures, scope, this', 'Promises & async/await', 'TypeScript types, interfaces, generics']),
      T('lang', 'Java fundamentals', 20, 'Java is a statically typed, object-oriented language widely used in enterprise backends and Android.', ['Classes, interfaces, packages', 'Collections framework', 'Exceptions & streams']),
      T('lang', 'Object-oriented programming', 10, 'OOP models software as interacting objects with state and behavior.', ['Encapsulation, inheritance, polymorphism, abstraction', 'Composition over inheritance', 'SOLID overview']),
      T('lang', 'Error handling & functional ideas', 8, 'Handle failure predictably and write side-effect-light code that is easier to test.', ['try/catch and custom errors', 'map / filter / reduce', 'Pure functions & immutability']),
      T('lang', 'Testing & debugging', 8, 'Automated tests and a debugging routine make you faster and more trusted.', ['Unit tests (Jest/pytest/JUnit)', 'Breakpoints & logging', 'Test-driven development basics']),
    ],
    resources: [R('Python Tutorial (official)', 'https://docs.python.org/3/tutorial/'), R('javascript.info', 'https://javascript.info'), R('TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html')],
    projects: [
      P('lang', 'CLI Task Manager', 'Beginner', ['Python'], 'Add, list, complete and delete tasks from the terminal with JSON file storage.'),
      P('lang', 'Expense Tracker with Reports', 'Intermediate', ['TypeScript', 'Node'], 'Track expenses by category and print monthly summaries; add unit tests.'),
      P('lang', 'Text Adventure Engine', 'Advanced', ['Java', 'OOP'], 'Data-driven game engine using interfaces, inheritance and design patterns.'),
    ],
  },
  {
    id: 'frontend', name: 'Frontend Development', icon: '🎨', stage: 2,
    blurb: 'Build fast, accessible, beautiful interfaces that people actually enjoy using.',
    topics: [
      T('frontend', 'HTML5 & semantic markup', 6, 'Semantic elements give meaning to content for browsers, SEO and screen readers.', ['header/nav/main/section/article', 'Forms & input types', 'Meta tags & SEO basics']),
      T('frontend', 'CSS, Flexbox & Grid', 12, 'CSS controls layout and look. Flexbox handles one-dimensional layouts, Grid handles two.', ['Box model & specificity', 'Flexbox & Grid layouts', 'CSS variables & animations']),
      T('frontend', 'Responsive design & accessibility', 8, 'Interfaces must work on every screen size and for every user.', ['Mobile-first media queries', 'ARIA roles & keyboard navigation', 'Color contrast (WCAG)']),
      T('frontend', 'DOM & browser APIs', 8, 'The DOM is the live tree of your page; JavaScript reads and changes it.', ['Selecting & updating elements', 'Event delegation', 'fetch, localStorage, IntersectionObserver']),
      T('frontend', 'Angular fundamentals', 20, 'Angular is a TypeScript framework with components, dependency injection and a powerful router.', ['Standalone components & templates', 'Services & dependency injection', 'Routing, guards & lazy loading']),
      T('frontend', 'State management, RxJS & Signals', 12, 'Predictable state keeps large apps understandable.', ['Signals & computed values', 'Observables, operators, switchMap', 'When to use NgRx']),
      T('frontend', 'Forms, HTTP & REST integration', 10, 'Talk to APIs and validate user input safely.', ['Reactive vs template-driven forms', 'HttpClient & interceptors', 'Error and loading states']),
      T('frontend', 'Frontend performance & testing', 10, 'Fast apps convert better; tested apps break less.', ['Lazy loading & bundle analysis', 'Core Web Vitals', 'Component tests & Playwright E2E']),
    ],
    resources: [R('MDN Web Docs', 'https://developer.mozilla.org'), R('Angular Docs', 'https://angular.dev'), R('web.dev Learn', 'https://web.dev/learn')],
    projects: [
      P('frontend', 'Responsive Portfolio Site', 'Beginner', ['HTML', 'CSS'], 'A mobile-first personal portfolio with a contact form and dark mode.'),
      P('frontend', 'Weather Dashboard', 'Intermediate', ['Angular', 'REST API'], 'Search cities, call a weather API, show charts and handle errors gracefully.'),
      P('frontend', 'Kanban Board', 'Advanced', ['Angular', 'Signals', 'CDK Drag&Drop'], 'Drag-and-drop boards with persistence, filtering and keyboard accessibility.'),
    ],
  },
  {
    id: 'backend', name: 'Backend Development', icon: '🛠️', stage: 2,
    blurb: 'Design the APIs, business logic and services that power every application.',
    topics: [
      T('backend', 'HTTP & REST API design', 8, 'REST maps resources to URLs and uses HTTP verbs and status codes consistently.', ['GET/POST/PUT/PATCH/DELETE semantics', 'Status codes & idempotency', 'Pagination, filtering, versioning']),
      T('backend', 'Node.js & Express (or FastAPI/Django)', 20, 'A web framework routes requests to handlers and manages middleware.', ['Routing & middleware', 'Request validation', 'Project structure (controller/service/repo)']),
      T('backend', 'Authentication & authorization', 12, 'Authentication proves who you are; authorization decides what you can do.', ['Password hashing (bcrypt/argon2)', 'JWT vs sessions', 'OAuth2 & role-based access']),
      T('backend', 'Validation, errors & logging', 6, 'Reliable services reject bad input and leave a trail when things fail.', ['Schema validation (zod/pydantic)', 'Centralized error handler', 'Structured logs']),
      T('backend', 'Caching & message queues', 10, 'Caches cut latency; queues smooth out spikes and decouple services.', ['Redis caching patterns', 'RabbitMQ/Kafka basics', 'Rate limiting']),
      T('backend', 'API testing & documentation', 8, 'Tested, documented APIs are trusted APIs.', ['Integration tests with supertest/pytest', 'OpenAPI/Swagger', 'Postman collections']),
      T('backend', 'Microservices & architecture basics', 10, 'Understand when to split a monolith and the trade-offs involved.', ['Monolith vs microservices', 'API gateway & service discovery', 'Eventual consistency']),
    ],
    resources: [R('MDN: HTTP', 'https://developer.mozilla.org/docs/Web/HTTP'), R('Node.js Docs', 'https://nodejs.org/docs/latest/api/'), R('FastAPI Docs', 'https://fastapi.tiangolo.com')],
    projects: [
      P('backend', 'Blog REST API with Auth', 'Beginner', ['Node/Express', 'JWT'], 'Users, posts and comments with login, validation and pagination.'),
      P('backend', 'URL Shortener Service', 'Intermediate', ['FastAPI', 'Redis', 'PostgreSQL'], 'Short links, click analytics, rate limiting and caching.'),
      P('backend', 'Real-time Chat Backend', 'Advanced', ['WebSockets', 'Queue', 'Docker'], 'Rooms, presence, message history and horizontal scaling plan.'),
    ],
  },
  {
    id: 'db', name: 'Databases', icon: '🗄️', stage: 2,
    blurb: 'Store, model and query data efficiently and safely.',
    topics: [
      T('db', 'Relational modeling & normalization', 8, 'Good schemas avoid duplication and anomalies.', ['Entities, keys, relationships', '1NF–3NF', 'ER diagrams']),
      T('db', 'SQL queries & joins', 12, 'SQL is the universal language of data.', ['SELECT, WHERE, GROUP BY, HAVING', 'INNER/LEFT joins', 'Subqueries, CTEs, window functions']),
      T('db', 'Indexes & query optimization', 8, 'Indexes speed up reads at the cost of writes and storage.', ['B-tree indexes', 'EXPLAIN plans', 'Avoiding N+1 queries']),
      T('db', 'Transactions & ACID', 6, 'Transactions keep data correct when many things happen at once.', ['Atomicity, Consistency, Isolation, Durability', 'Isolation levels', 'Deadlocks']),
      T('db', 'NoSQL: MongoDB & Redis', 10, 'Document and key-value stores trade rigid structure for flexibility and speed.', ['Document modeling', 'CAP theorem', 'Redis data structures']),
      T('db', 'ORMs & migrations', 6, 'ORMs map tables to objects; migrations version your schema.', ['Prisma/SQLAlchemy/TypeORM', 'Migration workflow', 'Seeding data']),
    ],
    resources: [R('SQLBolt', 'https://sqlbolt.com'), R('PostgreSQL Docs', 'https://www.postgresql.org/docs/'), R('MongoDB University', 'https://learn.mongodb.com')],
    projects: [
      P('db', 'Library Management Schema', 'Beginner', ['SQL'], 'Design tables, constraints and 20 useful queries.'),
      P('db', 'Sales Analytics Queries', 'Intermediate', ['PostgreSQL'], 'Load a public dataset and answer business questions with joins and window functions.'),
      P('db', 'E-commerce Data Layer', 'Advanced', ['PostgreSQL', 'MongoDB', 'Redis'], 'Polyglot persistence: orders in SQL, catalog in MongoDB, cache in Redis.'),
    ],
  },
  {
    id: 'cs', name: 'Computer Science Fundamentals', icon: '🧠', stage: 1,
    blurb: 'The theory that makes you adaptable when frameworks change.',
    topics: [
      T('cs', 'Operating systems', 12, 'The OS manages processes, memory and files for your programs.', ['Processes vs threads', 'Virtual memory & paging', 'Scheduling & deadlocks']),
      T('cs', 'Computer networks', 12, 'Everything online rides on layered network protocols.', ['OSI/TCP-IP layers', 'DNS, HTTP/HTTPS, TLS', 'What happens when you type a URL']),
      T('cs', 'Git & GitHub workflow', 6, 'Version control is non-negotiable in teams.', ['Branching, merging, rebasing', 'Pull requests & code review', 'Resolving conflicts']),
      T('cs', 'Linux & command line', 6, 'Servers run Linux; the shell makes you faster.', ['Navigation, permissions', 'grep, sed, awk, pipes', 'Processes & services']),
      T('cs', 'Design patterns & SOLID', 10, 'Reusable solutions to common design problems.', ['Factory, Observer, Strategy, Singleton', 'SOLID principles', 'Clean architecture']),
      T('cs', 'Concurrency & parallelism', 8, 'Doing many things at once, safely.', ['Race conditions & locks', 'Async vs threads', 'Event loop model']),
      T('cs', 'System design basics', 12, 'Think about scale, reliability and trade-offs.', ['Load balancers & CDNs', 'Sharding & replication', 'Latency vs throughput']),
    ],
    resources: [R('CS50 (Harvard)', 'https://cs50.harvard.edu'), R('Pro Git Book', 'https://git-scm.com/book'), R('OSTEP (free OS book)', 'https://pages.cs.wisc.edu/~remzi/OSTEP/')],
    projects: [
      P('cs', 'Mini Shell', 'Intermediate', ['C or Python'], 'Implement cd, ls, pipes and background jobs using system calls.'),
      P('cs', 'Tiny HTTP Server', 'Intermediate', ['Sockets'], 'Parse HTTP requests and serve static files from raw TCP sockets.'),
      P('cs', 'Multithreaded Web Crawler', 'Advanced', ['Python/Java'], 'Crawl politely with a thread pool, de-duplication and robots.txt.'),
    ],
  },
  {
    id: 'dsa', name: 'Data Structures & Algorithms', icon: '🧩', stage: 2,
    blurb: 'Efficient problem solving – the core of most technical interviews.',
    topics: [
      T('dsa', 'Complexity analysis (Big-O)', 5, 'Big-O describes how time/space grow with input size.', ['O(1), O(log n), O(n), O(n log n), O(n²)', 'Best/average/worst case', 'Amortized analysis']),
      T('dsa', 'Arrays & strings', 10, 'The most common interview topic; master two-pointer and sliding window.', ['Two pointers', 'Sliding window', 'Prefix sums']),
      T('dsa', 'Hash maps & sets', 6, 'Constant-time lookups unlock many optimizations.', ['Frequency counting', 'Two-sum pattern', 'Collision handling']),
      T('dsa', 'Linked lists, stacks & queues', 8, 'Linear structures with different access rules.', ['Fast/slow pointers', 'Monotonic stack', 'Deque & circular queue']),
      T('dsa', 'Trees & binary search trees', 10, 'Hierarchical data and ordered search.', ['DFS/BFS traversals', 'BST insert/search/delete', 'Trie basics']),
      T('dsa', 'Graphs: BFS, DFS, shortest paths', 12, 'Model networks, maps and dependencies.', ['Adjacency list', 'Topological sort', 'Dijkstra']),
      T('dsa', 'Sorting & binary search', 8, 'Know why and when each sort works.', ['Merge/quick/heap sort', 'Binary search on answer', 'Stability']),
      T('dsa', 'Recursion, backtracking & DP', 16, 'Break problems into overlapping subproblems.', ['Memoization vs tabulation', 'Backtracking templates', 'Knapsack, LIS, edit distance']),
    ],
    resources: [R('NeetCode Roadmap', 'https://neetcode.io'), R('LeetCode', 'https://leetcode.com'), R('VisuAlgo', 'https://visualgo.net')],
    projects: [
      P('dsa', 'Sorting Algorithm Visualizer', 'Beginner', ['JS/TS', 'Canvas'], 'Animate bubble, merge and quick sort side by side with step counts.'),
      P('dsa', 'Autocomplete with Trie', 'Intermediate', ['Any'], 'Prefix search with ranking by frequency.'),
      P('dsa', 'City Route Finder', 'Advanced', ['Graphs', 'Dijkstra/A*'], 'Shortest path on a weighted map with obstacles.'),
    ],
  },
  {
    id: 'cloud', name: 'Cloud & DevOps', icon: '☁️', stage: 2,
    blurb: 'Ship reliably: containers, pipelines and cloud infrastructure.',
    topics: [
      T('cloud', 'Linux servers & shell scripting', 8, 'Automate repetitive server tasks with Bash.', ['SSH & users', 'Cron jobs', 'Bash scripts']),
      T('cloud', 'Docker & containers', 10, 'Containers package an app with its dependencies so it runs anywhere.', ['Dockerfile & images', 'docker-compose', 'Volumes & networks']),
      T('cloud', 'CI/CD with GitHub Actions', 8, 'Automatically test and deploy on every push.', ['Workflows, jobs, secrets', 'Build → test → deploy', 'Caching & matrix builds']),
      T('cloud', 'Cloud fundamentals (AWS/Azure/GCP)', 14, 'Rent compute, storage and managed services on demand.', ['EC2/VMs, S3/Blob, IAM', 'VPC & security groups', 'Serverless functions']),
      T('cloud', 'Kubernetes basics', 12, 'Orchestrate containers at scale.', ['Pods, Deployments, Services', 'ConfigMaps & Secrets', 'Helm']),
      T('cloud', 'Infrastructure as Code (Terraform)', 10, 'Describe infrastructure in version-controlled files.', ['Providers & resources', 'State & modules', 'Plan/apply workflow']),
      T('cloud', 'Monitoring & logging', 8, 'You can\'t fix what you can\'t see.', ['Prometheus & Grafana', 'Centralized logging', 'SLIs, SLOs & alerts']),
    ],
    resources: [R('Docker Docs', 'https://docs.docker.com'), R('GitHub Actions Docs', 'https://docs.github.com/actions'), R('AWS Skill Builder', 'https://skillbuilder.aws')],
    projects: [
      P('cloud', 'Dockerize a Full-stack App', 'Beginner', ['Docker', 'Compose'], 'Containerize frontend, API and database with one command startup.'),
      P('cloud', 'CI/CD Pipeline to Cloud', 'Intermediate', ['GitHub Actions', 'AWS'], 'Test, build and deploy automatically on merge to main.'),
      P('cloud', 'K8s Deployment with Monitoring', 'Advanced', ['Kubernetes', 'Prometheus'], 'Deploy with autoscaling and dashboards.'),
    ],
  },
  {
    id: 'security', name: 'Cybersecurity', icon: '🔐', stage: 2,
    blurb: 'Write and run software that resists attack.',
    topics: [
      T('security', 'Security fundamentals', 6, 'Confidentiality, Integrity, Availability guide every decision.', ['CIA triad', 'Threat modeling (STRIDE)', 'Least privilege']),
      T('security', 'OWASP Top 10', 10, 'The most common web vulnerabilities and their fixes.', ['Injection & XSS', 'Broken access control', 'CSRF & SSRF']),
      T('security', 'Cryptography & hashing', 8, 'Protect data at rest and in transit.', ['Symmetric vs asymmetric', 'Hashing & salting', 'TLS & certificates']),
      T('security', 'Network security', 8, 'Defend the perimeter and monitor traffic.', ['Firewalls & VPNs', 'IDS/IPS', 'Port scanning with nmap']),
      T('security', 'Secure coding & dependency scanning', 6, 'Prevent bugs that become vulnerabilities.', ['Input validation', 'Secrets management', 'npm audit / Snyk / Dependabot']),
      T('security', 'Ethical hacking basics', 14, 'Think like an attacker to defend better.', ['Recon & enumeration', 'Burp Suite basics', 'CTF practice']),
      T('security', 'Incident response', 6, 'What to do when something goes wrong.', ['Detect, contain, eradicate, recover', 'Log analysis', 'Post-mortems']),
    ],
    resources: [R('OWASP Top 10', 'https://owasp.org/www-project-top-ten/'), R('PortSwigger Web Security Academy', 'https://portswigger.net/web-security'), R('TryHackMe', 'https://tryhackme.com')],
    projects: [
      P('security', 'Secure Login System', 'Beginner', ['Any backend'], 'Hashing, rate limiting, lockout and MFA.'),
      P('security', 'Vulnerability Assessment Report', 'Intermediate', ['DVWA', 'Burp'], 'Find, exploit (legally) and document 5 vulnerabilities with fixes.'),
      P('security', 'Encrypted Password Manager', 'Advanced', ['Cryptography'], 'Zero-knowledge vault with key derivation and AES-GCM.'),
    ],
  },
  {
    id: 'comm', name: 'Communication', icon: '💬', stage: 3,
    blurb: 'Technical skill gets you noticed; communication gets you hired and promoted.',
    topics: [
      T('comm', 'Technical writing & documentation', 6, 'Clear READMEs and docs multiply your impact.', ['README structure', 'Writing for your reader', 'Diagrams']),
      T('comm', 'Explaining ideas clearly', 6, 'Explain complex topics simply.', ['Top-down explanations', 'Analogies', 'Check for understanding']),
      T('comm', 'Teamwork & Agile', 6, 'Modern teams work in short iterations.', ['Scrum ceremonies', 'Estimating & stand-ups', 'Jira/Kanban']),
      T('comm', 'Code reviews & feedback', 4, 'Give and receive feedback constructively.', ['Reviewing for clarity & bugs', 'Small PRs', 'Responding without ego']),
      T('comm', 'Presentations & demos', 5, 'Show your work with confidence.', ['Story structure', 'Live demo tips', 'Handling questions']),
      T('comm', 'Professional email & networking', 4, 'Build relationships that open doors.', ['Writing short emails', 'LinkedIn outreach', 'Informational interviews']),
    ],
    resources: [R('Google Technical Writing', 'https://developers.google.com/tech-writing'), R('Atlassian Agile Guide', 'https://www.atlassian.com/agile')],
    projects: [
      P('comm', 'README + Blog Post per Project', 'Beginner', ['Markdown'], 'Write a clear README and a 600-word blog post for one project.'),
      P('comm', '3-minute Project Demo Video', 'Intermediate', ['Screen recorder'], 'Record, edit and publish a demo that a recruiter can watch quickly.'),
      P('comm', 'Open-source Contribution', 'Advanced', ['Git', 'GitHub'], 'Find a good-first-issue, discuss it and get a PR merged.'),
    ],
  },
  {
    id: 'interview', name: 'Interview Preparation', icon: '🎯', stage: 3,
    blurb: 'Turn your skills into offers.',
    topics: [
      T('interview', 'Resume & portfolio', 5, 'A one-page, impact-focused resume gets interviews.', ['Action + metric bullets', 'ATS-friendly format', 'Portfolio with live links']),
      T('interview', 'Behavioral questions (STAR)', 5, 'Structure stories as Situation, Task, Action, Result.', ['Build a story bank', 'Failure & conflict stories', 'Quantify results']),
      T('interview', 'Coding interview strategy', 8, 'A repeatable approach beats improvisation.', ['Clarify → examples → approach → code → test', 'Think aloud', 'Optimize after brute force']),
      T('interview', 'System design interviews', 10, 'Design large systems with clear trade-offs.', ['Requirements & estimation', 'High-level then deep dive', 'Bottlenecks']),
      T('interview', 'Mock interviews', 8, 'Practice under pressure with feedback.', ['Peer mocks (Pramp)', 'Record yourself', 'Log mistakes']),
      T('interview', 'Company research & offers', 4, 'Apply smartly and negotiate confidently.', ['Tailor resume per company', 'Referrals', 'Salary negotiation basics']),
    ],
    resources: [R('Tech Interview Handbook', 'https://www.techinterviewhandbook.org'), R('Pramp (mock interviews)', 'https://www.pramp.com')],
    projects: [
      P('interview', 'STAR Story Bank', 'Beginner', ['Docs'], 'Write 8 stories covering leadership, conflict, failure and impact.'),
      P('interview', 'Tailored Resume Set', 'Intermediate', ['Docs'], 'Create resume variants for 3 target companies.'),
      P('interview', 'Mock Interview Log', 'Advanced', ['Spreadsheet'], 'Complete 5 mocks and track feedback trends.'),
    ],
  },
  {
    id: 'ai', name: 'Data Science & AI', icon: '🤖', stage: 2,
    blurb: 'Extra track: extract insight from data and build intelligent features.',
    topics: [
      T('ai', 'Python for data (NumPy, pandas)', 14, 'The standard toolkit for loading, cleaning and transforming data.', ['DataFrames & indexing', 'Missing data & grouping', 'Vectorized operations']),
      T('ai', 'Statistics & probability', 14, 'The language of uncertainty.', ['Distributions & expectation', 'Hypothesis testing', 'Bayes theorem']),
      T('ai', 'Data visualization', 8, 'Communicate findings visually.', ['matplotlib/seaborn/plotly', 'Choosing the right chart', 'Dashboards']),
      T('ai', 'Machine learning fundamentals', 20, 'Models that learn patterns from data.', ['Supervised vs unsupervised', 'Train/validation/test split & metrics', 'scikit-learn pipelines']),
      T('ai', 'Deep learning & neural networks', 20, 'Layered models for images, text and more.', ['Backpropagation', 'CNNs & transformers', 'PyTorch/TensorFlow']),
      T('ai', 'NLP & LLM applications', 14, 'Build apps on top of language models.', ['Embeddings & vector search', 'Prompting & RAG', 'Evaluation & guardrails']),
      T('ai', 'MLOps & model deployment', 10, 'Take models from notebook to production.', ['Serving with FastAPI', 'Experiment tracking', 'Monitoring drift']),
    ],
    resources: [R('Kaggle Learn', 'https://www.kaggle.com/learn'), R('scikit-learn Docs', 'https://scikit-learn.org/stable/'), R('fast.ai', 'https://www.fast.ai')],
    projects: [
      P('ai', 'House Price Predictor', 'Beginner', ['pandas', 'scikit-learn'], 'End-to-end regression with feature engineering and evaluation.'),
      P('ai', 'Sentiment Analysis App', 'Intermediate', ['NLP', 'FastAPI'], 'Classify reviews and expose the model through an API and UI.'),
      P('ai', 'RAG Chatbot over Your Docs', 'Advanced', ['LLM', 'Vector DB'], 'Answer questions from PDFs with citations and evaluation.'),
    ],
  },
];

export const CAT_BY_ID = new Map(CATEGORIES.map(c => [c.id, c]));
export const ALL_TOPICS = CATEGORIES.flatMap(c => c.topics.map(t => ({ ...t, catId: c.id, catName: c.name })));
