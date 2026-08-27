import React, { useState, useEffect, useMemo } from 'react';
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
  Code2,
  Copy,
  Check,
  Filter,
  Sparkles,
  Terminal,
  Clock,
  Rows,
  Database
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
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [copied, setCopied] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 12;

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
    }, 100);
  };

  const handleRunQuery = () => {
    setIsRunning(true);
    setTimeout(() => {
      if (queryCode.trim() === activeQuestion.sqlQuery.trim()) {
        setQueryResult(executePredefinedQuery(activeQuestion.questionNumber));
      } else {
        setQueryResult(executeCustomQuery(queryCode));
      }
      setIsRunning(false);
      setCurrentPage(1);
    }, 120);
  };

  const handleResetQuery = () => {
    setQueryCode(activeQuestion.sqlQuery);
    setIsRunning(true);
    setTimeout(() => {
      setQueryResult(executePredefinedQuery(activeQuestion.questionNumber));
      setIsRunning(false);
    }, 100);
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(queryCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  // Filter questions list
  const filteredQuestions = useMemo(() => {
    return SQL_QUESTIONS.filter(q => {
      if (categoryFilter === 'All') return true;
      if (categoryFilter === 'Window Functions') return q.sqlConcepts.some(c => c.includes('OVER') || c.includes('RANK') || c.includes('WINDOW') || c.includes('LEAD') || c.includes('LAG') || c.includes('AVG() OVER'));
      if (categoryFilter === 'CTE / Bottleneck') return q.sqlConcepts.some(c => c.includes('WITH') || c.includes('CTE')) || q.section.includes('Bottleneck');
      if (categoryFilter === 'Core Aggregates') return q.sqlConcepts.some(c => c.includes('GROUP BY') || c.includes('COUNT') || c.includes('SUM')) || q.section.includes('Volume');
      if (categoryFilter === 'Optimization') return q.questionNumber === 15;
      return true;
    });
  }, [categoryFilter]);

  // Filter rows by search term
  const filteredRows = useMemo(() => {
    if (!queryResult) return [];
    if (!searchTerm.trim()) return queryResult.rows;
    const kw = searchTerm.toLowerCase();
    return queryResult.rows.filter(row => 
      Object.values(row).some(val => String(val).toLowerCase().includes(kw))
    );
  }, [queryResult, searchTerm]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
      {/* Left Sidebar: 15 Questions List with Category Filters */}
      <div className="lg:col-span-4 space-y-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>15 SQL Lab Queries</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              MySQL 8.0+
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Analytical queries from basic aggregations to advanced window CTEs & EXPLAIN plans.
          </p>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1 mb-3 pb-2 border-b border-slate-100">
            {['All', 'Window Functions', 'CTE / Bottleneck', 'Core Aggregates', 'Optimization'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Question List Items */}
          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredQuestions.map((q) => {
              const isSelected = selectedQuestionNumber === q.questionNumber;
              return (
                <button
                  key={q.id}
                  id={`btn-select-q${q.questionNumber}`}
                  onClick={() => handleSelectQuestion(q)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start space-x-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white border-sky-600 shadow-xs'
                      : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-100'
                  }`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                      isSelected
                        ? 'bg-white text-sky-700 shadow-xs'
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
                          isSelected ? 'text-sky-100 font-medium' : 'text-slate-500'
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
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                Question {activeQuestion.questionNumber} of 15
              </span>
              <span className="text-xs font-semibold text-slate-500">• {activeQuestion.section}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {activeQuestion.sqlConcepts.slice(0, 3).map((concept, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                  {concept}
                </span>
              ))}
            </div>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 mb-1">{activeQuestion.title}</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{activeQuestion.description}</p>
        </div>

        {/* SQL Code Box with Syntax Styling */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <Code2 className="w-4 h-4 text-sky-400" />
              <span>Apollo_Patient_Flow_Query_Q{activeQuestion.questionNumber}.sql</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                id="btn-copy-sql"
                onClick={handleCopySQL}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 flex items-center space-x-1 transition-colors cursor-pointer"
                title="Copy SQL Query"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy SQL'}</span>
              </button>

              <button
                id="btn-reset-sql"
                onClick={handleResetQuery}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 flex items-center space-x-1 transition-colors cursor-pointer"
                title="Reset SQL to original"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                id="btn-execute-sql"
                onClick={handleRunQuery}
                disabled={isRunning}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition-all disabled:opacity-50 shadow-sm cursor-pointer"
              >
                <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : 'fill-slate-950'}`} />
                <span>{isRunning ? 'Executing...' : 'Run Query'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 font-mono text-xs text-emerald-400 bg-slate-900/95 overflow-x-auto">
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

        {/* Execution Metadata & Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/80 gap-2">
            <div className="flex space-x-1.5">
              <button
                id="tab-results"
                onClick={() => setActiveTab('results')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'results'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Results ({queryResult?.rowCount ?? 0})
              </button>
              <button
                id="tab-explanation"
                onClick={() => setActiveTab('explanation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  activeTab === 'explanation'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Clinical Insights & Logic</span>
              </button>
              {activeQuestion.questionNumber === 15 && (
                <button
                  id="tab-optimization"
                  onClick={() => setActiveTab('optimization')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                    activeTab === 'optimization'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>EXPLAIN Plan & Tuning</span>
                </button>
              )}
            </div>

            {queryResult && (
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span>{queryResult.executionTimeMs} ms</span>
                </span>
                <span className="flex items-center text-slate-600 font-medium">
                  <Rows className="w-3 h-3 mr-1 text-slate-400" />
                  <span>{queryResult.rowCount} rows</span>
                </span>
                <button
                  id="btn-export-csv"
                  onClick={handleExportCSV}
                  className="text-xs text-sky-600 hover:text-sky-800 font-bold flex items-center space-x-1 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
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
                    placeholder="Search in query output..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              )}

              {/* Data Table with Type Formatting */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/90 text-slate-700 uppercase font-bold tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2.5 text-slate-400 w-10 text-center font-mono">#</th>
                      {queryResult.columns.map((col) => (
                        <th key={col} className="px-3.5 py-2.5 font-bold">
                          {col.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedRows.length > 0 ? (
                      paginatedRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-sky-50/50 transition-colors">
                          <td className="px-3 py-2 text-slate-400 text-center font-mono text-[11px]">
                            {(currentPage - 1) * rowsPerPage + idx + 1}
                          </td>
                          {queryResult.columns.map((col) => {
                            const val = row[col];
                            const isNumeric = typeof val === 'number';
                            return (
                              <td 
                                key={col} 
                                className={`px-3.5 py-2 font-medium text-slate-800 whitespace-nowrap ${
                                  isNumeric ? 'font-mono' : ''
                                }`}
                              >
                                {isNumeric ? (
                                  Number.isInteger(val) ? val.toLocaleString() : val.toFixed(2)
                                ) : val === null ? (
                                  <span className="text-slate-400 italic">NULL</span>
                                ) : String(val).toLowerCase().includes('critical') || String(val).toLowerCase().includes('high strain') ? (
                                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold">
                                    {String(val)}
                                  </span>
                                ) : String(val).toLowerCase().includes('normal') || String(val).toLowerCase().includes('stable') ? (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                                    {String(val)}
                                  </span>
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
                        <td colSpan={queryResult.columns.length + 1} className="px-4 py-8 text-center text-slate-400">
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
                      className="px-2.5 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 font-semibold cursor-pointer"
                    >
                      Prev
                    </button>
                    <span className="px-3 py-1 font-bold text-slate-800 bg-slate-100 rounded-lg">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 font-semibold cursor-pointer"
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
            <div className="p-5 space-y-4">
              <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200">
                <h3 className="font-extrabold text-sm text-sky-950 mb-1 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Business & Clinical Context</span>
                </h3>
                <p className="text-xs text-sky-900 leading-relaxed">{activeQuestion.businessContext || activeQuestion.description}</p>
                {activeQuestion.keyFinding && (
                  <div className="mt-2 pt-2 border-t border-sky-200/60 text-xs font-semibold text-sky-950">
                    <strong>Key Finding: </strong> {activeQuestion.keyFinding}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-extrabold text-sm text-slate-900 mb-1 flex items-center space-x-1.5">
                  <Code2 className="w-4 h-4 text-slate-700" />
                  <span>Technical SQL Implementation & Logic</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{activeQuestion.explanation}</p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                  {activeQuestion.sqlConcepts.map((c, i) => (
                    <span key={i} className="text-[11px] font-mono font-semibold px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-800">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EXPLAIN Tab for Q15 */}
          {activeTab === 'optimization' && activeQuestion.questionNumber === 15 && (
            <div className="p-5 space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h3 className="font-extrabold text-sm text-emerald-950 mb-1">Index Optimization & EXPLAIN Plan Analysis</h3>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Demonstrates how composite indexing on <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded font-bold">idx_admissions_hosp_dept (hospital_id, department_id, admission_date)</code> eliminates full table scans, reducing cost from <strong>542.20 to 18.40</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="font-bold text-rose-900 mb-1">Before Index (Full Table Scan)</div>
                  <div className="space-y-1 font-mono text-[11px] text-rose-800">
                    <div>• Scan Type: ALL (Full table scan)</div>
                    <div>• Rows Examined: 2,500 rows</div>
                    <div>• Cost Estimate: 542.20</div>
                    <div>• Latency: ~142ms on large scale</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-emerald-900 mb-1">After Composite Index (Ref / Range Scan)</div>
                  <div className="space-y-1 font-mono text-[11px] text-emerald-800">
                    <div>• Scan Type: REF / RANGE (Covering Index)</div>
                    <div>• Rows Examined: ~125 rows</div>
                    <div>• Cost Estimate: 18.40 (96.6% reduction)</div>
                    <div>• Latency: ~4ms</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
