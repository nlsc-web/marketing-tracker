const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, 'data', 'seed-entries.json');
const LEGACY_JSON = path.join(__dirname, 'data', 'entries.json');
const DATABASE_URL = process.env.DATABASE_URL || '';

const CREATE_SQL = `
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
    "updatedAt" TEXT
  )
`;

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

function loadSeedList() {
  const file = fs.existsSync(SEED_FILE) ? SEED_FILE : LEGACY_JSON;
  if (!fs.existsSync(file)) return [];
  try {
    const list = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('Seed read failed:', err.message);
    return [];
  }
}

function normalizeEntry(e) {
  return {
    id: e.id,
    date: e.date || '',
    coordinator: e.coordinator || '',
    department: e.department || '',
    leads: Number(e.leads) || 0,
    answer: Number(e.answer) || 0,
    na: Number(e.na) || 0,
    pickup: Number(e.pickup) || 0,
    payments: Number(e.payments) || 0,
    sure: Number(e.sure) || 0,
    needcall: Number(e.needcall) || 0,
    followup: Number(e.followup) || 0,
    rejected: Number(e.rejected) || 0,
    updatedAt: e.updatedAt || new Date().toISOString()
  };
}

function createSqliteStore() {
  const { DatabaseSync } = require('node:sqlite');
  const DATA_DIR = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(__dirname, 'data');
  const DB_FILE = path.join(DATA_DIR, 'tracker.db');

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`SQLite database: ${DB_FILE}`);

  const db = new DatabaseSync(DB_FILE);
  db.exec(CREATE_SQL.replace(/"updatedAt"/g, 'updatedAt'));

  function seedIfEmpty() {
    const count = db.prepare('SELECT COUNT(*) AS c FROM entries').get().c;
    if (count > 0) return;
    const list = loadSeedList();
    if (!list.length) return;

    const insert = db.prepare(`
      INSERT OR REPLACE INTO entries
      (id, date, coordinator, department, leads, answer, na, pickup, payments, sure, needcall, followup, rejected, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.exec('BEGIN');
    try {
      for (const raw of list) {
        const e = normalizeEntry(raw);
        insert.run(
          e.id, e.date, e.coordinator, e.department,
          e.leads, e.answer, e.na, e.pickup,
          e.payments, e.sure, e.needcall, e.followup, e.rejected, e.updatedAt
        );
      }
      db.exec('COMMIT');
      console.log(`Seeded ${list.length} entries into SQLite`);
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  }

  seedIfEmpty();

  return {
    async getAllEntries() {
      return db
        .prepare('SELECT * FROM entries ORDER BY date DESC, updatedAt DESC')
        .all()
        .map(rowToEntry);
    },
    async getEntryById(id) {
      return rowToEntry(db.prepare('SELECT * FROM entries WHERE id = ?').get(id));
    },
    async upsertEntry(entry) {
      const e = normalizeEntry(entry);
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
        e.id, e.date, e.coordinator, e.department,
        e.leads, e.answer, e.na, e.pickup,
        e.payments, e.sure, e.needcall, e.followup, e.rejected, e.updatedAt
      );
      return rowToEntry(db.prepare('SELECT * FROM entries WHERE id = ?').get(e.id));
    },
    async deleteEntry(id) {
      return db.prepare('DELETE FROM entries WHERE id = ?').run(id).changes > 0;
    },
    async health() {
      return { driver: 'sqlite', file: DB_FILE };
    }
  };
}

async function createPostgresStore(connectionString) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  console.log('Postgres database: DATABASE_URL');
  await pool.query(CREATE_SQL);

  const countRes = await pool.query('SELECT COUNT(*)::int AS c FROM entries');
  if (countRes.rows[0].c === 0) {
    const list = loadSeedList();
    if (list.length) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        for (const raw of list) {
          const e = normalizeEntry(raw);
          await client.query(
            `INSERT INTO entries
              (id, date, coordinator, department, leads, answer, na, pickup, payments, sure, needcall, followup, rejected, "updatedAt")
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
             ON CONFLICT (id) DO NOTHING`,
            [
              e.id, e.date, e.coordinator, e.department,
              e.leads, e.answer, e.na, e.pickup,
              e.payments, e.sure, e.needcall, e.followup, e.rejected, e.updatedAt
            ]
          );
        }
        await client.query('COMMIT');
        console.log(`Seeded ${list.length} entries into Postgres`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }
  }

  return {
    async getAllEntries() {
      const res = await pool.query(
        'SELECT * FROM entries ORDER BY date DESC, "updatedAt" DESC'
      );
      return res.rows.map(rowToEntry);
    },
    async getEntryById(id) {
      const res = await pool.query('SELECT * FROM entries WHERE id = $1', [id]);
      return rowToEntry(res.rows[0]);
    },
    async upsertEntry(entry) {
      const e = normalizeEntry(entry);
      await pool.query(
        `INSERT INTO entries
          (id, date, coordinator, department, leads, answer, na, pickup, payments, sure, needcall, followup, rejected, "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (id) DO UPDATE SET
           date = EXCLUDED.date,
           coordinator = EXCLUDED.coordinator,
           department = EXCLUDED.department,
           leads = EXCLUDED.leads,
           answer = EXCLUDED.answer,
           na = EXCLUDED.na,
           pickup = EXCLUDED.pickup,
           payments = EXCLUDED.payments,
           sure = EXCLUDED.sure,
           needcall = EXCLUDED.needcall,
           followup = EXCLUDED.followup,
           rejected = EXCLUDED.rejected,
           "updatedAt" = EXCLUDED."updatedAt"`,
        [
          e.id, e.date, e.coordinator, e.department,
          e.leads, e.answer, e.na, e.pickup,
          e.payments, e.sure, e.needcall, e.followup, e.rejected, e.updatedAt
        ]
      );
      return this.getEntryById(e.id);
    },
    async deleteEntry(id) {
      const res = await pool.query('DELETE FROM entries WHERE id = $1', [id]);
      return res.rowCount > 0;
    },
    async health() {
      await pool.query('SELECT 1');
      return { driver: 'postgres' };
    }
  };
}

let storePromise;

function getStore() {
  if (!storePromise) {
    storePromise = DATABASE_URL
      ? createPostgresStore(DATABASE_URL)
      : Promise.resolve(createSqliteStore());
  }
  return storePromise;
}

module.exports = {
  ready: () => getStore(),
  getAllEntries: async () => (await getStore()).getAllEntries(),
  getEntryById: async (id) => (await getStore()).getEntryById(id),
  upsertEntry: async (entry) => (await getStore()).upsertEntry(entry),
  deleteEntry: async (id) => (await getStore()).deleteEntry(id),
  health: async () => (await getStore()).health()
};
