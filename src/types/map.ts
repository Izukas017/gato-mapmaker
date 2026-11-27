export type ToolId =
  | 'select'
  | 'terrain'
  | 'water'
  | 'building'
  | 'wall'
  | 'portal'
  | 'path'
  | 'object'
  | 'light'
  | 'roof';

export interface Point {
  x: number; // in grid units (tiles)
  y: number; // in grid units (tiles)
}

export type TerrainMaterialId =
  | 'dirt'
  | 'grass'
  | 'cobblestone'
  | 'flagstone'
  | 'moss'
  | 'sand'
  | 'mud'
  | 'snow'
  | 'gravel'
  | 'volcanic'
  | 'lava_crust'
  | 'ice'
  | 'swamp'
  | 'desert_cracked'
  | 'autumn_leaves'
  | 'arcane_ground';

export type BrushShape =
  | 'circle'
  | 'square'
  | 'rectangle'
  | 'hexagon'
  | 'diamond'
  | 'octagon';

export type FloorPatternId =
  | 'wood_planks'
  | 'herringbone'
  | 'temple_teal'
  | 'slate_tile'
  | 'rough_cobble'
  | 'marble_check'
  | 'dark_wood'
  | 'carpet_crimson'
  | 'marble_white_gold'
  | 'dungeon_cracked'
  | 'brick_herringbone'
  | 'bamboo_tatami'
  | 'obsidian_hex'
  | 'sandstone_tile'
  | 'copper_plate'
  | 'castle_flagstone'
  | 'checkered_black_white'
  | 'carpet_royal_blue';

export type WallStyleId =
  | 'stone_hewn'
  | 'timber_frame'
  | 'rough_masonry'
  | 'brick_aged'
  | 'temple_gold'
  | 'obsidian_black'
  | 'marble_white'
  | 'sandstone_wall'
  | 'cave_rock'
  | 'iron_fortress'
  | 'hedge_wall'
  | 'palisade_wood';

export type PortalKind =
  | 'door_wood'
  | 'door_double'
  | 'door_iron'
  | 'archway'
  | 'window_glass'
  | 'window_stained'
  | 'portcullis'
  | 'door_secret'
  | 'door_ornate_gold'
  | 'window_bars';

export type PathStyleId =
  | 'dirt_road'
  | 'cobble_path'
  | 'wood_bridge'
  | 'carpet_teal'
  | 'carpet_crimson'
  | 'hedge'
  | 'cliff_edge'
  | 'rail_tracks'
  | 'rope_bridge'
  | 'stream_brook'
  | 'lava_stream'
  | 'stone_wall_low';

export type RoofStyleId =
  | 'slate_blue'
  | 'terracotta'
  | 'thatch'
  | 'dark_shingle'
  | 'copper_verdigris'
  | 'crimson_tile'
  | 'wood_planks_roof'
  | 'gold_dome';

export type PropLayer = 'below_floor' | 'above_floor' | 'above_walls' | 'roof';

export interface TerrainStroke {
  id: string;
  material: TerrainMaterialId;
  points: Point[];
  radius: number; // in tiles
  opacity: number; // 0..1
  softness: number; // 0..1
  shape?: BrushShape;
  shapeAngle?: number; // degrees
  rectRatio?: number; // width/height ratio for rectangle
}

export interface WaterStroke {
  id: string;
  points: Point[];
  radius: number;
  deepColor: string;
  shallowColor: string;
  erase?: boolean;
  shape?: BrushShape;
  shapeAngle?: number;
  rectRatio?: number;
}

export interface RoomShape {
  id: string;
  points: Point[]; // closed polygon in tiles
  floor: FloorPatternId;
  floorTint?: string;
  floorRotation?: number; // degrees
  wallStyle: WallStyleId | null; // null = floor only (pattern shape)
  wallThickness: number; // in tiles (default ~0.22)
  castShadows: boolean;
}

