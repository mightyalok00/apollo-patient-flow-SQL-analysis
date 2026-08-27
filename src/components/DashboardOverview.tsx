import React from 'react';
import { 
  Users, 
  Clock, 
  Bed, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  ArrowUpRight, 
  TrendingUp,
  Stethoscope,
  ChevronRight,
  Flame
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  HOSPITAL_METRICS, 
  DEPARTMENT_VOLUME_DATA, 
  BUSINESS_FINDINGS, 
  WAIT_TIME_CLASSIFICATION 
} from '../data/hospitalData';

interface DashboardOverviewProps {
  onSelectQuery: (questionNumber: number) => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  onSelectQuery, 
  onNavigateTab 
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero / Executive Header */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Building2 className="w-80 h-80 text-white" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span>MySQL 8.0+ Patient Flow Analytical System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
            Apollo Hospitals Patient Flow & Operational Analysis
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            End-to-end SQL analysis evaluating 2,500 admissions, bed utilization across 20 departments, waiting-time triage bottlenecks, length of stay, and readmission rates across 4 synthetic Apollo facilities.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              id="btn-run-sql-lab"
              onClick={() => onNavigateTab('sql-workbench')}
              className="inline-flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm"
            >
              <span>Explore 15 SQL Queries</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              id="btn-view-bottlenecks"
              onClick={() => onNavigateTab('bottlenecks')}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Bottleneck Rankings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Operational Highlight Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-amber-900">Key Operational Alert: Emergency Wait Time & Bottleneck Concentration</h2>
            <p className="text-xs text-amber-800 mt-0.5">
              Emergency departments average <span className="font-bold">102.89 min wait</span> (vs 62.81 min overall). Apollo Delhi Emergency ranks #1 overall in composite bottleneck score (92.11), while Apollo Bangalore has peak average wait of 106.71 min.
            </p>
          </div>
        </div>
        <button
          id="btn-inspect-q14"
          onClick={() => onSelectQuery(14)}
          className="shrink-0 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1"
        >
          <span>Run Bottleneck Query (Q14)</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6 Core Executive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Admissions</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">2,500</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center text-emerald-600 font-medium">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Hyderabad: 654 (26%)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Wait Time</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">62.81 <span className="text-xs font-medium text-slate-500">min</span></div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center text-rose-600 font-medium">
            <span>Emergency: ~103 min</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Stay (LOS)</span>
            <Bed className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">4.41 <span className="text-xs font-medium text-slate-500">days</span></div>
          <div className="text-[11px] text-slate-500 mt-1 text-slate-600 font-medium">
            <span>Max stay: 4.80d (Delhi)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Readmissions</span>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">34.6%</div>
          <div className="text-[11px] text-orange-600 mt-1 font-medium">
            <span>Delhi Ortho: 40.77%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Bed Capacity</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">45.4%</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            <span>0% Critical (&gt;90%)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Medical Staff</span>
            <Stethoscope className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">60 <span className="text-xs font-medium text-slate-500">docs</span></div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            <span>~41.7 patients / doc</span>
          </div>
        </div>
      </div>

      {/* Hospital Metrics & Department Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hospital Volume & Wait Comparison */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Hospital Patient Volume & Emergency Wait</h3>
                <p className="text-xs text-slate-500">Cross-hospital admission load vs Emergency triage latency</p>
              </div>
              <button
                id="btn-inspect-q2"
                onClick={() => onSelectQuery(2)}
                className="text-xs text-sky-600 font-semibold hover:underline flex items-center"
              >
                <span>Query 2</span>
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HOSPITAL_METRICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
                    formatter={(value: any, name: string) => [
                      name === 'admissions' ? `${value} Admissions` : `${value} min wait`,
                      name === 'admissions' ? 'Total Volume' : 'Emergency Avg Wait'
                    ]}
                  />
                  <Bar dataKey="admissions" fill="#0284c7" radius={[6, 6, 0, 0]} name="admissions" />
                  <Bar dataKey="emergency_wait" fill="#f43f5e" radius={[6, 6, 0, 0]} name="emergency_wait" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 text-center">
            {HOSPITAL_METRICS.map(h => (
              <div key={h.hospital_name} className="p-2 bg-slate-50 rounded-lg">
                <div className="text-xs font-bold text-slate-800">{h.city}</div>
                <div className="text-sm font-extrabold text-sky-700">{h.admissions}</div>
                <div className="text-[10px] text-slate-500">{h.readmission_rate}% readm</div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Volume Breakdown */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Department Volume Distribution</h3>
                <p className="text-xs text-slate-500">Aggregate patient demand by clinical specialty</p>
              </div>
              <button
                id="btn-inspect-q3"
                onClick={() => onSelectQuery(3)}
                className="text-xs text-sky-600 font-semibold hover:underline flex items-center"
              >
                <span>Query 3</span>
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="space-y-3">
              {DEPARTMENT_VOLUME_DATA.map((dept) => {
                const pct = ((dept.admissions / 2500) * 100).toFixed(1);
                return (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{dept.name}</span>
                      <span className="text-slate-600">{dept.admissions} admissions ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: dept.color }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Avg Wait: <span className={dept.avgWait > 80 ? 'text-rose-600 font-bold' : 'font-medium'}>{dept.avgWait} min</span></span>
                      <span>{dept.name === 'Emergency' ? '⚠️ High Triage Strain' : 'Stable Capacity'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Waiting Time Triage Tiers:</span>
              <span className="text-slate-500">2,500 Total</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {WAIT_TIME_CLASSIFICATION.map(tier => (
                <div key={tier.category} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                  <div className="text-[10px] font-semibold text-slate-600 truncate">{tier.status}</div>
                  <div className="text-xs font-bold" style={{ color: tier.color }}>{tier.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 10 Key Business Insights from the Project */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">10 Core Business & Clinical Insights</h3>
            <p className="text-xs text-slate-500">Empirical findings synthesized from all 15 SQL analytical queries</p>
          </div>
          <div className="text-xs font-medium text-slate-500">
            Click any finding to inspect relevant SQL
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BUSINESS_FINDINGS.map((item) => (
            <div 
              key={item.id}
              onClick={() => {
                // Map findings to corresponding SQL queries
                const queryMap: Record<number, number> = {
                  1: 2, 2: 4, 3: 4, 4: 14, 5: 9, 6: 6, 7: 7, 8: 3, 9: 8, 10: 10
                };
                onSelectQuery(queryMap[item.id] || 1);
              }}
              className="p-4 rounded-xl border border-slate-100 hover:border-sky-300 hover:bg-sky-50/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                    Finding #{item.id} • {item.category}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-sky-900 transition-colors mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 mb-2">
                  <span className="font-semibold text-slate-800">Evidence: </span>
                  {item.evidence}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-semibold text-sky-800">Impact: </span>
                {item.businessImpact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
