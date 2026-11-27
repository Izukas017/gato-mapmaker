import type {
  FloorPatternId,
  RoofStyleId,
  TerrainMaterialId,
  WallStyleId,
} from '../types/map';

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

function addOrganicNoise(
  ctx: CanvasRenderingContext2D,
  size: number,
  seed: number,
  count: number,
  minR: number,
  maxR: number,
  colors: string[],
  alpha: number
) {
  const rand = mulberry32(seed);
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let i = 0; i < count; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = minR + rand() * (maxR - minR);
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx * size;
        const ny = y + dy * size;
        if (nx + r < 0 || nx - r > size || ny + r < 0 || ny - r > size) continue;
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();
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

function generateTerrainTexture(id: TerrainMaterialId): HTMLCanvasElement {
  const size = 256;
  const [canvas, ctx] = makeCanvas(size, size);
  const rand = mulberry32(id.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 17));

  if (id === 'dirt') {
    ctx.fillStyle = '#756348';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 101, 140, 12, 36, ['#857153', '#63533b', '#8d795a', '#594a35'], 0.22);
    addOrganicNoise(ctx, size, 102, 220, 1.5, 4, ['#4b3e2c', '#9c8868', '#5c4d39'], 0.35);
    addOrganicNoise(ctx, size, 103, 28, 3, 9, ['#4c5d3a', '#5c6b42'], 0.16);
  } else if (id === 'grass') {
    ctx.fillStyle = '#4c633b';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 201, 160, 10, 34, ['#5b7546', '#3e5230', '#687f4b', '#3a4a2b'], 0.26);
    ctx.save();
    for (let i = 0; i < 360; i++) {
      const x = rand() * size;
      const y = rand() * size;
      ctx.strokeStyle = rand() > 0.5 ? 'rgba(122,150,82,0.38)' : 'rgba(38,52,28,0.42)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rand() - 0.5) * 5, y - 3 - rand() * 5);
      ctx.stroke();
    }
    ctx.restore();
  } else if (id === 'cobblestone') {
    ctx.fillStyle = '#3c3935';
    ctx.fillRect(0, 0, size, size);
    const rows = 8;
    const rowH = size / rows;
    for (let r = 0; r < rows; r++) {
      const cols = 6;
      const colW = size / cols;
      const offset = (r % 2) * (colW * 0.5);
      for (let c = -1; c <= cols; c++) {
        const x = c * colW + offset + 2;
        const y = r * rowH + 2;
        const w = colW - 4;
        const h = rowH - 4;
        const shade = 92 + Math.floor(rand() * 34);
        const warm = Math.floor(rand() * 14) - 5;
        ctx.fillStyle = `rgb(${shade + warm}, ${shade + Math.floor(warm * 0.5)}, ${shade - 4})`;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 4);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,250,240,0.16)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.fillRect(x + 2, y + h - 4, w - 4, 3);
      }
    }
    addOrganicNoise(ctx, size, 303, 90, 6, 18, ['#4e4a44', '#868077', '#4a573e'], 0.14);
  } else if (id === 'flagstone') {
    ctx.fillStyle = '#3f3d38';
    ctx.fillRect(0, 0, size, size);
    const cells = 4;
    const step = size / cells;
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        const offset = (r % 2) * (step * 0.5);
        for (let wrap = -1; wrap <= 1; wrap++) {
          const x = c * step + offset + wrap * size + 3;
          const y = r * step + 3;
          if (x > size || x + step < 0) continue;
          const v = 104 + Math.floor(rand() * 26);
          ctx.fillStyle = `rgb(${v + 4}, ${v}, ${v - 6})`;
          ctx.beginPath();
          ctx.roundRect(x, y, step - 6, step - 6, 3);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.12)';
          ctx.stroke();
        }
      }
    }
    addOrganicNoise(ctx, size, 404, 110, 4, 16, ['#3d4a34', '#9a9488', '#524e47'], 0.15);
  } else if (id === 'moss') {
    ctx.fillStyle = '#3b5235';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 501, 180, 8, 28, ['#4c6940', '#2d4029', '#617a49'], 0.3);
    addOrganicNoise(ctx, size, 502, 200, 1, 3, ['#7d9658', '#243321'], 0.35);
  } else if (id === 'sand') {
    ctx.fillStyle = '#c4ab7e';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 601, 150, 12, 34, ['#d4bc91', '#b0966a', '#ccb488'], 0.24);
    addOrganicNoise(ctx, size, 602, 260, 1, 2.5, ['#8f7750', '#e3cfa8'], 0.3);
  } else if (id === 'mud') {
    ctx.fillStyle = '#47392b';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 701, 150, 10, 32, ['#574635', '#362a1f', '#63503d'], 0.28);
  } else if (id === 'gravel') {
    ctx.fillStyle = '#5e6268';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 810, 140, 10, 26, ['#6e737a', '#4e5257', '#7b8087'], 0.25);
    addOrganicNoise(ctx, size, 811, 420, 1.2, 3.8, ['#36393d', '#9298a1', '#484b50'], 0.55);
  } else if (id === 'volcanic') {
    ctx.fillStyle = '#29272c';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 820, 160, 10, 30, ['#38353d', '#1f1d22', '#423d47'], 0.35);
    ctx.strokeStyle = 'rgba(18, 16, 20, 0.7)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 45; i++) {
      const x = rand() * size;
      const y = rand() * size;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rand() - 0.5) * 40, y + (rand() - 0.5) * 40);
      ctx.stroke();
    }
  } else if (id === 'lava_crust') {
    ctx.fillStyle = '#261714';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 830, 130, 10, 28, ['#38211b', '#1c100d', '#4f2819'], 0.38);
    // Glowing magma veins
    ctx.save();
    for (let i = 0; i < 36; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const x2 = x + (rand() - 0.5) * 55;
      const y2 = y + (rand() - 0.5) * 55;
      ctx.strokeStyle = 'rgba(255, 85, 20, 0.55)';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.strokeStyle = '#ffcf4d';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();
  } else if (id === 'ice') {
    ctx.fillStyle = '#86bed6';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 840, 120, 14, 38, ['#a3d5eb', '#6ba6bf', '#c2e8f7'], 0.28);
    ctx.strokeStyle = 'rgba(235, 250, 255, 0.45)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 50; i++) {
      const x = rand() * size;
      const y = rand() * size;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rand() - 0.5) * 48, y + (rand() - 0.5) * 48);
      ctx.stroke();
    }
  } else if (id === 'swamp') {
    ctx.fillStyle = '#3b472d';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 850, 160, 10, 32, ['#2b3826', '#4d5932', '#332b20', '#23423b'], 0.34);
    addOrganicNoise(ctx, size, 851, 90, 2, 6, ['#657a39', '#1c2b24'], 0.4);
  } else if (id === 'desert_cracked') {
    ctx.fillStyle = '#ad8257';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 860, 130, 12, 34, ['#bf9367', '#966d45', '#c99f73'], 0.25);
    ctx.strokeStyle = 'rgba(74, 48, 25, 0.55)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 65; i++) {
      const x = rand() * size;
      const y = rand() * size;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rand() - 0.5) * 32, y + (rand() - 0.5) * 32);
      ctx.stroke();
    }
  } else if (id === 'autumn_leaves') {
    ctx.fillStyle = '#6e4930';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 870, 140, 10, 28, ['#855433', '#593a25', '#9e5b2b'], 0.3);
    addOrganicNoise(ctx, size, 871, 340, 2, 5.5, ['#d96b27', '#c43c21', '#e6a132', '#8c2d19'], 0.58);
  } else if (id === 'arcane_ground') {
    ctx.fillStyle = '#372647';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 880, 150, 10, 32, ['#49315e', '#261933', '#5c3875'], 0.32);
    addOrganicNoise(ctx, size, 881, 140, 1.5, 4, ['#a855f7', '#38bdf8', '#c084fc'], 0.38);
  } else {
    // snow
    ctx.fillStyle = '#d4dee8';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 801, 140, 14, 38, ['#e7eff7', '#bccad9', '#ffffff'], 0.25);
  }

  return canvas;
}

