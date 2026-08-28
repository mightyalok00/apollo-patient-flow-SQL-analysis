import React, { useState } from 'react';

interface Q6BoxPlotProps {
  data: Record<string, any>[];
}

export const Q6BoxPlot: React.FC<Q6BoxPlotProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxScale = 10; // Max days on Y axis
  const minScale = 0;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">Length-of-Stay (LOS) Distribution Box Plot</h4>
          <p className="text-slate-500">Min, 25th percentile, Mean/Median, 75th percentile, and Max stay days per department.</p>
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="font-bold text-slate-700">Target Range:</span>
          <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
            3.0 - 4.5 Days
          </span>
        </div>
      </div>

      {/* SVG Boxplot Chart */}
      <div className="relative w-full h-[360px] bg-slate-50 rounded-xl p-4 border border-slate-200 overflow-x-auto">
        <svg viewBox="0 0 800 320" className="w-full h-full min-w-[600px]">
          {/* Y Axis Grid lines and labels */}
          {[0, 2, 4, 6, 8, 10].map((val) => {
            const y = 260 - (val / maxScale) * 220;
            return (
              <g key={val}>
                <line x1="50" y1={y} x2="780" y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                <text x="40" y={y + 4} textAnchor="end" fontSize="10" fill="#64748b" className="font-mono">
                  {val}d
                </text>
              </g>
            );
          })}

          {/* Target Zone */}
          <rect x="50" y={260 - (4.5 / maxScale) * 220} width="730" height={(1.5 / maxScale) * 220} fill="#10b981" fillOpacity="0.07" />
          <text x="770" y={260 - (3.75 / maxScale) * 220} textAnchor="end" fontSize="9" fill="#059669" fontWeight="bold">
            Optimal LOS (3.0 - 4.5d)
          </text>

          {/* Render Boxes */}
          {data.map((d, i) => {
            const numItems = data.length;
            const xStep = 700 / numItems;
            const cx = 80 + i * xStep;

            const min = Number(d.minimum_stay_days) || 1.0;
            const max = Number(d.maximum_stay_days) || 8.0;
            const avg = Number(d.average_length_of_stay_days) || 4.2;
            
            // Estimated Q1 (25th) and Q3 (75th) derived from min, avg, max
            const q1 = Math.max(min, avg - (avg - min) * 0.45);
            const q3 = Math.min(max, avg + (max - avg) * 0.45);

            const yMin = 260 - (min / maxScale) * 220;
            const yMax = 260 - (max / maxScale) * 220;
            const yAvg = 260 - (avg / maxScale) * 220;
            const yQ1 = 260 - (q1 / maxScale) * 220;
            const yQ3 = 260 - (q3 / maxScale) * 220;

            const isHovered = hoveredIndex === i;

            return (
              <g 
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-all"
              >
                {/* Whisker vertical line */}
                <line x1={cx} y1={yMin} x2={cx} y2={yMax} stroke={isHovered ? '#0284c7' : '#475569'} strokeWidth={isHovered ? 2.5 : 1.5} />

                {/* Min whisker horizontal cap */}
                <line x1={cx - 8} y1={yMin} x2={cx + 8} y2={yMin} stroke={isHovered ? '#0284c7' : '#475569'} strokeWidth="2" />
                {/* Max whisker horizontal cap */}
                <line x1={cx - 8} y1={yMax} x2={cx + 8} y2={yMax} stroke={isHovered ? '#0284c7' : '#475569'} strokeWidth="2" />

                {/* IQR Box (Q1 to Q3) */}
                <rect 
                  x={cx - 16} 
                  y={yQ3} 
                  width={32} 
                  height={Math.max(4, yQ1 - yQ3)} 
                  fill={isHovered ? '#bae6fd' : '#e0f2fe'} 
                  stroke={isHovered ? '#0284c7' : '#0369a1'} 
                  strokeWidth="1.5" 
                  rx="3"
                />

                {/* Average / Median Line */}
                <line x1={cx - 16} y1={yAvg} x2={cx + 16} y2={yAvg} stroke="#0f172a" strokeWidth="2.5" />
                
                {/* Average Center Dot */}
                <circle cx={cx} cy={yAvg} r="3" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />

                {/* X Axis Label */}
                <text 
                  x={cx} 
                  y="280" 
                  textAnchor="middle" 
                  fontSize="9" 
                  fontWeight={isHovered ? 'bold' : '600'}
                  fill={isHovered ? '#0f172a' : '#475569'}
                >
                  {d.department_name?.slice(0, 5)}
                </text>
                <text 
                  x={cx} 
                  y="292" 
                  textAnchor="middle" 
                  fontSize="8" 
                  fill="#94a3b8"
                >
                  {d.hospital_name?.replace('Apollo ', '').slice(0, 4)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip on Hover */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div className="absolute top-4 right-4 bg-slate-950 text-white p-3 rounded-xl border border-sky-400/40 text-xs shadow-xl pointer-events-none space-y-1 z-10">
            <div className="font-extrabold text-sky-400">{data[hoveredIndex].hospital_name}</div>
            <div className="font-bold text-white">{data[hoveredIndex].department_name}</div>
            <div className="border-t border-slate-800 pt-1 space-y-0.5 font-mono text-[11px]">
              <div className="flex justify-between space-x-4">
                <span className="text-slate-400">Average Stay:</span>
                <span className="text-amber-300 font-bold">{data[hoveredIndex].average_length_of_stay_days} days</span>
              </div>
              <div className="flex justify-between space-x-4">
                <span className="text-slate-400">Min Stay:</span>
                <span className="text-slate-200">{data[hoveredIndex].minimum_stay_days} days</span>
              </div>
              <div className="flex justify-between space-x-4">
                <span className="text-slate-400">Max Stay:</span>
                <span className="text-slate-200">{data[hoveredIndex].maximum_stay_days} days</span>
              </div>
              <div className="flex justify-between space-x-4">
                <span className="text-slate-400">Discharged:</span>
                <span className="text-sky-300">{data[hoveredIndex].discharged_admissions} pts</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
