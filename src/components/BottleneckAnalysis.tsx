import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  AlertTriangle, 
  Clock, 
  Bed, 
  ArrowUpRight, 
  Filter, 
  Activity, 
  ShieldAlert,
  Building2,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp
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
import { 
  DEPARTMENT_BOTTLENECKS, 
  BOTTLENECK_WEIGHTS, 
  WAIT_TIME_CLASSIFICATION 
} from '../data/hospitalData';

interface BottleneckAnalysisProps {
  onSelectQuery: (questionNumber: number) => void;
}

export const BottleneckAnalysis: React.FC<BottleneckAnalysisProps> = ({ onSelectQuery }) => {
  const [filterHospital, setFilterHospital] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedDeptDetail, setSelectedDeptDetail] = useState<string | null>('Apollo Delhi-Emergency');

  const filteredBottlenecks = useMemo(() => {
    return DEPARTMENT_BOTTLENECKS.filter((item) => {
      if (filterHospital !== 'All' && item.hospital_name !== filterHospital) return false;
      if (filterStatus !== 'All' && item.status !== filterStatus) return false;
      return true;
    });
  }, [filterHospital, filterStatus]);

  // Scatter chart data
  const scatterData = DEPARTMENT_BOTTLENECKS.map((d) => ({
    name: `${d.hospital_name} - ${d.department_name}`,
    los: d.avg_los_days,
    readmission: d.readmission_rate_pct,
    wait: d.avg_wait_minutes,
    score: d.bottleneck_score,
    status: d.status
  }));

  const activeDetailItem = useMemo(() => {
    if (!selectedDeptDetail) return DEPARTMENT_BOTTLENECKS[0];
    return DEPARTMENT_BOTTLENECKS.find(
      d => `${d.hospital_name}-${d.department_name}` === selectedDeptDetail
    ) || DEPARTMENT_BOTTLENECKS[0];
  }, [selectedDeptDetail]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Question 14: Multi-Criteria Clinical Strain Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Composite Department Bottleneck Matrix
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
            Advanced SQL Window Ranking algorithm assigning weighted percentile scores across 4 key operational dimensions (Wait Latency 25%, Length of Stay 25%, 30-Day Readmission 25%, and Bed Utilization 25%) across all 20 hospital departments.
          </p>

          <button
            onClick={() => onSelectQuery(14)}
            aria-label="Inspect SQL Implementation of Query 14"
            className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus:outline-hidden"
          >
            <span>Inspect SQL CTE & Window Ranking (Q14)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4-DIMENSIONAL METRIC WEIGHTING & NORMALIZATION BREAKDOWN PANEL              */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Q14 Composite Score Formula & Dimension Weights</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Each metric contributes up to 25.0 points based on normalized percentile rankings across all 20 departments.
            </p>
          </div>
          <div className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-900 text-sky-300 font-bold">
            Total Score = Σ(Weight × Metric Rank) / 100
          </div>
        </div>

        {/* 4 Weight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60">
            <div className="flex items-center justify-between text-xs font-extrabold text-rose-900 mb-1">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-600" />
                <span>Triage Wait Latency</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-200 text-rose-800 font-mono font-black">25%</span>
            </div>
            <div className="text-[11px] text-rose-800 leading-relaxed">
              Percentile rank of average triage wait minutes. Max 25.0 pts. High in Emergency (avg &gt;100 min).
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/60">
            <div className="flex items-center justify-between text-xs font-extrabold text-indigo-900 mb-1">
              <span className="flex items-center space-x-1.5">
                <Bed className="w-3.5 h-3.5 text-indigo-600" />
                <span>Length of Stay (LOS)</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-200 text-indigo-800 font-mono font-black">25%</span>
            </div>
            <div className="text-[11px] text-indigo-800 leading-relaxed">
              Percentile rank of mean inpatient duration in days. Max 25.0 pts. Reflects discharge delays.
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60">
            <div className="flex items-center justify-between text-xs font-extrabold text-amber-900 mb-1">
              <span className="flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>30-Day Readmissions</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-800 font-mono font-black">25%</span>
            </div>
            <div className="text-[11px] text-amber-800 leading-relaxed">
              Percentile rank of 30-day bouncebacks. Max 25.0 pts. Peaks in Orthopedics (40.77%) & Cardiology.
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60">
            <div className="flex items-center justify-between text-xs font-extrabold text-emerald-900 mb-1">
              <span className="flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bed Capacity Strain</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-800 font-mono font-black">25%</span>
            </div>
            <div className="text-[11px] text-emerald-800 leading-relaxed">
              Percentile rank of active ward bed occupancy. Max 25.0 pts. Evaluates inpatient bed shortages.
            </div>
          </div>
        </div>
      </div>

      {/* Critical Emergency Department Strain Highlight */}
      <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-rose-600" />
            <h2 className="text-sm font-extrabold text-rose-900">
              Systemic Alert: All 4 Emergency Departments Dominate Top 4 Bottleneck Ranks
            </h2>
          </div>
          <button
            onClick={() => onSelectQuery(14)}
            className="text-xs font-bold text-rose-900 hover:text-white bg-rose-200 hover:bg-rose-600 px-3.5 py-1.5 rounded-lg flex items-center space-x-1 transition-all cursor-pointer"
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
            <div 
              key={em.hospital_name} 
              onClick={() => setSelectedDeptDetail(`${em.hospital_name}-${em.department_name}`)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedDeptDetail === `${em.hospital_name}-${em.department_name}`
                  ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-300'
                  : 'bg-white/80 border-rose-200 hover:bg-white'
              }`}
            >
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
                aria-label="Inspect Query 6"
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

        {/* Triage Stratification & Selected Department Breakdown Card */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Score Contribution Inspector</h3>
                <p className="text-xs text-slate-500">Why does this department receive its score?</p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                Rank #{activeDetailItem.rank}
              </span>
            </div>

            {/* Detailed Contribution Breakdown for Selected Department */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-sm text-slate-900">
                    {activeDetailItem.hospital_name} - {activeDetailItem.department_name}
                  </div>
                  <div className="text-xs text-slate-500">{activeDetailItem.total_admissions} admissions indexed</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-rose-600">{activeDetailItem.bottleneck_score}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">{activeDetailItem.status}</div>
                </div>
              </div>

              {/* 4 Stacked Dimension Points */}
              <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>⏱️ Triage Wait: {activeDetailItem.avg_wait_minutes} min</span>
                    <span className="font-mono text-rose-600 font-bold">{activeDetailItem.wait_contribution ?? 0} / 25 pts</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${((activeDetailItem.wait_contribution ?? 0) / 25) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>🛏️ Length of Stay: {activeDetailItem.avg_los_days} days</span>
                    <span className="font-mono text-indigo-600 font-bold">{activeDetailItem.los_contribution ?? 0} / 25 pts</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${((activeDetailItem.los_contribution ?? 0) / 25) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>🔄 Readmission: {activeDetailItem.readmission_rate_pct}%</span>
                    <span className="font-mono text-amber-600 font-bold">{activeDetailItem.readmission_contribution ?? 0} / 25 pts</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${((activeDetailItem.readmission_contribution ?? 0) / 25) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>🏥 Bed Util: {activeDetailItem.bed_utilization_pct}%</span>
                    <span className="font-mono text-emerald-600 font-bold">{activeDetailItem.bed_util_contribution ?? 0} / 25 pts</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${((activeDetailItem.bed_util_contribution ?? 0) / 25) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-900 mt-4">
            <div className="font-bold mb-0.5 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>Target Standard: &lt; 45 min wait • &lt; 20% readmission</span>
            </div>
            <p className="text-[11px] text-sky-800">
              Click any department row in the table below to inspect its individual score breakdown.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPREHENSIVE BOTTLENECK RANKING TABLE WITH CONTRIBUTION BREAKDOWN         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Ranked Department Bottleneck Index (Full 20 Departments)
            </h3>
            <p className="text-xs text-slate-500">
              Composite ranking with 4-part dimensional contribution breakdown (Wait + LOS + Readmission + Bed Util)
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterHospital}
              onChange={(e) => setFilterHospital(e.target.value)}
              aria-label="Filter by Hospital"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
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
              aria-label="Filter by Risk Level"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
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
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="bg-slate-100/80 text-slate-700 uppercase font-bold tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Hospital</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Avg Wait</th>
                <th className="px-4 py-3">Avg Stay</th>
                <th className="px-4 py-3">Readm Rate</th>
                <th className="px-4 py-3">Contribution Breakdown (100 pts)</th>
                <th className="px-4 py-3">Composite Score</th>
                <th className="px-4 py-3">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBottlenecks.map((item) => {
                const isSelected = selectedDeptDetail === `${item.hospital_name}-${item.department_name}`;
                const statusBadge = item.status === 'Critical' 
                  ? 'bg-rose-100 text-rose-800 border-rose-200' 
                  : item.status === 'High Risk' 
                  ? 'bg-orange-100 text-orange-800 border-orange-200' 
                  : item.status === 'Moderate' 
                  ? 'bg-amber-100 text-amber-800 border-amber-200' 
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200';

                return (
                  <tr 
                    key={`${item.hospital_name}-${item.department_name}`} 
                    onClick={() => setSelectedDeptDetail(`${item.hospital_name}-${item.department_name}`)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-sky-50/80 font-medium' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-4 py-3 font-extrabold text-slate-900">
                      #{item.rank}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {item.hospital_name}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {item.department_name}
                    </td>
                    <td className="px-4 py-3 font-bold font-mono text-slate-800">
                      {item.avg_wait_minutes} min
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-mono">
                      {item.avg_los_days}d
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-mono">
                      {item.readmission_rate_pct}%
                    </td>
                    {/* Visual 4-Part Contribution Stacked Bar */}
                    <td className="px-4 py-3 min-w-[160px]">
                      <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                        <div 
                          style={{ width: `${item.wait_contribution}%` }} 
                          className="bg-rose-500" 
                          title={`Wait Contribution: ${item.wait_contribution} pts`}
                        />
                        <div 
                          style={{ width: `${item.los_contribution}%` }} 
                          className="bg-indigo-500" 
                          title={`LOS Contribution: ${item.los_contribution} pts`}
                        />
                        <div 
                          style={{ width: `${item.readmission_contribution}%` }} 
                          className="bg-amber-500" 
                          title={`Readmission Contribution: ${item.readmission_contribution} pts`}
                        />
                        <div 
                          style={{ width: `${item.bed_util_contribution}%` }} 
                          className="bg-emerald-500" 
                          title={`Bed Util Contribution: ${item.bed_util_contribution} pts`}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5">
                        <span className="text-rose-600 font-semibold">{item.wait_contribution}</span>
                        <span className="text-indigo-600 font-semibold">{item.los_contribution}</span>
                        <span className="text-amber-600 font-semibold">{item.readmission_contribution}</span>
                        <span className="text-emerald-600 font-semibold">{item.bed_util_contribution}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-black text-slate-900 font-mono text-sm">
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
