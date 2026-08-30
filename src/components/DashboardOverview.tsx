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
  ChevronDown,
  Flame,
  Info,
  ShieldAlert,
  SlidersHorizontal,
  CheckCircle,
  HelpCircle,
  FileSpreadsheet
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
  HOSPITAL_METRICS, 
  BUSINESS_FINDINGS, 
  WAIT_TIME_CLASSIFICATION 
} from '../data/hospitalData';
import { SAMPLE_ADMISSIONS } from '../data/sampleDataset';
import { PatientFlowTrendsSection } from './PatientFlowTrendsSection';
import { DashboardFilterBar, DashboardFilterState, INITIAL_FILTER_STATE } from './DashboardFilterBar';
import { ApolloLogo } from './ApolloLogo';
import { QUESTION_CHART_META } from './QuestionsGraphHub';

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
  const [isInsightsExpanded, setIsInsightsExpanded] = useState<boolean>(false);

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

  const isFiltered = filteredAdmissions.length < SAMPLE_ADMISSIONS.length;

  // Single Source of Truth: Compute consistent metrics for the active slice
  const kpiStats = useMemo(() => {
    const count = filteredAdmissions.length;
    if (count === 0) {
      return {
        totalAdmissions: 0,
        avgWaitMinutes: '0.0',
        emergencyAvgWait: '0.0',
        avgLosDays: '0.0',
        readmissionRatePct: '0.0%',
        readmissionCount: 0,
        bedCapacityPct: '0.0%',
        staffCount: 0,
        scopeLabel: `Filtered Slice (N=0)`,
      };
    }

    const totalWait = filteredAdmissions.reduce((acc, a) => acc + a.wait_time_minutes, 0);
    const avgWait = (totalWait / count).toFixed(1);

    // Filtered emergency admissions wait
    const emergAdms = filteredAdmissions.filter(a => {
      const dept = DEPARTMENTS.find(d => d.department_id === a.department_id);
      return dept?.department_name === 'Emergency' || a.admission_type === 'Emergency';
    });
    const emergWait = emergAdms.length > 0
      ? (emergAdms.reduce((s, a) => s + a.wait_time_minutes, 0) / emergAdms.length).toFixed(1)
      : avgWait;

    // Length of stay calculation
    const totalLos = filteredAdmissions.reduce((acc, a) => {
      const admTime = new Date(a.admission_date).getTime();
      const disTime = a.discharge_date ? new Date(a.discharge_date).getTime() : admTime + 4.41 * 24 * 60 * 60 * 1000;
      const los = (disTime - admTime) / (1000 * 60 * 60 * 24);
      return acc + (isNaN(los) ? 4.41 : los);
    }, 0);
    const avgLos = (totalLos / count).toFixed(2);

    // Readmissions
    const readmCount = filteredAdmissions.filter(a => a.readmission_flag === 1).length;
    const readmRate = ((readmCount / count) * 100).toFixed(1);

    // Staff
    const uniqueDocs = new Set(filteredAdmissions.map(a => a.doctor_id)).size;

    // Bed capacity
    const baseTotalBeds = filters.hospitalId === 'all' 
      ? 680 
      : DEPARTMENTS.filter(d => d.hospital_id === Number(filters.hospitalId)).reduce((sum, d) => sum + d.total_beds, 0);
    const activeBedsOccupied = Math.min(baseTotalBeds, Math.round((count / 2500) * 309));
    const bedCapacityPct = ((activeBedsOccupied / Math.max(1, baseTotalBeds)) * 100).toFixed(1);

    return {
      totalAdmissions: count,
      avgWaitMinutes: avgWait,
      emergencyAvgWait: emergWait,
      avgLosDays: avgLos,
      readmissionRatePct: `${readmRate}%`,
      readmissionCount: readmCount,
      bedCapacityPct: `${bedCapacityPct}%`,
      staffCount: uniqueDocs || 60,
      scopeLabel: isFiltered ? `Filtered Records (N=${count.toLocaleString()})` : `Network-wide (2,500 records)`,
    };
  }, [filteredAdmissions, filters.hospitalId, isFiltered]);

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
        ? Number((emergAdmissions.reduce((sum, a) => sum + a.wait_time_minutes, 0) / emergAdmissions.length).toFixed(1))
        : totalHosp > 0 
          ? Number((hospAdmissions.reduce((sum, a) => sum + a.wait_time_minutes, 0) / totalHosp).toFixed(1)) 
          : 0;

      const readmCount = hospAdmissions.filter(a => a.readmission_flag === 1).length;
      const readmRate = totalHosp > 0 ? parseFloat(((readmCount / totalHosp) * 100).toFixed(1)) : 0;

      return {
        hospital_name: h.hospital_name,
        city: h.city,
        admissions: totalHosp,
        emergency_wait: avgEmergWait,
        readmission_rate: readmRate,
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
        ? Number((deptAdmissions.reduce((sum, a) => sum + a.wait_time_minutes, 0) / totalDept).toFixed(1))
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

  // Top 3 Ranked Operational Alerts structured to answer:
  // 1. What is wrong? 2. Where is it happening? 3. What action is recommended?
  const topOperationalAlerts = [
    {
      id: 1,
      rank: '#1',
      title: 'Triage Congestion & Peak Wait Times',
      severity: 'Critical',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      whatIsWrong: 'Emergency wait times average 102.89 min network-wide (vs 45 min target) with 61.3% of all admissions exceeding standard triage threshold.',
      whereHappening: 'Apollo Bangalore Emergency (106.71 min peak wait) and Apollo Delhi Emergency (101.45 min wait, #1 overall bottleneck rank 92.11).',
      recommendedAction: 'Implement rapid dual-physician triage during peak surge hours (14:00-20:00) and establish fast-track streaming for ESI Level 4 & 5 low-acuity cases.',
      queryNum: 14,
      queryLabel: 'Run Q14 Bottleneck Matrix'
    },
    {
      id: 2,
      rank: '#2',
      title: 'Elevated 30-Day Readmission Bounceback Rates',
      severity: 'High Risk',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      whatIsWrong: 'High-risk specialty readmissions peak at 40.77% in Orthopedics and 37.72% in Cardiology, compounding bed occupancy pressure.',
      whereHappening: 'Apollo Delhi Orthopedics & Apollo Hyderabad Cardiology Inpatient Units.',
      recommendedAction: 'Institute mandatory 48-hour post-discharge tele-health checkups and standardized medication reconciliation protocols.',
      queryNum: 6,
      queryLabel: 'Run Q6 Readmission Analysis'
    },
    {
      id: 3,
      rank: '#3',
      title: 'Weekend Inpatient Bed Release Latency',
      severity: 'Moderate',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      whatIsWrong: 'Average inpatient Length of Stay is 4.41 days with delayed discharge processing creating midday bed unavailability for incoming elective surgeries.',
      whereHappening: 'General Medicine & Cardiology wards across Delhi, Mumbai, and Bangalore facilities.',
      recommendedAction: 'Establish standard morning discharge lounges by 11:00 AM to free ward beds before peak afternoon admissions arrive.',
      queryNum: 8,
      queryLabel: 'Run Q8 Bed Occupancy Query'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Portfolio Synthetic Data Notice */}
      <div className="bg-slate-900 text-slate-300 px-4 py-2.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong>Demonstration Notice:</strong> Independent portfolio project using a synthetic healthcare dataset modeled on Apollo Hospitals patient flow.
          </span>
        </div>
        <div className="text-[11px] font-mono text-sky-300 shrink-0">
          Scope: 4 Facilities • 2,500 Admissions • 6 Normalized 3NF Tables
        </div>
      </div>

      {/* Hero / Executive Header */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-6 top-6 bottom-6 opacity-15 pointer-events-none hidden md:flex items-center">
          <ApolloLogo variant="icon-only" size="xl" className="w-64 h-64 scale-150" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span>MySQL 8.0+ Operational Intelligence</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs">
              <span>Author: <strong className="text-sky-300 font-bold">Alok Agarwal</strong></span>
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
            Executive clinical intelligence platform tracking 2,500 patient episodes, triage wait-time latency, length of stay, and bed utilization across 4 Apollo facilities.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              id="btn-run-all-charts"
              onClick={() => onNavigateTab('all-charts')}
              aria-label="Explore 15 Analytical Visualizations"
              className="inline-flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
            >
              <span>Explore 15 Analytical Charts</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              id="btn-view-bottlenecks"
              onClick={() => onNavigateTab('bottlenecks')}
              aria-label="Navigate to Bottleneck Analysis"
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
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

      {/* ========================================================================= */}
      {/* EXECUTIVE FIRST SCREEN: WHAT IS WRONG? WHERE IS IT HAPPENING? ACTION?     */}
      {/* Placed ABOVE the general KPI cards as requested                           */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
                <Flame className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Top 3 Operational Bottlenecks & Recommended Actions
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked clinical triage alerts answering: <strong className="text-slate-700">What is wrong? Where is it happening? What action is recommended?</strong>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {kpiStats.scopeLabel}
            </span>
          </div>
        </div>

        {/* 3 Ranked Actionable Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topOperationalAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${alert.badgeColor}`}>
                    Alert {alert.rank} • {alert.severity}
                  </span>
                  <button
                    onClick={() => onSelectQuery(alert.queryNum)}
                    aria-label={`Inspect ${alert.queryLabel}`}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center space-x-0.5 cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-2">{alert.title}</h3>

                {/* 3 Core Structured Answers */}
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                    <span className="font-bold text-rose-700 block text-[11px] uppercase tracking-wider mb-0.5">
                      ⚠️ What is wrong:
                    </span>
                    <span className="text-slate-700 leading-relaxed">{alert.whatIsWrong}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                    <span className="font-bold text-indigo-700 block text-[11px] uppercase tracking-wider mb-0.5">
                      📍 Where happening:
                    </span>
                    <span className="text-slate-700 leading-relaxed font-medium">{alert.whereHappening}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                    <span className="font-bold text-emerald-800 block text-[11px] uppercase tracking-wider mb-0.5">
                      ✅ Recommended Action:
                    </span>
                    <span className="text-emerald-900 leading-relaxed font-medium">{alert.recommendedAction}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Metric Source: Analysis Q{alert.queryNum}</span>
                <button
                  onClick={() => onSelectQuery(alert.queryNum)}
                  className="font-bold text-sky-700 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>{alert.queryLabel}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6 DYNAMIC EXECUTIVE KPI CARDS (WITH EXPLICIT METRIC SCOPE LABELS)          */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Network Operational Metrics
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              {kpiStats.scopeLabel}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {isFiltered ? 'Calculated on filtered slice' : 'All 2,500 admissions across 4 facilities'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Admissions */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
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
              <span className="truncate">{isFiltered ? `${kpiStats.totalAdmissions} in active filter` : '2,500 Network Total'}</span>
            </div>
          </div>

          {/* Card 2: Avg Wait Time (with Emergency sub-metric) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
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
              <span className="truncate">Emergency: ~{kpiStats.emergencyAvgWait} min</span>
            </div>
          </div>

          {/* Card 3: Length of Stay */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
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
              <span className="truncate">Benchmark: 4.41d overall</span>
            </div>
          </div>

          {/* Card 4: Readmissions */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
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
              <span className="truncate">{kpiStats.readmissionCount} readmitted pts</span>
            </div>
          </div>

          {/* Card 5: Bed Capacity */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
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
              <span>Optimal (&lt;85% load)</span>
            </div>
          </div>

          {/* Card 6: Active Staff */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
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
                ~{kpiStats.staffCount > 0 ? (kpiStats.totalAdmissions / kpiStats.staffCount).toFixed(1) : 0} pts/doc
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Patient Flow Trends & Admissions Growth (Recharts) */}
      <PatientFlowTrendsSection 
        onSelectQuery={onSelectQuery} 
        externalFacility={currentTrendFacility}
        onFacilityChange={handleTrendFacilityChange}
      />

      {/* ========================================================================= */}
      {/* 15 QUESTIONS & 15 DISTINCT CHART TYPES INTERACTIVE BUTTON HUB             */}
      {/* ========================================================================= */}
      <div id="dashboard-15-questions-hub" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                <BarChart className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                15 Analytical Questions & Multi-Chart Intelligence Hub
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any question button below (Q1 - Q15) to inspect its dedicated, unique visualization type:
            </p>
          </div>

          <button
            id="btn-open-all-15-charts-gallery"
            onClick={() => onNavigateTab('all-charts')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>Open 15-Chart Visualizer</span>
            <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>

        {/* 15 Question Buttons Grid with Chart Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {QUESTION_CHART_META.map((meta) => (
            <button
              key={meta.questionNumber}
              id={`dashboard-btn-q${meta.questionNumber}`}
              onClick={() => onSelectQuery(meta.questionNumber)}
              aria-label={`Open Question ${meta.questionNumber}: ${meta.shortTitle} with ${meta.chartType}`}
              className="text-left p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-sky-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-1.5 group"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="w-6 h-6 rounded-md bg-slate-900 text-white group-hover:bg-sky-600 flex items-center justify-center text-[10px] font-black transition-colors">
                  Q{meta.questionNumber}
                </span>
                <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border truncate ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}>
                  {meta.chartType.replace(' Chart', '')}
                </span>
              </div>

              <div className="font-bold text-xs text-slate-900 group-hover:text-sky-700 transition-colors truncate">
                {meta.shortTitle}
              </div>

              <div className="text-[10px] text-slate-500 truncate flex items-center justify-between">
                <span>{meta.chartCategory}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-sky-600 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Metrics & Department Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hospital Volume & Emergency Wait Comparison */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-base text-slate-900">Hospital Patient Volume & Emergency Wait</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                    {kpiStats.scopeLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {isFiltered ? 'Active filtered volume vs facility triage latency' : 'Cross-hospital volume vs Emergency triage latency across 4 branches'}
                </p>
              </div>
              <button
                id="btn-inspect-q2"
                onClick={() => onSelectQuery(2)}
                aria-label="Inspect Query 2"
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
            {dynamicHospitalMetrics.map(h => {
              const hospObj = HOSPITALS.find(item => item.hospital_name === h.hospital_name);
              const isSelected = filters.hospitalId !== 'all' && hospObj?.hospital_id === Number(filters.hospitalId);
              return (
                <button 
                  key={h.hospital_name} 
                  onClick={() => {
                    if (hospObj) {
                      setFilters(prev => ({
                        ...prev,
                        hospitalId: prev.hospitalId === String(hospObj.hospital_id) ? 'all' : String(hospObj.hospital_id)
                      }));
                    }
                  }}
                  aria-label={`Filter by ${h.city}`}
                  className={`p-2 rounded-lg cursor-pointer transition-all text-left w-full focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden ${
                    isSelected
                      ? 'bg-sky-100 border border-sky-300 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                  title="Click to filter by this hospital"
                >
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>{h.city}</span>
                    {isSelected && <span className="text-[10px] text-sky-700">✓</span>}
                  </div>
                  <div className="text-sm font-extrabold text-sky-700">{h.admissions} pts</div>
                  <div className="text-[10px] text-rose-600 font-semibold">{h.emergency_wait} min ER wait</div>
                </button>
              );
            })}
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
                aria-label="Inspect Query 3"
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
                  <button 
                    key={dept.name} 
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        departmentName: prev.departmentName === dept.name ? 'all' : dept.name
                      }));
                    }}
                    aria-label={`Filter by ${dept.name} department`}
                    className={`w-full p-2 rounded-xl text-left cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden ${
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
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">Triage Stratification:</span>
              <span className="text-[10px] text-slate-500 font-mono">Network-wide benchmark</span>
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

      {/* ========================================================================= */}
      {/* 10 KEY BUSINESS & CLINICAL FINDINGS (EXPANDABLE SECTION)                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-extrabold text-slate-900">
                10 Core Business & Clinical SQL Findings
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                Network-wide insight — unaffected by filters
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical operational discoveries synthesized from all 15 SQL analytical queries.
            </p>
          </div>

          {/* Toggle Expand / Collapse */}
          <button
            onClick={() => setIsInsightsExpanded(!isInsightsExpanded)}
            aria-expanded={isInsightsExpanded}
            aria-label={isInsightsExpanded ? "Collapse 10 detailed findings" : "Expand 10 detailed findings"}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
          >
            <span>{isInsightsExpanded ? 'Collapse Insights' : 'Expand All 10 Insights'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isInsightsExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Collapsible Findings Grid */}
        {isInsightsExpanded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-fadeIn">
            {BUSINESS_FINDINGS.map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  const queryMap: Record<number, number> = {
                    1: 2, 2: 4, 3: 4, 4: 14, 5: 9, 6: 6, 7: 7, 8: 3, 9: 8, 10: 10
                  };
                  onSelectQuery(queryMap[item.id] || 1);
                }}
                aria-label={`View SQL for Finding ${item.id}: ${item.title}`}
                className="p-4 rounded-xl border border-slate-100 hover:border-sky-300 hover:bg-sky-50/40 transition-all cursor-pointer group flex flex-col justify-between text-left focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
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
                  <span className="font-semibold text-sky-800">Operational Impact: </span>
                  {item.businessImpact}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>
              Includes findings on: <strong>Emergency Wait Latency (Q4)</strong>, <strong>Readmissions by Diagnosis (Q6)</strong>, <strong>Weekend Surges (Q7)</strong>, <strong>Composite Bottlenecks (Q14)</strong>, and <strong>Index Optimization (Q15)</strong>.
            </span>
            <button
              onClick={() => setIsInsightsExpanded(true)}
              className="text-sky-600 font-bold hover:underline shrink-0 cursor-pointer"
            >
              View all 10 findings →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
