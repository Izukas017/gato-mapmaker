import React, { useRef, useState } from 'react';
import {
  Download,
  FilePlus,
  FolderOpen,
  Grid,
  Magnet,
  Map as MapIcon,
  PanelLeft,
  PanelRight,
  Redo2,
  Save,
  Settings,
  Sun,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { saveProjectJson } from '../engine/exporter';
import { useMapStore } from '../store/useMapStore';
import { useUiPrefs } from '../store/useUiPrefs';
import type { MapDocument } from '../types/map';

interface TopBarProps {
  onOpenNewDialog: () => void;
  onOpenExportDialog: () => void;
  onOpenSettingsDialog: () => void;
}

export function TopBar({
  onOpenNewDialog,
  onOpenExportDialog,
  onOpenSettingsDialog,
}: TopBarProps) {
  const doc = useMapStore((s) => s.doc);
  const leftPanelOpen = useUiPrefs((s) => s.leftPanelOpen);
  const toggleLeftPanel = useUiPrefs((s) => s.toggleLeftPanel);
  const rightPanelOpen = useUiPrefs((s) => s.rightPanelOpen);
  const toggleRightPanel = useUiPrefs((s) => s.toggleRightPanel);
  const pastCount = useMapStore((s) => s.past.length);
  const futureCount = useMapStore((s) => s.future.length);
  const zoom = useMapStore((s) => s.zoom);
  const panX = useMapStore((s) => s.panX);
  const panY = useMapStore((s) => s.panY);

  const undo = useMapStore((s) => s.undo);
  const redo = useMapStore((s) => s.redo);
  const loadPreset = useMapStore((s) => s.loadPreset);
  const loadDocument = useMapStore((s) => s.loadDocument);
  const setMapName = useMapStore((s) => s.setMapName);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const updateGrid = useMapStore((s) => s.updateGrid);
  const setViewport = useMapStore((s) => s.setViewport);

  const [menuOpen, setMenuOpen] = useState<'file' | 'presets' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as MapDocument;
        if (parsed && Array.isArray(parsed.levels) && parsed.width > 0) {
          loadDocument(parsed);
        }
      } catch {
        alert('No se pudo leer el archivo .ddraft.json');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="topbar">
      <div className="topbar-group">
        <div className="brand-mark">
          <div className="brand-badge">G</div>
          <span>Gato MapMaker</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>v0.2.4</span>
        </div>

        <div className="dropdown-wrap">
          <button
            className="topbar-btn"
            onClick={() => setMenuOpen(menuOpen === 'file' ? null : 'file')}
          >
            Archivo
          </button>
          {menuOpen === 'file' && (
            <div className="dropdown-menu" onMouseLeave={() => setMenuOpen(null)}>
              <button
                className="dropdown-item"
                onClick={() => {
                  setMenuOpen(null);
                  onOpenNewDialog();
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FilePlus size={14} /> Nuevo mapa...
                </span>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  setMenuOpen(null);
                  fileInputRef.current?.click();
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FolderOpen size={14} /> Abrir proyecto (.ddraft.json)
                </span>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  setMenuOpen(null);
                  saveProjectJson(doc);
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Save size={14} /> Guardar proyecto
                </span>
              </button>
              <div className="dropdown-sep" />
              <button
                className="dropdown-item"
                onClick={() => {
                  setMenuOpen(null);
                  onOpenExportDialog();
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Download size={14} /> Exportar PNG / WebP / VTT
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="dropdown-wrap">
          <button
            className="topbar-btn"
            onClick={() => setMenuOpen(menuOpen === 'presets' ? null : 'presets')}
          >
            <MapIcon size={14} />
            Plantillas
          </button>
          {menuOpen === 'presets' && (
            <div className="dropdown-menu" onMouseLeave={() => setMenuOpen(null)}>
              <button
                className="dropdown-item"
                onClick={() => {
                  loadPreset('sanctuary');
                  setMenuOpen(null);
                }}
              >
                Santuario del Patio (Templo)
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  loadPreset('quarter');
                  setMenuOpen(null);
                }}
              >
                Barrio Empedrado (Ciudad)
              </button>
              <div className="dropdown-sep" />
              <button
                className="dropdown-item"
                onClick={() => {
                  loadPreset('blank');
                  setMenuOpen(null);
                }}
              >
                Lienzo en blanco (Hierba)
              </button>
            </div>
          )}
        </div>

        <div className="topbar-sep" />

        <button
          className="topbar-btn"
          onClick={undo}
          disabled={pastCount === 0}
          title="Deshacer (Ctrl+Z)"
          aria-label="Deshacer"
        >
          <Undo2 size={14} />
        </button>
        <button
          className="topbar-btn"
          onClick={redo}
          disabled={futureCount === 0}
          title="Rehacer (Ctrl+Y)"
          aria-label="Rehacer"
        >
          <Redo2 size={14} />
        </button>

        <div className="topbar-sep" />

        <input
          type="text"
          value={doc.name}
          onChange={(e) => setMapName(e.target.value)}
          aria-label="Nombre del mapa"
          style={{ width: 170, fontWeight: 500 }}
        />
      </div>

      <div className="topbar-group">
        <button
          className={`topbar-btn ${doc.layers.grid ? 'active' : ''}`}
          onClick={() => toggleLayer('grid')}
          title="Mostrar u ocultar cuadrícula"
        >
          <Grid size={14} />
          Grilla
        </button>

        <button
          className={`topbar-btn ${doc.grid.snap ? 'active' : ''}`}
          onClick={() => updateGrid({ snap: !doc.grid.snap })}
          title="Seguir o no seguir la cuadrícula (S)"
        >
          <Magnet size={14} />
          Seguir Grilla
        </button>

        <button
          className={`topbar-btn ${doc.layers.lighting ? 'active' : ''}`}
          onClick={() => toggleLayer('lighting')}
          title="Activar o desactivar iluminación dinámica"
        >
          <Sun size={14} />
          Luces
        </button>

        <div className="topbar-sep" />

        <button
          className="topbar-btn"
          onClick={() => setViewport(Math.max(0.2, zoom / 1.15), panX, panY)}
          aria-label="Alejar"
        >
          <ZoomOut size={14} />
        </button>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', minWidth: 38, textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          className="topbar-btn"
          onClick={() => setViewport(Math.min(3.5, zoom * 1.15), panX, panY)}
          aria-label="Acercar"
        >
          <ZoomIn size={14} />
        </button>

        <div className="topbar-sep" />

        <button
          className={`topbar-btn ${leftPanelOpen ? 'active' : ''}`}
          onClick={toggleLeftPanel}
          title="Abrir o cerrar panel izquierdo (Herramientas)"
        >
          <PanelLeft size={14} />
          Panel Izq.
        </button>

        <button
          className={`topbar-btn ${rightPanelOpen ? 'active' : ''}`}
          onClick={toggleRightPanel}
          title="Abrir o cerrar panel derecho (Inspector)"
        >
          <PanelRight size={14} />
          Panel Der.
        </button>

        <button
          className="topbar-btn"
          onClick={onOpenSettingsDialog}
          title="Ajustes del editor"
        >
          <Settings size={14} />
          Ajustes
        </button>

        <button className="topbar-btn primary" onClick={onOpenExportDialog}>
          <Download size={14} />
          Exportar
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.ddraft.json"
        style={{ display: 'none' }}
        onChange={handleOpenFile}
      />
    </header>
  );
}
