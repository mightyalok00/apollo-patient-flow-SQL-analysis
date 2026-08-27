import React, { useState } from 'react';
import { 
  Filter, 
  X, 
  RotateCcw, 
  Building2, 
  Stethoscope, 
  Activity, 
  Clock, 
  Search, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  SlidersHorizontal,
  Check
} from 'lucide-react';

export interface DashboardFilterState {
  hospitalId: string;       // 'all', '1', '2', '3', '4'
  departmentName: string;   // 'all', 'Emergency', 'Cardiology', 'Orthopedics', 'General Medicine', 'Neurology'
  admissionType: string;    // 'all', 'Emergency', 'Elective', 'Urgent', 'Referral'
  waitTimeTier: string;     // 'all', 'fast' (<45), 'standard' (45-60), 'moderate' (60-90), 'critical' (>90)
  readmissionOnly: boolean; // true / false
  searchDisease: string;    // diagnosis keyword
}

export const INITIAL_FILTER_STATE: DashboardFilterState = {
  hospitalId: 'all',
  departmentName: 'all',
  admissionType: 'all',
  waitTimeTier: 'all',
  readmissionOnly: false,
  searchDisease: ''
};

interface DashboardFilterBarProps {
  filters: DashboardFilterState;
  onFilterChange: (filters: DashboardFilterState) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export const DashboardFilterBar: React.FC<DashboardFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  filteredCount,
  totalCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper to check how many non-default filters are active
  const activeFilterCount = [
    filters.hospitalId !== 'all',
    filters.departmentName !== 'all',
    filters.admissionType !== 'all',
    filters.waitTimeTier !== 'all',
    filters.readmissionOnly,
    filters.searchDisease.trim().length > 0
  ].filter(Boolean).length;

  const updateField = <K extends keyof DashboardFilterState>(
    field: K,
    value: DashboardFilterState[K]
  ) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const getHospitalLabel = (id: string) => {
    switch (id) {
      case '1': return 'Apollo Delhi';
      case '2': return 'Apollo Mumbai';
      case '3': return 'Apollo Bangalore';
      case '4': return 'Apollo Hyderabad';
      default: return 'All Facilities';
    }
  };

  const getWaitTierLabel = (tier: string) => {
    switch (tier) {
      case 'fast': return 'Fast (<45 min)';
      case 'standard': return 'Standard (45-60 min)';
      case 'moderate': return 'Moderate (60-90 min)';
      case 'critical': return 'Critical (>90 min)';
      default: return 'All Latencies';
    }
  };

