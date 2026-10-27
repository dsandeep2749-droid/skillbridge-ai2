import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { Select } from '../components/common/Select.js';
import { Textarea } from '../components/common/Textarea.js';
import { Badge } from '../components/common/Badge.js';
import { Modal } from '../components/common/Modal.js';
import {
  Bot,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  SkipForward,
  RotateCcw,
  Trash2,
  Award,
  BookOpen,
  ShieldAlert,
} from 'lucide-react';
import { InterviewSessionRecord } from '../types/index.js';

export const MockInterviewPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Mode: 'configure' | 'active' | 'report'
  const [sessionMode, setSessionMode] = useState<'configure' | 'active' | 'report'>('configure');

  // Configuration state
  const [targetRole, setTargetRole] = useState('Full-Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState('Entry-Level');
  const [interviewType, setInterviewType] = useState<'technical' | 'behavioral' | 'mixed'>('mixed');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [numQuestions, setNumQuestions] = useState(4);
  const [focusTopics, setFocusTopics] = useState('React, REST APIs, System Design, STAR teamwork');

  // Active session state
  const [activeSession, setActiveSession] = useState<InterviewSessionRecord | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [actionError, setActionError] = useState('');

  // Fetch previous sessions
  const { data: previousSessions } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => api.getInterviewSessions(),
  });

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && sessionMode === 'active') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, sessionMode]);

  // Generate mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      const topics = focusTopics.split(',').map((t) => t.trim()).filter(Boolean);
      return await api.generateInterview({
        targetRole,
        experienceLevel,
        interviewType,
        difficulty,
        numberOfQuestions: numQuestions,
        focusTopics: topics,
      });
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      setActiveSession(newSession);
      setCurrentQuestionIndex(0);
      setAnswerText('');
      setTimerSeconds(0);
      setIsTimerRunning(true);
      setSessionMode('active');
      setActionError('');
    },
    onError: (err: any) => {
      setActionError(err.message || 'Failed to generate interview questions.');
    },
  });

  // Submit Answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async ({ skipped }: { skipped: boolean }) => {
      if (!activeSession) return;
      const currentQ = activeSession.questions_and_answers[currentQuestionIndex];
      return await api.submitInterviewAnswer(activeSession.id, {
        questionId: currentQ.questionId,
        answerText: skipped ? '' : answerText,
        skipped,
        timeSpentSeconds: timerSeconds,
      });
    },
    onSuccess: (updatedSession) => {
      if (updatedSession) {
        setActiveSession(updatedSession);
      }
      setAnswerText('');
      setTimerSeconds(0);

      // If next question exists, advance; otherwise trigger evaluation
      if (activeSession && currentQuestionIndex < activeSession.questions_and_answers.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // All answered! Evaluate!
        setIsTimerRunning(false);
        if (activeSession) {
          evaluateMutation.mutate(activeSession.id);
        }
      }
    },
    onError: (err: any) => {
      setActionError(err.message || 'Failed to submit answer.');
    },
  });

  // Evaluate Interview Mutation
  const evaluateMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return await api.evaluateInterview(sessionId);
    },
    onSuccess: (evaluatedSession) => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      setActiveSession(evaluatedSession);
      setSessionMode('report');
    },
    onError: (err: any) => {
      setActionError(err.message || 'Failed to evaluate interview responses.');
    },
  });

  // Delete session
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.deleteInterviewSession(id);
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      if (activeSession?.id === deletedId) {
        setActiveSession(null);
        setSessionMode('configure');
      }
    },
  });

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const currentQ = activeSession?.questions_and_answers[currentQuestionIndex];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 text-xs font-semibold text-[#A78BFA]">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Interactive Interview Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Mock Technical & Behavioral Interview
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Practice realistic role-specific interview challenges, submit text responses with an optional timer, and receive granular scoring rubrics.
          </p>
        </div>

        {sessionMode !== 'configure' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSessionMode('configure')}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            New Session
          </Button>
        )}
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* MODE 1: Configuration Form */}
      {sessionMode === 'configure' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Card className="space-y-5 p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#38BDF8]" />
                Configure Interview Parameters
              </h2>

              <div className="space-y-4">
                <Input
                  label="Target Job Role"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer, Cloud Architect"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Experience Level"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    options={[
                      { value: 'Student / Intern', label: 'Student / Intern' },
                      { value: 'Entry-Level', label: 'Entry-Level' },
                      { value: 'Mid-Level', label: 'Mid-Level' },
                      { value: 'Senior', label: 'Senior' },
                    ]}
                  />

                  <Select
                    label="Interview Type"
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value as any)}
                    options={[
                      { value: 'mixed', label: 'Mixed (Technical + Behavioral)' },
                      { value: 'technical', label: 'Technical & Architecture Only' },
                      { value: 'behavioral', label: 'Behavioral & STAR Only' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Difficulty Bar"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    options={[
                      { value: 'beginner', label: 'Beginner (Fundamentals)' },
                      { value: 'intermediate', label: 'Intermediate (Production)' },
                      { value: 'advanced', label: 'Advanced (Scale & Tradeoffs)' },
                    ]}
                  />

                  <Select
                    label="Number of Questions"
                    value={numQuestions.toString()}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
                    options={[
                      { value: '3', label: '3 Questions (Quick Drill ~10 min)' },
                      { value: '4', label: '4 Questions (Standard ~15 min)' },
                      { value: '6', label: '6 Questions (Full Interview ~25 min)' },
                    ]}
                  />
                </div>

                <Input
                  label="Focus Topics (Comma separated)"
                  value={focusTopics}
                  onChange={(e) => setFocusTopics(e.target.value)}
                  placeholder="e.g. React hooks, SQL optimization, Docker, team conflict"
                />

                <Button
                  className="w-full glow-btn mt-2"
                  onClick={() => generateMutation.mutate()}
                  isLoading={generateMutation.isPending}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  {generateMutation.isPending ? 'Generating Interview Drill...' : 'Start Mock Interview Drill'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Previous Sessions List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Completed Practice Sessions ({previousSessions?.length || 0})
            </h3>
            {previousSessions && previousSessions.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {previousSessions.map((sess) => (
                  <Card
                    key={sess.id}
                    className="p-4 hover:border-[#7C5CFC]/40 cursor-pointer transition-all space-y-2"
                    onClick={() => {
                      setActiveSession(sess);
                      setSessionMode(sess.evaluation_result ? 'report' : 'active');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{sess.target_role}</span>
                      {sess.evaluation_result ? (
                        <Badge variant="demonstrated" size="sm">
                          Score: {sess.evaluation_result.overallScoreOutOf100}/100
                        </Badge>
                      ) : (
                        <Badge variant="important" size="sm">Incomplete</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{sess.interview_type} • {sess.difficulty}</span>
                      <span>{new Date(sess.created_at).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No previous interview records.</p>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: Active Interview Question & Text Answer */}
      {sessionMode === 'active' && evaluateMutation.isPending && (
        <Card className="max-w-3xl mx-auto text-center py-16 space-y-4">
          <div className="w-12 h-12 border-4 border-[#7C5CFC] border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-white">Synthesizing Hiring Committee Evaluation...</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Analyzing technical accuracy, communication structure, and generating benchmark model answers with Google Gemini.
          </p>
        </Card>
      )}

      {sessionMode === 'active' && !evaluateMutation.isPending && currentQ && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">
                Question {currentQuestionIndex + 1} of {activeSession?.questions_and_answers.length}
              </span>
              <Badge variant="info" size="sm">{currentQ.category}</Badge>
            </div>

            <div className="flex items-center gap-2 text-white font-mono bg-[#11182B] px-3 py-1 rounded-lg border border-[#1E293B]">
              <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
          </div>

          {/* Question Card */}
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-white leading-relaxed">
              {currentQ.questionText}
            </h3>

            {currentQ.hints && currentQ.hints.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">💡 Hint: </span>
                {currentQ.hints.join(' • ')}
              </div>
            )}
          </Card>

          {/* Answer Input */}
          <Card className="p-6 space-y-4">
            <Textarea
              label="Your Response (Be as specific as you would in a real interview)"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Structure your answer clearly. Explain trade-offs, architecture decisions, or STAR scenario context..."
              rows={8}
            />

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => submitAnswerMutation.mutate({ skipped: true })}
                isLoading={submitAnswerMutation.isPending}
                leftIcon={<SkipForward className="w-4 h-4" />}
              >
                Skip Question
              </Button>

              <Button
                type="button"
                className="glow-btn"
                onClick={() => submitAnswerMutation.mutate({ skipped: false })}
                isLoading={submitAnswerMutation.isPending || evaluateMutation.isPending}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {currentQuestionIndex < (activeSession?.questions_and_answers.length || 0) - 1
                  ? 'Submit & Next Question'
                  : 'Submit & Complete Session'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODE 3: Detailed Feedback Report */}
      {sessionMode === 'report' && activeSession?.evaluation_result && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
          {/* Executive Score Card */}
          <Card className="p-8 bg-gradient-to-r from-[#11182B] via-[#162038] to-[#1E1B4B]/30 border-[#7C5CFC]/40 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#1E293B]">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
                  Interview Evaluation Report
                </span>
                <h2 className="text-2xl font-black text-white">
                  Performance: {activeSession.evaluation_result.performanceLevel}
                </h2>
                <p className="text-xs text-slate-300">
                  Target Role: <strong className="text-white">{activeSession.target_role}</strong>
                </p>
              </div>

              <div className="bg-[#0B1020] px-6 py-4 rounded-2xl border border-[#1E293B] flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#38BDF8]">
                  {activeSession.evaluation_result.overallScoreOutOf100}
                </span>
                <span className="text-sm text-slate-400">/100</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeSession.evaluation_result.executiveSummary}
            </p>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>{activeSession.evaluation_result.disclaimer}</span>
            </div>
          </Card>

          {/* Strengths & Priority Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="space-y-3 border-emerald-500/20">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeSession.evaluation_result.keyStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-3 border-rose-500/20">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Priority Areas to Improve
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeSession.evaluation_result.priorityAreasToImprove.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Question-by-Question Detailed Feedback */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider text-slate-300">
              Detailed Question Feedback ({activeSession.evaluation_result.detailedFeedback.length})
            </h3>

            <div className="space-y-4">
              {activeSession.evaluation_result.detailedFeedback.map((fb, idx) => (
                <Card key={fb.questionId} className="p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                    <span className="text-xs font-bold text-white">Question {idx + 1}</span>
                    <Badge variant={fb.scoreOutOf10 >= 7 ? 'demonstrated' : fb.scoreOutOf10 >= 4 ? 'partial' : 'missing'}>
                      Score: {fb.scoreOutOf10}/10
                    </Badge>
                  </div>

                  <p className="text-sm font-semibold text-slate-100">{fb.questionText}</p>

                  <div className="p-3 rounded-xl bg-[#0B1020] border border-[#1E293B] space-y-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Your Answer</p>
                    <p className="text-xs text-slate-300">
                      {fb.skipped ? '[Question was skipped by candidate]' : fb.userAnswer || '[No response provided]'}
                    </p>
                  </div>

                  {/* Benchmark Model Answer */}
                  <div className="p-4 rounded-xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/30 space-y-1.5">
                    <p className="text-xs font-bold text-[#A78BFA] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" /> Benchmark Exemplary Answer
                    </p>
                    <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                      {fb.suggestedImprovedAnswer}
                    </p>
                  </div>

                  {/* Follow-up probe & Topics */}
                  {fb.followUpTip && (
                    <p className="text-xs text-slate-400">
                      <strong className="text-slate-300">Follow-up Probe: </strong> {fb.followUpTip}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