function generateFloorTexture(id: FloorPatternId): HTMLCanvasElement {
  const size = 256;
  const [canvas, ctx] = makeCanvas(size, size);
  const rand = mulberry32(id.split('').reduce((acc, c) => acc * 37 + c.charCodeAt(0), 91));

  if (id === 'wood_planks' || id === 'dark_wood') {
    const isDark = id === 'dark_wood';
    ctx.fillStyle = isDark ? '#4a3121' : '#80593a';
    ctx.fillRect(0, 0, size, size);
    const planks = 8;
    const pw = size / planks;
    for (let i = 0; i < planks; i++) {
      const x = i * pw;
      const delta = Math.floor((rand() - 0.5) * 18);
      const r = (isDark ? 82 : 138) + delta;
      const g = (isDark ? 55 : 98) + Math.floor(delta * 0.7);
      const b = (isDark ? 38 : 64) + Math.floor(delta * 0.5);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x + 1, 0, pw - 2, size);

      ctx.strokeStyle = isDark ? 'rgba(30,16,8,0.28)' : 'rgba(65,38,18,0.22)';
      ctx.lineWidth = 1;
      for (let gLine = 0; gLine < 5; gLine++) {
        const gx = x + 4 + rand() * (pw - 8);
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.bezierCurveTo(gx + 3, size * 0.33, gx - 3, size * 0.66, gx, size);
        ctx.stroke();
      }
      const jy = Math.floor(rand() * size);
      ctx.strokeStyle = 'rgba(20,12,6,0.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, jy);
      ctx.lineTo(x + pw, jy);
      ctx.stroke();
      ctx.fillStyle = 'rgba(20,12,6,0.55)';
      ctx.fillRect(x + 4, jy + 3, 2, 2);
      ctx.fillRect(x + pw - 6, jy + 3, 2, 2);
    }
    ctx.strokeStyle = 'rgba(24,14,8,0.55)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= planks; i++) {
      ctx.beginPath();
      ctx.moveTo(i * pw, 0);
      ctx.lineTo(i * pw, size);
      ctx.stroke();
    }
  } else if (id === 'herringbone' || id === 'brick_herringbone') {
    const isBrick = id === 'brick_herringbone';
    ctx.fillStyle = isBrick ? '#6e3629' : '#a88352';
    ctx.fillRect(0, 0, size, size);
    const tile = 64;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const bx = col * tile;
        const by = row * tile;
        const flip = (row + col) % 2 === 0;
        ctx.save();
        ctx.translate(bx + tile / 2, by + tile / 2);
        if (flip) ctx.rotate(Math.PI / 2);
        const strips = 4;
        const sw = tile / strips;
        for (let s = 0; s < strips; s++) {
          const d = Math.floor((rand() - 0.5) * 18);
          ctx.fillStyle = isBrick
            ? `rgb(${145 + d},${75 + Math.floor(d * 0.6)},${58 + Math.floor(d * 0.5)})`
            : `rgb(${176 + d},${139 + Math.floor(d * 0.8)},${88 + Math.floor(d * 0.6)})`;
          ctx.fillRect(-tile / 2 + s * sw + 0.5, -tile / 2 + 0.5, sw - 1, tile - 1);
          ctx.strokeStyle = isBrick ? 'rgba(42,20,14,0.55)' : 'rgba(72,48,22,0.35)';
          ctx.lineWidth = 1;
          ctx.strokeRect(-tile / 2 + s * sw, -tile / 2, sw, tile);
        }
        ctx.restore();
        ctx.strokeStyle = isBrick ? 'rgba(42,20,14,0.5)' : 'rgba(74,50,24,0.45)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx, by, tile, tile);
      }
    }
  } else if (id === 'temple_teal') {
    ctx.fillStyle = '#9a8c6b';
    ctx.fillRect(0, 0, size, size);
    const step = 64;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const x = c * step;
        const y = r * step;
        const v = Math.floor((rand() - 0.5) * 14);
        ctx.fillStyle = `rgb(${48 + v},${106 + v},${98 + v})`;
        ctx.fillRect(x + 5, y + 5, step - 10, step - 10);
        ctx.strokeStyle = 'rgba(20,48,44,0.6)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + 5, y + 5, step - 10, step - 10);
        ctx.fillStyle = '#cfc5a7';
        ctx.beginPath();
        ctx.moveTo(x + step / 2, y + step / 2 - 7);
        ctx.lineTo(x + step / 2 + 7, y + step / 2);
        ctx.lineTo(x + step / 2, y + step / 2 + 7);
        ctx.lineTo(x + step / 2 - 7, y + step / 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(40,60,55,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    addOrganicNoise(ctx, size, 912, 70, 6, 20, ['#234742', '#b8ab8a'], 0.13);
  } else if (id === 'slate_tile' || id === 'dungeon_cracked') {
    ctx.fillStyle = '#2b2f36';
    ctx.fillRect(0, 0, size, size);
    const step = 64;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const x = c * step + 2;
        const y = r * step + 2;
        const v = 70 + Math.floor(rand() * 22);
        ctx.fillStyle = `rgb(${v - 4},${v},${v + 7})`;
        ctx.beginPath();
        ctx.roundRect(x, y, step - 4, step - 4, 2);
        ctx.fill();
        if (id === 'dungeon_cracked' && rand() > 0.35) {
          ctx.strokeStyle = 'rgba(20,22,26,0.75)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x + 10, y + 8);
          ctx.lineTo(x + 28, y + 30);
          ctx.lineTo(x + 48, y + 42);
          ctx.stroke();
        }
      }
    }
    addOrganicNoise(ctx, size, 913, 80, 5, 18, ['#2d333b', '#6d7785'], 0.14);
  } else if (id === 'rough_cobble') {
    ctx.fillStyle = '#2f2d2a';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 64; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const rx = 10 + rand() * 14;
      const ry = 8 + rand() * 12;
      const v = 76 + Math.floor(rand() * 30);
      ctx.fillStyle = `rgb(${v + 4},${v},${v - 4})`;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          ctx.beginPath();
          ctx.ellipse(x + dx * size, y + dy * size, rx, ry, rand() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(18,16,14,0.6)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }
  } else if (id === 'marble_check' || id === 'checkered_black_white') {
    const isBW = id === 'checkered_black_white';
    const step = 64;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const alt = (r + c) % 2 === 0;
        ctx.fillStyle = isBW ? (alt ? '#e6e4df' : '#2b2d33') : alt ? '#cfc9bc' : '#96a19b';
        ctx.fillRect(c * step, r * step, step, step);
        ctx.strokeStyle = 'rgba(50,50,50,0.22)';
        ctx.strokeRect(c * step, r * step, step, step);
      }
    }
    addOrganicNoise(ctx, size, 915, 65, 8, 24, ['#ffffff', '#6d7570'], 0.1);
  } else if (id === 'marble_white_gold') {
    ctx.fillStyle = '#e8e2d5';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(ctx, size, 920, 70, 12, 34, ['#f5f1e8', '#cfc7b6', '#ded7c8'], 0.25);
    const step = 64;
    ctx.strokeStyle = '#c49b45';
    ctx.lineWidth = 2;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.strokeRect(c * step + 2, r * step + 2, step - 4, step - 4);
      }
    }
  } else if (id === 'bamboo_tatami') {
    ctx.fillStyle = '#aba16a';
    ctx.fillRect(0, 0, size, size);
    const step = 64;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const x = c * step;
        const y = r * step;
        ctx.fillStyle = (r + c) % 2 === 0 ? '#b5ab72' : '#9e945e';
        ctx.fillRect(x, y, step, step);
        ctx.strokeStyle = 'rgba(70,64,32,0.25)';
        ctx.lineWidth = 1;
        for (let i = 4; i < step; i += 4) {
          ctx.beginPath();
          if ((r + c) % 2 === 0) {
            ctx.moveTo(x, y + i);
            ctx.lineTo(x + step, y + i);
          } else {
            ctx.moveTo(x + i, y);
            ctx.lineTo(x + i, y + step);
          }
          ctx.stroke();
        }
        ctx.strokeStyle = '#3d4f2f';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 1.5, y + 1.5, step - 3, step - 3);
      }
    }
  } else if (id === 'obsidian_hex') {
    ctx.fillStyle = '#1c1a24';
    ctx.fillRect(0, 0, size, size);
    const step = 32;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const x = c * step + (r % 2) * 16;
        const y = r * step;
        const v = 36 + Math.floor(rand() * 20);
        ctx.fillStyle = `rgb(${v},${v - 3},${v + 12})`;
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(130,90,210,0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  } else if (id === 'sandstone_tile') {
    ctx.fillStyle = '#8c6d46';
    ctx.fillRect(0, 0, size, size);
    const step = 64;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const v = 182 + Math.floor((rand() - 0.5) * 22);
        ctx.fillStyle = `rgb(${v},${Math.floor(v * 0.82)},${Math.floor(v * 0.56)})`;
        ctx.beginPath();
        ctx.roundRect(c * step + 2, r * step + 2, step - 4, step - 4, 4);
        ctx.fill();
      }
    }
    addOrganicNoise(ctx, size, 930, 90, 5, 18, ['#d4b283', '#8f6f45'], 0.16);
  } else if (id === 'copper_plate') {
    ctx.fillStyle = '#4a3525';
    ctx.fillRect(0, 0, size, size);
    const step = 64;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const x = c * step;
        const y = r * step;
        ctx.fillStyle = '#7d5a3c';
        ctx.fillRect(x + 3, y + 3, step - 6, step - 6);
        ctx.strokeStyle = '#b88b58';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + 6, y + 6, step - 12, step - 12);
        // Corner rivets
        ctx.fillStyle = '#d4aa72';
        ctx.fillRect(x + 8, y + 8, 3, 3);
        ctx.fillRect(x + step - 11, y + 8, 3, 3);
        ctx.fillRect(x + 8, y + step - 11, 3, 3);
        ctx.fillRect(x + step - 11, y + step - 11, 3, 3);
      }
    }
  } else if (id === 'castle_flagstone') {
    ctx.fillStyle = '#3b3e45';
    ctx.fillRect(0, 0, size, size);
    const rows = 4;
    const rh = size / rows;
    for (let r = 0; r < rows; r++) {
      const cols = 3;
      const cw = size / cols;
      const off = (r % 2) * 40;
      for (let c = -1; c <= cols; c++) {
        const v = 98 + Math.floor(rand() * 24);
        ctx.fillStyle = `rgb(${v},${v + 3},${v + 8})`;
        ctx.fillRect(c * cw + off + 2, r * rh + 2, cw - 4, rh - 4);
      }
    }
  } else {
    // carpet_crimson or carpet_royal_blue
    const isBlue = id === 'carpet_royal_blue';
    ctx.fillStyle = isBlue ? '#233e6b' : '#75292d';
    ctx.fillRect(0, 0, size, size);
    addOrganicNoise(
      ctx,
      size,
      916,
      120,
      6,
      20,
      isBlue ? ['#2f518a', '#192d4f', '#3b62a3'] : ['#8c3539', '#5c1e22', '#9e443e'],
      0.22
    );
    ctx.strokeStyle = 'rgba(207,168,97,0.25)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < size; i += 32) {
      ctx.strokeRect(i + 4, 4, 24, size - 8);
    }
  }

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
    if (kind === 'terrain') c = generateTerrainTexture(id as TerrainMaterialId);
    else if (kind === 'floor') c = generateFloorTexture(id as FloorPatternId);
    else c = generateRoofTexture(id as RoofStyleId);
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
