const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const COOKIE = 'mdt_sid';
const SESSION_DAYS = 7;
const MAX_FAILS = 5;
const FAIL_WINDOW_MS = 15 * 60 * 1000;
const NAME_MIN = 2;
const NAME_MAX = 40;
const PIN_RE = /^\d{4}$/;

const SEED_USERS = [
  { name: 'Mrs.Lakmali', role: 'viewer', pinHash: '$2b$10$tz8ogCqou07Vuf.EGCR2Xep9zhgxX9tRN09lqEdZLWK2K8vWxCUji' },
  { name: 'Ms.Sajini', role: 'viewer', pinHash: '$2b$10$iPGmDh6X1Ael1knXyiw10OQJalH00/ns1.bj5gnJ9..WBqT7ArFUy' },
  { name: 'Dinithi', role: 'entry', pinHash: '$2b$10$19H4KPsKTT.l2DFA8xTkWe1qiAKiyCyhYg/PwYb28pO4UdisHMauO' },
  { name: 'Tharusha', role: 'entry', pinHash: '$2b$10$rK.CVp.5PApKlFqUZ3Hwqu0Mb5AxCct3at8uY0E6BNkEWyBYXnMTe' },
  { name: 'Ruchira', role: 'entry', pinHash: '$2b$10$GpXBoOG4ey/RYxawwcMTz.RigMPySltVyNGAkmmKbZibwqHpYi5Tq' },
  { name: 'Nirmala', role: 'entry', pinHash: '$2b$10$p0IYd5JsGU6Fq.84JcqNueLS6y5dAUPshaI3uDZpMwmuwh.WoWoHi' },
  { name: 'Sumudu', role: 'entry', pinHash: '$2b$10$qqMnYNQziqUKZtG4BLG.pu6vvdkPQT6Eaqvae0rzhR..GHQT5qTo2' },
  { name: 'Minoshi', role: 'entry', pinHash: '$2b$10$dPLT1ps8.wKTZQlDDz5hSexvQQFUNcF0YtM3U.YbyEQLHC8Oej9Q6' },
  { name: 'Dilrukshi', role: 'entry', pinHash: '$2b$10$.anaQ1NoDLjyPnjNONmA0u5aeruFmSftSfDkrGtkAkPuzQUaFf9ky' }
];

const loginFails = new Map();

function isProd() {
  return Boolean(process.env.RENDER || process.env.NODE_ENV === 'production');
}

function dataDir() {
  const dir = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(__dirname, 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function usersFile() {
  return path.join(dataDir(), 'users.json');
}

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ');
}

function loadUsers() {
  const file = usersFile();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(SEED_USERS, null, 2), 'utf8');
    return SEED_USERS.map((u) => ({ ...u }));
  }
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(raw) || !raw.length) {
      fs.writeFileSync(file, JSON.stringify(SEED_USERS, null, 2), 'utf8');
      return SEED_USERS.map((u) => ({ ...u }));
    }
    return raw
      .filter((u) => u && u.name && u.pinHash && (u.role === 'viewer' || u.role === 'entry'))
      .map((u) => ({ name: String(u.name), role: u.role, pinHash: String(u.pinHash) }));
  } catch {
    fs.writeFileSync(file, JSON.stringify(SEED_USERS, null, 2), 'utf8');
    return SEED_USERS.map((u) => ({ ...u }));
  }
}

function saveUsers(list) {
  fs.writeFileSync(usersFile(), JSON.stringify(list, null, 2), 'utf8');
}

let USERS = loadUsers();

function loadSecret() {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16) {
    return process.env.SESSION_SECRET;
  }
  const file = path.join(dataDir(), '.session-secret');
  if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8').trim();
  const secret = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(file, secret, { encoding: 'utf8' });
  if (isProd()) {
    console.warn('SESSION_SECRET is not set. Sessions will reset on each deploy. Add SESSION_SECRET in Render Environment.');
  }
  return secret;
}

const SECRET = loadSecret();

function publicUsers() {
  return USERS.map((u) => ({ name: u.name, role: u.role }));
}

function findUser(name) {
  const n = normalizeName(name).toLowerCase();
  return USERS.find((u) => u.name.toLowerCase() === n) || null;
}

function entryNames() {
  return USERS.filter((u) => u.role === 'entry').map((u) => u.name);
}

