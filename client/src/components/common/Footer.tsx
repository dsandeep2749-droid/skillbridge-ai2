import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#1E293B] bg-[#0B1020] text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#38BDF8] to-[#7C5CFC] p-0.5">
                <div className="w-full h-full bg-[#11182B] rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                </div>
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                SkillBridge<span className="gradient-text font-extrabold">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm">
              Your AI-powered career mentor. Uncover your skill gaps, generate actionable learning roadmaps, and practice role-specific technical interviews.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Resumes processed securely in-memory. Zero arbitrary retention.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/resume-analyzer" className="hover:text-white transition-colors">
                  Resume Analyzer
                </Link>
              </li>
              <li>
                <Link to="/skill-gap" className="hover:text-white transition-colors">
                  Skill Gap Intelligence
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-white transition-colors">
                  Learning Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/mock-interview" className="hover:text-white transition-colors">
                  AI Mock Interview
                </Link>
              </li>
            </ul>
          </div>

          {/* Responsible AI & Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Responsible AI</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">
                  AI Limitations & Ethics
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">
                  Privacy Preferences
                </Link>
              </li>
              <li>
                <a href="mailto:support@skillbridgeai.local" className="hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1E293B] mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SkillBridge AI. All rights reserved.</p>
          <p className="text-center sm:text-right text-[11px] text-slate-500 max-w-md">
            Disclaimer: AI-generated career alignments, roadmap estimates, and mock interview scores are educational practice feedback, not guarantees of employment or compensation.
          </p>
        </div>
      </div>
    </footer>
  );
};
