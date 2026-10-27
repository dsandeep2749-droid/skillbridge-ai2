import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, localStore } from '../services/supabase.js';
import { config } from '../config/env.js';
import { analyzeSkillGapWithAI } from '../services/skillGapAnalyzer.js';
import { AnalyzeSkillGapRequestInput } from '../schemas/skillGap.schema.js';
import { AppError } from '../middleware/errorHandler.js';
import crypto from 'crypto';

export async function analyzeSkillGap(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { targetRole, currentSkills, jobDescription } = req.body as AnalyzeSkillGapRequestInput;

    const analysisResult = await analyzeSkillGapWithAI(targetRole, currentSkills, jobDescription);

    const reportRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      target_role: targetRole,
      job_description: jobDescription || null,
      analysis_result: analysisResult,
      created_at: new Date().toISOString(),
    };

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('skill_gap_reports')
        .insert(reportRecord)
        .select()
        .single();

      if (error) {
        console.error('Failed to save skill gap report to Supabase:', error);
      } else if (data) {
        reportRecord.id = data.id;
      }
    } else {
      const userReports = localStore.skillGapReports.get(userId) || [];
      userReports.unshift(reportRecord);
      localStore.skillGapReports.set(userId, userReports);
    }

    res.status(201).json({
      success: true,
      data: reportRecord,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSkillGapReports(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('skill_gap_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        data: data || [],
      });
      return;
    }

    const reports = localStore.skillGapReports.get(userId) || [];
    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSkillGapReportById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('skill_gap_reports')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        throw new AppError('Skill gap report not found or access denied.', 404, 'NOT_FOUND');
      }

      res.json({
        success: true,
        data,
      });
      return;
    }

    const reports = localStore.skillGapReports.get(userId) || [];
    const report = reports.find((r) => r.id === id);

    if (!report) {
      throw new AppError('Skill gap report not found or access denied.', 404, 'NOT_FOUND');
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSkillGapReport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('skill_gap_reports')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Skill gap report deleted successfully.',
      });
      return;
    }

    const reports = localStore.skillGapReports.get(userId) || [];
    const filtered = reports.filter((r) => r.id !== id);
    localStore.skillGapReports.set(userId, filtered);

    res.json({
      success: true,
      message: 'Skill gap report deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}
