import { generateStructuredAI } from './aiProvider.js';
import { roadmapDataSchema, RoadmapData } from '../schemas/roadmap.schema.js';

export interface RoadmapGenerationInput {
  targetRole: string;
  currentSkills: string[];
  missingSkills?: string[];
  weeklyStudyHours: number;
  targetTimeline?: string;
  learningStyle?: string;
}

export async function generateRoadmapWithAI(
  input: RoadmapGenerationInput
): Promise<RoadmapData> {
  const {
    targetRole,
    currentSkills,
    missingSkills = [],
    weeklyStudyHours,
    targetTimeline = '12 Weeks',
    learningStyle = 'Project-based & Hands-on',
  } = input;

  const systemInstruction = `You are SkillBridge AI's lead curriculum architect and engineering mentor.
Design a highly structured, realistic, and actionable step-by-step career learning roadmap for a student/engineer targeting the role "${targetRole}".
The candidate can dedicate approximately ${weeklyStudyHours} hours/week over a target duration of ${targetTimeline}.
Their preferred learning style is "${learningStyle}".
Divide the roadmap into clear chronological phases (e.g., Phase 1: Core Fundamentals & Bridge, Phase 2: Architecture & Advanced Patterns, Phase 3: Production Projects & Portfolio, Phase 4: Interview Prep & Mock Challenges).
In each phase, provide specific actionable tasks with estimated hours, practical exercises, completion criteria, and search terms.
Include tangible milestone projects that can be added to their GitHub portfolio.
Be realistic about time constraints; do NOT create impossible expectations.`;

  const prompt = `TARGET ROLE: ${targetRole}
AVAILABLE STUDY HOURS PER WEEK: ${weeklyStudyHours} hours
TARGET TIMELINE: ${targetTimeline}
PREFERRED LEARNING STYLE: ${learningStyle}

CANDIDATE CURRENT SKILLS:
${currentSkills.length > 0 ? currentSkills.map((s) => `- ${s}`).join('\n') : 'Entry-level beginner'}

HIGH PRIORITY GAPS / MISSING SKILLS TO COVER:
${missingSkills.length > 0 ? missingSkills.map((s) => `- ${s}`).join('\n') : 'Cover industry-standard gaps for this role'}

Generate a structured JSON response matching the following schema:
{
  "title": "Roadmap Title",
  "targetRole": "${targetRole}",
  "summary": "High-level strategy and vision for this roadmap",
  "totalEstimatedHours": 120,
  "targetTimeline": "${targetTimeline}",
  "assumptions": [
    "Dedication of ~${weeklyStudyHours} hours weekly",
    "Basic computer literacy and programming setup"
  ],
  "phases": [
    {
      "phaseNumber": 1,
      "phaseTitle": "Phase title",
      "description": "Overview of what this phase achieves",
      "estimatedWeeks": 3,
      "weeklyPlan": [
        {
          "weekNumber": 1,
          "focus": "Weekly focus topic",
          "goals": ["Goal 1", "Goal 2"]
        }
      ],
      "tasks": [
        {
          "title": "Task title",
          "description": "Clear step-by-step guidance",
          "estimatedHours": 4,
          "skillOrTopic": "Topic Name",
          "practicalExercise": "What specifically to build or code",
          "completionCriteria": "Verifiable definition of done",
          "recommendedSearchTerms": ["Search term 1", "Search term 2"]
        }
      ],
      "projectMilestone": {
        "title": "Milestone Project Name",
        "description": "Comprehensive project bringing together this phase's skills",
        "deliverables": ["Deliverable 1", "Deliverable 2"]
      }
    }
  ],
  "disclaimer": "This roadmap represents an estimated study plan based on current market patterns and does not guarantee job placement or compensation."
}`;

  return await generateStructuredAI<RoadmapData>({
    systemInstruction,
    prompt,
    schema: roadmapDataSchema,
    schemaName: 'RoadmapData',
    temperature: 0.3,
  });
}
