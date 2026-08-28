import React from 'react';

interface Q9BulletChartsProps {
  data: Record<string, any>[];
}

export const Q9BulletCharts: React.FC<Q9BulletChartsProps> = ({ data }) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">Bed-Utilization Bullet Charts & Capacity Thresholds</h4>
          <p className="text-slate-500">Qualitative capacity ranges (Normal &lt;75%, Warning 75-90%, Critical &gt;90%) with target benchmark.</p>
        </div>
        
        {/* Bullet Legend */}
        <div className="flex items-center space-x-3 text-[10px] font-bold">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-2 rounded-xs bg-emerald-200" />
            <span className="text-slate-600">Normal (&lt;75%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-2 rounded-xs bg-amber-200" />
            <span className="text-slate-600">Warning (75-90%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-2 rounded-xs bg-rose-200" />
            <span className="text-slate-600">Critical (&gt;90%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-1 h-3 bg-slate-900" />
            <span className="text-slate-900">Target (70%)</span>
          </div>
        </div>
      </div>

      {/* Bullet Chart Rows */}
      <div className="space-y-3.5 py-1">
        {data.map((d, i) => {
          const utilPct = Number(d.bed_utilization_percent) || 0;
          const status = d.utilization_status || 'Normal';

          return (
            <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-slate-900">{d.department_name}</span>
                  <span className="text-slate-500 text-[11px]">({d.hospital_name})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-sm text-slate-900">{utilPct.toFixed(2)}%</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    status === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {status}
                  </span>
                </div>
              </div>

              {/* Bullet Graphic */}
              <div className="relative h-6 rounded-lg overflow-hidden flex items-center bg-slate-200">
                {/* Range Backgrounds: 0-75% Normal, 75-90% Warning, 90-100% Critical */}
                <div className="absolute inset-y-0 left-0 w-[75%] bg-emerald-100/90" />
                <div className="absolute inset-y-0 left-[75%] w-[15%] bg-amber-100/90" />
                <div className="absolute inset-y-0 left-[90%] w-[10%] bg-rose-100/90" />

                {/* Actual Value Bar */}
                <div 
                  className="absolute inset-y-1.5 left-0 rounded-r-md bg-slate-900 shadow-xs transition-all duration-500"
                  style={{ width: `${Math.min(100, utilPct)}%` }}
                />

                {/* Target Marker at 70% Optimal */}
                <div 
                  className="absolute inset-y-0 w-1 bg-sky-600 z-10"
                  style={{ left: '70%' }}
                  title="Target Utilization: 70%"
                />

                {/* Warning Line at 75% */}
                <div 
                  className="absolute inset-y-0 w-0.5 bg-amber-500/80 z-10"
                  style={{ left: '75%' }}
                />

                {/* Critical Line at 90% */}
                <div 
                  className="absolute inset-y-0 w-0.5 bg-rose-600/80 z-10"
                  style={{ left: '90%' }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                <span>Total Observations: {Number(d.occupancy_records || 365).toLocaleString()} days</span>
                <span>Occupied: {Number(d.total_occupied_bed_observations).toLocaleString()} | Available: {Number(d.total_available_bed_observations).toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
