import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Layers, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Download, 
  Maximize2, 
  Lightbulb, 
  Filter, 
  CheckCircle2, 
  ExternalLink,
  Table,
  LayoutGrid,
  MonitorPlay,
  TrendingUp,
  Activity
} from 'lucide-react';
import { SQL_QUESTIONS } from '../data/sqlQuestions';
import { executePredefinedQuery } from '../data/sqlRunner';
import { QueryVisualization } from './visualizations/QueryVisualization';
import { SqlQueryQuestion } from '../types';

// Specialized chart components for the 15-grid gallery
import { Q1Treemap } from './visualizations/charts/Q1Treemap';
import { Q2RankedColumns } from './visualizations/charts/Q2RankedColumns';
import { Q3LollipopChart } from './visualizations/charts/Q3LollipopChart';
import { Q4WaitHistogram } from './visualizations/charts/Q4WaitHistogram';
import { Q5StackedBar } from './visualizations/charts/Q5StackedBar';
import { Q6BoxPlot } from './visualizations/charts/Q6BoxPlot';
import { Q7Heatmap } from './visualizations/charts/Q7Heatmap';
import { Q8FrequencyDistribution } from './visualizations/charts/Q8FrequencyDistribution';
import { Q9BulletCharts } from './visualizations/charts/Q9BulletCharts';
import { Q10SankeyFlow } from './visualizations/charts/Q10SankeyFlow';
import { Q11DeviationBar } from './visualizations/charts/Q11DeviationBar';
import { Q12QuadrantBubble } from './visualizations/charts/Q12QuadrantBubble';
import { Q13BumpChart } from './visualizations/charts/Q13BumpChart';
import { Q14ContributionBars } from './visualizations/charts/Q14ContributionBars';
import { Q15DumbbellChart } from './visualizations/charts/Q15DumbbellChart';

export interface ChartMeta {
  questionNumber: number;
  chartType: string;
  chartCategory: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  shortTitle: string;
  purpose: string;
}

