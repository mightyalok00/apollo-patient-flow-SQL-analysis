import React, { useState } from 'react';

interface Q10SankeyFlowProps {
  data: Record<string, any>[];
}

export const Q10SankeyFlow: React.FC<Q10SankeyFlowProps> = ({ data }) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Group unique hospitals and departments from data
  const hospitals = Array.from(new Set(data.map(d => String(d.hospital_name))));
  const totalVolume = data.reduce((acc, d) => acc + (Number(d.total_admissions) || 0), 0);

  // Left column nodes (Hospitals), Right column nodes (Departments with cumulative flow)
  // Let's compute node heights and link paths
  const hospData = hospitals.map(h => {
    const items = data.filter(d => d.hospital_name === h);
    const vol = items.reduce((acc, d) => acc + (Number(d.total_admissions) || 0), 0);
    return { name: h, volume: vol, items };
  });

  const deptNames = Array.from(new Set(data.map(d => String(d.department_name))));

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">Patient Flow Sankey: Hospital &rarr; Department &rarr; Volume</h4>
          <p className="text-slate-500">Multi-stage relational flow mapping patient distribution without Cartesian fan-out.</p>
        </div>
        <div className="flex items-center space-x-2 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 text-xs">
          <span className="font-bold text-sky-950">Active Flow Volume:</span>
          <span className="font-mono font-bold text-sky-800">{totalVolume.toLocaleString()} Admissions</span>
        </div>
      </div>

      {/* SVG Sankey Diagram */}
      <div className="relative w-full h-[380px] bg-slate-900 rounded-2xl p-4 overflow-hidden shadow-inner">
        <svg viewBox="0 0 800 340" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="linkGradHover" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Links between Hospitals (Left) and Departments (Right) */}
          {data.map((row, i) => {
            const hIndex = hospitals.indexOf(row.hospital_name);
            const dIndex = deptNames.indexOf(row.department_name);
            const linkId = `${row.hospital_name}-${row.department_name}-${i}`;
            const isHovered = hoveredLink === linkId;

            const y0 = 50 + (hIndex * (240 / Math.max(1, hospitals.length - 1)));
            const y1 = 40 + (dIndex * (260 / Math.max(1, deptNames.length - 1)));

            const linkWidth = Math.max(2, (Number(row.total_admissions) / totalVolume) * 50);

            // Bezier curve path
            const pathD = `M 190 ${y0} C 350 ${y0}, 450 ${y1}, 610 ${y1}`;

            return (
              <g key={linkId}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={isHovered ? 'url(#linkGradHover)' : 'url(#linkGrad)'}
                  strokeWidth={linkWidth}
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredLink(linkId)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="cursor-pointer transition-all duration-200"
                />
              </g>
            );
          })}

          {/* Left Column: Hospital Nodes */}
          {hospData.map((h, i) => {
            const y = 50 + (i * (240 / Math.max(1, hospitals.length - 1)));
            return (
              <g key={h.name} transform={`translate(40, ${y - 18})`}>
                <rect width="150" height="36" rx="8" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="12" y="16" fontSize="11" fontWeight="bold" fill="#ffffff">
                  {h.name}
                </text>
                <text x="12" y="28" fontSize="9" fill="#bae6fd" className="font-mono">
                  {h.volume} admissions
                </text>
              </g>
            );
          })}

          {/* Right Column: Department Nodes */}
          {deptNames.map((dept, i) => {
            const y = 40 + (i * (260 / Math.max(1, deptNames.length - 1)));
            const deptAdmissions = data
              .filter(d => d.department_name === dept)
              .reduce((acc, curr) => acc + (Number(curr.total_admissions) || 0), 0);

            return (
              <g key={dept} transform={`translate(610, ${y - 18})`}>
                <rect width="150" height="36" rx="8" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
                <text x="12" y="16" fontSize="11" fontWeight="bold" fill="#38bdf8">
                  {dept}
                </text>
                <text x="12" y="28" fontSize="9" fill="#94a3b8" className="font-mono">
                  {deptAdmissions} admissions
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover detail overlay */}
        {hoveredLink && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-sky-400 text-white px-4 py-2 rounded-xl text-xs shadow-2xl flex items-center space-x-3 pointer-events-none">
            <span className="text-sky-300 font-bold">{hoveredLink.split('-')[0]}</span>
            <span>&rarr;</span>
            <span className="text-white font-bold">{hoveredLink.split('-')[1]}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {data.slice(0, 4).map((d, i) => (
          <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 truncate">{d.department_name} ({d.hospital_name?.replace('Apollo ', '')})</div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Beds: {d.total_beds}</span>
              <span className="text-sky-700 font-bold">Wait: {d.average_wait_minutes}m</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
