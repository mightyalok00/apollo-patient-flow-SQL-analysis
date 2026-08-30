import React, { useRef, useState } from 'react';
import { 
  Download, 
  BarChart3, 
  Layers, 
  Info, 
  Sliders, 
  Sparkles, 
  HelpCircle,
  FileImage,
  FileSpreadsheet,
  Check,
  Maximize2,
  Image as ImageIcon,
  Activity
} from 'lucide-react';
import { QueryExecutionResult, SqlQueryQuestion } from '../../types';

// Specialized visualizers for Q1 - Q15
import { Q1Treemap } from './charts/Q1Treemap';
import { Q2RankedColumns } from './charts/Q2RankedColumns';
import { Q3LollipopChart } from './charts/Q3LollipopChart';
import { Q4WaitHistogram } from './charts/Q4WaitHistogram';
import { Q5StackedBar } from './charts/Q5StackedBar';
import { Q6BoxPlot } from './charts/Q6BoxPlot';
import { Q7Heatmap } from './charts/Q7Heatmap';
import { Q8FrequencyDistribution } from './charts/Q8FrequencyDistribution';
import { Q9BulletCharts } from './charts/Q9BulletCharts';
import { Q10SankeyFlow } from './charts/Q10SankeyFlow';
import { Q11DeviationBar } from './charts/Q11DeviationBar';
import { Q12QuadrantBubble } from './charts/Q12QuadrantBubble';
import { Q13BumpChart } from './charts/Q13BumpChart';
import { Q14ContributionBars } from './charts/Q14ContributionBars';
import { Q15DumbbellChart } from './charts/Q15DumbbellChart';

export interface QueryVisualizationProps {
  queryId: string;
  questionNumber: number;
  question: SqlQueryQuestion;
  resultData: QueryExecutionResult | null;
  activeFilters?: {
    hospital?: string;
    department?: string;
    dateRange?: string;
  };
}

export interface MetricDefinition {
  name: string;
  unit: string;
  formula: string;
  scope: string;
  targetBenchmark?: string;
}

const METRIC_DEFINITIONS: Record<number, MetricDefinition[]> = {
  1: [
    { name: 'Table Records', unit: 'Rows', formula: 'COUNT(*)', scope: 'Entire Database', targetBenchmark: '6 Relational Tables' },
  ],
  2: [
    { name: 'Hospital Admissions', unit: 'Patients', formula: 'COUNT(admission_id)', scope: 'Network-wide', targetBenchmark: 'Balanced capacity' },
  ],
  3: [
    { name: 'Department Volume', unit: 'Admissions', formula: 'COUNT(admission_id) GROUP BY dept', scope: 'Top 5 Clinical Wards', targetBenchmark: '<150 per ward/yr' },
  ],
  4: [
    { name: 'Wait Time', unit: 'Minutes', formula: 'AVG(wait_time_minutes)', scope: 'Triage to Physician', targetBenchmark: '<30m Green, >90m Critical' },
  ],
  5: [
    { name: 'Classification Share', unit: 'Percentage (%)', formula: 'CASE WHEN wait_time THEN Category', scope: 'Triage Stratification', targetBenchmark: '100% Stacked Total' },
  ],
  6: [
    { name: 'Length of Stay', unit: 'Days', formula: 'TIMESTAMPDIFF(HOUR, admit, discharge)/24', scope: 'Inpatient Stay', targetBenchmark: '3.0 - 4.5 days target' },
  ],
  7: [
    { name: 'Readmission Rate', unit: 'Percentage (%)', formula: '100.0 * SUM(readmit) / COUNT(admit)', scope: '30-Day Recurrence', targetBenchmark: '<25% Good, >35% High' },
  ],
  8: [
    { name: 'Repeat Frequency', unit: 'Admissions / Pt', formula: 'COUNT(admit) GROUP BY patient_id', scope: 'Frequent Attenders', targetBenchmark: 'Mean: 5.0 admissions' },
  ],
  9: [
    { name: 'Bed Utilization', unit: 'Percentage (%)', formula: '100 * Occupied / (Occupied + Available)', scope: 'Daily Ward Capacity', targetBenchmark: 'Warning: 75%, Critical: 90%' },
  ],
  10: [
    { name: 'Patient Flow Sankey', unit: 'Admissions', formula: 'Volume flow across Hospital -> Dept -> Care', scope: 'System Network Topology', targetBenchmark: '2,500 Total Flow' },
  ],
  11: [
    { name: 'Wait Deviation', unit: 'Minutes Delta', formula: 'Dept Avg Wait - Global Network Avg (49.3m)', scope: 'Benchmark Gap', targetBenchmark: '0.00m (Network Baseline)' },
  ],
  12: [
    { name: 'Operational Quadrant', unit: 'Volume vs Wait', formula: 'Admissions (X) vs Wait Min (Y) vs Readmission (Z)', scope: 'Multi-variable Triage', targetBenchmark: 'Bottom-Right Optimal' },
  ],
  13: [
    { name: 'Multidimensional Rank', unit: 'Rank (1-N)', formula: 'ROW_NUMBER(), RANK(), DENSE_RANK()', scope: 'Rank Trajectory', targetBenchmark: '#1 = Worst Strain' },
  ],
  14: [
    { name: 'Bottleneck Index', unit: 'Index (0-100)', formula: '25% Wait + 25% LOS + 25% Readmit + 25% Beds', scope: 'Composite Score', targetBenchmark: '<50 Normal, >80 Critical' },
  ],
  15: [
    { name: 'Query Latency', unit: 'Milliseconds (ms)', formula: 'Single-Pass CTE vs Correlated Subquery', scope: 'MySQL 8.0 Execution', targetBenchmark: '>50% Speedup' },
  ],
};

