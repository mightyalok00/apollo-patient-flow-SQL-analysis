import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Clock, 
  Activity, 
  ArrowUpRight, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle,
  Stethoscope,
  Building2,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { DEPARTMENT_BOTTLENECKS, WAIT_TIME_CLASSIFICATION } from '../data/hospitalData';

interface BottleneckAnalysisProps {
  onSelectQuery: (questionNumber: number) => void;
}

export const BottleneckAnalysis: React.FC<BottleneckAnalysisProps> = ({ onSelectQuery }) => {
  const [filterHospital, setFilterHospital] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredBottlenecks = DEPARTMENT_BOTTLENECKS.filter(item => {
    const matchHosp = filterHospital === 'All' || item.hospital_name === filterHospital;
    const matchStat = filterStatus === 'All' || item.status === filterStatus;
    return matchHosp && matchStat;
  });

  // Prepare scatter data for LOS vs Readmission Rate
  const scatterData = DEPARTMENT_BOTTLENECKS.map(item => ({
    name: `${item.hospital_name} ${item.department_name}`,
    los: item.avg_los_days,
    readmission: item.readmission_rate_pct,
    wait: item.avg_wait_minutes,
    score: item.bottleneck_score,
    status: item.status,
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner: Composite Bottleneck Methodology */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Flame className="w-80 h-80 text-rose-500" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-rose-300 mb-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Question 14: Multi-Factor Bottleneck Scoring Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Hospital Patient Flow Bottleneck Rankings
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl mb-5">
            Statistical percentiles calculated via <code className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-rose-300 font-bold">PERCENT_RANK()</code> across four operational dimensions: 
            <strong> Triage Wait Time (35%)</strong>, <strong> Length of Stay (25%)</strong>, <strong> Readmission Rate (25%)</strong>, and <strong> Bed Utilization (15%)</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-rose-900/50 backdrop-blur-xs">
              <span className="text-slate-400 block text-[11px]">#1 Critical Bottleneck:</span>
              <span className="font-bold text-rose-400 text-sm">Apollo Delhi Emergency (Score: 92.11)</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-amber-900/50 backdrop-blur-xs">
              <span className="text-slate-400 block text-[11px]">Peak Latency Ward:</span>
              <span className="font-bold text-amber-400 text-sm">Apollo Bangalore Emergency (106.7 min)</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-orange-900/50 backdrop-blur-xs">
              <span className="text-slate-400 block text-[11px]">Highest Readmission:</span>
              <span className="font-bold text-orange-400 text-sm">Apollo Delhi Orthopedics (40.77%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Department Crisis Alert Card */}
      <div className="bg-rose-50/80 border-l-4 border-rose-600 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2 text-rose-950 font-bold">
            <Flame className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-extrabold">Emergency Departments Account for All Top 4 Critical Bottlenecks</h2>
          </div>
          <button
            id="btn-inspect-q14-direct"
            onClick={() => onSelectQuery(14)}
            className="text-xs font-bold text-rose-900 hover:text-white bg-rose-200 hover:bg-rose-600 px-3.5 py-1.5 rounded-lg flex items-center space-x-1 transition-all shadow-2xs cursor-pointer"
          >
            <span>Inspect SQL Query (Q14)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-rose-800 leading-relaxed mb-4">
          All four hospital Emergency wards demonstrate average wait times exceeding 99 minutes (+65% above overall benchmark), elevated 30-day readmissions (34.7% to 37.7%), and higher average length of stay (4.5 to 4.8 days).
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DEPARTMENT_BOTTLENECKS.filter(d => d.department_name === 'Emergency').map((em) => (
            <div key={em.hospital_name} className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span className="truncate">{em.hospital_name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-extrabold bg-rose-100 text-rose-800">
                  Rank #{em.rank}
                </span>
              </div>
              <div className="text-2xl font-black text-rose-600 mb-1">{em.bottleneck_score} <span className="text-xs text-slate-400 font-normal">/100</span></div>
              <div className="text-[11px] text-slate-600 space-y-0.5 font-medium">
                <div>Wait: <span className="font-bold text-slate-900">{em.avg_wait_minutes} min</span></div>
                <div>Stay: <span className="font-bold text-slate-900">{em.avg_los_days} days</span></div>
                <div>Readm: <span className="font-bold text-slate-900">{em.readmission_rate_pct}%</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Dimensional Matrix: Length of Stay vs Readmission Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Length of Stay vs Readmission Matrix</h3>
                <p className="text-xs text-slate-500">Bubble size represents wait latency; color reflects bottleneck status</p>
              </div>
              <button
                id="btn-inspect-q6"
                onClick={() => onSelectQuery(6)}
                className="text-xs text-sky-600 font-bold hover:underline flex items-center cursor-pointer"
              >
                <span>Query 6</span>
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    type="number" 
                    dataKey="los" 
                    name="Avg Stay (Days)" 
                    domain={[4.0, 5.0]} 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    label={{ value: 'Avg Length of Stay (Days)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#94a3b8' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="readmission" 
                    name="Readmission Rate (%)" 
                    domain={[25, 45]} 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    label={{ value: 'Readmission %', angle: -90, position: 'insideLeft', offset: 25, fontSize: 11, fill: '#94a3b8' }}
                  />
                  <ZAxis type="number" dataKey="wait" range={[60, 240]} name="Wait Time" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (!payload || payload.length === 0) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl border border-slate-800">
                          <div className="font-bold text-sky-400 mb-1">{data.name}</div>
                          <div className="space-y-0.5 text-slate-300">
                            <div>Score: <strong className="text-white">{data.score}</strong> ({data.status})</div>
                            <div>Length of Stay: <strong className="text-white">{data.los} days</strong></div>
                            <div>Readmission Rate: <strong className="text-white">{data.readmission}%</strong></div>
                            <div>Avg Wait Time: <strong className="text-amber-400">{data.wait} min</strong></div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData}>
                    {scatterData.map((entry, index) => {
                      const color = entry.status === 'Critical' ? '#ef4444' : entry.status === 'High Risk' ? '#f97316' : entry.status === 'Moderate' ? '#f59e0b' : '#10b981';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="font-semibold">Critical (&gt;80)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="font-semibold">High Risk (60-80)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="font-semibold">Moderate (40-60)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-semibold">Normal (&lt;40)</span>
            </span>
          </div>
        </div>

        {/* Triage Stratification */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Waiting-Time Stratification</h3>
                <p className="text-xs text-slate-500">Question 5: CASE-based admission classification</p>
              </div>
              <button
                id="btn-inspect-q5"
                onClick={() => onSelectQuery(5)}
                className="text-xs text-sky-600 font-bold hover:underline flex items-center cursor-pointer"
              >
                <span>Query 5</span>
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="space-y-3">
              {WAIT_TIME_CLASSIFICATION.map((tier) => (
                <div key={tier.category} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{tier.category}</span>
                    <span className="font-mono px-2 py-0.5 rounded text-white text-[10px] font-bold" style={{ backgroundColor: tier.color }}>
                      {tier.count} cases ({tier.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${tier.percentage}%`, backgroundColor: tier.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-900 mt-4">
            <div className="font-bold mb-0.5 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>Target Clinical Standard: &lt; 45 minutes</span>
            </div>
            <p className="text-[11px] text-sky-800">
              61.3% of admissions experience triage latency exceeding the 45-minute benchmark, requiring surge physician allocation.
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Bottleneck Ranking Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Ranked Department Bottleneck Index</h3>
            <p className="text-xs text-slate-500">Full 20-department composite pressure table</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterHospital}
              onChange={(e) => setFilterHospital(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Hospitals</option>
              <option value="Apollo Delhi">Apollo Delhi</option>
              <option value="Apollo Mumbai">Apollo Mumbai</option>
              <option value="Apollo Bangalore">Apollo Bangalore</option>
              <option value="Apollo Hyderabad">Apollo Hyderabad</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical</option>
              <option value="High Risk">High Risk</option>
              <option value="Moderate">Moderate</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 uppercase font-bold tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Hospital</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Admissions</th>
                <th className="px-4 py-3">Avg Wait</th>
                <th className="px-4 py-3">Avg Stay</th>
                <th className="px-4 py-3">Readm Rate</th>
                <th className="px-4 py-3">Bed Util</th>
                <th className="px-4 py-3">Bottleneck Score</th>
                <th className="px-4 py-3">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBottlenecks.map((item) => {
                const statusBadge = item.status === 'Critical' 
                  ? 'bg-rose-100 text-rose-800 border-rose-200' 
                  : item.status === 'High Risk' 
                  ? 'bg-orange-100 text-orange-800 border-orange-200' 
                  : item.status === 'Moderate' 
                  ? 'bg-amber-100 text-amber-800 border-amber-200' 
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200';

                return (
                  <tr key={`${item.hospital_name}-${item.department_name}`} className="hover:bg-sky-50/40 transition-colors">
                    <td className="px-4 py-3 font-extrabold text-slate-900">
                      #{item.rank}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {item.hospital_name}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {item.department_name}
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-mono">
                      {item.total_admissions}
                    </td>
                    <td className="px-4 py-3 font-bold font-mono text-slate-800">
                      {item.avg_wait_minutes} min
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-mono">
                      {item.avg_los_days} days
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-mono">
                      {item.readmission_rate_pct}%
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-mono">
                      {item.bed_utilization_pct}%
                    </td>
                    <td className="px-4 py-3 font-black text-sky-800 font-mono text-sm">
                      {item.bottleneck_score}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${statusBadge}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Mitigation & Operational Decision Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center space-x-2 text-rose-700 font-extrabold text-xs uppercase mb-1.5">
            <Flame className="w-4 h-4" />
            <span>Emergency Surge Triage Protocol</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Deploy dynamic dual-triage physician staffing during peak hours (14:00 - 20:00) in Bangalore & Delhi to bring latency under 45 minutes.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center space-x-2 text-amber-700 font-extrabold text-xs uppercase mb-1.5">
            <Clock className="w-4 h-4" />
            <span>Post-Op Orthopedic Care Plan</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Implement 72-hour tele-health checkups in Delhi Orthopedics to reduce post-discharge complication readmissions from 40.77% to &lt;20%.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center space-x-2 text-sky-700 font-extrabold text-xs uppercase mb-1.5">
            <Building2 className="w-4 h-4" />
            <span>Automated Bed Discharge Census</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Synchronize daily bed occupancy reporting across Cardiology and General Medicine to eliminate bed bottlenecks before 11:00 AM daily.
          </p>
        </div>
      </div>
    </div>
  );
};
