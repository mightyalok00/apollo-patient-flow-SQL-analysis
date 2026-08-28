import React, { useMemo } from 'react';

interface Q7HeatmapProps {
  data: Record<string, any>[];
}

export const Q7Heatmap: React.FC<Q7HeatmapProps> = ({ data }) => {
  const hospitals = ['Apollo Delhi', 'Apollo Hyderabad', 'Apollo Mumbai', 'Apollo Bangalore'];
  const departments = ['Emergency', 'Orthopedics', 'General Medicine', 'Cardiology', 'Neurology'];

  // Lookup matrix
  const matrix = useMemo(() => {
    const map: Record<string, { readmitPct: number; readmitCount: number; total: number }> = {};
    data.forEach(d => {
      const key = `${d.hospital_name}_${d.department_name}`;
      map[key] = {
        readmitPct: Number(d.readmission_rate_percent) || 0,
        readmitCount: Number(d.total_readmissions) || 0,
        total: Number(d.total_admissions) || 0,
      };
    });
    return map;
  }, [data]);

  const getColor = (pct: number) => {
    if (pct === 0) return 'bg-slate-100 text-slate-400 border-slate-200';
    if (pct >= 40) return 'bg-rose-600 text-white font-bold border-rose-700 shadow-xs';
    if (pct >= 36) return 'bg-rose-500 text-white font-bold border-rose-600';
    if (pct >= 33) return 'bg-amber-500 text-slate-950 font-bold border-amber-600';
    if (pct >= 28) return 'bg-sky-400 text-slate-950 font-bold border-sky-500';
    return 'bg-emerald-400 text-slate-950 font-bold border-emerald-500';
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">Hospital x Department 30-Day Readmission Heatmap</h4>
          <p className="text-slate-500">2D matrix comparing patient readmission frequency across facilities and clinical wards.</p>
        </div>
        <div className="flex items-center space-x-2 text-[10px]">
          <span className="text-slate-500">Risk Gradient:</span>
          <div className="flex items-center space-x-1">
            <span className="px-1.5 py-0.5 rounded bg-emerald-400 text-slate-900 font-bold">&lt;28%</span>
            <span className="px-1.5 py-0.5 rounded bg-sky-400 text-slate-900 font-bold">28-32%</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-900 font-bold">33-36%</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold">&gt;36% High</span>
          </div>
        </div>
      </div>

      {/* 2D Heatmap Grid Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-xs text-center border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="p-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Hospital / Facility
              </th>
              {departments.map(dept => (
                <th key={dept} className="p-3 font-bold text-slate-800 text-[11px]">
                  {dept}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {hospitals.map(hosp => (
              <tr key={hosp} className="hover:bg-slate-50/60">
                <td className="p-3 text-left font-bold text-slate-900 bg-slate-50/50 border-r border-slate-200 text-xs">
                  {hosp}
                </td>
                {departments.map(dept => {
                  const entry = matrix[`${hosp}_${dept}`];
                  const pct = entry ? entry.readmitPct : 0;
                  const total = entry ? entry.total : 0;
                  const readmit = entry ? entry.readmitCount : 0;

                  return (
                    <td key={dept} className="p-2 border-r border-slate-100 last:border-r-0">
                      <div className={`p-2.5 rounded-lg border transition-transform hover:scale-105 ${getColor(pct)}`}>
                        {pct > 0 ? (
                          <>
                            <div className="font-mono text-xs sm:text-sm font-extrabold">
                              {pct.toFixed(1)}%
                            </div>
                            <div className="text-[10px] opacity-85 font-mono">
                              {readmit}/{total} pts
                            </div>
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">N/A</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-slate-500 italic">
        * Cells highlighted in rose (Apollo Delhi Orthopedics 40.8%, Apollo Delhi Emergency 37.7%, Apollo Hyderabad Emergency 37.4%) indicate high risk for 30-day care recurrence.
      </div>
    </div>
  );
};
