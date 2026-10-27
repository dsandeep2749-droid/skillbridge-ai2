import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'demonstrated' | 'partial' | 'missing' | 'critical' | 'important' | 'info' | 'default';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const variants = {
    demonstrated: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    partial: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    missing: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    critical: 'bg-red-500/15 border-red-500/40 text-red-300 font-semibold',
    important: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    info: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    default: 'bg-slate-800 border-slate-700 text-slate-300',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium border',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium border',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 transition-colors select-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
