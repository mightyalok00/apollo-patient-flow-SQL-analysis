import React, { useEffect, useRef } from 'react';
import { 
  X, 
  FileCode2, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Award, 
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  User,
  Zap,
  Activity
} from 'lucide-react';
import { HealthcareLogo } from './ApolloLogo';
import { INDEPENDENT_DISCLAIMER } from '../data/metricsEngine';

interface AboutProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToQuery?: (qNum: number) => void;
}

export const AboutProjectModal: React.FC<AboutProjectModalProps> = ({
  isOpen,
  onClose,
  onNavigateToQuery
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/60 px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HealthcareLogo size="md" />
            <div>
              <h2 id="about-modal-title" className="text-base sm:text-lg font-black text-white tracking-tight">
                About This Project
              </h2>
              <p className="text-xs text-slate-400">
                Portfolio Architecture, Analytical Methodology & Author Credit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close About Project Modal"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prominent Independent Disclaimer Banner */}
        <div className="bg-amber-950/30 border-b border-amber-500/30 px-5 py-2.5 flex items-center space-x-2.5 text-xs text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="leading-tight font-medium text-[11px]">
            {INDEPENDENT_DISCLAIMER}
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-xs text-slate-300">
          
          {/* Author Banner & Project Title */}
          <div className="bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-950 p-5 rounded-2xl border border-sky-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
                Healthcare Analytics Portfolio
              </span>
              <h3 className="text-lg font-black text-white">Healthcare Patient Flow SQL Analytics</h3>
              <p className="text-xs text-slate-400">
                Full-Stack Interactive Clinical Analytics & Relational SQL Decision Platform
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-700/80 shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-xs">
                AA
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Author & Architect</span>
                <span className="text-xs font-black text-white">Alok Agarwal</span>
              </div>
            </div>
          </div>

          {/* Grid: Business Problem & Scope */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. The Business Problem */}
            <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>The Clinical Operational Problem</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Hospital networks suffer from severe throughput friction in emergency triage, prolonged inpatient length of stay (LOS), and avoidable 30-day readmissions. This project models systemic bottlenecks across acute care departments to identify root causes and quantify operational and financial interventions.
              </p>
            </div>

            {/* 2. Dataset Scope */}
            <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Database className="w-4 h-4" />
                <span>Dataset Scope (3NF Relational Model)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">Total Admissions</span>
                  <span className="font-bold text-white">2,500 Records</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">Hospital Facilities</span>
                  <span className="font-bold text-white">4 Metros</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">Clinical Departments</span>
                  <span className="font-bold text-white">20 Wards (680 Beds)</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">Medical Doctors</span>
                  <span className="font-bold text-white">60 Consultants</span>
                </div>
              </div>
            </div>

          </div>

          {/* SQL Techniques Demonstrated */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <FileCode2 className="w-4 h-4" />
              <span>Advanced SQL Techniques Demonstrated (15 Production Queries)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                { title: 'Window Functions', desc: 'PERCENT_RANK(), ROW_NUMBER(), DENSE_RANK() for multi-criteria rankings (Q14).' },
                { title: 'Common Table Expressions (CTEs)', desc: 'Modular multi-stage aggregations and subquery consolidation (Q15).' },
                { title: 'Complex Joins & Foreign Keys', desc: 'Normalized 3NF joins across admissions, doctors, beds, and patients.' },
                { title: 'Date Arithmetic & Aging', desc: 'DATEDIFF, TIMESTAMPDIFF, and cohort temporal analysis (Q6, Q8).' },
                { title: 'Conditional Aggregations', desc: 'SUM(CASE WHEN ...) for categorized triage buckets (Q5, Q9).' },
                { title: 'Query Plan Optimization', desc: 'EXPLAIN and composite indexing (hospital_id, department_id) for 50% speedup.' }
              ].map((tech, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                  <h4 className="font-bold text-white text-xs mb-1">{tech.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Three Most Valuable Findings */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Three Most Valuable Findings</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/30 flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <h5 className="font-bold text-white text-xs">Emergency Triage Severity Bottleneck (Q4)</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Emergency wait times average 102.89 minutes (peaking at 106.71 min in Bangalore and 103.78 min in Delhi), compared to an overall 62.81 min network average.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <h5 className="font-bold text-white text-xs">Apollo Delhi Emergency Top Composite Strain (Q14)</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Ranked #1 in multi-criteria strain index (92.11 / 100) driven by 103.78 min triage wait, 4.80-day length of stay, and 37.72% 30-day readmission rate.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <h5 className="font-bold text-white text-xs">Query 15 Performance Optimization Benchmark</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Replacing correlated subqueries with pre-aggregated CTEs reduced execution time by ~50% (0.032s → 0.016s), establishing an optimal query blueprint.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-white text-xs flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Technology Stack & Architecture</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Recharts', 'Lucide Icons', 'MySQL Relational Schema', 'D3 Vector Interpolation'].map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700/80 font-mono text-[11px]">
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Ribbon */}
        <div className="bg-slate-950 px-5 sm:px-6 py-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span>Portfolio Project by</span>
            <span className="font-bold text-white">Alok Agarwal</span>
            <span>• 2026</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};
