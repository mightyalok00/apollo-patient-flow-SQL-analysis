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
  ExternalLink,
  Code2
} from 'lucide-react';
import { DATABASE_TABLES } from '../data/hospitalData';
import { ErDiagramVisualizer } from './ErDiagramVisualizer';

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
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full-Screen ER Diagram</span>
          </button>
        </div>
      </div>

      {/* Interactive ER Diagram Canvas */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900 flex items-center space-x-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>Apollo Hospitals Interactive Entity Relationship Diagram (ERD)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any table in the diagram to inspect columns, constraints, and data definitions below.
            </p>
          </div>
          <button
            onClick={() => setIsDiagramExpanded(true)}
            className="hidden sm:flex text-xs text-indigo-600 font-bold hover:underline items-center space-x-1 cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200"
          >
            <span>Full Screen</span>
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Embedded Interactive ER Diagram */}
        <ErDiagramVisualizer onSelectTable={(name) => setSelectedTable(name)} />
      </div>

      {/* Interactive Table Schema Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Selector Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/80 p-2 gap-1.5">
          {DATABASE_TABLES.map(t => (
            <button
              key={t.name}
              onClick={() => setSelectedTable(t.name)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
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
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsDiagramExpanded(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-6xl w-full max-h-[92vh] p-6 overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-extrabold text-lg text-white">Apollo Hospitals Entity-Relationship Diagram</h3>
                <p className="text-xs text-slate-400">Full visual relational schema with foreign key cardinalities</p>
              </div>
              <button
                onClick={() => setIsDiagramExpanded(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
              >
                Close (ESC)
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              <ErDiagramVisualizer isModal={true} onSelectTable={(name) => {
                setSelectedTable(name);
                setIsDiagramExpanded(false);
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
