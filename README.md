# Marketing Tracker

Daily marketing department tracker (Express + SQLite locally, Postgres in production).

## Lifetime data (production)

Render free disk is temporary. For data that survives redeploys:

1. Create a free Postgres DB at [Neon](https://neon.tech) (or Supabase).
2. Copy the connection string (`postgresql://...`).
3. In [Render Dashboard](https://dashboard.render.com) → your web service → **Environment**:
   - Add `DATABASE_URL` = that connection string
4. Save → service redeploys. Empty DB auto-loads `data/seed-entries.json` once.

Local development stays on SQLite in `data/tracker.db` (no `DATABASE_URL` needed).

## Run locally

```bash
npm install
npm start
```

Open http://localhost:5500
