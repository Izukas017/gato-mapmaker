import React, { useState } from 'react';
import { RotateCcw, Trash2, X } from 'lucide-react';
import { exportMap } from '../engine/exporter';
import { TERRAIN_MATERIALS } from '../engine/textures';
import { clearSavedMap, useMapStore } from '../store/useMapStore';
import { useUiPrefs } from '../store/useUiPrefs';
import type { TerrainMaterialId } from '../types/map';

interface NewMapDialogProps {
  onClose: () => void;
}

export function NewMapDialog({ onClose }: NewMapDialogProps) {
  const createNewMap = useMapStore((s) => s.createNewMap);
  const [name, setName] = useState('Mi Nuevo Mapa');
  const [width, setWidth] = useState(24);
  const [height, setHeight] = useState(24);
  const [terrain, setTerrain] = useState<TerrainMaterialId>('grass');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewMap(
      name.trim() || 'Nuevo Mapa',
      Math.max(8, Math.min(80, width)),
      Math.max(8, Math.min(80, height)),
      terrain
    );
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="modal-header">
          <span>Crear Nuevo Mapa</span>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="control-row">
            <label htmlFor="new-map-name">Nombre</label>
            <input
              id="new-map-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: 220 }}
            />
          </div>
          <div className="control-row">
            <label htmlFor="new-map-w">Ancho (casillas)</label>
            <input
              id="new-map-w"
              type="number"
              min={8}
              max={80}
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value, 10) || 20)}
              style={{ width: 90 }}
            />
          </div>
          <div className="control-row">
            <label htmlFor="new-map-h">Alto (casillas)</label>
            <input
              id="new-map-h"
              type="number"
              min={8}
              max={80}
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value, 10) || 20)}
              style={{ width: 90 }}
            />
          </div>
          <div className="control-row">
            <label htmlFor="new-map-terrain">Terreno Inicial</label>
            <select
              id="new-map-terrain"
              value={terrain}
              onChange={(e) => setTerrain(e.target.value as TerrainMaterialId)}
              style={{ width: 180 }}
            >
              {TERRAIN_MATERIALS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Crear Mapa
          </button>
        </div>
      </form>
    </div>
  );
}

interface ExportDialogProps {
  onClose: () => void;
}

