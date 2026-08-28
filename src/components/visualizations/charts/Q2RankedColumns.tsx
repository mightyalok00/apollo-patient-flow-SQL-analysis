import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid, LabelList } from 'recharts';

interface Q2RankedColumnsProps {
  data: Record<string, any>[];
}

export const Q2RankedColumns: React.FC<Q2RankedColumnsProps> = ({ data }) => {
  // Sort descending by total_admissions if not already sorted
  const sortedData = [...data].sort((a, b) => (b.total_admissions || 0) - (a.total_admissions || 0));
  const maxVal = Math.max(...sortedData.map(d => d.total_admissions || 0), 100);
  const totalNetworkAdmissions = sortedData.reduce((acc, curr) => acc + (curr.total_admissions || 0), 0);

  const colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const pct = totalNetworkAdmissions > 0 ? ((d.total_admissions / totalNetworkAdmissions) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-950 text-white p-3 rounded-xl shadow-xl border border-sky-400/30 text-xs space-y-1">
          <div className="font-extrabold text-sm text-sky-400">{d.hospital_name}</div>
          <div className="text-slate-300">City: <span className="text-white font-semibold">{d.city || 'India'}</span></div>
          <div className="text-slate-300">Total Admissions: <span className="text-white font-mono font-bold">{d.total_admissions?.toLocaleString()}</span></div>
          <div className="text-sky-300 text-[11px]">Share of Network: <span className="text-white font-bold">{pct}%</span></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">Hospital Inpatient Admission Volume</h4>
          <p className="text-slate-500">Ranked workload distribution across 4 regional Apollo hospitals.</p>
        </div>
        <div className="flex items-center space-x-2 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
          <span className="font-bold text-sky-950">Network Total:</span>
          <span className="font-mono font-black text-sky-800 text-sm">{totalNetworkAdmissions.toLocaleString()} Admissions</span>
        </div>
      </div>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="hospital_name" 
              tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis 
              domain={[0, Math.ceil(maxVal * 1.15)]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total_admissions" radius={[8, 8, 0, 0]} maxBarSize={60}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
              <LabelList 
                dataKey="total_admissions" 
                position="top" 
                fill="#0f172a" 
                fontSize={12} 
                fontWeight={800}
                formatter={(val: number) => val.toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ranked Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {sortedData.map((h, i) => (
          <div key={h.hospital_id || i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Rank #{i + 1}</span>
              <div className="font-bold text-xs text-slate-900 truncate">{h.hospital_name}</div>
              <div className="text-[11px] text-slate-500">{h.city}</div>
            </div>
            <div className="text-right">
              <span className="text-base font-black font-mono text-sky-800">{h.total_admissions}</span>
              <div className="text-[10px] text-slate-400 font-medium">cases</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
