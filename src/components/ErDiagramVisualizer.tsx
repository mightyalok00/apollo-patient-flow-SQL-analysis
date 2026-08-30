import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { 
  Database, 
  Key, 
  Link as LinkIcon, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Eye, 
  Info,
  Layers,
  Sparkles,
  ShieldCheck,
  Check,
  Search,
  Maximize2,
  Minimize2,
  FileImage,
  Code2,
  Workflow,
  Compass,
  Filter,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { DATABASE_TABLES } from '../data/hospitalData';
import { MermaidErDiagram } from './MermaidErDiagram';

export interface TableColumn {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  isPfk?: boolean;
  nullable?: boolean;
  fkTarget?: string;
  description?: string;
}

export interface TableNode {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  category: 'Master' | 'Reference' | 'Transactional' | 'Observation';
  color: string;
  headerBg: string;
  headerText: string;
  accentBorder: string;
  description: string;
  records: number;
  columns: TableColumn[];
}

export interface RelationshipLink {
  id: string;
  from: string;
  to: string;
  fromCol: string;
  toCol: string;
  type: '1:N' | '1:1' | 'Composite 1:N';
  label: string;
  color?: string;
}

const DEFAULT_TABLES: TableNode[] = [
  {
    id: 'hospitals',
    name: 'hospitals',
    x: 40,
    y: 50,
    width: 270,
    height: 235,
    category: 'Master',
    color: 'emerald',
    headerBg: 'bg-emerald-700',
    headerText: 'text-emerald-50',
    accentBorder: 'border-emerald-500',
    description: 'Master list of 4 Apollo tertiary facilities in India',
    records: 4,
    columns: [
      { name: 'hospital_id', type: 'INT', isPk: true, nullable: false, description: 'Surrogate primary key for hospital facility' },
      { name: 'hospital_name', type: 'VARCHAR(100)', nullable: false, description: 'Hospital facility name (e.g. Apollo Delhi)' },
      { name: 'city', type: 'VARCHAR(50)', nullable: false, description: 'Metropolitan location' },
      { name: 'state', type: 'VARCHAR(50)', nullable: true, description: 'State / Province' },
      { name: 'total_beds', type: 'INT', nullable: true, description: 'Licensed bed count' },
      { name: 'established_year', type: 'INT', nullable: true, description: 'Founding year' }
    ]
  },
  {
    id: 'departments',
    name: 'departments',
    x: 390,
    y: 50,
    width: 290,
    height: 220,
    category: 'Reference',
    color: 'sky',
    headerBg: 'bg-sky-700',
    headerText: 'text-sky-50',
    accentBorder: 'border-sky-500',
    description: '20 Clinical specialty departments across facilities',
    records: 20,
    columns: [
      { name: 'department_id', type: 'INT', isPk: true, nullable: false, description: 'Department identification code' },
      { name: 'hospital_id', type: 'INT', isPk: true, isFk: true, isPfk: true, nullable: false, fkTarget: 'hospitals.hospital_id', description: 'Parent hospital facility' },
      { name: 'department_name', type: 'VARCHAR(50)', nullable: false, description: 'Specialty ward (Emergency, Cardiology, etc.)' },
      { name: 'total_beds', type: 'INT', nullable: false, description: 'Allocated ward bed capacity' }
    ]
  },
  {
    id: 'doctors',
    name: 'doctors',
    x: 770,
    y: 50,
    width: 280,
    height: 245,
    category: 'Master',
    color: 'indigo',
    headerBg: 'bg-indigo-700',
    headerText: 'text-indigo-50',
    accentBorder: 'border-indigo-500',
    description: '60 Credentialed consultant specialists',
    records: 60,
    columns: [
      { name: 'doctor_id', type: 'INT', isPk: true, nullable: false, description: 'Surrogate primary key for physician' },
      { name: 'doctor_name', type: 'VARCHAR(100)', nullable: false, description: 'Full doctor name with credentials' },
      { name: 'specialty', type: 'VARCHAR(100)', nullable: false, description: 'Certified clinical specialty' },
      { name: 'department_id', type: 'INT', isFk: true, nullable: false, fkTarget: 'departments.department_id', description: 'Assigned clinical department' },
      { name: 'hospital_id', type: 'INT', isFk: true, nullable: false, fkTarget: 'hospitals.hospital_id', description: 'Hospital where privileges are held' }
    ]
  },
  {
    id: 'patients',
    name: 'patients',
    x: 40,
    y: 370,
    width: 270,
    height: 255,
    category: 'Master',
    color: 'amber',
    headerBg: 'bg-amber-700',
    headerText: 'text-amber-50',
    accentBorder: 'border-amber-500',
    description: '500 Longitudinal patient master profiles',
    records: 500,
    columns: [
      { name: 'patient_id', type: 'INT', isPk: true, nullable: false, description: 'Surrogate primary key for patient' },
      { name: 'patient_name', type: 'VARCHAR(100)', nullable: false, description: 'Patient pseudonym' },
      { name: 'date_of_birth', type: 'DATE', nullable: false, description: 'Date of birth' },
      { name: 'gender', type: 'VARCHAR(10)', nullable: false, description: 'Gender classification' },
      { name: 'city', type: 'VARCHAR(50)', nullable: false, description: 'Residence city' },
      { name: 'insurance_type', type: 'VARCHAR(50)', nullable: false, description: 'Payer category' }
    ]
  },
  {
    id: 'admissions',
    name: 'admissions',
    x: 390,
    y: 360,
    width: 310,
    height: 365,
    category: 'Transactional',
    color: 'rose',
    headerBg: 'bg-rose-700',
    headerText: 'text-rose-50',
    accentBorder: 'border-rose-500',
    description: '2,500 Inpatient episodes & bottleneck telemetry',
    records: 2500,
    columns: [
      { name: 'admission_id', type: 'INT', isPk: true, nullable: false, description: 'Primary key identifying admission encounter' },
      { name: 'patient_id', type: 'INT', isFk: true, nullable: false, fkTarget: 'patients.patient_id', description: 'Admitted patient reference' },
      { name: 'hospital_id', type: 'INT', isFk: true, nullable: false, fkTarget: 'hospitals.hospital_id', description: 'Admitting hospital facility' },
      { name: 'department_id', type: 'INT', isFk: true, nullable: false, fkTarget: 'departments.department_id', description: 'Admitting clinical department' },
      { name: 'doctor_id', type: 'INT', isFk: true, nullable: false, fkTarget: 'doctors.doctor_id', description: 'Attending physician in charge' },
      { name: 'admission_date', type: 'DATETIME', nullable: false, description: 'Timestamp when patient entered hospital' },
      { name: 'discharge_date', type: 'DATETIME', nullable: true, description: 'Timestamp when patient discharged' },
      { name: 'admission_type', type: 'VARCHAR(50)', nullable: false, description: 'Emergency, Elective, Urgent, Referral' },
      { name: 'disease', type: 'VARCHAR(100)', nullable: false, description: 'Primary clinical diagnosis' },
      { name: 'wait_time_minutes', type: 'INT', nullable: false, description: 'Triage to doctor examination wait time' },
      { name: 'discharge_status', type: 'VARCHAR(50)', nullable: false, description: 'Discharged, Transferred, Recovered' },
      { name: 'readmission_flag', type: 'TINYINT', nullable: false, description: '1 if returned within 30 days, 0 otherwise' }
    ]
  },
  {
    id: 'bed_occupancy',
    name: 'bed_occupancy',
    x: 770,
    y: 380,
    width: 280,
    height: 255,
    category: 'Observation',
    color: 'purple',
    headerBg: 'bg-purple-700',
    headerText: 'text-purple-50',
    accentBorder: 'border-purple-500',
    description: '7,300 Daily ward capacity observations',
    records: 7300,
    columns: [
      { name: 'occupancy_id', type: 'INT', isPk: true, nullable: false, description: 'Surrogate primary key for daily observation' },
      { name: 'hospital_id', type: 'INT', isFk: true, nullable: false, fkTarget: 'hospitals.hospital_id', description: 'Hospital facility reference' },
      { name: 'department_id', type: 'INT', isFk: true, nullable: false, fkTarget: 'departments.department_id', description: 'Department ward reference' },
      { name: 'occupancy_date', type: 'DATE', nullable: false, description: 'Date of bed census' },
      { name: 'available_beds', type: 'INT', nullable: false, description: 'Unoccupied available beds' },
      { name: 'occupied_beds', type: 'INT', nullable: false, description: 'Active inpatient beds' }
    ]
  }
];

const RELATIONSHIPS: RelationshipLink[] = [
  { id: 'rel-1', from: 'hospitals', to: 'departments', fromCol: 'hospital_id', toCol: 'hospital_id', type: '1:N', label: '1:N operates' },
  { id: 'rel-2', from: 'hospitals', to: 'doctors', fromCol: 'hospital_id', toCol: 'hospital_id', type: '1:N', label: '1:N credentials' },
  { id: 'rel-3', from: 'departments', to: 'doctors', fromCol: 'department_id', toCol: 'department_id', type: '1:N', label: '1:N employs' },
  { id: 'rel-4', from: 'patients', to: 'admissions', fromCol: 'patient_id', toCol: 'patient_id', type: '1:N', label: '1:N undergoes' },
  { id: 'rel-5', from: 'hospitals', to: 'admissions', fromCol: 'hospital_id', toCol: 'hospital_id', type: '1:N', label: '1:N admits' },
  { id: 'rel-6', from: 'departments', to: 'admissions', fromCol: 'department_id', toCol: 'department_id', type: '1:N', label: '1:N treats' },
  { id: 'rel-7', from: 'doctors', to: 'admissions', fromCol: 'doctor_id', toCol: 'doctor_id', type: '1:N', label: '1:N attends' },
  { id: 'rel-8', from: 'hospitals', to: 'bed_occupancy', fromCol: 'hospital_id', toCol: 'hospital_id', type: '1:N', label: '1:N logs' },
  { id: 'rel-9', from: 'departments', to: 'bed_occupancy', fromCol: 'department_id', toCol: 'department_id', type: '1:N', label: '1:N monitors' },
];

export interface ErDiagramVisualizerProps {
  isModal?: boolean;
  onSelectTable?: (name: string) => void;
}

export const ErDiagramVisualizer: React.FC<ErDiagramVisualizerProps> = ({
  isModal = false,
  onSelectTable
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeEngine, setActiveEngine] = useState<'d3' | 'mermaid' | '3nf-spec'>('d3');
  const [tables, setTables] = useState<TableNode[]>(DEFAULT_TABLES);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<{ table: string; col: string } | null>(null);
  const [activeTable, setActiveTable] = useState<string | null>('admissions');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<'3nf-grid' | 'star' | 'horizontal'>('3nf-grid');
  const [showParticleFlow, setShowParticleFlow] = useState<boolean>(true);

  // Apply layout preset
  const applyLayout = (mode: '3nf-grid' | 'star' | 'horizontal') => {
    setLayoutMode(mode);
    setTables(prev => {
      return prev.map(t => {
        if (mode === '3nf-grid') {
          const match = DEFAULT_TABLES.find(d => d.id === t.id);
          return match ? { ...t, x: match.x, y: match.y } : t;
        } else if (mode === 'star') {
          // Admissions in center (450, 260), other 5 in radial orbit
          if (t.id === 'admissions') return { ...t, x: 400, y: 240 };
          if (t.id === 'hospitals') return { ...t, x: 50, y: 50 };
          if (t.id === 'departments') return { ...t, x: 420, y: 40 };
          if (t.id === 'doctors') return { ...t, x: 780, y: 80 };
          if (t.id === 'patients') return { ...t, x: 60, y: 420 };
          if (t.id === 'bed_occupancy') return { ...t, x: 780, y: 420 };
          return t;
        } else {
          // Horizontal flow
          if (t.id === 'hospitals') return { ...t, x: 30, y: 80 };
          if (t.id === 'patients') return { ...t, x: 30, y: 390 };
          if (t.id === 'departments') return { ...t, x: 370, y: 80 };
          if (t.id === 'admissions') return { ...t, x: 370, y: 360 };
          if (t.id === 'doctors') return { ...t, x: 750, y: 80 };
          if (t.id === 'bed_occupancy') return { ...t, x: 750, y: 390 };
          return t;
        }
      });
    });
  };

  // Setup D3 Zoom & Drag handlers
  useEffect(() => {
    if (activeEngine !== 'd3' || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select<SVGGElement>('#zoom-layer');

    // D3 Drag for table nodes
    tables.forEach(table => {
      const nodeEl = svg.select(`#node-${table.id}`);
      if (!nodeEl.empty()) {
        const dragHandler = d3.drag<SVGGElement, unknown>()
          .on('start', function() {
            d3.select(this).raise();
          })
          .on('drag', function(event) {
            const newX = Math.max(10, Math.min(850, event.x));
            const newY = Math.max(10, Math.min(520, event.y));
            setTables(curr => curr.map(item => item.id === table.id ? { ...item, x: newX, y: newY } : item));
          });

        nodeEl.call(dragHandler as any);
      }
    });

  }, [tables, activeEngine]);

  const handleTableClick = (tableName: string) => {
    setActiveTable(tableName);
    if (onSelectTable) {
      onSelectTable(tableName);
    }
  };

  // Calculate dynamic cubic bezier paths between table nodes
  const calculatePath = (rel: RelationshipLink) => {
    const fromTable = tables.find(t => t.id === rel.from);
    const toTable = tables.find(t => t.id === rel.to);
    if (!fromTable || !toTable) return { path: '', midX: 0, midY: 0 };

    // Calculate source and target anchor coordinates based on relative position
    let startX = fromTable.x + fromTable.width;
    let startY = fromTable.y + 60;
    let endX = toTable.x;
    let endY = toTable.y + 60;

    // Adjust anchors for clean geometry
    if (fromTable.x > toTable.x + toTable.width) {
      startX = fromTable.x;
      endX = toTable.x + toTable.width;
    } else if (Math.abs(fromTable.x - toTable.x) < 100) {
      // Stacked vertically
      if (fromTable.y < toTable.y) {
        startX = fromTable.x + fromTable.width / 2;
        startY = fromTable.y + fromTable.height;
        endX = toTable.x + toTable.width / 2;
        endY = toTable.y;
      } else {
        startX = fromTable.x + fromTable.width / 2;
        startY = fromTable.y;
        endX = toTable.x + toTable.width / 2;
        endY = toTable.y + toTable.height;
      }
    }

    // Offset anchors if multiple relations exist
    if (rel.from === 'hospitals' && rel.to === 'doctors') {
      startY = fromTable.y + 110;
      endX = toTable.x + 40;
      endY = toTable.y;
    } else if (rel.from === 'hospitals' && rel.to === 'admissions') {
      startY = fromTable.y + 160;
      endX = toTable.x;
      endY = toTable.y + 120;
    } else if (rel.from === 'hospitals' && rel.to === 'bed_occupancy') {
      startY = fromTable.y + 200;
      endX = toTable.x;
      endY = toTable.y + 180;
    }

    const dx = Math.abs(endX - startX) * 0.5;
    const dy = Math.abs(endY - startY) * 0.5;
    const cx1 = startX < endX ? startX + dx : startX - dx;
    const cy1 = startY;
    const cx2 = startX < endX ? endX - dx : endX + dx;
    const cy2 = endY;

    const path = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    return { path, midX, midY };
  };

  const handleExportSVG = () => {
    const svgEl = document.getElementById('apollo-erd-svg');
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgEl);
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'apollo-hospitals-3nf-er-diagram.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isTableHighlighted = (tableId: string) => {
    if (!hoveredTable && !activeTable && !searchQuery && !hoveredColumn) return true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const t = tables.find(item => item.id === tableId);
      if (!t) return false;
      const matchesName = t.name.toLowerCase().includes(q);
      const matchesCol = t.columns.some(c => c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q));
      return matchesName || matchesCol;
    }
    if (hoveredColumn) {
      if (hoveredColumn.table === tableId) return true;
      const rels = RELATIONSHIPS.filter(r => 
        (r.from === hoveredColumn.table && r.fromCol === hoveredColumn.col && r.to === tableId) ||
        (r.to === hoveredColumn.table && r.toCol === hoveredColumn.col && r.from === tableId)
      );
      return rels.length > 0;
    }
    if (hoveredTable) {
      if (hoveredTable === tableId) return true;
      const connected = RELATIONSHIPS.some(r => 
        (r.from === hoveredTable && r.to === tableId) ||
        (r.to === hoveredTable && r.from === tableId)
      );
      return connected;
    }
    if (activeTable) {
      if (activeTable === tableId) return true;
      const connected = RELATIONSHIPS.some(r => 
        (r.from === activeTable && r.to === tableId) ||
        (r.to === activeTable && r.from === tableId)
      );
      return connected;
    }
    return true;
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Engine & Tooling Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
        {/* Engine Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveEngine('d3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeEngine === 'd3'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>D3 Interactive Graph</span>
          </button>

          <button
            onClick={() => setActiveEngine('mermaid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeEngine === 'mermaid'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Mermaid.js Diagram</span>
          </button>

          <button
            onClick={() => setActiveEngine('3nf-spec')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeEngine === '3nf-spec'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>3NF Normalization Spec</span>
          </button>
        </div>

        {/* Action controls for D3 view */}
        {activeEngine === 'd3' && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Filter */}
            <div className="relative">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Spotlight table or column..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs rounded-lg pl-7 pr-3 py-1 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 w-44"
              />
            </div>

            {/* Layout Preset Selector */}
            <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => applyLayout('3nf-grid')}
                className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                  layoutMode === '3nf-grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Hierarchical 3NF layout"
              >
                3NF Grid
              </button>
              <button
                onClick={() => applyLayout('star')}
                className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                  layoutMode === 'star' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Star Schema Focus"
              >
                Star Schema
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setZoomLevel(z => Math.max(0.6, z - 0.1))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px] text-slate-300">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(z => Math.min(1.6, z + 0.1))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Export SVG */}
            <button
              onClick={handleExportSVG}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{copied ? 'Saved!' : 'Export SVG'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Viewport Content */}
      {activeEngine === 'mermaid' && (
        <MermaidErDiagram onSelectTable={handleTableClick} selectedTable={activeTable || undefined} />
      )}

      {activeEngine === '3nf-spec' && (
        <div className="space-y-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>3NF Relational Database Normalization Architecture</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The Apollo Hospitals database architecture strictly satisfies all requirements of <strong>First Normal Form (1NF)</strong>, <strong>Second Normal Form (2NF)</strong>, and <strong>Third Normal Form (3NF)</strong> to eliminate redundant update anomalies, preserve referential integrity, and maximize SQL join performance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <span className="w-6 h-6 rounded-full bg-amber-950 flex items-center justify-center text-xs border border-amber-800">1NF</span>
                <span>First Normal Form</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                All table attributes contain atomic values with no repeating groups. Every entity utilizes a distinct primary key surrogate (<code className="text-amber-300">hospital_id</code>, <code className="text-amber-300">patient_id</code>, <code className="text-amber-300">doctor_id</code>, <code className="text-amber-300">admission_id</code>).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-sky-400 font-bold">
                <span className="w-6 h-6 rounded-full bg-sky-950 flex items-center justify-center text-xs border border-sky-800">2NF</span>
                <span>Second Normal Form</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Every non-key attribute is fully functionally dependent on the entire primary key. In <code className="text-sky-300">departments(department_id, hospital_id)</code>, ward capacity <code className="text-slate-200">total_beds</code> depends on both facility and ward code.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <span className="w-6 h-6 rounded-full bg-emerald-950 flex items-center justify-center text-xs border border-emerald-800">3NF</span>
                <span>Third Normal Form</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                No transitive dependencies exist. In <code className="text-emerald-300">admissions</code>, doctor attributes (<code className="text-slate-200">specialty</code>) and patient profiles (<code className="text-slate-200">dob, gender</code>) are decoupled into distinct reference tables.
              </p>
            </div>
          </div>

          {/* Relational Foreign Key Integrity Matrix */}
          <div className="pt-2">
            <h4 className="font-bold text-xs text-slate-200 mb-2 flex items-center space-x-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Foreign Key Referential Integrity Matrix</span>
            </h4>
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="px-3 py-2">Source Table</th>
                    <th className="px-3 py-2">FK Column</th>
                    <th className="px-3 py-2">Cardinality</th>
                    <th className="px-3 py-2">Target Table</th>
                    <th className="px-3 py-2">Referenced PK</th>
                    <th className="px-3 py-2">Integrity Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {RELATIONSHIPS.map(rel => (
                    <tr key={rel.id} className="hover:bg-slate-800/40">
                      <td className="px-3 py-2 font-bold text-rose-300">{rel.to}</td>
                      <td className="px-3 py-2 text-sky-300">{rel.toCol}</td>
                      <td className="px-3 py-2 text-indigo-300 font-bold">{rel.type}</td>
                      <td className="px-3 py-2 font-bold text-emerald-300">{rel.from}</td>
                      <td className="px-3 py-2 text-amber-300">{rel.fromCol}</td>
                      <td className="px-3 py-2 text-slate-400 font-sans">ON DELETE RESTRICT</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeEngine === 'd3' && (
        <div className="space-y-3">
          {/* SVG Canvas Container */}
          <div 
            ref={containerRef}
            className={`relative overflow-auto bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-4 ${
              isModal ? 'h-[680px]' : 'min-h-[520px] max-h-[620px]'
            }`}
          >
            <div 
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
              className="w-full flex justify-center py-2"
            >
              <svg
                ref={svgRef}
                id="apollo-erd-svg"
                viewBox="0 0 1100 760"
                className="w-[1100px] h-[760px] max-w-none select-none"
              >
                <defs>
                  {/* Grid background pattern */}
                  <pattern id="erd-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                  </pattern>

                  {/* Crow's foot arrow marker */}
                  <marker
                    id="crow-foot-marker"
                    viewBox="0 0 14 14"
                    refX="12"
                    refY="7"
                    markerWidth="9"
                    markerHeight="9"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 12 7 L 0 13 M 0 7 L 12 7" stroke="#38bdf8" strokeWidth="1.6" fill="none" />
                  </marker>

                  <marker
                    id="crow-foot-hover"
                    viewBox="0 0 14 14"
                    refX="12"
                    refY="7"
                    markerWidth="10"
                    markerHeight="10"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 12 7 L 0 13 M 0 7 L 12 7" stroke="#60a5fa" strokeWidth="2.2" fill="none" />
                  </marker>

                  {/* Shadow filter */}
                  <filter id="erd-shadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.6" />
                  </filter>
                  
                  <filter id="erd-glow" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Canvas Background */}
                <rect width="1100" height="760" fill="#090d16" />
                <rect width="1100" height="760" fill="url(#erd-grid)" />

                {/* Layer for links */}
                <g id="links-layer">
                  {RELATIONSHIPS.map((rel) => {
                    const { path, midX, midY } = calculatePath(rel);
                    const isRelActive = 
                      (hoveredTable === rel.from || hoveredTable === rel.to) ||
                      (activeTable === rel.from || activeTable === rel.to) ||
                      (hoveredColumn && (
                        (hoveredColumn.table === rel.from && hoveredColumn.col === rel.fromCol) ||
                        (hoveredColumn.table === rel.to && hoveredColumn.col === rel.toCol)
                      ));

                    return (
                      <g key={rel.id} className="transition-all duration-300">
                        {/* Glow underlay if active */}
                        {isRelActive && (
                          <path
                            d={path}
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="6"
                            strokeOpacity="0.25"
                            strokeLinecap="round"
                          />
                        )}

                        {/* Main Relationship Line */}
                        <path
                          d={path}
                          fill="none"
                          stroke={isRelActive ? '#38bdf8' : '#334155'}
                          strokeWidth={isRelActive ? 2.5 : 1.5}
                          strokeDasharray={isRelActive ? 'none' : '5 3'}
                          markerEnd={isRelActive ? 'url(#crow-foot-hover)' : 'url(#crow-foot-marker)'}
                        />

                        {/* Relationship Label Badge */}
                        <g transform={`translate(${midX - 32}, ${midY - 10})`}>
                          <rect
                            width="64"
                            height="20"
                            rx="5"
                            fill={isRelActive ? '#0369a1' : '#1e293b'}
                            stroke={isRelActive ? '#38bdf8' : '#475569'}
                            strokeWidth="1"
                          />
                          <text
                            x="32"
                            y="14"
                            fill="#f8fafc"
                            fontSize="9"
                            fontWeight="bold"
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            {rel.type}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>

                {/* Layer for Table Nodes */}
                <g id="zoom-layer">
                  {tables.map((t) => {
                    const isSelected = activeTable === t.id;
                    const isHovered = hoveredTable === t.id;
                    const isHighlighted = isTableHighlighted(t.id);
                    const opacity = isHighlighted ? 1 : 0.25;

                    return (
                      <g
                        key={t.id}
                        id={`node-${t.id}`}
                        transform={`translate(${t.x}, ${t.y})`}
                        opacity={opacity}
                        className="cursor-move transition-opacity duration-200"
                        onMouseEnter={() => setHoveredTable(t.id)}
                        onMouseLeave={() => setHoveredTable(null)}
                        onClick={() => handleTableClick(t.id)}
                        filter="url(#erd-shadow)"
                      >
                        {/* Table Outer Container */}
                        <rect
                          width={t.width}
                          height={t.height}
                          rx="12"
                          fill="#0f172a"
                          stroke={isSelected ? '#38bdf8' : isHovered ? '#60a5fa' : '#334155'}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                        />

                        {/* Table Header Container */}
                        <rect
                          width={t.width}
                          height="38"
                          rx="12"
                          fill={
                            t.color === 'emerald' ? '#065f46' :
                            t.color === 'sky' ? '#0369a1' :
                            t.color === 'indigo' ? '#4338ca' :
                            t.color === 'amber' ? '#b45309' :
                            t.color === 'rose' ? '#be123c' :
                            '#7e22ce'
                          }
                        />
                        {/* Flatten bottom curve of header */}
                        <rect
                          y="24"
                          width={t.width}
                          height="14"
                          fill={
                            t.color === 'emerald' ? '#065f46' :
                            t.color === 'sky' ? '#0369a1' :
                            t.color === 'indigo' ? '#4338ca' :
                            t.color === 'amber' ? '#b45309' :
                            t.color === 'rose' ? '#be123c' :
                            '#7e22ce'
                          }
                        />

                        {/* Table Header Text */}
                        <text
                          x="14"
                          y="24"
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="800"
                          fontFamily="monospace"
                        >
                          {t.name.toUpperCase()}
                        </text>
                        
                        {/* Category & Record count badge */}
                        <text
                          x={t.width - 12}
                          y="23"
                          fill="#e2e8f0"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="end"
                          fontFamily="sans-serif"
                        >
                          {t.records.toLocaleString()} rows
                        </text>

                        {/* Header separator line */}
                        <line x1="0" y1="38" x2={t.width} y2="38" stroke="#334155" strokeWidth="1" />

                        {/* Columns List */}
                        {t.columns.map((col, cIdx) => {
                          const rowY = 56 + cIdx * 23;
                          const isColHovered = hoveredColumn?.table === t.id && hoveredColumn?.col === col.name;
                          const isMatchingSearch = searchQuery && col.name.toLowerCase().includes(searchQuery.toLowerCase());

                          return (
                            <g 
                              key={col.name}
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredColumn({ table: t.id, col: col.name });
                              }}
                              onMouseLeave={() => setHoveredColumn(null)}
                              className="cursor-pointer"
                            >
                              {/* Row highlight or zebra background */}
                              {isColHovered || isMatchingSearch ? (
                                <rect
                                  x="2"
                                  y={rowY - 14}
                                  width={t.width - 4}
                                  height="21"
                                  rx="4"
                                  fill="#1e293b"
                                  stroke="#38bdf8"
                                  strokeWidth="1"
                                />
                              ) : cIdx % 2 === 1 ? (
                                <rect
                                  x="2"
                                  y={rowY - 14}
                                  width={t.width - 4}
                                  height="21"
                                  fill="rgba(255, 255, 255, 0.02)"
                                />
                              ) : null}

                              {/* Key badges (PK / FK / PFK) */}
                              {col.isPfk ? (
                                <g transform={`translate(10, ${rowY - 11})`}>
                                  <rect width="24" height="13" rx="3" fill="#831843" stroke="#f472b6" strokeWidth="0.8" />
                                  <text x="12" y="10" fill="#fbcfe8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                    PFK
                                  </text>
                                </g>
                              ) : col.isPk ? (
                                <g transform={`translate(10, ${rowY - 11})`}>
                                  <rect width="18" height="13" rx="3" fill="#78350f" stroke="#fbbf24" strokeWidth="0.8" />
                                  <text x="9" y="10" fill="#fef3c7" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                    PK
                                  </text>
                                </g>
                              ) : col.isFk ? (
                                <g transform={`translate(10, ${rowY - 11})`}>
                                  <rect width="18" height="13" rx="3" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="0.8" />
                                  <text x="9" y="10" fill="#e0f2fe" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                    FK
                                  </text>
                                </g>
                              ) : (
                                <circle cx="18" cy={rowY - 4} r="2" fill="#475569" />
                              )}

                              {/* Column Name */}
                              <text
                                x={col.isPfk ? "40" : (col.isPk || col.isFk ? "34" : "28")}
                                y={rowY}
                                fill={col.isPk ? '#f8fafc' : isMatchingSearch ? '#38bdf8' : '#cbd5e1'}
                                fontSize="11"
                                fontWeight={col.isPk || isColHovered ? '700' : '500'}
                                fontFamily="monospace"
                              >
                                {col.name}
                              </text>

                              {/* Column Data Type */}
                              <text
                                x={t.width - 12}
                                y={rowY}
                                fill={col.isPk ? '#fbbf24' : '#94a3b8'}
                                fontSize="9.5"
                                fontFamily="monospace"
                                textAnchor="end"
                              >
                                {col.type}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* Interactive Legend & Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <div className="bg-slate-900 text-slate-300 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
              <span className="font-mono text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800 text-[10px]">PK</span>
              <span className="truncate">Primary Key</span>
            </div>
            <div className="bg-slate-900 text-slate-300 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
              <span className="font-mono text-sky-400 font-bold px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800 text-[10px]">FK</span>
              <span className="truncate">Foreign Key</span>
            </div>
            <div className="bg-slate-900 text-slate-300 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
              <span className="font-mono text-pink-400 font-bold px-1.5 py-0.5 rounded bg-pink-950 border border-pink-800 text-[10px]">PFK</span>
              <span className="truncate">Composite PK/FK</span>
            </div>
            <div className="bg-slate-900 text-slate-300 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
              <span className="font-mono text-indigo-400 font-bold px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-[10px]">1:N</span>
              <span className="truncate">One-to-Many</span>
            </div>
            <div className="bg-slate-900 text-slate-300 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">3NF Enforced</span>
            </div>
            <div className="bg-slate-900 text-slate-300 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
              <Workflow className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="truncate">Draggable Nodes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
