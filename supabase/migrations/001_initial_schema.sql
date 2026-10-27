-- ==============================================================
-- SkillBridge AI Initial Database Schema
-- Idempotent setup for Supabase PostgreSQL
-- ==============================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  education_level TEXT,
  study_year TEXT,
  experience_level TEXT,
  current_skills TEXT[] DEFAULT '{}',
  target_role TEXT,
  career_goal TEXT,
  weekly_study_hours INTEGER DEFAULT 10,
  learning_style TEXT,
  target_timeline TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Resume Analyses Table
CREATE TABLE IF NOT EXISTS public.resume_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_filename TEXT NOT NULL,
  target_role TEXT NOT NULL,
  job_description TEXT,
  extracted_skills TEXT[] DEFAULT '{}',
  analysis_result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Skill Gap Reports Table
CREATE TABLE IF NOT EXISTS public.skill_gap_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  job_description TEXT,
  analysis_result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Roadmaps Table
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_role TEXT NOT NULL,
  roadmap_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Roadmap Tasks Table
CREATE TABLE IF NOT EXISTS public.roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phase TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  estimated_hours NUMERIC DEFAULT 1,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Interview Sessions Table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  interview_type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  questions_and_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  evaluation_result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resume_analyses_user ON public.resume_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_gap_reports_user ON public.skill_gap_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user ON public.roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_tasks_roadmap ON public.roadmap_tasks(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_tasks_user ON public.roadmap_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user ON public.interview_sessions(user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to profiles and roadmaps
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_roadmaps_updated_at ON public.roadmaps;
CREATE TRIGGER set_roadmaps_updated_at
  BEFORE UPDATE ON public.roadmaps
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gap_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Resume Analyses Policies
DROP POLICY IF EXISTS "Users can read own resumes" ON public.resume_analyses;
CREATE POLICY "Users can read own resumes" ON public.resume_analyses
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own resumes" ON public.resume_analyses;
CREATE POLICY "Users can insert own resumes" ON public.resume_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own resumes" ON public.resume_analyses;
CREATE POLICY "Users can delete own resumes" ON public.resume_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Skill Gap Policies
DROP POLICY IF EXISTS "Users can read own skill gaps" ON public.skill_gap_reports;
CREATE POLICY "Users can read own skill gaps" ON public.skill_gap_reports
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own skill gaps" ON public.skill_gap_reports;
CREATE POLICY "Users can insert own skill gaps" ON public.skill_gap_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own skill gaps" ON public.skill_gap_reports;
CREATE POLICY "Users can delete own skill gaps" ON public.skill_gap_reports
  FOR DELETE USING (auth.uid() = user_id);

-- Roadmaps Policies
DROP POLICY IF EXISTS "Users can read own roadmaps" ON public.roadmaps;
CREATE POLICY "Users can read own roadmaps" ON public.roadmaps
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own roadmaps" ON public.roadmaps;
CREATE POLICY "Users can insert own roadmaps" ON public.roadmaps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own roadmaps" ON public.roadmaps;
CREATE POLICY "Users can update own roadmaps" ON public.roadmaps
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own roadmaps" ON public.roadmaps;
CREATE POLICY "Users can delete own roadmaps" ON public.roadmaps
  FOR DELETE USING (auth.uid() = user_id);

-- Roadmap Tasks Policies
DROP POLICY IF EXISTS "Users can read own roadmap tasks" ON public.roadmap_tasks;
CREATE POLICY "Users can read own roadmap tasks" ON public.roadmap_tasks
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own roadmap tasks" ON public.roadmap_tasks;
CREATE POLICY "Users can insert own roadmap tasks" ON public.roadmap_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own roadmap tasks" ON public.roadmap_tasks;
CREATE POLICY "Users can update own roadmap tasks" ON public.roadmap_tasks
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own roadmap tasks" ON public.roadmap_tasks;
CREATE POLICY "Users can delete own roadmap tasks" ON public.roadmap_tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Interview Sessions Policies
DROP POLICY IF EXISTS "Users can read own interview sessions" ON public.interview_sessions;
CREATE POLICY "Users can read own interview sessions" ON public.interview_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own interview sessions" ON public.interview_sessions;
CREATE POLICY "Users can insert own interview sessions" ON public.interview_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own interview sessions" ON public.interview_sessions;
CREATE POLICY "Users can update own interview sessions" ON public.interview_sessions
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own interview sessions" ON public.interview_sessions;
CREATE POLICY "Users can delete own interview sessions" ON public.interview_sessions
  FOR DELETE USING (auth.uid() = user_id);
