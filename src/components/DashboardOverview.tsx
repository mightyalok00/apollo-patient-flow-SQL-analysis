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
  FileSpreadsheet,
  DollarSign,
  Sparkles,
  BarChart as BarChartIcon
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
  WAIT_TIME_CLASSIFICATION 
} from '../data/hospitalData';
import { SAMPLE_ADMISSIONS } from '../data/sampleDataset';
import { 
  CENTRAL_METRICS, 
  MODELED_FINANCIAL_PROJECTIONS, 
  INDEPENDENT_DISCLAIMER,
  MetricMetadata 
} from '../data/metricsEngine';
import { ALL_BUSINESS_INSIGHTS } from '../data/businessInsightsData';
import { PatientFlowTrendsSection } from './PatientFlowTrendsSection';
import { DashboardFilterBar, DashboardFilterState, INITIAL_FILTER_STATE } from './DashboardFilterBar';
import { HealthcareLogo } from './ApolloLogo';
import { QUESTION_CHART_META } from './QuestionsGraphHub';

interface DashboardOverviewProps {
  onSelectQuery: (questionNumber: number) => void;
  onNavigateTab: (tab: any) => void;
  onOpenInsights?: () => void;
  onOpenAbout?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  onSelectQuery, 
  onNavigateTab,
  onOpenInsights,
  onOpenAbout
}) => {
  // Global interactive filter state
  const [filters, setFilters] = useState<DashboardFilterState>(INITIAL_FILTER_STATE);
  const [isInsightsExpanded, setIsInsightsExpanded] = useState<boolean>(false);
  const [isFinancialExpanded, setIsFinancialExpanded] = useState<boolean>(false);
  const [showTableView, setShowTableView] = useState<boolean>(false);

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

      // 6. Disease Keyword Search
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
        sampleSize: 0,
        scopeLabel: `Filtered Slice (N=0)`,
      };
    }

    const totalWait = filteredAdmissions.reduce((acc, a) => acc + a.wait_time_minutes, 0);
    const avgWait = (totalWait / count).toFixed(2);

    // Filtered emergency admissions wait
    const emergAdms = filteredAdmissions.filter(a => {
      const dept = DEPARTMENTS.find(d => d.department_id === a.department_id);
      return dept?.department_name === 'Emergency' || a.admission_type === 'Emergency';
    });
    const emergWait = emergAdms.length > 0
      ? (emergAdms.reduce((s, a) => s + a.wait_time_minutes, 0) / emergAdms.length).toFixed(2)
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
    const readmRate = ((readmCount / count) * 100).toFixed(2);

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
      sampleSize: count,
      scopeLabel: isFiltered ? `Active Filtered Slice (N=${count.toLocaleString()})` : `Network-wide (N=2,500 records)`,
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
        ? Number((emergAdmissions.reduce((sum, a) => sum + a.wait_time_minutes, 0) / emergAdmissions.length).toFixed(2))
        : totalHosp > 0 
          ? Number((hospAdmissions.reduce((sum, a) => sum + a.wait_time_minutes, 0) / totalHosp).toFixed(2)) 
          : 0;

      const readmCount = hospAdmissions.filter(a => a.readmission_flag === 1).length;
      const readmRate = totalHosp > 0 ? parseFloat(((readmCount / totalHosp) * 100).toFixed(2)) : 0;

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
        ? Number((deptAdmissions.reduce((sum, a) => sum + a.wait_time_minutes, 0) / totalDept).toFixed(2))
        : 0;

      return {
        name,
        admissions: totalDept,
        avgWait,
        color: colors[name] || '#0284c7'
      };
    });
  }, [filteredAdmissions]);

  // Facility map for PatientFlowTrends
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

  // Top 3 Operational Bottlenecks & Actionable Alerts (answering What, Where, Action, Evidence)
  const topOperationalAlerts = [
    {
      id: 1,
      rank: '#1',
      title: 'Emergency Triage Congestion & Peak Wait Times',
      severity: 'Critical',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      whatIsWrong: 'Emergency wait times average 102.89 minutes network-wide (vs 45 min clinical target), exceeding the critical 75-minute threshold.',
      whereHappening: 'Apollo Bangalore Emergency (106.71 min wait) and Apollo Delhi Emergency (103.78 min wait, #1 overall strain rank).',
      recommendedAction: 'Deploy Rapid Assessment Triage (RAT) nurses during 18:00–23:00 surge windows and institute point-of-care lab order dispatch.',
      evidence: 'Q4 SQL Analysis: N=486 Emergency encounters across 4 hospitals; Wait times range 78–148 min with std dev ±16.4 min.',
      queryNum: 4,
      queryLabel: 'Run Q4 Triage Latency'
    },
    {
      id: 2,
      rank: '#2',
      title: 'Multi-Criteria Hospital Bottleneck Strain (Q14 Matrix)',
      severity: 'Critical',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      whatIsWrong: 'Apollo Delhi Emergency leads the network with a composite strain score of 92.11 / 100 due to high wait time, extended stay, and high readmission.',
      whereHappening: 'Apollo Delhi Emergency (Rank #1, Score 92.11) & Apollo Bangalore Emergency (Rank #2, Score 89.65).',
      recommendedAction: 'Implement proactive multidisciplinary morning discharge huddles and direct-to-ward fast-track routing for stable admissions.',
      evidence: 'Q14 SQL Composite Score: Weighted wait time (25%), length of stay (25%), readmission rate (25%), and bed utilization (25%).',
      queryNum: 14,
      queryLabel: 'Run Q14 Bottleneck Matrix'
    },
    {
      id: 3,
      rank: '#3',
      title: 'High-Risk Specialty 30-Day Readmission Clusters',
      severity: 'High Risk',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      whatIsWrong: 'Unplanned 30-day readmissions peak at 40.77% in Orthopedics and 37.72% in Emergency, compounding inpatient bed capacity pressure.',
      whereHappening: 'Apollo Delhi Orthopedics (40.77%, N=53/130) and Apollo Hyderabad Emergency (37.40%, N=46/123).',
      recommendedAction: 'Establish mandatory 48-hour post-discharge telephone follow-ups and automated medication reconciliation protocols.',
      evidence: 'Q7 SQL Analysis: 844 readmissions across 2,500 total admissions (33.76% network rate; Orthopedics peak at 40.77%).',
      queryNum: 7,
      queryLabel: 'Run Q7 Readmissions by Specialty'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Prominent Independent Demonstration Disclaimer Notice */}
      <div 
        id="disclaimer-banner"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
        role="region"
        aria-label="Portfolio Demonstration Disclaimer"
      >
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-white block text-xs mb-0.5">
              Independent Portfolio Demonstration
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {INDEPENDENT_DISCLAIMER}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
          {onOpenAbout && (
            <button
              onClick={onOpenAbout}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-all cursor-pointer"
            >
              About Project
            </button>
          )}
          {onOpenInsights && (
            <button
              onClick={onOpenInsights}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Business Insights</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Executive Problem Statement & Context Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/80 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-black uppercase tracking-wider">
              SQL Operational Intelligence
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
              4 Regional Facilities (Delhi, Mumbai, Bangalore, Hyderabad)
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
              2,500 Episodes • 680 Beds
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Healthcare Patient Flow SQL Analytics
          </h1>
          
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            Executive clinical operations dashboard diagnosing acute triage delays, inpatient length of stay (LOS), and 30-day readmissions across 4 metropolitan hospital facilities using normalized 3NF relational data, window functions, and CTE optimizations.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              id="btn-run-all-charts"
              onClick={() => onNavigateTab('all-charts')}
              aria-label="Explore 15 Analytical Visualizations"
              className="inline-flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
            >
              <span>Explore 15 SQL Visualizations</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              id="btn-view-bottlenecks"
              onClick={() => onNavigateTab('bottlenecks')}
              aria-label="Navigate to Bottleneck Analysis"
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Q14 Bottleneck Matrix</span>
            </button>
            {onOpenInsights && (
              <button
                onClick={onOpenInsights}
                aria-label="Open 10 Strategic Business Insights"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>10 Strategic Insights & Modeled ROI</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Global Interactive Multi-Dimensional Filter Bar */}
      <DashboardFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
        filteredCount={filteredAdmissions.length}
        totalCount={SAMPLE_ADMISSIONS.length}
      />

      {/* ========================================================================= */}
      {/* 4. EXECUTIVE FIRST SCREEN: TOP 3 OPERATIONAL ALERTS & ACTIONABLE TRIAD     */}
      {/* ========================================================================= */}
      <section 
        id="executive-triage-alerts"
        className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4"
        aria-labelledby="triage-alerts-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Flame className="w-4 h-4" />
              </span>
              <h2 id="triage-alerts-heading" className="text-base sm:text-lg font-black text-white">
                Top 3 Operational Bottlenecks & Triage Action Plan
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Clinical decision support answering: <strong className="text-slate-200">What is wrong? Where is it happening? What action is recommended? What evidence supports it?</strong>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-950 text-sky-300 border border-slate-800">
              {kpiStats.scopeLabel}
            </span>
          </div>
        </div>

        {/* 3 Actionable Alert Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {topOperationalAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4.5 rounded-2xl border border-slate-800 bg-slate-950/70 hover:bg-slate-950 hover:border-sky-500/50 transition-all flex flex-col justify-between space-y-3 shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${alert.badgeColor}`}>
                    Alert {alert.rank} • {alert.severity}
                  </span>
                  <button
                    onClick={() => onSelectQuery(alert.queryNum)}
                    aria-label={`Inspect SQL Query ${alert.queryNum}`}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center space-x-0.5 cursor-pointer"
                  >
                    <span>Q{alert.queryNum} SQL</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-extrabold text-sm text-white mb-2.5">{alert.title}</h3>

                {/* 4 Core Answers: What, Where, Action, Evidence */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-rose-400 block text-[10px] uppercase tracking-wider mb-0.5">
                      ⚠️ 1. What is wrong:
                    </span>
                    <span className="text-slate-300 leading-relaxed">{alert.whatIsWrong}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-indigo-300 block text-[10px] uppercase tracking-wider mb-0.5">
                      📍 2. Where is it happening:
                    </span>
                    <span className="text-slate-300 leading-relaxed font-medium">{alert.whereHappening}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                    <span className="font-bold text-emerald-300 block text-[10px] uppercase tracking-wider mb-0.5">
                      ✅ 3. What action is recommended:
                    </span>
                    <span className="text-emerald-200 leading-relaxed font-medium">{alert.recommendedAction}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-sky-950/20 border border-sky-800/30">
                    <span className="font-bold text-sky-400 block text-[10px] uppercase tracking-wider mb-0.5">
                      📊 4. Empirical evidence & sample:
                    </span>
                    <span className="text-sky-200 leading-relaxed font-mono text-[11px]">{alert.evidence}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Source: Analysis Q{alert.queryNum}</span>
                <button
                  onClick={() => onSelectQuery(alert.queryNum)}
                  className="font-bold text-sky-400 hover:text-sky-300 flex items-center space-x-1 cursor-pointer"
                >
                  <span>{alert.queryLabel}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SINGLE SOURCE OF TRUTH: 6 EXECUTIVE KPI CARDS WITH FULL METRIC METADATA */}
      {/* ========================================================================= */}
      <section aria-labelledby="kpi-metrics-heading" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <h2 id="kpi-metrics-heading" className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Executive Key Performance Indicators
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-sky-300 border border-slate-700">
              {kpiStats.scopeLabel}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {isFiltered ? 'Dynamically calculated on filtered slice' : 'Network aggregate across 4 hospitals (N=2,500)'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* Card 1: Admissions */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between space-y-2 hover:border-sky-500/50 transition-all">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Admissions</span>
                <Users className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {kpiStats.totalAdmissions.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                Total recorded patient intake episodes
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-sky-300 font-mono flex justify-between">
              <span>Unit: Patients</span>
              <span>Source: Q1/Q2</span>
            </div>
          </div>

          {/* Card 2: Avg Wait Time */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between space-y-2 hover:border-amber-500/50 transition-all">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Avg Wait Time</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {kpiStats.avgWaitMinutes} <span className="text-xs font-normal text-slate-400">min</span>
              </div>
              <p className="text-[10px] text-rose-400 mt-1 leading-tight font-semibold">
                Emergency Avg: {kpiStats.emergencyAvgWait} min
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-amber-300 font-mono flex justify-between">
              <span>Unit: Minutes</span>
              <span>Source: Q4</span>
            </div>
          </div>

          {/* Card 3: Length of Stay */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between space-y-2 hover:border-indigo-500/50 transition-all">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Length of Stay</span>
                <Bed className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {kpiStats.avgLosDays} <span className="text-xs font-normal text-slate-400">days</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                Inpatient ward stay from admission to discharge
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-indigo-300 font-mono flex justify-between">
              <span>Unit: Days</span>
              <span>Source: Q6</span>
            </div>
          </div>

          {/* Card 4: Readmissions */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between space-y-2 hover:border-rose-500/50 transition-all">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Readmission Rate</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {kpiStats.readmissionRatePct}
              </div>
              <p className="text-[10px] text-rose-300 mt-1 leading-tight">
                {kpiStats.readmissionCount} readmitted within 30 days
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-rose-300 font-mono flex justify-between">
              <span>Unit: Percentage</span>
              <span>Source: Q7</span>
            </div>
          </div>

          {/* Card 5: Bed Utilization */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between space-y-2 hover:border-emerald-500/50 transition-all">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Bed Capacity</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {kpiStats.bedCapacityPct}
              </div>
              <p className="text-[10px] text-emerald-300 mt-1 leading-tight">
                680 physical beds across 20 wards
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-300 font-mono flex justify-between">
              <span>Unit: % Occupied</span>
              <span>Source: Q9</span>
            </div>
          </div>

          {/* Card 6: Medical Staff */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between space-y-2 hover:border-teal-500/50 transition-all">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Medical Staff</span>
                <Stethoscope className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {kpiStats.staffCount} <span className="text-xs font-normal text-slate-400">docs</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                15 credentialed doctors per hospital
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-teal-300 font-mono flex justify-between">
              <span>Unit: Doctors</span>
              <span>Source: Q1</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Real-time Patient Flow Trends Section */}
      <PatientFlowTrendsSection 
        onSelectQuery={onSelectQuery} 
        externalFacility={currentTrendFacility}
        onFacilityChange={handleTrendFacilityChange}
      />

      {/* ========================================================================= */}
      {/* 7. 15 QUESTIONS & 15 DISTINCT CHART TYPES INTERACTIVE BUTTON HUB          */}
      {/* ========================================================================= */}
      <section 
        id="dashboard-15-questions-hub" 
        className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4"
        aria-labelledby="sql-hub-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/30">
                <BarChartIcon className="w-4 h-4" />
              </span>
              <h2 id="sql-hub-heading" className="text-base sm:text-lg font-black text-white">
                15 Analytical SQL Questions & Visualization Gallery
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any analytical question (Q1 – Q15) to inspect its production SQL query and dedicated chart:
            </p>
          </div>

          <button
            id="btn-open-all-15-charts-gallery"
            onClick={() => onNavigateTab('all-charts')}
            aria-label="Open full 15-Chart Visualizer view"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black shadow-md transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>Open All 15 Charts</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 15 Question Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {QUESTION_CHART_META.map((meta) => (
            <button
              key={meta.questionNumber}
              id={`dashboard-btn-q${meta.questionNumber}`}
              onClick={() => onSelectQuery(meta.questionNumber)}
              aria-label={`Open Question ${meta.questionNumber}: ${meta.shortTitle} with ${meta.chartType}`}
              className="text-left p-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-950 hover:border-sky-400 transition-all cursor-pointer flex flex-col justify-between space-y-1.5 group shadow-xs"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="w-6 h-6 rounded-md bg-slate-800 text-white group-hover:bg-sky-500 group-hover:text-slate-950 flex items-center justify-center text-[10px] font-black transition-colors">
                  Q{meta.questionNumber}
                </span>
                <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border truncate ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}>
                  {meta.chartType.replace(' Chart', '')}
                </span>
              </div>

              <div className="font-bold text-xs text-slate-100 group-hover:text-sky-300 transition-colors truncate">
                {meta.shortTitle}
              </div>

              <div className="text-[10px] text-slate-400 truncate flex items-center justify-between">
                <span>{meta.chartCategory}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-sky-400 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. HOSPITAL VOLUME & DEPARTMENT COMPARISON GRIDS                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hospital Volume & Emergency Wait Comparison */}
        <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-black text-sm sm:text-base text-white">Hospital Patient Volume & Emergency Wait</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-sky-300 font-mono border border-slate-800">
                    {kpiStats.scopeLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {isFiltered ? 'Active filtered volume vs facility triage latency' : 'Cross-hospital volume vs Emergency triage latency across 4 facilities'}
                </p>
              </div>
              <button
                id="btn-inspect-q2"
                onClick={() => onSelectQuery(2)}
                aria-label="Inspect Query 2"
                className="text-xs text-sky-400 font-bold hover:underline flex items-center cursor-pointer"
              >
                <span>Query 2</span>
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dynamicHospitalMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: '1px solid #334155', fontSize: '12px' }}
                    formatter={(value: any, name: string) => [
                      name === 'admissions' ? `${value} Admissions` : `${value} min wait`,
                      name === 'admissions' ? 'Admissions Volume' : 'Emergency Avg Wait'
                    ]}
                  />
                  <Bar dataKey="admissions" fill="#0284c7" radius={[6, 6, 0, 0]} name="admissions" />
                  <Bar dataKey="emergency_wait" fill="#f43f5e" radius={[6, 6, 0, 0]} name="emergency_wait" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-center">
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
                  className={`p-2.5 rounded-xl cursor-pointer transition-all text-left w-full border ${
                    isSelected
                      ? 'bg-sky-950/60 border-sky-400 text-white font-bold shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                  title="Click to filter by this hospital"
                >
                  <div className="text-xs font-bold flex items-center justify-between text-white">
                    <span>{h.city}</span>
                    {isSelected && <span className="text-[10px] text-sky-400">✓</span>}
                  </div>
                  <div className="text-sm font-black text-sky-400 mt-0.5">{h.admissions} admissions</div>
                  <div className="text-[10px] text-rose-400 font-medium">{h.emergency_wait} min ER wait</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Department Volume Breakdown */}
        <div className="lg:col-span-5 bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-sm sm:text-base text-white">Department Volume Distribution</h3>
                <p className="text-xs text-slate-400">Patient demand across clinical specialties</p>
              </div>
              <button
                id="btn-inspect-q3"
                onClick={() => onSelectQuery(3)}
                aria-label="Inspect Query 3"
                className="text-xs text-sky-400 font-bold hover:underline flex items-center cursor-pointer"
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
                    className={`w-full p-2.5 rounded-xl text-left cursor-pointer transition-all border ${
                      isSelected 
                        ? 'bg-sky-950/60 border-sky-400' 
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex justify-between text-xs font-bold text-white">
                      <span>
                        {dept.name} {isSelected && '✓'}
                      </span>
                      <span className="text-slate-400">{dept.admissions} admissions ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: dept.color }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Avg Wait: <span className={dept.avgWait > 80 ? 'text-rose-400 font-bold' : 'font-medium text-slate-300'}>{dept.avgWait} min</span></span>
                      <span>{dept.name === 'Emergency' ? '⚠️ High Triage Strain' : 'Stable Capacity'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-300">Triage Stratification:</span>
              <span className="text-[10px] text-slate-400 font-mono">Network benchmark</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {WAIT_TIME_CLASSIFICATION.map(tier => (
                <div key={tier.category} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] font-semibold text-slate-400 truncate">{tier.status}</div>
                  <div className="text-xs font-black font-mono" style={{ color: tier.color }}>{tier.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 9. MODELED FINANCIAL & OPERATIONAL PROJECTIONS (COLLAPSIBLE / TRANSPARENT)  */}
      {/* ========================================================================= */}
      <section className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <DollarSign className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                Modeled Financial & Operational Scenarios
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Modeled Estimate
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent financial projections with explicit baseline data, formulas, assumptions, and ±15% sensitivity ranges.
            </p>
          </div>

          <button
            onClick={() => setIsFinancialExpanded(!isFinancialExpanded)}
            aria-expanded={isFinancialExpanded}
            aria-label={isFinancialExpanded ? "Collapse financial model details" : "Expand financial model details"}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <span>{isFinancialExpanded ? 'Hide Calculations' : 'Inspect Math & Formulas'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFinancialExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* 3 Projections Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODELED_FINANCIAL_PROJECTIONS.map(proj => (
            <div key={proj.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {proj.metricName}
              </span>
              <div className="text-xl font-black text-emerald-400 font-mono">
                {proj.projectedValue}
              </div>
              <div className="text-[11px] text-slate-300">
                <strong className="text-slate-400">Baseline:</strong> {proj.baselineValue}
              </div>
              <div className="text-[10px] text-sky-300 font-mono pt-1 border-t border-slate-800">
                Sensitivity: {proj.sensitivityRange.min} to {proj.sensitivityRange.max} ({proj.sensitivityRange.variancePct})
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Expandable Formulas */}
        {isFinancialExpanded && (
          <div className="space-y-4 pt-4 border-t border-slate-800 animate-fadeIn">
            {MODELED_FINANCIAL_PROJECTIONS.map(proj => (
              <div key={`exp-${proj.id}`} className="p-4.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-sm text-white">{proj.metricName}</h4>
                  <span className="text-[10px] text-amber-300 font-mono">
                    {proj.disclaimer}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">Formula</span>
                    <code className="text-[11px] text-sky-200 font-mono block leading-relaxed">{proj.formula}</code>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Calculation Steps</span>
                    <div className="text-[11px] text-slate-300 font-mono space-y-0.5">
                      {proj.calculationSteps.slice(0, 3).map((step, idx) => (
                        <div key={idx}>{step}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 10. 10 CORE BUSINESS FINDINGS SUMMARY                                     */}
      {/* ========================================================================= */}
      <section className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                10 Core Business & Clinical Findings
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 font-semibold border border-slate-800">
                Network-wide synthesis
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical operational discoveries synthesized from all 15 SQL analytical queries.
            </p>
          </div>

          <button
            onClick={() => setIsInsightsExpanded(!isInsightsExpanded)}
            aria-expanded={isInsightsExpanded}
            aria-label={isInsightsExpanded ? "Collapse 10 detailed findings" : "Expand 10 detailed findings"}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <span>{isInsightsExpanded ? 'Collapse Findings' : 'Expand All 10 Findings'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isInsightsExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Collapsible Findings Grid */}
        {isInsightsExpanded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-fadeIn">
            {ALL_BUSINESS_INSIGHTS.map((item) => (
              <button 
                key={item.id}
                onClick={() => onSelectQuery(item.sourceQueryNumber)}
                aria-label={`View SQL for Finding ${item.id}: ${item.title}`}
                className="p-4.5 rounded-2xl border border-slate-800 bg-slate-950 hover:border-sky-400 transition-all cursor-pointer group flex flex-col justify-between text-left shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                      item.severity === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : item.severity === 'High Risk'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : item.severity === 'Positive'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                    }`}>
                      Finding #{item.id} • {item.category}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                    <strong className="text-slate-200">Evidence: </strong>
                    {item.evidence}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-sky-300">
                  <strong className="text-sky-400">Recommendation: </strong>
                  {item.actionableRecommendation}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span>
              Includes findings on: <strong className="text-slate-300">ER Triage Latency (Q4)</strong>, <strong className="text-slate-300">Readmissions by Diagnosis (Q7)</strong>, <strong className="text-slate-300">Composite Bottlenecks (Q14)</strong>, and <strong className="text-slate-300">CTE Performance (Q15)</strong>.
            </span>
            <button
              onClick={() => setIsInsightsExpanded(true)}
              className="text-sky-400 font-bold hover:underline shrink-0 cursor-pointer"
            >
              View all 10 findings →
            </button>
          </div>
        )}
      </section>

    </div>
  );
};
