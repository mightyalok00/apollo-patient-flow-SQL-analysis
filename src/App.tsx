import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { QuestionsGraphHub } from './components/QuestionsGraphHub';
import { BottleneckAnalysis } from './components/BottleneckAnalysis';
import { BedOccupancyTracker } from './components/BedOccupancyTracker';
import { DatabaseSchemaExplorer } from './components/DatabaseSchemaExplorer';
import { PatientAdmissionsBrowser } from './components/PatientAdmissionsBrowser';
import { CommandPalette } from './components/CommandPalette';
import { ApolloLogo } from './components/ApolloLogo';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SystemHealthDiagnosticsModal } from './components/SystemHealthDiagnosticsModal';
import { BusinessInsightsModal } from './components/BusinessInsightsModal';
import { Activity, ShieldAlert, HeartHandshake, Database, FileCode2, ExternalLink, Sparkles, Lightbulb } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [targetQuestionNumber, setTargetQuestionNumber] = useState<number>(1);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState<boolean>(false);

  const handleSelectQueryFromAnywhere = (questionNumber: number) => {
    setTargetQuestionNumber(questionNumber);
    setActiveTab('all-charts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-white pb-20 lg:pb-0">
      {/* Top Navbar with Modern Telemetry & Command Palette Trigger */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onOpenInsights={() => setIsInsightsOpen(true)}
        onSelectQuery={handleSelectQueryFromAnywhere}
      />

      {/* Global Command Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectQuery={handleSelectQueryFromAnywhere}
        onOpenInsights={() => setIsInsightsOpen(true)}
      />

      {/* System Health & Efficiency Diagnostics Modal */}
      <SystemHealthDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />

      {/* C-Suite Executive Business Insights Modal */}
      <BusinessInsightsModal
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        onNavigateToChart={handleSelectQueryFromAnywhere}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview 
            onSelectQuery={handleSelectQueryFromAnywhere}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'all-charts' && (
          <QuestionsGraphHub 
            initialQuestionNumber={targetQuestionNumber}
            onSelectQuestion={handleSelectQueryFromAnywhere}
          />
        )}

        {activeTab === 'bottlenecks' && (
          <BottleneckAnalysis 
            onSelectQuery={handleSelectQueryFromAnywhere}
          />
        )}

        {activeTab === 'bed-tracker' && (
          <BedOccupancyTracker 
            onSelectQuery={handleSelectQueryFromAnywhere}
          />
        )}

        {activeTab === 'schema-er' && (
          <DatabaseSchemaExplorer />
        )}

        {activeTab === 'data-browser' && (
          <PatientAdmissionsBrowser />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar for iOS & Android (Thumb-friendly) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onOpenInsights={() => setIsInsightsOpen(true)}
      />

      {/* Modern Executive Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800 text-xs">
            <div className="space-y-3">
              <div className="mb-2">
                <ApolloLogo size="md" variant="full" theme="dark" />
              </div>
              <p className="text-slate-400 leading-relaxed">
                Hospital analytical engine modeling 2,500 patient episodes, wait-time bottlenecks, length of stay, and bed utilization across 4 Apollo facilities.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Relational Architecture</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• 6 Normalized 3NF Tables</li>
                <li>• MySQL 8.0+ Window Functions</li>
                <li>• CTEs, Percentile Ranks & Rolling Averages</li>
                <li>• Indexed Foreign Key Constraints</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Key SQL Queries</h4>
              <ul className="space-y-1 text-slate-400">
                <li>
                  <button onClick={() => handleSelectQueryFromAnywhere(1)} className="hover:text-sky-400 transition-colors">
                    Q1: Daily Admissions & 7D Avg
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectQueryFromAnywhere(4)} className="hover:text-sky-400 transition-colors">
                    Q4: Triage Latency & Severity
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectQueryFromAnywhere(14)} className="hover:text-sky-400 transition-colors">
                    Q14: Composite Bottleneck Matrix
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectQueryFromAnywhere(15)} className="hover:text-sky-400 transition-colors">
                    Q15: EXPLAIN Plan & Query Tuning
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Executive Verification</h4>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-2.5">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>100% Data Integrity Verified</span>
                </div>
                <p>2,500 admissions across 4 hospitals (Delhi, Mumbai, Bangalore, Hyderabad).</p>
                <button
                  id="btn-footer-business-insights"
                  onClick={() => setIsInsightsOpen(true)}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-slate-950 font-black text-xs hover:opacity-95 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>Executive Business Insights</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <span>Apollo Hospitals Patient Flow SQL Analytics • Developed by <strong className="text-slate-300 font-bold">Alok Agarwal</strong></span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsInsightsOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Business Insights</span>
              </button>
              <span>•</span>
              <span className="flex items-center text-slate-400">
                <ShieldAlert className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>Synthetic Dataset</span>
              </span>
              <span>•</span>
              <button 
                onClick={() => setIsCommandPaletteOpen(true)}
                className="text-sky-400 hover:text-sky-300 font-semibold"
              >
                Press ⌘K to Search
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
