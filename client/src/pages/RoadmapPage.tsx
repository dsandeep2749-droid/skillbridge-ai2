import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Modal } from '../components/common/Modal.js';
import { Input } from '../components/common/Input.js';
import { Select } from '../components/common/Select.js';
import {
  MapPin,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Layers,
  Search,
  RotateCcw,
  Trash2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { RoadmapRecord } from '../types/index.js';

export const RoadmapPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapRecord | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({ 1: true });
  const [actionError, setActionError] = useState('');

  // Fetch user profile for default configuration
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(),
  });

  // Fetch all roadmaps
  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: () => api.getRoadmaps(),
  });

  // Generator form state
  const [genTargetRole, setGenTargetRole] = useState(profile?.target_role || 'Full-Stack Developer');
  const [genWeeklyHours, setGenWeeklyHours] = useState(profile?.weekly_study_hours || 15);
  const [genTimeline, setGenTimeline] = useState(profile?.target_timeline || '3 Months');
  const [genStyle, setGenStyle] = useState(profile?.learning_style || 'Hands-on Projects & Building');

  // Mutation for generating roadmap
  const generateMutation = useMutation({
    mutationFn: async () => {
      return await api.generateRoadmap({
        targetRole: genTargetRole,
        currentSkills: profile?.current_skills || ['JavaScript', 'React'],
        weeklyStudyHours: genWeeklyHours,
        targetTimeline: genTimeline,
        learningStyle: genStyle,
      });
    },
    onSuccess: (newRoadmap) => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      setSelectedRoadmap(newRoadmap);
      setIsGenerateModalOpen(false);
      setActionError('');
      // Expand first phase
      setExpandedPhases({ 1: true });
    },
    onError: (err: any) => {
      setActionError(err.message || 'Failed to generate roadmap. Please try again.');
    },
  });

  // Mutation for updating a task's status
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ roadmapId, taskId, completed }: { roadmapId: string; taskId: string; completed: boolean }) => {
      return await api.updateRoadmapTask(roadmapId, taskId, completed);
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      // Update local active roadmap state instantly
      if (activeRoadmap && activeRoadmap.id === variables.roadmapId) {
        const updatedTasks = activeRoadmap.tasks.map((t) =>
          t.id === variables.taskId ? { ...t, completed: variables.completed } : t
        );
        setSelectedRoadmap({
          ...activeRoadmap,
          tasks: updatedTasks,
          progressPercentage: result.progressPercentage,
        });
      }
    },
    onError: (err: any) => {
      setActionError(err.message || 'Failed to update task.');
    },
  });

  // Delete roadmap mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.deleteRoadmap(id);
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      if (selectedRoadmap?.id === deletedId) {
        setSelectedRoadmap(null);
      }
    },
  });

  const activeRoadmap = selectedRoadmap || (roadmaps && roadmaps.length > 0 ? roadmaps[0] : null);

  const togglePhase = (phaseNum: number) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseNum]: !prev[phaseNum],
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 text-xs font-semibold text-[#A78BFA]">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Curriculum Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Personalized Learning Roadmap
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Interactive milestone plans tailored to your weekly availability, practical project deliverables, and real-time progress persistence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            className="glow-btn"
            onClick={() => {
              if (profile?.target_role) setGenTargetRole(profile.target_role);
              setIsGenerateModalOpen(true);
            }}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {activeRoadmap ? 'Regenerate Roadmap' : 'Generate Roadmap'}
          </Button>
        </div>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Roadmap Display */}
      {activeRoadmap ? (
        <div className="space-y-8">
          {/* Roadmap Summary Banner */}
          <Card className="p-6 bg-gradient-to-r from-[#11182B] via-[#162038] to-[#1E1B4B]/30 border-[#7C5CFC]/40 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#1E293B]">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
                  Target Role: {activeRoadmap.target_role}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {activeRoadmap.title}
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  {activeRoadmap.roadmap_data?.summary}
                </p>
              </div>

              {/* Real Progress Dial */}
              <div className="bg-[#0B1020] p-4 rounded-2xl border border-[#1E293B] flex items-center gap-4 min-w-[220px]">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Overall Progress</span>
                  <p className="text-3xl font-extrabold text-white">
                    {activeRoadmap.progressPercentage}%
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {activeRoadmap.tasks.filter((t) => t.completed).length} of {activeRoadmap.tasks.length} tasks
                  </p>
                </div>
              </div>
            </div>

            {/* Assumptions & Disclaimers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7C5CFC]" />
                <span>Estimated Total: ~{activeRoadmap.roadmap_data?.totalEstimatedHours || 120} hours ({activeRoadmap.roadmap_data?.targetTimeline || '12 Weeks'})</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>{activeRoadmap.roadmap_data?.disclaimer}</span>
              </div>
            </div>
          </Card>

          {/* Phase Cards */}
          <div className="space-y-6">
            {activeRoadmap.roadmap_data?.phases.map((phase) => {
              const isExpanded = expandedPhases[phase.phaseNumber] !== false;
              // Map tasks in this phase to active tasks
              const phaseTasks = activeRoadmap.tasks.filter(
                (t) =>
                  t.phase.includes(`Phase ${phase.phaseNumber}`) ||
                  phase.tasks.some((pt) => pt.title.toLowerCase() === t.title.toLowerCase())
              );
              const phaseCompleted = phaseTasks.filter((t) => t.completed).length;

              return (
                <Card key={phase.phaseNumber} className="p-6 space-y-4">
                  {/* Phase Header */}
                  <div
                    onClick={() => togglePhase(phase.phaseNumber)}
                    className="flex items-center justify-between cursor-pointer select-none pb-2 border-b border-[#1E293B]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#7C5CFC]/20 text-[#A78BFA] font-bold text-sm flex items-center justify-center border border-[#7C5CFC]/40">
                        {phase.phaseNumber}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          {phase.phaseTitle}
                        </h3>
                        <p className="text-xs text-slate-400">{phase.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-medium">
                        {phaseCompleted} / {phaseTasks.length} tasks
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  {isExpanded && (
                    <div className="space-y-5 pt-2 animate-in fade-in duration-200">
                      {/* Weekly Plan Outline */}
                      {phase.weeklyPlan && phase.weeklyPlan.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[#1E293B] space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                            Weekly Focus Schedule (~{phase.estimatedWeeks} Weeks)
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {phase.weeklyPlan.map((wk) => (
                              <div key={wk.weekNumber} className="p-2 rounded-lg bg-[#11182B] text-xs">
                                <span className="font-bold text-[#A78BFA]">Week {wk.weekNumber}: </span>
                                <span className="text-slate-300">{wk.focus}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Task Checklist */}
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Actionable Tasks & Verification
                        </p>

                        <div className="space-y-2.5">
                          {phaseTasks.map((task) => (
                            <div
                              key={task.id}
                              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                                task.completed
                                  ? 'bg-[#11182B]/40 border-slate-800 opacity-80'
                                  : 'bg-[#11182B] border-[#1E293B] hover:border-slate-700'
                              }`}
                            >
                              {/* Checkbox */}
                              <button
                                type="button"
                                onClick={() =>
                                  toggleTaskMutation.mutate({
                                    roadmapId: activeRoadmap.id,
                                    taskId: task.id,
                                    completed: !task.completed,
                                  })
                                }
                                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
                                  task.completed
                                    ? 'bg-emerald-500 text-black'
                                    : 'border border-slate-600 hover:border-[#7C5CFC]'
                                }`}
                              >
                                {task.completed && <CheckCircle2 className="w-4 h-4" />}
                              </button>

                              <div className="space-y-1.5 flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <h4
                                    className={`text-sm font-semibold ${
                                      task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                                    }`}
                                  >
                                    {task.title}
                                  </h4>
                                  <Badge variant={task.completed ? 'demonstrated' : 'info'} size="sm">
                                    {task.estimated_hours} hrs
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                  {task.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Phase Milestone Project */}
                      {phase.projectMilestone && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-[#7C5CFC]/10 to-[#38BDF8]/10 border border-[#7C5CFC]/30 space-y-2">
                          <div className="flex items-center gap-2 text-[#A78BFA]">
                            <Award className="w-4 h-4 text-[#38BDF8]" />
                            <h4 className="text-xs font-bold uppercase tracking-wider">
                              Phase Milestone: {phase.projectMilestone.title}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-300">
                            {phase.projectMilestone.description}
                          </p>
                          {phase.projectMilestone.deliverables && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {phase.projectMilestone.deliverables.map((deliv, dIdx) => (
                                <span
                                  key={dIdx}
                                  className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                                >
                                  ✓ {deliv}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <Card className="text-center py-20 space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#7C5CFC]/10 border border-[#7C5CFC]/30 text-[#A78BFA] flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">No Learning Roadmap Yet</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              SkillBridge AI constructs personalized curricula based on verified market requirements, your weekly hours, and target timeline.
            </p>
          </div>
          <Button
            className="glow-btn"
            onClick={() => setIsGenerateModalOpen(true)}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Generate Personalized Roadmap
          </Button>
        </Card>
      )}

      {/* Generator Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate AI Career Roadmap"
        description="Configure your study parameters to generate an adaptive step-by-step curriculum."
      >
        <div className="space-y-4 pt-2">
          {generateMutation.isError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{(generateMutation.error as any)?.message || 'Failed to generate roadmap.'}</span>
            </div>
          )}

          <Input
            label="Target Job Role"
            value={genTargetRole}
            onChange={(e) => setGenTargetRole(e.target.value)}
            placeholder="e.g. Full-Stack Developer"
            required
          />

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold uppercase tracking-wider text-slate-300">
                Weekly Study Hours: <span className="text-[#38BDF8] font-bold">{genWeeklyHours} hrs</span>
              </label>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={genWeeklyHours}
              onChange={(e) => setGenWeeklyHours(parseInt(e.target.value, 10))}
              className="w-full accent-[#7C5CFC]"
            />
          </div>

          <Select
            label="Target Preparation Timeline"
            value={genTimeline}
            onChange={(e) => setGenTimeline(e.target.value)}
            options={[
              { value: '1 Month (Intensive)', label: '1 Month (Intensive)' },
              { value: '3 Months (Standard)', label: '3 Months (Standard)' },
              { value: '6 Months (Steady Pace)', label: '6 Months (Steady Pace)' },
            ]}
          />

          <Select
            label="Preferred Learning Style"
            value={genStyle}
            onChange={(e) => setGenStyle(e.target.value)}
            options={[
              { value: 'Hands-on Projects & Building', label: 'Hands-on Projects & Building' },
              { value: 'Video Tutorials & Walkthroughs', label: 'Video Tutorials & Walkthroughs' },
              { value: 'Documentation & Architecture Deep Dives', label: 'Documentation & Architecture Deep Dives' },
            ]}
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-[#1E293B]">
            <Button variant="secondary" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="glow-btn"
              onClick={() => generateMutation.mutate()}
              isLoading={generateMutation.isPending}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              {generateMutation.isPending ? 'Generating Roadmap...' : 'Generate Roadmap'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
