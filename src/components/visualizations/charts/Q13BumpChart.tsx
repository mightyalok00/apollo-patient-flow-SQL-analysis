import React, { useState } from 'react';

interface Q13BumpChartProps {
  data: Record<string, any>[];
}

export const Q13BumpChart: React.FC<Q13BumpChartProps> = ({ data }) => {
  const [activeDept, setActiveDept] = useState<string | null>(null);

  const stages = [
    { key: 'waiting_row_number', label: '1. Wait Time Rank' },
    { key: 'readmission_rank', label: '2. Readmission Rank' },
    { key: 'bed_utilization_rank', label: '3. Bed Util Rank' },
  ];

  const colors = ['#e11d48', '#f59e0b', '#0284c7', '#8b5cf6', '#10b981', '#64748b'];

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">Department Rank Trajectory Bump Chart (Window Functions)</h4>
          <p className="text-slate-500">Tracking rank shifts across Wait Latency, Readmission Rate, and Bed Utilization.</p>
        </div>
        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
          Rank #1 = Worst Operational Strain
        </span>
      </div>

      {/* SVG Bump Chart Canvas */}
      <div className="relative w-full h-[360px] bg-slate-900 rounded-2xl p-4 overflow-hidden shadow-inner">
        <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Stage vertical guidelines and headers */}
          {[180, 400, 620].map((x, idx) => (
            <g key={idx}>
              <line x1={x} y1={40} x2={x} y2={280} stroke="#334155" strokeDasharray="4 4" />
              <text x={x} y={30} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#94a3b8">
                {stages[idx].label}
              </text>
            </g>
          ))}

          {/* Lines connecting ranks for each department */}
          {data.map((d, idx) => {
            const deptKey = `${d.hospital_name}-${d.department_name}`;
            const isSelected = activeDept === null || activeDept === deptKey;
            const strokeColor = colors[idx % colors.length];

            const r1 = Number(d.waiting_row_number) || 1;
            const r2 = Number(d.readmission_rank) || 1;
            const r3 = Number(d.bed_utilization_rank) || 1;

            const y1 = 45 + r1 * 34;
            const y2 = 45 + r2 * 34;
            const y3 = 45 + r3 * 34;

            const pathD = `M 180 ${y1} C 290 ${y1}, 290 ${y2}, 400 ${y2} C 510 ${y2}, 510 ${y3}, 620 ${y3}`;

            return (
              <g 
                key={deptKey} 
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setActiveDept(deptKey)}
                onMouseLeave={() => setActiveDept(null)}
                opacity={isSelected ? 1 : 0.2}
              >
                {/* Connecting Path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 4 : 2}
                  strokeLinecap="round"
                />

                {/* Left Node & Label */}
                <circle cx={180} cy={y1} r={isSelected ? 6 : 4} fill={strokeColor} stroke="#ffffff" strokeWidth="2" />
                <text x={168} y={y1 + 4} textAnchor="end" fontSize="10" fontWeight="bold" fill={isSelected ? '#ffffff' : '#94a3b8'}>
                  {d.department_name} ({d.hospital_name?.replace('Apollo ', '')}) #{r1}
                </text>

                {/* Middle Node */}
                <circle cx={400} cy={y2} r={isSelected ? 6 : 4} fill={strokeColor} stroke="#ffffff" strokeWidth="2" />
                <text x={400} y={y2 - 8} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#bae6fd" className="font-mono">
                  #{r2}
                </text>

                {/* Right Node */}
                <circle cx={620} cy={y3} r={isSelected ? 6 : 4} fill={strokeColor} stroke="#ffffff" strokeWidth="2" />
                <text x={632} y={y3 + 4} textAnchor="start" fontSize="10" fontWeight="bold" fill={isSelected ? '#ffffff' : '#94a3b8'}>
                  Rank #{r3} ({d.bed_utilization_percent}%)
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Department Legend Filter */}
      <div className="flex flex-wrap gap-2 pt-1">
        {data.map((d, i) => {
          const deptKey = `${d.hospital_name}-${d.department_name}`;
          const isSelected = activeDept === deptKey;
          const strokeColor = colors[i % colors.length];

          return (
            <button
              key={deptKey}
              onClick={() => setActiveDept(activeDept === deptKey ? null : deptKey)}
              className={`text-xs px-3 py-1.5 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-slate-900 text-white border-slate-700 shadow-sm' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: strokeColor }} />
              <span className="font-bold">{d.department_name}</span>
              <span className="text-[10px] text-slate-400">({d.hospital_name?.replace('Apollo ', '')})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
