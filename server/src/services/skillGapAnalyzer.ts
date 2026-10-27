import { generateStructuredAI } from './aiProvider.js';
import { skillGapAnalysisOutputSchema, SkillGapAnalysisOutput } from '../schemas/skillGap.schema.js';

export async function analyzeSkillGapWithAI(
  targetRole: string,
  currentSkills: string[],
  jobDescription?: string
): Promise<SkillGapAnalysisOutput> {
  const sanitizedSkills = currentSkills.map((s) => s.trim()).filter(Boolean);
  const sanitizedJobDesc = jobDescription ? jobDescription.slice(0, 8000) : '';

  const systemInstruction = `You are SkillBridge AI's career gap intelligence engine.
Analyze the user's current demonstrated skills against the industry expectations and job requirements for "${targetRole}".
Categorize skills strictly into:
- "Demonstrated": Well-evidenced in candidate profile
- "Partially demonstrated": Some basic or adjacent knowledge, but lacks depth or production evidence
- "Not demonstrated in the supplied evidence": Missing from the provided data (do NOT say candidate completely lacks the skill, specify it was not demonstrated in supplied evidence)

Assign priorities (Critical, Important, Nice-to-have).
Explain why each skill matters in production.
Provide practical project ideas to prove each skill.
For learning resources, provide concise, highly effective search terms and official documentation topics (never invent broken URLs).
Sequence the recommended learning order logically from foundational to advanced.`;

  const prompt = `TARGET ROLE: ${targetRole}

CURRENT CANDIDATE SKILLS:
${sanitizedSkills.map((s) => `- ${s}`).join('\n')}

${sanitizedJobDesc ? `TARGET JOB DESCRIPTION:\n${sanitizedJobDesc}\n\n` : ''}

Generate a comprehensive skill gap analysis as a JSON object adhering to this schema:
{
  "targetRole": "${targetRole}",
  "executiveSummary": "...",
  "skillsOverview": {
    "demonstratedCount": 0,
    "partiallyDemonstratedCount": 0,
    "missingCount": 0
  },
  "skillAssessments": [
    {
      "skill": "Skill Name",
      "status": "Demonstrated" | "Partially demonstrated" | "Not demonstrated in the supplied evidence",
      "priority": "Critical" | "Important" | "Nice-to-have",
      "evidence": "Explanation of what evidence was or was not observed",
      "importanceExplanation": "Why this skill is crucial for ${targetRole}",
      "recommendedSearchTerms": ["Google search term 1", "Search term 2"],
      "practicalProjectIdea": "A concrete mini-project or feature to build to master this skill"
    }
  ],
  "suggestedLearningSequence": ["Skill 1", "Skill 2", ...],
  "disclaimer": "Skills categorized as 'Not demonstrated in the supplied evidence' means they were not evident in the provided input, not that you lack the capability."
}`;

  return await generateStructuredAI<SkillGapAnalysisOutput>({
    systemInstruction,
    prompt,
    schema: skillGapAnalysisOutputSchema,
    schemaName: 'SkillGapAnalysisOutput',
    temperature: 0.2,
  });
}
