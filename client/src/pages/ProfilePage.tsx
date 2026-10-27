import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { Select } from '../components/common/Select.js';
import { Textarea } from '../components/common/Textarea.js';
import { Badge } from '../components/common/Badge.js';
import {
  User as UserIcon,
  Sparkles,
  Save,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Bot,
  Trash2,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(),
  });

  const { data: resumes } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => api.getResumes(),
  });

  const { data: roadmaps } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: () => api.getRoadmaps(),
  });

  const [fullName, setFullName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(15);
  const [learningStyle, setLearningStyle] = useState('');
  const [targetTimeline, setTargetTimeline] = useState('');
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setTargetRole(profile.target_role || 'Full-Stack Developer');
      setEducationLevel(profile.education_level || 'Bachelor of Science');
      setExperienceLevel(profile.experience_level || 'Entry-Level');
      setCareerGoal(profile.career_goal || '');
      setWeeklyHours(profile.weekly_study_hours || 15);
      setLearningStyle(profile.learning_style || 'Hands-on Projects & Building');
      setTargetTimeline(profile.target_timeline || '3 Months');
      setCurrentSkills(profile.current_skills || []);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      return await api.updateProfile({
        fullName,
        targetRole,
        educationLevel,
        experienceLevel,
        careerGoal,
        weeklyStudyHours: weeklyHours,
        learningStyle,
        targetTimeline,
        currentSkills,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setFeedbackMessage('Career profile saved successfully.');
      setErrorMessage('');
      setTimeout(() => setFeedbackMessage(''), 4000);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to update profile.');
    },
  });

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !currentSkills.includes(newSkillInput.trim())) {
      setCurrentSkills([...currentSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setCurrentSkills(currentSkills.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 text-xs font-semibold text-[#A78BFA]">
          <UserIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Account & Aspirations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Career Profile & Preferences
        </h1>
        <p className="text-sm text-slate-400">
          Manage your verified background details, study availability, and target engineering track.
        </p>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Form */}
      <Card className="p-6 space-y-6">
        <h2 className="text-base font-bold text-white border-b border-[#1E293B] pb-3">
          Personal & Career Target Info
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Target Job Role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            required
          />

          <Select
            label="Education Level"
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
            options={[
              { value: 'High School Diploma', label: 'High School Diploma' },
              { value: 'Associate Degree', label: 'Associate Degree' },
              { value: 'Bachelor of Science / Arts', label: 'Bachelor of Science / Arts' },
              { value: 'Master of Science / MBA', label: 'Master of Science / MBA' },
              { value: 'Self-Taught / Bootcamp', label: 'Self-Taught / Bootcamp' },
            ]}
          />

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
        </div>

        <Textarea
          label="Primary Career Objective"
          value={careerGoal}
          onChange={(e) => setCareerGoal(e.target.value)}
          rows={2}
          placeholder="What role or company are you preparing for?"
        />

        {/* Study Hours & Pace */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold uppercase tracking-wider text-slate-300">
              Weekly Study Hours: <span className="text-[#38BDF8] font-bold">{weeklyHours} hrs/week</span>
            </label>
          </div>
          <input
            type="range"
            min="3"
            max="40"
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(parseInt(e.target.value, 10))}
            className="w-full accent-[#7C5CFC]"
          />
        </div>

        {/* Skills Tag Editor */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Skills Inventory ({currentSkills.length})
          </label>
          <div className="flex gap-2">
            <Input
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add another skill..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={handleAddSkill} leftIcon={<Plus className="w-4 h-4" />}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-[#0B1020] border border-[#1E293B]">
            {currentSkills.map((sk) => (
              <span
                key={sk}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#7C5CFC]/15 text-[#A78BFA] border border-[#7C5CFC]/30 font-medium"
              >
                {sk}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(sk)}
                  className="hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#1E293B] flex justify-end">
          <Button
            className="glow-btn px-6"
            onClick={() => updateMutation.mutate()}
            isLoading={updateMutation.isPending}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile
          </Button>
        </div>
      </Card>
    </div>
  );
};
