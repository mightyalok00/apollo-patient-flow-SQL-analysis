import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid, Cell } from 'recharts';

interface Q11DeviationBarProps {
  data: Record<string, any>[];
}

export const Q11DeviationBar: React.FC<Q11DeviationBarProps> = ({ data }) => {
  const networkAvg = Number(data[0]?.overall_average_wait) || 62.81;

  const chartData = data.map(d => {
    const deptAvg = Number(d.department_average_wait) || 0;
    const diff = +(deptAvg - networkAvg).toFixed(2);
    const diffPct = +((diff / networkAvg) * 100).toFixed(1);

    return {
      name: `${d.hospital_name?.replace('Apollo ', '')} - ${d.department_name}`,
      hospital: d.hospital_name,
      department: d.department_name,
      deptAvg,
      networkAvg,
      diff,
      diffPct,
      admissions: d.total_admissions,
    };
  }).sort((a, b) => b.diff - a.diff);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-950 text-white p-3 rounded-xl shadow-xl border border-sky-400/30 text-xs space-y-1.5 min-w-[210px]">
          <div className="font-bold text-sky-400">{d.hospital}</div>
          <div className="font-extrabold text-sm text-white">{d.department}</div>
          <div className="border-t border-slate-800 pt-1 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Department Wait:</span>
              <span className="font-mono font-bold text-white">{d.deptAvg}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Network Average:</span>
              <span className="font-mono text-slate-300">{d.networkAvg}m</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-rose-400">Deviation (+/-):</span>
              <span className="font-mono text-rose-300">+{d.diff}m (+{d.diffPct}%)</span>
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
          <h4 className="font-extrabold text-slate-900 text-sm">Waiting-Time Deviation from Network Benchmark</h4>
          <p className="text-slate-500">Departments exceeding the global network average baseline ({networkAvg} mins).</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs">
          <span className="text-slate-300">Network Baseline (0.00m):</span>
          <span className="font-mono font-bold text-sky-400">{networkAvg} mins</span>
        </div>
      </div>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} />
            <YAxis 
              domain={[0, 50]} 
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{ value: 'Minutes Above Baseline (+Δ)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#0f172a" strokeWidth={2} />
            <Bar dataKey="diff" radius={[8, 8, 0, 0]} maxBarSize={50}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#e11d48" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {chartData.map((d, idx) => (
          <div key={idx} className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
            <div className="font-bold text-rose-950 truncate">{d.name}</div>
            <div className="text-[11px] text-rose-700 font-mono">
              Avg Wait: <strong>{d.deptAvg}m</strong>
            </div>
            <div className="text-[11px] font-extrabold text-rose-800">
              +{d.diff} mins ({d.diffPct}% over benchmark)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
