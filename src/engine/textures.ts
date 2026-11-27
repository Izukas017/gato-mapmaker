import type {
  FloorPatternId,
  RoofStyleId,
  TerrainMaterialId,
  WallStyleId,
} from '../types/map';
import { paintSurface, SURFACE_SIZE, tileNoise } from './surfaces';

// Deterministic PRNG for repeatable procedural textures
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export interface MaterialMeta<T extends string> {
  id: T;
  name: string;
  baseColor: string;
}

export const TERRAIN_MATERIALS: MaterialMeta<TerrainMaterialId>[] = [
  { id: 'dirt', name: 'Tierra Batida', baseColor: '#7b684d' },
  { id: 'grass', name: 'Hierba Bosque', baseColor: '#4c633c' },
  { id: 'cobblestone', name: 'Adoquín Urbano', baseColor: '#6d6963' },
  { id: 'flagstone', name: 'Losa de Patio', baseColor: '#7a756c' },
  { id: 'moss', name: 'Musgo Húmedo', baseColor: '#3f573a' },
  { id: 'sand', name: 'Arena Cálida', baseColor: '#bfa67a' },
  { id: 'mud', name: 'Barro Oscuro', baseColor: '#4d3e2e' },
  { id: 'snow', name: 'Nieve Compacta', baseColor: '#d4dde6' },
  { id: 'gravel', name: 'Grava Ceniza', baseColor: '#63666b' },
  { id: 'volcanic', name: 'Basalto Volcánico', baseColor: '#323036' },
  { id: 'lava_crust', name: 'Grietas de Magma', baseColor: '#5c2414' },
  { id: 'ice', name: 'Hielo Glaciar', baseColor: '#8dc1d9' },
  { id: 'swamp', name: 'Ciénaga Pantano', baseColor: '#3e4a30' },
  { id: 'desert_cracked', name: 'Desierto Agrietado', baseColor: '#a87d51' },
  { id: 'autumn_leaves', name: 'Hojarasca Otoñal', baseColor: '#945229' },
  { id: 'arcane_ground', name: 'Suelo Corrompido', baseColor: '#432e54' },
];

export const FLOOR_PATTERNS: MaterialMeta<FloorPatternId>[] = [
  { id: 'wood_planks', name: 'Tablones Roble', baseColor: '#8d6442' },
  { id: 'dark_wood', name: 'Nogal Taberna', baseColor: '#5c3f2b' },
  { id: 'herringbone', name: 'Parqué Espiga', baseColor: '#b38c59' },
  { id: 'temple_teal', name: 'Mosaico Templo', baseColor: '#3a6c64' },
  { id: 'slate_tile', name: 'Pizarra Mazmorra', baseColor: '#505863' },
  { id: 'rough_cobble', name: 'Piedra Rústica', baseColor: '#5c5854' },
  { id: 'marble_check', name: 'Mármol Clásico', baseColor: '#c9c4b8' },
  { id: 'marble_white_gold', name: 'Mármol Blanco y Oro', baseColor: '#e3ddd1' },
  { id: 'dungeon_cracked', name: 'Losa Agrietada', baseColor: '#46494f' },
  { id: 'brick_herringbone', name: 'Ladrillo en Espiga', baseColor: '#8a4a3b' },
  { id: 'bamboo_tatami', name: 'Tatami Bambú', baseColor: '#a89f68' },
  { id: 'obsidian_hex', name: 'Hexágonos Obsidiana', baseColor: '#282633' },
  { id: 'sandstone_tile', name: 'Losa Arenisca', baseColor: '#bf9b6b' },
  { id: 'copper_plate', name: 'Forja Enana Bronce', baseColor: '#7a593e' },
  { id: 'castle_flagstone', name: 'Sillería Castillo', baseColor: '#6c7078' },
  { id: 'checkered_black_white', name: 'Damero Imperial', baseColor: '#888888' },
  { id: 'carpet_crimson', name: 'Tapiz Carmesí', baseColor: '#7a2c2f' },
  { id: 'carpet_royal_blue', name: 'Tapiz Azul Real', baseColor: '#264373' },
];

export const WALL_STYLES: MaterialMeta<WallStyleId>[] = [
  { id: 'stone_hewn', name: 'Piedra Labrada', baseColor: '#6e685f' },
  { id: 'timber_frame', name: 'Madera y Vigas', baseColor: '#6b472b' },
  { id: 'rough_masonry', name: 'Mampostería', baseColor: '#55514c' },
  { id: 'brick_aged', name: 'Ladrillo Antiguo', baseColor: '#7b493b' },
  { id: 'temple_gold', name: 'Muro Dorado', baseColor: '#8d7344' },
  { id: 'obsidian_black', name: 'Obsidiana Oscura', baseColor: '#292733' },
  { id: 'marble_white', name: 'Mármol Blanco', baseColor: '#cfc9bc' },
  { id: 'sandstone_wall', name: 'Muro Arenisca', baseColor: '#b59264' },
  { id: 'cave_rock', name: 'Roca de Caverna', baseColor: '#4a433d' },
  { id: 'iron_fortress', name: 'Hierro Forjado', baseColor: '#3f4652' },
  { id: 'hedge_wall', name: 'Seto Vivo', baseColor: '#2f5934' },
  { id: 'palisade_wood', name: 'Empalizada Troncos', baseColor: '#593c23' },
];

