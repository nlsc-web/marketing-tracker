const fs = require('fs');
const path = require('path');

const NAME_MIN = 2;
const NAME_MAX = 60;

const SEED_DEPTS = [
  'Accounts Course',
  'Accounts Theory',
  'Accounts Practical',
  'Tax 1day Workshop',
  'HR 5days Workshop',
  'PT & CT 7days Programme',
  'HR & Payroll',
  'HR 1day Workshop',
  'Entrepreneurship Event',
  'Company Registration',
  'BO Form',
  'Vacancies',
  'Form 15',
  'Bags'
];

function dataDir() {
  const dir = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(__dirname, 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function deptsFile() {
  return path.join(dataDir(), 'departments.json');
}

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ');
}

function loadDepartments() {
  const file = deptsFile();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(SEED_DEPTS, null, 2), 'utf8');
    return SEED_DEPTS.slice();
  }
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(raw) || !raw.length) {
      fs.writeFileSync(file, JSON.stringify(SEED_DEPTS, null, 2), 'utf8');
      return SEED_DEPTS.slice();
    }
    const cleaned = [];
    const seen = new Set();
    raw.forEach((item) => {
      const name = normalizeName(item);
      const key = name.toLowerCase();
      if (!name || seen.has(key)) return;
      seen.add(key);
      cleaned.push(name);
    });
    if (!cleaned.length) {
      fs.writeFileSync(file, JSON.stringify(SEED_DEPTS, null, 2), 'utf8');
      return SEED_DEPTS.slice();
    }
    return cleaned;
  } catch {
    fs.writeFileSync(file, JSON.stringify(SEED_DEPTS, null, 2), 'utf8');
    return SEED_DEPTS.slice();
  }
}

function saveDepartments(list) {
  fs.writeFileSync(deptsFile(), JSON.stringify(list, null, 2), 'utf8');
}

let DEPARTMENTS = loadDepartments();

function list() {
  return DEPARTMENTS.slice();
}

function add(name) {
  const clean = normalizeName(name);
  if (clean.length < NAME_MIN || clean.length > NAME_MAX) {
    return { error: `Name must be ${NAME_MIN}–${NAME_MAX} characters.`, status: 400 };
  }
  if (DEPARTMENTS.some((d) => d.toLowerCase() === clean.toLowerCase())) {
    return { error: 'That option already exists.', status: 409, name: DEPARTMENTS.find((d) => d.toLowerCase() === clean.toLowerCase()) };
  }
  DEPARTMENTS = [...DEPARTMENTS, clean];
  saveDepartments(DEPARTMENTS);
  return { name: clean, departments: list() };
}

module.exports = { list, add, SEED_DEPTS };
