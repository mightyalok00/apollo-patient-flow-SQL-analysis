import React, { useState } from 'react';
import { 
  Database, 
  Key, 
  Link as LinkIcon, 
  Maximize2, 
  Table, 
  Layers, 
  ShieldCheck, 
  FileCode,
  ExternalLink
} from 'lucide-react';
import { DATABASE_TABLES } from '../data/hospitalData';

export const DatabaseSchemaExplorer: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('admissions');
  const [isDiagramExpanded, setIsDiagramExpanded] = useState<boolean>(false);

  const currentTable = DATABASE_TABLES.find(t => t.name === selectedTable) || DATABASE_TABLES[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-2">
          <Database className="w-4 h-4" />
          <span>Relational Architecture • 3rd Normal Form (3NF)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Apollo Patient Flow Relational Schema & ERD
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mb-4">
          Fully normalized 6-table relational schema linking hospitals, clinical departments, credentialed medical staff, longitudinal patient profiles, timestamped admission episodes, and daily bed occupancy observations.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsDiagramExpanded(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>View Full ER Diagram</span>
          </button>
        </div>
      </div>

      {/* ER Diagram Preview & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Entity Relationship Diagram (ERD)</h3>
                <p className="text-xs text-slate-500">Visual mapping of primary and foreign key constraints</p>
              </div>
              <button
                onClick={() => setIsDiagramExpanded(true)}
                className="text-xs text-indigo-600 font-semibold hover:underline flex items-center space-x-1"
              >
                <span>Expand</span>
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>

            <div 
              onClick={() => setIsDiagramExpanded(true)}
              className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-all relative group flex items-center justify-center p-2 min-h-[220px]"
            >
              <img 
                src="/ER_Diagram.png" 
                alt="Apollo Hospitals ER Diagram" 
                className="max-h-56 object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                Click to expand high-resolution diagram
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-3">
            <span>Cardinalities: 1:N & Composite FKs</span>
            <span className="font-semibold text-slate-700">MySQL InnoDB Engine</span>
          </div>
        </div>

        {/* Database Summary Metrics */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-3">Database Architecture Highlights</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Referential Integrity: </span>
                  Enforces strict foreign key constraints between admissions, patients, doctors, and departments.
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <Key className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Composite Department Keys: </span>
                  Departments & Bed observations maintain composite relationships on <code className="font-mono bg-slate-200 px-1 rounded">(department_id, hospital_id)</code>.
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <FileCode className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Optimized Composite Indexing: </span>
                  Includes composite indexes on high-frequency join attributes to eliminate table scan bottlenecks.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Table Counts Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {DATABASE_TABLES.map(t => (
              <button
                key={t.name}
                onClick={() => setSelectedTable(t.name)}
                className={`p-2.5 rounded-xl border transition-all ${
                  selectedTable === t.name
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs truncate">{t.name}</div>
                <div className="text-sm font-extrabold text-slate-900">{t.rowCount.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Table Schema Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Selector Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/80 p-2 gap-1.5">
          {DATABASE_TABLES.map(t => (
            <button
              key={t.name}
              onClick={() => setSelectedTable(t.name)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                selectedTable === t.name
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{t.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedTable === t.name ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-700'
              }`}>
                {t.rowCount.toLocaleString()}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Table Metadata */}
        <div className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg text-slate-900 font-mono">
                  TABLE {currentTable.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                  {currentTable.rowCount.toLocaleString()} records
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentTable.description}</p>
            </div>
            {currentTable.primaryKey && (
              <div className="text-xs flex items-center space-x-1 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>Primary Key: <strong>{currentTable.primaryKey}</strong></span>
              </div>
            )}
          </div>

          {/* Columns Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Column Name</th>
                  <th className="px-4 py-2.5">Data Type</th>
                  <th className="px-4 py-2.5">Nullable</th>
                  <th className="px-4 py-2.5">Key / Constraint</th>
                  <th className="px-4 py-2.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentTable.columns.map(col => {
                  const isPk = currentTable.primaryKey?.includes(col.name);
                  const isFk = !!col.foreignKey;
                  return (
                    <tr key={col.name} className="hover:bg-slate-50/60">
                      <td className="px-4 py-2.5 font-mono font-bold text-slate-900 flex items-center space-x-1.5">
                        {isPk && <Key className="w-3.5 h-3.5 text-amber-500" />}
                        {isFk && <LinkIcon className="w-3.5 h-3.5 text-sky-500" />}
                        <span>{col.name}</span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-indigo-700 font-semibold">
                        {col.type}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">
                        {col.nullable ? 'YES' : 'NO (NOT NULL)'}
                      </td>
                      <td className="px-4 py-2.5">
                        {isPk && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 mr-1">
                            PRIMARY KEY
                          </span>
                        )}
                        {col.foreignKey && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                            FK → {col.foreignKey}
                          </span>
                        )}
                        {!isPk && !col.foreignKey && (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 text-xs">
                        {col.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Expanded Diagram Modal */}
      {isDiagramExpanded && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsDiagramExpanded(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] p-6 overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Apollo Hospitals Entity-Relationship Diagram</h3>
                <p className="text-xs text-slate-500">Full visual schema with table relationships</p>
              </div>
              <button
                onClick={() => setIsDiagramExpanded(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Close (ESC)
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-slate-50 rounded-xl">
              <img 
                src="/ER_Diagram.png" 
                alt="Apollo Hospitals ER Diagram" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
