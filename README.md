# Marketing Tracker

Daily marketing department tracker (Express + SQLite locally, Postgres in production).

## Lifetime data (production)

Render free disk is temporary. For data that survives redeploys:

1. Create a free Postgres DB at [Neon](https://neon.tech) (or Supabase).
2. Copy the connection string (`postgresql://...`).
3. In [Render Dashboard](https://dashboard.render.com) → your web service → **Environment**:
   - `DATABASE_URL` = that connection string
   - `SESSION_SECRET` = a long random string (keeps logins valid across deploys)
4. Save → service redeploys. Empty DB auto-loads `data/seed-entries.json` once.

Local development stays on SQLite in `data/tracker.db` (no `DATABASE_URL` needed).

## Login security

PINs are checked on the server (hashed). The API requires a login cookie.

- View-only accounts can read data, not save/edit/delete
- Entry accounts can change only their own rows
- After 5 wrong PIN attempts, that name is locked for 15 minutes

To change a PIN: run `node scripts/hash-pin.js <new-pin>`, then paste the hash into `auth.js` for that person, commit, and deploy.

## Run locally

```bash
npm install
npm start
```

Open http://localhost:5500
