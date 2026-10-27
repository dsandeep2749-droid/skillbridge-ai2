# SkillBridge AI — Architecture & Technical Design

## 1. System Overview

SkillBridge AI is an AI-powered career mentor and personalized learning acceleration platform built to bridge the gap between candidate resumes and high-demand tech roles.

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT (Vite + React)                              |
|  - Landing Page (/)               - Resume Analyzer (/resume-analyzer)                |
|  - Auth (/login, /signup)         - Skill Gap Intelligence (/skill-gap)               |
|  - Onboarding (/onboarding)       - Learning Roadmap (/roadmap)                       |
|  - Dashboard (/dashboard)         - AI Mock Interview (/mock-interview)               |
+-------------------------------------------+-------------------------------------------+
                                            | REST API Requests (/api/v1)
                                            | Bearer JWT Authentication
                                            v
+---------------------------------------------------------------------------------------+
|                                    SERVER (Express + Node.js)                         |
|  - Security Middleware: Helmet, CORS, Rate Limiters, Zod Validators                   |
|  - Multer In-Memory File Handling (PDF & DOCX parsing via pdf-parse & mammoth)        |
|  - Controllers: Profile, Resume, Skill Gap, Roadmap, Mock Interview                   |
+---------------------+---------------------------------------------+-------------------+
                      |                                             |
                      v                                             v
+-------------------------------------+     +-------------------------------------------+
|    AI Provider Layer (Gemini)       |     |        Database & Auth (Supabase)         |
|  - Official @google/generative-ai   |     |  - PostgreSQL with Row Level Security     |
|  - Configurable Model Selection     |     |  - Profiles, Resumes, Skill Gaps,         |
|  - Structured JSON Output Validation|     |    Roadmaps, Tasks, Interview Sessions    |
|  - Prompt Injection Defense Guard   |     |  - Zero permanent retention of raw files  |
+-------------------------------------+     +-------------------------------------------+
```

---

## 2. Key Architecture Pillars

### A. Separation of Concerns & Provider Modularity
- The frontend has **zero** access to AI API keys or secret credentials. All Gemini calls originate exclusively from the server-side `aiProvider.ts` service.
- The AI Provider abstracts model interactions (`gemini-2.5-flash`), enforces token limits, catches rate limits (HTTP 429), timeouts (45s), and validates every response with strict Zod schemas before passing results to controllers.

### B. Untrusted User Data & Prompt Injection Hardening
- Resumes and user-submitted job descriptions are treated as **untrusted user data**.
- System instructions enforce strict boundaries instructing Gemini never to follow instructions, shell commands, or overrides embedded inside candidate resumes.

### C. In-Memory Volatile File Processing
- Resume documents (`.pdf`, `.docx`, `.doc`) are limited to 5 MB and parsed strictly in memory buffers (`multer.memoryStorage()`).
- Extracted text is cleaned and evaluated. Raw binary documents are discarded immediately after text extraction, guaranteeing candidate document confidentiality.

### D. Zero-Friction Local Testing with Supabase RLS
- In production, Supabase Auth validates sessions and PostgreSQL Row Level Security guarantees data isolation between candidates.
- For local development, testing, and offline hackathon evaluation before entering live Supabase keys, the server seamlessly activates an isolated in-memory repository with authenticated test users.
