import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, localStore } from '../services/supabase.js';
import { config } from '../config/env.js';
import {
  generateInterviewQuestionsWithAI,
  evaluateInterviewWithAI,
} from '../services/interviewService.js';
import {
  GenerateInterviewRequestInput,
  SubmitAnswerRequestInput,
} from '../schemas/interview.schema.js';
import { AppError } from '../middleware/errorHandler.js';
import crypto from 'crypto';

export async function generateInterview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const body = req.body as GenerateInterviewRequestInput;

    const questions = await generateInterviewQuestionsWithAI(body);

    const questionsAndAnswers = questions.map((q) => ({
      questionId: q.id,
      questionNumber: q.questionNumber,
      category: q.category,
      difficulty: q.difficulty,
      questionText: q.questionText,
      hints: q.hints || [],
      recommendedTimeMinutes: q.recommendedTimeMinutes,
      userAnswer: '',
      skipped: false,
      answeredAt: null,
      timeSpentSeconds: 0,
    }));

    const sessionRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      target_role: body.targetRole,
      interview_type: body.interviewType,
      difficulty: body.difficulty,
      questions_and_answers: questionsAndAnswers,
      evaluation_result: null,
      created_at: new Date().toISOString(),
      completed_at: null,
    };

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('interview_sessions')
        .insert(sessionRecord)
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        data,
      });
      return;
    }

    const sessions = localStore.interviewSessions.get(userId) || [];
    sessions.unshift(sessionRecord);
    localStore.interviewSessions.set(userId, sessions);

    res.status(201).json({
      success: true,
      data: sessionRecord,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitInterviewAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { questionId, answerText, skipped, timeSpentSeconds } = req.body as SubmitAnswerRequestInput;

    let session: any = null;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('interview_sessions')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      session = data;
    } else {
      const sessions = localStore.interviewSessions.get(userId) || [];
      session = sessions.find((s) => s.id === id);
    }

    if (!session) {
      throw new AppError('Interview session not found or access denied.', 404, 'NOT_FOUND');
    }

    const qna = session.questions_and_answers || [];
    const targetQ = qna.find((q: any) => q.questionId === questionId);

    if (!targetQ) {
      throw new AppError('Question not found in this interview session.', 404, 'QUESTION_NOT_FOUND');
    }

    targetQ.userAnswer = answerText || '';
    targetQ.skipped = Boolean(skipped);
    targetQ.timeSpentSeconds = timeSpentSeconds || 0;
    targetQ.answeredAt = new Date().toISOString();

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data: updated, error } = await supabaseAdmin
        .from('interview_sessions')
        .update({ questions_and_answers: qna })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      res.json({
        success: true,
        data: updated,
      });
      return;
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

export async function evaluateInterview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    let session: any = null;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('interview_sessions')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      session = data;
    } else {
      const sessions = localStore.interviewSessions.get(userId) || [];
      session = sessions.find((s) => s.id === id);
    }

    if (!session) {
      throw new AppError('Interview session not found or access denied.', 404, 'NOT_FOUND');
    }

    const qna = session.questions_and_answers || [];
    const qaPairs = qna.map((item: any) => ({
      questionId: item.questionId,
      questionText: item.questionText,
      userAnswer: item.userAnswer || '',
      skipped: Boolean(item.skipped),
      timeSpentSeconds: item.timeSpentSeconds,
    }));

    // Call AI evaluator
    const evaluation = await evaluateInterviewWithAI(
      session.target_role,
      'Entry to Mid-Level',
      session.interview_type,
      qaPairs
    );

    const completedAt = new Date().toISOString();

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data: updated, error } = await supabaseAdmin
        .from('interview_sessions')
        .update({
          evaluation_result: evaluation,
          completed_at: completedAt,
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data: updated,
      });
      return;
    }

    session.evaluation_result = evaluation;
    session.completed_at = completedAt;

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

export async function getInterviewSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('interview_sessions')
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

    const sessions = localStore.interviewSessions.get(userId) || [];
    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
}

export async function getInterviewSessionById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('interview_sessions')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        throw new AppError('Interview session not found or access denied.', 404, 'NOT_FOUND');
      }

      res.json({
        success: true,
        data,
      });
      return;
    }

    const sessions = localStore.interviewSessions.get(userId) || [];
    const session = sessions.find((s) => s.id === id);

    if (!session) {
      throw new AppError('Interview session not found or access denied.', 404, 'NOT_FOUND');
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteInterviewSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('interview_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Interview session deleted successfully.',
      });
      return;
    }

    const sessions = localStore.interviewSessions.get(userId) || [];
    localStore.interviewSessions.set(userId, sessions.filter((s) => s.id !== id));

    res.json({
      success: true,
      message: 'Interview session deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}
