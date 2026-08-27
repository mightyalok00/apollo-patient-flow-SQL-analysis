import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Download, 
  Search, 
  CheckCircle, 
  Layers, 
  Cpu, 
  Lightbulb, 
  BookOpen,
  ArrowRight,
  Code2
} from 'lucide-react';
import { SQL_QUESTIONS } from '../data/sqlQuestions';
import { executePredefinedQuery, executeCustomQuery } from '../data/sqlRunner';
import { QueryExecutionResult, SqlQueryQuestion } from '../types';

interface SqlWorkbenchProps {
  initialQuestionNumber?: number;
}

export const SqlWorkbench: React.FC<SqlWorkbenchProps> = ({ initialQuestionNumber = 1 }) => {
  const [selectedQuestionNumber, setSelectedQuestionNumber] = useState<number>(initialQuestionNumber);
  const [activeQuestion, setActiveQuestion] = useState<SqlQueryQuestion>(
    SQL_QUESTIONS.find(q => q.questionNumber === initialQuestionNumber) || SQL_QUESTIONS[0]
  );
  const [queryCode, setQueryCode] = useState<string>(activeQuestion.sqlQuery);
  const [queryResult, setQueryResult] = useState<QueryExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'results' | 'explanation' | 'optimization'>('results');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (initialQuestionNumber) {
      const q = SQL_QUESTIONS.find(item => item.questionNumber === initialQuestionNumber);
      if (q) {
        setSelectedQuestionNumber(q.questionNumber);
        setActiveQuestion(q);
        setQueryCode(q.sqlQuery);
        runPredefined(q.questionNumber);
      }
    }
  }, [initialQuestionNumber]);

  const handleSelectQuestion = (q: SqlQueryQuestion) => {
    setSelectedQuestionNumber(q.questionNumber);
    setActiveQuestion(q);
    setQueryCode(q.sqlQuery);
    setSearchTerm('');
    setCurrentPage(1);
    runPredefined(q.questionNumber);
  };

  const runPredefined = (num: number) => {
    setIsRunning(true);
    setTimeout(() => {
      const res = executePredefinedQuery(num);
      setQueryResult(res);
      setIsRunning(false);
    }, 120);
  };

  const handleRunQuery = () => {
    setIsRunning(true);
    setTimeout(() => {
      // If matches the active question query, run predefined for high fidelity
      if (queryCode.trim() === activeQuestion.sqlQuery.trim()) {
        setQueryResult(executePredefinedQuery(activeQuestion.questionNumber));
      } else {
        setQueryResult(executeCustomQuery(queryCode));
      }
      setIsRunning(false);
      setCurrentPage(1);
    }, 150);
  };

  const handleResetQuery = () => {
    setQueryCode(activeQuestion.sqlQuery);
    handleRunQuery();
  };

  const handleExportCSV = () => {
    if (!queryResult || queryResult.rows.length === 0) return;
    const headers = queryResult.columns.join(',');
    const rows = queryResult.rows.map(row => 
      queryResult.columns.map(col => `"${String(row[col] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apollo_query_q${activeQuestion.questionNumber}_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter rows by search term
  const filteredRows = queryResult?.rows.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
      {/* Left Sidebar: 15 Questions List */}
      <div className="lg:col-span-4 space-y-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>15 SQL Lab Questions</span>
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              MySQL 8.0+
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Select any question to load its production SQL query, run execution, and view analytical outputs.
          </p>

          <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
            {SQL_QUESTIONS.map((q) => {
              const isSelected = selectedQuestionNumber === q.questionNumber;
              return (
                <button
                  key={q.id}
                  id={`btn-select-q${q.questionNumber}`}
                  onClick={() => handleSelectQuestion(q)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start space-x-2.5 ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-100'
                  }`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'bg-white text-sky-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {q.questionNumber}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">
                        {q.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span
                        className={`text-[10px] truncate ${
                          isSelected ? 'text-sky-100' : 'text-slate-500'
                        }`}
                      >
                        {q.section}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: SQL Editor & Results Runner */}
      <div className="lg:col-span-8 space-y-4">
        {/* Active Question Info Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                Question {activeQuestion.questionNumber}
              </span>
              <span className="text-xs font-semibold text-slate-500">• {activeQuestion.section}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {activeQuestion.sqlConcepts.slice(0, 3).map((concept, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {concept}
                </span>
              ))}
            </div>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 mb-1">{activeQuestion.title}</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{activeQuestion.description}</p>
        </div>

        {/* SQL Code Box */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <Code2 className="w-4 h-4 text-sky-400" />
              <span>Apollo_Patient_Flow_Analysis.sql</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                id="btn-reset-sql"
                onClick={handleResetQuery}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 flex items-center space-x-1"
                title="Reset SQL to original"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                id="btn-execute-sql"
                onClick={handleRunQuery}
                disabled={isRunning}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : 'fill-slate-950'}`} />
                <span>{isRunning ? 'Executing...' : 'Run Query'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 font-mono text-xs text-emerald-400 bg-slate-900/90 overflow-x-auto">
            <textarea
              id="sql-editor-textarea"
              value={queryCode}
              onChange={(e) => setQueryCode(e.target.value)}
              rows={8}
              className="w-full bg-transparent text-emerald-300 font-mono text-xs focus:outline-hidden resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Execution Metadata & Sub-tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/70">
            <div className="flex space-x-2">
              <button
                id="tab-results"
                onClick={() => setActiveTab('results')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'results'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Query Results ({queryResult?.rowCount ?? 0})
              </button>
              <button
                id="tab-explanation"
                onClick={() => setActiveTab('explanation')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  activeTab === 'explanation'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Insights & Logic</span>
              </button>
              {activeQuestion.questionNumber === 15 && (
                <button
                  id="tab-optimization"
                  onClick={() => setActiveTab('optimization')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                    activeTab === 'optimization'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>EXPLAIN & Optimization</span>
                </button>
              )}
            </div>

            {queryResult && (
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span className="flex items-center text-emerald-600 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  <span>{queryResult.executionTimeMs} ms</span>
                </span>
                <button
                  id="btn-export-csv"
                  onClick={handleExportCSV}
                  className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>
            )}
          </div>

          {/* Results Table View */}
          {activeTab === 'results' && queryResult && (
            <div className="p-4 space-y-3">
              {/* Search in Result */}
              {queryResult.rows.length > 5 && (
                <div className="relative max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search results..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              )}

              {/* Data Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 uppercase font-bold tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      {queryResult.columns.map((col) => (
                        <th key={col} className="px-3.5 py-2.5 font-semibold">
                          {col.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedRows.length > 0 ? (
                      paginatedRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-sky-50/40 transition-colors">
                          {queryResult.columns.map((col) => {
                            const val = row[col];
                            return (
                              <td key={col} className="px-3.5 py-2 font-medium text-slate-800 whitespace-nowrap">
                                {typeof val === 'number' ? (
                                  Number.isInteger(val) ? val.toLocaleString() : val.toFixed(2)
                                ) : val === null ? (
                                  <span className="text-slate-400 italic">NULL</span>
                                ) : (
                                  String(val)
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={queryResult.columns.length} className="px-4 py-8 text-center text-slate-400">
                          No matching records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <span>
                    Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredRows.length)} of {filteredRows.length} rows
                  </span>
                  <div className="flex space-x-1">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-100"
                    >
                      Prev
                    </button>
                    <span className="px-2 py-1 font-semibold text-slate-800">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-100"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Explanation Tab */}
          {activeTab === 'explanation' && (
            <div className="p-6 space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Business Context</h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {activeQuestion.businessContext}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Key Empirical Finding</h4>
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-start space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                  <p className="text-xs font-semibold text-sky-900 leading-relaxed">
                    {activeQuestion.keyFinding || activeQuestion.explanation}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Technical Implementation & Concepts</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {activeQuestion.explanation}
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeQuestion.sqlConcepts.map((concept, i) => (
                    <span key={i} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Optimization Tab (for Q15) */}
          {activeTab === 'optimization' && (
            <div className="p-6 space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm mb-1">
                  <Cpu className="w-4 h-4" />
                  <span>50% Execution Time Speedup (0.032s → 0.016s)</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  By eliminating 3 correlated subqueries executed for every single department (60 lookups), pre-aggregating admissions and bed occupancy once via CTEs, and adding composite indexes on <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">(hospital_id, department_id)</code>, query complexity is reduced from O(N × M) to O(N + M).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
                  <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    Before Optimization (Correlated Subqueries)
                  </span>
                  <ul className="text-xs text-rose-900 mt-2 space-y-1.5 list-disc list-inside">
                    <li>3 subqueries per department row = 60 table accesses</li>
                    <li>Repeated full table scans on 2,500 admissions and 7,300 beds</li>
                    <li>Higher CPU utilization and temporary table memory overhead</li>
                    <li>Observed run duration: ~0.032 seconds</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    After Optimization (CTE + Composite Index)
                  </span>
                  <ul className="text-xs text-emerald-900 mt-2 space-y-1.5 list-disc list-inside">
                    <li>Admissions and beds aggregated exactly once in memory</li>
                    <li>Composite indexes support instant lookup and hash join</li>
                    <li>ANALYZE TABLE refreshes query cost statistics</li>
                    <li>Observed run duration: ~0.016 seconds (50% faster)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
