import React from 'react';
import { 
  Activity, 
  Terminal, 
  AlertTriangle, 
  BedDouble, 
  Database, 
  Users,
  ShieldCheck
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'sql-workbench' | 'bottlenecks' | 'bed-tracker' | 'schema-er' | 'data-browser';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Executive Dashboard', icon: Activity },
    { id: 'sql-workbench' as ActiveTab, label: 'SQL Query Lab', icon: Terminal, badge: '15 Queries' },
    { id: 'bottlenecks' as ActiveTab, label: 'Bottleneck Analysis', icon: AlertTriangle, badge: 'High Risk' },
    { id: 'bed-tracker' as ActiveTab, label: 'Bed Capacity Tracker', icon: BedDouble },
    { id: 'schema-er' as ActiveTab, label: 'Schema & ER Diagram', icon: Database },
    { id: 'data-browser' as ActiveTab, label: 'Data Explorer', icon: Users },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm ring-2 ring-sky-100">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">Apollo</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                  SQL Analytics
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Patient Flow & Capacity Intelligence</p>
            </div>
          </div>

          {/* Key Database Metrics Tag */}
          <div className="hidden lg:flex items-center space-x-3 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
            <span className="flex items-center space-x-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>MySQL 8.0+</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-slate-800">4 Hospitals</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-800">20 Depts</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-sky-700">2,500 Admissions</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-800">7,300 Bed Obs</span>
          </div>

          {/* Quick status pill */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Synthetic SQL Lab</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-100 -mx-4 px-4 sm:mx-0 sm:px-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-sky-700 text-sky-100'
                        : item.badge === 'High Risk'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