async function register(name, pin) {
  const cleanName = normalizeName(name);
  if (cleanName.length < NAME_MIN || cleanName.length > NAME_MAX) {
    return { error: `Name must be ${NAME_MIN}–${NAME_MAX} characters.`, status: 400 };
  }
  if (!PIN_RE.test(String(pin || ''))) {
    return { error: 'PIN must be exactly 4 digits.', status: 400 };
  }
  if (findUser(cleanName)) {
    return { error: 'That name is already taken. Choose another or sign in.', status: 409 };
  }
  const pinHash = await bcrypt.hash(String(pin), 10);
  const user = { name: cleanName, role: 'entry', pinHash };
  USERS = [...USERS, user];
  saveUsers(USERS);
  return { user: { name: user.name, role: user.role } };
}

function removeUser(targetName, actor) {
  const target = findUser(targetName);
  if (!target) {
    return { error: 'User not found.', status: 404 };
  }
  if (!actor || !actor.name) {
    return { error: 'Login required', status: 401 };
  }
  const isSelf = target.name.toLowerCase() === String(actor.name).toLowerCase();
  const actorIsViewer = actor.role === 'viewer';
  if (!isSelf && !actorIsViewer) {
    return { error: 'Only managers can remove other accounts.', status: 403 };
  }
  if (!isSelf && target.role === 'viewer') {
    return { error: 'Manager accounts cannot be removed this way.', status: 403 };
  }
  if (isSelf && target.role === 'viewer') {
    const viewersLeft = USERS.filter((u) => u.role === 'viewer' && u.name !== target.name);
    if (!viewersLeft.length) {
      return { error: 'Cannot remove the last manager account.', status: 400 };
    }
  }
  USERS = USERS.filter((u) => u.name.toLowerCase() !== target.name.toLowerCase());
  saveUsers(USERS);
  return { ok: true, name: target.name };
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  header.split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i < 1) return;
    const key = part.slice(0, i).trim();
    const val = part.slice(i + 1).trim();
    try {
      out[key] = decodeURIComponent(val);
    } catch {
      out[key] = val;
    }
  });
  return out;
}

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifyToken(token) {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload || payload.exp < Date.now()) return null;
    const user = findUser(payload.n);
    if (!user) return null;
    return { name: user.name, role: user.role };
  } catch {
    return null;
  }
}

function cookieHeader(token) {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const parts = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${maxAge}`
  ];
  if (isProd()) parts.push('Secure');
  return parts.join('; ');
}

function clearCookieHeader() {
  const parts = [`${COOKIE}=`, 'HttpOnly', 'Path=/', 'SameSite=Lax', 'Max-Age=0'];
  if (isProd()) parts.push('Secure');
  return parts.join('; ');
}

function clientKey(req, name) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = forwarded || req.socket.remoteAddress || '';
  return `${ip}|${String(name || '').toLowerCase()}`;
}

function tooManyFails(req, name) {
  const rec = loginFails.get(clientKey(req, name));
  if (!rec) return false;
  if (Date.now() - rec.t > FAIL_WINDOW_MS) {
    loginFails.delete(clientKey(req, name));
    return false;
  }
  return rec.n >= MAX_FAILS;
}

function recordFail(req, name) {
  const key = clientKey(req, name);
  const rec = loginFails.get(key);
  if (!rec || Date.now() - rec.t > FAIL_WINDOW_MS) {
    loginFails.set(key, { n: 1, t: Date.now() });
    return;
  }
  rec.n += 1;
}

function clearFails(req, name) {
  loginFails.delete(clientKey(req, name));
}

async function login(name, pin) {
  const user = findUser(name);
  const dummy = '$2b$10$C6UzMDMMhYgDkwrQPB8n8eJ5xN0QKqH8qKqH8qKqH8qKqH8qKqHe';
  const hash = user ? user.pinHash : dummy;
  let ok = false;
  try {
    ok = await bcrypt.compare(String(pin || ''), hash);
  } catch {
    ok = false;
  }
  if (!user || !ok) return null;
  return { name: user.name, role: user.role };
}

function createSession(user) {
  return sign({
    n: user.name,
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  });
}

function readSession(req) {
  return verifyToken(parseCookies(req)[COOKIE]);
}

function requireAuth(req, res, next) {
  const user = readSession(req);
  if (!user) return res.status(401).json({ error: 'Login required' });
  req.user = user;
  next();
}

function requireEntry(req, res, next) {
  if (!req.user || req.user.role !== 'entry') {
    return res.status(403).json({ error: 'View-only accounts cannot change entries' });
  }
  next();
}

module.exports = {
  publicUsers,
  entryNames,
  register,
  removeUser,
  login,
  createSession,
  readSession,
  cookieHeader,
  clearCookieHeader,
  tooManyFails,
  recordFail,
  clearFails,
  requireAuth,
  requireEntry
};
