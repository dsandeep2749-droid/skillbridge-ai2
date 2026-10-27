import { z } from 'zod';

export const generateRoadmapRequestSchema = z.object({
  targetRole: z.string().min(1, 'Target role is required').max(100),
  currentSkills: z.array(z.string()).default([]),
  missingSkills: z.array(z.string()).default([]),
  weeklyStudyHours: z.number().int().min(1).max(80).default(10),
  targetTimeline: z.string().default('12 Weeks'),
  learningStyle: z.string().default('Project-based & Hands-on'),
});

export const roadmapTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimatedHours: z.number().min(0.5).max(100),
  skillOrTopic: z.string(),
  practicalExercise: z.string(),
  completionCriteria: z.string(),
  recommendedSearchTerms: z.array(z.string()),
});

export const roadmapPhaseSchema = z.object({
  phaseNumber: z.number().int().min(1),
  phaseTitle: z.string(),
  description: z.string(),
  estimatedWeeks: z.number(),
  weeklyPlan: z.array(
    z.object({
      weekNumber: z.number(),
      focus: z.string(),
      goals: z.array(z.string()),
    })
  ),
  tasks: z.array(roadmapTaskSchema),
  projectMilestone: z.object({
    title: z.string(),
    description: z.string(),
    deliverables: z.array(z.string()),
  }),
});

export const roadmapDataSchema = z.object({
  title: z.string(),
  targetRole: z.string(),
  summary: z.string(),
  totalEstimatedHours: z.number(),
  targetTimeline: z.string(),
  phases: z.array(roadmapPhaseSchema),
  assumptions: z.array(z.string()),
  disclaimer: z.string().default(
    'This roadmap represents an estimated study plan based on current market patterns and does not guarantee job placement or compensation.'
  ),
});

export const updateRoadmapTaskSchema = z.object({
  completed: z.boolean(),
});

export type GenerateRoadmapRequestInput = z.infer<typeof generateRoadmapRequestSchema>;
export type RoadmapData = z.infer<typeof roadmapDataSchema>;
export type RoadmapTask = z.infer<typeof roadmapTaskSchema>;
