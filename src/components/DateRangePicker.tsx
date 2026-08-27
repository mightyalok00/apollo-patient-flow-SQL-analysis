import React, { useState } from 'react';
import { Calendar, ChevronDown, Check, RotateCcw, CalendarDays } from 'lucide-react';
import { DateRangePreset } from '../data/patientFlowTrends';

interface DateRangePickerProps {
  selectedPreset: DateRangePreset;
  onSelectPreset: (preset: DateRangePreset) => void;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  onCustomRangeChange: (start: string, end: string) => void;
  displayLabel: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  selectedPreset,
  onSelectPreset,
  startDate,
  endDate,
  onCustomRangeChange,
  displayLabel
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  const presets: { id: DateRangePreset; label: string; subLabel: string }[] = [
    { id: '7d', label: '7 Days', subLabel: 'Last 7 days' },
    { id: '30d', label: '30 Days', subLabel: 'Last 30 days' },
    { id: '90d', label: '90 Days', subLabel: 'Last Quarter' }
  ];

  const handleApplyCustom = () => {
    if (tempStart && tempEnd && tempStart <= tempEnd) {
      onCustomRangeChange(tempStart, tempEnd);
      onSelectPreset('custom');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button Group */}
      <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200 shadow-2xs">
        {/* Standard Preset Buttons */}
        <div className="flex items-center space-x-1">
          {presets.map((preset) => {
            const isActive = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                id={`btn-preset-${preset.id}`}
                onClick={() => {
                  onSelectPreset(preset.id);
                  if (isOpen) setIsOpen(false);
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-white text-sky-700 shadow-xs border border-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                title={preset.subLabel}
              >
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Custom Calendar Dropdown Toggle */}
        <button
          id="btn-toggle-custom-date"
          onClick={() => setIsOpen(!isOpen)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5 ${
            selectedPreset === 'custom' || isOpen
              ? 'bg-sky-50 text-sky-700 border border-sky-200 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
          title="Choose custom date range"
        >
          <Calendar className="w-3.5 h-3.5 text-sky-600" />
          <span className="hidden sm:inline">
            {selectedPreset === 'custom' ? 'Custom' : 'Date Range'}
          </span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-sky-600' : ''}`} />
        </button>
      </div>

      {/* Dropdown Popover for Custom Date Selection */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 z-50 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Custom Date Filter</h4>
                  <p className="text-[11px] text-slate-500">Historical telemetry bounds</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onSelectPreset('30d');
                  setIsOpen(false);
                }}
                className="text-[11px] text-sky-600 hover:text-sky-800 font-semibold flex items-center space-x-0.5"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                <span>Reset 30d</span>
              </button>
            </div>

            {/* Quick Presets inside Popover */}
            <div className="grid grid-cols-3 gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectPreset(preset.id);
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    selectedPreset === preset.id
                      ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-700 text-xs'
                  }`}
                >
                  <div className="text-xs font-bold">{preset.label}</div>
                  <div className="text-[10px] text-slate-400">{preset.subLabel}</div>
                </button>
              ))}
            </div>

            {/* Date Inputs */}
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Start Date (Min: Jun 02, 2026)
                </label>
                <input
                  type="date"
                  min="2026-06-02"
                  max="2026-08-30"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  End Date (Max: Aug 30, 2026)
                </label>
                <input
                  type="date"
                  min="2026-06-02"
                  max="2026-08-30"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                {displayLabel}
              </span>
              <button
                id="btn-apply-custom-range"
                onClick={handleApplyCustom}
                disabled={!tempStart || !tempEnd || tempStart > tempEnd}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center space-x-1 disabled:opacity-50 transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Range</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
