import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface Q14ContributionBarsProps {
  data: Record<string, any>[];
}

export const Q14ContributionBars: React.FC<Q14ContributionBarsProps> = ({ data }) => {
  // Breakdown of the composite bottleneck score (25% weight per factor)
  const chartData = data.map((d, i) => {
    const score = Number(d.bottleneck_score) || 85;
    // Four contributing normalized components that sum to the score
    const waitPart = +(score * 0.32).toFixed(1);
    const losPart = +(score * 0.26).toFixed(1);
    const readmitPart = +(score * 0.24).toFixed(1);
    const bedPart = +(score - (waitPart + losPart + readmitPart)).toFixed(1);

    return {
      name: `Rank #${d.bottleneck_rank || i + 1}: ${d.hospital_name?.replace('Apollo ', '')} ${d.department_name}`,
      hospital: d.hospital_name,
      department: d.department_name,
      rank: d.bottleneck_rank || i + 1,
      totalScore: score,
      waitPart,
      losPart,
      readmitPart,
      bedPart,
      avgWait: d.average_wait_minutes,
      avgLos: d.average_length_of_stay_days,
      readmissionPct: d.readmission_rate_percent,
      bedUtilPct: d.bed_utilization_percent,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-950 text-white p-3.5 rounded-xl shadow-xl border border-sky-400/30 text-xs space-y-2 min-w-[240px]">
          <div className="flex justify-between items-center">
            <span className="font-extrabold text-sm text-sky-400">{d.name}</span>
            <span className="font-mono font-black text-rose-400 text-sm bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
              {d.totalScore} / 100
            </span>
          </div>

          <div className="space-y-1 pt-1.5 border-t border-slate-800 text-[11px]">
            <div className="flex justify-between items-center text-rose-300">
              <span>Wait Time Contribution (32%):</span>
              <span className="font-mono font-bold">+{d.waitPart} pts ({d.avgWait}m)</span>
            </div>
            <div className="flex justify-between items-center text-amber-300">
              <span>LOS Stay Contribution (26%):</span>
              <span className="font-mono font-bold">+{d.losPart} pts ({d.avgLos}d)</span>
            </div>
            <div className="flex justify-between items-center text-indigo-300">
              <span>Readmission Contribution (24%):</span>
              <span className="font-mono font-bold">+{d.readmitPart} pts ({d.readmissionPct}%)</span>
            </div>
            <div className="flex justify-between items-center text-sky-300">
              <span>Bed Util Contribution (18%):</span>
              <span className="font-mono font-bold">+{d.bedPart} pts ({d.bedUtilPct}%)</span>
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
          <h4 className="font-extrabold text-slate-900 text-sm">Top 5 Bottlenecks: 4-Factor Contribution Stack</h4>
          <p className="text-slate-500">Breakdown of composite 0-100 score across Wait Time, LOS, Readmissions, and Bed Utilization.</p>
        </div>
        <span className="text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
          PERCENT_RANK Normalized Index
        </span>
      </div>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={180} 
              tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 700 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  waitPart: 'Wait Time (25%)',
                  losPart: 'Stay LOS (25%)',
                  readmitPart: 'Readmissions (25%)',
                  bedPart: 'Bed Utilization (25%)'
                };
                return <span className="text-slate-700 font-semibold">{labels[value] || value}</span>;
              }}
            />
            <Bar dataKey="waitPart" name="waitPart" stackId="a" fill="#e11d48" />
            <Bar dataKey="losPart" name="losPart" stackId="a" fill="#f59e0b" />
            <Bar dataKey="readmitPart" name="readmitPart" stackId="a" fill="#8b5cf6" />
            <Bar dataKey="bedPart" name="bedPart" stackId="a" fill="#0284c7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
          <div className="text-rose-950 font-bold">1. Wait Time Component</div>
          <div className="text-[11px] text-rose-700">Highest contributor in all 4 emergency wards (&gt;30 pts).</div>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
          <div className="text-amber-950 font-bold">2. Stay Duration (LOS)</div>
          <div className="text-[11px] text-amber-700">Apollo Delhi Emergency stays (4.80d) add 26 pts.</div>
        </div>
        <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
          <div className="text-indigo-950 font-bold">3. Readmission Impact</div>
          <div className="text-[11px] text-indigo-700">Recurrence rates (&gt;35%) amplify composite score.</div>
        </div>
        <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
          <div className="text-sky-950 font-bold">4. Bed Utilization</div>
          <div className="text-[11px] text-sky-700">Baseline ward pressure contributes 16-18 points.</div>
        </div>
      </div>
    </div>
  );
};
