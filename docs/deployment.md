# SkillBridge AI — Deployment Guide

This guide covers deployment procedures for SkillBridge AI across modern hosting providers.

## Architecture Topology

- **Frontend:** Vercel, Netlify, Cloudflare Pages, or Docker container serving static Vite dist.
- **Backend:** Render, Railway, Fly.io, Google Cloud Run, or AWS App Runner (Node.js LTS).
- **Database & Auth:** Supabase (PostgreSQL + GoTrue Auth).
- **AI Engine:** Google AI Studio (Gemini 2.5 Flash).

---

## 1. Supabase Database Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to **SQL Editor**.
3. Run the complete idempotent migration script located at:
   `supabase/migrations/001_initial_schema.sql`
4. Confirm tables (`profiles`, `resume_analyses`, `skill_gap_reports`, `roadmaps`, `roadmap_tasks`, `interview_sessions`) and Row Level Security policies are active.
5. In **Project Settings -> API**, copy:
   - `Project URL`
   - `anon public key`
   - `service_role secret key`

---

## 2. Google Gemini API Key Setup

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Create an API Key.
3. Keep the key secure — never prefix it with `VITE_` or expose it in client code.

---

## 3. Server Deployment (e.g., Render / Railway / Cloud Run)

### Environment Variables
Configure the following in your hosting provider's dashboard:
```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app

# AI Configuration
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.5-flash

# Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### Build & Start Commands
- **Build Command:** `npm --workspace=server run build`
- **Start Command:** `npm --workspace=server run start`

---

## 4. Frontend Deployment (e.g., Vercel / Netlify)

### Environment Variables
```env
VITE_API_URL=https://your-server-api.onrender.com/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### Build & Output Settings
- **Root Directory:** `client` (or configure monorepo settings)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

## 5. Security Checklist Before Going Live

- [x] CORS restricted to verified `CLIENT_URL`.
- [x] Rate limiting active on AI endpoints (30 reqs / 15 mins) and general API (200 reqs / 15 mins).
- [x] Row Level Security (RLS) enabled on all 6 PostgreSQL tables.
- [x] Gemini API key stored exclusively on server.
- [x] Resume files parsed in volatile memory with 5MB limits and immediate binary discarding.
- [x] Safe error handlers that never expose stack traces in production.
