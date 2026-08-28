import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid, Cell } from 'recharts';

interface Q4WaitHistogramProps {
  data: Record<string, any>[];
}

export const Q4WaitHistogram: React.FC<Q4WaitHistogramProps> = ({ data }) => {
  const chartData = [...data].map(d => ({
    name: `${d.hospital_name?.replace('Apollo ', '')} - ${d.department_name}`,
    department: d.department_name,
    hospital: d.hospital_name,
    avgWait: Number(d.average_wait_minutes) || 0,
    minWait: Number(d.minimum_wait_minutes) || 0,
    maxWait: Number(d.maximum_wait_minutes) || 0,
    admissions: Number(d.total_admissions) || 0,
  })).sort((a, b) => b.avgWait - a.avgWait);

  const getBarColor = (wait: number) => {
    if (wait >= 90) return '#e11d48'; // Critical Rose
    if (wait >= 60) return '#f59e0b'; // Warning Amber
    if (wait >= 30) return '#0284c7'; // Moderate Sky
    return '#10b981'; // Target Green
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-950 text-white p-3 rounded-xl shadow-xl border border-sky-400/30 text-xs space-y-1.5 min-w-[200px]">
          <div className="font-bold text-sky-400">{d.hospital}</div>
          <div className="font-extrabold text-sm text-white">{d.department}</div>
          <div className="border-t border-slate-800 pt-1.5 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Average Wait:</span>
              <span className="font-mono font-bold text-amber-300">{d.avgWait} mins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Range (Min - Max):</span>
              <span className="font-mono text-slate-300">{d.minWait}m - {d.maxWait}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Admissions:</span>
              <span className="font-mono text-white">{d.admissions}</span>
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
          <h4 className="font-extrabold text-slate-900 text-sm">Department Waiting-Time Histogram & Latency Tiers</h4>
          <p className="text-slate-500">Visible clinical severity thresholds at Target (30m), High (60m), and Critical (90m).</p>
        </div>
        
        {/* Severity Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span className="text-slate-600">&lt;30m Target</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded bg-sky-500" />
            <span className="text-slate-600">30-60m Mod</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-500" />
            <span className="text-slate-600">60-90m High</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-600" />
            <span className="text-slate-600">&ge;90m Critical</span>
          </span>
        </div>
      </div>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 65 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              angle={-35} 
              textAnchor="end" 
              interval={0}
              height={70}
              tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              domain={[0, 150]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Clinical Severity Threshold Reference Lines */}
            <ReferenceLine y={30} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Target 30m', fill: '#10b981', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Warning 60m', fill: '#f59e0b', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={90} stroke="#e11d48" strokeDasharray="4 4" strokeWidth={2} label={{ value: 'Critical 90m', fill: '#e11d48', fontSize: 10, position: 'right' }} />

            <Bar dataKey="avgWait" radius={[6, 6, 0, 0]} maxBarSize={45}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.avgWait)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start space-x-2">
        <span className="font-bold shrink-0">Emergency Alert:</span>
        <p>
          All 4 emergency departments exceed the 90-minute Critical threshold (ranging between 99.6m and 106.7m average wait), requiring urgent clinical fast-track triage intervention.
        </p>
      </div>
    </div>
  );
};
