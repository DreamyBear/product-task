# SFD Assignment — Product Catalog (React + API & SQLite)

A responsive React app that implements a Product Catalog per the assignment's spec, with a Node/Express API and SQLite persistence.

## Tech
- **Frontend**: Vite + React + TypeScript, @tanstack/react-query, Axios
- **Styling**: CSS (globals + tokens)
- **Backend**: Express + SQLite (via `sqlite`)
- **Validation**: zod (API)
- **Tooling**: ESLint, Prettier, Nodemon, Concurrently

## Quick Start
```bash
# 1) Install deps
npm install

# 2) Copy env and adjust if needed
cp .env.example .env

# 3) Seed the database (creates server/data.sqlite)
npm run seed

# 4) Run API + Frontend together
npm run dev:all
# Frontend: http://localhost:5173
# API:      http://localhost:3001/api
```

> Frontend uses `VITE_API_URL` from `.env`. Defaults to `http://localhost:3001/api`.

## Scripts
- `npm run dev` — Vite dev server
- `npm run api` — API with Nodemon
- `npm run dev:all` — both frontend + API
- `npm run seed` — seed SQLite with sample products
- `npm run build` — typecheck + build frontend
- `npm run preview` — preview built frontend
- `npm run lint` — ESLint
- `npm run format` — Prettier write

## Architecture
- `src/api/` — Axios client (`client.ts`) and product endpoints (`products.ts`), with response interceptor that normalizes errors (`{ status, message }`).
- `src/hooks/` — React Query hooks. Delete uses **optimistic update**.
- `src/components/` — UI components (listing, detail, editor, header/footer, spinner, **ErrorBoundary**).
- `server/` — Express API, SQLite init/seed (`db.js`, `db.json`), routes in `index.js`.

## Deployment
Backend (Render/Railway):
- Set `PORT=3001` (default) and persist SQLite volume.
Frontend (Netlify/Vercel):
- Set `VITE_API_URL` to your deployed API origin + `/api`.
- Build command: `npm run build`, Output: `dist`.

## Decisions & Trade-offs
- State: React Query for cache & optimistic UX.
- DB: SQLite for simplicity; easy to swap to Postgres on hosted envs.
- Styling: custom CSS with tokens to match Figma.
- Validation: Zod on server & client for shared rules.
