import React from 'react';
import {
  Copy,
  Eye,
  EyeOff,
  Layers,
  Plus,
  Sun,
  Trash2,
} from 'lucide-react';
import { FLOOR_PATTERNS } from '../engine/textures';
import { useMapStore } from '../store/useMapStore';
import type { FloorPatternId, LayerVisibility, PropLayer } from '../types/map';

const LAYER_ITEMS: { key: keyof LayerVisibility; label: string }[] = [
  { key: 'lighting', label: 'Iluminación y Sombras' },
  { key: 'grid', label: 'Cuadrícula' },
  { key: 'roofs', label: 'Tejados' },
  { key: 'portals', label: 'Puertas y Ventanas' },
  { key: 'walls', label: 'Muros' },
  { key: 'objects', label: 'Objetos y Mobiliario' },
  { key: 'shadows', label: 'Sombras de Objetos' },
  { key: 'paths', label: 'Caminos' },
  { key: 'floors', label: 'Suelos Interiores' },
  { key: 'water', label: 'Agua' },
  { key: 'terrain', label: 'Terreno Base' },
];

const AMBIENT_PRESETS = [
  { label: 'Día', color: '#ffffff', intensity: 0.96 },
  { label: 'Atardecer', color: '#d6a47c', intensity: 0.68 },
  { label: 'Penumbra', color: '#889bb8', intensity: 0.56 },
  { label: 'Noche', color: '#4c618a', intensity: 0.34 },
  { label: 'Mazmorra', color: '#2b3345', intensity: 0.18 },
];

