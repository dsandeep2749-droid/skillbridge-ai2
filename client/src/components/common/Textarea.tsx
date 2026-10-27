import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        className={`w-full bg-[#11182B] text-slate-100 placeholder-slate-500 border rounded-xl p-3.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/50 ${
          error
            ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
            : 'border-[#1E293B] hover:border-slate-700 focus:border-[#7C5CFC]'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-400">{helperText}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
