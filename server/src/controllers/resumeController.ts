import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, localStore } from '../services/supabase.js';
import { config } from '../config/env.js';
import { extractTextFromFile } from '../services/fileParser.js';
import { analyzeResumeWithAI } from '../services/resumeAnalyzer.js';
import { AppError } from '../middleware/errorHandler.js';
import crypto from 'crypto';

export async function analyzeResume(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const file = req.file;

    if (!file) {
      throw new AppError('No resume file provided. Please upload a PDF or DOCX resume.', 400, 'FILE_MISSING');
    }

    const targetRole = req.body.targetRole;
    if (!targetRole || typeof targetRole !== 'string' || targetRole.trim().length === 0) {
      throw new AppError('Target role is required for resume analysis.', 400, 'TARGET_ROLE_MISSING');
    }

    const jobDescription = req.body.jobDescription || undefined;

    // 1. Extract text from uploaded document
    const extractedText = await extractTextFromFile(file.buffer, file.originalname);

    // 2. Perform AI analysis using Gemini
    const analysisResult = await analyzeResumeWithAI(extractedText, targetRole.trim(), jobDescription);

    // 3. Persist record in Supabase or localStore
    const resumeRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      resume_filename: file.originalname,
      target_role: targetRole.trim(),
      job_description: jobDescription || null,
      extracted_skills: analysisResult.extractedSkills,
      analysis_result: analysisResult,
      created_at: new Date().toISOString(),
    };

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('resume_analyses')
        .insert(resumeRecord)
        .select()
        .single();

      if (error) {
        console.error('Failed to save resume analysis to Supabase:', error);
      } else if (data) {
        resumeRecord.id = data.id;
      }
    } else {
      const userResumes = localStore.resumeAnalyses.get(userId) || [];
      userResumes.unshift(resumeRecord);
      localStore.resumeAnalyses.set(userId, userResumes);
    }

    res.status(201).json({
      success: true,
      data: resumeRecord,
    });
  } catch (error) {
    next(error);
  }
}

export async function getResumeAnalyses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('resume_analyses')
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

    const resumes = localStore.resumeAnalyses.get(userId) || [];
    res.json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
}

export async function getResumeAnalysisById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('resume_analyses')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        throw new AppError('Resume analysis record not found or access denied.', 404, 'NOT_FOUND');
      }

      res.json({
        success: true,
        data,
      });
      return;
    }

    const resumes = localStore.resumeAnalyses.get(userId) || [];
    const record = resumes.find((r) => r.id === id);

    if (!record) {
      throw new AppError('Resume analysis record not found or access denied.', 404, 'NOT_FOUND');
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteResumeAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('resume_analyses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Resume analysis deleted successfully.',
      });
      return;
    }

    const resumes = localStore.resumeAnalyses.get(userId) || [];
    const filtered = resumes.filter((r) => r.id !== id);
    localStore.resumeAnalyses.set(userId, filtered);

    res.json({
      success: true,
      message: 'Resume analysis deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}
