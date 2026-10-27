import { z } from 'zod';
import { generateStructuredAI } from './aiProvider.js';
import {
  interviewQuestionSchema,
  interviewEvaluationOutputSchema,
  InterviewQuestion,
  InterviewEvaluationOutput,
} from '../schemas/interview.schema.js';

const questionsListSchema = z.object({
  questions: z.array(interviewQuestionSchema),
});

export interface GenerateInterviewInput {
  targetRole: string;
  experienceLevel: string;
  interviewType: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  numberOfQuestions: number;
  focusTopics?: string[];
}

export async function generateInterviewQuestionsWithAI(
  input: GenerateInterviewInput
): Promise<InterviewQuestion[]> {
  const {
    targetRole,
    experienceLevel,
    interviewType,
    difficulty,
    numberOfQuestions,
    focusTopics = [],
  } = input;

  const systemInstruction = `You are SkillBridge AI's chief technical interviewer.
Generate ${numberOfQuestions} tailored interview questions for a candidate preparing for the role of "${targetRole}".
Experience Level: ${experienceLevel}
Interview Type: ${interviewType} (${
    interviewType === 'technical'
      ? 'focus on code design, algorithms, debugging, architecture, tools'
      : interviewType === 'behavioral'
      ? 'use STAR methodology (Situation, Task, Action, Result), team conflict, ownership, problem-solving'
      : 'blend technical engineering scenarios with behavioral/teamwork challenges'
  })
Difficulty: ${difficulty}
${focusTopics.length > 0 ? `Focus Areas: ${focusTopics.join(', ')}` : ''}

Ensure each question has a unique ID (e.g. q1, q2, ...), clear concise question text, relevant hints, and recommended answer time.`;

  const prompt = `Generate ${numberOfQuestions} realistic questions for:
Role: ${targetRole}
Experience: ${experienceLevel}
Type: ${interviewType}
Difficulty: ${difficulty}

Output strictly valid JSON matching:
{
  "questions": [
    {
      "id": "q-1",
      "questionNumber": 1,
      "category": "System Design / Core / Behavioral / etc.",
      "difficulty": "${difficulty}",
      "questionText": "Clear question text",
      "hints": ["Helpful hint to structure the answer"],
      "recommendedTimeMinutes": 3
    }
  ]
}`;

  const result = await generateStructuredAI<{ questions: InterviewQuestion[] }>({
    systemInstruction,
    prompt,
    schema: questionsListSchema,
    schemaName: 'InterviewQuestionsList',
    temperature: 0.4,
  });

  return result.questions;
}

export interface QuestionAnswerPair {
  questionId: string;
  questionText: string;
  userAnswer: string;
  skipped: boolean;
  timeSpentSeconds?: number;
}

export async function evaluateInterviewWithAI(
  targetRole: string,
  experienceLevel: string,
  interviewType: string,
  qaPairs: QuestionAnswerPair[]
): Promise<InterviewEvaluationOutput> {
  const systemInstruction = `You are SkillBridge AI's senior hiring committee lead and interview coach.
Provide rigorous, empathetic, constructive, and highly educational evaluation of the candidate's interview responses for "${targetRole}" (${experienceLevel}).
Evaluate technical depth, structural communication (e.g. STAR framework for behavioral, clarity/tradeoffs for technical), conciseness, and accuracy.
For each question, assign a score out of 10, list strengths, weaknesses, an exemplary improved model answer, and high-yield topics to study.
Calculate an overall score out of 100 based on the responses. If a question was skipped, score it 0 and provide a model answer.
Clearly remind the user that this is automated educational practice feedback.`;

  const prompt = `TARGET ROLE: ${targetRole}
EXPERIENCE LEVEL: ${experienceLevel}
INTERVIEW TYPE: ${interviewType}

INTERVIEW RESPONSES TO EVALUATE:
${qaPairs
  .map(
    (item, idx) => `
QUESTION ${idx + 1} (ID: ${item.questionId}):
${item.questionText}

USER ANSWER:
${item.skipped ? '[Candidate skipped this question]' : item.userAnswer || '[Empty answer]'}
`
  )
  .join('\n---\n')}

Generate detailed structured evaluation as JSON:
{
  "overallScoreOutOf100": 80,
  "performanceLevel": "Exceptional" | "Strong" | "Developing" | "Needs Practice",
  "executiveSummary": "Comprehensive summary of candidate performance",
  "technicalAccuracyEvaluation": "Analysis of technical correctness, tradeoffs, and depth",
  "communicationAndStructureEvaluation": "Analysis of communication, structure, conciseness",
  "keyStrengths": ["Strength 1", "Strength 2"],
  "priorityAreasToImprove": ["Area 1", "Area 2"],
  "detailedFeedback": [
    {
      "questionId": "q-1",
      "questionText": "...",
      "userAnswer": "...",
      "skipped": false,
      "scoreOutOf10": 8,
      "strengths": ["Good point made"],
      "weaknesses": ["Missed edge case"],
      "suggestedImprovedAnswer": "A polished, benchmark answer displaying senior communication",
      "followUpTip": "Tip for follow-up probe",
      "recommendedTopics": ["Topic to study"]
    }
  ],
  "nextStepRecommendations": ["Immediate study action 1", "Action 2"],
  "disclaimer": "This feedback is an automated AI practice assessment designed for educational preparation and does not represent an actual hiring decision or guarantee."
}`;

  return await generateStructuredAI<InterviewEvaluationOutput>({
    systemInstruction,
    prompt,
    schema: interviewEvaluationOutputSchema,
    schemaName: 'InterviewEvaluationOutput',
    temperature: 0.2,
  });
}
