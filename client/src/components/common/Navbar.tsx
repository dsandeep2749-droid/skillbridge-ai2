import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import {
  Compass,
  FileText,
  GitPullRequest,
  MapPin,
  Bot,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = user
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: Compass },
        { label: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
        { label: 'Skill Gap', path: '/skill-gap', icon: GitPullRequest },
        { label: 'Roadmap', path: '/roadmap', icon: MapPin },
        { label: 'Mock Interview', path: '/mock-interview', icon: Bot },
      ]
    : [
        { label: 'Features', path: '/#features' },
        { label: 'How It Works', path: '/#how-it-works' },
        { label: 'Career Paths', path: '/#career-paths' },
      ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E293B]/80 bg-[#0B1020]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#38BDF8] to-[#7C5CFC] p-0.5 shadow-md shadow-[#7C5CFC]/20 group-hover:shadow-[#7C5CFC]/40 transition-shadow">
            <div className="w-full h-full bg-[#11182B] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#38BDF8] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
            SkillBridge<span className="gradient-text font-extrabold">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = (link as any).icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'bg-[#7C5CFC]/15 text-[#A78BFA] border border-[#7C5CFC]/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Actions / Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className={`p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ${
                  isActive('/profile') ? 'bg-slate-800 text-white' : ''
                }`}
                title="Profile & Settings"
              >
                <UserIcon className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl text-sm font-medium text-white glow-btn"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1E293B] bg-[#11182B] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-[#7C5CFC]/20 text-[#A78BFA]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white"
              >
                Profile & Goals
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white"
              >
                Settings & Privacy
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-slate-300 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-xl text-sm font-medium text-white glow-btn"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
