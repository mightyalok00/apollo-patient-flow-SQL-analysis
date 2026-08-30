import React, { useState } from 'react';
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
  Lightbulb
} from 'lucide-react';

interface BusinessInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToChart?: (chartNum: number) => void;
}

interface StrategicInitiative {
  id: string;
  title: string;
  category: 'Efficiency' | 'Revenue & Bed Turn' | 'Clinical Quality' | 'Staffing';
  impactLevel: 'Critical' | 'High' | 'Medium';
  metricTarget: string;
  projectedRoi: string;
  description: string;
  actionItems: string[];
  linkedChart: number;
  linkedChartTitle: string;
}

export const BusinessInsightsModal: React.FC<BusinessInsightsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToChart
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'Efficiency' | 'Revenue & Bed Turn' | 'Clinical Quality' | 'Staffing'>('all');
  const [selectedInitiative, setSelectedInitiative] = useState<string>('init-1');

  if (!isOpen) return null;

  const executiveKpis = [
    {
      label: 'Estimated Annual Cost Savings',
      value: '₹14.8 Cr',
      subtext: 'Across 4 Apollo Facilities',
      trend: '+22.4%',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30'
    },
    {
      label: 'ER Triage Latency Target',
      value: '45 mins',
      subtext: 'Current: 132 mins (-65.9%)',
      trend: 'Top Bottleneck',
      icon: Clock,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30'
    },
    {
      label: 'Additional Patient Capacity',
      value: '+1,420 / yr',
      subtext: 'Via 1.2 day LOS reduction',
      trend: '+18.5% Throughput',
      icon: BedDouble,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/30'
    },
    {
      label: '30-Day Readmission Target',
      value: '< 8.5%',
      subtext: 'Current: 14.8% (-6.3 pts)',
      trend: 'Quality Benchmark',
      icon: Target,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30'
    }
  ];

  const strategicInitiatives: StrategicInitiative[] = [
    {
      id: 'init-1',
      title: 'Emergency Department Fast-Track & Triage Automation',
      category: 'Efficiency',
      impactLevel: 'Critical',
      metricTarget: 'Reduce ER wait time from 132 min to < 45 min',
      projectedRoi: '₹4.2 Cr / year in diversion prevention & bed turnaround',
      description: 'Emergency medicine exhibits the highest triage latency across all four regional hospitals (Delhi at 141m, Bangalore at 138m, Mumbai at 129m, Hyderabad at 122m). Introducing a digital rapid-triage nurse unit and point-of-care lab diagnostics will decouple non-critical admissions from immediate trauma beds.',
      actionItems: [
        'Deploy 2 dedicated Rapid Assessment Triage (RAT) nurses during 18:00–23:00 peak arrival surge.',
        'Implement automated digital triage scoring with direct bedside lab order dispatch.',
        'Establish direct-to-ward fast-track routing for low-acuity internal medicine transfers.'
      ],
      linkedChart: 4,
      linkedChartTitle: 'Chart Q4: Triage Latency & Wait-Time Severity'
    },
    {
      id: 'init-2',
      title: 'Cardiology & Neurology Length of Stay (LOS) Clinical Pathways',
      category: 'Revenue & Bed Turn',
      impactLevel: 'High',
      metricTarget: 'Reduce average stay from 6.8 days to 5.2 days',
      projectedRoi: '₹5.6 Cr / year via 18% higher bed availability & procedural revenue',
      description: 'Cardiology and Neurology hold the longest inpatient stays (6.8 and 6.4 days average) with significant standard deviation. Standardizing 72-hour step-down criteria to general telemetry wards and proactive discharge planning by 11:00 AM daily can liberate 340+ bed-days monthly.',
      actionItems: [
        'Institute mandatory multi-disciplinary discharge huddles at 09:00 AM daily across all cardiac units.',
        'Adopt standard telemetry step-down protocols on post-op day 2 for elective catheterization patients.',
        'Partner with Apollo HomeCare for post-stroke home physical therapy transition.'
      ],
      linkedChart: 6,
      linkedChartTitle: 'Chart Q6: Length of Stay (LOS) Dispersion'
    },
    {
      id: 'init-3',
      title: 'Post-Discharge 30-Day Readmission Mitigation Program',
      category: 'Clinical Quality',
      impactLevel: 'High',
      metricTarget: 'Lower readmission rate from 14.8% to < 8.5%',
      projectedRoi: '₹2.8 Cr / year in uncompensated care reduction & insurance quality bonus',
      description: 'Orthopedics and General Medicine experience elevated 30-day readmissions (16.2% and 15.1% respectively), predominantly driven by surgical site infections and medication non-adherence in geriatric populations.',
      actionItems: [
        'Automated 48-hour follow-up teleconsultation for all discharged high-risk cardiac and orthopedic patients.',
        'Provide standardized digital medication reconciliation kits upon discharge via Apollo 24|7 app.',
        'Establish a dedicated outpatient wound-care & recovery hotline staffed 24/7 by clinical coordinators.'
      ],
      linkedChart: 7,
      linkedChartTitle: 'Chart Q7: 30-Day Readmission Rate Matrix'
    },
    {
      id: 'init-4',
      title: 'Inter-Facility Bed Capacity & Surge Load Balancing',
      category: 'Revenue & Bed Turn',
      impactLevel: 'High',
      metricTarget: 'Maintain 82–88% optimal bed occupancy across all 4 metros',
      projectedRoi: '₹2.2 Cr / year in avoided emergency boarding & overtime shifts',
      description: 'Hyderabad operates at near-critical bed occupancy (91.4% ICU, 88.2% Ward) during weekday peaks, while Bangalore experiences lower utilization (74.6%). Dynamic regional load-visibility and regional transfer protocols optimize resource utilization.',
      actionItems: [
        'Implement real-time census telemetry integration across regional Apollo operations control rooms.',
        'Trigger elective procedure rescheduling buffers when regional ward occupancy exceeds 89%.',
        'Establish shared on-call clinical nurse floating pools during seasonal dengue and influenza spikes.'
      ],
      linkedChart: 9,
      linkedChartTitle: 'Chart Q9: Department Bed Utilization & Capacity'
    },
    {
      id: 'init-5',
      title: 'Composite Bottleneck Q14 Metric Optimization Protocol',
      category: 'Efficiency',
      impactLevel: 'Critical',
      metricTarget: 'Reduce department strain index from 78.4 to < 42.0',
      projectedRoi: 'Comprehensive clinical operations benchmark improvement',
      description: 'The Q14 composite strain index tracks normalized triage delay, inpatient stay duration, 30-day readmission rate, and bed utilization. Aligning department heads with weekly Q14 executive reviews drives systematic operational excellence.',
      actionItems: [
        'Distribute automated weekly Q14 scorecard reports to all 20 clinical department heads.',
        'Tie operational bonuses to sustained Q14 scores below 50 index points.',
        'Conduct monthly root-cause bottleneck reviews for any unit entering the Critical Tier (>75 points).'
      ],
      linkedChart: 14,
      linkedChartTitle: 'Chart Q14: Composite Bottleneck Scoring Model'
    }
  ];

  const filteredInitiatives = activeCategory === 'all' 
    ? strategicInitiatives 
    : strategicInitiatives.filter(i => i.category === activeCategory);

  const activeInitiativeData = strategicInitiatives.find(i => i.id === selectedInitiative) || strategicInitiatives[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-white tracking-tight">Executive Business Insights & ROI Roadmap</h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  C-Suite Analytics
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Actionable operational recommendations synthesized from 2,500 patient episodes across Delhi, Mumbai, BLR & HYD
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Business Insights Modal"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive KPI Summary Bar */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 px-6 py-3.5 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {executiveKpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div 
                key={idx}
                className={`p-3 rounded-xl border ${kpi.border} ${kpi.bg} flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-300 line-clamp-1">{kpi.label}</span>
                  <Icon className={`w-3.5 h-3.5 ${kpi.color} shrink-0`} />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-lg font-black text-white">{kpi.value}</span>
                  <span className={`text-[10px] font-bold ${kpi.color}`}>{kpi.trend}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 truncate">{kpi.subtext}</span>
              </div>
            );
          })}
        </div>

        {/* Content Body: Left Column (Initiatives list) + Right Column (Deep Dive) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900">
          
          {/* Left Column: Filter Chips & Strategic Initiative Cards */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-sky-400" />
                <span>Strategic Interventions ({filteredInitiatives.length})</span>
              </h3>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {(['all', 'Efficiency', 'Revenue & Bed Turn', 'Clinical Quality'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-sky-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'All Pillars' : cat}
                </button>
              ))}
            </div>

            {/* Initiative Selectable List */}
            <div className="space-y-2 overflow-y-auto max-h-[420px] pr-1">
              {filteredInitiatives.map((item) => {
                const isSelected = selectedInitiative === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedInitiative(item.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-slate-800 border-sky-500/80 shadow-md ring-1 ring-sky-500/40 text-white'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        item.impactLevel === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.impactLevel} Impact
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">{item.category}</span>
                    </div>

                    <h4 className="font-bold text-sm text-white line-clamp-1 mb-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">{item.metricTarget}</p>
                    
                    <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-800/60">
                      <span className="font-bold text-emerald-400 truncate">{item.projectedRoi}</span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400' : 'text-slate-600'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Initiative Deep Dive & Direct Visualization Link */}
          <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                      {activeInitiativeData.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Pillar Analysis</span>
                  </div>
                  <h3 className="text-base font-black text-white">{activeInitiativeData.title}</h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Expected Return</span>
                  <span className="text-xs font-black text-emerald-400">{activeInitiativeData.projectedRoi}</span>
                </div>
              </div>

              {/* Problem Analysis */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Clinical & Operational Assessment</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  {activeInitiativeData.description}
                </p>
              </div>

              {/* Action Items List */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Recommended Action Plan</span>
                </h4>
                <div className="space-y-1.5">
                  {activeInitiativeData.actionItems.map((action, i) => (
                    <div 
                      key={i} 
                      className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Link to Analytical Visualization */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800/90">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Underlying Analytical Data Model</span>
                  <span className="text-xs font-bold text-white line-clamp-1">{activeInitiativeData.linkedChartTitle}</span>
                </div>
              </div>

              {onNavigateToChart && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToChart(activeInitiativeData.linkedChart);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <span>Open Interactive Visualizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Formulated for Apollo Hospitals Healthcare Leadership</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer text-xs"
            >
              Close Window
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
