import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  BedDouble, 
  ArrowRight, 
  Building2, 
  DollarSign, 
  Stethoscope, 
  ShieldCheck, 
  ChevronRight, 
  Zap, 
  Target, 
  BarChart3, 
  Lightbulb,
  ShieldAlert,
  SlidersHorizontal,
  Info,
  HelpCircle,
  FileCode2,
  FileSpreadsheet
} from 'lucide-react';
import { 
  ALL_BUSINESS_INSIGHTS, 
  QUERY_15_OPTIMIZATION_METRICS, 
  ANALYTICAL_LIMITATIONS,
  BusinessInsightItem
} from '../data/businessInsightsData';
import { 
  CENTRAL_METRICS, 
  MODELED_FINANCIAL_PROJECTIONS, 
  INDEPENDENT_DISCLAIMER 
} from '../data/metricsEngine';
import { HealthcareLogo } from './ApolloLogo';

interface BusinessInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToChart?: (chartNum: number) => void;
}

export const BusinessInsightsModal: React.FC<BusinessInsightsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToChart
}) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'financial' | 'optimization' | 'limitations'>('insights');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedInsightId, setSelectedInsightId] = useState<number>(1);
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

  const filteredInsights = ALL_BUSINESS_INSIGHTS.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const selectedInsight = ALL_BUSINESS_INSIGHTS.find(item => item.id === selectedInsightId) || ALL_BUSINESS_INSIGHTS[0];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="business-insights-title"
    >
      <div 
        ref={modalRef}
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="business-insights-title" className="text-base sm:text-lg font-black text-white tracking-tight">
                  Executive Business Insights & Action Plan
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  10 Findings
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Data-driven clinical operational findings, modeled cost reduction scenarios & SQL benchmarks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Business Insights Modal"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Independent Disclaimer Banner */}
        <div className="bg-amber-950/30 border-b border-amber-500/30 px-5 py-2.5 flex items-center space-x-2.5 text-xs text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="leading-tight font-medium text-[11px]">
            {INDEPENDENT_DISCLAIMER}
          </p>
        </div>

        {/* Primary View Switcher Tabs */}
        <div className="bg-slate-950 px-5 sm:px-6 border-b border-slate-800 flex space-x-2 overflow-x-auto py-2.5">
          {[
            { id: 'insights', label: '10 Strategic Insights', icon: Lightbulb, badge: '10 Findings' },
            { id: 'financial', label: 'Modeled ROI & Financials', icon: DollarSign, badge: 'Scenario Model' },
            { id: 'optimization', label: 'Query 15 Optimization', icon: Zap, badge: '50% Faster' },
            { id: 'limitations', label: 'Analytical Limitations', icon: Info, badge: 'Scope' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                  isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs text-slate-300">
          
          {/* TAB 1: 10 Strategic Insights */}
          {activeTab === 'insights' && (
            <div className="space-y-5">
              
              {/* Category Filter Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Filter Category:</span>
                {['all', 'Bottlenecks & Triage', 'Capacity & Volume', 'Clinical Quality & LOS', 'SQL Optimization'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                      activeCategory === cat
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 font-bold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                    }`}
                  >
                    {cat === 'all' ? 'All 10 Insights' : cat}
                  </button>
                ))}
              </div>

              {/* Master-Detail Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left: Insights Master List */}
                <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {filteredInsights.map(item => {
                    const isSelected = item.id === selectedInsight.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedInsightId(item.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col space-y-1.5 ${
                          isSelected
                            ? 'bg-sky-950/40 border-sky-500 text-white shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                            Insight #{item.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.severity === 'Critical'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : item.severity === 'High Risk'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : item.severity === 'Positive'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          }`}>
                            {item.severity}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs leading-snug line-clamp-2 text-slate-100">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                          <span>{item.sourceQueryTitle}</span>
                          <span className="font-mono text-sky-300 font-bold">{item.metricValue}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Detailed Finding Inspection Card */}
                <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                        {selectedInsight.category} • Insight #{selectedInsight.id}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-white mt-1">
                        {selectedInsight.title}
                      </h3>
                    </div>
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg shrink-0 ${
                      selectedInsight.severity === 'Critical'
                        ? 'bg-rose-500 text-slate-950'
                        : selectedInsight.severity === 'High Risk'
                        ? 'bg-amber-500 text-slate-950'
                        : selectedInsight.severity === 'Positive'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-sky-500 text-slate-950'
                    }`}>
                      {selectedInsight.severity}
                    </span>
                  </div>

                  {/* 1. Finding */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">1. Core Finding</span>
                    <p className="text-xs text-slate-200 bg-slate-900/90 p-3 rounded-xl border border-slate-800 leading-relaxed font-medium">
                      {selectedInsight.finding}
                    </p>
                  </div>

                  {/* 2. Evidence */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">2. Empirical Evidence & Sample Data</span>
                    <p className="text-xs text-sky-200 bg-sky-950/20 p-3 rounded-xl border border-sky-800/30 leading-relaxed font-mono">
                      {selectedInsight.evidence}
                    </p>
                  </div>

                  {/* 3. Business Impact */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">3. Business & Operational Impact</span>
                    <p className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      {selectedInsight.businessImpact}
                    </p>
                  </div>

                  {/* 4. Actionable Recommendation */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">4. Actionable Recommendation</span>
                    <p className="text-xs text-amber-100 bg-amber-950/20 p-3 rounded-xl border border-amber-800/30 leading-relaxed font-medium">
                      {selectedInsight.actionableRecommendation}
                    </p>
                  </div>

                  {/* Metadata & Query Link */}
                  <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-300">Scope:</span>
                      <span>{selectedInsight.scope}</span>
                    </div>

                    {onNavigateToChart && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToChart(selectedInsight.sourceQueryNumber);
                        }}
                        className="inline-flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-bold transition-colors cursor-pointer"
                      >
                        <span>Open {selectedInsight.sourceQueryTitle}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: Modeled ROI & Financial Projections */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-sky-950/30 p-4 rounded-2xl border border-emerald-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Modeled Financial Scenarios & Sensitivity Analysis</span>
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Modeled Estimate
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Every projection displays baseline values, empirical assumptions, explicit formulas, step-by-step calculations, and ±15% sensitivity bounds.
                </p>
              </div>

              <div className="space-y-5">
                {MODELED_FINANCIAL_PROJECTIONS.map(proj => (
                  <div key={proj.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-white">{proj.metricName}</h4>
                        <p className="text-[11px] text-slate-400">Scope: {proj.scope}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-black text-emerald-400 font-mono">{proj.projectedValue}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {proj.sensitivityRange.variancePct}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Baseline vs Target */}
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Baseline Value</span>
                          <span className="text-xs font-semibold text-slate-200">{proj.baselineValue}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">Target Scenario</span>
                          <span className="text-xs font-semibold text-emerald-300">{proj.targetValue}</span>
                        </div>
                      </div>

                      {/* Formula & Sensitivity Range */}
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1">Mathematical Formula</span>
                          <code className="text-[11px] text-sky-200 font-mono block leading-relaxed">{proj.formula}</code>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Sensitivity Range (±15%)</span>
                            <span className="text-xs font-mono font-bold text-slate-200">{proj.sensitivityRange.min} — {proj.sensitivityRange.max}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Assumptions & Step Calculations */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Core Assumptions & Step-by-Step Calculation</span>
                      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                          {proj.assumptions.map((asm, idx) => (
                            <li key={idx}><strong className="text-slate-200">Assumption:</strong> {asm}</li>
                          ))}
                        </ul>
                        <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] font-mono text-sky-300">
                          {proj.calculationSteps.map((step, idx) => (
                            <div key={idx} className="leading-relaxed">{step}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer Tag */}
                    <div className="text-[10px] text-amber-300/80 flex items-center space-x-1.5 font-medium">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{proj.disclaimer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Query 15 Optimization */}
          {activeTab === 'optimization' && (
            <div className="space-y-5">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-sky-400" />
                      <span>Query 15: Efficiency Index & CTE Execution Benchmark</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Comparing correlated subqueries against modular Common Table Expressions (CTEs)
                    </p>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950">
                    {QUERY_15_OPTIMIZATION_METRICS.percentImprovement} Faster
                  </span>
                </div>

                {/* Benchmark Comparison Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/30 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">Baseline Query (Correlated Subqueries)</span>
                    <div className="text-2xl font-black text-rose-300 font-mono">{QUERY_15_OPTIMIZATION_METRICS.originalQueryTimeMs} ms</div>
                    <p className="text-[11px] text-slate-400">{QUERY_15_OPTIMIZATION_METRICS.originalScanType}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Optimized Query (CTEs + Composite Indexes)</span>
                    <div className="text-2xl font-black text-emerald-300 font-mono">{QUERY_15_OPTIMIZATION_METRICS.optimizedQueryTimeMs} ms</div>
                    <p className="text-[11px] text-slate-400">{QUERY_15_OPTIMIZATION_METRICS.optimizedScanType}</p>
                  </div>
                </div>

                {/* Optimization Techniques */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Applied SQL Architecture Techniques</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {QUERY_15_OPTIMIZATION_METRICS.sqlTechniques.map((tech, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {onNavigateToChart && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToChart(15);
                    }}
                    className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <span>View Interactive Dumbbell Chart for Q15</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Analytical Limitations */}
          {activeTab === 'limitations' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Info className="w-4 h-4 text-sky-400" />
                  <span>Analytical Methodology & Dataset Limitations</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  To ensure academic and operational rigor, the following analytical constraints and modeling boundaries should be noted:
                </p>

                <div className="space-y-2.5 pt-2">
                  {ANALYTICAL_LIMITATIONS.map((lim, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3 text-xs text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{lim}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Ribbon */}
        <div className="bg-slate-950 px-5 sm:px-6 py-3.5 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span>Healthcare Patient Flow Analytics</span>
            <span>•</span>
            <span className="font-bold text-slate-300">Alok Agarwal</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close Insights
          </button>
        </div>

      </div>
    </div>
  );
};
