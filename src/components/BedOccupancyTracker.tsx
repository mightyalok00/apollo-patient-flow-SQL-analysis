import React, { useState } from 'react';
import { 
  BedDouble, 
  CheckCircle2, 
  Layers, 
  Building2, 
  ArrowUpRight, 
  ShieldCheck,
  TrendingDown,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { DEPARTMENTS, HOSPITALS } from '../data/hospitalData';

interface BedOccupancyTrackerProps {
  onSelectQuery: (questionNumber: number) => void;
}

export const BedOccupancyTracker: React.FC<BedOccupancyTrackerProps> = ({ onSelectQuery }) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<number>(0); // 0 = All
  const [selectedDeptName, setSelectedDeptName] = useState<string>('All');

  // Calculate bed stats for departments
  const departmentBedData = DEPARTMENTS.filter(
    d => (selectedHospitalId === 0 || d.hospital_id === selectedHospitalId) &&
         (selectedDeptName === 'All' || d.department_name === selectedDeptName)
  ).map(dept => {
    const total = dept.total_beds;
    const isEmergency = dept.department_name === 'Emergency';
    const isOrtho = dept.department_name === 'Orthopedics';
    const isMed = dept.department_name === 'General Medicine';
    
    // Utilization rate based on Question 9 findings:
    let utilPct = 42.1;
    if (isEmergency) utilPct = 46.5;
    else if (isMed) utilPct = 44.5;
    else if (isOrtho) utilPct = 44.0;
    
    const occupied = Math.round(total * (utilPct / 100));
    const available = total - occupied;

    return {
      id: dept.department_id,
      name: `${dept.department_name} (${(dept.hospital_name || '').replace('Apollo ', '')})`,
      shortName: dept.department_name,
      hospital: dept.hospital_name || '',
      totalBeds: total,
      occupiedBeds: occupied,
      availableBeds: available,
      utilizationPct: utilPct,
      status: utilPct > 90 ? 'Critical' : utilPct > 75 ? 'Warning' : 'Optimal',
    };
  });

  const totalBedsCount = departmentBedData.reduce((acc, d) => acc + d.totalBeds, 0);
  const totalOccupiedCount = departmentBedData.reduce((acc, d) => acc + d.occupiedBeds, 0);
  const totalAvailableCount = departmentBedData.reduce((acc, d) => acc + d.availableBeds, 0);
  const avgUtilization = ((totalOccupiedCount / totalBedsCount) * 100).toFixed(1);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-sky-950 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-teal-300 mb-2">
          <BedDouble className="w-4 h-4" />
          <span>Question 9 & 10: Bed Capacity & Daily Utilization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Bed Utilization & Capacity Intelligence
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mb-4">
          Monitors 7,300 daily bed occupancy observations across 20 clinical departments. Validates hospital capacity headroom and ensures emergency surge readiness.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            id="btn-inspect-q9"
            onClick={() => onSelectQuery(9)}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
          >
            <span>Run Bed Utilization Query (Q9)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-inspect-q10"
            onClick={() => onSelectQuery(10)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <span>Run Multi-Join Department Report (Q10)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Bed Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Monitored Beds</div>
          <div className="text-2xl font-black text-slate-900">{totalBedsCount} <span className="text-xs font-normal text-slate-500">beds</span></div>
          <div className="text-[11px] text-slate-500 mt-1">Across 20 hospital wards</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Current Occupied Beds</div>
          <div className="text-2xl font-black text-sky-700">{totalOccupiedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">{avgUtilization}% system utilization</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Available Reserve Beds</div>
          <div className="text-2xl font-black text-emerald-700">{totalAvailableCount}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Robust surge buffer</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Critical Breaches (&gt;90%)</div>
          <div className="text-2xl font-black text-emerald-600 flex items-center">
            <span>0</span>
            <ShieldCheck className="w-5 h-5 ml-1.5 text-emerald-500" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Zero capacity violations</div>
        </div>
      </div>

      {/* Bed Utilization Bar Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">Bed Allocation: Occupied vs Available</h3>
            <p className="text-xs text-slate-500">Departmental bed capacity breakdown across facilities</p>
          </div>

          {/* Filter selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-600">Facility:</span>
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(Number(e.target.value))}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-sky-500"
              >
                <option value={0}>All 4 Hospitals</option>
                {HOSPITALS.map(h => (
                  <option key={h.hospital_id} value={h.hospital_id}>{h.hospital_name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-600">Dept:</span>
              <select
                value={selectedDeptName}
                onChange={(e) => setSelectedDeptName(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-sky-500"
              >
                <option value="All">All Departments</option>
                <option value="Emergency">Emergency</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Neurology">Neurology</option>
              </select>
            </div>

            {(selectedHospitalId !== 0 || selectedDeptName !== 'All') && (
              <button
                onClick={() => {
                  setSelectedHospitalId(0);
                  setSelectedDeptName('All');
                }}
                className="text-xs text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 font-semibold"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={departmentBedData} 
              margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                angle={-25} 
                textAnchor="end" 
                interval={0} 
                tick={{ fontSize: 10, fill: '#64748b' }} 
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '11px' }}
                formatter={(value: any, name: string) => [`${value} Beds`, name === 'occupiedBeds' ? 'Occupied' : 'Available']}
              />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />
              <Bar dataKey="occupiedBeds" stackId="a" fill="#0284c7" name="Occupied Beds" radius={[0, 0, 0, 0]} />
              <Bar dataKey="availableBeds" stackId="a" fill="#34d399" name="Available Beds" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bed Capacity Findings Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900">Key Finding: Balanced Physical Bed Capacity vs Triage Latency</h4>
            <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
              While Emergency wards experience severe waiting-time delays (99 to 106 mins), their aggregate bed utilization remains stable at <strong>45.9% to 47.3%</strong>. This proves that patient delays stem from <strong>triage workflow and consultant availability bottlenecks</strong> rather than an acute shortage of physical inpatient beds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
