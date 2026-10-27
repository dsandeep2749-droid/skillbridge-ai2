# SkillBridge AI — API Reference Documentation

All endpoints are versioned under `/api/v1`.

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data.",
    "details": [ ... ]
  }
}
```

---

## 1. System Endpoints

### `GET /api/v1/health`
Checks service health and integration status.
- **Auth:** Public
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "status": "healthy",
      "service": "SkillBridge AI API",
      "version": "1.0.0",
      "environment": "development",
      "integrations": {
        "aiConfigured": true,
        "model": "gemini-2.5-flash",
        "supabaseConfigured": true
      }
    }
  }
  ```

---

## 2. Profile Endpoints

### `GET /api/v1/profile`
Retrieves the authenticated user's profile.
- **Auth:** Required (`Bearer <token>`)

### `PUT /api/v1/profile`
Updates candidate profile, target career track, and study availability.
- **Auth:** Required
- **Body:**
  ```json
  {
    "fullName": "Alex Chen",
    "educationLevel": "Bachelor of Science",
    "studyYear": "Senior (Final Year)",
    "experienceLevel": "Entry-Level",
    "currentSkills": ["JavaScript", "React", "Node.js"],
    "targetRole": "Full-Stack Developer",
    "careerGoal": "Land a junior developer role in 3 months",
    "weeklyStudyHours": 15,
    "learningStyle": "Hands-on Projects & Building",
    "targetTimeline": "3 Months"
  }
  ```

---

## 3. Resume Analysis Endpoints

### `POST /api/v1/resumes/analyze`
Uploads a resume file (multipart/form-data) and runs AI-powered critique and alignment estimation.
- **Auth:** Required
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `resume`: Binary file (.pdf, .docx, max 5MB)
  - `targetRole`: String (required)
  - `jobDescription`: String (optional)

### `GET /api/v1/resumes`
Retrieves all saved resume analysis records for the authenticated user.

### `GET /api/v1/resumes/:id`
Retrieves a specific resume analysis record.

### `DELETE /api/v1/resumes/:id`
Deletes a specific resume analysis record.

---

## 4. Skill Gap Endpoints

### `POST /api/v1/skill-gap/analyze`
Benchmarks provided skills against a target role and optional job description.
- **Auth:** Required
- **Body:**
  ```json
  {
    "targetRole": "Full-Stack Developer",
    "currentSkills": ["React", "HTML", "CSS", "Git"],
    "jobDescription": "Optional job description..."
  }
  ```

### `GET /api/v1/skill-gap`
Lists previous skill gap reports for the user.

### `GET /api/v1/skill-gap/:id`
Fetches a single skill gap report.

### `DELETE /api/v1/skill-gap/:id`
Deletes a skill gap report.

---

## 5. Learning Roadmap Endpoints

### `POST /api/v1/roadmaps/generate`
Generates a customized chronological study curriculum.
- **Auth:** Required
- **Body:**
  ```json
  {
    "targetRole": "Full-Stack Developer",
    "currentSkills": ["JavaScript", "React"],
    "missingSkills": ["PostgreSQL", "Docker"],
    "weeklyStudyHours": 15,
    "targetTimeline": "12 Weeks",
    "learningStyle": "Hands-on Projects"
  }
  ```

### `GET /api/v1/roadmaps`
Retrieves all user roadmaps with real-time calculated completion percentages.

### `PATCH /api/v1/roadmaps/:roadmapId/tasks/:taskId`
Marks a specific task complete or incomplete.
- **Body:** `{ "completed": true }`
- **Response:** Updated task and recalculated overall roadmap progress percentage.

### `DELETE /api/v1/roadmaps/:id`
Deletes a roadmap and cascades to its tasks.

---

## 6. AI Mock Interview Endpoints

### `POST /api/v1/interviews/generate`
Generates role-specific technical and behavioral questions.
- **Auth:** Required
- **Body:**
  ```json
  {
    "targetRole": "Frontend Developer",
    "experienceLevel": "Entry-Level",
    "interviewType": "mixed",
    "difficulty": "intermediate",
    "numberOfQuestions": 4,
    "focusTopics": ["React", "State Management", "STAR conflict"]
  }
  ```

### `POST /api/v1/interviews/:id/answer`
Submits text answer for a specific question with time spent.

### `POST /api/v1/interviews/:id/evaluate`
Generates comprehensive AI hiring committee evaluation with scores, strengths, weaknesses, and exemplary model answers.

### `GET /api/v1/interviews`
Lists all interview sessions for the user.

### `DELETE /api/v1/interviews/:id`
Deletes an interview session transcript.
