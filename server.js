const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5500;
const STATIC_DIR = path.join(__dirname, 'marketing department');

app.use(cors());
app.use(express.json());
app.use(express.static(STATIC_DIR));

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

app.get('/api/entries', asyncHandler(async (req, res) => {
  res.json(await db.getAllEntries());
}));

app.get('/api/entries/:id', asyncHandler(async (req, res) => {
  const entry = await db.getEntryById(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Entry not found' });
  res.json(entry);
}));

app.post('/api/entries', asyncHandler(async (req, res) => {
  const body = req.body || {};
  if (!body.date || !body.coordinator) {
    return res.status(400).json({ error: 'date and coordinator are required' });
  }

  const id = body.id || ('e' + Date.now() + Math.random().toString(36).slice(2, 7));
  const existing = await db.getEntryById(id);
  const entry = {
    id,
    date: body.date,
    coordinator: body.coordinator,
    department: body.department || '',
    leads: Number(body.leads) || 0,
    answer: Number(body.answer) || 0,
    na: Number(body.na) || 0,
    pickup: Number(body.pickup) || 0,
    payments: Number(body.payments) || 0,
    sure: Number(body.sure) || 0,
    needcall: Number(body.needcall) || 0,
    followup: Number(body.followup) || 0,
    rejected: Number(body.rejected) || 0,
    updatedAt: new Date().toISOString()
  };

  const saved = await db.upsertEntry(entry);
  res.status(existing ? 200 : 201).json(saved);
}));

app.put('/api/entries/:id', asyncHandler(async (req, res) => {
  const prev = await db.getEntryById(req.params.id);
  if (!prev) return res.status(404).json({ error: 'Entry not found' });

  const body = req.body || {};
  const entry = {
    ...prev,
    date: body.date ?? prev.date,
    coordinator: body.coordinator ?? prev.coordinator,
    department: body.department ?? prev.department,
    leads: Number(body.leads ?? prev.leads) || 0,
    answer: Number(body.answer ?? prev.answer) || 0,
    na: Number(body.na ?? prev.na) || 0,
    pickup: Number(body.pickup ?? prev.pickup) || 0,
    payments: Number(body.payments ?? prev.payments) || 0,
    sure: Number(body.sure ?? prev.sure) || 0,
    needcall: Number(body.needcall ?? prev.needcall) || 0,
    followup: Number(body.followup ?? prev.followup) || 0,
    rejected: Number(body.rejected ?? prev.rejected) || 0,
    updatedAt: new Date().toISOString()
  };

  res.json(await db.upsertEntry(entry));
}));

app.delete('/api/entries/:id', asyncHandler(async (req, res) => {
  const ok = await db.deleteEntry(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Entry not found' });
  res.json({ ok: true });
}));

app.get('/api/health', asyncHandler(async (req, res) => {
  const dbHealth = await db.health();
  res.json({ ok: true, time: new Date().toISOString(), db: dbHealth });
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

async function start() {
  await db.ready();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Marketing tracker running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
