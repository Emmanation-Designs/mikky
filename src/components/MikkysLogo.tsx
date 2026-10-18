import React from 'react';

interface MikkysLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'mono';
  showSubtitle?: boolean;
  className?: string;
}

export const MikkysLogo: React.FC<MikkysLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-sm font-extrabold tracking-wider',
    md: 'text-lg font-black tracking-widest',
    lg: 'text-2xl font-black tracking-widest',
    xl: 'text-3xl font-black tracking-widest',
  };

  const subSizes = {
    sm: 'text-[7px] tracking-[0.25em]',
    md: 'text-[9px] tracking-[0.3em]',
    lg: 'text-[11px] tracking-[0.35em]',
    xl: 'text-[13px] tracking-[0.4em]',
  };

  const isLight = variant === 'light';
  const textColor = isLight ? 'text-black' : 'text-white';
  const subColor = isLight ? 'text-[#F10B20]' : 'text-[#F10B20]';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Stylized Red Scissor "M" Mark */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(241,11,32,0.4)]"
        >
          {/* Scissor Left Blade to Right Handle */}
          <path
            d="M20 20L50 65L80 20"
            stroke="#F10B20"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* M Outer Legs */}
          <path
            d="M20 80V25L50 65L80 25V80"
            stroke="#F10B20"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Scissor Pivot Pin */}
          <circle cx="50" cy="65" r="5" fill="#FFFFFF" />
          {/* Subtle Scissor Blade Cuts */}
          <circle cx="28" cy="84" r="7" stroke="#F10B20" strokeWidth="4" />
          <circle cx="72" cy="84" r="7" stroke="#F10B20" strokeWidth="4" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span className={`font-display uppercase font-black ${titleSizes[size]} ${textColor}`}>
          Mikkys
        </span>
        {showSubtitle && (
          <span className={`font-display uppercase font-bold mt-0.5 ${subSizes[size]} ${subColor}`}>
            Barbing Salon
          </span>
        )}
      </div>
    </div>
  );
};
