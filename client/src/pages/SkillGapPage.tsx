import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { Textarea } from '../components/common/Textarea.js';
import { Badge } from '../components/common/Badge.js';
import {
  GitPullRequest,
  Sparkles,
  Plus,
  X,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Search,
  BookOpen,
  Code,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import { SkillGapReportRecord } from '../types/index.js';

export const SkillGapPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [targetRole, setTargetRole] = useState('Full-Stack Developer');
  const [jobDescription, setJobDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([
    'JavaScript',
    'React',
    'HTML',
    'CSS',
    'Git',
    'Node.js Basics',
  ]);
  const [skillInput, setSkillInput] = useState('');
  const [activeReport, setActiveReport] = useState<SkillGapReportRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch saved reports
  const { data: previousReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['skillGaps'],
    queryFn: () => api.getSkillGapReports(),
  });

  // Query profile for current skills
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(),
  });

  // Load skills from profile
  const handleLoadProfileSkills = () => {
    if (profile?.current_skills && profile.current_skills.length > 0) {
      setSkills(profile.current_skills);
      if (profile.target_role) setTargetRole(profile.target_role);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Mutation for running gap analysis
  const analyzeMutation = useMutation({
    mutationFn: async () => {
      return await api.analyzeSkillGap({
        targetRole: targetRole.trim(),
        currentSkills: skills,
        jobDescription: jobDescription.trim() || undefined,
      });
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ['skillGaps'] });
      setActiveReport(result);
      setErrorMessage('');
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Skill gap analysis failed. Please try again.');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.deleteSkillGapReport(id);
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['skillGaps'] });
      if (activeReport?.id === deletedId) {
        setActiveReport(null);
      }
    },
  });

  const currentAnalysis =
    activeReport?.analysis_result ||
    (previousReports && previousReports.length > 0
      ? previousReports[0].analysis_result
      : null);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 text-xs font-semibold text-[#A78BFA]">
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Capability Benchmarking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Skill Gap Intelligence Engine
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Compare your demonstrated competencies against market hiring standards. Discover critical missing technologies and practical projects to close the gaps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-[#7C5CFC]" />
              Configure Skill Benchmark
            </h2>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Target Job Role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Backend Developer"
                required
              />

              <Textarea
                label="Target Job Description (Optional)"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description from LinkedIn, Indeed, or company career page..."
                rows={3}
              />

              {/* Skills List Editor */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Your Current Skills ({skills.length})
                  </label>
                  {profile && (
                    <button
                      type="button"
                      onClick={handleLoadProfileSkills}
                      className="text-xs text-[#A78BFA] hover:text-white transition-colors"
                    >
                      Load from Profile
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a skill (e.g. Docker, Redis)"
                  />
                  <Button type="button" variant="secondary" onClick={handleAddSkill} leftIcon={<Plus className="w-4 h-4" />}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#0B1020] border border-[#1E293B] max-h-48 overflow-y-auto">
                  {skills.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No skills added yet.</span>
                  ) : (
                    skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-200 border border-slate-700"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s)}
                          className="hover:text-rose-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <Button
                type="button"
                className="w-full glow-btn"
                onClick={() => analyzeMutation.mutate()}
                isLoading={analyzeMutation.isPending}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                {analyzeMutation.isPending ? 'Benchmarking with Gemini...' : 'Analyze Skill Gaps'}
              </Button>
            </div>
          </Card>

          {/* Saved Reports */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Saved Gap Reports ({previousReports?.length || 0})
            </h3>
            {previousReports && previousReports.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {previousReports.map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => setActiveReport(rep)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      (activeReport?.id === rep.id) || (!activeReport && previousReports[0].id === rep.id)
                        ? 'bg-[#7C5CFC]/15 border-[#7C5CFC]/40'
                        : 'bg-[#11182B] border-[#1E293B] hover:border-slate-700'
                    }`}
                  >
                    <div className="overflow-hidden pr-2">
                      <p className="text-xs font-semibold text-white truncate">{rep.target_role}</p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(rep.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-rose-400">
                        {rep.analysis_result?.skillsOverview?.missingCount || 0} gaps
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this saved gap report?')) {
                            deleteMutation.mutate(rep.id);
                          }
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No saved reports yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Skill Assessments (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentAnalysis ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Overview Metrics Bar */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 text-center border-emerald-500/30 bg-emerald-500/5">
                  <p className="text-2xl font-black text-emerald-400">
                    {currentAnalysis.skillsOverview.demonstratedCount}
                  </p>
                  <p className="text-xs font-semibold text-slate-300 mt-1">Demonstrated</p>
                </Card>
                <Card className="p-4 text-center border-amber-500/30 bg-amber-500/5">
                  <p className="text-2xl font-black text-amber-400">
                    {currentAnalysis.skillsOverview.partiallyDemonstratedCount}
                  </p>
                  <p className="text-xs font-semibold text-slate-300 mt-1">Partial Evidence</p>
                </Card>
                <Card className="p-4 text-center border-rose-500/30 bg-rose-500/5">
                  <p className="text-2xl font-black text-rose-400">
                    {currentAnalysis.skillsOverview.missingCount}
                  </p>
                  <p className="text-xs font-semibold text-slate-300 mt-1">Not Demonstrated</p>
                </Card>
              </div>

              {/* Executive Summary */}
              <Card className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
                  Market Gap Assessment
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentAnalysis.executiveSummary}
                </p>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{currentAnalysis.disclaimer}</span>
                </div>
              </Card>

              {/* Recommended Learning Sequence */}
              {currentAnalysis.suggestedLearningSequence && currentAnalysis.suggestedLearningSequence.length > 0 && (
                <Card className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
                    Recommended Study Sequence
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {currentAnalysis.suggestedLearningSequence.map((seqSkill, sIdx) => (
                      <div key={seqSkill} className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-[#7C5CFC]/15 text-[#A78BFA] border border-[#7C5CFC]/30 font-medium">
                          {sIdx + 1}. {seqSkill}
                        </span>
                        {sIdx < currentAnalysis.suggestedLearningSequence.length - 1 && (
                          <span className="text-slate-500 text-xs">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Detailed Breakdown of Each Skill */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
                  Individual Competency Audits ({currentAnalysis.skillAssessments.length})
                </h3>

                <div className="space-y-3">
                  {currentAnalysis.skillAssessments.map((item) => (
                    <Card key={item.skill} className="space-y-3 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1E293B]">
                        <h4 className="text-sm font-bold text-white">{item.skill}</h4>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              item.status === 'Demonstrated'
                                ? 'demonstrated'
                                : item.status === 'Partially demonstrated'
                                ? 'partial'
                                : 'missing'
                            }
                            size="sm"
                          >
                            {item.status}
                          </Badge>
                          <Badge
                            variant={
                              item.priority === 'Critical'
                                ? 'critical'
                                : item.priority === 'Important'
                                ? 'important'
                                : 'default'
                            }
                            size="sm"
                          >
                            {item.priority}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-semibold text-slate-300">Assessment: </span>
                          <span className="text-slate-400">{item.evidence}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-300">Why It Matters: </span>
                          <span className="text-slate-400">{item.importanceExplanation}</span>
                        </div>
                        {item.practicalProjectIdea && (
                          <div className="p-3 rounded-xl bg-[#0B1020] border border-[#1E293B] flex items-start gap-2.5">
                            <Code className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-white">Suggested Practice Milestone</p>
                              <p className="text-slate-300 text-[11px] mt-0.5">{item.practicalProjectIdea}</p>
                            </div>
                          </div>
                        )}
                        {item.recommendedSearchTerms && item.recommendedSearchTerms.length > 0 && (
                          <div className="flex items-center gap-2 pt-1 flex-wrap">
                            <span className="text-slate-400 text-[11px] flex items-center gap-1">
                              <Search className="w-3 h-3 text-[#7C5CFC]" /> High-yield search terms:
                            </span>
                            {item.recommendedSearchTerms.map((term) => (
                              <span
                                key={term}
                                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                              >
                                {term}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Card className="text-center py-20 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#11182B] border border-[#1E293B] text-slate-500 flex items-center justify-center mx-auto">
                <GitPullRequest className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No Benchmark Report Selected</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click 'Analyze Skill Gaps' on the left to benchmark your skills against industry standards.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
