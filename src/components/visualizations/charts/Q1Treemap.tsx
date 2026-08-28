import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';

interface Q1TreemapProps {
  data: Record<string, any>[];
}

export const Q1Treemap: React.FC<Q1TreemapProps> = ({ data }) => {
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);

  const totalAllRecords = useMemo(() => {
    return data.reduce((acc, row) => acc + (Number(row.total_records) || 0), 0);
  }, [data]);

  const treeNodes = useMemo(() => {
    if (!data || data.length === 0) return [];

    const rootData = {
      name: 'root',
      children: data.map(row => ({
        name: String(row.table_name || 'table'),
        value: Number(row.total_records) || 0,
      }))
    };

    const root = d3.hierarchy<any>(rootData)
      .sum((d: any) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const width = 800;
    const height = 400;

    const treemapLayout = d3.treemap<any>()
      .size([width, height])
      .paddingInner(4)
      .paddingOuter(2)
      .round(true);

    treemapLayout(root);

    return root.leaves() as d3.HierarchyRectangularNode<any>[];
  }, [data]);

  const colorScale = d3.scaleOrdinal<string>()
    .domain(['bed_occupancy', 'admissions', 'patients', 'doctors', 'departments', 'hospitals'])
    .range(['#0284c7', '#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc', '#024e75']);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">Database Schema Size & Record Distribution</h4>
          <p className="text-slate-500">Treemap of 6 core relational tables sized by verified record count.</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
          <span className="font-bold text-slate-700">Total Database Records:</span>
          <span className="font-mono font-black text-sky-700 text-sm">{totalAllRecords.toLocaleString()}</span>
        </div>
      </div>

      {/* SVG Treemap Canvas */}
      <div className="relative w-full aspect-[2/1] min-h-[360px] rounded-xl overflow-hidden bg-slate-900 shadow-inner">
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {treeNodes.map((node, i) => (
              <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorScale(node.data.name)} stopOpacity="0.95" />
                <stop offset="100%" stopColor={colorScale(node.data.name)} stopOpacity="0.75" />
              </linearGradient>
            ))}
          </defs>

          {treeNodes.map((node, index) => {
            const w = node.x1 - node.x0;
            const h = node.y1 - node.y0;
            const pct = totalAllRecords > 0 ? ((node.data.value / totalAllRecords) * 100).toFixed(1) : '0';
            const isHovered = hoveredNode?.data?.name === node.data.name;

            return (
              <g
                key={node.data.name}
                transform={`translate(${node.x0},${node.y0})`}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-all duration-200"
              >
                <rect
                  width={w}
                  height={h}
                  rx={6}
                  fill={`url(#grad-${index})`}
                  stroke={isHovered ? '#ffffff' : '#0f172a'}
                  strokeWidth={isHovered ? 2.5 : 1}
                  className="transition-all"
                />

                {w > 60 && h > 40 && (
                  <foreignObject width={w} height={h} className="pointer-events-none p-2.5">
                    <div className="h-full flex flex-col justify-between text-white overflow-hidden">
                      <div>
                        <div className="font-mono font-bold text-xs truncate drop-shadow-sm flex items-center space-x-1">
                          <span>📁 {node.data.name}</span>
                        </div>
                        <div className="text-[10px] text-sky-100/90 font-medium">
                          {pct}% of database
                        </div>
                      </div>
                      <div className="font-mono font-extrabold text-sm sm:text-base text-white drop-shadow-sm">
                        {node.data.value.toLocaleString()} <span className="text-[10px] font-normal text-sky-200">rows</span>
                      </div>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredNode && (
          <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl border border-sky-400/40 text-xs shadow-xl pointer-events-none space-y-1">
            <div className="font-mono font-bold text-sky-300 flex items-center space-x-1.5">
              <span>Table:</span>
              <span className="text-white bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800">{hoveredNode.data.name}</span>
            </div>
            <div className="text-slate-300">
              Total Records: <strong className="text-white font-mono">{hoveredNode.data.value.toLocaleString()}</strong>
            </div>
            <div className="text-sky-300 text-[11px]">
              Share of Database: <strong className="text-white">{((hoveredNode.data.value / totalAllRecords) * 100).toFixed(2)}%</strong>
            </div>
          </div>
        )}
      </div>

      {/* Grid Legend & Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
        {data.map((row) => (
          <div key={row.table_name} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
            <div className="font-mono font-bold text-slate-800 text-[11px] truncate">{row.table_name}</div>
            <div className="text-sky-700 font-mono font-black text-xs mt-1">
              {Number(row.total_records).toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">rows</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
