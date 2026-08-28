import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, LabelList } from 'recharts';

interface Q8FrequencyDistributionProps {
  data: Record<string, any>[];
}

export const Q8FrequencyDistribution: React.FC<Q8FrequencyDistributionProps> = ({ data }) => {
  // Buckets of patient recurrence across 500 patient cohort
  const bucketCounts = [
    { bucket: '1 Admission', count: 18, pct: '3.6%', desc: 'Single-event patients' },
    { bucket: '2-3 Admissions', count: 114, pct: '22.8%', desc: 'Occasional recurring' },
    { bucket: '4-6 Admissions', count: 246, pct: '49.2%', desc: 'Moderate frequent attenders' },
    { bucket: '7-9 Admissions', count: 104, pct: '20.8%', desc: 'High chronic attenders' },
    { bucket: '10-11 Admissions', count: 18, pct: '3.6%', desc: 'Super-utilizer cohort (Rank 1-2)' },
  ];

  const colors = ['#94a3b8', '#38bdf8', '#0284c7', '#f59e0b', '#e11d48'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-950 text-white p-3 rounded-xl shadow-xl border border-sky-400/30 text-xs space-y-1">
          <div className="font-bold text-sky-400">{d.bucket}</div>
          <div className="text-slate-300">Patients in Tier: <strong className="text-white font-mono">{d.count} patients</strong></div>
          <div className="text-slate-300">Share of Total Cohort: <strong className="text-amber-300">{d.pct}</strong></div>
          <div className="text-[11px] text-slate-400 italic pt-1">{d.desc}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">Frequency Distribution of Admissions per Patient</h4>
          <p className="text-slate-500">Recurrence stratification across the 500 patient cohort (96.4% repeat rate).</p>
        </div>
        <div className="flex items-center space-x-2 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 text-[11px]">
          <span className="font-bold text-sky-950">Cohort Mean:</span>
          <span className="font-mono font-bold text-sky-800">5.0 Admissions / Patient</span>
        </div>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bucketCounts} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
              {bucketCounts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
              <LabelList dataKey="count" position="top" fill="#0f172a" fontSize={11} fontWeight={800} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 6 Super-Utilizers Table from Query Result */}
      <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
        <div className="bg-slate-100 px-3.5 py-2 font-bold text-slate-800 text-[11px] flex justify-between">
          <span>Top Super-Utilizer Patients (DENSE_RANK)</span>
          <span className="text-slate-500">Cross-Facility Mobility</span>
        </div>
        <div className="divide-y divide-slate-100 bg-white max-h-[160px] overflow-y-auto">
          {data.slice(0, 6).map((p, i) => (
            <div key={i} className="px-3.5 py-2 flex items-center justify-between hover:bg-slate-50">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-800 font-mono font-bold text-[10px] flex items-center justify-center">
                  #{p.admission_rank}
                </span>
                <span className="font-bold text-slate-900">{p.patient_name}</span>
                <span className="text-[11px] text-slate-500">({p.gender}, {p.patient_city})</span>
              </div>
              <div className="flex items-center space-x-3 text-right">
                <span className="font-mono font-black text-rose-700">{p.total_admissions} admissions</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                  {p.hospitals_visited} hospitals visited
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
