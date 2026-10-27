import { generateStructuredAI } from './aiProvider.js';
import { resumeAnalysisOutputSchema, ResumeAnalysisOutput } from '../schemas/resume.schema.js';

export async function analyzeResumeWithAI(
  resumeText: string,
  targetRole: string,
  jobDescription?: string
): Promise<ResumeAnalysisOutput> {
  const sanitizedResume = resumeText.slice(0, 15000);
  const sanitizedJobDesc = jobDescription ? jobDescription.slice(0, 8000) : '';

  const systemInstruction = `You are SkillBridge AI's senior technical recruiter and talent evaluator.
Your role is to perform an honest, constructive, and comprehensive critique of a candidate's resume for the target role: "${targetRole}".
Analyze the professional summary, education, technical skills, projects, work experience, achievements, and formatting clarity.
Identify real demonstrable skills found in the text, highlight strong points, call out weak or missing areas, provide actionable section-by-section guidance, suggest role keywords, and provide a transparent alignment estimate.
Remember: The alignment score is an informative educational estimate, not an employment guarantee.`;

  const prompt = `TARGET ROLE: ${targetRole}

${sanitizedJobDesc ? `TARGET JOB DESCRIPTION:\n${sanitizedJobDesc}\n\n` : ''}CANDIDATE RESUME TEXT:
"""
${sanitizedResume}
"""

Please analyze this resume and return a JSON object adhering to the schema:
{
  "summary": "High-level critique of candidate's profile and readiness for ${targetRole}",
  "extractedSkills": ["Skill 1", "Skill 2", ...],
  "strengths": ["Clear strength 1", "Strength 2", ...],
  "missingOrWeakAreas": ["Missing area 1", "Area 2", ...],
  "sectionReviews": [
    {
      "sectionName": "Summary / Headline",
      "status": "strong" | "adequate" | "needs_improvement" | "missing",
      "feedback": "...",
      "recommendations": ["..."]
    },
    {
      "sectionName": "Technical Skills",
      "status": "strong" | "adequate" | "needs_improvement" | "missing",
      "feedback": "...",
      "recommendations": ["..."]
    },
    {
      "sectionName": "Projects & Portfolio",
      "status": "strong" | "adequate" | "needs_improvement" | "missing",
      "feedback": "...",
      "recommendations": ["..."]
    },
    {
      "sectionName": "Experience & Internships",
      "status": "strong" | "adequate" | "needs_improvement" | "missing",
      "feedback": "...",
      "recommendations": ["..."]
    },
    {
      "sectionName": "Education & Certifications",
      "status": "strong" | "adequate" | "needs_improvement" | "missing",
      "feedback": "...",
      "recommendations": ["..."]
    }
  ],
  "suggestedImprovements": ["Actionable improvement 1", "..."],
  "suggestedKeywords": ["ATS Keyword 1", "..."],
  "alignmentEstimate": {
    "scoreOutOf100": 75,
    "matchTier": "Moderate Alignment",
    "explanation": "Detailed rationale for the score based on evidence in the resume",
    "disclaimer": "This is an AI-generated guidance estimate based strictly on supplied text, not an actual hiring decision or employment guarantee."
  }
}`;

  return await generateStructuredAI<ResumeAnalysisOutput>({
    systemInstruction,
    prompt,
    schema: resumeAnalysisOutputSchema,
    schemaName: 'ResumeAnalysisOutput',
    temperature: 0.2,
  });
}