export const QueryVisualization: React.FC<QueryVisualizationProps> = ({
  queryId,
  questionNumber,
  question,
  resultData,
  activeFilters
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [copiedPNG, setCopiedPNG] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [viewMode, setViewMode] = useState<'interactive' | 'static-vector'>('interactive');

  const metrics = METRIC_DEFINITIONS[questionNumber] || [
    { name: 'Query Metric', unit: 'Units', formula: 'Derived from SQL result set', scope: 'Filtered result data' }
  ];

  const qFormatted = questionNumber < 10 ? `0${questionNumber}` : `${questionNumber}`;
  const staticSvgPath = `/charts/q${qFormatted}.svg`;

  const handleExportPNG = async () => {
    if (!chartContainerRef.current) return;
    try {
      // Find SVG inside container
      const svgElement = chartContainerRef.current.querySelector('svg');
      if (!svgElement) {
        window.open(staticSvgPath, '_blank');
        return;
      }

      // Serialize SVG
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgElement);

      // Add namespaces
      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!source.match(/^<svg[^>]+xmlns\:xlink="http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }

      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const URLObj = window.URL || window.webkitURL || window;
      const blobURL = URLObj.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 2; // High resolution
        const bbox = svgElement.getBoundingClientRect();
        const width = bbox.width || 800;
        const height = bbox.height || 450;
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(scale, scale);
          ctx.drawImage(image, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const dlLink = document.createElement('a');
              dlLink.download = `apollo_q${questionNumber}_visualization.png`;
              dlLink.href = URLObj.createObjectURL(blob);
              document.body.appendChild(dlLink);
              dlLink.click();
              document.body.removeChild(dlLink);
              setCopiedPNG(true);
              setTimeout(() => setCopiedPNG(false), 2000);
            }
          }, 'image/png');
        }
      };
      image.src = blobURL;
    } catch (err) {
      console.error('Failed to export PNG:', err);
    }
  };

  const renderActiveChart = () => {
    if (viewMode === 'static-vector') {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <img 
              src={staticSvgPath} 
              alt={`Question ${questionNumber} Analytical Chart`} 
              className="w-full h-auto object-contain rounded-lg max-h-[550px]"
              onError={(e) => {
                // Fallback to interactive mode if static asset unavailable
                setViewMode('interactive');
              }}
            />
          </div>
          <div className="mt-3 flex items-center space-x-3 text-xs text-slate-500">
            <span>High-resolution standalone vector SVG</span>
            <a 
              href={staticSvgPath} 
              target="_blank" 
              rel="noreferrer"
              className="text-sky-600 hover:underline font-bold flex items-center space-x-1"
            >
              <span>Open raw SVG</span>
              <Maximize2 className="w-3 h-3" />
            </a>
          </div>
        </div>
      );
    }

    if (!resultData || !resultData.rows || resultData.rows.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-slate-500 text-center">
          <BarChart3 className="w-10 h-10 text-slate-400 mb-2" />
          <div className="text-sm font-bold text-slate-700">No Query Results Available</div>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Execute the query in the SQL Workbench or reset SQL to view interactive charts.
          </p>
        </div>
      );
    }

    switch (questionNumber) {
      case 1:
        return <Q1Treemap data={resultData.rows} />;
      case 2:
        return <Q2RankedColumns data={resultData.rows} />;
      case 3:
        return <Q3LollipopChart data={resultData.rows} />;
      case 4:
        return <Q4WaitHistogram data={resultData.rows} />;
      case 5:
        return <Q5StackedBar data={resultData.rows} />;
      case 6:
        return <Q6BoxPlot data={resultData.rows} />;
      case 7:
        return <Q7Heatmap data={resultData.rows} />;
      case 8:
        return <Q8FrequencyDistribution data={resultData.rows} />;
      case 9:
        return <Q9BulletCharts data={resultData.rows} />;
      case 10:
        return <Q10SankeyFlow data={resultData.rows} />;
      case 11:
        return <Q11DeviationBar data={resultData.rows} />;
      case 12:
        return <Q12QuadrantBubble data={resultData.rows} />;
      case 13:
        return <Q13BumpChart data={resultData.rows} />;
      case 14:
        return <Q14ContributionBars data={resultData.rows} />;
      case 15:
        return <Q15DumbbellChart data={resultData.rows} />;
      default:
        return <Q2RankedColumns data={resultData.rows} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Meta Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 uppercase tracking-wide">
              Q{questionNumber} Chart View
            </span>
            <span className="text-xs font-bold text-slate-800">
              {metrics[0]?.name || 'Analytical Visualization'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center space-x-2">
            <span>Synchronized with active Results tab ({resultData?.rowCount ?? 0} data rows)</span>
            <span>•</span>
            <span className="text-sky-700 font-semibold">Unit: {metrics[0]?.unit}</span>
          </div>
        </div>

        {/* View Mode Toggle & Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>Interactive D3/Chart</span>
            </button>
            <button
              onClick={() => setViewMode('static-vector')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                viewMode === 'static-vector'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Vector SVG</span>
            </button>
          </div>

          <button
            onClick={() => setShowInfo(!showInfo)}
            aria-label="Toggle metric information"
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              showInfo 
                ? 'bg-sky-50 text-sky-800 border-sky-300' 
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Metric Info</span>
          </button>

          <button
            onClick={handleExportPNG}
            aria-label="Export chart as high-resolution PNG"
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            {copiedPNG ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileImage className="w-3.5 h-3.5 text-sky-400" />}
            <span>{copiedPNG ? 'Saved' : 'Export PNG'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Metric Definition Banner */}
      {showInfo && (
        <div className="p-4 rounded-2xl bg-sky-50/90 border border-sky-200 text-xs text-sky-950 space-y-2 animate-fadeIn">
          <div className="font-extrabold flex items-center space-x-1.5 text-sky-900">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Metric Definition & Clinical Benchmarks</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {metrics.map((m, idx) => (
              <div key={idx} className="bg-white/80 p-2.5 rounded-xl border border-sky-200/60 space-y-1">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>{m.name}</span>
                  <span className="text-sky-700 font-mono text-[10px]">{m.unit}</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  <strong>Formula:</strong> <code className="font-mono text-sky-800 bg-sky-50 px-1 py-0.5 rounded">{m.formula}</code>
                </div>
                <div className="text-[11px] text-slate-600">
                  <strong>Scope:</strong> {m.scope}
                </div>
                {m.targetBenchmark && (
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    <strong>Benchmark:</strong> {m.targetBenchmark}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart Canvas Area */}
      <div 
        ref={chartContainerRef}
        className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden min-h-[420px] flex flex-col justify-center"
      >
        {renderActiveChart()}
      </div>
    </div>
  );
};
