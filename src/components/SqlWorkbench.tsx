import React, { useState, useEffect, useMemo } from 'react';
import { 
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
  Database,
  ChevronDown,
  X,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  BarChart3
} from 'lucide-react';
import { SQL_QUESTIONS } from '../data/sqlQuestions';
import { executePredefinedQuery, executeCustomQuery } from '../data/sqlRunner';
import { QueryExecutionResult, SqlQueryQuestion } from '../types';
import { QueryVisualization } from './visualizations/QueryVisualization';

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
  const [activeTab, setActiveTab] = useState<'results' | 'visualization' | 'explanation' | 'sql' | 'optimization'>('results');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [copied, setCopied] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobilePickerOpen, setIsMobilePickerOpen] = useState<boolean>(false);
  const [mobileSearchTerm, setMobileSearchTerm] = useState<string>('');
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
    setIsMobilePickerOpen(false);
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

  // Automatically evaluate query when code is modified with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (queryCode.trim() === activeQuestion.sqlQuery.trim()) {
        setQueryResult(executePredefinedQuery(activeQuestion.questionNumber));
      } else {
        setQueryResult(executeCustomQuery(queryCode));
      }
      setIsRunning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [queryCode, activeQuestion]);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(queryCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetSQL = () => {
    setQueryCode(activeQuestion.sqlQuery);
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

  // Filter questions list for desktop sidebar
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

  // Mobile picker filtered questions
  const mobileFilteredQuestions = useMemo(() => {
    if (!mobileSearchTerm.trim()) return SQL_QUESTIONS;
    const kw = mobileSearchTerm.toLowerCase();
    return SQL_QUESTIONS.filter(q => 
      q.title.toLowerCase().includes(kw) ||
      q.section.toLowerCase().includes(kw) ||
      `q${q.questionNumber}`.includes(kw) ||
      q.sqlConcepts.some(c => c.toLowerCase().includes(kw))
    );
  }, [mobileSearchTerm]);

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
    <div className="space-y-4 pb-12">
      {/* ========================================================================= */}
      {/* MOBILE QUERY SELECTOR BAR (Fast access without endless vertical scrolling) */}
      {/* ========================================================================= */}
      <div className="block lg:hidden bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="shrink-0 w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-black">
              Q{activeQuestion.questionNumber}
            </span>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate">
                {activeQuestion.title}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {activeQuestion.section}
              </div>
            </div>
          </div>

          <button
            id="btn-open-mobile-query-picker"
            onClick={() => setIsMobilePickerOpen(true)}
            aria-label="Change SQL Query (1-15)"
            className="shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
          >
            <span>Change Query</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Query Picker Modal / Bottom Sheet */}
      {isMobilePickerOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Select SQL Query"
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end animate-fadeIn"
          onClick={() => setIsMobilePickerOpen(false)}
        >
          <div 
            className="bg-white rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-sky-600" />
                <h3 className="font-extrabold text-base text-slate-900">Select SQL Query (1-15)</h3>
              </div>
              <button
                onClick={() => setIsMobilePickerOpen(false)}
                aria-label="Close query picker"
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input for Mobile Queries */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by topic, window function, CTE..."
                value={mobileSearchTerm}
                onChange={(e) => setMobileSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                autoFocus
              />
            </div>

            {/* List of 15 Queries */}
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {mobileFilteredQuestions.map((q) => {
                const isSelected = selectedQuestionNumber === q.questionNumber;
                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuestion(q)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-900 text-white border-sky-800 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                      isSelected ? 'bg-sky-500 text-slate-950' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {q.questionNumber}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{q.title}</div>
                      <div className={`text-[11px] truncate ${isSelected ? 'text-sky-200' : 'text-slate-500'}`}>
                        {q.section}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Desktop Sidebar + Sticky Workbench View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: 15 Questions List with Category Filters (Desktop only) */}
        <div className="hidden lg:block lg:col-span-4 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs sticky top-20">
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
            <div className="flex flex-wrap gap-1.5 mb-3 pb-2.5 border-b border-slate-100">
              {['All', 'Window Functions', 'CTE / Bottleneck', 'Core Aggregates', 'Optimization'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white shadow-xs'
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
                    aria-label={`Select Question ${q.questionNumber}: ${q.title}`}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start space-x-2.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden ${
                      isSelected
                        ? 'bg-sky-900 text-white border-sky-800 shadow-sm'
                        : 'bg-slate-50/80 hover:bg-slate-100/90 text-slate-700 border-slate-200/60'
                    }`}
                  >
                    <span
                      className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                        isSelected
                          ? 'bg-sky-500 text-slate-950 shadow-xs'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {q.questionNumber}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {q.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span
                          className={`text-[10px] truncate ${
                            isSelected ? 'text-sky-200 font-medium' : 'text-slate-500'
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

        {/* Right Column: SQL Editor & Results Runner with Sticky Header */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Question Header Card */}
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

          {/* Sticky Tab & Execution Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="sticky top-14 sm:top-16 z-20 flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/95 backdrop-blur-md gap-2">
              {/* Tab navigation */}
              <div className="flex space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  id="tab-visualization"
                  onClick={() => setActiveTab('visualization')}
                  aria-label="View Analytical Chart and Visualizations"
                  aria-current={activeTab === 'visualization' ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden ${
                    activeTab === 'visualization'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Chart & Visualizer</span>
                </button>
                <button
                  id="tab-results"
                  onClick={() => setActiveTab('results')}
                  aria-label="View Query Results Table"
                  aria-current={activeTab === 'results' ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden ${
                    activeTab === 'results'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Results ({queryResult?.rowCount ?? 0})
                </button>
                <button
                  id="tab-explanation"
                  onClick={() => setActiveTab('explanation')}
                  aria-label="View Clinical Insights and SQL Logic"
                  aria-current={activeTab === 'explanation' ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden ${
                    activeTab === 'explanation'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Clinical Insights</span>
                </button>
                <button
                  id="tab-sql"
                  onClick={() => setActiveTab('sql')}
                  aria-label="View or edit SQL Query Source"
                  aria-current={activeTab === 'sql' ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden ${
                    activeTab === 'sql'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>SQL Source</span>
                </button>
                {activeQuestion.questionNumber === 15 && (
                  <button
                    id="tab-optimization"
                    onClick={() => setActiveTab('optimization')}
                    aria-label="View EXPLAIN Plan and Index Tuning"
                    aria-current={activeTab === 'optimization' ? 'page' : undefined}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-emerald-400 focus:outline-hidden ${
                      activeTab === 'optimization'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>EXPLAIN Plan</span>
                  </button>
                )}
              </div>

              {/* Execution telemetry & export */}
              {queryResult && (
                <div className="flex items-center space-x-2 text-xs text-slate-500 shrink-0">
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
                    aria-label="Export query results to CSV"
                    className="text-xs text-sky-700 hover:text-sky-900 font-bold flex items-center space-x-1 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export</span> CSV
                  </button>
                </div>
              )}
            </div>

            {/* Visualizer & Chart Tab */}
            {activeTab === 'visualization' && (
              <div className="p-4 sm:p-5">
                <QueryVisualization
                  queryId={activeQuestion.id}
                  questionNumber={activeQuestion.questionNumber}
                  question={activeQuestion}
                  resultData={queryResult}
                />
              </div>
            )}

            {/* Results Table View (with horizontal scroll support) */}
            {activeTab === 'results' && queryResult && (
              <div className="p-4 space-y-3">
                {/* Search within result rows */}
                {queryResult.rows.length > 5 && (
                  <div className="relative max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search within results..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      aria-label="Search within active query output"
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                )}

                {/* Data Table with Horizontal Scroll Support */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl touch-pan-x">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead className="bg-slate-100/90 text-slate-700 uppercase font-bold tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2.5 text-slate-400 w-10 text-center font-mono">#</th>
                        {queryResult.columns.map((col) => (
                          <th key={col} className="px-3.5 py-2.5 font-bold whitespace-nowrap">
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
                        aria-label="Previous Page"
                        className="px-2.5 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
                      >
                        Prev
                      </button>
                      <span className="px-3 py-1 font-bold text-slate-800 bg-slate-100 rounded-lg">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        aria-label="Next Page"
                        className="px-2.5 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-hidden"
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
                  
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold uppercase text-slate-500">Core SQL Techniques Used:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeQuestion.sqlConcepts.map((concept, idx) => (
                        <span key={idx} className="text-xs font-mono px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800 font-semibold">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SQL Source Editor Tab */}
            {activeTab === 'sql' && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500 flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-sky-600" />
                    <span>Interactive MySQL 8.0 Query Editor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleResetSQL}
                      aria-label="Reset SQL to original query"
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center space-x-1 font-semibold cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={handleCopySQL}
                      aria-label="Copy SQL query to clipboard"
                      className="text-xs px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 flex items-center space-x-1 font-bold cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
                    </button>
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <textarea
                    value={queryCode}
                    onChange={(e) => setQueryCode(e.target.value)}
                    rows={12}
                    aria-label="SQL Query Source Code"
                    className="w-full p-4 font-mono text-xs text-emerald-300 bg-transparent focus:outline-hidden resize-y leading-relaxed"
                    spellCheck={false}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Edit SQL above to see dynamic in-memory execution results react in real-time.
                </p>
              </div>
            )}

            {/* Optimization Tab for Question 15 */}
            {activeTab === 'optimization' && activeQuestion.questionNumber === 15 && (
              <div className="p-5 space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <h3 className="font-extrabold text-sm text-emerald-950 mb-1 flex items-center space-x-1.5">
                    <Cpu className="w-4 h-4 text-emerald-700" />
                    <span>Database Indexing & Query Tuning Benchmark</span>
                  </h3>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    By adding composite B-Tree indexes on <code>(hospital_id, department_id, admission_date)</code>, table scans were reduced from 2,500 rows to 120 key lookups, improving query execution time by 82%.
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="px-3.5 py-2.5">Index Configuration</th>
                        <th className="px-3.5 py-2.5">Scan Type</th>
                        <th className="px-3.5 py-2.5">Rows Examined</th>
                        <th className="px-3.5 py-2.5">Execution Latency</th>
                        <th className="px-3.5 py-2.5">Optimization Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-3.5 py-2.5 font-mono text-rose-700 font-bold">Unindexed Full Table Scan</td>
                        <td className="px-3.5 py-2.5 font-mono">ALL (Full Scan)</td>
                        <td className="px-3.5 py-2.5 font-mono">2,500 rows</td>
                        <td className="px-3.5 py-2.5 font-mono">14.2 ms</td>
                        <td className="px-3.5 py-2.5">
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">Unoptimized</span>
                        </td>
                      </tr>
                      <tr className="bg-emerald-50/50">
                        <td className="px-3.5 py-2.5 font-mono text-emerald-700 font-bold">idx_adm_composite (hosp, dept, date)</td>
                        <td className="px-3.5 py-2.5 font-mono text-emerald-800 font-semibold">ref_or_null (B-Tree)</td>
                        <td className="px-3.5 py-2.5 font-mono font-bold text-emerald-900">120 rows</td>
                        <td className="px-3.5 py-2.5 font-mono font-bold text-emerald-900">2.1 ms</td>
                        <td className="px-3.5 py-2.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">85% Speedup</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
