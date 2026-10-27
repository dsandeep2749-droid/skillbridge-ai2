import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import {
  Compass,
  FileText,
  GitPullRequest,
  MapPin,
  Bot,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Compass },
    { label: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
    { label: 'Skill Gap', path: '/skill-gap', icon: GitPullRequest },
    { label: 'Learning Roadmap', path: '/roadmap', icon: MapPin },
    { label: 'AI Mock Interview', path: '/mock-interview', icon: Bot },
  ];

  const secondaryNav = [
    { label: 'Profile & Career Goal', path: '/profile', icon: UserIcon },
    { label: 'Settings & Privacy', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex bg-[#0B1020] text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#1E293B] bg-[#0E1528] p-4 sticky top-0 h-screen justify-between">
        <div className="space-y-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 px-2 py-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#38BDF8] to-[#7C5CFC] p-0.5">
              <div className="w-full h-full bg-[#11182B] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              SkillBridge<span className="gradient-text font-extrabold">AI</span>
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-2">
              Career Engine
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#7C5CFC]/15 text-[#A78BFA] border border-[#7C5CFC]/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#38BDF8]' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Account Navigation */}
          <div className="space-y-1 pt-4 border-t border-[#1E293B]">
            <p className="px-3 text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-2">
              Account
            </p>
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#7C5CFC]/15 text-[#A78BFA] border border-[#7C5CFC]/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Card & Sign Out */}
        <div className="p-3 bg-[#11182B] border border-[#1E293B] rounded-xl flex items-center justify-between">
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">
              {user?.full_name || 'Alex Chen'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