export const ROOF_STYLES: MaterialMeta<RoofStyleId>[] = [
  { id: 'slate_blue', name: 'Teja Pizarra Azul', baseColor: '#3d586e' },
  { id: 'terracotta', name: 'Teja Terracota', baseColor: '#8f4733' },
  { id: 'thatch', name: 'Paja Medieval', baseColor: '#9e8450' },
  { id: 'dark_shingle', name: 'Teja Oscura', baseColor: '#383c44' },
  { id: 'copper_verdigris', name: 'Cobre Oxidado', baseColor: '#3c7a6c' },
  { id: 'crimson_tile', name: 'Teja Imperial Roja', baseColor: '#7d262b' },
  { id: 'wood_planks_roof', name: 'Tablones Rústicos', baseColor: '#634329' },
  { id: 'gold_dome', name: 'Teja Dorada', baseColor: '#a6853c' },
];

const textureCache = new Map<string, HTMLCanvasElement>();
const patternCache = new WeakMap<CanvasRenderingContext2D, Map<string, CanvasPattern>>();
const thumbCache = new Map<string, string>();

function generateSurface(kind: 'terrain' | 'floor', id: string): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(SURFACE_SIZE, SURFACE_SIZE);
  const rand = mulberry32(id.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 17));
  paintSurface(ctx, kind, id, rand);
  return canvas;
}

function generateRoofTexture(id: RoofStyleId): HTMLCanvasElement {
  const size = 256;
  const [canvas, ctx] = makeCanvas(size, size);
  const rand = mulberry32(id.split('').reduce((acc, c) => acc * 41 + c.charCodeAt(0), 53));

  const palettes: Record<RoofStyleId, [string, string, string]> = {
    slate_blue: ['#385166', '#45637b', '#2b3f50'],
    terracotta: ['#8c4330', '#a3513a', '#6e3223'],
    thatch: ['#9a804d', '#b0955d', '#7c653a'],
    dark_shingle: ['#373b42', '#464b54', '#292c32'],
    copper_verdigris: ['#3b786b', '#4d9686', '#29574d'],
    crimson_tile: ['#7a252a', '#943137', '#59181c'],
    wood_planks_roof: ['#634329', '#785233', '#4a311d'],
    gold_dome: ['#a68438', '#c49e47', '#7d6124'],
  };

  const [base, light, dark] = palettes[id] ?? palettes.slate_blue;
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, size, size);

  const rows = 12;
  const cols = 8;
  const rowH = size / rows;
  const colW = size / cols;

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (colW * 0.5);
    for (let c = -1; c <= cols; c++) {
      const x = c * colW + offset;
      const y = r * rowH;
      ctx.fillStyle = rand() > 0.55 ? light : rand() > 0.25 ? base : dark;
      ctx.fillRect(x + 1, y + 1, colW - 2, rowH - 2);
      ctx.fillStyle = 'rgba(0,0,0,0.32)';
      ctx.fillRect(x, y + rowH - 3, colW, 3);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(x + 1, y + 1, colW - 2, 2);
    }
  }
  return canvas;
}

export function getTextureCanvas(
  kind: 'terrain' | 'floor' | 'roof',
  id: string
): HTMLCanvasElement {
  const key = `${kind}:${id}`;
  let c = textureCache.get(key);
  if (!c) {
    c =
      kind === 'roof' ? generateRoofTexture(id as RoofStyleId) : generateSurface(kind, id);
    textureCache.set(key, c);
  }
  return c;
}

export function getTexturePattern(
  ctx: CanvasRenderingContext2D,
  kind: 'terrain' | 'floor' | 'roof',
  id: string,
  scale = 1
): CanvasPattern | null {
  let ctxMap = patternCache.get(ctx);
  if (!ctxMap) {
    ctxMap = new Map();
    patternCache.set(ctx, ctxMap);
  }
  const key = `${kind}:${id}:${scale.toFixed(3)}`;
  let pat = ctxMap.get(key);
  if (!pat) {
    const canvas = getTextureCanvas(kind, id);
    const created = ctx.createPattern(canvas, 'repeat');
    if (created) {
      if (scale !== 1 && typeof DOMMatrix !== 'undefined') {
        created.setTransform(new DOMMatrix().scale(scale, scale));
      }
      ctxMap.set(key, created);
      pat = created;
    }
  }
  return pat ?? null;
}