export function ExportDialog({ onClose }: ExportDialogProps) {
  const doc = useMapStore((s) => s.doc);
  const defaultExportPpg = useUiPrefs((s) => s.defaultExportPpg);
  const [format, setFormat] = useState<'png' | 'webp' | 'dd2vtt'>('png');
  const [ppg, setPpg] = useState<number>(defaultExportPpg);
  const [includeGrid, setIncludeGrid] = useState(true);
  const [includeLighting, setIncludeLighting] = useState(true);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportMap(doc, { format, ppg, includeGrid, includeLighting });
      onClose();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>Exportar Mapa</span>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="control-row">
            <span>Formato</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'png' | 'webp' | 'dd2vtt')}
              style={{ width: 220 }}
            >
              <option value="png">Imagen PNG (Alta calidad)</option>
              <option value="webp">Imagen WebP (Ligera para VTT)</option>
              <option value="dd2vtt">Universal VTT (.dd2vtt — Foundry/Roll20)</option>
            </select>
          </div>

          <div className="control-row">
            <span>Resolución (PPI)</span>
            <select
              value={ppg}
              onChange={(e) => setPpg(parseInt(e.target.value, 10))}
              style={{ width: 220 }}
            >
              <option value={70}>70 px/casilla (Roll20 estándar)</option>
              <option value={100}>100 px/casilla (Foundry VTT)</option>
              <option value={140}>140 px/casilla (HD / Impresión)</option>
            </select>
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Resolución final: <b>{doc.width * ppg} × {doc.height * ppg} px</b>
          </div>

          <button
            type="button"
            className={`toggle-btn ${includeGrid ? 'active' : ''}`}
            onClick={() => setIncludeGrid(!includeGrid)}
          >
            <span>Incluir Cuadrícula</span>
            <span>{includeGrid ? 'SÍ' : 'NO'}</span>
          </button>

          <button
            type="button"
            className={`toggle-btn ${includeLighting ? 'active' : ''}`}
            onClick={() => setIncludeLighting(!includeLighting)}
          >
            <span>Incluir Iluminación y Sombras</span>
            <span>{includeLighting ? 'SÍ' : 'NO'}</span>
          </button>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={exporting}
            onClick={handleExport}
          >
            {exporting ? 'Exportando...' : 'Descargar'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface SettingsDialogProps {
  onClose: () => void;
}

export function SettingsDialog({ onClose }: SettingsDialogProps) {
  const prefs = useUiPrefs();
  const doc = useMapStore((s) => s.doc);
  const updateGrid = useMapStore((s) => s.updateGrid);
  const loadPreset = useMapStore((s) => s.loadPreset);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ width: 500, maxHeight: '86vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span>Ajustes del Editor</span>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ overflowY: 'auto' }}>
          <div className="section-label" style={{ marginBottom: 0 }}>
            Interfaz y Paneles
          </div>

          <button
            type="button"
            className={`toggle-btn ${prefs.leftPanelOpen ? 'active' : ''}`}
            onClick={() => prefs.setPrefs({ leftPanelOpen: !prefs.leftPanelOpen })}
          >
            <span>Mostrar panel izquierdo (Herramientas)</span>
            <span>{prefs.leftPanelOpen ? 'SÍ' : 'NO'}</span>
          </button>

          <div className="control-row">
            <span>Ancho panel izquierdo</span>
            <input
              type="range"
              min={220}
              max={520}
              step={8}
              value={prefs.leftPanelWidth}
              onChange={(e) =>
                prefs.setPrefs({ leftPanelWidth: parseInt(e.target.value, 10) })
              }
            />
            <span className="control-val">{prefs.leftPanelWidth}px</span>
          </div>

          <button
            type="button"
            className={`toggle-btn ${prefs.rightPanelOpen ? 'active' : ''}`}
            onClick={() => prefs.setPrefs({ rightPanelOpen: !prefs.rightPanelOpen })}
          >
            <span>Mostrar panel derecho (Inspector y Capas)</span>
            <span>{prefs.rightPanelOpen ? 'SÍ' : 'NO'}</span>
          </button>

          <div className="control-row">
            <span>Ancho panel derecho</span>
            <input
              type="range"
              min={220}
              max={520}
              step={8}
              value={prefs.rightPanelWidth}
              onChange={(e) =>
                prefs.setPrefs({ rightPanelWidth: parseInt(e.target.value, 10) })
              }
            />
            <span className="control-val">{prefs.rightPanelWidth}px</span>
          </div>

          <div className="control-row">
            <span>Columnas de objetos</span>
            <div className="chip-row">
              {([2, 3, 4] as const).map((cols) => (
                <button
                  key={cols}
                  type="button"
                  className={`chip ${prefs.propColumns === cols ? 'active' : ''}`}
                  onClick={() => prefs.setPrefs({ propColumns: cols })}
                >
                  {cols === 2 ? 'Grande (2)' : cols === 3 ? 'Normal (3)' : 'Compacto (4)'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`toggle-btn ${prefs.showCanvasHints ? 'active' : ''}`}
            onClick={() => prefs.setPrefs({ showCanvasHints: !prefs.showCanvasHints })}
          >
            <span>Mostrar barra de ayudas sobre el lienzo</span>
            <span>{prefs.showCanvasHints ? 'SÍ' : 'NO'}</span>
          </button>

          <button
            type="button"
            className={`toggle-btn ${prefs.alwaysShowLightHandles ? 'active' : ''}`}
            onClick={() =>
              prefs.setPrefs({ alwaysShowLightHandles: !prefs.alwaysShowLightHandles })
            }
          >
            <span>Mostrar siempre iconos de luces</span>
            <span>{prefs.alwaysShowLightHandles ? 'SÍ' : 'NO'}</span>
          </button>

          <div className="section-label" style={{ marginTop: 6, marginBottom: 0 }}>
            Lienzo, Zoom y Exportación
          </div>

          <div className="control-row">
            <span>Velocidad de zoom</span>
            <select
              value={prefs.zoomSpeed}
              onChange={(e) =>
                prefs.setPrefs({
                  zoomSpeed: e.target.value as 'slow' | 'normal' | 'fast',
                })
              }
              style={{ width: 170 }}
            >
              <option value="slow">Suave (preciso)</option>
              <option value="normal">Normal</option>
              <option value="fast">Rápido</option>
            </select>
          </div>

          <div className="control-row">
            <span>Resolución exportación por defecto</span>
            <select
              value={prefs.defaultExportPpg}
              onChange={(e) =>
                prefs.setPrefs({
                  defaultExportPpg: parseInt(e.target.value, 10) as 70 | 100 | 140,
                })
              }
              style={{ width: 170 }}
            >
              <option value={70}>70 px/casilla (Roll20)</option>
              <option value={100}>100 px/casilla (Foundry)</option>
              <option value={140}>140 px/casilla (HD)</option>
            </select>
          </div>

          <div className="section-label" style={{ marginTop: 6, marginBottom: 0 }}>
            Cuadrícula del Mapa Actual
          </div>

          <button
            type="button"
            className={`toggle-btn ${doc.grid.snap ? 'active' : ''}`}
            onClick={() => updateGrid({ snap: !doc.grid.snap })}
          >
            <span>Seguir cuadrícula al dibujar y mover</span>
            <span>{doc.grid.snap ? 'SÍ' : 'NO'}</span>
          </button>

          <button
            type="button"
            className={`toggle-btn ${prefs.alignToObjects ? 'active' : ''}`}
            onClick={() => prefs.setPrefs({ alignToObjects: !prefs.alignToObjects })}
          >
            <span>Alinear objetos entre sí (guías sin cuadrícula)</span>
            <span>{prefs.alignToObjects ? 'SÍ' : 'NO'}</span>
          </button>

          <div className="control-row">
            <span>Tipo de cuadrícula</span>
            <select
              value={doc.grid.type}
              onChange={(e) => updateGrid({ type: e.target.value as 'square' | 'hex' })}
              style={{ width: 170 }}
            >
              <option value="square">Cuadrada</option>
              <option value="hex">Hexagonal</option>
            </select>
          </div>

          <div className="control-row">
            <span>Subdivisión del imán</span>
            <select
              value={doc.grid.snapSubdivision}
              onChange={(e) =>
                updateGrid({
                  snapSubdivision: parseInt(e.target.value, 10) as 1 | 2 | 4,
                })
              }
              style={{ width: 170 }}
            >
              <option value={1}>1 casilla</option>
              <option value={2}>1/2 casilla</option>
              <option value={4}>1/4 casilla</option>
            </select>
          </div>

          <div className="control-row">
            <span>Color y opacidad de grilla</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="color"
                value={doc.grid.color}
                onChange={(e) => updateGrid({ color: e.target.value })}
              />
              <input
                type="range"
                min={0.05}
                max={0.8}
                step={0.05}
                value={doc.grid.opacity}
                onChange={(e) => updateGrid({ opacity: parseFloat(e.target.value) })}
                style={{ width: 100 }}
              />
              <span className="control-val">{Math.round(doc.grid.opacity * 100)}%</span>
            </div>
          </div>

          <div className="section-label" style={{ marginTop: 6, marginBottom: 0 }}>
            Almacenamiento Local
          </div>

          <button
            type="button"
            className={`toggle-btn ${prefs.autoSaveEnabled ? 'active' : ''}`}
            onClick={() => prefs.setPrefs({ autoSaveEnabled: !prefs.autoSaveEnabled })}
          >
            <span>Auto-guardar último mapa en navegador</span>
            <span>{prefs.autoSaveEnabled ? 'SÍ' : 'NO'}</span>
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              onClick={() => prefs.resetPrefs()}
            >
              <RotateCcw size={13} /> Restablecer ajustes
            </button>
            <button
              type="button"
              className="btn-danger"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              onClick={() => {
                clearSavedMap();
                loadPreset('blank');
              }}
            >
              <Trash2 size={13} /> Borrar mapa guardado
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
