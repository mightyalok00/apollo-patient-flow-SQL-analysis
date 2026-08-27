import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { SqlWorkbench } from './components/SqlWorkbench';
import { BottleneckAnalysis } from './components/BottleneckAnalysis';
import { BedOccupancyTracker } from './components/BedOccupancyTracker';
import { DatabaseSchemaExplorer } from './components/DatabaseSchemaExplorer';
import { PatientAdmissionsBrowser } from './components/PatientAdmissionsBrowser';
import { Activity, ShieldAlert, HeartHandshake, Database } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [targetQuestionNumber, setTargetQuestionNumber] = useState<number>(1);

  const handleSelectQueryFromAnywhere = (questionNumber: number) => {
    setTargetQuestionNumber(questionNumber);
    setActiveTab('sql-workbench');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview 
            onSelectQuery={handleSelectQueryFromAnywhere}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'sql-workbench' && (
          <SqlWorkbench 
            initialQuestionNumber={targetQuestionNumber}
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-sky-600 flex items-center justify-center text-white font-bold text-[10px]">
              A
            </div>
            <span className="font-semibold text-slate-700">Apollo Hospitals Patient Flow SQL Analytics</span>
            <span>•</span>
            <span>MySQL 8.0+ Educational Lab</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center text-slate-400">
              <ShieldAlert className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>Synthetic Academic Dataset</span>
            </span>
            <span>•</span>
            <button 
              onClick={() => handleSelectQueryFromAnywhere(15)}
              className="text-sky-600 hover:text-sky-800 font-semibold"
            >
              EXPLAIN Tuning (Q15)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
