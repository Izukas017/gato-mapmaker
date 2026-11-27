import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowUpToLine,
  Copy,
  Eye,
  EyeOff,
  FlipHorizontal,
  FlipVertical,
  Layers,
  Minus,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  SlidersHorizontal,
  Sun,
  Trash2,
} from 'lucide-react';
import { FLOOR_PATTERNS, ROOF_STYLES, WALL_STYLES } from '../engine/textures';
import { CYBER_FLOORS, CYBER_PATHS, CYBER_PORTALS, CYBER_ROOFS, CYBER_WALLS } from '../engine/cyber/catalog';
import { StyleOptions } from './VariantContent';
import { useMapStore } from '../store/useMapStore';
import { useUiPrefs } from '../store/useUiPrefs';
import { NumberSliderRow } from './NumberSliderRow';
import type {
  FloorPatternId,
  LayerVisibility,
  PathStyleId,
  PortalKind,
  PropLayer,
  RoofStyleId,
  WallStyleId,
} from '../types/map';

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

const PORTAL_TYPES: { id: PortalKind; label: string }[] = [
  { id: 'door_wood', label: 'Puerta Madera' },
  { id: 'door_double', label: 'Puerta Doble' },
  { id: 'door_iron', label: 'Puerta Hierro' },
  { id: 'door_ornate_gold', label: 'Puerta Real Oro' },
  { id: 'door_secret', label: 'Puerta Secreta' },
  { id: 'portcullis', label: 'Rastrillo Reja' },
  { id: 'archway', label: 'Arco Abierto' },
  { id: 'window_glass', label: 'Ventana Cristal' },
  { id: 'window_stained', label: 'Vidriera Templo' },
  { id: 'window_bars', label: 'Ventana Barrotes' },
];

const PATH_STYLES: { id: PathStyleId; label: string }[] = [
  { id: 'dirt_road', label: 'Camino Tierra' },
  { id: 'cobble_path', label: 'Calzada Adoquín' },
  { id: 'fence_wood', label: 'Valla Madera' },
  { id: 'fence_picket', label: 'Valla Estacas' },
  { id: 'fence_iron', label: 'Verja Hierro' },
  { id: 'wood_bridge', label: 'Puente Madera' },
  { id: 'rope_bridge', label: 'Puente Colgante' },
  { id: 'rail_tracks', label: 'Vías Vagoneta' },
  { id: 'stream_brook', label: 'Arroyo de Agua' },
  { id: 'lava_stream', label: 'Río de Lava' },
  { id: 'stone_wall_low', label: 'Murete Piedra' },
  { id: 'carpet_teal', label: 'Alfombra Templo' },
  { id: 'carpet_crimson', label: 'Alfombra Real' },
  { id: 'hedge', label: 'Seto Jardín' },
  { id: 'cliff_edge', label: 'Borde Acantilado' },
];

const SELECTION_LABELS = {
  object: 'Objeto',
  light: 'Luz',
  portal: 'Puerta / Ventana',
  room: 'Habitación',
  wall: 'Muro',
  path: 'Camino',
  roof: 'Tejado',
} as const;

