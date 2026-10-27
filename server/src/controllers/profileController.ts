import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, localStore } from '../services/supabase.js';
import { config } from '../config/env.js';
import { UpdateProfileInput } from '../schemas/profile.schema.js';

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        data: data || null,
      });
      return;
    }

    // Local fallback store
    const profile = localStore.profiles.get(userId) || null;
    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const body = req.body as UpdateProfileInput;

    const profileData = {
      id: userId,
      full_name: body.fullName,
      education_level: body.educationLevel,
      study_year: body.studyYear || null,
      experience_level: body.experienceLevel,
      current_skills: body.currentSkills,
      target_role: body.targetRole,
      career_goal: body.careerGoal || null,
      weekly_study_hours: body.weeklyStudyHours,
      learning_style: body.learningStyle || null,
      target_timeline: body.targetTimeline || null,
      updated_at: new Date().toISOString(),
    };

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert(profileData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        data,
      });
      return;
    }

    // Local fallback store
    localStore.profiles.set(userId, profileData);
    res.json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    next(error);
  }
}
