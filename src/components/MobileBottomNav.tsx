import React from 'react';
import { 
  Activity, 
  Terminal, 
  AlertTriangle, 
  BedDouble, 
  Users, 
  Search,
  Gauge
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
  const tabs = [
    { id: 'dashboard' as ActiveTab, label: 'Overview', icon: Activity },
    { id: 'sql-workbench' as ActiveTab, label: 'SQL Lab', icon: Terminal },
    { id: 'bottlenecks' as ActiveTab, label: 'Bottlenecks', icon: AlertTriangle },
    { id: 'bed-tracker' as ActiveTab, label: 'Beds', icon: BedDouble },
    { id: 'data-browser' as ActiveTab, label: 'Records', icon: Users },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-nav-${tab.id}`}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] px-1 py-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
                isActive
                  ? 'text-sky-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-sky-500/20 text-sky-400' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* Quick Search trigger */}
        <button
          id="mobile-nav-search"
          onClick={onOpenCommandPalette}
          className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] px-1 py-1 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer active:scale-95"
          title="Search"
        >
          <div className="p-1 rounded-lg bg-slate-800 text-sky-400">
            <Search className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Search</span>
        </button>

        {/* Quick Health/Efficiency Diagnostic trigger */}
        <button
          id="mobile-nav-diagnostics"
          onClick={onOpenDiagnostics}
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-1 py-1 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer active:scale-95"
          title="Efficiency Diagnostics"
        >
          <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 animate-pulse">
            <Gauge className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-bold">Health</span>
        </button>
      </div>
    </div>
  );
};