export const QUESTION_CHART_META: ChartMeta[] = [
  {
    questionNumber: 1,
    chartType: 'Treemap Chart',
    chartCategory: 'Relational Hierarchy',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    shortTitle: 'Schema Record Sizes',
    purpose: 'Nested proportional area tiles visualizing 6 relational table record volumes.'
  },
  {
    questionNumber: 2,
    chartType: 'Ranked Bar Chart',
    chartCategory: 'Comparative Workload',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    shortTitle: 'Hospital Admissions',
    purpose: 'Descending column bars comparing patient volume and network percentage shares.'
  },
  {
    questionNumber: 3,
    chartType: 'Lollipop Chart',
    chartCategory: 'Specialty Ranking',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    shortTitle: 'Top 5 Departments',
    purpose: 'Slim stems with circular metric markers highlighting the busiest clinical centers.'
  },
  {
    questionNumber: 4,
    chartType: 'Frequency Histogram',
    chartCategory: 'Latency Distribution',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    shortTitle: 'Wait-Time Latency',
    purpose: 'Binned frequency distribution tracking triage latency across 10 departments.'
  },
  {
    questionNumber: 5,
    chartType: '100% Stacked Bar',
    chartCategory: 'Triage Proportions',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    badgeBorder: 'border-orange-200',
    shortTitle: 'Bottleneck Tiers',
    purpose: 'Proportional bars stratifying Normal (<45m), Moderate (45-60m), and Severe (>60m) cases.'
  },
  {
    questionNumber: 6,
    chartType: 'Box & Whisker Plot',
    chartCategory: 'Statistical Dispersion',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    shortTitle: 'Length of Stay (LOS)',
    purpose: 'Quartiles, medians, and max stay whiskers across inpatient specialty wards.'
  },
  {
    questionNumber: 7,
    chartType: '2D Heatmap Matrix',
    chartCategory: 'Correlation Density',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    shortTitle: 'Readmission Matrix',
    purpose: 'Color intensity grid mapping 30-day readmission rates for 4 Hospitals × Specialties.'
  },
  {
    questionNumber: 8,
    chartType: 'Area Distribution Curve',
    chartCategory: 'Frequency Polygon',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    shortTitle: 'Repeat Visits Curve',
    purpose: 'Continuous shaded area polygon charting patient admission frequencies from 1 to 11+.'
  },
  {
    questionNumber: 9,
    chartType: 'Bullet Gauge Chart',
    chartCategory: 'Capacity Benchmarking',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-700',
    badgeBorder: 'border-cyan-200',
    shortTitle: 'Bed Census Gauges',
    purpose: 'Stephen Few-style qualitative ranges (Safe, Warning 75%, Critical 90%) with target markers.'
  },
  {
    questionNumber: 10,
    chartType: 'Sankey Flow Diagram',
    chartCategory: 'Multi-Stage Routing',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
    badgeBorder: 'border-teal-200',
    shortTitle: 'Patient Flow Sankey',
    purpose: 'Multi-level nodal ribbons tracking volume flow from Facility to Ward to Discharge Status.'
  },
  {
    questionNumber: 11,
    chartType: 'Diverging Deviation Bar',
    chartCategory: 'Delta Variance',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    badgeBorder: 'border-violet-200',
    shortTitle: 'Wait Variance vs Mean',
    purpose: 'Bi-directional divergence bars plotting department delta against the 49.3m network mean.'
  },
  {
    questionNumber: 12,
    chartType: 'Quadrant Bubble Plot',
    chartCategory: 'Multi-Variable Matrix',
    badgeBg: 'bg-pink-50',
    badgeText: 'text-pink-700',
    badgeBorder: 'border-pink-200',
    shortTitle: 'Efficiency Quadrants',
    purpose: '4-quadrant scatter matrix: Volume (X) vs Wait Time (Y) with bubble size = Readmissions.'
  },
  {
    questionNumber: 13,
    chartType: 'Bump Rank Trajectory',
    chartCategory: 'Ordinal Slope Graph',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-300',
    shortTitle: 'Rank Trajectory Paths',
    purpose: 'Connected slope paths showing ordinal rank shifts across Volume, Wait, and Length of Stay.'
  },
  {
    questionNumber: 14,
    chartType: 'Contribution Bar Breakdown',
    chartCategory: 'Composite Decomposition',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
    badgeBorder: 'border-red-200',
    shortTitle: 'Bottleneck Index (0-100)',
    purpose: 'Stacked component weights (25% Wait, 25% LOS, 25% Readmission, 25% Beds) for top strain wards.'
  },
  {
    questionNumber: 15,
    chartType: 'Dumbbell Comparison Plot',
    chartCategory: 'Before/After Tuning',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-300',
    shortTitle: 'EXPLAIN Query Speedup',
    purpose: 'Connected dot comparisons demonstrating 50% latency drop after composite indexing & CTEs.'
  }
];

interface QuestionsGraphHubProps {
  initialQuestionNumber?: number;
  onSelectQuestion?: (questionNumber: number) => void;
}

