import React, { useState } from 'react';
import { 
  Activity, 
  Terminal, 
  AlertTriangle, 
  BedDouble, 
  Database, 
  Users, 
  ShieldCheck, 
  Search, 
  Command, 
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Flame
} from 'lucide-react';
import { ApolloLogo } from './ApolloLogo';

export type ActiveTab = 'dashboard' | 'sql-workbench' | 'bottlenecks' | 'bed-tracker' | 'schema-er' | 'data-browser';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCommandPalette: () => void;
  onOpenDiagnostics?: () => void;
  onSelectQuery?: (qNum: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenCommandPalette,
  onOpenDiagnostics,
  onSelectQuery
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Executive Dashboard', icon: Activity, shortLabel: 'Overview' },
    { id: 'sql-workbench' as ActiveTab, label: 'SQL Query Lab', icon: Terminal, badge: '15 Queries', shortLabel: 'SQL Lab' },
    { id: 'bottlenecks' as ActiveTab, label: 'Bottleneck Analysis', icon: AlertTriangle, badge: 'Risk Index', shortLabel: 'Bottlenecks' },
    { id: 'bed-tracker' as ActiveTab, label: 'Bed Capacity Tracker', icon: BedDouble, shortLabel: 'Bed Census' },
    { id: 'schema-er' as ActiveTab, label: 'Schema & ER Diagram', icon: Database, shortLabel: 'Schema' },
    { id: 'data-browser' as ActiveTab, label: 'Patient Data Explorer', icon: Users, badge: '2.5k Recs', shortLabel: 'Records' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Top System Health Bar / Telemetry */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-1 px-4 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
            <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>MySQL 8.0 Engine: Operational</span>
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline">Network: <strong className="text-white">4 Apollo Hospitals</strong> (Delhi, Mumbai, BLR, HYD)</span>
            <span className="text-slate-700 hidden md:inline">•</span>
            <span className="text-slate-300 hidden md:inline">Admissions Indexed: <strong className="text-sky-400">2,500 Episodes</strong></span>
            <span className="text-slate-700 hidden lg:inline">•</span>
            <span className="text-amber-400/90 font-medium hidden lg:inline">Alert: Bangalore ER Peak Wait (106.7 min)</span>
          </div>

          <div className="flex items-center space-x-2 pl-2">
            {onOpenDiagnostics && (
              <button
                onClick={onOpenDiagnostics}
                className="flex items-center space-x-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 px-2 py-0.5 rounded-md border border-emerald-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                title="System Health & Efficiency Diagnostics"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>⚡ Latency: 1.8ms</span>
              </button>
            )}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded-md border border-slate-700 text-[11px] transition-colors cursor-pointer"
              title="Open Command Palette (Cmd+K)"
            >
              <Search className="w-3 h-3 text-sky-400" />
              <span className="hidden sm:inline">Quick Search</span>
              <kbd className="bg-slate-900 px-1 rounded text-[9px] text-slate-400 border border-slate-700">⌘K</kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Clinical System Branding */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none group" 
            onClick={() => setActiveTab('dashboard')}
          >
            <ApolloLogo size="md" variant="horizontal" theme="dark" />
            <div className="hidden sm:flex items-center pl-1 border-l border-slate-700/80">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30">
                SQL Intelligence
              </span>
            </div>
          </div>

          {/* Quick Actions & Command Launcher in Header */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center space-x-3 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs transition-all w-64 justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2 truncate">
                <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">Search queries, depts, beds...</span>
              </div>
              <kbd className="bg-slate-900 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-700 font-mono">⌘K</kbd>
            </button>

            {onSelectQuery && (
              <button
                onClick={() => onSelectQuery(14)}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Q14 Bottleneck Matrix</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onOpenCommandPalette}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex space-x-1 overflow-x-auto py-2 border-t border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/90'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${
                      isActive
                        ? 'bg-slate-900 text-sky-300'
                        : item.badge === 'Risk Index'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive ? 'bg-sky-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? 'bg-slate-900 text-sky-300' : 'bg-slate-800 text-slate-400'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {onOpenDiagnostics && (
            <button
              onClick={() => {
                onOpenDiagnostics();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all mt-2"
            >
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>System Health & Efficiency Diagnostics</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                ⚡ Grade A+
              </span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
