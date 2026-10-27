import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Input } from '../components/common/Input.js';
import { Textarea } from '../components/common/Textarea.js';
import { Select } from '../components/common/Select.js';
import { Button } from '../components/common/Button.js';
import { Card } from '../components/common/Card.js';
import { Badge } from '../components/common/Badge.js';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Target,
  BookOpen,
  Clock,
  Briefcase,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    educationLevel: 'Bachelor of Science in Computer Science',
    studyYear: 'Senior (Final Year)',
    experienceLevel: 'Entry-Level',
    targetRole: 'Full-Stack Developer',
    careerGoal: 'Land a junior full-stack developer role at an innovative tech startup within 3 months.',
    currentSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
    weeklyStudyHours: 15,
    learningStyle: 'Hands-on Projects & Building',
    targetTimeline: '3 Months',
  });

  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const targetRoles = [
    { value: 'Frontend Developer', label: 'Frontend Developer' },
    { value: 'Backend Developer', label: 'Backend Developer' },
    { value: 'Full-Stack Developer', label: 'Full-Stack Developer' },
    { value: 'Data Analyst', label: 'Data Analyst' },
    { value: 'Data Scientist', label: 'Data Scientist' },
    { value: 'AI/ML Engineer', label: 'AI/ML Engineer' },
    { value: 'DevOps Engineer', label: 'DevOps Engineer' },
    { value: 'Cybersecurity Analyst', label: 'Cybersecurity Analyst' },
  ];

  const educationLevels = [
    { value: 'High School Diploma', label: 'High School Diploma' },
    { value: 'Associate Degree', label: 'Associate Degree' },
    { value: 'Bachelor of Science / Arts', label: 'Bachelor of Science / Arts' },
    { value: 'Master of Science / MBA', label: 'Master of Science / MBA' },
    { value: 'Self-Taught / Bootcamp', label: 'Self-Taught / Bootcamp' },
    { value: 'Ph.D. / Doctorate', label: 'Ph.D. / Doctorate' },
  ];

  const studyYears = [
    { value: 'Freshman (1st Year)', label: 'Freshman (1st Year)' },
    { value: 'Sophomore (2nd Year)', label: 'Sophomore (2nd Year)' },
    { value: 'Junior (3rd Year)', label: 'Junior (3rd Year)' },
    { value: 'Senior (Final Year)', label: 'Senior (Final Year)' },
    { value: 'Recent Graduate (0-1 yr)', label: 'Recent Graduate (0-1 yr)' },
    { value: 'Working Professional (Career Switcher)', label: 'Working Professional (Career Switcher)' },
  ];

  const experienceLevels = [
    { value: 'Student / Intern', label: 'Student / Intern' },
    { value: 'Entry-Level (0-2 years)', label: 'Entry-Level (0-2 years)' },
    { value: 'Mid-Level (2-5 years)', label: 'Mid-Level (2-5 years)' },
    { value: 'Senior (5+ years)', label: 'Senior (5+ years)' },
  ];

  const learningStyles = [
    { value: 'Hands-on Projects & Building', label: 'Hands-on Projects & Building' },
    { value: 'Video Tutorials & Walkthroughs', label: 'Video Tutorials & Walkthroughs' },
    { value: 'Documentation & Deep Reads', label: 'Documentation & Deep Reads' },
    { value: 'Interactive Problem Solving & Coding Drills', label: 'Interactive Problem Solving & Coding Drills' },
  ];

  const targetTimelines = [
    { value: '1 Month (Intensive)', label: '1 Month (Intensive)' },
    { value: '3 Months (Standard Bootcamp Pace)', label: '3 Months (Standard Bootcamp Pace)' },
    { value: '6 Months (Steady Semester Pace)', label: '6 Months (Steady Semester Pace)' },
    { value: '1 Year (Long-Term Mastery)', label: '1 Year (Long-Term Mastery)' },
  ];

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.currentSkills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        currentSkills: [...formData.currentSkills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      currentSkills: formData.currentSkills.filter((s) => s !== skillToRemove),
    });
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
    } else if (step === 2) {
      if (!formData.targetRole.trim()) {
        setError('Please select a target role.');
        return;
      }
      if (formData.currentSkills.length === 0) {
        setError('Please enter at least one current skill.');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinish = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      await api.updateProfile(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save onboarding profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Step Indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span>Step {step} of {totalSteps}</span>
          <span>
            {step === 1 && 'Background & Experience'}
            {step === 2 && 'Role & Current Skills'}
            {step === 3 && 'Pace & Learning Preferences'}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#38BDF8] to-[#7C5CFC] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <Card className="space-y-6">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* STEP 1: Background & Education */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Tell us about your background</h2>
              <p className="text-xs text-slate-400">
                This helps our AI mentor calibrate its recommendations to your experience level.
              </p>
            </div>

            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Alex Chen"
              required
            />

            <Select
              label="Education Level"
              value={formData.educationLevel}
              onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
              options={educationLevels}
            />

            <Select
              label="Current Year or Stage"
              value={formData.studyYear}
              onChange={(e) => setFormData({ ...formData, studyYear: e.target.value })}
              options={studyYears}
            />

            <Select
              label="Experience Level"
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              options={experienceLevels}
            />
          </div>
        )}

        {/* STEP 2: Role & Current Skills */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Your Target Career & Current Skills</h2>
              <p className="text-xs text-slate-400">
                Select the role you're aiming for and add the skills you currently possess.
              </p>
            </div>

            <Select
              label="Target Job Role"
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              options={targetRoles}
            />

            <Textarea
              label="Primary Career Goal (Optional)"
              value={formData.careerGoal}
              onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
              placeholder="e.g. Land my first junior engineer role or transition into ML engineering."
              rows={2}
            />

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Current Skills (Type and press Enter or Add)
              </label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDownSkill}
                  placeholder="e.g. TypeScript, SQL, React, Python"
                />
                <Button type="button" variant="secondary" onClick={handleAddSkill} leftIcon={<Plus className="w-4 h-4" />}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 min-h-12 p-3 rounded-xl bg-[#0B1020] border border-[#1E293B]">
                {formData.currentSkills.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No skills added yet. Add at least one skill.</span>
                ) : (
                  formData.currentSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#7C5CFC]/15 text-[#A78BFA] border border-[#7C5CFC]/30 font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Study Pace & Learning Style */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Study Commitment & Preferences</h2>
              <p className="text-xs text-slate-400">
                Configure your schedule so your learning roadmap is realistic and achievable.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Weekly Study Hours Available: <span className="text-[#38BDF8] font-bold">{formData.weeklyStudyHours} hrs/week</span>
                </label>
              </div>
              <input
                type="range"
                min="3"
                max="40"
                step="1"
                value={formData.weeklyStudyHours}
                onChange={(e) => setFormData({ ...formData, weeklyStudyHours: parseInt(e.target.value, 10) })}
                className="w-full accent-[#7C5CFC] bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>3 hrs (Light)</span>
                <span>15 hrs (Moderate)</span>
                <span>40 hrs (Full-Time)</span>
              </div>
            </div>

            <Select
              label="Target Preparation Timeline"
              value={formData.targetTimeline}
              onChange={(e) => setFormData({ ...formData, targetTimeline: e.target.value })}
              options={targetTimelines}
            />

            <Select
              label="Preferred Learning Style"
              value={formData.learningStyle}
              onChange={(e) => setFormData({ ...formData, learningStyle: e.target.value })}
              options={learningStyles}
            />
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1E293B]">
          {step > 1 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              className="glow-btn"
              onClick={handleFinish}
              isLoading={isSubmitting}
              rightIcon={<Check className="w-4 h-4" />}
            >
              Complete Onboarding & Go to Dashboard
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
