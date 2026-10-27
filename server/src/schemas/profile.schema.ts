import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  educationLevel: z.string().min(1, 'Education level is required'),
  studyYear: z.string().optional(),
  experienceLevel: z.string().min(1, 'Experience level is required'),
  currentSkills: z.array(z.string()).default([]),
  targetRole: z.string().min(1, 'Target role is required'),
  careerGoal: z.string().optional(),
  weeklyStudyHours: z.number().int().min(1).max(80).default(10),
  learningStyle: z.string().optional(),
  targetTimeline: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
