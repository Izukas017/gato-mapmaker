import React, { useState } from 'react';
import { X } from 'lucide-react';
import { exportMap } from '../engine/exporter';
import { TERRAIN_MATERIALS } from '../engine/textures';
import { useMapStore } from '../store/useMapStore';
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
  const [format, setFormat] = useState<'png' | 'webp' | 'dd2vtt'>('png');
  const [ppg, setPpg] = useState(140);
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
