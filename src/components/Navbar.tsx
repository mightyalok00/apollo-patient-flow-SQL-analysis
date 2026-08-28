import React, { useState } from 'react';
import { 
  Activity, 
  Terminal, 
  AlertTriangle, 
  BedDouble, 
  Database, 
  Users, 
  Search, 
  Menu, 
  X, 
  Flame,
  ShieldCheck,
  Gauge,
  Sparkles
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
    { id: 'bottlenecks' as ActiveTab, label: 'Bottleneck Matrix', icon: AlertTriangle, badge: 'Q14 Index', shortLabel: 'Bottlenecks' },
    { id: 'bed-tracker' as ActiveTab, label: 'Bed Capacity Tracker', icon: BedDouble, shortLabel: 'Bed Census' },
    { id: 'schema-er' as ActiveTab, label: 'Schema & ER Diagram', icon: Database, shortLabel: 'Schema' },
    { id: 'data-browser' as ActiveTab, label: 'Patient Records', icon: Users, badge: '2.5k Recs', shortLabel: 'Records' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Row 1: Brand, Telemetry & Global Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 border-b border-slate-800/80">
          {/* Brand Logo & Identifier */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              aria-label="Apollo Hospitals Analytics Dashboard Home"
              className="flex items-center space-x-2.5 focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden rounded-lg cursor-pointer text-left"
            >
              <ApolloLogo size="sm" variant="horizontal" theme="dark" />
            </button>
            <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-700/80">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30">
                SQL Intelligence
              </span>
              <span className="text-[10px] text-slate-400 hidden md:inline">
                by <strong className="text-slate-200 font-semibold">Alok Agarwal</strong>
              </span>
            </div>
          </div>

          {/* Telemetry & Synthetic Notice */}
          <div className="hidden xl:flex items-center space-x-3 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>MySQL 8.0 Engine Active</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-300">4 Facilities (Delhi, Mumbai, BLR, HYD)</span>
            <span className="text-slate-700">•</span>
            <span className="text-sky-300 font-mono font-medium">2,500 Verified Episodes</span>
          </div>

          {/* Right Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenCommandPalette}
              aria-label="Open Command Palette Search (Cmd+K)"
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-700 text-xs transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
            >
              <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="hidden sm:inline text-xs text-slate-300">Quick Search...</span>
              <kbd className="hidden sm:inline-block bg-slate-900 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-700 font-mono">⌘K</kbd>
            </button>

            {onSelectQuery && (
              <button
                onClick={() => onSelectQuery(14)}
                aria-label="Open Query 14 Composite Bottleneck Score"
                className="hidden md:flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-hidden"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Q14 Matrix</span>
              </button>
            )}

            {onOpenDiagnostics && (
              <button
                onClick={onOpenDiagnostics}
                aria-label="Open System Health & Diagnostic Telemetry"
                className="hidden sm:flex items-center space-x-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 focus:outline-hidden"
                title="System Health & Diagnostics"
              >
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                <span>Diagnostics</span>
              </button>
            )}

            {/* Mobile Drawer Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Row 2: Desktop Navigation Bar */}
        <nav 
          aria-label="Primary Navigation" 
          className="hidden lg:flex space-x-1 overflow-x-auto py-2"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden ${
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
                        : item.badge === 'Q14 Index'
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
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-4 space-y-1.5 animate-fadeIn">
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all mt-2 cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <Gauge className="w-4 h-4" />
                <span>System Health & Diagnostics</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                ⚡ 1.8ms
              </span>
            </button>
          )}

          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800 text-center">
            Portfolio demonstration • Synthetic healthcare dataset
          </div>
        </div>
      )}
    </header>
  );
};

