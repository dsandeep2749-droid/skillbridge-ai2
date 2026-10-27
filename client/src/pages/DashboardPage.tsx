import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Skeleton } from '../components/common/Skeleton.js';
import {
  FileText,
  GitPullRequest,
  MapPin,
  Bot,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Plus,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Queries for real user data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(),
  });

  const { data: resumes, isLoading: resumesLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => api.getResumes(),
  });

  const { data: skillGaps, isLoading: skillGapsLoading } = useQuery({
    queryKey: ['skillGaps'],
    queryFn: () => api.getSkillGapReports(),
  });

  const { data: roadmaps, isLoading: roadmapsLoading } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: () => api.getRoadmaps(),
  });

  const { data: interviews, isLoading: interviewsLoading } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => api.getInterviewSessions(),
  });

  const isLoading =
    profileLoading || resumesLoading || skillGapsLoading || roadmapsLoading || interviewsLoading;

  const targetRole = profile?.target_role || 'Full-Stack Developer';
  const latestResume = resumes && resumes.length > 0 ? resumes[0] : null;
  const latestSkillGap = skillGaps && skillGaps.length > 0 ? skillGaps[0] : null;
  const activeRoadmap = roadmaps && roadmaps.length > 0 ? roadmaps[0] : null;
  const recentInterviews = interviews || [];

  // Calculate real progress
  const roadmapProgress = activeRoadmap ? activeRoadmap.progressPercentage : 0;
  const completedTasksCount = activeRoadmap
    ? activeRoadmap.tasks.filter((t: any) => t.completed).length
    : 0;
  const totalTasksCount = activeRoadmap ? activeRoadmap.tasks.length : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#11182B] via-[#162038] to-[#1E1B4B]/40 border border-[#1E293B] shadow-card relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 text-xs font-semibold text-[#A78BFA]">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Target Career Track</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.full_name || 'Alex'}!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Preparing for <strong className="text-white">{targetRole}</strong>. Discover missing competencies, complete daily roadmap tasks, and run practice interviews.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/resume-analyzer">
              <Button size="sm" variant="secondary" leftIcon={<FileText className="w-4 h-4" />}>
                Analyze Resume
              </Button>
            </Link>
            <Link to="/mock-interview">
              <Button size="sm" className="glow-btn" leftIcon={<Bot className="w-4 h-4" />}>
                Practice Interview
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Roadmap Progress */}
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Roadmap Progress</span>
            <MapPin className="w-4 h-4 text-[#7C5CFC]" />
          </div>
          {activeRoadmap ? (
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">{roadmapProgress}%</p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#38BDF8] to-[#7C5CFC] h-full rounded-full"
                  style={{ width: `${roadmapProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {completedTasksCount} of {totalTasksCount} tasks verified
              </p>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <p className="text-sm text-slate-400 italic">No active roadmap</p>
              <Link to="/roadmap" className="text-xs text-[#A78BFA] hover:underline font-medium flex items-center gap-1">
                Generate plan <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </Card>

        {/* Metric 2: Resume Alignment */}
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Resume Alignment</span>
            <FileText className="w-4 h-4 text-[#38BDF8]" />
          </div>
          {latestResume ? (
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-white">
                  {latestResume.analysis_result?.alignmentEstimate?.scoreOutOf100 || 0}
                </p>
                <span className="text-xs text-slate-400">/100</span>
              </div>
              <Badge variant="info" size="sm">
                {latestResume.analysis_result?.alignmentEstimate?.matchTier || 'Analyzed'}
              </Badge>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <p className="text-sm text-slate-400 italic">Resume not analyzed yet</p>
              <Link to="/resume-analyzer" className="text-xs text-[#A78BFA] hover:underline font-medium flex items-center gap-1">
                Upload resume <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </Card>

        {/* Metric 3: Skills Discovered */}
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Demonstrated Skills</span>
            <GitPullRequest className="w-4 h-4 text-emerald-400" />
          </div>
          {latestSkillGap ? (
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">
                {latestSkillGap.analysis_result?.skillsOverview?.demonstratedCount || 0}
              </p>
              <p className="text-[11px] text-slate-400">
                {latestSkillGap.analysis_result?.skillsOverview?.missingCount || 0} gap(s) to bridge
              </p>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <p className="text-sm text-slate-400 italic">Run skill gap analysis</p>
              <Link to="/skill-gap" className="text-xs text-[#A78BFA] hover:underline font-medium flex items-center gap-1">
                Start analysis <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </Card>

        {/* Metric 4: Mock Interviews */}
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Practice Sessions</span>
            <Bot className="w-4 h-4 text-amber-400" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">{recentInterviews.length}</p>
            <p className="text-[11px] text-slate-400">
              {recentInterviews.filter((i) => i.completed_at).length} completed sessions
            </p>
          </div>
        </Card>
      </div>

      {/* Main Grid: Roadmap Preview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Roadmap Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Active Roadmap Tasks</h2>
              <p className="text-xs text-slate-400">Real progress tracked against your target role</p>
            </div>
            <Link to="/roadmap">
              <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Full Plan
              </Button>
            </Link>
          </div>

          {activeRoadmap && activeRoadmap.tasks.length > 0 ? (
            <div className="space-y-3">
              {activeRoadmap.tasks.slice(0, 5).map((task: any) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-[#11182B] border border-[#1E293B] hover:border-slate-700 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] text-[#A78BFA] font-medium">{task.phase}</span>
                    <h4 className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{task.description}</p>
                  </div>
                  <Badge variant={task.completed ? 'demonstrated' : 'important'} size="sm">
                    {task.completed ? 'Completed' : `${task.estimated_hours} hrs`}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#7C5CFC]/10 border border-[#7C5CFC]/30 text-[#A78BFA] flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-white">No Learning Roadmap Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Create a customized week-by-week curriculum based on your target role and study availability.
                </p>
              </div>
              <Link to="/roadmap">
                <Button className="glow-btn" leftIcon={<Plus className="w-4 h-4" />}>
                  Generate Personalized Roadmap
                </Button>
              </Link>
            </Card>
          )}

          {/* Recent Resume Analyses */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Recent Resume Analyses</h2>
              <Link to="/resume-analyzer">
                <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Upload New
                </Button>
              </Link>
            </div>

            {resumes && resumes.length > 0 ? (
              <div className="space-y-3">
                {resumes.slice(0, 3).map((resRecord) => (
                  <div
                    key={resRecord.id}
                    className="p-4 rounded-xl bg-[#11182B] border border-[#1E293B] flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">{resRecord.resume_filename}</p>
                      <p className="text-xs text-slate-400">
                        Analyzed for: <span className="text-slate-200">{resRecord.target_role}</span> • {new Date(resRecord.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="info">
                      Score: {resRecord.analysis_result?.alignmentEstimate?.scoreOutOf100 || 0}/100
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#11182B]/60 border border-[#1E293B] text-center text-xs text-slate-400">
                No resumes analyzed yet. Upload your resume to extract demonstrable skills and benchmark alignment.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Skill Gaps & Practice Sessions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Priority Skill Gaps</h2>
            <Link to="/skill-gap">
              <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Details
              </Button>
            </Link>
          </div>

          {latestSkillGap && latestSkillGap.analysis_result?.skillAssessments ? (
            <Card className="space-y-3 p-4">
              <p className="text-xs text-slate-400 pb-2 border-b border-[#1E293B]">
                Focus areas for <strong className="text-white">{latestSkillGap.target_role}</strong>:
              </p>
              <div className="space-y-2.5">
                {latestSkillGap.analysis_result.skillAssessments
                  .filter((s: any) => s.status !== 'Demonstrated')
                  .slice(0, 4)
                  .map((skillItem: any) => (
                    <div key={skillItem.skill} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">{skillItem.skill}</span>
                        <Badge
                          variant={skillItem.status === 'Partially demonstrated' ? 'partial' : 'missing'}
                          size="sm"
                        >
                          {skillItem.priority}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{skillItem.importanceExplanation}</p>
                    </div>
                  ))}
              </div>
            </Card>
          ) : (
            <Card className="text-center py-8 space-y-3">
              <GitPullRequest className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                Run a skill gap analysis to identify missing production capabilities.
              </p>
              <Link to="/skill-gap">
                <Button size="sm" variant="secondary">
                  Start Gap Analysis
                </Button>
              </Link>
            </Card>
          )}

          {/* Quick Mock Interview Launcher */}
          <Card className="p-6 space-y-4 bg-gradient-to-b from-[#11182B] to-[#7C5CFC]/10 border-[#7C5CFC]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/20 border border-[#7C5CFC]/40 text-[#A78BFA] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Mock Interview Drill</h3>
                <p className="text-xs text-slate-400">Test your readiness with AI interviewers</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate role-tailored technical and STAR behavioral scenarios with instant evaluation and model answers.
            </p>
            <Link to="/mock-interview" className="block">
              <Button className="w-full glow-btn" size="sm">
                Launch Practice Session
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