export function RightPanel() {
  const doc = useMapStore((s) => s.doc);
  const selection = useMapStore((s) => s.selection);
  const selectedItems = useMapStore((s) => s.selectedItems);
  const copySelected = useMapStore((s) => s.copySelected);
  const alignSelected = useMapStore((s) => s.alignSelected);
  const mergeSelected = useMapStore((s) => s.mergeSelected);
  const ungroupSelected = useMapStore((s) => s.ungroupSelected);
  const grouped = useMapStore((s) => {
    const level = s.doc.levels.find((l) => l.id === s.doc.activeLevelId);
    return s.selectedItems.some((ref) =>
      level?.[`${ref.kind}s`].some((it) => it.id === ref.id && it.groupId)
    );
  });

  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const updateAmbient = useMapStore((s) => s.updateAmbient);
  const updateGrid = useMapStore((s) => s.updateGrid);
  const updateMapMeta = useMapStore((s) => s.updateMapMeta);
  const setActiveLevel = useMapStore((s) => s.setActiveLevel);
  const addLevel = useMapStore((s) => s.addLevel);
  const deleteLevel = useMapStore((s) => s.deleteLevel);

  const updateSelectedObject = useMapStore((s) => s.updateSelectedObject);
  const reorderSelectedObject = useMapStore((s) => s.reorderSelectedObject);
  const updateSelectedLight = useMapStore((s) => s.updateSelectedLight);
  const updateSelectedPortal = useMapStore((s) => s.updateSelectedPortal);
  const updateSelectedRoom = useMapStore((s) => s.updateSelectedRoom);
  const updateSelectedWall = useMapStore((s) => s.updateSelectedWall);
  const updateSelectedPath = useMapStore((s) => s.updateSelectedPath);
  const updateSelectedRoof = useMapStore((s) => s.updateSelectedRoof);
  const duplicateSelected = useMapStore((s) => s.duplicateSelected);
  const deleteSelected = useMapStore((s) => s.deleteSelected);

  const rightPanelOpen = useUiPrefs((s) => s.rightPanelOpen);
  const rightPanelWidth = useUiPrefs((s) => s.rightPanelWidth);
  const setPrefs = useUiPrefs((s) => s.setPrefs);
  const toggleRightPanel = useUiPrefs((s) => s.toggleRightPanel);

  const [uniformScale, setUniformScale] = useState(true);
  const [resizing, setResizing] = useState(false);
  const resizeStartRef = useRef<{ x: number; width: number } | null>(null);

  useEffect(() => {
    if (!resizing) return;
    const onMove = (e: PointerEvent) => {
      if (!resizeStartRef.current) return;
      const dx = resizeStartRef.current.x - e.clientX;
      setPrefs({ rightPanelWidth: resizeStartRef.current.width + dx });
    };
    const onUp = () => {
      setResizing(false);
      resizeStartRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [resizing, setPrefs]);

  if (!rightPanelOpen) {
    return (
      <button
        className="right-reopen-tab"
        onClick={toggleRightPanel}
        title="Abrir panel derecho"
        aria-label="Abrir panel derecho"
      >
        <PanelRightOpen size={16} />
      </button>
    );
  }

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
  const selectedWall =
    selection?.kind === 'wall'
      ? activeLevel.walls.find((w) => w.id === selection.id)
      : null;
  const selectedPath =
    selection?.kind === 'path'
      ? activeLevel.paths.find((p) => p.id === selection.id)
      : null;
  const selectedRoof =
    selection?.kind === 'roof'
      ? activeLevel.roofs.find((r) => r.id === selection.id)
      : null;

  return (
    <div className="right-panel-shell" style={{ width: rightPanelWidth }}>
      <div
        className={`right-resize-handle ${resizing ? 'dragging' : ''}`}
        onPointerDown={(e) => {
          e.preventDefault();
          resizeStartRef.current = { x: e.clientX, width: rightPanelWidth };
          setResizing(true);
        }}
        title="Arrastra para redimensionar el panel"
        role="separator"
        aria-orientation="vertical"
      />
      <aside className="right-panel" aria-label="Inspector y capas">
        <div className="panel-header">
          <span>Inspector</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button
              className="topbar-btn"
              style={{ padding: '2px 4px' }}
              onClick={() => setPrefs({ rightPanelWidth: rightPanelWidth - 36 })}
              title="Reducir ancho del panel"
              aria-label="Reducir ancho del panel"
            >
              <Minus size={12} />
            </button>
            <button
              className="topbar-btn"
              style={{ padding: '2px 4px' }}
              onClick={() => setPrefs({ rightPanelWidth: rightPanelWidth + 36 })}
              title="Aumentar ancho del panel"
              aria-label="Aumentar ancho del panel"
            >
              <Plus size={12} />
            </button>
            <button
              className="topbar-btn"
              style={{ padding: '2px 4px' }}
              onClick={toggleRightPanel}
              title="Cerrar panel derecho"
              aria-label="Cerrar panel derecho"
            >
              <PanelRightClose size={14} />
            </button>
          </div>
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
                {selectedItems.length > 1
                  ? `${selectedItems.length} elementos seleccionados`
                  : SELECTION_LABELS[selection.kind]}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className="btn-secondary"
                  style={{ padding: '3px 6px', fontSize: 10 }}
                  onClick={copySelected}
                  title="Copiar (Ctrl+C)"
                >
                  Copiar
                </button>
                <button
                  className="btn-secondary"
                  style={{ padding: '3px 6px' }}
                  onClick={duplicateSelected}
                  title="Duplicar (Ctrl+D)"
                >
                  <Copy size={12} />
                </button>
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

            {selectedItems.length >= 2 && (
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1, padding: '4px 6px', fontSize: 11 }}
                  onClick={() => alignSelected('horizontal')}
                  title="Alinear todos en la misma fila horizontal (misma Y)"
                >
                  Alinear Horiz. (—)
                </button>
                <button
                  className="btn-secondary"
                  style={{ flex: 1, padding: '4px 6px', fontSize: 11 }}
                  onClick={() => alignSelected('vertical')}
                  title="Alinear todos en la misma columna vertical (mismo X)"
                >
                  Alinear Vert. (|)
                </button>
              </div>
            )}

            {selectedItems.length >= 2 && (
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1, padding: '4px 6px', fontSize: 11 }}
                  onClick={mergeSelected}
                  title="Une las piezas iguales y copia lo compartible del primero que seleccionaste"
                >
                  Fusionar
                </button>
                {grouped && (
                  <button
                    className="btn-secondary"
                    style={{ flex: 1, padding: '4px 6px', fontSize: 11 }}
                    onClick={ungroupSelected}
                    title="Deshace el grupo"
                  >
                    Separar
                  </button>
                )}
              </div>
            )}

            {selectedObject && (
              <>
                <NumberSliderRow
                  label="Rotación"
                  value={Math.round(((selectedObject.rotation * 180) / Math.PI + 360) % 360)}
                  min={0}
                  max={359}
                  step={1}
                  decimals={0}
                  suffix="°"
                  onChange={(deg) =>
                    updateSelectedObject({ rotation: (deg * Math.PI) / 180 }, false)
                  }
                />

                <button
                  className={`toggle-btn ${uniformScale ? 'active' : ''}`}
                  onClick={() => setUniformScale(!uniformScale)}
                >
                  <span>Escala Proporcional</span>
                  <span>{uniformScale ? 'SÍ' : 'NO'}</span>
                </button>

                {uniformScale ? (
                  <NumberSliderRow
                    label="Tamaño"
                    value={Math.abs(selectedObject.scaleX)}
                    min={0.25}
                    max={3.5}
                    step={0.05}
                    decimals={2}
                    suffix="x"
                    onChange={(v) =>
                      updateSelectedObject(
                        {
                          scaleX: selectedObject.scaleX < 0 ? -v : v,
                          scaleY: selectedObject.scaleY < 0 ? -v : v,
                        },
                        false
                      )
                    }
                  />
                ) : (
                  <>
                    <NumberSliderRow
                      label="Ancho (X)"
                      value={Math.abs(selectedObject.scaleX)}
                      min={0.25}
                      max={3.5}
                      step={0.05}
                      decimals={2}
                      suffix="x"
                      onChange={(v) =>
                        updateSelectedObject(
                          { scaleX: selectedObject.scaleX < 0 ? -v : v },
                          false
                        )
                      }
                    />
                    <NumberSliderRow
                      label="Alto (Y)"
                      value={Math.abs(selectedObject.scaleY)}
                      min={0.25}
                      max={3.5}
                      step={0.05}
                      decimals={2}
                      suffix="x"
                      onChange={(v) =>
                        updateSelectedObject(
                          { scaleY: selectedObject.scaleY < 0 ? -v : v },
                          false
                        )
                      }
                    />
                  </>
                )}

                <NumberSliderRow
                  label="Opacidad"
                  value={Math.round(selectedObject.opacity * 100)}
                  min={10}
                  max={100}
                  step={5}
                  decimals={0}
                  suffix="%"
                  onChange={(pct) =>
                    updateSelectedObject({ opacity: Math.min(1, Math.max(0.1, pct / 100)) }, false)
                  }
                />

                <div className="control-row">
                  <span>Tinte</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="color"
                      value={selectedObject.tint ?? '#ffffff'}
                      onChange={(e) => updateSelectedObject({ tint: e.target.value }, false)}
                    />
                    {selectedObject.tint && (
                      <button
                        className="btn-secondary"
                        style={{ padding: '2px 6px', fontSize: 10 }}
                        onClick={() => updateSelectedObject({ tint: undefined })}
                      >
                        Quitar
                      </button>
                    )}
                  </div>
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

                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    className="btn-secondary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '4px 6px', fontSize: 11 }}
                    onClick={() => updateSelectedObject({ scaleX: -selectedObject.scaleX })}
                    title="Voltear horizontalmente"
                  >
                    <FlipHorizontal size={12} /> Voltear H
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '4px 6px', fontSize: 11 }}
                    onClick={() => updateSelectedObject({ scaleY: -selectedObject.scaleY })}
                    title="Voltear verticalmente"
                  >
                    <FlipVertical size={12} /> Voltear V
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    className="btn-secondary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '4px 6px', fontSize: 11 }}
                    onClick={() => reorderSelectedObject('front')}
                  >
                    <ArrowUpToLine size={12} /> Al frente
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '4px 6px', fontSize: 11 }}
                    onClick={() => reorderSelectedObject('back')}
                  >
                    <ArrowDownToLine size={12} /> Atrás
                  </button>
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

                {selectedObject.castShadow && (
                  <div className="control-row">
                    <span>Sombra</span>
                    <input
                      type="range"
                      min={0.2}
                      max={2.0}
                      step={0.1}
                      value={selectedObject.shadowOffset}
                      onChange={(e) =>
                        updateSelectedObject(
                          { shadowOffset: parseFloat(e.target.value) },
                          false
                        )
                      }
                    />
                    <span className="control-val">{selectedObject.shadowOffset.toFixed(1)}</span>
                  </div>
                )}

                <button
                  className={`toggle-btn ${selectedObject.light?.enabled ? 'active' : ''}`}
                  onClick={() => {
                    const prev = selectedObject.light;
                    updateSelectedObject({
                      light: prev
                        ? { ...prev, enabled: !prev.enabled }
                        : {
                            enabled: true,
                            color: '#ffae42',
                            radius: 5.0,
                            intensity: 1.0,
                            castShadows: true,
                          },
                    });
                  }}
                >
                  <span>Genera Luz</span>
                  <span>{selectedObject.light?.enabled ? 'SÍ' : 'NO'}</span>
                </button>

                {selectedObject.light?.enabled && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      paddingLeft: 8,
                      borderLeft: '2px solid var(--accent)',
                    }}
                  >
                    <div className="control-row">
                      <span>Color luz</span>
                      <input
                        type="color"
                        value={selectedObject.light.color}
                        onChange={(e) =>
                          updateSelectedObject(
                            { light: { ...selectedObject.light!, color: e.target.value } },
                            false
                          )
                        }
                      />
                    </div>
                    <div className="control-row">
                      <span>Radio luz</span>
                      <input
                        type="range"
                        min={1.5}
                        max={14}
                        step={0.5}
                        value={selectedObject.light.radius}
                        onChange={(e) =>
                          updateSelectedObject(
                            { light: { ...selectedObject.light!, radius: parseFloat(e.target.value) } },
                            false
                          )
                        }
                      />
                      <span className="control-val">{selectedObject.light.radius.toFixed(1)}</span>
                    </div>
                    <div className="control-row">
                      <span>Intensidad</span>
                      <input
                        type="range"
                        min={0.2}
                        max={1.8}
                        step={0.05}
                        value={selectedObject.light.intensity}
                        onChange={(e) =>
                          updateSelectedObject(
                            { light: { ...selectedObject.light!, intensity: parseFloat(e.target.value) } },
                            false
                          )
                        }
                      />
                      <span className="control-val">
                        {Math.round(selectedObject.light.intensity * 100)}%
                      </span>
                    </div>
                    <button
                      className={`toggle-btn ${selectedObject.light.castShadows ? 'active' : ''}`}
                      onClick={() =>
                        updateSelectedObject({
                          light: {
                            ...selectedObject.light!,
                            castShadows: !selectedObject.light!.castShadows,
                          },
                        })
                      }
                    >
                      <span>Sombras de luz</span>
                      <span>{selectedObject.light.castShadows ? 'SÍ' : 'NO'}</span>
                    </button>
                  </div>
                )}
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
                <NumberSliderRow
                  label="Radio"
                  value={selectedLight.radius}
                  min={1.5}
                  max={14}
                  step={0.5}
                  decimals={1}
                  onChange={(v) => updateSelectedLight({ radius: v }, false)}
                />
                <NumberSliderRow
                  label="Intensidad"
                  value={Math.round(selectedLight.intensity * 100)}
                  min={20}
                  max={180}
                  step={5}
                  decimals={0}
                  suffix="%"
                  onChange={(pct) => updateSelectedLight({ intensity: pct / 100 }, false)}
                />
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

            {selectedPortal && (() => {
              const isDoor =
                selectedPortal.kind === 'door_wood' ||
                selectedPortal.kind === 'door_double' ||
                selectedPortal.kind === 'door_iron' ||
                selectedPortal.kind === 'door_ornate_gold' ||
                selectedPortal.kind === 'door_secret';
              const curOpenAngle = selectedPortal.openAngle ?? (selectedPortal.open ? 75 : 0);

              return (
              <>
                <div className="control-row">
                  <span>Tipo</span>
                  <select
                    value={selectedPortal.kind}
                    onChange={(e) =>
                      updateSelectedPortal({ kind: e.target.value as PortalKind })
                    }
                  >
                    <StyleOptions classic={PORTAL_TYPES} cyber={CYBER_PORTALS} value={selectedPortal.kind} />
                  </select>
                </div>
                <button
                  className={`toggle-btn ${selectedPortal.open ? 'active' : ''}`}
                  onClick={() => {
                    const nextOpen = !selectedPortal.open;
                    updateSelectedPortal({
                      open: nextOpen,
                      openAngle: nextOpen ? (curOpenAngle > 5 ? curOpenAngle : 75) : 0,
                      blocksLight: !nextOpen && isDoor,
                    });
                  }}
                >
                  <span>Puerta Abierta</span>
                  <span>{selectedPortal.open ? 'SÍ' : 'NO'}</span>
                </button>
                {isDoor && (
                  <NumberSliderRow
                    label="Apertura"
                    value={curOpenAngle}
                    min={0}
                    max={180}
                    step={5}
                    decimals={0}
                    suffix="°"
                    onChange={(deg) => {
                      const clamped = Math.max(0, Math.min(180, deg));
                      updateSelectedPortal(
                        {
                          openAngle: clamped,
                          open: clamped > 2,
                          blocksLight: clamped <= 2,
                        },
                        false
                      );
                    }}
                  />
                )}
                <button
                  className={`toggle-btn ${selectedPortal.blocksLight ? 'active' : ''}`}
                  onClick={() =>
                    updateSelectedPortal({ blocksLight: !selectedPortal.blocksLight })
                  }
                >
                  <span>Bloquea Luz</span>
                  <span>{selectedPortal.blocksLight ? 'SÍ' : 'NO'}</span>
                </button>
                <NumberSliderRow
                  label="Ancho"
                  value={selectedPortal.width}
                  min={0.6}
                  max={3.0}
                  step={0.1}
                  decimals={1}
                  onChange={(v) => updateSelectedPortal({ width: v }, false)}
                />
                <NumberSliderRow
                  label="Rotación"
                  value={Math.round(((selectedPortal.angle * 180) / Math.PI + 360) % 360)}
                  min={0}
                  max={359}
                  step={1}
                  decimals={0}
                  suffix="°"
                  onChange={(deg) =>
                    updateSelectedPortal({ angle: (deg * Math.PI) / 180 }, false)
                  }
                />
              </>
              );
            })()}

            {selectedRoom && (
              <>
                <div className="control-row">
                  <span>Suelo</span>
                  <select
                    value={selectedRoom.floor}
                    onChange={(e) =>
                      updateSelectedRoom({ floor: e.target.value as FloorPatternId })
                    }
                  >
                    <StyleOptions classic={FLOOR_PATTERNS} cyber={CYBER_FLOORS} value={selectedRoom.floor} />
                  </select>
                </div>
                <NumberSliderRow
                  label="Rotar suelo"
                  value={selectedRoom.floorRotation ?? 0}
                  min={0}
                  max={359}
                  step={5}
                  decimals={0}
                  suffix="°"
                  onChange={(deg) => updateSelectedRoom({ floorRotation: deg }, false)}
                />
                <div className="control-row">
                  <span>Tinte suelo</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="color"
                      value={selectedRoom.floorTint ?? '#ffffff'}
                      onChange={(e) =>
                        updateSelectedRoom({ floorTint: e.target.value }, false)
                      }
                    />
                    {selectedRoom.floorTint && (
                      <button
                        className="btn-secondary"
                        style={{ padding: '2px 6px', fontSize: 10 }}
                        onClick={() => updateSelectedRoom({ floorTint: undefined })}
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                </div>
                <div className="control-row">
                  <span>Muros</span>
                  <select
                    value={selectedRoom.wallStyle ?? ''}
                    onChange={(e) =>
                      updateSelectedRoom({
                        wallStyle: (e.target.value || null) as WallStyleId | null,
                      })
                    }
                  >
                    <option value="">Sin Muro</option>
                    <StyleOptions classic={WALL_STYLES} cyber={CYBER_WALLS} value={selectedRoom.wallStyle} />
                  </select>
                </div>
                {selectedRoom.wallStyle && (
                  <>
                    <NumberSliderRow
                      label="Grosor"
                      value={selectedRoom.wallThickness}
                      min={0.1}
                      max={0.6}
                      step={0.02}
                      decimals={2}
                      onChange={(v) => updateSelectedRoom({ wallThickness: v }, false)}
                    />
                    <button
                      className={`toggle-btn ${selectedRoom.castShadows ? 'active' : ''}`}
                      onClick={() =>
                        updateSelectedRoom({ castShadows: !selectedRoom.castShadows })
                      }
                    >
                      <span>Muros bloquean luz</span>
                      <span>{selectedRoom.castShadows ? 'SÍ' : 'NO'}</span>
                    </button>
                  </>
                )}
              </>
            )}

            {selectedWall && (
              <>
                <div className="control-row">
                  <span>Estilo</span>
                  <select
                    value={selectedWall.style}
                    onChange={(e) =>
                      updateSelectedWall({ style: e.target.value as WallStyleId })
                    }
                  >
                    <StyleOptions classic={WALL_STYLES} cyber={CYBER_WALLS} value={selectedWall.style} />
                  </select>
                </div>
                <NumberSliderRow
                  label="Grosor"
                  value={selectedWall.thickness}
                  min={0.1}
                  max={0.6}
                  step={0.02}
                  decimals={2}
                  onChange={(v) => updateSelectedWall({ thickness: v }, false)}
                />
                <button
                  className={`toggle-btn ${selectedWall.closed ? 'active' : ''}`}
                  onClick={() => updateSelectedWall({ closed: !selectedWall.closed })}
                >
                  <span>Muro Cerrado</span>
                  <span>{selectedWall.closed ? 'SÍ' : 'NO'}</span>
                </button>
                <button
                  className={`toggle-btn ${selectedWall.castShadows ? 'active' : ''}`}
                  onClick={() =>
                    updateSelectedWall({ castShadows: !selectedWall.castShadows })
                  }
                >
                  <span>Bloquea Luz y Sombras</span>
                  <span>{selectedWall.castShadows ? 'SÍ' : 'NO'}</span>
                </button>
              </>
            )}

            {selectedPath && (
              <>
                <div className="control-row">
                  <span>Estilo</span>
                  <select
                    value={selectedPath.style}
                    onChange={(e) =>
                      updateSelectedPath({ style: e.target.value as PathStyleId })
                    }
                  >
                    <StyleOptions classic={PATH_STYLES} cyber={CYBER_PATHS} value={selectedPath.style} />
                  </select>
                </div>
                <NumberSliderRow
                  label="Ancho"
                  value={selectedPath.width}
                  min={0.3}
                  max={4.0}
                  step={0.1}
                  decimals={1}
                  onChange={(v) => updateSelectedPath({ width: v }, false)}
                />
                <button
                  className={`toggle-btn ${selectedPath.smooth ? 'active' : ''}`}
                  onClick={() => updateSelectedPath({ smooth: !selectedPath.smooth })}
                >
                  <span>Curva Suavizada</span>
                  <span>{selectedPath.smooth ? 'SÍ' : 'NO'}</span>
                </button>
                {selectedPath.smooth ? (
                  <NumberSliderRow
                    label="Curvatura"
                    value={selectedPath.curvature ?? 1}
                    min={0}
                    max={3}
                    step={0.1}
                    decimals={1}
                    onChange={(v) => updateSelectedPath({ curvature: v }, false)}
                  />
                ) : (
                  <>
                    <span>Arrastra los puntos naranjas del camino para curvarlo.</span>
                    {selectedPath.bends?.some(Boolean) && (
                      <button
                        className="btn-secondary"
                        onClick={() => updateSelectedPath({ bends: undefined })}
                      >
                        Enderezar tramos
                      </button>
                    )}
                  </>
                )}
                <button
                  className={`toggle-btn ${selectedPath.fadeEnds ? 'active' : ''}`}
                  onClick={() =>
                    updateSelectedPath({ fadeEnds: !selectedPath.fadeEnds })
                  }
                >
                  <span>Puntas Redondeadas</span>
                  <span>{selectedPath.fadeEnds ? 'SÍ' : 'NO'}</span>
                </button>
              </>
            )}

            {selectedRoof && (
              <>
                <div className="control-row">
                  <span>Estilo</span>
                  <select
                    value={selectedRoof.style}
                    onChange={(e) =>
                      updateSelectedRoof({ style: e.target.value as RoofStyleId })
                    }
                  >
                    <StyleOptions classic={ROOF_STYLES} cyber={CYBER_ROOFS} value={selectedRoof.style} />
                  </select>
                </div>
                <NumberSliderRow
                  label="Opacidad"
                  value={Math.round(selectedRoof.opacity * 100)}
                  min={15}
                  max={100}
                  step={5}
                  decimals={0}
                  suffix="%"
                  onChange={(pct) =>
                    updateSelectedRoof({ opacity: Math.min(1, Math.max(0.15, pct / 100)) }, false)
                  }
                />
              </>
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
          <div className="control-row" style={{ marginBottom: 6 }}>
            <span>Tono Ambiental</span>
            <input
              type="color"
              value={doc.ambient.color}
              onChange={(e) => updateAmbient({ color: e.target.value, enabled: true })}
            />
          </div>
          <button
            className={`toggle-btn ${(doc.ambient.strictWallBlocking ?? true) ? 'active' : ''}`}
            onClick={() =>
              updateAmbient({
                strictWallBlocking: !(doc.ambient.strictWallBlocking ?? true),
              })
            }
          >
            <span>Muros bloquean luz al 100%</span>
            <span>{(doc.ambient.strictWallBlocking ?? true) ? 'SÍ' : 'NO'}</span>
          </button>
        </div>

        {/* General Map & Grid Configuration */}
        <div>
          <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <SlidersHorizontal size={12} /> Mapa y Cuadrícula
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="control-row">
              <span>Tamaño</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="number"
                  min={8}
                  max={80}
                  value={doc.width}
                  onChange={(e) =>
                    updateMapMeta({ width: Math.max(8, Math.min(80, parseInt(e.target.value, 10) || 24)) })
                  }
                  style={{ width: 52, textAlign: 'center' }}
                  aria-label="Ancho del mapa en casillas"
                />
                <span>×</span>
                <input
                  type="number"
                  min={8}
                  max={80}
                  value={doc.height}
                  onChange={(e) =>
                    updateMapMeta({ height: Math.max(8, Math.min(80, parseInt(e.target.value, 10) || 20)) })
                  }
                  style={{ width: 52, textAlign: 'center' }}
                  aria-label="Alto del mapa en casillas"
                />
              </div>
            </div>
            <div className="control-row">
              <span>Color grilla</span>
              <input
                type="color"
                value={doc.grid.color}
                onChange={(e) => updateGrid({ color: e.target.value })}
              />
            </div>
            <div className="control-row">
              <span>Opacidad grilla</span>
              <input
                type="range"
                min={0.05}
                max={0.8}
                step={0.05}
                value={doc.grid.opacity}
                onChange={(e) => updateGrid({ opacity: parseFloat(e.target.value) })}
              />
              <span className="control-val">{Math.round(doc.grid.opacity * 100)}%</span>
            </div>
            <button
              className={`toggle-btn ${doc.grid.snap ? 'active' : ''}`}
              onClick={() => updateGrid({ snap: !doc.grid.snap })}
            >
              <span>Seguir cuadrícula</span>
              <span>{doc.grid.snap ? 'SÍ' : 'NO'}</span>
            </button>
            {doc.grid.snap && (
              <div className="control-row">
                <span>Subdivisión</span>
                <select
                  value={doc.grid.snapSubdivision}
                  onChange={(e) =>
                    updateGrid({
                      snapSubdivision: parseInt(e.target.value, 10) as 1 | 2 | 4,
                    })
                  }
                >
                  <option value={1}>1 casilla</option>
                  <option value={2}>1/2 casilla</option>
                  <option value={4}>1/4 casilla</option>
                </select>
              </div>
            )}
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
    </div>
  );
}
