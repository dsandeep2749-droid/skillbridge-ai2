import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glow = false,
  hoverEffect = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-[#11182B]/90 backdrop-blur-md border border-[#1E293B] rounded-2xl p-6 ${
        glow ? 'shadow-glow-primary border-[#7C5CFC]/30' : 'shadow-card'
      } ${
        hoverEffect ? 'hover:border-[#7C5CFC]/40 hover:shadow-lg hover:shadow-[#7C5CFC]/10 transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
