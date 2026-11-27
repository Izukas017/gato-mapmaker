import { create } from 'zustand';
import type {
  AmbientSettings,
  BrushShape,
  CustomAsset,
  FloorPatternId,
  GridSettings,
  LayerVisibility,
  LightSource,
  MapDocument,
  MapLevel,
  MapObject,
  PathItem,
  PathStyleId,
  Point,
  PortalItem,
  PortalKind,
  PropLayer,
  RoofShape,
  RoofStyleId,
  RoomShape,
  SelectionRef,
  TerrainMaterialId,
  TerrainStroke,
  ToolId,
  WallPolyline,
  WallStyleId,
  WaterStroke,
} from '../types/map';
import {
  createBlankMap,
  createCobblestoneQuarterPreset,
  createSanctuaryPreset,
  uid,
} from '../engine/presets';
import { useUiPrefs } from './useUiPrefs';

export interface ToolSettings {
  // Terrain
  terrainMaterial: TerrainMaterialId;
  terrainRadius: number;
  terrainOpacity: number;
  terrainSoftness: number;
  terrainBrushShape: BrushShape;
  terrainBrushAngle: number;
  terrainRectRatio: number;
  // Water
  waterRadius: number;
  waterDeepColor: string;
  waterShallowColor: string;
  waterErase: boolean;
  waterBrushShape: BrushShape;
  waterBrushAngle: number;
  waterRectRatio: number;
  // Building / Room
  buildingMode: 'rect' | 'polygon';
  floorPattern: FloorPatternId;
  buildingWallStyle: WallStyleId | null;
  wallThickness: number;
  // Wall
  wallStyle: WallStyleId;
  wallCastShadows: boolean;
  // Portal
  portalKind: PortalKind;
  portalWidth: number;
  portalOpen: boolean;
  portalOpenAngle: number;
  // Path
  pathStyle: PathStyleId;
  pathWidth: number;
  pathSmooth: boolean;
  // Object / Prop
  propId: string;
  propScale: number;
  propRotationDeg: number;
  propLayer: PropLayer;
  propShadow: boolean;
  propScatter: boolean;
  // Light
  lightColor: string;
  lightRadius: number;
  lightIntensity: number;
  lightShadows: boolean;
  // Roof
  roofStyle: RoofStyleId;
  roofOpacity: number;
}

type ClipboardEntry =
  | { kind: 'object'; data: MapObject }
  | { kind: 'light'; data: LightSource }
  | { kind: 'portal'; data: PortalItem }
  | { kind: 'room'; data: RoomShape }
  | { kind: 'wall'; data: WallPolyline }
  | { kind: 'path'; data: PathItem }
  | { kind: 'roof'; data: RoofShape };

interface MapStoreState {
  doc: MapDocument;
  past: MapDocument[];
  future: MapDocument[];
  activeTool: ToolId;
  toolSettings: ToolSettings;
  selection: SelectionRef | null;
  selectedItems: SelectionRef[];
  clipboard: ClipboardEntry[];
  pasteCount: number;
  zoom: number;
  panX: number;
  panY: number;
  cursorTile: { x: number; y: number } | null;

  // Tool & View
  setTool: (tool: ToolId) => void;
  updateToolSettings: (patch: Partial<ToolSettings>) => void;
  setSelection: (sel: SelectionRef | null) => void;
  toggleSelectionItem: (sel: SelectionRef) => void;
  setSelectedItems: (items: SelectionRef[]) => void;
  setViewport: (zoom: number, panX: number, panY: number) => void;
  setCursorTile: (pt: { x: number; y: number } | null) => void;

  // History
  undo: () => void;
  redo: () => void;

  // Document-level actions
  loadPreset: (preset: 'sanctuary' | 'quarter' | 'blank') => void;
  createNewMap: (name: string, width: number, height: number, terrain: TerrainMaterialId) => void;
  loadDocument: (doc: MapDocument) => void;
  setMapName: (name: string) => void;
  updateMapMeta: (patch: Partial<Pick<MapDocument, 'width' | 'height' | 'pixelsPerGrid'>>) => void;
  updateAmbient: (patch: Partial<AmbientSettings>) => void;
  updateGrid: (patch: Partial<GridSettings>) => void;
  toggleLayer: (key: keyof LayerVisibility) => void;