  return (
    <div id="dashboard-filter-card" className="bg-white rounded-2xl border border-slate-200 shadow-xs transition-all">
      {/* Primary Filter Bar / Header */}
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Filter Title, Active Count Badge, & Matching Count */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-slate-900">Interactive Filter Engine</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  {activeFilterCount} active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing <span className="font-bold text-slate-800">{filteredCount.toLocaleString()}</span> of {totalCount.toLocaleString()} admission records ({((filteredCount / totalCount) * 100).toFixed(1)}%)
            </p>
          </div>
        </div>

        {/* Right: Quick Preset Dropdowns & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Hospital Select */}
          <div className="relative inline-flex items-center">
            <select
              id="filter-select-hospital"
              value={filters.hospitalId}
              onChange={(e) => updateField('hospitalId', e.target.value)}
              className={`text-xs pl-3 pr-8 py-2 rounded-xl border font-semibold transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                filters.hospitalId !== 'all'
                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <option value="all">All Hospitals</option>
              <option value="1">Apollo Delhi</option>
              <option value="2">Apollo Mumbai</option>
              <option value="3">Apollo Bangalore</option>
              <option value="4">Apollo Hyderabad</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Quick Department Select */}
          <div className="relative inline-flex items-center">
            <select
              id="filter-select-department"
              value={filters.departmentName}
              onChange={(e) => updateField('departmentName', e.target.value)}
              className={`text-xs pl-3 pr-8 py-2 rounded-xl border font-semibold transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                filters.departmentName !== 'all'
                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <option value="all">All Departments</option>
              <option value="Emergency">Emergency</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Neurology">Neurology</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Quick Search Disease / Condition */}
          <div className="relative min-w-[160px] sm:min-w-[190px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="filter-input-disease"
              type="text"
              placeholder="Search diagnosis..."
              value={filters.searchDisease}
              onChange={(e) => updateField('searchDisease', e.target.value)}
              className="w-full text-xs pl-8 pr-7 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {filters.searchDisease && (
              <button
                onClick={() => updateField('searchDisease', '')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Expand/Collapse Advanced Filters */}
          <button
            id="btn-toggle-advanced-filters"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`text-xs px-3 py-2 rounded-xl border font-semibold flex items-center space-x-1.5 transition-all ${
              isExpanded || activeFilterCount > 2
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">More Filters</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Reset Filters */}
          {activeFilterCount > 0 && (
            <button
              id="btn-reset-all-filters"
              onClick={onResetFilters}
              className="text-xs px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold flex items-center space-x-1 transition-all"
              title="Reset all filters to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Advanced Multi-Dimensional Filter Drawer */}
      {isExpanded && (
        <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {/* 1. Admission Stream / Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5 text-sky-600" />
                <span>Admission Type</span>
              </label>
              <select
                id="filter-select-adm-type"
                value={filters.admissionType}
                onChange={(e) => updateField('admissionType', e.target.value)}
                className="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Types (Emergency, Elective, etc.)</option>
                <option value="Emergency">Emergency</option>
                <option value="Elective">Elective</option>
                <option value="Urgent">Urgent</option>
                <option value="Referral">Referral</option>
              </select>
            </div>

            {/* 2. Triage Latency Tier */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Triage Waiting Time</span>
              </label>
              <select
                id="filter-select-wait-tier"
                value={filters.waitTimeTier}
                onChange={(e) => updateField('waitTimeTier', e.target.value)}
                className="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Waiting Times</option>
                <option value="fast">⚡ Fast (&lt; 45 mins)</option>
                <option value="standard">⏱️ Standard (45 - 60 mins)</option>
                <option value="moderate">⚠️ Moderate Strain (60 - 90 mins)</option>
                <option value="critical">🚨 Critical Delay (&gt; 90 mins)</option>
              </select>
            </div>

            {/* 3. Readmission Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>30-Day Readmission</span>
              </label>
              <div className="flex items-center space-x-2 pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-700 font-semibold cursor-pointer select-none bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl w-full hover:bg-slate-100 transition-colors">
                  <input
                    id="filter-check-readmission"
                    type="checkbox"
                    checked={filters.readmissionOnly}
                    onChange={(e) => updateField('readmissionOnly', e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <span>30-Day Readmitted Only</span>
                </label>
              </div>
            </div>

            {/* 4. Quick Common Diagnosis Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Common Conditions
              </label>
              <div className="flex flex-wrap gap-1">
                {['Trauma', 'Infarction', 'Stroke', 'Appendicitis', 'Hypertension'].map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => updateField('searchDisease', filters.searchDisease === kw ? '' : kw)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      filters.searchDisease.toLowerCase() === kw.toLowerCase()
                        ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips Bar */}
      {activeFilterCount > 0 && (
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50/80 border-t border-slate-100 rounded-b-2xl flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 mr-1 uppercase tracking-wider">
            Active Filters:
          </span>

          {filters.hospitalId !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-100 text-sky-900 border border-sky-200">
              <Building2 className="w-3 h-3 mr-1 text-sky-700" />
              <span>{getHospitalLabel(filters.hospitalId)}</span>
              <button 
                onClick={() => updateField('hospitalId', 'all')}
                className="ml-1.5 text-sky-700 hover:text-sky-950 font-bold"
              >
                ×
              </button>
            </span>
          )}

          {filters.departmentName !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-900 border border-indigo-200">
              <Stethoscope className="w-3 h-3 mr-1 text-indigo-700" />
              <span>Dept: {filters.departmentName}</span>
              <button 
                onClick={() => updateField('departmentName', 'all')}
                className="ml-1.5 text-indigo-700 hover:text-indigo-950 font-bold"
              >
                ×
              </button>
            </span>
          )}

          {filters.admissionType !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
              <Activity className="w-3 h-3 mr-1 text-emerald-700" />
              <span>Type: {filters.admissionType}</span>
              <button 
                onClick={() => updateField('admissionType', 'all')}
                className="ml-1.5 text-emerald-700 hover:text-emerald-950 font-bold"
              >
                ×
              </button>
            </span>
          )}

          {filters.waitTimeTier !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
              <Clock className="w-3 h-3 mr-1 text-amber-700" />
              <span>Wait: {getWaitTierLabel(filters.waitTimeTier)}</span>
              <button 
                onClick={() => updateField('waitTimeTier', 'all')}
                className="ml-1.5 text-amber-700 hover:text-amber-950 font-bold"
              >
                ×
              </button>
            </span>
          )}

          {filters.readmissionOnly && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-200">
              <span>30-Day Readmitted</span>
              <button 
                onClick={() => updateField('readmissionOnly', false)}
                className="ml-1.5 text-rose-700 hover:text-rose-950 font-bold"
              >
                ×
              </button>
            </span>
          )}

          {filters.searchDisease.trim() && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-200">
              <Search className="w-3 h-3 mr-1 text-purple-700" />
              <span>Diagnosis: "{filters.searchDisease}"</span>
              <button 
                onClick={() => updateField('searchDisease', '')}
                className="ml-1.5 text-purple-700 hover:text-purple-950 font-bold"
              >
                ×
              </button>
            </span>
          )}

          <button
            onClick={onResetFilters}
            className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold underline ml-auto"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
