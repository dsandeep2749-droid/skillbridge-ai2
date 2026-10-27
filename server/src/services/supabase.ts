import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

if (config.isSupabaseConfigured && config.supabaseUrl) {
  if (config.supabaseAnonKey) {
    supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }

  if (config.supabaseServiceRoleKey) {
    supabaseAdminClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });
  } else if (config.supabaseAnonKey) {
    supabaseAdminClient = supabaseClient;
  }
}

export const supabase = supabaseClient;
export const supabaseAdmin = supabaseAdminClient;

export interface AuthenticatedUser {
  id: string;
  email: string;
  role?: string;
}

// In-memory fallback database for local testing when Supabase credentials are not yet configured
class LocalInMemoryStore {
  public profiles = new Map<string, any>();
  public resumeAnalyses = new Map<string, any[]>();
  public skillGapReports = new Map<string, any[]>();
  public roadmaps = new Map<string, any[]>();
  public roadmapTasks = new Map<string, any[]>();
  public interviewSessions = new Map<string, any[]>();

  constructor() {
    // Seed default demo user profile
    this.profiles.set('00000000-0000-0000-0000-000000000001', {
      id: '00000000-0000-0000-0000-000000000001',
      full_name: 'Alex Developer',
      education_level: 'Bachelor of Science in Computer Science',
      study_year: 'Senior (Final Year)',
      experience_level: 'Entry-Level',
      current_skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git', 'Node.js Basics'],
      target_role: 'Full-Stack Developer',
      career_goal: 'Land a junior full-stack developer role at a tech startup.',
      weekly_study_hours: 15,
      learning_style: 'Hands-on Projects & Building',
      target_timeline: '3 Months',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
}

export const localStore = new LocalInMemoryStore();