  // Levels
  setActiveLevel: (id: string) => void;
  addLevel: (name: string) => void;
  deleteLevel: (id: string) => void;

  // Custom assets
  addCustomAsset: (asset: CustomAsset) => void;

  // Map mutations (each pushes undo snapshot)
  setTerrainBase: (material: TerrainMaterialId) => void;
  addTerrainStroke: (stroke: TerrainStroke) => void;
  clearTerrainStrokes: () => void;
  addWaterStroke: (stroke: WaterStroke) => void;
  addRoom: (room: RoomShape) => void;
  addWall: (wall: WallPolyline) => void;
  addPortal: (portal: PortalItem) => void;
  addPath: (path: PathItem) => void;
  addObject: (obj: MapObject) => void;
  addLight: (light: LightSource) => void;
  addRoof: (roof: RoofShape) => void;

  // Selection updates
  updateSelectedObject: (patch: Partial<MapObject>, recordUndo?: boolean) => void;
  reorderSelectedObject: (direction: 'front' | 'back') => void;
  updateSelectedLight: (patch: Partial<LightSource>, recordUndo?: boolean) => void;
  updateSelectedPortal: (patch: Partial<PortalItem>, recordUndo?: boolean) => void;
  updateSelectedRoom: (patch: Partial<RoomShape>, recordUndo?: boolean) => void;
  updateSelectedWall: (patch: Partial<WallPolyline>, recordUndo?: boolean) => void;
  updateSelectedPath: (patch: Partial<PathItem>, recordUndo?: boolean) => void;
  updateSelectedRoof: (patch: Partial<RoofShape>, recordUndo?: boolean) => void;
  moveSelectedBy: (dx: number, dy: number, recordUndo?: boolean) => void;
  copySelected: () => void;
  pasteClipboard: (targetTile?: Point | null) => void;
  duplicateSelected: () => void;
  deleteSelected: () => void;
}

const MAX_HISTORY = 40;
const STORAGE_KEY = 'gato_mapmaker_last_map_v1';

export function loadInitialDocument(): MapDocument {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as MapDocument;
        if (
          parsed &&
          Array.isArray(parsed.levels) &&
          parsed.levels.length > 0 &&
          typeof parsed.width === 'number' &&
          parsed.width > 0 &&
          typeof parsed.height === 'number' &&
          parsed.height > 0
        ) {
          return parsed;
        }
      }
    }
  } catch {
    // Ignore storage read/parse errors and fall back to a blank map
  }
  return createBlankMap();
}

export function persistDocument(doc: MapDocument): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
    }
  } catch {
    // Ignore quota or storage errors
  }
}

