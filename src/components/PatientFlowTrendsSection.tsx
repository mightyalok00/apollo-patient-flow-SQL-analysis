import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Activity, 
  Calendar, 
  Users, 
  Clock, 
  Building2, 
  Layers, 
  Sparkles,
  ArrowUpRight,
  Filter,
  CalendarRange
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  AreaChart, 
  Area, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { 
  PATIENT_FLOW_90_DAYS, 
  PATIENT_FLOW_30_DAYS,
  PATIENT_FLOW_7_DAYS,
  DateRangePreset,
  computeRangeMetrics
} from '../data/patientFlowTrends';
import { DateRangePicker } from './DateRangePicker';

type ViewMode = 'growth-velocity' | 'hospital-split' | 'admission-type' | 'wait-correlation';

interface PatientFlowTrendsSectionProps {
  onSelectQuery?: (questionNumber: number) => void;
  externalFacility?: string;
  onFacilityChange?: (facility: string) => void;
}

export const PatientFlowTrendsSection: React.FC<PatientFlowTrendsSectionProps> = ({ 
  onSelectQuery,
  externalFacility,
  onFacilityChange
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('growth-velocity');
  const [internalFacility, setInternalFacility] = useState<string>('all');
  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [showCumulative, setShowCumulative] = useState<boolean>(true);
  
  // Use external facility if controlled, otherwise internal
  const selectedFacility = externalFacility !== undefined ? externalFacility : internalFacility;
  const handleFacilityChange = (facility: string) => {
    setInternalFacility(facility);
    if (onFacilityChange) {
      onFacilityChange(facility);
    }
  };
  
  // Date Range state (defaults to 30d)
  const [rangePreset, setRangePreset] = useState<DateRangePreset>('30d');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-08-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-08-30');

  // Filter raw data according to selected date range preset or custom start/end
  const rawDateSlice = useMemo(() => {
    if (rangePreset === '7d') {
      return PATIENT_FLOW_7_DAYS;
    } else if (rangePreset === '30d') {
      return PATIENT_FLOW_30_DAYS;
    } else if (rangePreset === '90d') {
      return PATIENT_FLOW_90_DAYS;
    } else {
      // Custom date filter
      return PATIENT_FLOW_90_DAYS.filter(
        d => d.fullDate >= customStartDate && d.fullDate <= customEndDate
      );
    }
  }, [rangePreset, customStartDate, customEndDate]);

  // Compute summary metrics for active date range slice
  const rangeMetrics = useMemo(() => {
    return computeRangeMetrics(rawDateSlice);
  }, [rawDateSlice]);

  // Transform data for active facility filter & recalculate cumulative slice
  const chartData = useMemo(() => {
    let cum = 0;
    return rawDateSlice.map((d) => {
      let admissions = d.totalAdmissions;
      if (selectedFacility === 'delhi') admissions = d.delhi;
      else if (selectedFacility === 'mumbai') admissions = d.mumbai;
      else if (selectedFacility === 'bangalore') admissions = d.bangalore;
      else if (selectedFacility === 'hyderabad') admissions = d.hyderabad;

      cum += admissions;

      return {
        ...d,
        activeAdmissions: admissions,
        sliceCumulative: cum,
      };
    });
  }, [rawDateSlice, selectedFacility]);

  // Summary stats based on active facility filter
  const activeTotal = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.activeAdmissions, 0);
  }, [chartData]);

  const dateSpanLabel = useMemo(() => {
    if (rawDateSlice.length === 0) return 'No dates selected';
    const first = rawDateSlice[0].date;
    const last = rawDateSlice[rawDateSlice.length - 1].date;
    return `${first} - ${last} (${rawDateSlice.length} Days)`;
  }, [rawDateSlice]);

  const presetBadgeLabel = useMemo(() => {
    if (rangePreset === '7d') return 'Last 7 Days (Weekly)';
    if (rangePreset === '30d') return 'Last 30 Days (Monthly)';
    if (rangePreset === '90d') return 'Last 90 Days (Quarterly)';
    return `Custom: ${rawDateSlice.length} Days`;
  }, [rangePreset, rawDateSlice.length]);

  return (
    <div id="patient-flow-trends-card" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Top Header with Title and Date Range Picker */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Real-Time Patient Flow & Admissions Growth Trends
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
              {presetBadgeLabel}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
            <CalendarRange className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">{dateSpanLabel}</span>
            <span>•</span>
            <span>Tracking daily intake, 7-day rolling velocity, triage latency correlations, and facility distribution</span>
          </div>
        </div>

        {/* Date Range Picker & Facility Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Picker Component (7d, 30d, 90d, custom) */}
          <DateRangePicker
            selectedPreset={rangePreset}
            onSelectPreset={(preset) => setRangePreset(preset)}
            startDate={customStartDate}
            endDate={customEndDate}
            onCustomRangeChange={(start, end) => {
              setCustomStartDate(start);
              setCustomEndDate(end);
            }}
            displayLabel={dateSpanLabel}
          />

          {/* Facility Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="select-facility-filter"
              value={selectedFacility}
              onChange={(e) => handleFacilityChange(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All 4 Facilities</option>
              <option value="delhi">Apollo Delhi</option>
              <option value="mumbai">Apollo Mumbai</option>
              <option value="bangalore">Apollo Bangalore</option>
              <option value="hyderabad">Apollo Hyderabad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Telemetry Highlight Metric Badges for Selected Range */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span className="font-semibold uppercase tracking-wider text-sky-900">
              {rangePreset === '7d' ? '7-Day' : rangePreset === '30d' ? '30-Day' : rangePreset === '90d' ? '90-Day' : 'Range'} Admissions
            </span>
            <Users className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-xl font-extrabold text-sky-950 mt-1">
            {activeTotal} <span className="text-xs font-normal text-slate-500">patients</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            <span>{rangeMetrics.netGrowthRatePct} period growth</span>
          </div>
        </div>

        <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span className="font-semibold uppercase tracking-wider text-indigo-900">Rolling Velocity</span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-indigo-950 mt-1">
            {rangeMetrics.recentVelocity7d}
          </div>
          <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
            7-day trailing velocity
          </div>
        </div>

        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span className="font-semibold uppercase tracking-wider text-amber-900">Peak Volume Day</span>
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-950 mt-1">
            {rangeMetrics.peakDayVolume} <span className="text-xs font-normal text-slate-500">adm</span>
          </div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
            Recorded on {rangeMetrics.peakDayDate}
          </div>
        </div>

        <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span className="font-semibold uppercase tracking-wider text-rose-900">Emergency Share</span>
            <Clock className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-xl font-extrabold text-rose-950 mt-1">
            {rangeMetrics.emergencySharePct}
          </div>
          <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
            Avg wait {rangeMetrics.averageWaitTime}
          </div>
        </div>
      </div>

      {/* View Mode Switcher Sub-tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            id="tab-growth-velocity"
            onClick={() => setViewMode('growth-velocity')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'growth-velocity'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admissions & Velocity
          </button>
          <button
            id="tab-hospital-split"
            onClick={() => setViewMode('hospital-split')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'hospital-split'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hospital Breakdown
          </button>
          <button
            id="tab-admission-type"
            onClick={() => setViewMode('admission-type')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'admission-type'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Emergency vs Elective
          </button>
          <button
            id="tab-wait-correlation"
            onClick={() => setViewMode('wait-correlation')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'wait-correlation'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Triage Latency Strain
          </button>
        </div>

        {viewMode === 'growth-velocity' && (
          <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showCumulative}
              onChange={(e) => setShowCumulative(e.target.checked)}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="font-medium">Show Cumulative Growth Curve</span>
          </label>
        )}
      </div>

      {/* Main Interactive Recharts Canvas */}
      <div className="h-72 sm:h-80 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'growth-velocity' ? (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false}
                interval={rangePreset === '90d' ? 6 : rangePreset === '30d' ? 2 : 0}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
              {showCumulative && (
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#0284c7' }} axisLine={false} tickLine={false} />
              )}
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', border: 'none', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}
                formatter={(value: any, name: string) => {
                  if (name === 'activeAdmissions') return [`${value} Patients`, 'Daily Admissions'];
                  if (name === 'movingAverage7d') return [`${value} Patients/Day`, '7-Day Rolling Avg'];
                  if (name === 'sliceCumulative') return [`${value} Cumulative`, 'Period Growth Sum'];
                  return [value, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              {showCumulative && (
                <Area yAxisId="right" type="monotone" dataKey="sliceCumulative" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorCumulative)" name="Cumulative Admissions" />
              )}
              <Bar yAxisId="left" dataKey="activeAdmissions" fill="url(#colorBar)" radius={[4, 4, 0, 0]} name="Daily Admissions" barSize={rangePreset === '90d' ? 6 : 16} />
              <Line yAxisId="left" type="monotone" dataKey="movingAverage7d" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 5 }} name="7-Day Moving Avg" />
              <ReferenceLine yAxisId="left" y={7.8} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Target Baseline (7.8/d)', fill: '#ef4444', fontSize: 10, position: 'insideTopLeft' }} />
            </ComposedChart>
          ) : viewMode === 'hospital-split' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="gradHyderabad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="gradMumbai" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="gradDelhi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="gradBangalore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false} 
                interval={rangePreset === '90d' ? 6 : rangePreset === '30d' ? 2 : 0}
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', border: 'none', fontSize: '12px' }}
                formatter={(val: any, name: string) => [`${val} Admissions`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="hyderabad" stackId="1" stroke="#0284c7" fill="url(#gradHyderabad)" name="Apollo Hyderabad" />
              <Area type="monotone" dataKey="mumbai" stackId="1" stroke="#6366f1" fill="url(#gradMumbai)" name="Apollo Mumbai" />
              <Area type="monotone" dataKey="delhi" stackId="1" stroke="#10b981" fill="url(#gradDelhi)" name="Apollo Delhi" />
              <Area type="monotone" dataKey="bangalore" stackId="1" stroke="#f59e0b" fill="url(#gradBangalore)" name="Apollo Bangalore" />
            </AreaChart>
          ) : viewMode === 'admission-type' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="gradEmergency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="gradElective" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="gradUrgent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="gradReferral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false}
                interval={rangePreset === '90d' ? 6 : rangePreset === '30d' ? 2 : 0}
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', border: 'none', fontSize: '12px' }}
                formatter={(val: any, name: string) => [`${val} Admissions`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="emergency" stackId="1" stroke="#ef4444" fill="url(#gradEmergency)" name="Emergency Stream" />
              <Area type="monotone" dataKey="elective" stackId="1" stroke="#0ea5e9" fill="url(#gradElective)" name="Elective Scheduled" />
              <Area type="monotone" dataKey="urgent" stackId="1" stroke="#f59e0b" fill="url(#gradUrgent)" name="Urgent / Direct" />
              <Area type="monotone" dataKey="referral" stackId="1" stroke="#8b5cf6" fill="url(#gradReferral)" name="External Referral" />
            </AreaChart>
          ) : (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false}
                interval={rangePreset === '90d' ? 6 : rangePreset === '30d' ? 2 : 0}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 15]} label={{ value: 'Admissions', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#ef4444' }} axisLine={false} tickLine={false} domain={[40, 90]} label={{ value: 'Avg Wait (min)', angle: 90, position: 'insideRight', fontSize: 10, fill: '#ef4444' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', border: 'none', fontSize: '12px' }}
                formatter={(val: any, name: string) => [
                  name === 'totalAdmissions' ? `${val} Patients` : `${val} min`,
                  name === 'totalAdmissions' ? 'Intake Volume' : 'Average Triage Wait'
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar yAxisId="left" dataKey="totalAdmissions" fill="#0284c7" radius={[4, 4, 0, 0]} name="Intake Volume" barSize={rangePreset === '90d' ? 6 : 18} />
              <Line yAxisId="right" type="monotone" dataKey="avgWaitMinutes" stroke="#ef4444" strokeWidth={3} dot={rangePreset !== '90d' ? { r: 3, fill: '#ef4444' } : false} activeDot={{ r: 6 }} name="Triage Wait (Min)" />
              <ReferenceLine yAxisId="right" y={62.81} stroke="#64748b" strokeDasharray="3 3" label={{ value: 'Hospital Avg (62.8 min)', fill: '#64748b', fontSize: 10, position: 'insideBottomRight' }} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Insight & SQL Link */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <span className="font-semibold text-slate-800">Analytical Insight ({presetBadgeLabel}):</span> Volume peaks on days with elevated Emergency cases directly correlate with a ~15% increase in triage wait latency.
          </span>
        </div>

        {onSelectQuery && (
          <button
            id="btn-inspect-trend-sql"
            onClick={() => onSelectQuery(1)}
            className="shrink-0 font-semibold text-sky-600 hover:text-sky-800 flex items-center space-x-1"
          >
            <span>Inspect Daily Aggregates (Q1)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
