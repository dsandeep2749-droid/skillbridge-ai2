import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { Textarea } from '../components/common/Textarea.js';
import { Badge } from '../components/common/Badge.js';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { ResumeAnalysisRecord } from '../types/index.js';

export const ResumeAnalyzerPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [targetRole, setTargetRole] = useState('Full-Stack Developer');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<ResumeAnalysisRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch previous analyses
  const { data: previousAnalyses, isLoading: listLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => api.getResumes(),
  });

  // Mutation for analyzing resume
  const analyzeMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await api.analyzeResume(formData);
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setActiveAnalysis(result);
      setErrorMessage('');
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Resume analysis failed. Please verify the document format.');
    },
  });

  // Mutation for deleting an analysis
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.deleteResume(id);
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      if (activeAnalysis?.id === deletedId) {
        setActiveAnalysis(null);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc') {
        setErrorMessage('Only PDF and DOCX files are supported.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size exceeds the 5MB limit.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please select a PDF or DOCX resume to upload.');
      return;
    }
    if (!targetRole.trim()) {
      setErrorMessage('Please specify a target role.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('targetRole', targetRole.trim());
    if (jobDescription.trim()) {
      formData.append('jobDescription', jobDescription.trim());
    }

    analyzeMutation.mutate(formData);
  };

  const currentReport = activeAnalysis?.analysis_result || (previousAnalyses && previousAnalyses.length > 0 ? previousAnalyses[0].analysis_result : null);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 text-xs font-semibold text-[#A78BFA]">
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>AI Resume Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Resume Analyzer & Target Role Alignment
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Upload your resume to extract demonstrable technical skills, detect blindspots, audit section clarity, and benchmark match probability against real job descriptions.
        </p>
      </div>

      {/* Main Grid: Upload Form & Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Column (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#38BDF8]" />
              Upload & Configure Analysis
            </h2>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleStartAnalysis} className="space-y-4">
              {/* File Dropzone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Resume File (PDF or DOCX, max 5MB)
                </label>
                <label className="border-2 border-dashed border-[#1E293B] hover:border-[#7C5CFC]/60 bg-[#0B1020]/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-[#11182B] border border-[#1E293B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6 text-[#7C5CFC]" />
                  </div>
                  {selectedFile ? (
                    <div>
                      <p className="text-xs font-semibold text-emerald-400">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Click to browse or drop file here</p>
                      <p className="text-[11px] text-slate-500 mt-1">Text-based PDF or Word documents</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Target Role */}
              <Input
                label="Target Job Role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Frontend Engineer, DevOps Engineer"
                required
              />

              {/* Optional Job Description */}
              <Textarea
                label="Target Job Description (Optional)"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description or role requirements to match keywords and specific competencies..."
                rows={4}
              />

              <Button
                type="submit"
                className="w-full glow-btn"
                isLoading={analyzeMutation.isPending}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                {analyzeMutation.isPending ? 'Analyzing with Gemini...' : 'Analyze Resume'}
              </Button>
            </form>
          </Card>

          {/* Previous Analyses List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Saved Analyses ({previousAnalyses?.length || 0})
            </h3>
            {previousAnalyses && previousAnalyses.length > 0 ? (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {previousAnalyses.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveAnalysis(item)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      (activeAnalysis?.id === item.id) || (!activeAnalysis && previousAnalyses[0].id === item.id)
                        ? 'bg-[#7C5CFC]/15 border-[#7C5CFC]/40'
                        : 'bg-[#11182B] border-[#1E293B] hover:border-slate-700'
                    }`}
                  >
                    <div className="overflow-hidden pr-2">
                      <p className="text-xs font-semibold text-white truncate">{item.resume_filename}</p>
                      <p className="text-[11px] text-slate-400 truncate">{item.target_role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="info" size="sm">
                        {item.analysis_result?.alignmentEstimate?.scoreOutOf100 || 0}%
                      </Badge>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this saved analysis?')) {
                            deleteMutation.mutate(item.id);
                          }
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No saved analyses yet.</p>
            )}
          </div>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentReport ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Score & Alignment Banner */}
              <Card className="p-6 bg-gradient-to-r from-[#11182B] to-[#1E293B] border border-[#7C5CFC]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Estimated Job Alignment
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      {currentReport.alignmentEstimate.matchTier}
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1 bg-[#0B1020] px-4 py-2.5 rounded-xl border border-[#1E293B]">
                    <span className="text-3xl font-extrabold text-[#38BDF8]">
                      {currentReport.alignmentEstimate.scoreOutOf100}
                    </span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentReport.alignmentEstimate.explanation}
                </p>

                {/* Important AI Disclaimer */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{currentReport.alignmentEstimate.disclaimer}</span>
                </div>
              </Card>

              {/* Executive Summary */}
              <Card className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
                  Profile Critique & Summary
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentReport.summary}
                </p>
              </Card>

              {/* Identified Skills */}
              <Card className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
                  Extracted Demonstrable Skills ({currentReport.extractedSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentReport.extractedSkills.map((skill) => (
                    <Badge key={skill} variant="demonstrated">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Strengths & Weaknesses 2-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="space-y-3 border-emerald-500/20">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Noted Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {currentReport.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="space-y-3 border-rose-500/20">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Missing / Weak Areas
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {currentReport.missingOrWeakAreas.map((mwa, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400">•</span>
                        <span>{mwa}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Section-by-Section Review */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
                  Section-by-Section Recommendations
                </h3>
                <div className="space-y-3">
                  {currentReport.sectionReviews.map((sec) => (
                    <Card key={sec.sectionName} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{sec.sectionName}</h4>
                        <Badge
                          variant={
                            sec.status === 'strong'
                              ? 'demonstrated'
                              : sec.status === 'adequate'
                              ? 'info'
                              : sec.status === 'needs_improvement'
                              ? 'partial'
                              : 'missing'
                          }
                          size="sm"
                        >
                          {sec.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-300">{sec.feedback}</p>
                      {sec.recommendations.length > 0 && (
                        <div className="pt-1 space-y-1">
                          {sec.recommendations.map((rec, rIdx) => (
                            <p key={rIdx} className="text-[11px] text-[#A78BFA] flex items-start gap-1.5">
                              <span>→</span>
                              <span>{rec}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>

              {/* Suggested ATS Keywords */}
              {currentReport.suggestedKeywords && currentReport.suggestedKeywords.length > 0 && (
                <Card className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-[#38BDF8]" />
                    Target Keywords to Include
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentReport.suggestedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-mono"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card className="text-center py-20 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#11182B] border border-[#1E293B] text-slate-500 flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No Analysis Selected</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Upload a resume on the left or select an existing analysis to review your structured critique.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
