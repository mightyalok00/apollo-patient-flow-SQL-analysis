import React, { useState, useMemo } from 'react';
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
  Flame,
  Info
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
  HOSPITALS,
  DEPARTMENTS,
  DOCTORS,
  HOSPITAL_METRICS, 
  DEPARTMENT_VOLUME_DATA, 
  BUSINESS_FINDINGS, 
  WAIT_TIME_CLASSIFICATION 
} from '../data/hospitalData';
import { SAMPLE_ADMISSIONS } from '../data/sampleDataset';
import { PatientFlowTrendsSection } from './PatientFlowTrendsSection';
import { DashboardFilterBar, DashboardFilterState, INITIAL_FILTER_STATE } from './DashboardFilterBar';
import { ApolloLogo } from './ApolloLogo';

interface DashboardOverviewProps {
  onSelectQuery: (questionNumber: number) => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  onSelectQuery, 
  onNavigateTab 
}) => {
  // Global interactive filter state
  const [filters, setFilters] = useState<DashboardFilterState>(INITIAL_FILTER_STATE);

  // Filter the core 2,500 admissions dataset reactively
  const filteredAdmissions = useMemo(() => {
    return SAMPLE_ADMISSIONS.filter((adm) => {
      // 1. Hospital Filter
      if (filters.hospitalId !== 'all' && adm.hospital_id !== Number(filters.hospitalId)) {
        return false;
      }

      // 2. Department Filter
      if (filters.departmentName !== 'all') {
        const dept = DEPARTMENTS.find(d => d.department_id === adm.department_id);
        if (!dept || dept.department_name !== filters.departmentName) {
          return false;
        }
      }

      // 3. Admission Type Filter
      if (filters.admissionType !== 'all' && adm.admission_type !== filters.admissionType) {
        return false;
      }

      // 4. Waiting Time Tier Filter
      if (filters.waitTimeTier !== 'all') {
        if (filters.waitTimeTier === 'fast' && adm.wait_time_minutes >= 45) return false;
        if (filters.waitTimeTier === 'standard' && (adm.wait_time_minutes < 45 || adm.wait_time_minutes > 60)) return false;
        if (filters.waitTimeTier === 'moderate' && (adm.wait_time_minutes <= 60 || adm.wait_time_minutes > 90)) return false;
        if (filters.waitTimeTier === 'critical' && adm.wait_time_minutes <= 90) return false;
      }

      // 5. Readmission Flag Filter
      if (filters.readmissionOnly && adm.readmission_flag !== 1) {
        return false;
      }

      // 6. Disease / Diagnosis Keyword Search
      if (filters.searchDisease.trim()) {
        const kw = filters.searchDisease.toLowerCase();
        if (!adm.disease.toLowerCase().includes(kw)) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Compute dynamic KPI metrics from the active filtered slice
  const kpiStats = useMemo(() => {
    const count = filteredAdmissions.length;
    if (count === 0) {
      return {
        totalAdmissions: 0,
        avgWaitMinutes: '0.00',
        avgLosDays: '0.00',
        readmissionRatePct: '0.0',
        bedCapacityPct: '0.0',
        staffCount: 0,
        subLabelAdmissions: 'No matching records',
        subLabelWait: 'N/A',
        subLabelLos: 'N/A',
        subLabelReadm: 'N/A'
      };
    }

    const totalWait = filteredAdmissions.reduce((acc, a) => acc + a.wait_time_minutes, 0);
    const avgWait = (totalWait / count).toFixed(2);

    // Compute approximate Length of Stay
    const totalLos = filteredAdmissions.reduce((acc, a) => {
      const admTime = new Date(a.admission_date).getTime();
      const disTime = a.discharge_date ? new Date(a.discharge_date).getTime() : admTime + 4.41 * 24 * 60 * 60 * 1000;
      const los = (disTime - admTime) / (1000 * 60 * 60 * 24);
      return acc + (isNaN(los) ? 4.41 : los);
    }, 0);
    const avgLos = (totalLos / count).toFixed(2);

    // Readmission rate
    const readmCount = filteredAdmissions.filter(a => a.readmission_flag === 1).length;
    const readmRate = ((readmCount / count) * 100).toFixed(1);

    // Unique active doctors
    const uniqueDocs = new Set(filteredAdmissions.map(a => a.doctor_id)).size;

    // Bed capacity ratio estimation
    const baseTotalBeds = filters.hospitalId === 'all' 
      ? 680 
      : DEPARTMENTS.filter(d => d.hospital_id === Number(filters.hospitalId)).reduce((sum, d) => sum + d.total_beds, 0);
    const activeBedsOccupied = Math.min(baseTotalBeds, Math.round((count / 2500) * 309));
    const bedCapacityPct = ((activeBedsOccupied / Math.max(1, baseTotalBeds)) * 100).toFixed(1);

    // Dynamic contextual sub-labels
    const hyderabadCount = filteredAdmissions.filter(a => a.hospital_id === 4).length;
    const hydPct = ((hyderabadCount / count) * 100).toFixed(0);

    const emergencyAdmissions = filteredAdmissions.filter(a => {
      const dept = DEPARTMENTS.find(d => d.department_id === a.department_id);
      return dept?.department_name === 'Emergency' || a.admission_type === 'Emergency';
    });
    const emergencyAvgWait = emergencyAdmissions.length > 0
      ? (emergencyAdmissions.reduce((s, a) => s + a.wait_time_minutes, 0) / emergencyAdmissions.length).toFixed(0)
      : avgWait;

    return {
      totalAdmissions: count,
      avgWaitMinutes: avgWait,
      avgLosDays: avgLos,
      readmissionRatePct: `${readmRate}%`,
      bedCapacityPct: `${bedCapacityPct}%`,
      staffCount: uniqueDocs || 60,
      subLabelAdmissions: filters.hospitalId === 'all' ? `Hyderabad: ${hyderabadCount} (${hydPct}%)` : `Filtered Hospital Slice`,
      subLabelWait: `Emergency: ~${emergencyAvgWait} min`,
      subLabelLos: `Filtered Mean LOS: ${avgLos}d`,
      subLabelReadm: `${readmCount} readmitted (${readmRate}%)`
    };
  }, [filteredAdmissions, filters.hospitalId]);

  // Compute dynamic hospital metrics based on filtered records
  const dynamicHospitalMetrics = useMemo(() => {
    return HOSPITALS.map((h) => {
      const hospAdmissions = filteredAdmissions.filter(a => a.hospital_id === h.hospital_id);
      const totalHosp = hospAdmissions.length;
      
      const emergAdmissions = hospAdmissions.filter(a => {
        const d = DEPARTMENTS.find(dept => dept.department_id === a.department_id);
        return d?.department_name === 'Emergency' || a.admission_type === 'Emergency';
      });

      const avgEmergWait = emergAdmissions.length > 0
        ? Math.round(emergAdmissions.reduce((sum, a) => sum + a.wait_time_minutes, 0) / emergAdmissions.length)
        : totalHosp > 0 
          ? Math.round(hospAdmissions.reduce((sum, a) => sum + a.wait_time_minutes, 0) / totalHosp) 
          : 0;

      const readmCount = hospAdmissions.filter(a => a.readmission_flag === 1).length;
      const readmRate = totalHosp > 0 ? ((readmCount / totalHosp) * 100).toFixed(1) : '0.0';

      return {
        hospital_name: h.hospital_name,
        city: h.city,
        admissions: totalHosp,
        emergency_wait: avgEmergWait,
        readmission_rate: parseFloat(readmRate),
      };
    });
  }, [filteredAdmissions]);

  // Compute dynamic department breakdown based on filtered records
  const dynamicDepartmentVolume = useMemo(() => {
    const deptNames = ['Emergency', 'Cardiology', 'Orthopedics', 'General Medicine', 'Neurology'];
    const colors: Record<string, string> = {
      'Emergency': '#ef4444',
      'Cardiology': '#0284c7',
      'Orthopedics': '#f59e0b',
      'General Medicine': '#10b981',
      'Neurology': '#8b5cf6'
    };

    return deptNames.map((name) => {
      const deptAdmissions = filteredAdmissions.filter(a => {
        const d = DEPARTMENTS.find(dept => dept.department_id === a.department_id);
        return d?.department_name === name;
      });

      const totalDept = deptAdmissions.length;
      const avgWait = totalDept > 0 
        ? Math.round(deptAdmissions.reduce((sum, a) => sum + a.wait_time_minutes, 0) / totalDept)
        : 0;

      return {
        name,
        admissions: totalDept,
        avgWait,
        color: colors[name] || '#0284c7'
      };
    });
  }, [filteredAdmissions]);

  // Synchronize facility with PatientFlowTrends
  const facilityMapToTrend: Record<string, string> = {
    '1': 'delhi',
    '2': 'mumbai',
    '3': 'bangalore',
    '4': 'hyderabad',
    'all': 'all'
  };

  const trendMapToFacility: Record<string, string> = {
    'delhi': '1',
    'mumbai': '2',
    'bangalore': '3',
    'hyderabad': '4',
    'all': 'all'
  };

  const currentTrendFacility = facilityMapToTrend[filters.hospitalId] || 'all';

  const handleTrendFacilityChange = (facility: string) => {
    setFilters(prev => ({
      ...prev,
      hospitalId: trendMapToFacility[facility] || 'all'
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero / Executive Header */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-6 top-6 bottom-6 opacity-15 pointer-events-none hidden md:flex items-center">
          <ApolloLogo variant="icon-only" size="xl" className="w-64 h-64 scale-150" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span>MySQL 8.0+ Operational Intelligence Engine</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs">
              <span>Analysis by <strong className="text-sky-300 font-bold">Alok Agarwal</strong></span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
              <span>Verified Clean Dataset</span>
              <span className="text-emerald-400 font-bold">• 0 Duplicates</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
            Apollo Hospitals Patient Flow & Operational Analysis
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            End-to-end SQL analysis evaluating 2,500 admissions, bed utilization across 20 departments, waiting-time triage bottlenecks, length of stay, and readmission rates across 4 Apollo facilities.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              id="btn-run-sql-lab"
              onClick={() => onNavigateTab('sql-workbench')}
              className="inline-flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm cursor-pointer"
            >
              <span>Explore 15 SQL Queries</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              id="btn-view-bottlenecks"
              onClick={() => onNavigateTab('bottlenecks')}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Bottleneck Rankings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Interactive Multi-Dimensional Filter Bar */}
      <DashboardFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
        filteredCount={filteredAdmissions.length}
        totalCount={SAMPLE_ADMISSIONS.length}
      />

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
          className="shrink-0 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
        >
          <span>Run Bottleneck Query (Q14)</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6 Dynamic Executive KPI Cards (Reacts to Filters) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Admissions</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {kpiStats.totalAdmissions.toLocaleString()}
          </div>
          <div className="text-[11px] mt-1.5 flex items-center text-emerald-600 font-semibold truncate">
            <TrendingUp className="w-3 h-3 mr-1 shrink-0" />
            <span className="truncate">{kpiStats.subLabelAdmissions}</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg Wait Time</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {kpiStats.avgWaitMinutes} <span className="text-xs font-normal text-slate-500 font-sans">min</span>
          </div>
          <div className="text-[11px] mt-1.5 flex items-center text-rose-600 font-semibold truncate">
            <span className="truncate">{kpiStats.subLabelWait}</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg Stay (LOS)</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {kpiStats.avgLosDays} <span className="text-xs font-normal text-slate-500 font-sans">days</span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1.5 font-medium truncate">
            <span className="truncate">{kpiStats.subLabelLos}</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Readmissions</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {kpiStats.readmissionRatePct}
          </div>
          <div className="text-[11px] text-orange-600 mt-1.5 font-semibold truncate">
            <span className="truncate">{kpiStats.subLabelReadm}</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Bed Capacity</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {kpiStats.bedCapacityPct}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1.5 font-semibold">
            <span>Optimal (0% &gt;90%)</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Staff</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {kpiStats.staffCount} <span className="text-xs font-normal text-slate-500 font-sans">docs</span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1.5 font-medium">
            <span>
              ~{kpiStats.staffCount > 0 ? (kpiStats.totalAdmissions / kpiStats.staffCount).toFixed(1) : 0} pts/doctor
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Patient Flow Trends & Admissions Growth (Recharts) */}
      <PatientFlowTrendsSection 
        onSelectQuery={onSelectQuery} 
        externalFacility={currentTrendFacility}
        onFacilityChange={handleTrendFacilityChange}
      />

      {/* Hospital Metrics & Department Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hospital Volume & Wait Comparison */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Hospital Patient Volume & Emergency Wait</h3>
                <p className="text-xs text-slate-500">
                  {filteredAdmissions.length < SAMPLE_ADMISSIONS.length ? 'Filtered volume load vs Emergency triage latency' : 'Cross-hospital admission load vs Emergency triage latency'}
                </p>
              </div>
              <button
                id="btn-inspect-q2"
                onClick={() => onSelectQuery(2)}
                className="text-xs text-sky-600 font-semibold hover:underline flex items-center cursor-pointer"
              >
                <span>Query 2</span>
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dynamicHospitalMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
                    formatter={(value: any, name: string) => [
                      name === 'admissions' ? `${value} Admissions` : `${value} min wait`,
                      name === 'admissions' ? 'Filtered Volume' : 'Emergency Avg Wait'
                    ]}
                  />
                  <Bar dataKey="admissions" fill="#0284c7" radius={[6, 6, 0, 0]} name="admissions" />
                  <Bar dataKey="emergency_wait" fill="#f43f5e" radius={[6, 6, 0, 0]} name="emergency_wait" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 text-center">
            {dynamicHospitalMetrics.map(h => (
              <div 
                key={h.hospital_name} 
                onClick={() => {
                  const hospObj = HOSPITALS.find(item => item.hospital_name === h.hospital_name);
                  if (hospObj) {
                    setFilters(prev => ({
                      ...prev,
                      hospitalId: prev.hospitalId === String(hospObj.hospital_id) ? 'all' : String(hospObj.hospital_id)
                    }));
                  }
                }}
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  filters.hospitalId !== 'all' && HOSPITALS.find(item => item.hospital_name === h.hospital_name)?.hospital_id === Number(filters.hospitalId)
                    ? 'bg-sky-100 border border-sky-300 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
                title="Click to filter by this hospital"
              >
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
                className="text-xs text-sky-600 font-semibold hover:underline flex items-center cursor-pointer"
              >
                <span>Query 3</span>
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="space-y-3">
              {dynamicDepartmentVolume.map((dept) => {
                const totalFiltered = Math.max(1, filteredAdmissions.length);
                const pct = ((dept.admissions / totalFiltered) * 100).toFixed(1);
                const isSelected = filters.departmentName === dept.name;

                return (
                  <div 
                    key={dept.name} 
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        departmentName: prev.departmentName === dept.name ? 'all' : dept.name
                      }));
                    }}
                    className={`p-2 rounded-xl cursor-pointer transition-all ${
                      isSelected ? 'bg-sky-50 border border-sky-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={`${isSelected ? 'text-sky-900 font-bold' : 'text-slate-800'}`}>
                        {dept.name} {isSelected && '✓'}
                      </span>
                      <span className="text-slate-600">{dept.admissions} admissions ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: dept.color }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
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
              <span className="text-slate-500">{filteredAdmissions.length.toLocaleString()} Filtered</span>
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