export const QuestionsGraphHub: React.FC<QuestionsGraphHubProps> = ({
  initialQuestionNumber = 1,
  onSelectQuestion
}) => {
  const [selectedQuestionNumber, setSelectedQuestionNumber] = useState<number>(initialQuestionNumber);
  const [viewMode, setViewMode] = useState<'focused' | 'gallery'>('focused');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const activeQuestion = useMemo(() => {
    return SQL_QUESTIONS.find(q => q.questionNumber === selectedQuestionNumber) || SQL_QUESTIONS[0];
  }, [selectedQuestionNumber]);

  const activeResult = useMemo(() => {
    return executePredefinedQuery(selectedQuestionNumber);
  }, [selectedQuestionNumber]);

  const activeMeta = useMemo(() => {
    return QUESTION_CHART_META.find(m => m.questionNumber === selectedQuestionNumber) || QUESTION_CHART_META[0];
  }, [selectedQuestionNumber]);

  // Pre-calculate all 15 results for the gallery view
  const allResultsMap = useMemo(() => {
    const map: Record<number, any> = {};
    for (let i = 1; i <= 15; i++) {
      map[i] = executePredefinedQuery(i);
    }
    return map;
  }, []);

  // Filter questions according to selected category
  const filteredMetaList = useMemo(() => {
    if (categoryFilter === 'All') return QUESTION_CHART_META;
    if (categoryFilter === 'Volume') return QUESTION_CHART_META.filter(m => [1, 2, 3].includes(m.questionNumber));
    if (categoryFilter === 'Latency') return QUESTION_CHART_META.filter(m => [4, 5, 6].includes(m.questionNumber));
    if (categoryFilter === 'Quality') return QUESTION_CHART_META.filter(m => [7, 8, 9].includes(m.questionNumber));
    if (categoryFilter === 'Advanced') return QUESTION_CHART_META.filter(m => [10, 11, 12, 13, 14, 15].includes(m.questionNumber));
    return QUESTION_CHART_META;
  }, [categoryFilter]);

  // Render a specific mini-chart component for the 15-gallery grid
  const renderGalleryChart = (questionNum: number) => {
    const data = allResultsMap[questionNum]?.rows || [];
    switch (questionNum) {
      case 1:
        return <Q1Treemap data={data} />;
      case 2:
        return <Q2RankedColumns data={data} />;
      case 3:
        return <Q3LollipopChart data={data} />;
      case 4:
        return <Q4WaitHistogram data={data} />;
      case 5:
        return <Q5StackedBar data={data} />;
      case 6:
        return <Q6BoxPlot data={data} />;
      case 7:
        return <Q7Heatmap data={data} />;
      case 8:
        return <Q8FrequencyDistribution data={data} />;
      case 9:
        return <Q9BulletCharts data={data} />;
      case 10:
        return <Q10SankeyFlow data={data} />;
      case 11:
        return <Q11DeviationBar data={data} />;
      case 12:
        return <Q12QuadrantBubble data={data} />;
      case 13:
        return <Q13BumpChart data={data} />;
      case 14:
        return <Q14ContributionBars data={data} />;
      case 15:
        return <Q15DumbbellChart data={data} />;
      default:
        return <Q2RankedColumns data={data} />;
    }
  };

  return (
    <div id="questions-graph-hub" className="space-y-6 pb-16">
      {/* ========================================================================= */}
      {/* 1. EXECUTIVE HEADER BANNER                                               */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold flex items-center space-x-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
                <span>15 Questions • 15 Distinct Chart Types</span>
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs text-slate-300 font-medium">
                Comprehensive MySQL 8.0 Inpatient & Patient Flow Visual Analytics
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              15 Questions Analytical Graph Intelligence Suite
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every SQL query is paired with an expertly chosen, distinct visualization type—ranging from hierarchical Treemaps and Lollipop charts to Box Plots, 2D Heatmaps, Sankey Flows, and Dumbbell optimization curves.
            </p>
          </div>

          {/* Mode Switcher Toggle */}
          <div className="flex items-center space-x-2 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/80 shrink-0 self-start lg:self-center">
            <button
              id="btn-view-mode-focused"
              onClick={() => setViewMode('focused')}
              aria-label="Focused Interactive Graph View"
              aria-pressed={viewMode === 'focused'}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'focused'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MonitorPlay className="w-4 h-4" />
              <span>Interactive Focus</span>
            </button>

            <button
              id="btn-view-mode-gallery"
              onClick={() => setViewMode('gallery')}
              aria-label="View All 15 Graphs Gallery Matrix"
              aria-pressed={viewMode === 'gallery'}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'gallery'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>All 15 Graphs Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE 15 QUESTION BUTTON BAR (EACH WITH ITS SPECIFIC CHART TYPE)         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse"></span>
              <h2 className="text-sm font-extrabold text-slate-900">
                Click Any Question Button (1 - 15) to Load Its Unique Chart:
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              15 custom-built chart formats matching the exact mathematical nature of each SQL query.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'All', label: 'All 15 Questions' },
              { id: 'Volume', label: 'Volume (Q1-Q3)' },
              { id: 'Latency', label: 'Latency (Q4-Q6)' },
              { id: 'Quality', label: 'Quality & Beds (Q7-Q9)' },
              { id: 'Advanced', label: 'Advanced & Tuning (Q10-Q15)' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 15 QUESTION BUTTONS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {QUESTION_CHART_META.map((meta) => {
            const isSelected = selectedQuestionNumber === meta.questionNumber;
            const isFilteredIn = filteredMetaList.some(m => m.questionNumber === meta.questionNumber);

            return (
              <button
                key={meta.questionNumber}
                id={`btn-question-chart-q${meta.questionNumber}`}
                onClick={() => {
                  setSelectedQuestionNumber(meta.questionNumber);
                  if (viewMode === 'gallery') {
                    // Scroll to card or stay in gallery
                  }
                }}
                aria-label={`Question ${meta.questionNumber}: ${meta.shortTitle} with ${meta.chartType}`}
                aria-pressed={isSelected}
                className={`text-left p-2.5 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer active:scale-98 ${
                  !isFilteredIn ? 'opacity-40 grayscale-30' : 'opacity-100'
                } ${
                  isSelected
                    ? 'bg-slate-900 text-white border-sky-500 shadow-md ring-2 ring-sky-400/40'
                    : 'bg-slate-50/90 hover:bg-slate-100 text-slate-800 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Top Row: Q Number + Chart Type Badge */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                    isSelected ? 'bg-sky-500 text-slate-950 shadow-xs' : 'bg-slate-200 text-slate-900'
                  }`}>
                    Q{meta.questionNumber}
                  </span>

                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border truncate max-w-[100px] ${
                    isSelected
                      ? 'bg-slate-800 text-sky-300 border-slate-700'
                      : `${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`
                  }`}>
                    {meta.chartType.replace(' Chart', '')}
                  </span>
                </div>

                {/* Question Short Title */}
                <div className="text-xs font-bold truncate leading-tight">
                  {meta.shortTitle}
                </div>

                {/* Subtitle / Category */}
                <div className={`text-[10px] truncate mt-0.5 ${
                  isSelected ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {meta.chartCategory}
                </div>

                {/* Active Indicator dot */}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500 border-2 border-white"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. VIEW MODE: FOCUSED INTERACTIVE VIEW                                    */}
      {/* ========================================================================= */}
      {viewMode === 'focused' && (
        <div className="space-y-6">
          {/* Active Question Summary Header Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 text-xs font-black">
                    Question {activeQuestion.questionNumber} of 15
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${activeMeta.badgeBg} ${activeMeta.badgeText} ${activeMeta.badgeBorder}`}>
                    {activeMeta.chartType}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">• {activeQuestion.section}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {activeQuestion.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 max-w-4xl">
                  {activeQuestion.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setViewMode('gallery')}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-slate-600" />
                  <span>View All 15 Charts</span>
                </button>
              </div>
            </div>

            {/* Key Clinical & Operational Finding */}
            {activeQuestion.keyFinding && (
              <div className="mt-4 p-3.5 rounded-xl bg-sky-50/80 border border-sky-200/80 flex items-start space-x-3">
                <Lightbulb className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div className="text-xs text-sky-950">
                  <strong className="font-bold text-sky-900">Analytical Finding: </strong>
                  <span>{activeQuestion.keyFinding}</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Chart Canvas via QueryVisualization */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <QueryVisualization
              queryId={activeQuestion.id}
              questionNumber={activeQuestion.questionNumber}
              question={activeQuestion}
              resultData={activeResult}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VIEW MODE: ALL 15 GRAPHS GALLERY (SIDE-BY-SIDE MATRIX)                 */}
      {/* ========================================================================= */}
      {viewMode === 'gallery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center space-x-2">
              <LayoutGrid className="w-4 h-4 text-sky-600" />
              <span className="font-bold text-slate-900">
                Showing {filteredMetaList.length} of 15 Analytical Charts
              </span>
            </div>
            <span className="text-slate-500">
              Click any card to open detailed interactive visualization
            </span>
          </div>

          {/* 15 Bento Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMetaList.map((meta) => {
              const q = SQL_QUESTIONS.find(item => item.questionNumber === meta.questionNumber) || SQL_QUESTIONS[0];
              const isSelected = selectedQuestionNumber === meta.questionNumber;

              return (
                <div
                  key={meta.questionNumber}
                  id={`gallery-card-q${meta.questionNumber}`}
                  className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                    isSelected ? 'border-sky-500 ring-2 ring-sky-400/30' : 'border-slate-200/90'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                          Q{meta.questionNumber}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}>
                          {meta.chartType}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold text-slate-400">
                        {meta.chartCategory}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 truncate">
                      {q.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      {meta.purpose}
                    </p>
                  </div>

                  {/* Chart Body */}
                  <div className="p-4 min-h-[300px] flex items-center justify-center bg-white">
                    <div className="w-full">
                      {renderGalleryChart(meta.questionNumber)}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedQuestionNumber(meta.questionNumber);
                        setViewMode('focused');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center space-x-1 cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Examine in Detail</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedQuestionNumber(meta.questionNumber);
                        setViewMode('focused');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Interactive View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
