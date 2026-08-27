import React from 'react';

interface ApolloLogoProps {
  variant?: 'full' | 'horizontal' | 'compact' | 'icon-only' | 'badge';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ApolloLogo: React.FC<ApolloLogoProps> = ({
  variant = 'horizontal',
  theme = 'auto',
  className = '',
  size = 'md'
}) => {
  // Size dimensions
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: { title: 'text-base', sub: 'text-[9px]', tag: 'text-[7px]' },
    md: { title: 'text-lg', sub: 'text-[10px]', tag: 'text-[8px]' },
    lg: { title: 'text-2xl', sub: 'text-xs', tag: 'text-[9px]' },
    xl: { title: 'text-3xl', sub: 'text-sm', tag: 'text-[11px]' }
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* Official Apollo Emblem Vector */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Background Badge Circle with Apollo Brand Gradient */}
          <circle cx="60" cy="60" r="56" fill="url(#apollo_bg_grad)" stroke="#C8102E" strokeWidth="2.5" />
          
          {/* Outer Sun / Halo Ring */}
          <circle cx="60" cy="60" r="46" stroke="#F5A623" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

          {/* Torchbearer / Nurse Silhouette with Florence Nightingale Healing Lamp */}
          <g transform="translate(18, 14)">
            {/* The Radiant Torch Flame (Symbol of Health, Life & Care) */}
            <path 
              d="M 52 14 C 54 8, 62 6, 68 10 C 74 14, 76 22, 70 28 C 64 34, 52 38, 48 44 C 47 40, 48 34, 52 28 C 55 23, 56 18, 52 14 Z" 
              fill="url(#flame_grad_1)" 
            />
            <path 
              d="M 58 18 C 62 14, 68 15, 72 20 C 76 25, 74 32, 68 36 C 62 40, 56 42, 54 46 C 53 43, 54 38, 57 32 C 60 27, 60 22, 58 18 Z" 
              fill="url(#flame_grad_2)" 
              opacity="0.9"
            />
            <path 
              d="M 64 22 C 67 19, 72 21, 75 25 C 78 29, 76 34, 72 38 C 68 41, 63 43, 62 46 C 61 44, 62 40, 64 36 C 66 32, 66 27, 64 22 Z" 
              fill="#FFD166" 
              opacity="0.8"
            />

            {/* Lamp / Torch Base held by the Nurse */}
            <path 
              d="M 44 42 L 52 42 L 50 48 L 46 48 Z" 
              fill="#F5A623" 
            />
            <path 
              d="M 46 48 L 50 48 L 48 64 L 46 64 Z" 
              fill="#F5A623" 
            />

            {/* Nurse Head & Cap */}
            <ellipse cx="36" cy="34" rx="7" ry="8" fill="#FFFFFF" />
            <path 
              d="M 31 28 C 33 24, 39 24, 41 28 L 43 31 L 29 31 Z" 
              fill="#FFFFFF" 
            />
            {/* Red Cross on Cap */}
            <path d="M 36 26 L 36 30 M 34 28 L 38 28" stroke="#C8102E" strokeWidth="1.2" strokeLinecap="round" />

            {/* Caring Hands & Body Gown */}
            <path 
              d="M 28 44 C 28 40, 32 38, 36 38 C 40 38, 44 40, 44 44 L 47 62 C 47 70, 40 76, 36 76 C 32 76, 25 70, 25 62 Z" 
              fill="#FFFFFF" 
            />
            
            {/* Reaching Outward Arm Holding the Torch */}
            <path 
              d="M 39 42 C 43 42, 46 44, 48 46 L 46 49 C 44 47, 41 45, 38 45 Z" 
              fill="#FFFFFF" 
            />

            {/* Patient Support Arc (Touching Lives Emblem) */}
            <path 
              d="M 18 64 C 18 52, 26 44, 32 44 L 33 47 C 28 47, 21 54, 21 64 Z" 
              fill="url(#accent_gold)" 
            />
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="apollo_bg_grad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8A0C1E" />
              <stop offset="50%" stopColor="#A81124" />
              <stop offset="100%" stopColor="#630713" />
            </linearGradient>
            <linearGradient id="flame_grad_1" x1="48" y1="44" x2="76" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF4D4D" />
              <stop offset="40%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#FFD166" />
            </linearGradient>
            <linearGradient id="flame_grad_2" x1="54" y1="46" x2="75" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="100%" stopColor="#FFC857" />
            </linearGradient>
            <linearGradient id="accent_gold" x1="18" y1="64" x2="33" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFD166" />
              <stop offset="100%" stopColor="#F5A623" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Apollo Wordmark & Official Tagline */}
      {variant !== 'icon-only' && (
        <div className="ml-3 flex flex-col justify-center">
          <div className="flex items-baseline space-x-1.5 leading-none">
            <span 
              className={`font-black tracking-tight ${textSizes[size].title} ${
                theme === 'dark' 
                  ? 'text-white' 
                  : theme === 'light' 
                  ? 'text-slate-900' 
                  : 'text-white'
              }`}
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Apollo
            </span>
            <span 
              className={`font-bold tracking-widest uppercase ${textSizes[size].sub} ${
                theme === 'dark' 
                  ? 'text-rose-300' 
                  : theme === 'light' 
                  ? 'text-rose-700' 
                  : 'text-rose-400'
              }`}
            >
              HOSPITALS
            </span>
          </div>

          {(variant === 'full' || variant === 'horizontal') && (
            <div className="flex items-center space-x-1 mt-0.5">
              <span 
                className={`font-semibold tracking-[0.2em] uppercase ${textSizes[size].tag} ${
                  theme === 'dark' ? 'text-slate-400' : theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                TOUCHING LIVES
              </span>
              <span className="w-1 h-1 rounded-full bg-rose-500"></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
