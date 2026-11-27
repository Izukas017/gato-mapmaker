import type {
  AmbientSettings,
  GridSettings,
  LayerVisibility,
  MapDocument,
  MapLevel,
  MapObject,
  TerrainMaterialId,
} from '../types/map';

let idCounter = 1;
export function uid(prefix = 'id'): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter}`;
}

export function defaultLayers(): LayerVisibility {
  return {
    terrain: true,
    water: true,
    floors: true,
    paths: true,
    shadows: true,
    objects: true,
    walls: true,
    portals: true,
    roofs: true,
    lighting: true,
    grid: true,
  };
}

export function defaultGrid(): GridSettings {
  return {
    visible: true,
    snap: true,
    snapSubdivision: 2,
    color: '#000000',
    opacity: 0.22,
    type: 'square',
  };
}

export function defaultAmbient(): AmbientSettings {
  return {
    enabled: true,
    color: '#9db1cc',
    intensity: 0.62,
    strictWallBlocking: true,
    sunEnabled: false,
    sunAngle: 35,
    sunShadowLength: 0.4,
  };
}

export function createBlankMap(
  name = 'Nuevo Mapa',
  width = 24,
  height = 20,
  terrainBase: TerrainMaterialId = 'grass'
): MapDocument {
  const levelId = uid('lvl');
  const level: MapLevel = {
    id: levelId,
    name: 'Planta Baja',
    terrainBase,
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

  return {
    version: 1,
    name,
    width,
    height,
    pixelsPerGrid: 70,
    activeLevelId: levelId,
    levels: [level],
    ambient: {
      ...defaultAmbient(),
      intensity: 0.92,
      color: '#ffffff',
    },
    grid: defaultGrid(),
    layers: defaultLayers(),
    customAssets: [],
  };
}

function obj(
  propId: string,
  x: number,
  y: number,
  rotationDeg = 0,
  scale = 1,
  layer: MapObject['layer'] = 'above_floor',
  castShadow = true
): MapObject {
  return {
    id: uid('obj'),
    propId,
    x,
    y,
    scaleX: scale,
    scaleY: scale,
    rotation: (rotationDeg * Math.PI) / 180,
    opacity: 1,
    layer,
    castShadow,
    shadowOffset: 1,
  };
}

/**
 * Sanctuary Courtyard — Inspired by the user's 1st reference screenshot:
 * Cathedral apse with teal mosaic floor, golden altar, pews, braziers,
 * central octagonal courtyard with stone well & oak tree, herringbone dining rooms,
 * side dormitories with teal beds, storage & study rooms, and forest perimeter.
 */
export function createSanctuaryPreset(): MapDocument {
  const levelId = uid('lvl');

  const level: MapLevel = {
    id: levelId,
    name: 'Planta Baja',
    terrainBase: 'dirt',
    terrainStrokes: [
      // Organic mossy/grass patches around the exterior
      {
        id: uid('ts'),
        material: 'grass',
        points: [
          { x: 1, y: 2 },
          { x: 4, y: 1.5 },
          { x: 2, y: 6 },
          { x: 1.5, y: 15 },
          { x: 1.5, y: 27 },
        ],
        radius: 2.8,
        opacity: 0.65,
        softness: 0.75,
      },
      {
        id: uid('ts'),
        material: 'grass',
        points: [
          { x: 23, y: 2 },
          { x: 20, y: 2 },
          { x: 22.5, y: 9 },
          { x: 22.5, y: 20 },
          { x: 22.5, y: 29 },
        ],
        radius: 2.8,
        opacity: 0.65,
        softness: 0.75,
      },
      {
        id: uid('ts'),
        material: 'moss',
        points: [
          { x: 12, y: 17.5 },
          { x: 11.2, y: 19 },
          { x: 13.2, y: 19.8 },
        ],
        radius: 2.2,
        opacity: 0.48,
        softness: 0.85,
      },
    ],
    waterStrokes: [],
    rooms: [
      // 1. Northern Sanctuary Hall (pentagonal apse)
      {
        id: uid('room'),
        points: [
          { x: 12, y: 2.2 },
          { x: 19, y: 7 },
          { x: 19, y: 11.5 },
          { x: 5, y: 11.5 },
          { x: 5, y: 7 },
        ],
        floor: 'temple_teal',
        wallStyle: 'temple_gold',
        wallThickness: 0.28,
        castShadows: true,
      },
      // 2. West Dormitory & Corridor Wing
      {
        id: uid('room'),
        points: [
          { x: 2.5, y: 10 },
          { x: 5, y: 10 },
          { x: 5, y: 11.5 },
          { x: 12, y: 11.5 },
          { x: 12, y: 14.2 },
          { x: 9, y: 17 },
          { x: 9, y: 22 },
          { x: 11, y: 24 },
          { x: 11, y: 29.5 },
          { x: 2.5, y: 29.5 },
        ],
        floor: 'wood_planks',
        wallStyle: 'stone_hewn',
        wallThickness: 0.25,
        castShadows: true,
      },
      // 3. East Dormitory & Corridor Wing
      {
        id: uid('room'),
        points: [
          { x: 12, y: 11.5 },
          { x: 19, y: 11.5 },
          { x: 19, y: 10 },
          { x: 21.5, y: 10 },
          { x: 21.5, y: 29.5 },
          { x: 13, y: 29.5 },
          { x: 13, y: 24 },
          { x: 15, y: 22 },
          { x: 15, y: 17 },
          { x: 12, y: 14.2 },
        ],
        floor: 'wood_planks',
        wallStyle: 'stone_hewn',
        wallThickness: 0.25,
        castShadows: true,
      },
      // 4. West Herringbone Dining Hall
      {
        id: uid('room'),
        points: [
          { x: 5.5, y: 14.5 },
          { x: 8.5, y: 11.5 },
          { x: 12, y: 11.5 },
          { x: 12, y: 14.2 },
          { x: 9, y: 17 },
          { x: 5.5, y: 17 },
        ],
        floor: 'herringbone',
        wallStyle: 'timber_frame',
        wallThickness: 0.22,
        castShadows: true,
      },
      // 5. East Herringbone Dining Hall
      {
        id: uid('room'),
        points: [
          { x: 12, y: 11.5 },
          { x: 15.5, y: 11.5 },
          { x: 18.5, y: 14.5 },
          { x: 18.5, y: 17 },
          { x: 15, y: 17 },
          { x: 12, y: 14.2 },
        ],
        floor: 'herringbone',
        wallStyle: 'timber_frame',
        wallThickness: 0.22,
        castShadows: true,
      },
      // 6. West Storage Room
      {
        id: uid('room'),
        points: [
          { x: 5.5, y: 17 },
          { x: 9, y: 17 },
          { x: 9, y: 22 },
          { x: 5.5, y: 22 },
        ],
        floor: 'dark_wood',
        wallStyle: 'timber_frame',
        wallThickness: 0.22,
        castShadows: true,
      },
      // 7. Southeast Crate Vault
      {
        id: uid('room'),
        points: [
          { x: 16, y: 25.5 },
          { x: 21.5, y: 25.5 },
          { x: 21.5, y: 29.5 },
          { x: 16, y: 29.5 },
        ],
        floor: 'herringbone',
        wallStyle: 'timber_frame',
        wallThickness: 0.22,
        castShadows: true,
      },
      // 8. Southwest Pool & Lounge
      {
        id: uid('room'),
        points: [
          { x: 5.5, y: 26 },
          { x: 11, y: 26 },
          { x: 11, y: 29.5 },
          { x: 5.5, y: 29.5 },
        ],
        floor: 'herringbone',
        wallStyle: 'timber_frame',
        wallThickness: 0.22,
        castShadows: true,
      },
    ],
    walls: [
      // Dormitory partition walls on left
      {
        id: uid('w'),
        points: [
          { x: 2.5, y: 13.2 },
          { x: 4.8, y: 13.2 },
        ],
        closed: false,
        style: 'timber_frame',
        thickness: 0.18,
        castShadows: true,
      },
      {
        id: uid('w'),
        points: [
          { x: 2.5, y: 16.2 },
          { x: 4.8, y: 16.2 },
        ],
        closed: false,
        style: 'timber_frame',
        thickness: 0.18,
        castShadows: true,
      },
      {
        id: uid('w'),
        points: [
          { x: 2.5, y: 19.2 },
          { x: 4.8, y: 19.2 },
        ],
        closed: false,
        style: 'timber_frame',
        thickness: 0.18,
        castShadows: true,
      },
      {
        id: uid('w'),
        points: [
          { x: 2.5, y: 22.2 },
          { x: 5.5, y: 22.2 },
        ],
        closed: false,
        style: 'timber_frame',
        thickness: 0.18,
        castShadows: true,
      },
      // Study partition on right
      {
        id: uid('w'),
        points: [
          { x: 18.8, y: 21.5 },
          { x: 21.5, y: 21.5 },
        ],
        closed: false,
        style: 'timber_frame',
        thickness: 0.18,
        castShadows: true,
      },
    ],
    portals: [
      // Sanctuary doors
      { id: uid('p'), x: 9.2, y: 11.5, angle: 0, width: 1.3, kind: 'archway', open: true, blocksLight: false },
      { id: uid('p'), x: 14.8, y: 11.5, angle: 0, width: 1.3, kind: 'archway', open: true, blocksLight: false },
      // Main entrance gate
      { id: uid('p'), x: 12, y: 29.5, angle: 0, width: 2.0, kind: 'door_double', open: true, blocksLight: false },
      // Interior doors
      { id: uid('p'), x: 5.5, y: 15.6, angle: Math.PI / 2, width: 1.0, kind: 'door_wood', open: true, blocksLight: false },
      { id: uid('p'), x: 18.5, y: 15.6, angle: Math.PI / 2, width: 1.0, kind: 'door_wood', open: true, blocksLight: false },
      { id: uid('p'), x: 5.5, y: 19.5, angle: Math.PI / 2, width: 1.0, kind: 'door_wood', open: false, blocksLight: true },
      { id: uid('p'), x: 8.2, y: 26, angle: 0, width: 1.1, kind: 'door_wood', open: true, blocksLight: false },
      { id: uid('p'), x: 16, y: 27.5, angle: Math.PI / 2, width: 1.0, kind: 'door_wood', open: false, blocksLight: true },
      // Windows along outer walls
      { id: uid('p'), x: 2.5, y: 11.6, angle: Math.PI / 2, width: 1.2, kind: 'window_stained', open: false, blocksLight: false },
      { id: uid('p'), x: 2.5, y: 14.7, angle: Math.PI / 2, width: 1.2, kind: 'window_stained', open: false, blocksLight: false },
      { id: uid('p'), x: 2.5, y: 17.7, angle: Math.PI / 2, width: 1.2, kind: 'window_stained', open: false, blocksLight: false },
      { id: uid('p'), x: 21.5, y: 13.5, angle: Math.PI / 2, width: 1.2, kind: 'window_stained', open: false, blocksLight: false },
      { id: uid('p'), x: 21.5, y: 17.5, angle: Math.PI / 2, width: 1.2, kind: 'window_stained', open: false, blocksLight: false },
      { id: uid('p'), x: 21.5, y: 23.5, angle: Math.PI / 2, width: 1.2, kind: 'window_glass', open: false, blocksLight: false },
    ],
    paths: [
      {
        id: uid('path'),
        points: [
          { x: 12, y: 31.8 },
          { x: 12, y: 24.2 },
          { x: 12, y: 21.5 },
        ],
        style: 'dirt_road',
        width: 1.6,
        smooth: true,
        fadeEnds: true,
      },
    ],
    objects: [
      // Sanctuary altar & sacred pool
      obj('altar_gold', 12, 3.8, 0, 1.05),
      obj('pool_teal', 12, 9.8, 0, 0.95, 'above_floor', false),
      // Sanctuary aisle runners
      obj('rug_runner', 9.2, 8.2, 0, 1.0, 'above_floor', false),
      obj('rug_runner', 14.8, 8.2, 0, 1.0, 'above_floor', false),
      // Sanctuary pews (left, center, right)
      obj('pew', 7.2, 7.2, 0, 0.85),
      obj('pew', 7.2, 8.6, 0, 0.85),
      obj('pew', 7.2, 10.0, 0, 0.85),
      obj('pew', 12, 6.9, 0, 0.85),
      obj('pew', 12, 8.0, 0, 0.85),
      obj('pew', 16.8, 7.2, 0, 0.85),
      obj('pew', 16.8, 8.6, 0, 0.85),
      obj('pew', 16.8, 10.0, 0, 0.85),
      // Sanctuary braziers
      obj('brazier', 10.2, 4.1, 0, 0.85),
      obj('brazier', 13.8, 4.1, 0, 0.85),
      obj('brazier', 10.3, 7.6, 0, 0.78),
      obj('brazier', 13.7, 7.6, 0, 0.78),
      obj('brazier', 10.3, 10.1, 0, 0.78),
      obj('brazier', 13.7, 10.1, 0, 0.78),

      // Central octagonal courtyard: well + oak tree
      obj('well', 12, 18.4, 0, 0.95),
      obj('tree_oak', 13.1, 20.3, 25, 0.72, 'above_walls', true),

      // West Dining Room
      obj('rug_teal', 8.4, 14.5, -35, 0.95, 'above_floor', false),
      obj('table_round', 7.4, 15.2, 15, 0.75),
      obj('table_round', 9.4, 15.2, 40, 0.75),
      obj('table_round', 10.1, 13.1, -10, 0.72),

      // East Dining Room
      obj('table_round_teal', 14.1, 13.2, 20, 0.85),
      obj('table_round_teal', 14.7, 15.4, -30, 0.85),
      obj('table_round_teal', 16.8, 15.2, 15, 0.85),

      // West Dormitory Beds & Rugs
      obj('rug_teal', 3.7, 11.6, 90, 0.65, 'above_floor', false),
      obj('bed_teal', 3.4, 11.4, 0, 0.85),
      obj('bed_teal', 3.6, 14.7, 90, 0.85),
      obj('bed_teal', 3.6, 17.7, 90, 0.85),
      obj('bed_teal', 3.6, 20.7, 90, 0.85),
      obj('bed_teal', 4.1, 28.0, 0, 0.9),

      // East Dormitory Beds
      obj('bed_teal', 20.3, 13.0, -90, 0.82),
      obj('bed_teal', 20.3, 14.4, -90, 0.82),
      obj('bed_teal', 20.3, 15.8, -90, 0.82),
      obj('bed_teal', 20.3, 17.8, -90, 0.82),
      obj('bed_teal', 20.3, 19.2, -90, 0.82),

      // Study Room (East)
      obj('rug_teal', 20.0, 23.4, 0, 0.7, 'above_floor', false),
      obj('desk', 20.2, 23.4, 90, 0.88),
      obj('chair', 19.2, 23.1, 90, 0.85),
      obj('chair', 19.2, 23.8, 90, 0.85),

      // West Storage Room (barrels, cart, sacks)
      obj('barrel', 6.3, 17.8, 0, 0.85),
      obj('barrel', 7.2, 17.8, 15, 0.85),
      obj('barrel', 8.1, 18.1, 30, 0.85),
      obj('barrel', 6.2, 19.1, 0, 0.85),
      obj('cart', 7.4, 20.5, -24, 0.92),
      obj('sack', 6.3, 21.1, 10, 0.9),

      // Lounge & Pool (Southwest)
      obj('rug_teal', 8.2, 24.3, 0, 0.9, 'above_floor', false),
      obj('sofa_teal', 6.8, 25.4, 0, 0.85),
      obj('sofa_teal', 10.0, 25.4, 0, 0.85),
      obj('pool_teal', 9.0, 28.1, 90, 0.82, 'above_floor', false),

      // Southeast Crate Vault
      obj('crate', 17.1, 26.6, 12, 0.9),
      obj('crate', 18.4, 26.8, -8, 1.0),
      obj('crate', 19.8, 26.5, 22, 0.92),
      obj('crate', 17.5, 28.2, -18, 0.95),
      obj('crate', 19.2, 28.3, 5, 0.9),
      obj('sack', 20.6, 28.0, 35, 0.95),

      // Exterior Trees & Rocks
      obj('tree_oak', 1.2, 2.5, 10, 0.95, 'above_walls', true),
      obj('tree_oak', 4.6, 1.5, 45, 0.8, 'above_walls', true),
      obj('tree_oak', 13.0, 1.1, 20, 0.85, 'above_walls', true),
      obj('tree_oak', 19.8, 2.2, 60, 0.9, 'above_walls', true),
      obj('tree_oak', 22.8, 1.8, 0, 0.85, 'above_walls', true),
      obj('tree_oak', 0.9, 8.8, 30, 0.82, 'above_walls', true),
      obj('tree_oak', 22.9, 8.5, 12, 0.88, 'above_walls', true),
      obj('tree_oak', 1.1, 21.2, 50, 0.8, 'above_walls', true),
      obj('tree_oak', 23.0, 28.8, 15, 0.95, 'above_walls', true),
      obj('tree_oak', 15.0, 30.8, 40, 0.85, 'above_walls', true),
      obj('bush', 2.2, 5.5, 0, 0.9),
      obj('bush', 22.6, 19.2, 20, 0.85),
      obj('rock', 2.1, 6.6, 15, 0.75),
      obj('rock', 0.9, 17.0, -25, 0.8),
      obj('rock', 7.3, 30.8, 10, 0.7),
    ],
    lights: [
      // Sanctuary warm braziers
      { id: uid('l'), x: 10.2, y: 4.1, color: '#ffae42', radius: 5.5, intensity: 1.1, castShadows: true },
      { id: uid('l'), x: 13.8, y: 4.1, color: '#ffae42', radius: 5.5, intensity: 1.1, castShadows: true },
      { id: uid('l'), x: 10.3, y: 7.6, color: '#ffb84d', radius: 4.8, intensity: 0.95, castShadows: true },
      { id: uid('l'), x: 13.7, y: 7.6, color: '#ffb84d', radius: 4.8, intensity: 0.95, castShadows: true },
      { id: uid('l'), x: 12.0, y: 9.8, color: '#4de3e8', radius: 4.2, intensity: 0.65, castShadows: true },
      // Dining & Dormitory warm lanterns
      { id: uid('l'), x: 8.4, y: 14.8, color: '#ffc266', radius: 5.5, intensity: 1.0, castShadows: true },
      { id: uid('l'), x: 15.6, y: 14.8, color: '#ffc266', radius: 5.5, intensity: 1.0, castShadows: true },
      { id: uid('l'), x: 3.8, y: 12.6, color: '#ffb347', radius: 4.2, intensity: 0.85, castShadows: true },
      { id: uid('l'), x: 3.8, y: 18.8, color: '#ffb347', radius: 4.2, intensity: 0.85, castShadows: true },
      { id: uid('l'), x: 20.1, y: 23.4, color: '#ffc46b', radius: 4.8, intensity: 0.95, castShadows: true },
      // Courtyard moonlight / warm entrance
      { id: uid('l'), x: 12.0, y: 19.5, color: '#d6e8ff', radius: 6.5, intensity: 0.55, castShadows: true },
    ],
    roofs: [],
  };

  return {
    version: 1,
    name: 'Santuario del Patio',
    width: 24,
    height: 32,
    pixelsPerGrid: 64,
    activeLevelId: levelId,
    levels: [level],
    ambient: {
      enabled: true,
      color: '#889bb8',
      intensity: 0.56,
      sunEnabled: false,
      sunAngle: 35,
      sunShadowLength: 0.4,
    },
    grid: defaultGrid(),
    layers: defaultLayers(),
    customAssets: [],
  };
}

/**
 * Cobblestone Quarter — Inspired by the user's 2nd reference screenshot:
 * Medieval town district with cobblestone streets, furnished houses & tavern,
 * angled chapel, blue-slate shingled roofs, and warm glowing lanterns.
 */
export function createCobblestoneQuarterPreset(): MapDocument {
  const levelId = uid('lvl');

  const level: MapLevel = {
    id: levelId,
    name: 'Distrito Urbano',
    terrainBase: 'cobblestone',
    terrainStrokes: [
      {
        id: uid('ts'),
        material: 'dirt',
        points: [
          { x: 1, y: 13 },
          { x: 16, y: 13 },
          { x: 20, y: 7 },
          { x: 25, y: 2 },
        ],
        radius: 1.5,
        opacity: 0.55,
        softness: 0.75,
      },
      {
        id: uid('ts'),
        material: 'dirt',
        points: [
          { x: 17.5, y: 13 },
          { x: 17.5, y: 24 },
          { x: 17.5, y: 31 },
        ],
        radius: 1.4,
        opacity: 0.5,
        softness: 0.75,
      },
    ],
    waterStrokes: [],
    rooms: [
      // North-West Rowhouse
      {
        id: uid('room'),
        points: [
          { x: 4, y: 5.5 },
          { x: 7, y: 5.5 },
          { x: 7, y: 9.5 },
          { x: 13, y: 9.5 },
          { x: 13, y: 5.5 },
          { x: 19.5, y: 5.5 },
          { x: 16.5, y: 12 },
          { x: 4, y: 12 },
        ],
        floor: 'wood_planks',
        wallStyle: 'stone_hewn',
        wallThickness: 0.24,
        castShadows: true,
      },
      // Center-Left Townhouse
      {
        id: uid('room'),
        points: [
          { x: 7.2, y: 14.2 },
          { x: 16.5, y: 14.2 },
          { x: 16.5, y: 18.8 },
          { x: 7.2, y: 18.8 },
        ],
        floor: 'wood_planks',
        wallStyle: 'timber_frame',
        wallThickness: 0.22,
        castShadows: true,
      },
      // Angled Chapel (East)
      {
        id: uid('room'),
        points: [
          { x: 20.2, y: 10.2 },
          { x: 23.8, y: 12.2 },
          { x: 21.8, y: 15.6 },
          { x: 18.2, y: 13.6 },
        ],
        floor: 'slate_tile',
        wallStyle: 'stone_hewn',
        wallThickness: 0.26,
        castShadows: true,
      },
      // South-Center Tavern (L-shaped)
      {
        id: uid('room'),
        points: [
          { x: 13.5, y: 23.2 },
          { x: 16.8, y: 23.2 },
          { x: 16.8, y: 30.5 },
          { x: 10, y: 30.5 },
          { x: 10, y: 27.6 },
          { x: 13.5, y: 27.6 },
        ],
        floor: 'dark_wood',
        wallStyle: 'stone_hewn',
        wallThickness: 0.24,
        castShadows: true,
      },
      // East Workshop / House
      {
        id: uid('room'),
        points: [
          { x: 18.8, y: 16.8 },
          { x: 21.5, y: 16.8 },
          { x: 21.5, y: 19.6 },
          { x: 24.5, y: 19.6 },
          { x: 24.5, y: 23.2 },
          { x: 18.8, y: 23.2 },
        ],
        floor: 'wood_planks',
        wallStyle: 'timber_frame',
        wallThickness: 0.22,
        castShadows: true,
      },
      // South-West House
      {
        id: uid('room'),
        points: [
          { x: 1.5, y: 26.2 },
          { x: 7.2, y: 26.2 },
          { x: 7.2, y: 30.5 },
          { x: 1.5, y: 30.5 },
        ],
        floor: 'wood_planks',
        wallStyle: 'timber_frame',
        wallThickness: 0.22,
        castShadows: true,
      },
    ],
    walls: [
      {
        id: uid('w'),
        points: [
          { x: 10.4, y: 14.2 },
          { x: 10.4, y: 18.8 },
        ],
        closed: false,
        style: 'timber_frame',
        thickness: 0.18,
        castShadows: true,
      },
      {
        id: uid('w'),
        points: [
          { x: 13.4, y: 14.2 },
          { x: 13.4, y: 18.8 },
        ],
        closed: false,
        style: 'timber_frame',
        thickness: 0.18,
        castShadows: true,
      },
      {
        id: uid('w'),
        points: [
          { x: 13, y: 5.5 },
          { x: 13, y: 12 },
        ],
        closed: false,
        style: 'timber_frame',
        thickness: 0.18,
        castShadows: true,
      },
    ],
    portals: [
      { id: uid('p'), x: 11.8, y: 14.2, angle: 0, width: 1.1, kind: 'door_wood', open: true, blocksLight: false },
      { id: uid('p'), x: 16.5, y: 16.5, angle: Math.PI / 2, width: 1.1, kind: 'window_glass', open: false, blocksLight: false },
      { id: uid('p'), x: 19.2, y: 11.9, angle: 0.52, width: 1.2, kind: 'door_double', open: true, blocksLight: false },
      { id: uid('p'), x: 16.8, y: 26.5, angle: Math.PI / 2, width: 1.2, kind: 'door_wood', open: true, blocksLight: false },
      { id: uid('p'), x: 18.8, y: 21.4, angle: Math.PI / 2, width: 1.1, kind: 'door_wood', open: true, blocksLight: false },
      { id: uid('p'), x: 8.6, y: 12.0, angle: 0, width: 1.1, kind: 'door_wood', open: true, blocksLight: false },
    ],
    paths: [],
    objects: [
      // Rowhouse furnishings
      obj('rug_round', 5.5, 7.6, 0, 0.8, 'above_floor', false),
      obj('bed_crimson', 8.3, 10.6, 0, 0.82),
      obj('bed_crimson', 11.6, 10.6, 0, 0.82),
      obj('table_round', 15.8, 10.4, 20, 0.8),
      obj('fireplace', 17.4, 7.2, 0, 0.9),
      obj('barrel', 14.0, 9.2, 0, 0.82),
      obj('barrel', 14.9, 9.2, 0, 0.82),

      // Townhouse furnishings
      obj('rug_crimson', 8.8, 16.8, 90, 0.72, 'above_floor', false),
      obj('bed_crimson', 8.8, 17.5, 0, 0.85),
      obj('bed_crimson', 11.8, 16.4, 90, 0.85),
      obj('table_round', 14.9, 16.5, 10, 0.82),
      obj('chair', 14.0, 16.5, 90, 0.8),
      obj('chair', 15.8, 16.5, -90, 0.8),

      // Angled Chapel
      obj('rug_runner', 21.0, 12.9, 120, 0.8, 'above_floor', false),
      obj('altar_gold', 22.5, 13.7, 120, 0.65),
      obj('pew', 20.6, 11.6, 30, 0.65),
      obj('pew', 19.6, 13.4, 30, 0.65),

      // Tavern
      obj('rug_crimson', 15.1, 27.4, 90, 0.82, 'above_floor', false),
      obj('table_round', 12.0, 29.0, 0, 0.85),
      obj('table_round', 15.1, 29.0, 25, 0.85),
      obj('table_round', 15.1, 26.2, -15, 0.82),
      obj('bed_crimson', 14.4, 24.4, 0, 0.72),
      obj('bed_crimson', 15.8, 24.4, 0, 0.72),

      // East Workshop
      obj('bed_crimson', 23.2, 21.2, 90, 0.82),
      obj('table_round', 20.0, 21.8, 0, 0.8),
      obj('anvil', 20.2, 18.2, 0, 0.9),
      obj('crate', 19.5, 17.4, 15, 0.8),

      // South-West House
      obj('rug_crimson', 4.3, 28.4, 0, 0.9, 'above_floor', false),
      obj('table_banquet', 4.3, 28.8, 0, 0.85),
      obj('bed_teal', 6.0, 27.4, 90, 0.8),
    ],
    lights: [
      { id: uid('l'), x: 17.2, y: 7.5, color: '#ff9d3b', radius: 5.5, intensity: 1.1, castShadows: true },
      { id: uid('l'), x: 11.8, y: 15.8, color: '#ffbc5e', radius: 5.2, intensity: 0.95, castShadows: true },
      { id: uid('l'), x: 21.2, y: 13.0, color: '#ffba52', radius: 5.0, intensity: 1.0, castShadows: true },
      { id: uid('l'), x: 15.2, y: 27.6, color: '#ffa844', radius: 6.2, intensity: 1.15, castShadows: true },
      { id: uid('l'), x: 20.5, y: 21.2, color: '#ffb854', radius: 5.0, intensity: 0.95, castShadows: true },
      { id: uid('l'), x: 4.5, y: 28.2, color: '#ffb44c', radius: 5.0, intensity: 0.95, castShadows: true },
      // Street lanterns
      { id: uid('l'), x: 17.5, y: 13.0, color: '#ffd58a', radius: 6.0, intensity: 0.85, castShadows: true },
      { id: uid('l'), x: 17.5, y: 23.0, color: '#ffd58a', radius: 6.0, intensity: 0.85, castShadows: true },
    ],
    roofs: [
      {
        id: uid('roof'),
        points: [
          { x: 13.5, y: 0 },
          { x: 20.5, y: 0 },
          { x: 17.5, y: 3.4 },
          { x: 13.5, y: 1.6 },
        ],
        style: 'slate_blue',
        ridgeAngle: 0,
        opacity: 1,
      },
      {
        id: uid('roof'),
        points: [
          { x: 0, y: 19.5 },
          { x: 2.4, y: 19.5 },
          { x: 2.4, y: 24.8 },
          { x: 0, y: 24.8 },
        ],
        style: 'slate_blue',
        ridgeAngle: 0,
        opacity: 1,
      },
      {
        id: uid('roof'),
        points: [
          { x: 23.8, y: 25.2 },
          { x: 26, y: 25.2 },
          { x: 26, y: 31.8 },
          { x: 23.8, y: 31.8 },
        ],
        style: 'slate_blue',
        ridgeAngle: 0,
        opacity: 1,
      },
    ],
  };

  return {
    version: 1,
    name: 'Barrio Empedrado',
    width: 26,
    height: 32,
    pixelsPerGrid: 64,
    activeLevelId: levelId,
    levels: [level],
    ambient: {
      enabled: true,
      color: '#6b7fa3',
      intensity: 0.48,
      sunEnabled: false,
      sunAngle: 40,
      sunShadowLength: 0.45,
    },
    grid: defaultGrid(),
    layers: defaultLayers(),
    customAssets: [],
  };
}
