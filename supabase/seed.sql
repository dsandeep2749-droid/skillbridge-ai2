-- Optional seed data script for SkillBridge AI
-- You can run this in the Supabase SQL editor after creating a test user.

-- Note: Replace '00000000-0000-0000-0000-000000000000' with your actual test user's auth.users id
/*
INSERT INTO public.profiles (
  id,
  full_name,
  education_level,
  study_year,
  experience_level,
  current_skills,
  target_role,
  career_goal,
  weekly_study_hours,
  learning_style,
  target_timeline
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Alex Chen',
  'Bachelor of Science in Computer Science',
  'Senior (Final Year)',
  'Entry-Level',
  ARRAY['JavaScript', 'React', 'HTML', 'CSS', 'Git', 'Node.js Basics'],
  'Full-Stack Developer',
  'Land a junior full-stack developer role at an innovative tech startup within 3 months.',
  15,
  'Hands-on Projects & Building',
  '3 Months'
) ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
*/
