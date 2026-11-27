import { create } from 'zustand';
import type {
  AmbientSettings,
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

export interface ToolSettings {
  // Terrain
  terrainMaterial: TerrainMaterialId;
  terrainRadius: number;
  terrainOpacity: number;
  terrainSoftness: number;
  // Water
  waterRadius: number;
  waterDeepColor: string;
  waterShallowColor: string;
  waterErase: boolean;
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

interface MapStoreState {
  doc: MapDocument;
  past: MapDocument[];
  future: MapDocument[];
  activeTool: ToolId;
  toolSettings: ToolSettings;
  selection: SelectionRef | null;
  zoom: number;
  panX: number;
  panY: number;
  cursorTile: { x: number; y: number } | null;

  // Tool & View
  setTool: (tool: ToolId) => void;
  updateToolSettings: (patch: Partial<ToolSettings>) => void;
  setSelection: (sel: SelectionRef | null) => void;
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
  updateSelectedLight: (patch: Partial<LightSource>, recordUndo?: boolean) => void;
  updateSelectedPortal: (patch: Partial<PortalItem>, recordUndo?: boolean) => void;
  updateSelectedRoom: (patch: Partial<RoomShape>, recordUndo?: boolean) => void;
  moveSelectedBy: (dx: number, dy: number, recordUndo?: boolean) => void;
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
    waterRadius: 1.5,
    waterDeepColor: '#1a5a6e',
    waterShallowColor: '#3d99ad',
    waterErase: false,
    buildingMode: 'rect',
    floorPattern: 'wood_planks',
    buildingWallStyle: 'stone_hewn',
    wallThickness: 0.24,
    wallStyle: 'stone_hewn',
    wallCastShadows: true,
    portalKind: 'door_wood',
    portalWidth: 1.1,
    portalOpen: false,
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
  zoom: 0.55,
  panX: 80,
  panY: 20,
  cursorTile: null,

  setTool: (tool) => set({ activeTool: tool }),
  updateToolSettings: (patch) =>
    set((s) => ({ toolSettings: { ...s.toolSettings, ...patch } })),
  setSelection: (selection) => set({ selection }),
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
    set({ doc, past: [], future: [], selection: null });
  },

  createNewMap: (name, width, height, terrain) => {
    const doc = createBlankMap(name, width, height, terrain);
    set({ doc, past: [], future: [], selection: null });
  },

  loadDocument: (doc) => set({ doc, past: [], future: [], selection: null }),

  setMapName: (name) =>
    set((s) => ({ doc: { ...s.doc, name } })),

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

  moveSelectedBy: (dx, dy, recordUndo = false) =>
    set((s) => {
      const sel = s.selection;
      if (!sel) return s;
      const next = updateActiveLevel(s.doc, (l) => {
        if (sel.kind === 'object') {
          return {
            ...l,
            objects: l.objects.map((o) =>
              o.id === sel.id ? { ...o, x: o.x + dx, y: o.y + dy } : o
            ),
          };
        }
        if (sel.kind === 'light') {
          return {
            ...l,
            lights: l.lights.map((it) =>
              it.id === sel.id ? { ...it, x: it.x + dx, y: it.y + dy } : it
            ),
          };
        }
        if (sel.kind === 'portal') {
          return {
            ...l,
            portals: l.portals.map((it) =>
              it.id === sel.id ? { ...it, x: it.x + dx, y: it.y + dy } : it
            ),
          };
        }
        if (sel.kind === 'room') {
          return {
            ...l,
            rooms: l.rooms.map((it) =>
              it.id === sel.id
                ? { ...it, points: it.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) }
                : it
            ),
          };
        }
        if (sel.kind === 'wall') {
          return {
            ...l,
            walls: l.walls.map((it) =>
              it.id === sel.id
                ? { ...it, points: it.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) }
                : it
            ),
          };
        }
        if (sel.kind === 'path') {
          return {
            ...l,
            paths: l.paths.map((it) =>
              it.id === sel.id
                ? { ...it, points: it.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) }
                : it
            ),
          };
        }
        if (sel.kind === 'roof') {
          return {
            ...l,
            roofs: l.roofs.map((it) =>
              it.id === sel.id
                ? { ...it, points: it.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) }
                : it
            ),
          };
        }
        return l;
      });
      return recordUndo ? pushCommit(s, next) : { doc: next };
    }),

  duplicateSelected: () => {
    const s = get();
    const sel = s.selection;
    if (!sel) return;
    const level = s.doc.levels.find((l) => l.id === s.doc.activeLevelId);
    if (!level) return;

    if (sel.kind === 'object') {
      const orig = level.objects.find((o) => o.id === sel.id);
      if (!orig) return;
      const copy: MapObject = { ...orig, id: uid('obj'), x: orig.x + 0.6, y: orig.y + 0.6 };
      s.addObject(copy);
      set({ selection: { kind: 'object', id: copy.id } });
    } else if (sel.kind === 'light') {
      const orig = level.lights.find((o) => o.id === sel.id);
      if (!orig) return;
      const copy: LightSource = { ...orig, id: uid('l'), x: orig.x + 0.6, y: orig.y + 0.6 };
      s.addLight(copy);
      set({ selection: { kind: 'light', id: copy.id } });
    }
  },

  deleteSelected: () =>
    set((s) => {
      const sel = s.selection;
      if (!sel) return s;
      const next = updateActiveLevel(s.doc, (l) => {
        switch (sel.kind) {
          case 'object':
            return { ...l, objects: l.objects.filter((it) => it.id !== sel.id) };
          case 'light':
            return { ...l, lights: l.lights.filter((it) => it.id !== sel.id) };
          case 'portal':
            return { ...l, portals: l.portals.filter((it) => it.id !== sel.id) };
          case 'room':
            return { ...l, rooms: l.rooms.filter((it) => it.id !== sel.id) };
          case 'wall':
            return { ...l, walls: l.walls.filter((it) => it.id !== sel.id) };
          case 'path':
            return { ...l, paths: l.paths.filter((it) => it.id !== sel.id) };
          case 'roof':
            return { ...l, roofs: l.roofs.filter((it) => it.id !== sel.id) };
        }
      });
      return { ...pushCommit(s, next), selection: null };
    }),
}));

// Auto-save the active map to localStorage whenever the document changes
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let lastSavedDoc: MapDocument | null = null;
useMapStore.subscribe((state) => {
  if (state.doc === lastSavedDoc) return;
  lastSavedDoc = state.doc;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    persistDocument(state.doc);
  }, 200);
});
