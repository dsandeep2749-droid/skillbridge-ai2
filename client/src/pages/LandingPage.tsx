import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  GitPullRequest,
  MapPin,
  Bot,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Award,
  Terminal,
} from 'lucide-react';
import { Button } from '../components/common/Button.js';
import { Card } from '../components/common/Card.js';
import { Badge } from '../components/common/Badge.js';

export const LandingPage: React.FC = () => {
  const careerPaths = [
    { title: 'Frontend Developer', demand: 'High Demand', icon: '⚛️', color: 'border-sky-500/30' },
    { title: 'Backend Developer', demand: 'Very High', icon: '🛠️', color: 'border-violet-500/30' },
    { title: 'Full-Stack Developer', demand: 'Top Growth', icon: '🚀', color: 'border-cyan-500/30' },
    { title: 'Data Analyst', demand: 'High Demand', icon: '📊', color: 'border-emerald-500/30' },
    { title: 'Data Scientist', demand: 'Rapid Surge', icon: '🧠', color: 'border-amber-500/30' },
    { title: 'AI/ML Engineer', demand: 'Peak Demand', icon: '🤖', color: 'border-purple-500/30' },
    { title: 'DevOps Engineer', demand: 'Critical Need', icon: '☁️', color: 'border-blue-500/30' },
    { title: 'Cybersecurity Analyst', demand: 'Critical Need', icon: '🛡️', color: 'border-rose-500/30' },
  ];

  const features = [
    {
      icon: FileText,
      title: 'AI Resume Analyzer',
      description: 'Upload your PDF or DOCX resume. Get instant section-by-section critiques, missing ATS keywords, and evidence-based alignment estimates.',
    },
    {
      icon: GitPullRequest,
      title: 'Skill Gap Intelligence',
      description: 'Categorizes skills into Demonstrated, Partially Demonstrated, or Missing. Prioritizes critical gaps with clear explanations and targeted search terms.',
    },
    {
      icon: MapPin,
      title: 'Personalized Learning Roadmap',
      description: 'Chronological phases adapted to your weekly study hours. Interactive task checklists, milestone projects, and verifiable completion criteria.',
    },
    {
      icon: Bot,
      title: 'AI Mock Interviews',
      description: 'Role-specific technical and behavioral questions. Practice with an optional timer, submit answers, and receive detailed scoring rubrics.',
    },
    {
      icon: TrendingUp,
      title: 'Career Progress Tracking',
      description: 'Dynamic dashboards that track your verified task completions, interview score trends, and real-time preparation readiness.',
    },
    {
      icon: ShieldCheck,
      title: 'Privacy & Responsible AI',
      description: 'Your documents are processed securely in-memory and treated as untrusted data. Transparent AI limitations with zero permanent file retention.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload Your Resume',
      desc: 'Drop in your PDF or DOCX. Text is parsed safely in memory without storing raw files.',
    },
    {
      step: '02',
      title: 'Choose Target Role',
      desc: 'Select from high-demand engineering or data tracks, or paste a custom job description.',
    },
    {
      step: '03',
      title: 'Discover Skill Gaps',
      desc: 'Review demonstrated vs missing competencies with evidence citations and priority tags.',
    },
    {
      step: '04',
      title: 'Follow Your Plan',
      desc: 'Work through interactive milestone phases and mark roadmap tasks complete as you learn.',
    },
    {
      step: '05',
      title: 'Practice & Master',
      desc: 'Simulate technical and behavioral interviews with real-time feedback and model answers.',
    },
  ];

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C5CFC]/10 border border-[#7C5CFC]/30 text-xs font-semibold text-[#A78BFA] shadow-glow-primary">
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Next-Generation Career Acceleration with Google Gemini</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Your Skills. Your Future. <br />
          <span className="gradient-text">Your AI Career Mentor.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Turn your career ambitions into an actionable plan. Analyze your resume, uncover skill gaps, and prepare for your next opportunity with AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/onboarding">
            <Button size="lg" className="w-full sm:w-auto text-base px-8 glow-btn" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Build My Career Roadmap
            </Button>
          </Link>
          <a href="#features">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
              Explore Features
            </Button>
          </a>
        </div>

        {/* Product Preview Card */}
        <div className="pt-10 max-w-5xl mx-auto">
          <div className="relative rounded-2xl p-1 bg-gradient-to-b from-[#38BDF8]/40 via-[#7C5CFC]/20 to-transparent shadow-2xl">
            <div className="bg-[#0E1528] rounded-xl border border-[#1E293B] p-6 text-left space-y-6">
              {/* Preview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-400 font-mono pl-2">
                    skillbridge-ai // candidate-intelligence-dashboard
                  </span>
                </div>
                <Badge variant="info">Illustrative Sample Preview</Badge>
              </div>

              {/* Preview Widgets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#11182B] p-4 rounded-xl border border-[#1E293B] space-y-2">
                  <p className="text-xs text-slate-400 uppercase font-semibold">Target Alignment</p>
                  <p className="text-3xl font-extrabold text-white">82<span className="text-sm font-normal text-slate-400">/100</span></p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High Alignment for Full-Stack
                  </p>
                </div>

                <div className="bg-[#11182B] p-4 rounded-xl border border-[#1E293B] space-y-2">
                  <p className="text-xs text-slate-400 uppercase font-semibold">Skill Gap Breakdown</p>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">6 Demonstrated</span>
                    <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20">3 Partial</span>
                    <span className="text-xs px-2 py-1 bg-rose-500/10 text-rose-400 rounded-md border border-rose-500/20">2 Missing</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Next Priority: Docker & CI/CD Pipelines</p>
                </div>

                <div className="bg-[#11182B] p-4 rounded-xl border border-[#1E293B] space-y-2">
                  <p className="text-xs text-slate-400 uppercase font-semibold">Roadmap Progress</p>
                  <p className="text-3xl font-extrabold text-white">45%</p>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#38BDF8] to-[#7C5CFC] h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>

              {/* Sample Task List */}
              <div className="bg-[#11182B] p-4 rounded-xl border border-[#1E293B] space-y-3">
                <p className="text-xs font-semibold text-slate-300">Phase 2 Active Tasks</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0B1020] border border-[#1E293B]">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-xs text-slate-300 line-through">Implement JWT Authentication with Refresh Rotation</span>
                    </div>
                    <Badge variant="demonstrated" size="sm">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0B1020] border border-[#1E293B]">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded border border-slate-600" />
                      <span className="text-xs text-slate-200">Design PostgreSQL Schema with Row Level Security</span>
                    </div>
                    <Badge variant="important" size="sm">In Progress</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="info">Comprehensive Feature Set</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Engineered for Serious Career Transitions
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Everything you need to benchmark your current profile, eliminate blindspots, and prepare with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 flex items-center justify-center text-[#A78BFA]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="default">The SkillBridge Workflow</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            How SkillBridge AI Guides Your Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((st) => (
            <div key={st.step} className="p-5 rounded-2xl bg-[#11182B]/60 border border-[#1E293B] space-y-2">
              <span className="text-2xl font-black gradient-text">{st.step}</span>
              <h4 className="text-sm font-bold text-white">{st.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Career Paths Section */}
      <section id="career-paths" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="info">Supported Disciplines</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Target Top High-Growth Tech Tracks
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Curriculums and question banks aligned with current market hiring bars.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {careerPaths.map((cp) => (
            <div
              key={cp.title}
              className={`p-4 rounded-xl bg-[#11182B] border ${cp.color} hover:border-[#7C5CFC]/50 transition-all flex flex-col justify-between gap-3`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cp.icon}</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">{cp.title}</h4>
                  <span className="text-[11px] text-cyan-400 font-medium">{cp.demand}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy and Responsible AI */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#11182B] to-[#1E293B]/60 border border-[#1E293B] space-y-4 text-left">
          <div className="flex items-center gap-3 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white">Responsible AI & Data Protection</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            SkillBridge AI is designed with strict security boundaries: resumes and job descriptions are parsed in volatile memory, sanitized against prompt injection, and sent exclusively to configured Google Gemini instances via secure backend endpoints.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero client-side API key leakage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Row-Level Security on user data</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Transparent AI feedback disclaimer</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>On-demand account and data deletion</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-[#7C5CFC]/20 to-[#11182B] border border-[#7C5CFC]/40 shadow-glow-primary space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Bridge Your Skill Gaps?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Take the first step toward your target career today with a personalized curriculum and AI mentor.
          </p>
          <div>
            <Link to="/signup">
              <Button size="lg" className="px-8 glow-btn" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
