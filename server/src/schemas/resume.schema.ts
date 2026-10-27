import { z } from 'zod';

export const analyzeResumeRequestSchema = z.object({
  targetRole: z.string().min(1, 'Target role is required').max(100),
  jobDescription: z.string().max(10000).optional(),
});

export const resumeSectionReviewSchema = z.object({
  sectionName: z.string(),
  status: z.enum(['strong', 'adequate', 'needs_improvement', 'missing']),
  feedback: z.string(),
  recommendations: z.array(z.string()),
});

export const resumeAnalysisOutputSchema = z.object({
  summary: z.string(),
  extractedSkills: z.array(z.string()),
  strengths: z.array(z.string()),
  missingOrWeakAreas: z.array(z.string()),
  sectionReviews: z.array(resumeSectionReviewSchema),
  suggestedImprovements: z.array(z.string()),
  suggestedKeywords: z.array(z.string()),
  alignmentEstimate: z.object({
    scoreOutOf100: z.number().min(0).max(100),
    matchTier: z.enum(['High Alignment', 'Moderate Alignment', 'Developing Alignment', 'Low Alignment']),
    explanation: z.string(),
    disclaimer: z.string().default(
      'This is an AI-generated guidance estimate based strictly on supplied text, not an actual hiring decision or employment guarantee.'
    ),
  }),
});

export type AnalyzeResumeRequestInput = z.infer<typeof analyzeResumeRequestSchema>;
export type ResumeAnalysisOutput = z.infer<typeof resumeAnalysisOutputSchema>;
