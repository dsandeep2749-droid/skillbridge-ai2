import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B1020] disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-gradient-to-r from-[#7C5CFC] to-[#6845EE] text-white hover:from-[#8B6EFC] hover:to-[#7857F8] focus:ring-[#7C5CFC] shadow-lg shadow-[#7C5CFC]/25 hover:shadow-[#7C5CFC]/40 border border-[#9B82FD]/30',
    secondary: 'bg-[#1E293B] text-slate-100 hover:bg-[#334155] focus:ring-slate-400 border border-slate-700/60',
    outline: 'border border-[#7C5CFC]/40 text-[#A78BFA] hover:bg-[#7C5CFC]/10 hover:border-[#7C5CFC] focus:ring-[#7C5CFC]',
    ghost: 'text-slate-300 hover:text-white hover:bg-slate-800/60 focus:ring-slate-500',
    danger: 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 focus:ring-rose-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
