import dotenv from 'dotenv';
import path from 'path';

// Load .env from workspace root or server directory
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

export interface ServerConfig {
  port: number;
  nodeEnv: string;
  clientUrl: string;
  geminiApiKey: string | undefined;
  geminiModel: string;
  supabaseUrl: string | undefined;
  supabaseAnonKey: string | undefined;
  supabaseServiceRoleKey: string | undefined;
  isAiConfigured: boolean;
  isSupabaseConfigured: boolean;
}

export const config: ServerConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  isAiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
  isSupabaseConfigured: Boolean(
    process.env.SUPABASE_URL && 
    process.env.SUPABASE_URL !== 'https://your-project.supabase.co' &&
    process.env.SUPABASE_ANON_KEY &&
    process.env.SUPABASE_ANON_KEY !== 'your_supabase_anon_key_here'
  ),
};
