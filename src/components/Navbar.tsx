import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  BedDouble, 
  Database, 
  Users, 
  Search, 
  Menu, 
  X, 
  ShieldCheck,
  Gauge,
  Sparkles,
  BarChart3,
  Lightbulb,
  Info,
  HelpCircle
} from 'lucide-react';
import { HealthcareLogo } from './ApolloLogo';

export type ActiveTab = 'dashboard' | 'all-charts' | 'bottlenecks' | 'bed-tracker' | 'schema-er' | 'data-browser';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCommandPalette: () => void;
  onOpenDiagnostics?: () => void;
  onOpenInsights?: () => void;
  onOpenAbout?: () => void;
  onSelectQuery?: (qNum: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenCommandPalette,
  onOpenDiagnostics,
  onOpenInsights,
  onOpenAbout,
  onSelectQuery
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Overview & Problem Triad', icon: Activity, shortLabel: 'Overview' },
    { id: 'all-charts' as ActiveTab, label: '15 SQL Visualizers', icon: BarChart3, badge: '15 Charts', shortLabel: '15 SQL' },
    { id: 'bottlenecks' as ActiveTab, label: 'Bottleneck Matrix', icon: AlertTriangle, badge: 'Q14 Rank', shortLabel: 'Bottlenecks' },
    { id: 'bed-tracker' as ActiveTab, label: 'Bed Capacity Tracker', icon: BedDouble, shortLabel: 'Bed Census' },
    { id: 'schema-er' as ActiveTab, label: 'Data Model & ERD', icon: Database, shortLabel: 'Schema' },
    { id: 'data-browser' as ActiveTab, label: 'Patient Records Explorer', icon: Users, badge: '2,500 Recs', shortLabel: 'Records' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Row 1: Brand, Telemetry & Global Actions */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 border-b border-slate-800/80">
          
          {/* Brand Logo & Author Attribution */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              aria-label="Healthcare Patient Flow SQL Analytics Home"
              className="flex items-center space-x-2.5 focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden rounded-xl cursor-pointer text-left py-1"
            >
              <HealthcareLogo size="sm" variant="horizontal" theme="dark" />
            </button>
            <div className="hidden sm:flex items-center space-x-2 pl-2.5 border-l border-slate-700/80">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30">
                SQL Analytics
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
              <span>MySQL 8.0 Validated</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-300">4 Metro Hospitals (20 Departments)</span>
            <span className="text-slate-700">•</span>
            <span className="text-sky-300 font-mono font-medium">2,500 Patient Episodes</span>
          </div>

          {/* Right Quick Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            
            {/* Quick Search */}
            <button
              onClick={onOpenCommandPalette}
              aria-label="Open Command Palette Search (Cmd+K)"
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-700 text-xs transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
            >
              <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="hidden sm:inline text-xs text-slate-300">Search...</span>
              <kbd className="hidden sm:inline-block bg-slate-900 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-700 font-mono">⌘K</kbd>
            </button>

            {/* Business Insights Trigger */}
            {onOpenInsights && (
              <button
                id="btn-nav-business-insights"
                onClick={onOpenInsights}
                aria-label="Open Executive Business Insights & ROI Roadmap"
                className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-300 border border-amber-500/40 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-hidden active:scale-95"
                title="Executive Business Insights & ROI Analysis"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden md:inline">Business Insights</span>
                <span className="md:hidden">Insights</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 hidden sm:inline">ROI</span>
              </button>
            )}

            {/* About Project Trigger */}
            {onOpenAbout && (
              <button
                id="btn-nav-about"
                onClick={onOpenAbout}
                aria-label="Open About This Project and Methodology modal"
                className="hidden lg:flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
              >
                <Info className="w-3.5 h-3.5 text-sky-400" />
                <span>About</span>
              </button>
            )}

            {/* Diagnostics Modal Trigger */}
            {onOpenDiagnostics && (
              <button
                id="btn-nav-diagnostics"
                onClick={onOpenDiagnostics}
                aria-label="Open System Health & Diagnostic Suite"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
                title="System Health & Diagnostic Suite"
              >
                <Gauge className="w-4 h-4 text-emerald-400" />
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Row 2: Desktop Navigation Bar Slider */}
        <nav 
          aria-label="Primary Navigation" 
          className="hidden lg:flex items-center justify-between space-x-1 overflow-x-auto py-2"
        >
          <div className="flex space-x-1 items-center">
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
                      ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/30 font-extrabold'
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
                          : item.badge === 'Q14 Rank'
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
          </div>

          <div className="flex items-center space-x-2">
            {onOpenAbout && (
              <button
                onClick={onOpenAbout}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer shrink-0"
              >
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>Methodology</span>
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-4 space-y-1.5 animate-fadeIn">
          
          {onOpenInsights && (
            <button
              id="btn-mobile-business-insights"
              onClick={() => {
                onOpenInsights();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/40 transition-all cursor-pointer mb-2"
            >
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Executive Business Insights & ROI</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                Executive
              </span>
            </button>
          )}

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
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                    isActive ? 'bg-slate-900 text-sky-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {onOpenAbout && (
            <button
              onClick={() => {
                onOpenAbout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer mt-2 border-t border-slate-800 pt-3"
            >
              <Info className="w-4 h-4 text-sky-400" />
              <span>About This Project & Schema</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
