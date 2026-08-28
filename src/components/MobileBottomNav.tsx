import React, { useState } from 'react';
import { 
  Activity, 
  Terminal, 
  AlertTriangle, 
  MoreHorizontal,
  BedDouble, 
  Database,
  Users, 
  Search,
  Gauge,
  X,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCommandPalette: () => void;
  onOpenDiagnostics: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenCommandPalette,
  onOpenDiagnostics
}) => {
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard' as ActiveTab, label: 'Overview', icon: Activity },
    { id: 'sql-workbench' as ActiveTab, label: 'SQL Lab', icon: Terminal },
    { id: 'bottlenecks' as ActiveTab, label: 'Bottlenecks', icon: AlertTriangle },
  ];

  const moreItems = [
    { id: 'bed-tracker' as ActiveTab, label: 'Bed Capacity Tracker', description: '680 ward & ICU beds across 4 hospitals', icon: BedDouble },
    { id: 'schema-er' as ActiveTab, label: 'Schema & ER Diagram', description: '6 normalized 3NF relational tables', icon: Database },
    { id: 'data-browser' as ActiveTab, label: 'Patient Data Explorer', description: '2,500 admissions with multi-filter search', icon: Users },
  ];

  const handleSelectMoreTab = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsMoreSheetOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMoreActive = ['bed-tracker', 'schema-er', 'data-browser'].includes(activeTab);

  return (
    <>
      {/* 4-Item Streamlined Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mobile-nav-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMoreSheetOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-label={`Navigate to ${tab.label}`}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-1.5 py-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden ${
                  isActive
                    ? 'text-sky-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-sky-500/20 text-sky-400' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] tracking-tight mt-0.5">{tab.label}</span>
              </button>
            );
          })}

          {/* More Drawer Trigger */}
          <button
            id="mobile-nav-more"
            onClick={() => setIsMoreSheetOpen(!isMoreSheetOpen)}
            aria-label="Open More Navigation Modules"
            aria-expanded={isMoreSheetOpen}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-1.5 py-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden ${
              isMoreActive || isMoreSheetOpen
                ? 'text-sky-400 font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isMoreActive || isMoreSheetOpen ? 'bg-sky-500/20 text-sky-400' : ''}`}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[11px] tracking-tight mt-0.5">More</span>
          </button>
        </div>
      </nav>

      {/* "More" Bottom Sheet Drawer */}
      {isMoreSheetOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Additional Navigation Modules"
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end animate-fadeIn"
          onClick={() => setIsMoreSheetOpen(false)}
        >
          <div 
            className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-extrabold text-sm text-white">Additional Clinical Modules</h3>
                <p className="text-xs text-slate-400">Deep-dive tables, schema, and diagnostics</p>
              </div>
              <button
                onClick={() => setIsMoreSheetOpen(false)}
                aria-label="Close menu"
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation List */}
            <div className="space-y-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectMoreTab(item.id)}
                    aria-label={`Open ${item.label}`}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400 text-white'
                        : 'bg-slate-800/80 border-slate-700/60 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-sky-500 text-slate-950' : 'bg-slate-700 text-sky-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[11px] text-slate-400">{item.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                );
              })}
            </div>

            {/* Diagnostic & Search Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  onOpenCommandPalette();
                }}
                className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold cursor-pointer"
              >
                <Search className="w-4 h-4 text-sky-400" />
                <span>Search (⌘K)</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  onOpenDiagnostics();
                }}
                className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold cursor-pointer"
              >
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span>Diagnostics</span>
              </button>
            </div>

            {/* Disclaimer */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[10px] text-slate-400 flex items-start space-x-2">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>Independent portfolio demonstration using synthetic healthcare data modeled on Apollo Hospitals patient flow.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
