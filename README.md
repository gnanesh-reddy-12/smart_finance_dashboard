# Smart Finance Dashboard

Employee personal finance analyzer — **React** frontend + **Flask** API.

## Project layout

```text
Salary-Prediction/
├── backend/           # Flask API (auth, analyze)
├── frontend/          # React + Vite (UI)
└── ml_pipeline/       # Future ML features
```

## Deploy on Vercel

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com/).
2. **Root directory:** leave as repository root (not `frontend/`).
3. **Environment variable:** add `SECRET_KEY` (any long random string).
4. Redeploy after changes.

Vercel runs `cd frontend && npm install && npm run build`, then serves the React app and API from `backend/app.py`. Do not use two separate Vercel projects for frontend and backend.

**Note:** `backend/data/users.json` does not persist on serverless. Use PostgreSQL later for production users.

## Quick start (one command — local)

```bash
pip install -r backend/requirements.txt
npm run start
```

This builds React, then starts Flask at [http://127.0.0.1:5000](http://127.0.0.1:5000).

**If you see** `React build not found`, run `npm run build` once (or use `npm run start` instead of only `python backend/app.py`).

## Quick start (development — live UI reload)

```bash
pip install -r backend/requirements.txt
python backend/app.py
```

In another terminal:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Pages (React)

| Route | Screen |
|-------|--------|
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | Sidebar: Overview · Analyze month · Insights |
