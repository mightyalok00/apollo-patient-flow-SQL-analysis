import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface Q5StackedBarProps {
  data: Record<string, any>[];
}

export const Q5StackedBar: React.FC<Q5StackedBarProps> = ({ data }) => {
  // Normalize data to 100% stacked format
  const chartData = data.map(d => {
    const low = Number(d.low_cases) || 0;
    const mod = Number(d.moderate_cases) || 0;
    const high = Number(d.high_cases) || 0;
    const crit = Number(d.critical_cases) || 0;
    const total = low + mod + high + crit || 1;

    return {
      name: `${d.hospital_name?.replace('Apollo ', '')} - ${d.department_name}`,
      hospital: d.hospital_name,
      department: d.department_name,
      total,
      low,
      mod,
      high,
      crit,
      lowPct: +( (low / total) * 100 ).toFixed(1),
      modPct: +( (mod / total) * 100 ).toFixed(1),
      highPct: +( (high / total) * 100 ).toFixed(1),
      critPct: +( (crit / total) * 100 ).toFixed(1),
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-950 text-white p-3 rounded-xl shadow-xl border border-sky-400/30 text-xs space-y-2 min-w-[220px]">
          <div className="font-extrabold text-sm text-sky-400">{d.name}</div>
          <div className="text-slate-400">Total Admissions: <strong className="text-white font-mono">{d.total}</strong></div>
          <div className="space-y-1 pt-1 border-t border-slate-800">
            <div className="flex justify-between items-center text-rose-300">
              <span>Critical (&ge;120m):</span>
              <span className="font-mono font-bold">{d.crit} ({d.critPct}%)</span>
            </div>
            <div className="flex justify-between items-center text-amber-300">
              <span>High (60-119m):</span>
              <span className="font-mono font-bold">{d.high} ({d.highPct}%)</span>
            </div>
            <div className="flex justify-between items-center text-sky-300">
              <span>Moderate (30-59m):</span>
              <span className="font-mono font-bold">{d.mod} ({d.modPct}%)</span>
            </div>
            <div className="flex justify-between items-center text-emerald-300">
              <span>Low (&lt;30m):</span>
              <span className="font-mono font-bold">{d.low} ({d.lowPct}%)</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">100% Stacked Triage Waiting-Time Distribution</h4>
          <p className="text-slate-500">Proportional classification breakdown (Low &lt;30m, Mod 30-59m, High 60-119m, Critical &ge;120m).</p>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-bold">
          <span className="text-slate-400">Standardized to 100% Volume</span>
        </div>
      </div>

      <div className="w-full h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 65 }} stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              angle={-30} 
              textAnchor="end" 
              interval={0}
              height={70}
              tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
            />
            <YAxis 
              tickFormatter={(v) => `${Math.round(v * 100)}%`}
              domain={[0, 1]}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }} 
              formatter={(value) => {
                const labels: Record<string, string> = {
                  low: 'Low (<30m)',
                  mod: 'Moderate (30-59m)',
                  high: 'High (60-119m)',
                  crit: 'Critical (≥120m)'
                };
                return <span className="text-slate-700 font-semibold">{labels[value] || value}</span>;
              }}
            />
            <Bar dataKey="low" name="low" stackId="a" fill="#10b981" />
            <Bar dataKey="mod" name="mod" stackId="a" fill="#0284c7" />
            <Bar dataKey="high" name="high" stackId="a" fill="#f59e0b" />
            <Bar dataKey="crit" name="crit" stackId="a" fill="#e11d48" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="font-bold text-slate-900 mb-1">Emergency Wards</div>
          <p className="text-slate-600">
            Emergency departments have 0% Low wait cases; over 90% of admissions are classified into High (60-119m) and Critical (≥120m) tiers.
          </p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="font-bold text-slate-900 mb-1">Elective Specialty Wards</div>
          <p className="text-slate-600">
            General Medicine and Orthopedics have 0% Critical cases, maintaining stable throughput with over 80% in Low & Moderate tiers.
          </p>
        </div>
      </div>
    </div>
  );
};
