export interface UserProfile {
  id: string;
  full_name: string;
  education_level: string;
  study_year?: string;
  experience_level: string;
  current_skills: string[];
  target_role: string;
  career_goal?: string;
  weekly_study_hours: number;
  learning_style?: string;
  target_timeline?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  educationLevel: string;
  studyYear?: string;
  experienceLevel: string;
  currentSkills: string[];
  targetRole: string;
  careerGoal?: string;
  weeklyStudyHours: number;
  learningStyle?: string;
  targetTimeline?: string;
}

export interface ResumeSectionReview {
  sectionName: string;
  status: 'strong' | 'adequate' | 'needs_improvement' | 'missing';
  feedback: string;
  recommendations: string[];
}

export interface ResumeAnalysisOutput {
  summary: string;
  extractedSkills: string[];
  strengths: string[];
  missingOrWeakAreas: string[];
  sectionReviews: ResumeSectionReview[];
  suggestedImprovements: string[];
  suggestedKeywords: string[];
  alignmentEstimate: {
    scoreOutOf100: number;
    matchTier: 'High Alignment' | 'Moderate Alignment' | 'Developing Alignment' | 'Low Alignment';
    explanation: string;
    disclaimer: string;
  };
}

export interface ResumeAnalysisRecord {
  id: string;
  user_id: string;
  resume_filename: string;
  target_role: string;
  job_description?: string;
  extracted_skills: string[];
  analysis_result: ResumeAnalysisOutput;
  created_at: string;
}

export interface SkillAssessment {
  skill: string;
  status: 'Demonstrated' | 'Partially demonstrated' | 'Not demonstrated in the supplied evidence';
  priority: 'Critical' | 'Important' | 'Nice-to-have';
  evidence: string;
  importanceExplanation: string;
  recommendedSearchTerms: string[];
  practicalProjectIdea: string;
}

export interface SkillGapAnalysisOutput {
  targetRole: string;
  executiveSummary: string;
  skillsOverview: {
    demonstratedCount: number;
    partiallyDemonstratedCount: number;
    missingCount: number;
  };
  skillAssessments: SkillAssessment[];
  suggestedLearningSequence: string[];
  disclaimer: string;
}

export interface SkillGapReportRecord {
  id: string;
  user_id: string;
  target_role: string;
  job_description?: string;
  analysis_result: SkillGapAnalysisOutput;
  created_at: string;
}

export interface RoadmapTask {
  id?: string;
  title: string;
  description: string;
  estimatedHours: number;
  skillOrTopic: string;
  practicalExercise: string;
  completionCriteria: string;
  recommendedSearchTerms: string[];
  completed?: boolean;
  completed_at?: string;
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseTitle: string;
  description: string;
  estimatedWeeks: number;
  weeklyPlan: {
    weekNumber: number;
    focus: string;
    goals: string[];
  }[];
  tasks: RoadmapTask[];
  projectMilestone: {
    title: string;
    description: string;
    deliverables: string[];
  };
}

export interface RoadmapData {
  title: string;
  targetRole: string;
  summary: string;
  totalEstimatedHours: number;
  targetTimeline: string;
  phases: RoadmapPhase[];
  assumptions: string[];
  disclaimer: string;
}

export interface RoadmapTaskRecord {
  id: string;
  roadmap_id: string;
  user_id: string;
  phase: string;
  title: string;
  description: string;
  estimated_hours: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface RoadmapRecord {
  id: string;
  user_id: string;
  title: string;
  target_role: string;
  roadmap_data: RoadmapData;
  tasks: RoadmapTaskRecord[];
  progressPercentage: number;
  created_at: string;
  updated_at: string;
}

export interface InterviewQuestionItem {
  questionId: string;
  questionNumber: number;
  category: string;
  difficulty: string;
  questionText: string;
  hints?: string[];
  recommendedTimeMinutes: number;
  userAnswer?: string;
  skipped?: boolean;
  answeredAt?: string;
  timeSpentSeconds?: number;
}

export interface QuestionFeedback {
  questionId: string;
  questionText: string;
  userAnswer: string;
  skipped: boolean;
  scoreOutOf10: number;
  strengths: string[];
  weaknesses: string[];
  suggestedImprovedAnswer: string;
  followUpTip: string;
  recommendedTopics: string[];
}

export interface InterviewEvaluationOutput {
  overallScoreOutOf100: number;
  performanceLevel: 'Exceptional' | 'Strong' | 'Developing' | 'Needs Practice';
  executiveSummary: string;
  technicalAccuracyEvaluation: string;
  communicationAndStructureEvaluation: string;
  keyStrengths: string[];
  priorityAreasToImprove: string[];
  detailedFeedback: QuestionFeedback[];
  nextStepRecommendations: string[];
  disclaimer: string;
}

export interface InterviewSessionRecord {
  id: string;
  user_id: string;
  target_role: string;
  interview_type: string;
  difficulty: string;
  questions_and_answers: InterviewQuestionItem[];
  evaluation_result: InterviewEvaluationOutput | null;
  created_at: string;
  completed_at: string | null;
}
