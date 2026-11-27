import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Minus,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Upload,
} from 'lucide-react';
import { uid } from '../engine/presets';
import {
  BUILTIN_PROPS,
  getPropThumbnail,
  PROP_CATEGORIES,
} from '../engine/props';
import {
  getPathThumbnail,
  getPortalThumbnail,
  getWallThumbnail,
} from '../engine/renderer';
import {
  FLOOR_PATTERNS,
  getTextureThumbnail,
  ROOF_STYLES,
  TERRAIN_MATERIALS,
  WALL_STYLES,
} from '../engine/textures';
import { useMapStore } from '../store/useMapStore';
import { useUiPrefs } from '../store/useUiPrefs';
import { NumberSliderRow } from './NumberSliderRow';
import { ClassicTab, StyleOptions, useCyberMode, VariantList } from './VariantContent';
import {
  CYBER_FLOORS,
  CYBER_PATHS,
  CYBER_PORTALS,
  CYBER_ROOFS,
  CYBER_TERRAIN,
  CYBER_WALLS,
  isCyber,
} from '../engine/cyber/catalog';
import type {
  BrushShape,
  PathStyleId,
  PortalKind,
  PropCategory,
  PropLayer,
} from '../types/map';

const BRUSH_SHAPES: { id: BrushShape; label: string; icon: string }[] = [
  { id: 'circle', label: 'Circular', icon: '●' },
  { id: 'square', label: 'Cuadrado', icon: '■' },
  { id: 'rectangle', label: 'Rectangular', icon: '▬' },
  { id: 'hexagon', label: 'Hexagonal', icon: '⬢' },
  { id: 'diamond', label: 'Rombo', icon: '◆' },
  { id: 'octagon', label: 'Octogonal', icon: '⯃' },
];