export function clearSavedMap(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

function updateActiveLevel(
  doc: MapDocument,
  updater: (level: MapLevel) => MapLevel
): MapDocument {
  return {
    ...doc,
    levels: doc.levels.map((l) => (l.id === doc.activeLevelId ? updater(l) : l)),
  };
}

function pushCommit(
  state: MapStoreState,
  nextDoc: MapDocument
): Partial<MapStoreState> {
  const past = [...state.past.slice(-(MAX_HISTORY - 1)), state.doc];
  return {
    doc: nextDoc,
    past,
    future: [],
  };
}

export const useMapStore = create<MapStoreState>((set, get) => ({
  doc: loadInitialDocument(),
  past: [],
  future: [],
  activeTool: 'select',
  toolSettings: {
    terrainMaterial: 'cobblestone',
    terrainRadius: 1.8,
    terrainOpacity: 1.0,
    terrainSoftness: 0.35,
    terrainBrushShape: 'circle',
    terrainBrushAngle: 0,
    terrainRectRatio: 2.0,
    waterRadius: 1.5,
    waterDeepColor: '#1a5a6e',
    waterShallowColor: '#3d99ad',
    waterErase: false,
    waterBrushShape: 'circle',
    waterBrushAngle: 0,
    waterRectRatio: 2.0,
    buildingMode: 'rect',
    floorPattern: 'wood_planks',
    buildingWallStyle: 'stone_hewn',
    wallThickness: 0.24,
    wallStyle: 'stone_hewn',
    wallCastShadows: true,
    portalKind: 'door_wood',
    portalWidth: 1.1,
    portalOpen: false,
    portalOpenAngle: 75,
    pathStyle: 'dirt_road',
    pathWidth: 1.4,
    pathSmooth: true,
    propId: 'bed_teal',
    propScale: 1,
    propRotationDeg: 0,
    propLayer: 'above_floor',
    propShadow: true,
    propScatter: false,
    lightColor: '#ffae42',
    lightRadius: 5.5,
    lightIntensity: 1.0,
    lightShadows: true,
    roofStyle: 'slate_blue',
    roofOpacity: 1,
  },
  selection: null,
  selectedItems: [],
  clipboard: [],
  pasteCount: 0,
  zoom: 0.55,
  panX: 80,
  panY: 20,
  cursorTile: null,

  setTool: (tool) => set({ activeTool: tool }),
  updateToolSettings: (patch) =>
    set((s) => ({ toolSettings: { ...s.toolSettings, ...patch } })),
  setSelection: (selection) =>
    set({
      selection,
      selectedItems: selection ? [selection] : [],
    }),
  toggleSelectionItem: (sel) =>
    set((s) => {
      const exists = s.selectedItems.some(
        (it) => it.kind === sel.kind && it.id === sel.id
      );
      const next = exists
        ? s.selectedItems.filter((it) => !(it.kind === sel.kind && it.id === sel.id))
        : [...s.selectedItems, sel];
      return {
        selectedItems: next,
        selection: next.length > 0 ? next[next.length - 1] : null,
      };
    }),
  setSelectedItems: (items) =>
    set({
      selectedItems: items,
      selection: items.length > 0 ? items[items.length - 1] : null,
    }),
  setViewport: (zoom, panX, panY) => set({ zoom, panX, panY }),
  setCursorTile: (cursorTile) => set({ cursorTile }),

  undo: () =>
    set((s) => {
      if (s.past.length === 0) return s;
      const previous = s.past[s.past.length - 1];
      return {
        doc: previous,
        past: s.past.slice(0, -1),
        future: [s.doc, ...s.future.slice(0, MAX_HISTORY - 1)],
        selection: null,
      };
    }),

  redo: () =>
    set((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[0];
      return {
        doc: next,
        past: [...s.past, s.doc],
        future: s.future.slice(1),
        selection: null,
      };
    }),

  loadPreset: (preset) => {
    const doc =
      preset === 'sanctuary'
        ? createSanctuaryPreset()
        : preset === 'quarter'
          ? createCobblestoneQuarterPreset()
          : createBlankMap();
    set({ doc, past: [], future: [], selection: null, selectedItems: [] });
  },

  createNewMap: (name, width, height, terrain) => {
    const doc = createBlankMap(name, width, height, terrain);
    set({ doc, past: [], future: [], selection: null, selectedItems: [] });
  },

  loadDocument: (doc) => set({ doc, past: [], future: [], selection: null, selectedItems: [] }),

  setMapName: (name) =>
    set((s) => ({ doc: { ...s.doc, name } })),

  updateMapMeta: (patch) =>
    set((s) => ({
      doc: { ...s.doc, ...patch },
    })),

  updateAmbient: (patch) =>
    set((s) => ({
      doc: { ...s.doc, ambient: { ...s.doc.ambient, ...patch } },
    })),

  updateGrid: (patch) =>
    set((s) => ({
      doc: { ...s.doc, grid: { ...s.doc.grid, ...patch } },
    })),

  toggleLayer: (key) =>
    set((s) => ({
      doc: {
        ...s.doc,
        layers: { ...s.doc.layers, [key]: !s.doc.layers[key] },
      },
    })),

  setActiveLevel: (id) =>
    set((s) => ({ doc: { ...s.doc, activeLevelId: id }, selection: null })),

  addLevel: (name) =>
    set((s) => {
      const id = uid('lvl');
      const newLevel: MapLevel = {
        id,
        name,
        terrainBase: 'dirt',
        terrainStrokes: [],
        waterStrokes: [],
        rooms: [],
        walls: [],
        portals: [],
        paths: [],
        objects: [],
        lights: [],
        roofs: [],
      };
      return pushCommit(s, {
        ...s.doc,
        activeLevelId: id,
        levels: [...s.doc.levels, newLevel],
      });
    }),

  deleteLevel: (id) =>
    set((s) => {
      if (s.doc.levels.length <= 1) return s;
      const levels = s.doc.levels.filter((l) => l.id !== id);
      const activeLevelId =
        s.doc.activeLevelId === id ? levels[0].id : s.doc.activeLevelId;
      return pushCommit(s, { ...s.doc, levels, activeLevelId });
    }),

  addCustomAsset: (asset) =>
    set((s) => ({
      doc: {
        ...s.doc,
        customAssets: [...s.doc.customAssets, asset],
      },
      toolSettings: {
        ...s.toolSettings,
        propId: `custom:${asset.id}`,
      },
    })),

  setTerrainBase: (material) =>
    set((s) =>
      pushCommit(
        s,
        updateActiveLevel(s.doc, (l) => ({ ...l, terrainBase: material }))
      )
    ),

  addTerrainStroke: (stroke) =>
    set((s) =>
      pushCommit(
        s,
        updateActiveLevel(s.doc, (l) => ({
          ...l,
          terrainStrokes: [...l.terrainStrokes, stroke],
        }))
      )
    ),

  clearTerrainStrokes: () =>
    set((s) =>
      pushCommit(
        s,
        updateActiveLevel(s.doc, (l) => ({
          ...l,
          terrainStrokes: [],
        }))
      )
    ),

  addWaterStroke: (stroke) =>
    set((s) =>
      pushCommit(
        s,
        updateActiveLevel(s.doc, (l) => ({
          ...l,
          waterStrokes: [...l.waterStrokes, stroke],
        }))
      )
    ),

  addRoom: (room) =>
    set((s) =>
      pushCommit(
        s,
        updateActiveLevel(s.doc, (l) => ({
          ...l,
          rooms: [...l.rooms, room],
        }))
      )
    ),

  addWall: (wall) =>
    set((s) =>
      pushCommit(
        s,
        updateActiveLevel(s.doc, (l) => ({
          ...l,
          walls: [...l.walls, wall],
        }))
      )
    ),

  addPortal: (portal) =>
    set((s) =>
      pushCommit(
        s,
        updateActiveLevel(s.doc, (l) => ({
          ...l,
          portals: [...l.portals, portal],
        }))
      )
    ),

  addPath: (path) =>
    set((s) =>
      pushCommit(
        s,
        updateActiveLevel(s.doc, (l) => ({
          ...l,
          paths: [...l.paths, path],
        }))
      )
    ),

  addObject: (obj) =>
    set((s) =>
      pushCommit(
        s,
        updateActiveLevel(s.doc, (l) => ({
          ...l,
          objects: [...l.objects, obj],
        }))
      )
    ),

  addLight: (light) =>
    set((s) =>
      pushCommit(
        s,
        updateActiveLevel(s.doc, (l) => ({
          ...l,
          lights: [...l.lights, light],
        }))
      )
    ),

  addRoof: (roof) =>
    set((s) =>
      pushCommit(
        s,
        updateActiveLevel(s.doc, (l) => ({
          ...l,
          roofs: [...l.roofs, roof],
        }))
      )
    ),

  updateSelectedObject: (patch, recordUndo = true) =>
    set((s) => {
      if (s.selection?.kind !== 'object') return s;
      const id = s.selection.id;
      const next = updateActiveLevel(s.doc, (l) => ({
        ...l,
        objects: l.objects.map((o) => (o.id === id ? { ...o, ...patch } : o)),
      }));
      return recordUndo ? pushCommit(s, next) : { doc: next };
    }),

  reorderSelectedObject: (direction) =>
    set((s) => {
      if (s.selection?.kind !== 'object') return s;
      const id = s.selection.id;
      const next = updateActiveLevel(s.doc, (l) => {
        const idx = l.objects.findIndex((o) => o.id === id);
        if (idx === -1) return l;
        const copy = [...l.objects];
        const [item] = copy.splice(idx, 1);
        if (direction === 'front') copy.push(item);
        else copy.unshift(item);
        return { ...l, objects: copy };
      });
      return pushCommit(s, next);
    }),

  updateSelectedLight: (patch, recordUndo = true) =>
    set((s) => {
      if (s.selection?.kind !== 'light') return s;
      const id = s.selection.id;
      const next = updateActiveLevel(s.doc, (l) => ({
        ...l,
        lights: l.lights.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      }));
      return recordUndo ? pushCommit(s, next) : { doc: next };
    }),

  updateSelectedPortal: (patch, recordUndo = true) =>
    set((s) => {
      if (s.selection?.kind !== 'portal') return s;
      const id = s.selection.id;
      const next = updateActiveLevel(s.doc, (l) => ({
        ...l,
        portals: l.portals.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      }));
      return recordUndo ? pushCommit(s, next) : { doc: next };
    }),

  updateSelectedRoom: (patch, recordUndo = true) =>
    set((s) => {
      if (s.selection?.kind !== 'room') return s;
      const id = s.selection.id;
      const next = updateActiveLevel(s.doc, (l) => ({
        ...l,
        rooms: l.rooms.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      }));
      return recordUndo ? pushCommit(s, next) : { doc: next };
    }),

  updateSelectedWall: (patch, recordUndo = true) =>
    set((s) => {
      if (s.selection?.kind !== 'wall') return s;
      const id = s.selection.id;
      const next = updateActiveLevel(s.doc, (l) => ({
        ...l,
        walls: l.walls.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      }));
      return recordUndo ? pushCommit(s, next) : { doc: next };
    }),

  updateSelectedPath: (patch, recordUndo = true) =>
    set((s) => {
      if (s.selection?.kind !== 'path') return s;
      const id = s.selection.id;
      const next = updateActiveLevel(s.doc, (l) => ({
        ...l,
        paths: l.paths.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      }));
      return recordUndo ? pushCommit(s, next) : { doc: next };
    }),

  updateSelectedRoof: (patch, recordUndo = true) =>
    set((s) => {
      if (s.selection?.kind !== 'roof') return s;
      const id = s.selection.id;
      const next = updateActiveLevel(s.doc, (l) => ({
        ...l,
        roofs: l.roofs.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      }));
      return recordUndo ? pushCommit(s, next) : { doc: next };
    }),

  moveSelectedBy: (dx, dy, recordUndo = false) =>
    set((s) => {
      const items =
        s.selectedItems.length > 0
          ? s.selectedItems
          : s.selection
            ? [s.selection]
            : [];
      if (items.length === 0) return s;

      const idsByKind = {
        object: new Set(items.filter((i) => i.kind === 'object').map((i) => i.id)),
        light: new Set(items.filter((i) => i.kind === 'light').map((i) => i.id)),
        portal: new Set(items.filter((i) => i.kind === 'portal').map((i) => i.id)),
        room: new Set(items.filter((i) => i.kind === 'room').map((i) => i.id)),
        wall: new Set(items.filter((i) => i.kind === 'wall').map((i) => i.id)),
        path: new Set(items.filter((i) => i.kind === 'path').map((i) => i.id)),
        roof: new Set(items.filter((i) => i.kind === 'roof').map((i) => i.id)),
      };

      const next = updateActiveLevel(s.doc, (l) => ({
        ...l,
        objects: idsByKind.object.size
          ? l.objects.map((o) =>
              idsByKind.object.has(o.id) ? { ...o, x: o.x + dx, y: o.y + dy } : o
            )
          : l.objects,
        lights: idsByKind.light.size
          ? l.lights.map((it) =>
              idsByKind.light.has(it.id) ? { ...it, x: it.x + dx, y: it.y + dy } : it
            )
          : l.lights,
        portals: idsByKind.portal.size
          ? l.portals.map((it) =>
              idsByKind.portal.has(it.id) ? { ...it, x: it.x + dx, y: it.y + dy } : it
            )
          : l.portals,
        rooms: idsByKind.room.size
          ? l.rooms.map((it) =>
              idsByKind.room.has(it.id)
                ? { ...it, points: it.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) }
                : it
            )
          : l.rooms,
        walls: idsByKind.wall.size
          ? l.walls.map((it) =>
              idsByKind.wall.has(it.id)
                ? { ...it, points: it.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) }
                : it
            )
          : l.walls,
        paths: idsByKind.path.size
          ? l.paths.map((it) =>
              idsByKind.path.has(it.id)
                ? { ...it, points: it.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) }
                : it
            )
          : l.paths,
        roofs: idsByKind.roof.size
          ? l.roofs.map((it) =>
              idsByKind.roof.has(it.id)
                ? { ...it, points: it.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) }
                : it
            )
          : l.roofs,
      }));
      return recordUndo ? pushCommit(s, next) : { doc: next };
    }),

  copySelected: () => {
    const s = get();
    const items =
      s.selectedItems.length > 0
        ? s.selectedItems
        : s.selection
          ? [s.selection]
          : [];
    if (items.length === 0) return;
    const level = s.doc.levels.find((l) => l.id === s.doc.activeLevelId);
    if (!level) return;

    const entries: ClipboardEntry[] = [];
    for (const ref of items) {
      if (ref.kind === 'object') {
        const it = level.objects.find((o) => o.id === ref.id);
        if (it) entries.push({ kind: 'object', data: structuredClone(it) });
      } else if (ref.kind === 'light') {
        const it = level.lights.find((o) => o.id === ref.id);
        if (it) entries.push({ kind: 'light', data: structuredClone(it) });
      } else if (ref.kind === 'portal') {
        const it = level.portals.find((o) => o.id === ref.id);
        if (it) entries.push({ kind: 'portal', data: structuredClone(it) });
      } else if (ref.kind === 'room') {
        const it = level.rooms.find((o) => o.id === ref.id);
        if (it) entries.push({ kind: 'room', data: structuredClone(it) });
      } else if (ref.kind === 'wall') {
        const it = level.walls.find((o) => o.id === ref.id);
        if (it) entries.push({ kind: 'wall', data: structuredClone(it) });
      } else if (ref.kind === 'path') {
        const it = level.paths.find((o) => o.id === ref.id);
        if (it) entries.push({ kind: 'path', data: structuredClone(it) });
      } else if (ref.kind === 'roof') {
        const it = level.roofs.find((o) => o.id === ref.id);
        if (it) entries.push({ kind: 'roof', data: structuredClone(it) });
      }
    }
    if (entries.length > 0) {
      set({ clipboard: entries, pasteCount: 0 });
    }
  },

  pasteClipboard: (targetTile) =>
    set((s) => {
      if (s.clipboard.length === 0) return s;
      const step = s.pasteCount + 1;

      // Compute center of clipboard items so pasting at cursor preserves relative layout
      let sumX = 0;
      let sumY = 0;
      let count = 0;
      for (const entry of s.clipboard) {
        if (entry.kind === 'object' || entry.kind === 'light' || entry.kind === 'portal') {
          sumX += entry.data.x;
          sumY += entry.data.y;
          count += 1;
        } else {
          for (const p of entry.data.points) {
            sumX += p.x;
            sumY += p.y;
            count += 1;
          }
        }
      }
      const cx = count > 0 ? sumX / count : 0;
      const cy = count > 0 ? sumY / count : 0;
      const dx = targetTile ? targetTile.x - cx : 0.7 * step;
      const dy = targetTile ? targetTile.y - cy : 0.7 * step;

      const newRefs: SelectionRef[] = [];
      const newObjects: MapObject[] = [];
      const newLights: LightSource[] = [];
      const newPortals: PortalItem[] = [];
      const newRooms: RoomShape[] = [];
      const newWalls: WallPolyline[] = [];
      const newPaths: PathItem[] = [];
      const newRoofs: RoofShape[] = [];

      for (const entry of s.clipboard) {
        if (entry.kind === 'object') {
          const id = uid('obj');
          newObjects.push({
            ...structuredClone(entry.data),
            id,
            x: entry.data.x + dx,
            y: entry.data.y + dy,
          });
          newRefs.push({ kind: 'object', id });
        } else if (entry.kind === 'light') {
          const id = uid('l');
          newLights.push({
            ...structuredClone(entry.data),
            id,
            x: entry.data.x + dx,
            y: entry.data.y + dy,
          });
          newRefs.push({ kind: 'light', id });
        } else if (entry.kind === 'portal') {
          const id = uid('p');
          newPortals.push({
            ...structuredClone(entry.data),
            id,
            x: entry.data.x + dx,
            y: entry.data.y + dy,
          });
          newRefs.push({ kind: 'portal', id });
        } else if (entry.kind === 'room') {
          const id = uid('room');
          newRooms.push({
            ...structuredClone(entry.data),
            id,
            points: entry.data.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
          });
          newRefs.push({ kind: 'room', id });
        } else if (entry.kind === 'wall') {
          const id = uid('w');
          newWalls.push({
            ...structuredClone(entry.data),
            id,
            points: entry.data.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
          });
          newRefs.push({ kind: 'wall', id });
        } else if (entry.kind === 'path') {
          const id = uid('path');
          newPaths.push({
            ...structuredClone(entry.data),
            id,
            points: entry.data.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
          });
          newRefs.push({ kind: 'path', id });
        } else if (entry.kind === 'roof') {
          const id = uid('roof');
          newRoofs.push({
            ...structuredClone(entry.data),
            id,
            points: entry.data.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
          });
          newRefs.push({ kind: 'roof', id });
        }
      }

      const nextDoc = updateActiveLevel(s.doc, (l) => ({
        ...l,
        objects: [...l.objects, ...newObjects],
        lights: [...l.lights, ...newLights],
        portals: [...l.portals, ...newPortals],
        rooms: [...l.rooms, ...newRooms],
        walls: [...l.walls, ...newWalls],
        paths: [...l.paths, ...newPaths],
        roofs: [...l.roofs, ...newRoofs],
      }));

      return {
        ...pushCommit(s, nextDoc),
        selectedItems: newRefs,
        selection: newRefs.length > 0 ? newRefs[newRefs.length - 1] : null,
        pasteCount: step,
      };
    }),

  duplicateSelected: () => {
    const s = get();
    s.copySelected();
    get().pasteClipboard(null);
  },

  deleteSelected: () =>
    set((s) => {
      const items =
        s.selectedItems.length > 0
          ? s.selectedItems
          : s.selection
            ? [s.selection]
            : [];
      if (items.length === 0) return s;

      const idsByKind = {
        object: new Set(items.filter((i) => i.kind === 'object').map((i) => i.id)),
        light: new Set(items.filter((i) => i.kind === 'light').map((i) => i.id)),
        portal: new Set(items.filter((i) => i.kind === 'portal').map((i) => i.id)),
        room: new Set(items.filter((i) => i.kind === 'room').map((i) => i.id)),
        wall: new Set(items.filter((i) => i.kind === 'wall').map((i) => i.id)),
        path: new Set(items.filter((i) => i.kind === 'path').map((i) => i.id)),
        roof: new Set(items.filter((i) => i.kind === 'roof').map((i) => i.id)),
      };

      const next = updateActiveLevel(s.doc, (l) => ({
        ...l,
        objects: l.objects.filter((it) => !idsByKind.object.has(it.id)),
        lights: l.lights.filter((it) => !idsByKind.light.has(it.id)),
        portals: l.portals.filter((it) => !idsByKind.portal.has(it.id)),
        rooms: l.rooms.filter((it) => !idsByKind.room.has(it.id)),
        walls: l.walls.filter((it) => !idsByKind.wall.has(it.id)),
        paths: l.paths.filter((it) => !idsByKind.path.has(it.id)),
        roofs: l.roofs.filter((it) => !idsByKind.roof.has(it.id)),
      }));
      return { ...pushCommit(s, next), selection: null, selectedItems: [] };
    }),
}));

// Auto-save the active map to localStorage whenever the document changes
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let lastSavedDoc: MapDocument | null = null;
useMapStore.subscribe((state) => {
  if (!useUiPrefs.getState().autoSaveEnabled) return;
  if (state.doc === lastSavedDoc) return;
  lastSavedDoc = state.doc;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    persistDocument(state.doc);
  }, 200);
});
