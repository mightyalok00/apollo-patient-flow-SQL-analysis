import React from 'react';

interface Q15DumbbellChartProps {
  data: Record<string, any>[];
}

export const Q15DumbbellChart: React.FC<Q15DumbbellChartProps> = ({ data }) => {
  const metrics = [
    {
      metric: 'Query Execution Latency',
      unoptimized: 32.0, // ms
      optimized: 16.0, // ms
      unit: 'ms',
      improvement: '50% Faster',
      direction: 'lower',
      unoptLabel: '32.0 ms (Correlated Subqueries)',
      optLabel: '16.0 ms (Single-Pass CTEs)',
      scaleMax: 35,
    },
    {
      metric: 'Table Scan Rows Examined',
      unoptimized: 2500, // rows
      optimized: 120, // rows
      unit: 'rows',
      improvement: '95% Fewer Rows',
      direction: 'lower',
      unoptLabel: '2,500 rows (Full Table Scan)',
      optLabel: '120 rows (idx_composite B-Tree)',
      scaleMax: 2600,
    },
    {
      metric: 'Subquery Iteration Loops',
      unoptimized: 60, // loops
      optimized: 2, // single pass CTEs
      unit: 'loops',
      improvement: '96% Loop Reduction',
      direction: 'lower',
      unoptLabel: '60 repeated subquery evaluations',
      optLabel: '2 hash aggregations',
      scaleMax: 65,
    },
    {
      metric: 'Buffer Pool Memory Footprint',
      unoptimized: 480, // KB
      optimized: 38, // KB
      unit: 'KB',
      improvement: '92% Memory Saved',
      direction: 'lower',
      unoptLabel: '480 KB (Temporary subquery buffers)',
      optLabel: '38 KB (Indexed stream)',
      scaleMax: 500,
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">Query Optimization Dumbbell Benchmark Chart</h4>
          <p className="text-slate-500">Unoptimized correlated subqueries (red dot) vs Optimized CTEs &amp; indexes (green dot).</p>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-bold">
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-600">Unoptimized</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Optimized (CTE + Index)</span>
          </span>
        </div>
      </div>

      {/* Dumbbell Rows */}
      <div className="space-y-4 py-2">
        {metrics.map((item, idx) => {
          const unoptPct = (item.unoptimized / item.scaleMax) * 100;
          const optPct = (item.optimized / item.scaleMax) * 100;

          return (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900">{item.metric}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                  {item.improvement}
                </span>
              </div>

              {/* Graphic track */}
              <div className="relative h-8 flex items-center">
                {/* Background track line */}
                <div className="absolute inset-x-0 h-1 bg-slate-200 rounded-full" />

                {/* Connecting Dumbbell Bar */}
                <div 
                  className="absolute h-1.5 bg-gradient-to-r from-emerald-500 to-rose-500 rounded-full"
                  style={{
                    left: `${Math.min(optPct, unoptPct)}%`,
                    width: `${Math.abs(unoptPct - optPct)}%`,
                  }}
                />

                {/* Optimized Node (Green) */}
                <div 
                  className="absolute w-5 h-5 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center -translate-x-1/2"
                  style={{ left: `${optPct}%` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Unoptimized Node (Rose) */}
                <div 
                  className="absolute w-5 h-5 rounded-full bg-rose-600 border-2 border-white shadow-md flex items-center justify-center -translate-x-1/2"
                  style={{ left: `${unoptPct}%` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>

              {/* Labels below */}
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-emerald-700 font-bold">
                  ✓ {item.optLabel}
                </span>
                <span className="text-rose-700 font-bold">
                  ✗ {item.unoptLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start space-x-2">
        <span className="font-bold shrink-0">Optimization Insight:</span>
        <p>
          Replacing row-by-row correlated subqueries with pre-aggregated Common Table Expressions (CTEs) and adding composite B-Tree indexes eliminates full table scans and reduces execution latency by 50%.
        </p>
      </div>
    </div>
  );
};
