import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Terminal, 
  Activity, 
  AlertTriangle, 
  BedDouble, 
  Database, 
  Users, 
  X, 
  ArrowRight, 
  Sparkles,
  Building2,
  Stethoscope,
  Clock,
  Code2
} from 'lucide-react';
import { SQL_QUESTIONS } from '../data/sqlQuestions';
import { ActiveTab } from './Navbar';
import { ApolloLogo } from './ApolloLogo';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onSelectQuery: (questionNumber: number) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectQuery
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Close on Escape, toggle on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset index on search change
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Navigation Items
  const navigationItems = [
    { id: 'dashboard' as ActiveTab, title: 'Executive Dashboard', subtitle: 'Real-time patient intake & KPI trends', icon: Activity, type: 'view' },
    { id: 'sql-workbench' as ActiveTab, title: 'SQL Query Lab', subtitle: 'Execute all 15 MySQL 8.0 queries with EXPLAIN plans', icon: Terminal, type: 'view' },
    { id: 'bottlenecks' as ActiveTab, title: 'Bottleneck Analysis', subtitle: 'Composite percent_rank pressure rankings', icon: AlertTriangle, type: 'view' },
    { id: 'bed-tracker' as ActiveTab, title: 'Bed Occupancy Tracker', subtitle: 'Departmental bed census & capacity forecasting', icon: BedDouble, type: 'view' },
    { id: 'schema-er' as ActiveTab, title: 'Relational Schema & ERD', subtitle: '6-table normalized 3NF database model', icon: Database, type: 'view' },
    { id: 'data-browser' as ActiveTab, title: 'Patient Data Explorer', subtitle: 'Search and inspect 2,500 clinical admission records', icon: Users, type: 'view' }
  ];

  // Filtered queries and views
  const filteredResults = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) {
      return [
        ...navigationItems.map(item => ({ ...item, category: 'Navigation Views' })),
        ...SQL_QUESTIONS.slice(0, 6).map(q => ({
          id: q.questionNumber,
          title: `Q${q.questionNumber}: ${q.title}`,
          subtitle: q.businessContext || q.description,
          icon: Code2,
          type: 'query',
          category: 'Popular SQL Queries'
        }))
      ];
    }

    const matchedNav = navigationItems
      .filter(item => item.title.toLowerCase().includes(query) || item.subtitle.toLowerCase().includes(query))
      .map(item => ({ ...item, category: 'Navigation' }));

    const matchedQueries = SQL_QUESTIONS
      .filter(q => 
        q.title.toLowerCase().includes(query) || 
        q.questionNumber.toString() === query ||
        (q.businessContext && q.businessContext.toLowerCase().includes(query)) ||
        q.section.toLowerCase().includes(query) ||
        q.sqlQuery.toLowerCase().includes(query)
      )
      .map(q => ({
        id: q.questionNumber,
        title: `Q${q.questionNumber}: ${q.title}`,
        subtitle: q.businessContext || q.description,
        icon: Code2,
        type: 'query',
        category: 'SQL Analytical Queries'
      }));

    return [...matchedNav, ...matchedQueries];
  }, [search]);

  // Handle arrow key navigation
  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredResults.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
      } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
        e.preventDefault();
        handleExecuteItem(filteredResults[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [isOpen, filteredResults, selectedIndex]);

  const handleExecuteItem = (item: any) => {
    if (item.type === 'view') {
      onSelectTab(item.id);
    } else if (item.type === 'query') {
      onSelectQuery(item.id);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Palette Modal Box */}
      <div 
        id="command-palette-modal"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <Search className="w-5 h-5 text-sky-600 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a query (e.g. 'Bottlenecks', 'Q14', 'LOS', 'Emergency', 'Cardiology')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 font-medium focus:outline-none"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 text-slate-600">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 divide-y divide-slate-100">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">No matching queries or sections found</p>
              <p className="text-xs text-slate-400 mt-0.5">Try searching 'Q1', 'Bed', 'Wait time', or 'Delhi'</p>
            </div>
          ) : (
            filteredResults.map((item: any, idx: number) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleExecuteItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-sky-50 text-sky-950 border border-sky-200/80 shadow-2xs' 
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isSelected 
                        ? 'bg-sky-600 text-white' 
                        : item.type === 'query' 
                        ? 'bg-slate-100 text-slate-600' 
                        : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-sky-950' : 'text-slate-900'}`}>
                          {item.title}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider ${
                          item.type === 'query' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 ml-2 ${isSelected ? 'text-sky-600 translate-x-0.5 transition-transform' : 'text-slate-300'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-3">
            <span><strong className="font-bold text-slate-700">↑↓</strong> Navigate</span>
            <span><strong className="font-bold text-slate-700">↵</strong> Select</span>
            <span><strong className="font-bold text-slate-700">ESC</strong> Close</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-600 font-semibold">
            <ApolloLogo size="sm" variant="compact" theme="light" />
          </div>
        </div>
      </div>
    </div>
  );
};
