const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'tracker.db');
const JSON_FILE = path.join(__dirname, 'data', 'entries.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
console.log(`SQLite database: ${DB_FILE}`);

const db = new DatabaseSync(DB_FILE);

db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    coordinator TEXT NOT NULL,
    department TEXT DEFAULT '',
    leads INTEGER DEFAULT 0,
    answer INTEGER DEFAULT 0,
    na INTEGER DEFAULT 0,
    pickup INTEGER DEFAULT 0,
    payments INTEGER DEFAULT 0,
    sure INTEGER DEFAULT 0,
    needcall INTEGER DEFAULT 0,
    followup INTEGER DEFAULT 0,
    rejected INTEGER DEFAULT 0,
    updatedAt TEXT
  )
`);

function rowToEntry(row) {
  if (!row) return null;
  return {
    id: row.id,
    date: row.date,
    coordinator: row.coordinator,
    department: row.department || '',
    leads: Number(row.leads) || 0,
    answer: Number(row.answer) || 0,
    na: Number(row.na) || 0,
    pickup: Number(row.pickup) || 0,
    payments: Number(row.payments) || 0,
    sure: Number(row.sure) || 0,
    needcall: Number(row.needcall) || 0,
    followup: Number(row.followup) || 0,
    rejected: Number(row.rejected) || 0,
    updatedAt: row.updatedAt || ''
  };
}

function migrateFromJsonIfNeeded() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM entries').get().c;
  if (count > 0 || !fs.existsSync(JSON_FILE)) return;

  try {
    const raw = fs.readFileSync(JSON_FILE, 'utf8');
    const list = JSON.parse(raw);
    if (!Array.isArray(list) || list.length === 0) return;

    const insert = db.prepare(`
      INSERT OR REPLACE INTO entries
      (id, date, coordinator, department, leads, answer, na, pickup, payments, sure, needcall, followup, rejected, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.exec('BEGIN');
    try {
      for (const e of list) {
        insert.run(
          e.id,
          e.date || '',
          e.coordinator || '',
          e.department || '',
          Number(e.leads) || 0,
          Number(e.answer) || 0,
          Number(e.na) || 0,
          Number(e.pickup) || 0,
          Number(e.payments) || 0,
          Number(e.sure) || 0,
          Number(e.needcall) || 0,
          Number(e.followup) || 0,
          Number(e.rejected) || 0,
          e.updatedAt || new Date().toISOString()
        );
      }
      db.exec('COMMIT');
      console.log(`Migrated ${list.length} entries from JSON to SQLite`);
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  } catch (err) {
    console.error('JSON migration skipped:', err.message);
  }
}

migrateFromJsonIfNeeded();

function getAllEntries() {
  return db
    .prepare('SELECT * FROM entries ORDER BY date DESC, updatedAt DESC')
    .all()
    .map(rowToEntry);
}

function getEntryById(id) {
  return rowToEntry(db.prepare('SELECT * FROM entries WHERE id = ?').get(id));
}

function upsertEntry(entry) {
  db.prepare(`
    INSERT INTO entries
    (id, date, coordinator, department, leads, answer, na, pickup, payments, sure, needcall, followup, rejected, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      date = excluded.date,
      coordinator = excluded.coordinator,
      department = excluded.department,
      leads = excluded.leads,
      answer = excluded.answer,
      na = excluded.na,
      pickup = excluded.pickup,
      payments = excluded.payments,
      sure = excluded.sure,
      needcall = excluded.needcall,
      followup = excluded.followup,
      rejected = excluded.rejected,
      updatedAt = excluded.updatedAt
  `).run(
    entry.id,
    entry.date,
    entry.coordinator,
    entry.department || '',
    Number(entry.leads) || 0,
    Number(entry.answer) || 0,
    Number(entry.na) || 0,
    Number(entry.pickup) || 0,
    Number(entry.payments) || 0,
    Number(entry.sure) || 0,
    Number(entry.needcall) || 0,
    Number(entry.followup) || 0,
    Number(entry.rejected) || 0,
    entry.updatedAt || new Date().toISOString()
  );
  return getEntryById(entry.id);
}

function deleteEntry(id) {
  const result = db.prepare('DELETE FROM entries WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = {
  getAllEntries,
  getEntryById,
  upsertEntry,
  deleteEntry
};
