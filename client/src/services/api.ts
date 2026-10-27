import {
  UserProfile,
  UpdateProfilePayload,
  ResumeAnalysisRecord,
  SkillGapReportRecord,
  RoadmapRecord,
  InterviewSessionRecord,
} from '../types/index.js';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('skillbridge_auth_token') || 'demo-token';
  const storedUser = localStorage.getItem('skillbridge_user');
  let userId = '00000000-0000-0000-0000-000000000001';
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.id) userId = parsed.id;
    } catch {}
  }
  return {
    Authorization: `Bearer ${token}`,
    'x-demo-user': 'true',
    'x-user-id': userId,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data?.error?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse<any>(res);
  },

  // Profile
  async getProfile(): Promise<UserProfile | null> {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: getAuthHeader(),
    });
    return handleResponse<UserProfile | null>(res);
  },

  async updateProfile(profileData: UpdateProfilePayload): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(profileData),
    });
    return handleResponse<UserProfile>(res);
  },

  // Resumes
  async analyzeResume(formData: FormData): Promise<{ id: string; targetRole: string; analysis: any }> {
    const res = await fetch(`${API_BASE}/resumes/analyze`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });
    return handleResponse<{ id: string; targetRole: string; analysis: any }>(res);
  },

  async getResumes(): Promise<ResumeAnalysisRecord[]> {
    const res = await fetch(`${API_BASE}/resumes`, {
      headers: getAuthHeader(),
    });
    return handleResponse<ResumeAnalysisRecord[]>(res);
  },

  async getResumeById(id: string): Promise<ResumeAnalysisRecord> {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<ResumeAnalysisRecord>(res);
  },

  async deleteResume(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<void>(res);
  },

  // Skill Gap
  async analyzeSkillGap(payload: { targetRole: string; currentSkills: string[]; jobDescription?: string }) {
    const res = await fetch(`${API_BASE}/skill-gap/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<{ id: string; targetRole: string; analysis: any }>(res);
  },

  async getSkillGapReports(): Promise<SkillGapReportRecord[]> {
    const res = await fetch(`${API_BASE}/skill-gap`, {
      headers: getAuthHeader(),
    });
    return handleResponse<SkillGapReportRecord[]>(res);
  },

  async getSkillGapReportById(id: string): Promise<SkillGapReportRecord> {
    const res = await fetch(`${API_BASE}/skill-gap/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<SkillGapReportRecord>(res);
  },

  async deleteSkillGapReport(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/skill-gap/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<void>(res);
  },

  // Roadmaps
  async generateRoadmap(payload: {
    targetRole: string;
    currentSkills: string[];
    missingSkills?: string[];
    weeklyStudyHours?: number;
    targetTimeline?: string;
    learningStyle?: string;
  }): Promise<RoadmapRecord> {
    const res = await fetch(`${API_BASE}/roadmaps/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<RoadmapRecord>(res);
  },

  async getRoadmaps(): Promise<RoadmapRecord[]> {
    const res = await fetch(`${API_BASE}/roadmaps`, {
      headers: getAuthHeader(),
    });
    return handleResponse<RoadmapRecord[]>(res);
  },

  async getRoadmapById(id: string): Promise<RoadmapRecord> {
    const res = await fetch(`${API_BASE}/roadmaps/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<RoadmapRecord>(res);
  },

  async deleteRoadmap(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/roadmaps/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<void>(res);
  },

  async updateRoadmapTask(roadmapId: string, taskId: string, completed: boolean) {
    const res = await fetch(`${API_BASE}/roadmaps/${roadmapId}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ completed }),
    });
    return handleResponse<{ task: any; progressPercentage: number; completedCount: number; totalCount: number }>(res);
  },

  // Mock Interviews
  async generateInterview(payload: {
    targetRole: string;
    experienceLevel: string;
    interviewType: string;
    difficulty: string;
    numberOfQuestions: number;
    focusTopics?: string[];
  }): Promise<InterviewSessionRecord> {
    const res = await fetch(`${API_BASE}/interviews/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<InterviewSessionRecord>(res);
  },

  async submitInterviewAnswer(
    sessionId: string,
    payload: { questionId: string; answerText: string; skipped?: boolean; timeSpentSeconds?: number }
  ) {
    const res = await fetch(`${API_BASE}/interviews/${sessionId}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<InterviewSessionRecord>(res);
  },

  async evaluateInterview(sessionId: string): Promise<InterviewSessionRecord> {
    const res = await fetch(`${API_BASE}/interviews/${sessionId}/evaluate`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return handleResponse<InterviewSessionRecord>(res);
  },

  async getInterviewSessions(): Promise<InterviewSessionRecord[]> {
    const res = await fetch(`${API_BASE}/interviews`, {
      headers: getAuthHeader(),
    });
    return handleResponse<InterviewSessionRecord[]>(res);
  },

  async getInterviewSessionById(id: string): Promise<InterviewSessionRecord> {
    const res = await fetch(`${API_BASE}/interviews/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<InterviewSessionRecord>(res);
  },

  async deleteInterviewSession(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/interviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<void>(res);
  },
};
