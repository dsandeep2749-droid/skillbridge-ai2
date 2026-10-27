# SkillBridge AI 🚀
### AI-Powered Career Mentor and Personalized Learning Platform

> **"Turn your career ambitions into an actionable plan. Discover your skill gaps, build your learning roadmap, and prepare for your dream job—all in one place."**

SkillBridge AI is a full-stack career acceleration platform designed for college students, fresh graduates, and transitioning professionals targeting high-growth engineering, data, and AI/ML disciplines.

---

## 🌟 Core Capabilities

1. **AI Resume Intelligence (`/resume-analyzer`)**:
   - In-memory text extraction for `.pdf` and `.docx` resumes (zero permanent raw file retention).
   - Deep section-by-section critique across Summary, Experience, Projects, Education, and Skills.
   - Identified demonstrable skills, ATS keywords, and an evidence-backed alignment estimate.

2. **Skill Gap Intelligence Engine (`/skill-gap`)**:
   - Compares candidate capabilities against industry bars and custom job descriptions.
   - Categorizes skills into **Demonstrated**, **Partially demonstrated**, and **Not demonstrated in the supplied evidence**.
   - Prioritizes critical gaps with actionable explanations, targeted search terms, and practical project deliverables.

3. **Personalized Learning Roadmaps (`/roadmap`)**:
   - Chronological phase breakdown calibrated to available weekly study hours (3 to 40 hrs/week).
   - Interactive task checklists with real-time database persistence and dynamic completion calculation (0–100%).
   - Milestone project recommendations designed for your GitHub portfolio.

4. **AI Mock Technical & Behavioral Interviews (`/mock-interview`)**:
   - Configurable by role, difficulty (beginner, intermediate, advanced), and type (technical, behavioral, mixed).
   - Question-by-question text simulation with an optional timer and skip capabilities.
   - Granular hiring committee evaluation with scores, strengths, weaknesses, and exemplary model answers.

5. **Integrated Career Dashboard (`/dashboard`)**:
   - Real-time preparation progress dials, target role overview, priority skill gaps, and recent interview transcripts.

6. **Onboarding & Career Profile (`/onboarding`, `/profile`)**:
   - Multi-step onboarding wizard capturing education, target timeline, study style, and competencies.
   - Account data management and on-demand account deletion workflows.

---

## 🛠️ Technology Stack

| Domain | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v7 |
| **State & Forms** | TanStack Query v5, React Hook Form, Zod |
| **Backend** | Node.js, Express, TypeScript, REST API (`/api/v1`), Zod validation |
| **Security & Utilities**| Helmet, CORS, Express-rate-limit, Multer (Memory Storage) |
| **Document Parsers** | `pdf-parse`, `mammoth` |
| **AI Integration** | Google Gemini (`@google/generative-ai`, `gemini-2.5-flash`) |
| **Database & Auth** | Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth |
| **Testing** | Vitest, Supertest (12 automated backend integration & unit tests) |

---

## 📁 Monorepo Structure

```
skillbridgeai/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/common/  # Button, Card, Badge, Input, Select, Modal, Navbar, Footer
│   │   ├── context/            # AuthContext (Supabase + Demo Mode)
│   │   ├── layouts/            # RootLayout (Public), DashboardLayout (Authenticated)
│   │   ├── pages/              # Landing, Auth, Onboarding, Dashboard, Analyzer, Gap, Roadmap, Interview, Profile, Settings
│   │   ├── services/           # Typed REST API Client
│   │   ├── types/              # Unified TypeScript Interfaces
│   │   ├── lib/                # Supabase Client Initializer
│   │   └── App.tsx             # Protected Routes & Router Configuration
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Express + TypeScript Backend
│   ├── src/
│   │   ├── config/             # Validated Environment Configurations
│   │   ├── controllers/        # Profile, Resume, Skill Gap, Roadmap, Interview
│   │   ├── middleware/         # Auth, Upload (5MB PDF/DOCX), RateLimiters, Zod Validators, ErrorHandler
│   │   ├── routes/             # REST Endpoints under /api/v1
│   │   ├── schemas/            # Zod Schemas for Input Validation & AI Output Enforcement
│   │   ├── services/           # Gemini AI Provider, Resume Analyzer, Gap Engine, Roadmap Generator, Interview Evaluator, File Parsers
│   │   ├── app.ts              # Express App with Security Policies
│   │   ├── server.ts           # HTTP Server Initialization
│   │   └── server.test.ts      # Automated Vitest Test Suite
│   ├── package.json
│   └── tsconfig.json
├── supabase/
│   ├── migrations/             # Idempotent PostgreSQL SQL Schema with RLS Policies
│   └── seed.sql                # Sample Seed Data
├── docs/                       # Architecture, API Reference, and Deployment Guides
├── .env.example                # Unified Environment Variable Template
├── package.json                # Root Monorepo Scripts with Workspaces
└── README.md
```

---

## ⚡ Quickstart Guide (Local Development)

### 1. Prerequisites
- Node.js `v20+` or `v24+` installed
- npm `v10+` installed

### 2. Clone & Install Dependencies
From the repository root:
```bash
npm install
```
*(This installs root, server, and client packages automatically via npm workspaces)*

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your credentials:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Google Gemini (from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Supabase (Optional for local testing; in-memory fallback is active if omitted)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 4. Run Automated Tests
```bash
npm --workspace=server test
```
*Executes all 12 backend integration tests (health check, token verification, upload guards, Zod sanitization, task status mutations, and profile endpoints).*

### 5. Build for Production
```bash
npm run build
```
*Compiles server TypeScript to `dist/` and creates optimized client bundle in `client/dist/`.*

### 6. Start Development Servers
Run both backend (`localhost:5000`) and frontend (`localhost:5173`):
```bash
npm run dev
```

Or run individually:
- **Backend only:** `npm run dev:server`
- **Frontend only:** `npm run dev:client`

Open your browser at **`http://localhost:5173`**.

---

## 🔒 Security & Privacy Implementation

- **Server-Side API Key Storage**: The Gemini API key and Supabase service role secrets are never bundled into client-side code.
- **In-Memory Volatile Processing**: Resumes are parsed in memory buffers (`multer.memoryStorage()`) and discarded after text extraction.
- **Prompt Injection Hardening**: All user resumes and job descriptions are isolated as untrusted data with strict system instructions prohibiting directive execution.
- **Supabase Row Level Security (RLS)**: PostgreSQL policies enforce user ownership (`auth.uid() = user_id`) across all tables.
- **Transparent AI Disclaimer**: Numerical match estimates and mock interview rubrics are clearly labeled as automated educational practice feedback, not guarantees of employment.

---

## 📄 License
MIT License. Built for hackathon demonstration and career mentorship excellence.
