import { z } from 'zod';

export const generateInterviewRequestSchema = z.object({
  targetRole: z.string().min(1, 'Target role is required').max(100),
  experienceLevel: z.string().default('Entry-Level'),
  interviewType: z.enum(['technical', 'behavioral', 'mixed']).default('mixed'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  numberOfQuestions: z.number().int().min(1).max(10).default(5),
  focusTopics: z.array(z.string()).optional(),
});

export const interviewQuestionSchema = z.object({
  id: z.string(),
  questionNumber: z.number(),
  category: z.string(),
  difficulty: z.string(),
  questionText: z.string(),
  hints: z.array(z.string()).optional(),
  recommendedTimeMinutes: z.number().default(3),
});

export const submitAnswerRequestSchema = z.object({
  questionId: z.string(),
  answerText: z.string().max(5000),
  skipped: z.boolean().default(false),
  timeSpentSeconds: z.number().optional(),
});

export const singleQuestionFeedbackSchema = z.object({
  questionId: z.string(),
  questionText: z.string(),
  userAnswer: z.string(),
  skipped: z.boolean(),
  scoreOutOf10: z.number().min(0).max(10),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestedImprovedAnswer: z.string(),
  followUpTip: z.string(),
  recommendedTopics: z.array(z.string()),
});

export const interviewEvaluationOutputSchema = z.object({
  overallScoreOutOf100: z.number().min(0).max(100),
  performanceLevel: z.enum(['Exceptional', 'Strong', 'Developing', 'Needs Practice']),
  executiveSummary: z.string(),
  technicalAccuracyEvaluation: z.string(),
  communicationAndStructureEvaluation: z.string(),
  keyStrengths: z.array(z.string()),
  priorityAreasToImprove: z.array(z.string()),
  detailedFeedback: z.array(singleQuestionFeedbackSchema),
  nextStepRecommendations: z.array(z.string()),
  disclaimer: z.string().default(
    'This feedback is an automated AI practice assessment designed for educational preparation and does not represent an actual hiring decision or guarantee.'
  ),
});

export type GenerateInterviewRequestInput = z.infer<typeof generateInterviewRequestSchema>;
export type SubmitAnswerRequestInput = z.infer<typeof submitAnswerRequestSchema>;
export type InterviewQuestion = z.infer<typeof interviewQuestionSchema>;
export type InterviewEvaluationOutput = z.infer<typeof interviewEvaluationOutputSchema>;