export interface WallPolyline {
  id: string;
  points: Point[];
  closed: boolean;
  style: WallStyleId;
  thickness: number;
  castShadows: boolean;
}

export interface PortalItem {
  id: string;
  x: number;
  y: number;
  angle: number; // radians
  width: number; // in tiles
  kind: PortalKind;
  open: boolean;
  openAngle?: number; // degrees (0..180)
  blocksLight: boolean;
}

export interface PathItem {
  id: string;
  points: Point[];
  style: PathStyleId;
  width: number; // in tiles
  smooth: boolean;
  fadeEnds: boolean;
}

export interface ObjectLightConfig {
  enabled: boolean;
  color: string;
  radius: number;
  intensity: number;
  castShadows: boolean;
}

export interface MapObject {
  id: string;
  propId: string; // built-in prop id or custom:<id>
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number; // radians
  tint?: string;
  opacity: number;
  layer: PropLayer;
  castShadow: boolean;
  shadowOffset: number; // 0..2
  light?: ObjectLightConfig;
}

export interface LightSource {
  id: string;
  x: number;
  y: number;
  color: string; // hex
  radius: number; // in tiles
  intensity: number; // 0..2
  castShadows: boolean;
  flicker?: boolean;
}

export interface RoofShape {
  id: string;
  points: Point[];
  style: RoofStyleId;
  ridgeAngle: number; // radians
  opacity: number;
}

export interface MapLevel {
  id: string;
  name: string;
  terrainBase: TerrainMaterialId;
  terrainStrokes: TerrainStroke[];
  waterStrokes: WaterStroke[];
  rooms: RoomShape[];
  walls: WallPolyline[];
  portals: PortalItem[];
  paths: PathItem[];
  objects: MapObject[];
  lights: LightSource[];
  roofs: RoofShape[];
}

export interface LayerVisibility {
  terrain: boolean;
  water: boolean;
  floors: boolean;
  paths: boolean;
  shadows: boolean;
  objects: boolean;
  walls: boolean;
  portals: boolean;
  roofs: boolean;
  lighting: boolean;
  grid: boolean;
}

export interface AmbientSettings {
  enabled: boolean;
  color: string; // e.g. #2c354d for dusk/night or #ffffff for day
  intensity: number; // 0 (pitch black) .. 1 (full daylight)
  sunEnabled: boolean;
  sunAngle: number; // degrees
  sunShadowLength: number; // 0..1
}

export interface GridSettings {
  visible: boolean;
  snap: boolean;
  snapSubdivision: 1 | 2 | 4; // 1 = full tile, 2 = half tile, 4 = quarter tile
  color: string;
  opacity: number;
  type: 'square' | 'hex';
}

export interface CustomAsset {
  id: string;
  name: string;
  category: string;
  dataUrl: string;
  widthTiles: number;
  heightTiles: number;
}

export interface MapDocument {
  version: number;
  name: string;
  width: number; // in grid tiles
  height: number; // in grid tiles
  pixelsPerGrid: number; // default 70 or 140
  activeLevelId: string;
  levels: MapLevel[];
  ambient: AmbientSettings;
  grid: GridSettings;
  layers: LayerVisibility;
  customAssets: CustomAsset[];
}

export interface SelectionRef {
  kind: 'object' | 'light' | 'portal' | 'room' | 'wall' | 'path' | 'roof';
  id: string;
}

export type PropCategory =
  | 'furniture'
  | 'tavern'
  | 'shop'
  | 'dungeon'
  | 'temple'
  | 'magic'
  | 'storage'
  | 'camp'
  | 'nature'
  | 'rugs'
  | 'lighting'
  | 'custom';

export interface PropDefinition {
  id: string;
  name: string;
  category: PropCategory;
  widthTiles: number;
  heightTiles: number;
  defaultLayer: PropLayer;
  defaultShadow: boolean;
  tags: string[];
}