let roadCanvas: HTMLCanvasElement | null = null;
const roadPatterns = new WeakMap<CanvasRenderingContext2D, CanvasPattern>();

// Seamless packed earth with soil patches, grain and half-buried pebbles.
function generateRoadTexture(): HTMLCanvasElement {
  const size = 256;
  const [canvas, ctx] = makeCanvas(size, size);
  const rand = mulberry32(4271);
  const patches = tileNoise(rand, size, 5);
  const clumps = tileNoise(rand, size, 20);
  const grain = tileNoise(rand, size, 112);
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const mix = patches(x, y);
      const shade = (clumps(x, y) - 0.5) * 30 + (grain(x, y) - 0.5) * 34;
      const o = (y * size + x) * 4;
      image.data[o] = 128 + mix * 34 + shade;
      image.data[o + 1] = 101 + mix * 29 + shade * 0.9;
      image.data[o + 2] = 67 + mix * 22 + shade * 0.7;
      image.data[o + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);

  for (let i = 0; i < 150; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 1.2 + rand() * rand() * 5;
    const tilt = rand() * Math.PI;
    const tone = 112 + Math.floor(rand() * 55);
    // Repeat at the borders so pebbles cross the tile edge without being cut.
    for (let dx = -size; dx <= size; dx += size) {
      for (let dy = -size; dy <= size; dy += size) {
        const pebble = (ox: number, oy: number, grow: number, color: string) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.ellipse(x + dx + ox, y + dy + oy, r * grow, r * 0.75 * grow, tilt, 0, Math.PI * 2);
          ctx.fill();
        };
        pebble(1, 1.4, 1.1, 'rgba(45, 30, 15, 0.4)');
        pebble(0, 0, 1, `rgb(${tone + 12},${tone},${tone - 22})`);
        pebble(-r * 0.25, -r * 0.25, 0.45, 'rgba(255, 240, 210, 0.28)');
      }
    }
  }
  return canvas;
}

export function getRoadPattern(
  ctx: CanvasRenderingContext2D,
  scale: number
): CanvasPattern | null {
  let pattern = roadPatterns.get(ctx) ?? null;
  if (!pattern) {
    roadCanvas ??= generateRoadTexture();
    pattern = ctx.createPattern(roadCanvas, 'repeat');
    if (pattern) roadPatterns.set(ctx, pattern);
  }
  pattern?.setTransform(new DOMMatrix().scale(scale, scale));
  return pattern;
}

export function getTextureThumbnail(
  kind: 'terrain' | 'floor' | 'roof',
  id: string
): string {
  const key = `${kind}:${id}`;
  let url = thumbCache.get(key);
  if (!url) {
    const src = getTextureCanvas(kind, id);
    const [thumb, tctx] = makeCanvas(64, 64);
    tctx.drawImage(src, 0, 0, 128, 128, 0, 0, 64, 64);
    url = thumb.toDataURL('image/png');
    thumbCache.set(key, url);
  }
  return url;
}

export function getWallColors(style: WallStyleId): {
  fill: string;
  core: string;
  stroke: string;
  highlight: string;
} {
  switch (style) {
    case 'stone_hewn':
      return { fill: '#787166', core: '#948b7d', stroke: '#2a2621', highlight: '#b5ab9a' };
    case 'timber_frame':
      return { fill: '#6c492d', core: '#8a603d', stroke: '#26170c', highlight: '#ab7e55' };
    case 'rough_masonry':
      return { fill: '#5c5852', core: '#736f68', stroke: '#201e1c', highlight: '#8c877f' };
    case 'brick_aged':
      return { fill: '#7c4839', core: '#965a49', stroke: '#2c1712', highlight: '#b3715e' };
    case 'temple_gold':
      return { fill: '#8f7543', core: '#b39558', stroke: '#302512', highlight: '#d6ba7c' };
    case 'obsidian_black':
      return { fill: '#282533', core: '#3d384d', stroke: '#100e17', highlight: '#695f85' };
    case 'marble_white':
      return { fill: '#c7c1b3', core: '#e3ded1', stroke: '#4a463e', highlight: '#ffffff' };
    case 'sandstone_wall':
      return { fill: '#ad8b5c', core: '#c9a675', stroke: '#3d2d19', highlight: '#e3c496' };
    case 'cave_rock':
      return { fill: '#474039', core: '#5c534a', stroke: '#1c1815', highlight: '#756a5f' };
    case 'iron_fortress':
      return { fill: '#3e444f', core: '#57606e', stroke: '#16191f', highlight: '#8592a6' };
    case 'hedge_wall':
      return { fill: '#2c5430', core: '#3f7344', stroke: '#132615', highlight: '#639e67' };
    case 'palisade_wood':
      return { fill: '#593c22', core: '#75502f', stroke: '#1f1309', highlight: '#966940' };
  }
}
