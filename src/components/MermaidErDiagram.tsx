import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Eye, 
  Palette, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

interface MermaidErDiagramProps {
  onSelectTable?: (tableName: string) => void;
  selectedTable?: string;
}

export const MERMAID_ERD_CODE = `erDiagram
    HOSPITALS ||--o{ DEPARTMENTS : "operates (1:N)"
    HOSPITALS ||--o{ DOCTORS : "credentials (1:N)"
    DEPARTMENTS ||--o{ DOCTORS : "employs (1:N)"
    PATIENTS ||--o{ ADMISSIONS : "undergoes (1:N)"
    HOSPITALS ||--o{ ADMISSIONS : "admits (1:N)"
    DEPARTMENTS ||--o{ ADMISSIONS : "treats (1:N)"
    DOCTORS ||--o{ ADMISSIONS : "attends (1:N)"
    HOSPITALS ||--o{ BED_OCCUPANCY : "records (1:N)"
    DEPARTMENTS ||--o{ BED_OCCUPANCY : "monitors (1:N)"

    HOSPITALS {
        int hospital_id PK "Surrogate PK"
        string hospital_name "Facility Name"
        string city "Metro Location"
    }

    DEPARTMENTS {
        int department_id PK "Dept Code"
        int hospital_id PK,FK "Parent Facility"
        string department_name "Clinical Ward"
        int total_beds "Allocated Beds"
    }

    PATIENTS {
        int patient_id PK "Surrogate PK"
        string patient_name "Patient Master"
        date date_of_birth "Birth Date"
        string gender "Gender Cohort"
        string city "Residence City"
        string insurance_type "Payer Type"
    }

    DOCTORS {
        int doctor_id PK "Physician PK"
        string doctor_name "Consultant Name"
        string specialty "Medical Specialty"
        int department_id FK "Ward Assignment"
        int hospital_id FK "Clinical Privileges"
    }

    ADMISSIONS {
        int admission_id PK "Encounter PK"
        int patient_id FK "Patient Record"
        int hospital_id FK "Admitting Facility"
        int department_id FK "Care Unit"
        int doctor_id FK "Attending Physician"
        datetime admission_date "Arrival Timestamp"
        datetime discharge_date "Discharge Timestamp"
        string admission_type "Emergency/Elective"
        string disease "Presenting Diagnosis"
        int wait_time_minutes "Triage Wait Time"
        string discharge_status "Discharge State"
        int readmission_flag "30-Day Bounceback"
    }

    BED_OCCUPANCY {
        int occupancy_id PK "Observation PK"
        int hospital_id FK "Facility Reference"
        int department_id FK "Department Ward"
        date occupancy_date "Observation Date"
        int available_beds "Unoccupied Capacity"
        int occupied_beds "Inpatient Active"
    }`;

export const MermaidErDiagram: React.FC<MermaidErDiagramProps> = ({
  onSelectTable,
  selectedTable
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'forest' | 'neutral' | 'default'>('dark');
  const [showCode, setShowCode] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      try {
        setRenderError(null);
        mermaid.initialize({
          startOnLoad: false,
          theme: theme,
          securityLevel: 'loose',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          er: {
            useMaxWidth: false,
            diagramPadding: 24,
            fontSize: 12,
            entityPadding: 16
          }
        });

        const id = `mermaid-erd-${Date.now()}`;
        const { svg } = await mermaid.render(id, MERMAID_ERD_CODE);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setRenderError(err?.message || 'Failed to render Mermaid diagram');
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [theme]);

  // Hook click events on rendered SVG entities
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    const entities = containerRef.current.querySelectorAll('g.entityBox, g[id^="entity-"]');
    entities.forEach(el => {
      const textEl = el.querySelector('text');
      const tableName = textEl?.textContent?.trim().toLowerCase();
      if (tableName) {
        el.setAttribute('style', 'cursor: pointer; transition: filter 0.2s;');
        el.addEventListener('click', () => {
          if (onSelectTable) {
            onSelectTable(tableName);
          }
        });
      }
    });
  }, [svgContent, onSelectTable]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(MERMAID_ERD_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'apollo-hospitals-mermaid-3nf-erd.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* Mermaid Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900 text-white rounded-xl text-xs border border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-indigo-950/80 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-800/60 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mermaid.js Standard ERD Engine</span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            3NF Relational Grammar • Crow's Foot Notation
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Selector */}
          <div className="flex items-center space-x-1 bg-slate-800 px-2 py-1 rounded-lg">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-400 mr-1">Theme:</span>
            {(['dark', 'forest', 'neutral', 'default'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  theme === t
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-slate-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(1.6, z + 0.1))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Code */}
          <button
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              showCode 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showCode ? 'Hide Syntax' : 'View Syntax'}</span>
          </button>

          {/* Download SVG */}
          <button
            onClick={handleDownloadSvg}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save SVG</span>
          </button>
        </div>
      </div>

      {/* Syntax Drawer if Open */}
      {showCode && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs relative space-y-2">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
            <span className="font-mono font-bold text-sky-400">Mermaid erDiagram Source</span>
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Syntax'}</span>
            </button>
          </div>
          <pre className="text-slate-300 font-mono text-[11px] overflow-x-auto max-h-56 p-2 bg-slate-900/60 rounded-lg">
            {MERMAID_ERD_CODE}
          </pre>
        </div>
      )}

      {/* Mermaid SVG Container */}
      <div 
        className="relative overflow-auto bg-slate-950 rounded-xl border border-slate-800 p-6 min-h-[500px] flex items-center justify-center"
      >
        {renderError ? (
          <div className="text-rose-400 text-xs font-mono p-4 text-center">
            <p className="font-bold mb-1">Mermaid Rendering Issue:</p>
            <p>{renderError}</p>
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className="flex items-center justify-center select-none w-full"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>

      {/* Bottom Hint */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 px-1">
        <span>Click any table entity to inspect columns, constraints, and data definitions.</span>
        <span className="font-mono text-indigo-400">Mermaid v11.x Strict 3NF Spec</span>
      </div>
    </div>
  );
};