const PORTAL_LIST: { id: PortalKind; label: string }[] = [
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

const PATH_LIST: { id: PathStyleId; label: string }[] = [
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

const LIGHT_PRESETS = [
  { name: 'Antorcha', color: '#ffae42', radius: 5.5, intensity: 1.05 },
  { name: 'Vela', color: '#ffd27d', radius: 3.2, intensity: 0.85 },
  { name: 'Hoguera', color: '#ff7b24', radius: 6.5, intensity: 1.2 },
  { name: 'Arcano', color: '#4de3e8', radius: 5.0, intensity: 0.9 },
  { name: 'Luna', color: '#b5d6ff', radius: 7.0, intensity: 0.65 },
  { name: 'Sol', color: '#fff3d6', radius: 8.5, intensity: 1.1 },
];

export function ToolDrawer() {
  const activeTool = useMapStore((s) => s.activeTool);
  const ts = useMapStore((s) => s.toolSettings);
  const doc = useMapStore((s) => s.doc);
  const updateTs = useMapStore((s) => s.updateToolSettings);
  const setTerrainBase = useMapStore((s) => s.setTerrainBase);
  const clearTerrainStrokes = useMapStore((s) => s.clearTerrainStrokes);
  const addCustomAsset = useMapStore((s) => s.addCustomAsset);

  const propColumns = useUiPrefs((s) => s.propColumns);
  const leftPanelOpen = useUiPrefs((s) => s.leftPanelOpen);
  const leftPanelWidth = useUiPrefs((s) => s.leftPanelWidth);
  const setPrefs = useUiPrefs((s) => s.setPrefs);
  const toggleLeftPanel = useUiPrefs((s) => s.toggleLeftPanel);

  const [resizing, setResizing] = useState(false);
  const resizeStartRef = useRef<{ x: number; width: number } | null>(null);

  useEffect(() => {
    if (!resizing) return;
    const onMove = (e: PointerEvent) => {
      if (!resizeStartRef.current) return;
      const dx = e.clientX - resizeStartRef.current.x;
      setPrefs({ leftPanelWidth: resizeStartRef.current.width + dx });
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

  const [collapsedCats, setCollapsedCats] = useState<Record<string, boolean>>({
    tavern: true,
    shop: true,
    dungeon: true,
    temple: true,
    magic: true,
    storage: true,
    camp: true,
    nature: true,
    rugs: true,
    lighting: true,
    custom: true,
    // CyberGato: only vehicles start unfolded
    cy_street: true,
    cy_signs: true,
    cy_home: true,
    cy_tech: true,
    cy_nightlife: true,
    cy_industrial: true,
    cy_security: true,
    cy_nature: true,
    cy_lighting: true,
    cy_food: true,
    cy_medical: true,
    cy_transit: true,
    cy_office: true,
  });
  const [propQuery, setPropQuery] = useState('');
  const cyberMode = useCyberMode();
  const uploadRef = useRef<HTMLInputElement>(null);

  const activeLevel =
    doc.levels.find((l) => l.id === doc.activeLevelId) ?? doc.levels[0];

  const groupedProps = useMemo(() => {
    const customList = doc.customAssets.map((a) => ({
      id: `custom:${a.id}`,
      name: a.name,
      category: 'custom' as PropCategory,
      widthTiles: a.widthTiles,
      heightTiles: a.heightTiles,
      defaultLayer: 'above_floor' as PropLayer,
      defaultShadow: true,
      tags: ['custom', 'propio'],
    }));
    const all = [...BUILTIN_PROPS, ...customList];
    const q = propQuery.trim().toLowerCase();

    return PROP_CATEGORIES.map((cat) => {
      const items = all.filter((p) => {
        if (p.category !== cat.id) return false;
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          cat.label.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      });
      return { ...cat, items };
    })
      .filter((g) => cyberMode || !isCyber(g.id))
      .filter((g) => g.items.length > 0 || (g.id === 'custom' && !q && doc.customAssets.length > 0));
  }, [doc.customAssets, propQuery, cyberMode]);

  const toggleCategory = (id: string) => {
    setCollapsedCats((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setAllCollapsed = (collapsed: boolean) => {
    const next: Record<string, boolean> = {};
    for (const c of PROP_CATEGORIES) next[c.id] = collapsed;
    setCollapsedCats(next);
  };

  const handleUploadAsset = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result);
        const img = new Image();
        img.onload = () => {
          const aspect = img.naturalWidth / Math.max(1, img.naturalHeight);
          const widthTiles = Math.max(0.8, Math.min(4, aspect * 1.6));
          const heightTiles = Math.max(0.8, Math.min(4, 1.6));
          addCustomAsset({
            id: uid('asset'),
            name: file.name.replace(/\.[^.]+$/, ''),
            category: 'custom',
            dataUrl,
            widthTiles,
            heightTiles,
          });
          setCollapsedCats((prev) => ({ ...prev, custom: false }));
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const titleMap: Record<typeof activeTool, string> = {
    select: 'Selección',
    terrain: 'Pincel de Terreno',
    water: 'Pincel de Agua',
    building: 'Edificios y Suelos',
    wall: 'Muros Libres',
    portal: 'Puertas y Ventanas',
    path: 'Caminos y Senderos',
    object: 'Biblioteca de Objetos',
    light: 'Iluminación Dinámica',
    roof: 'Tejados',
  };

  if (!leftPanelOpen) {
    return (
      <button
        className="left-reopen-tab"
        onClick={toggleLeftPanel}
        title="Abrir panel izquierdo"
        aria-label="Abrir panel izquierdo"
      >
        <PanelLeftOpen size={16} />
      </button>
    );
  }


  const renderGroups = (groups: typeof groupedProps) =>
    groups.map((group) => {
                const isCollapsed = !propQuery.trim() && !!collapsedCats[group.id];
                return (
                  <div key={group.id} className="accordion-group">
                    <button
                      className="accordion-header"
                      onClick={() => toggleCategory(group.id)}
                      aria-expanded={!isCollapsed}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                        {group.label}
                      </span>
                      <span className="accordion-count">{group.items.length}</span>
                    </button>
                    {!isCollapsed && (
                      <div className="accordion-body">
                        <div
                          className="prop-grid"
                          style={{
                            gridTemplateColumns: `repeat(${propColumns}, minmax(0, 1fr))`,
                          }}
                        >
                          {group.items.map((p) => (
                            <button
                              key={p.id}
                              className={`prop-card ${ts.propId === p.id ? 'active' : ''}`}
                              onClick={() =>
                                updateTs({
                                  propId: p.id,
                                  propLayer: p.defaultLayer,
                                  propShadow: p.defaultShadow,
                                })
                              }
                            >
                              <div className="prop-thumb">
                                <img src={getPropThumbnail(p.id, doc.customAssets)} alt={p.name} />
                              </div>
                              <span
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  width: '100%',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {p.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              });

  return (
    <div className="left-panel-shell" style={{ width: leftPanelWidth }}>
      <aside className="tool-drawer" aria-label="Opciones de herramienta">
        <div className="panel-header">
          <span>{titleMap[activeTool]}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button
              className="topbar-btn"
              style={{ padding: '2px 4px' }}
              onClick={() => setPrefs({ leftPanelWidth: leftPanelWidth - 36 })}
              title="Reducir ancho del panel izquierdo"
              aria-label="Reducir ancho del panel izquierdo"
            >
              <Minus size={12} />
            </button>
            <button
              className="topbar-btn"
              style={{ padding: '2px 4px' }}
              onClick={() => setPrefs({ leftPanelWidth: leftPanelWidth + 36 })}
              title="Aumentar ancho del panel izquierdo"
              aria-label="Aumentar ancho del panel izquierdo"
            >
              <Plus size={12} />
            </button>
            <button
              className="topbar-btn"
              style={{ padding: '2px 4px' }}
              onClick={toggleLeftPanel}
              title="Cerrar panel izquierdo"
              aria-label="Cerrar panel izquierdo"
            >
              <PanelLeftClose size={14} />
            </button>
          </div>
        </div>

      <div className="panel-scroll">
        {activeTool === 'select' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: 12 }}>
              Haz clic sobre cualquier objeto, luz, puerta, muro, habitación o tejado en el mapa para seleccionarlo y editarlo en el panel derecho.
            </p>
            <div className="section-label">Atajos rápidos</div>
            <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>• <b>Arrastrar</b>: Mover elemento</div>
              <div>• <b>Ctrl + D</b>: Duplicar objeto o luz</div>
              <div>• <b>Supr</b>: Eliminar selección</div>
              <div>• <b>Rueda</b>: Zoom centrado en cursor</div>
              <div>• <b>Espacio + Arrastrar</b>: Desplazar vista</div>
            </div>
          </div>
        )}

        {activeTool === 'terrain' && (
          <>
            <div>
              <div className="section-label">Material del Pincel (con el que pintas)</div>
              <VariantList
                classic={TERRAIN_MATERIALS}
                cyber={CYBER_TERRAIN}
                render={(items) => (
                  <div className="swatch-grid">
                {items.map((m) => (
                  <button
                    key={m.id}
                    className={`swatch-card ${ts.terrainMaterial === m.id ? 'active' : ''}`}
                    onClick={() => updateTs({ terrainMaterial: m.id })}
                  >
                    <span
                      className="swatch-preview"
                      style={{ backgroundImage: `url(${getTextureThumbnail('terrain', m.id)})` }}
                    />
                    <span>{m.name}</span>
                  </button>
                ))}
                  </div>
                )}
              />
            </div>

            <div>
              <div className="section-label">Forma del Pincel</div>
              <div className="chip-row">
                {BRUSH_SHAPES.map((b) => (
                  <button
                    key={b.id}
                    className={`chip ${ts.terrainBrushShape === b.id ? 'active' : ''}`}
                    onClick={() => updateTs({ terrainBrushShape: b.id })}
                  >
                    <span style={{ marginRight: 4 }}>{b.icon}</span>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {ts.terrainBrushShape !== 'circle' && (
              <div className="control-row">
                <span>Rotación</span>
                <input
                  type="range"
                  min={0}
                  max={345}
                  step={15}
                  value={ts.terrainBrushAngle}
                  onChange={(e) => updateTs({ terrainBrushAngle: parseInt(e.target.value, 10) })}
                />
                <span className="control-val">{ts.terrainBrushAngle}°</span>
              </div>
            )}

            {ts.terrainBrushShape === 'rectangle' && (
              <div className="control-row">
                <span>Proporción</span>
                <input
                  type="range"
                  min={1.2}
                  max={4.0}
                  step={0.1}
                  value={ts.terrainRectRatio}
                  onChange={(e) => updateTs({ terrainRectRatio: parseFloat(e.target.value) })}
                />
                <span className="control-val">{ts.terrainRectRatio.toFixed(1)}:1</span>
              </div>
            )}

            <div className="control-row">
              <span>Tamaño</span>
              <input
                type="range"
                min={0.5}
                max={6}
                step={0.1}
                value={ts.terrainRadius}
                onChange={(e) => updateTs({ terrainRadius: parseFloat(e.target.value) })}
              />
              <span className="control-val">{ts.terrainRadius.toFixed(1)}</span>
            </div>
            <div className="control-row">
              <span>Opacidad</span>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={ts.terrainOpacity}
                onChange={(e) => updateTs({ terrainOpacity: parseFloat(e.target.value) })}
              />
              <span className="control-val">{Math.round(ts.terrainOpacity * 100)}%</span>
            </div>
            <div className="control-row">
              <span>Suavidad</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={ts.terrainSoftness}
                onChange={(e) => updateTs({ terrainSoftness: parseFloat(e.target.value) })}
              />
              <span className="control-val">{Math.round(ts.terrainSoftness * 100)}%</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="control-row">
                <span>Fondo del mapa</span>
                <select
                  value={activeLevel.terrainBase}
                  onChange={(e) => setTerrainBase(e.target.value as typeof activeLevel.terrainBase)}
                >
                  <StyleOptions classic={TERRAIN_MATERIALS} cyber={CYBER_TERRAIN} value={activeLevel.terrainBase} />
                </select>
              </div>
              {activeLevel.terrainStrokes.length > 0 && (
                <button className="btn-danger" onClick={clearTerrainStrokes}>
                  Borrar trazos de terreno ({activeLevel.terrainStrokes.length})
                </button>
              )}
            </div>
          </>
        )}

        {activeTool === 'water' && (
          <>
            <button
              className={`toggle-btn ${ts.waterErase ? 'active' : ''}`}
              onClick={() => updateTs({ waterErase: !ts.waterErase })}
            >
              <span>Modo Borrador de Agua</span>
              <span>{ts.waterErase ? 'ON' : 'OFF'}</span>
            </button>
            <div>
              <div className="section-label">Forma del Pincel</div>
              <div className="chip-row">
                {BRUSH_SHAPES.map((b) => (
                  <button
                    key={b.id}
                    className={`chip ${ts.waterBrushShape === b.id ? 'active' : ''}`}
                    onClick={() => updateTs({ waterBrushShape: b.id })}
                  >
                    <span style={{ marginRight: 4 }}>{b.icon}</span>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
            {ts.waterBrushShape !== 'circle' && (
              <div className="control-row">
                <span>Rotación</span>
                <input
                  type="range"
                  min={0}
                  max={345}
                  step={15}
                  value={ts.waterBrushAngle}
                  onChange={(e) => updateTs({ waterBrushAngle: parseInt(e.target.value, 10) })}
                />
                <span className="control-val">{ts.waterBrushAngle}°</span>
              </div>
            )}
            {ts.waterBrushShape === 'rectangle' && (
              <div className="control-row">
                <span>Proporción</span>
                <input
                  type="range"
                  min={1.2}
                  max={4.0}
                  step={0.1}
                  value={ts.waterRectRatio}
                  onChange={(e) => updateTs({ waterRectRatio: parseFloat(e.target.value) })}
                />
                <span className="control-val">{ts.waterRectRatio.toFixed(1)}:1</span>
              </div>
            )}
            <div className="control-row">
              <span>Tamaño</span>
              <input
                type="range"
                min={0.4}
                max={5}
                step={0.1}
                value={ts.waterRadius}
                onChange={(e) => updateTs({ waterRadius: parseFloat(e.target.value) })}
              />
              <span className="control-val">{ts.waterRadius.toFixed(1)}</span>
            </div>
            <button
              className={`toggle-btn ${ts.waterDeep ? 'active' : ''}`}
              onClick={() => updateTs({ waterDeep: !ts.waterDeep })}
            >
              <span>Agua Profunda</span>
              <span>{ts.waterDeep ? 'SÍ' : 'NO'}</span>
            </button>
            {ts.waterDeep && (
              <div className="control-row">
                <span>Color Profundo</span>
                <input
                  type="color"
                  value={ts.waterDeepColor}
                  onChange={(e) => updateTs({ waterDeepColor: e.target.value })}
                />
              </div>
            )}
            <div className="control-row">
              <span>Orilla Somera</span>
              <input
                type="color"
                value={ts.waterShallowColor}
                onChange={(e) => updateTs({ waterShallowColor: e.target.value })}
              />
            </div>
          </>
        )}

        {activeTool === 'building' && (
          <>
            <div>
              <div className="section-label">Modo de Dibujo</div>
              <div className="chip-row">
                <button
                  className={`chip ${ts.buildingMode === 'rect' ? 'active' : ''}`}
                  onClick={() => updateTs({ buildingMode: 'rect' })}
                >
                  Rectángulo
                </button>
                <button
                  className={`chip ${ts.buildingMode === 'polygon' ? 'active' : ''}`}
                  onClick={() => updateTs({ buildingMode: 'polygon' })}
                >
                  Polígono Libre
                </button>
              </div>
            </div>

            <div>
              <div className="section-label">Suelo Interior</div>
              <VariantList
                classic={FLOOR_PATTERNS}
                cyber={CYBER_FLOORS}
                render={(items) => (
                  <div className="swatch-grid">
                {items.map((f) => (
                  <button
                    key={f.id}
                    className={`swatch-card ${ts.floorPattern === f.id ? 'active' : ''}`}
                    onClick={() => updateTs({ floorPattern: f.id })}
                  >
                    <span
                      className="swatch-preview"
                      style={{ backgroundImage: `url(${getTextureThumbnail('floor', f.id)})` }}
                    />
                    <span>{f.name}</span>
                  </button>
                ))}
                  </div>
                )}
              />
            </div>

            <div>
              <div className="section-label">Muros Perimetrales</div>
              <VariantList
                classic={WALL_STYLES}
                cyber={CYBER_WALLS}
                render={(items) => (
                  <div className="swatch-grid">
                <button
                  className={`swatch-card ${ts.buildingWallStyle === null ? 'active' : ''}`}
                  onClick={() => updateTs({ buildingWallStyle: null })}
                >
                  <span
                    className="swatch-preview large"
                    style={{ backgroundImage: `url(${getTextureThumbnail('floor', 'wood_planks')})` }}
                  />
                  <span>Sin Muro</span>
                </button>
                {items.map((w) => (
                  <button
                    key={w.id}
                    className={`swatch-card ${ts.buildingWallStyle === w.id ? 'active' : ''}`}
                    onClick={() => updateTs({ buildingWallStyle: w.id })}
                  >
                    <span
                      className="swatch-preview large"
                      style={{ backgroundImage: `url(${getWallThumbnail(w.id)})` }}
                    />
                    <span>{w.name}</span>
                  </button>
                ))}
                  </div>
                )}
              />
            </div>

            <div className="control-row">
              <span>Grosor Muro</span>
              <input
                type="range"
                min={0.12}
                max={0.45}
                step={0.02}
                value={ts.wallThickness}
                onChange={(e) => updateTs({ wallThickness: parseFloat(e.target.value) })}
              />
              <span className="control-val">{ts.wallThickness.toFixed(2)}</span>
            </div>
          </>
        )}

        {activeTool === 'wall' && (
          <>
            <div>
              <div className="section-label">Estilo de Muro</div>
              <VariantList
                classic={WALL_STYLES}
                cyber={CYBER_WALLS}
                render={(items) => (
                  <div className="swatch-grid">
                {items.map((w) => (
                  <button
                    key={w.id}
                    className={`swatch-card ${ts.wallStyle === w.id ? 'active' : ''}`}
                    onClick={() => updateTs({ wallStyle: w.id })}
                  >
                    <span
                      className="swatch-preview large"
                      style={{ backgroundImage: `url(${getWallThumbnail(w.id)})` }}
                    />
                    <span>{w.name}</span>
                  </button>
                ))}
                  </div>
                )}
              />
            </div>
            <div className="control-row">
              <span>Grosor</span>
              <input
                type="range"
                min={0.12}
                max={0.45}
                step={0.02}
                value={ts.wallThickness}
                onChange={(e) => updateTs({ wallThickness: parseFloat(e.target.value) })}
              />
              <span className="control-val">{ts.wallThickness.toFixed(2)}</span>
            </div>
            <button
              className={`toggle-btn ${ts.wallCastShadows ? 'active' : ''}`}
              onClick={() => updateTs({ wallCastShadows: !ts.wallCastShadows })}
            >
              <span>Bloquea Luz y Sombras</span>
              <span>{ts.wallCastShadows ? 'SÍ' : 'NO'}</span>
            </button>
          </>
        )}

        {activeTool === 'portal' && (
          <>
            <div>
              <div className="section-label">Tipo de Portal</div>
              <VariantList
                classic={PORTAL_LIST}
                cyber={CYBER_PORTALS}
                render={(items) => (
                  <div className="swatch-grid">
                {items.map((p) => (
                  <button
                    key={p.id}
                    className={`swatch-card ${ts.portalKind === p.id ? 'active' : ''}`}
                    onClick={() => updateTs({ portalKind: p.id })}
                  >
                    <span
                      className="swatch-preview large"
                      style={{ backgroundImage: `url(${getPortalThumbnail(p.id)})` }}
                    />
                    <span>{p.label}</span>
                  </button>
                ))}
                  </div>
                )}
              />
            </div>
            <NumberSliderRow
              label="Ancho"
              value={ts.portalWidth}
              min={0.6}
              max={3.0}
              step={0.1}
              decimals={1}
              onChange={(v) => updateTs({ portalWidth: v })}
            />
            <button
              className={`toggle-btn ${ts.portalOpen ? 'active' : ''}`}
              onClick={() => updateTs({ portalOpen: !ts.portalOpen })}
            >
              <span>Puerta Abierta (pasa luz)</span>
              <span>{ts.portalOpen ? 'SÍ' : 'NO'}</span>
            </button>
            {ts.portalOpen && (
              <NumberSliderRow
                label="Apertura"
                value={ts.portalOpenAngle}
                min={5}
                max={180}
                step={5}
                decimals={0}
                suffix="°"
                onChange={(v) => updateTs({ portalOpenAngle: Math.max(5, Math.min(180, v)) })}
              />
            )}
          </>
        )}

        {activeTool === 'path' && (
          <>
            <div>
              <div className="section-label">Estilo de Camino</div>
              <VariantList
                classic={PATH_LIST}
                cyber={CYBER_PATHS}
                render={(items) => (
                  <div className="swatch-grid">
                {items.map((p) => (
                  <button
                    key={p.id}
                    className={`swatch-card ${ts.pathStyle === p.id ? 'active' : ''}`}
                    onClick={() => updateTs({ pathStyle: p.id })}
                  >
                    <span
                      className="swatch-preview"
                      style={{ backgroundImage: `url(${getPathThumbnail(p.id)})` }}
                    />
                    <span>{p.label}</span>
                  </button>
                ))}
                  </div>
                )}
              />
            </div>
            <div className="control-row">
              <span>Ancho</span>
              <input
                type="range"
                min={0.4}
                max={3.5}
                step={0.1}
                value={ts.pathWidth}
                onChange={(e) => updateTs({ pathWidth: parseFloat(e.target.value) })}
              />
              <span className="control-val">{ts.pathWidth.toFixed(1)}</span>
            </div>
            <button
              className={`toggle-btn ${ts.pathSmooth ? 'active' : ''}`}
              onClick={() => updateTs({ pathSmooth: !ts.pathSmooth })}
            >
              <span>Curva Suavizada</span>
              <span>{ts.pathSmooth ? 'SÍ' : 'NO'}</span>
            </button>
          </>
        )}

        {activeTool === 'object' && (
          <>
            <input
              type="search"
              placeholder={cyberMode ? 'Buscar coche, neón, servidor, contenedor...' : 'Buscar cama, taberna, tienda, trampa...'}
              value={propQuery}
              onChange={(e) => setPropQuery(e.target.value)}
            />

            <button
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              onClick={() => uploadRef.current?.click()}
            >
              <Upload size={14} />
              Importar PNG / WebP propio
            </button>
            <input
              ref={uploadRef}
              type="file"
              accept="image/png,image/webp,image/svg+xml"
              multiple
              style={{ display: 'none' }}
              onChange={handleUploadAsset}
            />

            <div className="control-row">
              <span>Escala</span>
              <input
                type="range"
                min={0.35}
                max={2.5}
                step={0.05}
                value={ts.propScale}
                onChange={(e) => updateTs({ propScale: parseFloat(e.target.value) })}
              />
              <span className="control-val">{ts.propScale.toFixed(2)}x</span>
            </div>
            <div className="control-row">
              <span>Rotación</span>
              <input
                type="range"
                min={0}
                max={345}
                step={15}
                value={ts.propRotationDeg}
                onChange={(e) => updateTs({ propRotationDeg: parseInt(e.target.value, 10) })}
              />
              <span className="control-val">{ts.propRotationDeg}°</span>
            </div>

            <button
              className={`toggle-btn ${ts.propScatter ? 'active' : ''}`}
              onClick={() => updateTs({ propScatter: !ts.propScatter })}
            >
              <span>Pincel Dispersión (Bosques)</span>
              <span>{ts.propScatter ? 'ON' : 'OFF'}</span>
            </button>

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, padding: '4px 6px', fontSize: 11 }}
                onClick={() => setAllCollapsed(false)}
              >
                Descomprimir todo
              </button>
              <button
                className="btn-secondary"
                style={{ flex: 1, padding: '4px 6px', fontSize: 11 }}
                onClick={() => setAllCollapsed(true)}
              >
                Comprimir todo
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {cyberMode ? renderGroups(groupedProps.filter((g) => isCyber(g.id))) : renderGroups(groupedProps)}
              {cyberMode && (
                <ClassicTab
                  count={groupedProps.filter((g) => !isCyber(g.id)).reduce((n, g) => n + g.items.length, 0)}
                  open={!!propQuery.trim()}
                >
                  {() => renderGroups(groupedProps.filter((g) => !isCyber(g.id)))}
                </ClassicTab>
              )}
            </div>
          </>
        )}

        {activeTool === 'light' && (
          <>
            <div>
              <div className="section-label">Preajustes de Luz</div>
              <div className="chip-row">
                {LIGHT_PRESETS.map((lp) => (
                  <button
                    key={lp.name}
                    className="chip"
                    onClick={() =>
                      updateTs({
                        lightColor: lp.color,
                        lightRadius: lp.radius,
                        lightIntensity: lp.intensity,
                      })
                    }
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: lp.color,
                        marginRight: 5,
                      }}
                    />
                    {lp.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="control-row">
              <span>Color</span>
              <input
                type="color"
                value={ts.lightColor}
                onChange={(e) => updateTs({ lightColor: e.target.value })}
              />
            </div>
            <div className="control-row">
              <span>Radio</span>
              <input
                type="range"
                min={1.5}
                max={14}
                step={0.5}
                value={ts.lightRadius}
                onChange={(e) => updateTs({ lightRadius: parseFloat(e.target.value) })}
              />
              <span className="control-val">{ts.lightRadius.toFixed(1)}</span>
            </div>
            <div className="control-row">
              <span>Intensidad</span>
              <input
                type="range"
                min={0.2}
                max={1.8}
                step={0.05}
                value={ts.lightIntensity}
                onChange={(e) => updateTs({ lightIntensity: parseFloat(e.target.value) })}
              />
              <span className="control-val">{Math.round(ts.lightIntensity * 100)}%</span>
            </div>
            <button
              className={`toggle-btn ${ts.lightShadows ? 'active' : ''}`}
              onClick={() => updateTs({ lightShadows: !ts.lightShadows })}
            >
              <span>Proyectar Sombras</span>
              <span>{ts.lightShadows ? 'SÍ' : 'NO'}</span>
            </button>
          </>
        )}

        {activeTool === 'roof' && (
          <>
            <div>
              <div className="section-label">Estilo de Tejado</div>
              <VariantList
                classic={ROOF_STYLES}
                cyber={CYBER_ROOFS}
                render={(items) => (
                  <div className="swatch-grid">
                {items.map((r) => (
                  <button
                    key={r.id}
                    className={`swatch-card ${ts.roofStyle === r.id ? 'active' : ''}`}
                    onClick={() => updateTs({ roofStyle: r.id })}
                  >
                    <span
                      className="swatch-preview"
                      style={{ backgroundImage: `url(${getTextureThumbnail('roof', r.id)})` }}
                    />
                    <span>{r.name}</span>
                  </button>
                ))}
                  </div>
                )}
              />
            </div>
            <div className="control-row">
              <span>Opacidad</span>
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.05}
                value={ts.roofOpacity}
                onChange={(e) => updateTs({ roofOpacity: parseFloat(e.target.value) })}
              />
              <span className="control-val">{Math.round(ts.roofOpacity * 100)}%</span>
            </div>
          </>
        )}
      </div>
    </aside>
      <div
        className={`left-resize-handle ${resizing ? 'dragging' : ''}`}
        onPointerDown={(e) => {
          e.preventDefault();
          resizeStartRef.current = { x: e.clientX, width: leftPanelWidth };
          setResizing(true);
        }}
        title="Arrastra para redimensionar el panel izquierdo"
        role="separator"
        aria-orientation="vertical"
      />
    </div>
  );
}
