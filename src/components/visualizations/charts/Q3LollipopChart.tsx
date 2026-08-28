import React from 'react';

interface Q3LollipopChartProps {
  data: Record<string, any>[];
}

export const Q3LollipopChart: React.FC<Q3LollipopChartProps> = ({ data }) => {
  const sorted = [...data].sort((a, b) => (b.total_admissions || 0) - (a.total_admissions || 0));
  const maxAdmissions = Math.max(...sorted.map(d => Number(d.total_admissions) || 0), 150);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">Top 5 Busiest Departments</h4>
          <p className="text-slate-500">Horizontal lollipop chart showing volume leaders across clinical wards.</p>
        </div>
        <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
          Ranked 1 to 5
        </span>
      </div>

      <div className="space-y-4 py-2">
        {sorted.map((item, idx) => {
          const count = Number(item.total_admissions) || 0;
          const percentage = (count / maxAdmissions) * 100;
          const rankColors = ['#0284c7', '#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc'];
          const color = rankColors[idx] || '#0284c7';

          return (
            <div key={idx} className="space-y-1.5 group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {item.department_name}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    ({item.hospital_name})
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-sky-900 text-sm">
                    {count}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">admissions</span>
                </div>
              </div>

              {/* Horizontal Lollipop Stem & Head */}
              <div className="relative h-6 flex items-center">
                {/* Background Track */}
                <div className="absolute inset-x-0 h-1.5 bg-slate-100 rounded-full" />
                
                {/* Active Stem Line */}
                <div 
                  className="h-1.5 rounded-full transition-all duration-500 group-hover:h-2"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />

                {/* Lollipop Head Circle */}
                <div 
                  className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-125"
                  style={{ 
                    left: `calc(${percentage}% - 10px)`,
                    backgroundColor: color,
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Axis baseline */}
      <div className="flex justify-between text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-2 px-1">
        <span>0 admissions</span>
        <span>{Math.round(maxAdmissions / 2)} admissions</span>
        <span>{maxAdmissions} admissions (Capacity Peak)</span>
      </div>
    </div>
  );
};
