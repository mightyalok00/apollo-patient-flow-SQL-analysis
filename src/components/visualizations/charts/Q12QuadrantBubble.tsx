import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, ReferenceLine, Cell } from 'recharts';

interface Q12QuadrantBubbleProps {
  data: Record<string, any>[];
}

export const Q12QuadrantBubble: React.FC<Q12QuadrantBubbleProps> = ({ data }) => {
  const chartData = data.map(d => ({
    name: `${d.hospital_name?.replace('Apollo ', '')} - ${d.department_name}`,
    hospital: d.hospital_name,
    department: d.department_name,
    volume: Number(d.total_admissions) || 120,
    wait: Number(d.average_wait_minutes) || 50,
    readmission: Number(d.readmission_rate_percent) || 30,
    los: Number(d.average_length_of_stay_days) || 4.2,
    status: d.attention_status || 'Normal',
  }));

  const getColor = (status: string) => {
    if (status === 'High Attention') return '#e11d48'; // Rose
    if (status === 'Moderate Attention') return '#f59e0b'; // Amber
    return '#10b981'; // Emerald
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-950 text-white p-3 rounded-xl shadow-xl border border-sky-400/30 text-xs space-y-1.5 min-w-[210px]">
          <div className="font-extrabold text-sm text-sky-400">{d.name}</div>
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
            d.status === 'High Attention' ? 'bg-rose-900 text-rose-200' : 'bg-amber-900 text-amber-200'
          }`}>
            {d.status}
          </span>
          <div className="border-t border-slate-800 pt-1 space-y-0.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Admissions (X):</span>
              <span className="text-white font-bold">{d.volume} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Wait (Y):</span>
              <span className="text-amber-300 font-bold">{d.wait} mins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Readmission (Size):</span>
              <span className="text-rose-300 font-bold">{d.readmission}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg LOS:</span>
              <span className="text-slate-200">{d.los} days</span>
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
          <h4 className="font-extrabold text-slate-900 text-sm">Operational Attention Quadrant (Volume vs. Wait Latency)</h4>
          <p className="text-slate-500">Bubble size = 30-Day Readmission Rate (%). Categorized by Clinical Attention Priority.</p>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-bold">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span className="text-slate-700">High Attention (Wait &ge;90m &amp; Readmit &ge;30%)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-700">Moderate Attention</span>
          </span>
        </div>
      </div>

      <div className="w-full h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              type="number" 
              dataKey="volume" 
              name="Admissions" 
              domain={[100, 150]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{ value: 'Patient Volume (Admissions)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#64748b' }}
            />
            <YAxis 
              type="number" 
              dataKey="wait" 
              name="Avg Wait (min)" 
              domain={[40, 120]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{ value: 'Average Wait Time (Minutes)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }}
            />
            <ZAxis type="number" dataKey="readmission" range={[150, 600]} name="Readmission %" />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Quadrant split lines */}
            <ReferenceLine y={90} stroke="#e11d48" strokeDasharray="3 3" label={{ value: 'High Wait Split (90m)', fill: '#e11d48', fontSize: 9 }} />
            <ReferenceLine x={125} stroke="#94a3b8" strokeDasharray="3 3" />

            <Scatter data={chartData}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.status)} fillOpacity={0.85} stroke="#0f172a" strokeWidth={1} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
        <span>💡 <strong>Upper-Left Quadrant:</strong> Severe triage latency with high clinical attention priority.</span>
        <span><strong>Bottom-Right Quadrant:</strong> High patient volume handled with balanced wait times (&lt;60m).</span>
      </div>
    </div>
  );
};
