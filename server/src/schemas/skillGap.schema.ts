import { z } from 'zod';

export const analyzeSkillGapRequestSchema = z.object({
  targetRole: z.string().min(1, 'Target role is required').max(100),
  jobDescription: z.string().max(10000).optional(),
  currentSkills: z.array(z.string()).min(1, 'Please provide at least one current skill or upload a resume'),
});

export const skillAssessmentSchema = z.object({
  skill: z.string(),
  status: z.enum(['Demonstrated', 'Partially demonstrated', 'Not demonstrated in the supplied evidence']),
  priority: z.enum(['Critical', 'Important', 'Nice-to-have']),
  evidence: z.string(),
  importanceExplanation: z.string(),
  recommendedSearchTerms: z.array(z.string()),
  practicalProjectIdea: z.string(),
});

export const skillGapAnalysisOutputSchema = z.object({
  targetRole: z.string(),
  executiveSummary: z.string(),
  skillsOverview: z.object({
    demonstratedCount: z.number(),
    partiallyDemonstratedCount: z.number(),
    missingCount: z.number(),
  }),
  skillAssessments: z.array(skillAssessmentSchema),
  suggestedLearningSequence: z.array(z.string()),
  disclaimer: z.string().default(
    'Skills categorized as "Not demonstrated in the supplied evidence" means they were not evident in the provided input, not that you lack the capability.'
  ),
});

export type AnalyzeSkillGapRequestInput = z.infer<typeof analyzeSkillGapRequestSchema>;
export type SkillGapAnalysisOutput = z.infer<typeof skillGapAnalysisOutputSchema>;
