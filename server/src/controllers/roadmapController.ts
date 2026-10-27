import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, localStore } from '../services/supabase.js';
import { config } from '../config/env.js';
import { generateRoadmapWithAI } from '../services/roadmapGenerator.js';
import { GenerateRoadmapRequestInput, updateRoadmapTaskSchema } from '../schemas/roadmap.schema.js';
import { AppError } from '../middleware/errorHandler.js';
import crypto from 'crypto';

export async function generateRoadmap(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const body = req.body as GenerateRoadmapRequestInput;

    const roadmapData = await generateRoadmapWithAI(body);

    const roadmapId = crypto.randomUUID();
    const roadmapRecord = {
      id: roadmapId,
      user_id: userId,
      title: roadmapData.title || `${body.targetRole} Acceleration Roadmap`,
      target_role: body.targetRole,
      roadmap_data: roadmapData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Extract individual tasks for granular tracking
    const taskRecords: any[] = [];
    roadmapData.phases.forEach((phase) => {
      phase.tasks.forEach((t) => {
        taskRecords.push({
          id: crypto.randomUUID(),
          roadmap_id: roadmapId,
          user_id: userId,
          phase: `Phase ${phase.phaseNumber}: ${phase.phaseTitle}`,
          title: t.title,
          description: t.description,
          estimated_hours: t.estimatedHours,
          completed: false,
          completed_at: null,
          created_at: new Date().toISOString(),
        });
      });
    });

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data: createdRoadmap, error: roadmapError } = await supabaseAdmin
        .from('roadmaps')
        .insert(roadmapRecord)
        .select()
        .single();

      if (roadmapError) throw roadmapError;

      if (taskRecords.length > 0) {
        const { error: tasksError } = await supabaseAdmin
          .from('roadmap_tasks')
          .insert(taskRecords);

        if (tasksError) {
          console.error('Failed to persist roadmap tasks:', tasksError);
        }
      }

      res.status(201).json({
        success: true,
        data: {
          ...createdRoadmap,
          tasks: taskRecords,
          progressPercentage: 0,
        },
      });
      return;
    }

    // Local fallback store
    const userRoadmaps = localStore.roadmaps.get(userId) || [];
    userRoadmaps.unshift(roadmapRecord);
    localStore.roadmaps.set(userId, userRoadmaps);

    const userTasks = localStore.roadmapTasks.get(userId) || [];
    userTasks.push(...taskRecords);
    localStore.roadmapTasks.set(userId, userTasks);

    res.status(201).json({
      success: true,
      data: {
        ...roadmapRecord,
        tasks: taskRecords,
        progressPercentage: 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRoadmaps(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data: roadmaps, error } = await supabaseAdmin
        .from('roadmaps')
        .select('*, roadmap_tasks(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = (roadmaps || []).map((r) => {
        const tasks = r.roadmap_tasks || [];
        const completedTasks = tasks.filter((t: any) => t.completed).length;
        const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
        return {
          ...r,
          tasks,
          progressPercentage,
        };
      });

      res.json({
        success: true,
        data: formatted,
      });
      return;
    }

    const roadmaps = localStore.roadmaps.get(userId) || [];
    const allTasks = localStore.roadmapTasks.get(userId) || [];

    const formatted = roadmaps.map((r) => {
      const tasks = allTasks.filter((t) => t.roadmap_id === r.id);
      const completedTasks = tasks.filter((t) => t.completed).length;
      const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
      return {
        ...r,
        tasks,
        progressPercentage,
      };
    });

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRoadmapById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data: roadmap, error } = await supabaseAdmin
        .from('roadmaps')
        .select('*, roadmap_tasks(*)')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!roadmap) {
        throw new AppError('Roadmap not found or access denied.', 404, 'NOT_FOUND');
      }

      const tasks = roadmap.roadmap_tasks || [];
      const completedTasks = tasks.filter((t: any) => t.completed).length;
      const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

      res.json({
        success: true,
        data: {
          ...roadmap,
          tasks,
          progressPercentage,
        },
      });
      return;
    }

    const roadmaps = localStore.roadmaps.get(userId) || [];
    const roadmap = roadmaps.find((r) => r.id === id);

    if (!roadmap) {
      throw new AppError('Roadmap not found or access denied.', 404, 'NOT_FOUND');
    }

    const allTasks = localStore.roadmapTasks.get(userId) || [];
    const tasks = allTasks.filter((t) => t.roadmap_id === id);
    const completedTasks = tasks.filter((t) => t.completed).length;
    const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    res.json({
      success: true,
      data: {
        ...roadmap,
        tasks,
        progressPercentage,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteRoadmap(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('roadmaps')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Roadmap deleted successfully.',
      });
      return;
    }

    const roadmaps = localStore.roadmaps.get(userId) || [];
    localStore.roadmaps.set(userId, roadmaps.filter((r) => r.id !== id));

    const tasks = localStore.roadmapTasks.get(userId) || [];
    localStore.roadmapTasks.set(userId, tasks.filter((t) => t.roadmap_id !== id));

    res.json({
      success: true,
      message: 'Roadmap deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateRoadmapTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { roadmapId, taskId } = req.params;
    const { completed } = updateRoadmapTaskSchema.parse(req.body);

    const completedAt = completed ? new Date().toISOString() : null;

    if (config.isSupabaseConfigured && supabaseAdmin) {
      const { data: updatedTask, error } = await supabaseAdmin
        .from('roadmap_tasks')
        .update({
          completed,
          completed_at: completedAt,
        })
        .eq('id', taskId)
        .eq('roadmap_id', roadmapId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Fetch all tasks for this roadmap to calculate updated overall progress
      const { data: allTasks } = await supabaseAdmin
        .from('roadmap_tasks')
        .select('id, completed')
        .eq('roadmap_id', roadmapId)
        .eq('user_id', userId);

      const total = allTasks?.length || 1;
      const done = allTasks?.filter((t) => t.completed).length || 0;
      const progressPercentage = Math.round((done / total) * 100);

      res.json({
        success: true,
        data: {
          task: updatedTask,
          progressPercentage,
          completedCount: done,
          totalCount: total,
        },
      });
      return;
    }

    // Local fallback store
    const userTasks = localStore.roadmapTasks.get(userId) || [];
    const targetTask = userTasks.find((t) => t.id === taskId && t.roadmap_id === roadmapId);

    if (!targetTask) {
      throw new AppError('Task not found or access denied.', 404, 'NOT_FOUND');
    }

    targetTask.completed = completed;
    targetTask.completed_at = completedAt;

    const roadmapTasks = userTasks.filter((t) => t.roadmap_id === roadmapId);
    const total = roadmapTasks.length || 1;
    const done = roadmapTasks.filter((t) => t.completed).length;
    const progressPercentage = Math.round((done / total) * 100);

    res.json({
      success: true,
      data: {
        task: targetTask,
        progressPercentage,
        completedCount: done,
        totalCount: total,
      },
    });
  } catch (error) {
    next(error);
  }
}
