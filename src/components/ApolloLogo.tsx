import React from 'react';

interface HealthcareLogoProps {
  variant?: 'full' | 'horizontal' | 'compact' | 'icon-only' | 'badge';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const HealthcareLogo: React.FC<HealthcareLogoProps> = ({
  variant = 'horizontal',
  theme = 'auto',
  className = '',
  size = 'md'
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: { title: 'text-sm font-black', sub: 'text-[9px] font-bold', tag: 'text-[7px]' },
    md: { title: 'text-base font-black', sub: 'text-[10px] font-bold', tag: 'text-[8px]' },
    lg: { title: 'text-xl font-black', sub: 'text-xs font-bold', tag: 'text-[9px]' },
    xl: { title: 'text-2xl font-black', sub: 'text-sm font-bold', tag: 'text-[10px]' }
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* Original Healthcare Analytics Pulse Vector */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
          role="img"
          aria-label="Healthcare Patient Flow SQL Analytics Logo"
        >
          {/* Base Background Shape with Teal/Indigo Gradient */}
          <rect width="100" height="100" rx="28" fill="url(#health_logo_bg)" />
          
          {/* Grid Background Lines for SQL / Data Theme */}
          <line x1="20" y1="50" x2="80" y2="50" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3" />

          {/* Heartbeat EKG Pulse Waveform into Data Flow */}
          <path 
            d="M 16 52 L 32 52 L 38 34 L 46 68 L 54 24 L 62 76 L 68 52 L 84 52" 
            stroke="url(#health_pulse_grad)" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Data Telemetry Nodes */}
          <circle cx="54" cy="24" r="3.5" fill="#38bdf8" />
          <circle cx="62" cy="76" r="3.5" fill="#f43f5e" />
          <circle cx="38" cy="34" r="2.5" fill="#38bdf8" />

          <defs>
            <linearGradient id="health_logo_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="health_pulse_grad" x1="16" y1="50" x2="84" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Wordmark */}
      {variant !== 'icon-only' && (
        <div className="ml-2.5 flex flex-col justify-center">
          <div className="flex items-center space-x-1.5 leading-tight">
            <span 
              className={`tracking-tight ${textSizes[size].title} ${
                theme === 'dark' 
                  ? 'text-white' 
                  : theme === 'light' 
                  ? 'text-slate-900' 
                  : 'text-white'
              }`}
            >
              PulseFlow
            </span>
            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
              SQL
            </span>
          </div>

          {(variant === 'full' || variant === 'horizontal') && (
            <span 
              className={`font-semibold tracking-wider text-[10px] ${
                theme === 'dark' ? 'text-slate-400' : theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Healthcare Patient Flow Analytics
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Aliased export for compatibility
export const ApolloLogo = HealthcareLogo;
