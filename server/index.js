/**
 * DevTrack API – Express + JSON-file storage (swap db.* for PostgreSQL/MongoDB in production).
 * Auth: bcrypt-hashed passwords, JWT bearer tokens (7 days), login rate limiting.
 * In production this also serves the built Angular app, so one `node server/index.js` runs everything.
 */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data', 'db.json');

// ---------- tiny JSON "database" (atomic writes) ----------
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
const db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) : { users: [] };
if (!db.secret) db.secret = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
function persist() { const tmp = DB_FILE + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(db)); fs.renameSync(tmp, DB_FILE); }
persist();
const SECRET = process.env.JWT_SECRET || db.secret;

// ---------- helpers ----------
const publicUser = u => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt });
const sign = u => jwt.sign({ sub: u.id }, SECRET, { expiresIn: '7d' });
const emailOk = e => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 120;

function auth(req, res, next) {
  const h = req.headers.authorization || '';
  try {
    const { sub } = jwt.verify(h.replace(/^Bearer /, ''), SECRET);
    const user = db.users.find(u => u.id === sub);
    if (!user) throw new Error('no user');
    req.user = user; next();
  } catch { res.status(401).json({ error: 'Please log in again.' }); }
}

// Very small in-memory rate limiter: 10 failed logins / 15 min / IP
const fails = new Map();
function tooMany(ip) { const f = (fails.get(ip) || []).filter(t => Date.now() - t < 15 * 60_000); fails.set(ip, f); return f.length >= 10; }

const defaultData = goals => ({ goals, github: '', linkedin: '', resumeName: '', resumeUrl: '', doneTopics: [], projects: [], chat: [], activity: [] });
const validGoals = g => g && typeof g.roleId === 'string' && typeof g.position === 'string' && Number(g.timelineMonths) > 0 && Number(g.weeklyHours) > 0;

// ---------- app ----------
const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '2mb' }));

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, goals } = req.body || {};
  if (typeof name !== 'string' || name.trim().length < 2) return res.status(400).json({ error: 'Please enter your name.' });
  if (!emailOk(email)) return res.status(400).json({ error: 'Please enter a valid email.' });
  if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  if (!validGoals(goals)) return res.status(400).json({ error: 'Please complete your goal details.' });
  const mail = email.trim().toLowerCase();
  if (db.users.some(u => u.email === mail)) return res.status(409).json({ error: 'An account with this email already exists. Try logging in.' });
  const user = {
    id: crypto.randomUUID(), name: name.trim().slice(0, 80), email: mail,
    passwordHash: await bcrypt.hash(password, 10), createdAt: new Date().toISOString(), data: defaultData(goals),
  };
  db.users.push(user); persist();
  res.status(201).json({ token: sign(user), user: publicUser(user), data: user.data });
});

app.post('/api/auth/login', async (req, res) => {
  const ip = req.ip;
  if (tooMany(ip)) return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
  const { email, password } = req.body || {};
  const user = db.users.find(u => u.email === String(email || '').trim().toLowerCase());
  if (!user || typeof password !== 'string' || !(await bcrypt.compare(password, user.passwordHash))) {
    fails.set(ip, [...(fails.get(ip) || []), Date.now()]);
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }
  res.json({ token: sign(user), user: publicUser(user), data: user.data });
});

app.get('/api/me', auth, (req, res) => res.json({ user: publicUser(req.user), data: req.user.data }));

app.put('/api/data', auth, (req, res) => {
  const d = req.body;
  if (!d || typeof d !== 'object' || !validGoals(d.goals) || !Array.isArray(d.doneTopics) || !Array.isArray(d.projects))
    return res.status(400).json({ error: 'Invalid data.' });
  req.user.data = d; persist();
  res.json({ ok: true });
});

app.delete('/api/me', auth, (req, res) => {
  db.users = db.users.filter(u => u.id !== req.user.id); persist();
  res.json({ ok: true });
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Serve the built Angular app (npm run serve:prod)
const dist = path.join(__dirname, '..', 'dist', 'devtrack', 'browser');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => console.log(`DevTrack API running on http://localhost:${PORT}`));