export function RightPanel() {
  const doc = useMapStore((s) => s.doc);
  const selection = useMapStore((s) => s.selection);

  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const updateAmbient = useMapStore((s) => s.updateAmbient);
  const setActiveLevel = useMapStore((s) => s.setActiveLevel);
  const addLevel = useMapStore((s) => s.addLevel);
  const deleteLevel = useMapStore((s) => s.deleteLevel);

  const updateSelectedObject = useMapStore((s) => s.updateSelectedObject);
  const updateSelectedLight = useMapStore((s) => s.updateSelectedLight);
  const updateSelectedPortal = useMapStore((s) => s.updateSelectedPortal);
  const updateSelectedRoom = useMapStore((s) => s.updateSelectedRoom);
  const duplicateSelected = useMapStore((s) => s.duplicateSelected);
  const deleteSelected = useMapStore((s) => s.deleteSelected);

  const activeLevel =
    doc.levels.find((l) => l.id === doc.activeLevelId) ?? doc.levels[0];

  const selectedObject =
    selection?.kind === 'object'
      ? activeLevel.objects.find((o) => o.id === selection.id)
      : null;
  const selectedLight =
    selection?.kind === 'light'
      ? activeLevel.lights.find((l) => l.id === selection.id)
      : null;
  const selectedPortal =
    selection?.kind === 'portal'
      ? activeLevel.portals.find((p) => p.id === selection.id)
      : null;
  const selectedRoom =
    selection?.kind === 'room'
      ? activeLevel.rooms.find((r) => r.id === selection.id)
      : null;

  return (
    <aside className="right-panel" aria-label="Inspector y capas">
      <div className="panel-header">
        <span>Inspector y Capas</span>
      </div>

      <div className="panel-scroll">
        {/* Selected Entity Inspector */}
        {selection && (
          <div
            style={{
              background: 'var(--bg-panel-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="section-label" style={{ marginBottom: 0, color: 'var(--accent-hover)' }}>
                Selección ({selection.kind})
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                {(selection.kind === 'object' || selection.kind === 'light') && (
                  <button
                    className="btn-secondary"
                    style={{ padding: '3px 6px' }}
                    onClick={duplicateSelected}
                    title="Duplicar (Ctrl+D)"
                  >
                    <Copy size={12} />
                  </button>
                )}
                <button
                  className="btn-danger"
                  style={{ padding: '3px 6px' }}
                  onClick={deleteSelected}
                  title="Eliminar (Supr)"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {selectedObject && (
              <>
                <div className="control-row">
                  <span>Rotación</span>
                  <input
                    type="range"
                    min={0}
                    max={359}
                    value={Math.round(((selectedObject.rotation * 180) / Math.PI + 360) % 360)}
                    onChange={(e) =>
                      updateSelectedObject(
                        { rotation: (parseInt(e.target.value, 10) * Math.PI) / 180 },
                        false
                      )
                    }
                  />
                  <span className="control-val">
                    {Math.round(((selectedObject.rotation * 180) / Math.PI + 360) % 360)}°
                  </span>
                </div>
                <div className="control-row">
                  <span>Escala</span>
                  <input
                    type="range"
                    min={0.3}
                    max={2.8}
                    step={0.05}
                    value={Math.abs(selectedObject.scaleX)}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      updateSelectedObject(
                        {
                          scaleX: selectedObject.scaleX < 0 ? -v : v,
                          scaleY: selectedObject.scaleY < 0 ? -v : v,
                        },
                        false
                      );
                    }}
                  />
                  <span className="control-val">{Math.abs(selectedObject.scaleX).toFixed(2)}x</span>
                </div>
                <div className="control-row">
                  <span>Capa</span>
                  <select
                    value={selectedObject.layer}
                    onChange={(e) =>
                      updateSelectedObject({ layer: e.target.value as PropLayer })
                    }
                  >
                    <option value="below_floor">Bajo suelo</option>
                    <option value="above_floor">Sobre suelo</option>
                    <option value="above_walls">Sobre muros</option>
                    <option value="roof">Tejado</option>
                  </select>
                </div>
                <button
                  className={`toggle-btn ${selectedObject.castShadow ? 'active' : ''}`}
                  onClick={() =>
                    updateSelectedObject({ castShadow: !selectedObject.castShadow })
                  }
                >
                  <span>Sombra de objeto</span>
                  <span>{selectedObject.castShadow ? 'SÍ' : 'NO'}</span>
                </button>
              </>
            )}

            {selectedLight && (
              <>
                <div className="control-row">
                  <span>Color</span>
                  <input
                    type="color"
                    value={selectedLight.color}
                    onChange={(e) => updateSelectedLight({ color: e.target.value }, false)}
                  />
                </div>
                <div className="control-row">
                  <span>Radio</span>
                  <input
                    type="range"
                    min={1.5}
                    max={14}
                    step={0.5}
                    value={selectedLight.radius}
                    onChange={(e) =>
                      updateSelectedLight({ radius: parseFloat(e.target.value) }, false)
                    }
                  />
                  <span className="control-val">{selectedLight.radius.toFixed(1)}</span>
                </div>
                <div className="control-row">
                  <span>Intensidad</span>
                  <input
                    type="range"
                    min={0.2}
                    max={1.8}
                    step={0.05}
                    value={selectedLight.intensity}
                    onChange={(e) =>
                      updateSelectedLight({ intensity: parseFloat(e.target.value) }, false)
                    }
                  />
                  <span className="control-val">{Math.round(selectedLight.intensity * 100)}%</span>
                </div>
                <button
                  className={`toggle-btn ${selectedLight.castShadows ? 'active' : ''}`}
                  onClick={() =>
                    updateSelectedLight({ castShadows: !selectedLight.castShadows })
                  }
                >
                  <span>Proyectar sombras</span>
                  <span>{selectedLight.castShadows ? 'SÍ' : 'NO'}</span>
                </button>
              </>
            )}

            {selectedPortal && (
              <>
                <button
                  className={`toggle-btn ${selectedPortal.open ? 'active' : ''}`}
                  onClick={() =>
                    updateSelectedPortal({
                      open: !selectedPortal.open,
                      blocksLight: selectedPortal.open,
                    })
                  }
                >
                  <span>Puerta Abierta</span>
                  <span>{selectedPortal.open ? 'SÍ' : 'NO'}</span>
                </button>
                <div className="control-row">
                  <span>Ancho</span>
                  <input
                    type="range"
                    min={0.6}
                    max={2.4}
                    step={0.1}
                    value={selectedPortal.width}
                    onChange={(e) =>
                      updateSelectedPortal({ width: parseFloat(e.target.value) }, false)
                    }
                  />
                  <span className="control-val">{selectedPortal.width.toFixed(1)}</span>
                </div>
              </>
            )}

            {selectedRoom && (
              <div className="control-row">
                <span>Suelo</span>
                <select
                  value={selectedRoom.floor}
                  onChange={(e) =>
                    updateSelectedRoom({ floor: e.target.value as FloorPatternId })
                  }
                >
                  {FLOOR_PATTERNS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Ambient Lighting */}
        <div>
          <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Sun size={12} /> Luz Ambiental
          </div>
          <div className="chip-row" style={{ marginBottom: 8 }}>
            {AMBIENT_PRESETS.map((p) => (
              <button
                key={p.label}
                className="chip"
                onClick={() =>
                  updateAmbient({ enabled: true, color: p.color, intensity: p.intensity })
                }
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="control-row" style={{ marginBottom: 6 }}>
            <span>Brillo Global</span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.02}
              value={doc.ambient.intensity}
              onChange={(e) =>
                updateAmbient({ intensity: parseFloat(e.target.value), enabled: true })
              }
            />
            <span className="control-val">{Math.round(doc.ambient.intensity * 100)}%</span>
          </div>
          <div className="control-row">
            <span>Tono Ambiental</span>
            <input
              type="color"
              value={doc.ambient.color}
              onChange={(e) => updateAmbient({ color: e.target.value, enabled: true })}
            />
          </div>
        </div>

        {/* Levels */}
        <div>
          <div
            className="section-label"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Layers size={12} /> Niveles / Plantas
            </span>
            <button
              className="topbar-btn"
              style={{ padding: '2px 6px' }}
              onClick={() => addLevel(`Nivel ${doc.levels.length + 1}`)}
              title="Añadir nueva planta"
            >
              <Plus size={12} /> Añadir
            </button>
          </div>
          {doc.levels.map((lvl) => (
            <div
              key={lvl.id}
              className={`level-row ${lvl.id === doc.activeLevelId ? 'active' : ''}`}
            >
              <button
                style={{ flex: 1, textAlign: 'left' }}
                onClick={() => setActiveLevel(lvl.id)}
              >
                {lvl.name}
              </button>
              {doc.levels.length > 1 && (
                <button
                  onClick={() => deleteLevel(lvl.id)}
                  aria-label={`Eliminar ${lvl.name}`}
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Layer Visibility */}
        <div>
          <div className="section-label">Visibilidad de Capas</div>
          <div>
            {LAYER_ITEMS.map((item) => {
              const on = doc.layers[item.key];
              return (
                <button
                  key={item.key}
                  className={`layer-row ${on ? '' : 'off'}`}
                  style={{ width: '100%' }}
                  onClick={() => toggleLayer(item.key)}
                >
                  <span>{item.label}</span>
                  {on ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
