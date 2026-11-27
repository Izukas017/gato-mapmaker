import type { FloorPatternId, TerrainMaterialId } from '../types/map';

// Seamless hand-painted style surfaces: every helper wraps around the texture edges.
export const SURFACE_SIZE = 256;
const S = SURFACE_SIZE;

type Rand = () => number;
type Noise = (x: number, y: number) => number;
type RGB = [number, number, number];

const clamp = (v: number, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);
const rgb = (hex: string): RGB => {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};
const mix = (a: RGB, b: RGB, t: number): RGB => {
  const k = clamp(t);
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
};
const shade = (c: RGB, d: number): RGB => [c[0] + d, c[1] + d, c[2] + d];
const pickFrom = <T>(rand: Rand, list: T[]): T => list[Math.floor(rand() * list.length)];

// Colour ramp through evenly spaced stops.
function ramp(stops: string[]): (t: number) => RGB {
  const colors = stops.map(rgb);
  return (t) => {
    const at = clamp(t) * (colors.length - 1);
    const i = Math.min(colors.length - 2, Math.floor(at));
    return mix(colors[i], colors[i + 1], at - i);
  };
}

// Value noise whose lattice wraps, so it tiles. cellsY lets the grain be stretched.
export function tileNoise(rand: Rand, size: number, cells: number, cellsY = cells): Noise {
  const grid = Array.from({ length: cells * cellsY }, () => rand());
  const wrap = (v: number, n: number) => ((v % n) + n) % n;
  const at = (i: number, j: number) => grid[wrap(j, cellsY) * cells + wrap(i, cells)];
  return (x, y) => {
    const gx = (x / size) * cells;
    const gy = (y / size) * cellsY;
    const i = Math.floor(gx);
    const j = Math.floor(gy);
    const u = (gx - i) * (gx - i) * (3 - 2 * (gx - i));
    const v = (gy - j) * (gy - j) * (3 - 2 * (gy - j));
    const top = at(i, j) + (at(i + 1, j) - at(i, j)) * u;
    const bottom = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * u;
    return top + (bottom - top) * v;
  };
}

// Several octaves of noise, stretched to use most of 0..1.
function fbm(rand: Rand, cells: number): Noise {
  const a = tileNoise(rand, S, cells);
  const b = tileNoise(rand, S, cells * 2);
  const c = tileNoise(rand, S, cells * 5);
  return (x, y) => clamp((a(x, y) * 0.57 + b(x, y) * 0.28 + c(x, y) * 0.15 - 0.5) * 1.7 + 0.5);
}

function pixels(ctx: CanvasRenderingContext2D, color: (x: number, y: number) => RGB) {
  const image = ctx.createImageData(S, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const [r, g, b] = color(x, y);
      const o = (y * S + x) * 4;
      image.data[o] = r;
      image.data[o + 1] = g;
      image.data[o + 2] = b;
      image.data[o + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
}

// Calls draw at (x, y) and at every wrapped copy that can reach into the tile.
function wrapped(x: number, y: number, reach: number, draw: (x: number, y: number) => void) {
  for (let dx = -S; dx <= S; dx += S) {
    for (let dy = -S; dy <= S; dy += S) {
      const px = x + dx;
      const py = y + dy;
      if (px > -reach && px < S + reach && py > -reach && py < S + reach) draw(px, py);
    }
  }
}

function scatter(rand: Rand, count: number, reach: number, draw: (x: number, y: number) => void) {
  for (let i = 0; i < count; i++) wrapped(rand() * S, rand() * S, reach, draw);
}

function oval(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  turn: number,
  fill: string
) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, turn, 0, Math.PI * 2);
  ctx.fill();
}

// Loose stones with a drop shadow and a lit top.
function pebbles(
  ctx: CanvasRenderingContext2D,
  rand: Rand,
  count: number,
  minR: number,
  maxR: number,
  colors: string[]
) {
  for (let i = 0; i < count; i++) {
    const r = minR + rand() * rand() * (maxR - minR);
    const turn = rand() * Math.PI;
    const flat = 0.65 + rand() * 0.3;
    const color = pickFrom(rand, colors);
    wrapped(rand() * S, rand() * S, r * 2, (x, y) => {
      oval(ctx, x + r * 0.28, y + r * 0.4, r * 1.08, r * flat * 1.08, turn, 'rgba(15,10,6,0.38)');
      oval(ctx, x, y, r, r * flat, turn, color);
      oval(ctx, x - r * 0.25, y - r * 0.28, r * 0.46, r * flat * 0.4, turn, 'rgba(255,245,225,0.24)');
    });
  }
}

// Jagged lines wandering across the tile.
function cracks(
  ctx: CanvasRenderingContext2D,
  rand: Rand,
  count: number,
  steps: number,
  width: number,
  color: string
) {
  for (let i = 0; i < count; i++) {
    let angle = rand() * Math.PI * 2;
    const points = [{ x: 0, y: 0 }];
    for (let k = 0; k < steps; k++) {
      angle += (rand() - 0.5) * 1.3;
      const last = points[points.length - 1];
      const step = 4 + rand() * 8;
      points.push({ x: last.x + Math.cos(angle) * step, y: last.y + Math.sin(angle) * step });
    }
    wrapped(rand() * S, rand() * S, steps * 12, (x, y) => {
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      for (let k = 1; k < points.length; k++) {
        ctx.lineWidth = width * (1 - k / points.length) + 0.35;
        ctx.beginPath();
        ctx.moveTo(x + points[k - 1].x, y + points[k - 1].y);
        ctx.lineTo(x + points[k].x, y + points[k].y);
        ctx.stroke();
      }
    });
  }
}

interface Cell {
  id: number;
  edge: number; // distance to the nearest border, in px
  facing: number; // 1 = that border faces the top-left light, -1 = faces away
}

// Wrapped Voronoi cells on a jittered lattice (jitter 0 with shifted rows gives hexagons).
function voronoi(
  rand: Rand,
  cols: number,
  rows: number,
  jitter: number,
  round: number,
  warp = 0
): (x: number, y: number) => Cell {
  const sx = S / cols;
  const sy = S / rows;
  const sites = Array.from({ length: cols * rows }, (_, k) => ({
    x: ((k % cols) + 0.5 + (Math.floor(k / cols) % 2) * 0.5 + (rand() - 0.5) * jitter) * sx,
    y: (Math.floor(k / cols) + 0.5 + (rand() - 0.5) * jitter) * sy,
  }));
  const wx = tileNoise(rand, S, 10);
  const wy = tileNoise(rand, S, 10);
  const near = Array.from({ length: 25 }, () => ({ id: 0, dx: 0, dy: 0, d: 0 }));
  return (px, py) => {
    const x = px + (wx(px, py) - 0.5) * warp;
    const y = py + (wy(px, py) - 0.5) * warp;
    const row = Math.floor(y / sy);
    const col = Math.floor(x / sx);
    let best = near[0];
    let n = 0;
    for (let r = row - 2; r <= row + 2; r++) {
      const wr = ((r % rows) + rows) % rows;
      for (let c = col - 2; c <= col + 2; c++) {
        const wc = ((c % cols) + cols) % cols;
        const id = wr * cols + wc;
        const item = near[n++];
        item.id = id;
        item.dx = sites[id].x + ((c - wc) / cols) * S - x;
        item.dy = sites[id].y + ((r - wr) / rows) * S - y;
        item.d = item.dx * item.dx + item.dy * item.dy;
        if (n === 1 || item.d < best.d) best = item;
      }
    }
    let sum = 0;
    let nx = 0;
    let ny = 0;
    for (const other of near) {
      const ex = other.dx - best.dx;
      const ey = other.dy - best.dy;
      const len = Math.hypot(ex, ey);
      if (len < 0.01) continue;
      const weight = Math.exp(-(other.d - best.d) / (2 * len) / round);
      sum += weight;
      nx += (ex / len) * weight;
      ny += (ey / len) * weight;
    }
    return {
      id: best.id,
      edge: -round * Math.log(sum || 1e-9),
      facing: -(nx + ny) / (Math.hypot(nx, ny) * Math.SQRT2 || 1),
    };
  };
}

interface StoneStyle {
  cols: number;
  rows: number;
  jitter: number;
  round: number;
  warp: number;
  gap: number;
  bevel: number; // strength of the lit/shadowed rim
  colors: string[];
  mortar: string;
  grain: number;
}

// Irregular stones set in mortar, each with its own tone, speckle and bevel.
function stones(ctx: CanvasRenderingContext2D, rand: Rand, style: StoneStyle) {
  const cell = voronoi(rand, style.cols, style.rows, style.jitter, style.round, style.warp);
  const tones = Array.from({ length: style.cols * style.rows }, () =>
    shade(rgb(pickFrom(rand, style.colors)), (rand() - 0.5) * 14)
  );
  const blotch = fbm(rand, 8);
  const speck = tileNoise(rand, S, 100);
  const mortar = rgb(style.mortar);
  pixels(ctx, (x, y) => {
    const c = cell(x, y);
    const noise = ((blotch(x, y) - 0.5) * 1.3 + (speck(x, y) - 0.5)) * style.grain;
    const rim = clamp(1 - (c.edge - style.gap) / 9);
    const outline = 0.6 + 0.4 * clamp((c.edge - style.gap - 0.6) / 2);
    const lit = shade(tones[c.id], noise + rim * (c.facing * style.bevel - style.bevel * 0.35));
    const face: RGB = [lit[0] * outline, lit[1] * outline, lit[2] * outline];
    return mix(shade(mortar, noise * 0.5), face, c.edge - style.gap + 0.5);
  });
}

interface Slab {
  id: number;
  u: number; // position inside the slab
  v: number;
  w: number;
  h: number;
  edge: number;
  lit: number; // 1 on the top/left rim, -1 on the bottom/right one
}

// Rows of rectangular slabs; each row lists its slab widths and a horizontal shift.
function slabRows(rows: { widths: number[]; shift: number }[]): (x: number, y: number) => Slab {
  const h = S / rows.length;
  return (x, y) => {
    const r = Math.floor(y / h) % rows.length;
    const { widths, shift } = rows[r];
    let u = (((x - shift) % S) + S) % S;
    let i = 0;
    while (u >= widths[i]) u -= widths[i++];
    const w = widths[i];
    const v = y - r * h;
    const lit = Math.min(u, v);
    const dark = Math.min(w - u, h - v);
    return {
      id: r * 16 + i,
      u,
      v,
      w,
      h,
      edge: Math.min(lit, dark),
      lit: lit < dark ? 1 : -1,
    };
  };
}

const even = (rows: number, cols: number, shift: number) =>
  slabRows(
    Array.from({ length: rows }, (_, r) => ({
      widths: Array(cols).fill(S / cols),
      shift: (r * shift) % S,
    }))
  );

function slabs(
  ctx: CanvasRenderingContext2D,
  rand: Rand,
  layout: (x: number, y: number) => Slab,
  paint: (slab: Slab, tone: number, x: number, y: number) => RGB,
  joint: string,
  gap: number,
  bevel: number
) {
  const tones = Array.from({ length: 16 * 16 }, () => rand());
  const warpA = tileNoise(rand, S, 24);
  const warpB = tileNoise(rand, S, 24);
  const line = rgb(joint);
  pixels(ctx, (x, y) => {
    // Slightly wavy joints read as hand drawn.
    const wx = (x + (warpA(x, y) - 0.5) * 2.4 + S) % S;
    const wy = (y + (warpB(x, y) - 0.5) * 2.4 + S) % S;
    const s = layout(wx, wy);
    const rim = clamp(1 - (s.edge - gap) / 5);
    const face = shade(paint(s, tones[s.id], x, y), rim * s.lit * bevel);
    return mix(line, face, s.edge - gap + 0.5);
  });
}

// ---------- Terrain ----------

function earth(
  ctx: CanvasRenderingContext2D,
  rand: Rand,
  stops: string[],
  grain: number,
  relief: number,
  cells = 5
) {
  const base = fbm(rand, cells);
  const bumps = fbm(rand, 14);
  const speck = tileNoise(rand, S, 120);
  const color = ramp(stops);
  pixels(ctx, (x, y) => {
    const light = (bumps(x - 2, y - 2) - bumps(x + 2, y + 2)) * relief;
    // Low contrast in the large patches keeps the repetition hard to spot.
    return shade(color(0.5 + (base(x, y) - 0.5) * 0.55), light + (speck(x, y) - 0.5) * grain);
  });
}

function blades(
  ctx: CanvasRenderingContext2D,
  rand: Rand,
  count: number,
  length: number,
  colors: string[]
) {
  ctx.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    const color = pickFrom(rand, colors);
    const lean = (rand() - 0.5) * length;
    const tall = length * (0.5 + rand() * 0.7);
    wrapped(rand() * S, rand() * S, length * 2, (x, y) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + lean * 0.2, y - tall * 0.6, x + lean, y - tall);
      ctx.stroke();
    });
  }
}

function glowingCracks(
  ctx: CanvasRenderingContext2D,
  rand: Rand,
  rock: string[],
  hot: string,
  warm: string,
  glow: number,
  cols: number
) {
  const cell = voronoi(rand, cols, cols, 0.8, 2.5, 18);
  const color = ramp(rock);
  const base = fbm(rand, 9);
  const speck = tileNoise(rand, S, 100);
  const heat = fbm(rand, 4);
  const core = rgb(hot);
  const halo = rgb(warm);
  pixels(ctx, (x, y) => {
    const c = cell(x, y);
    const rim = clamp(1 - c.edge / 10);
    const stone = shade(color(base(x, y)), (speck(x, y) - 0.5) * 22 + rim * c.facing * 14);
    const strength = clamp(heat(x, y) * 1.5 - 0.15);
    const lit = mix(stone, halo, clamp(1 - c.edge / glow) ** 2 * strength);
    return mix(lit, core, clamp(2.6 - c.edge) * strength);
  });
}

type Painter = (ctx: CanvasRenderingContext2D, rand: Rand) => void;

const TERRAIN: Record<TerrainMaterialId, Painter> = {
  dirt: (ctx, rand) => {
    earth(ctx, rand, ['#5c4a32', '#77613f', '#8b744e', '#9a8260'], 30, 46);
    cracks(ctx, rand, 9, 6, 1.3, 'rgba(50,34,18,0.4)');
    pebbles(ctx, rand, 90, 1, 5.5, ['#8f7f66', '#a29278', '#6f604b']);
    blades(ctx, rand, 45, 5, ['rgba(98,110,55,0.65)', 'rgba(72,86,40,0.6)']);
  },
  grass: (ctx, rand) => {
    earth(ctx, rand, ['#2f4524', '#44602f', '#58743a', '#718846'], 20, 26);
    blades(ctx, rand, 1100, 8, ['#38542a', '#4d6b30', '#64833b']);
    blades(ctx, rand, 420, 7, ['#7f9c49', '#93ac58', '#263b1c']);
    scatter(rand, 16, 4, (x, y) => {
      oval(ctx, x, y, 1.7, 1.7, 0, 'rgba(236,228,170,0.85)');
      oval(ctx, x, y, 0.6, 0.6, 0, '#c99a2e');
    });
  },
  cobblestone: (ctx, rand) =>
    stones(ctx, rand, {
      cols: 7, rows: 7, jitter: 0.5, round: 2.6, warp: 5, gap: 1.5, bevel: 34,
      colors: ['#77736c', '#6b6965', '#857d70', '#615f5c'], mortar: '#34302a', grain: 22,
    }),
  flagstone: (ctx, rand) => {
    stones(ctx, rand, {
      cols: 3, rows: 3, jitter: 0.75, round: 1.4, warp: 12, gap: 2.2, bevel: 22,
      colors: ['#8b857a', '#7b766d', '#938a79'], mortar: '#464a33', grain: 26,
    });
    cracks(ctx, rand, 7, 5, 1.2, 'rgba(45,40,33,0.5)');
    pebbles(ctx, rand, 26, 0.8, 2.6, ['#8a857a', '#6d685e']);
  },
  moss: (ctx, rand) => {
    earth(ctx, rand, ['#233520', '#35502a', '#4a6a33', '#688442'], 26, 60, 6);
    scatter(rand, 520, 6, (x, y) => {
      const r = 0.9 + rand() * 2.6;
      oval(ctx, x + 0.8, y + 1, r, r, 0, 'rgba(14,26,10,0.35)');
      oval(ctx, x, y, r, r, 0, pickFrom(rand, ['#57772f', '#6d8c3c', '#84a24a', '#40602a']));
    });
  },
  sand: (ctx, rand) => {
    const drift = fbm(rand, 4);
    const warp = tileNoise(rand, S, 6);
    const speck = tileNoise(rand, S, 128);
    const color = ramp(['#ae9264', '#c4a876', '#d3bb8a', '#e0cc9f']);
    pixels(ctx, (x, y) => {
      const ripple = Math.sin(((y + x * 0.25) / S) * Math.PI * 2 * 12 + warp(x, y) * 9);
      return shade(color(drift(x, y)), ripple * 8 + (speck(x, y) - 0.5) * 24);
    });
    pebbles(ctx, rand, 34, 0.6, 3, ['#b59b72', '#d8c49c', '#8f7a58']);
  },
  mud: (ctx, rand) => {
    earth(ctx, rand, ['#2d2117', '#45331f', '#574228', '#684f33'], 22, 70);
    scatter(rand, 11, 40, (x, y) => {
      const r = 7 + rand() * 17;
      const turn = rand() * Math.PI;
      oval(ctx, x, y, r * 1.14, r * 0.74, turn, 'rgba(24,16,9,0.45)');
      oval(ctx, x, y, r, r * 0.62, turn, 'rgba(52,40,26,0.85)');
      ctx.strokeStyle = 'rgba(196,184,150,0.35)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 0.66, r * 0.36, turn, 3.4, 4.7);
      ctx.stroke();
    });
    pebbles(ctx, rand, 40, 0.8, 3.4, ['#5f4a30', '#766048']);
  },
  snow: (ctx, rand) => {
    const drift = fbm(rand, 4);
    const speck = tileNoise(rand, S, 128);
    const color = ramp(['#bfd0e0', '#d6e2ec', '#e9f0f6', '#fbfdff']);
    pixels(ctx, (x, y) => {
      const relief = (drift(x - 6, y - 6) - drift(x + 6, y + 6)) * 70;
      return shade(color(drift(x, y) * 0.5 + 0.35), relief + (speck(x, y) - 0.5) * 10);
    });
    scatter(rand, 110, 3, (x, y) => oval(ctx, x, y, 0.9, 0.9, 0, 'rgba(255,255,255,0.95)'));
    scatter(rand, 60, 4, (x, y) => oval(ctx, x, y, 1.8, 1.2, rand() * 3, 'rgba(150,175,200,0.28)'));
  },
  gravel: (ctx, rand) => {
    earth(ctx, rand, ['#3c3f44', '#51555b', '#62666d'], 34, 30);
    pebbles(ctx, rand, 520, 1.6, 4.5, ['#6d7178', '#82878f', '#585c62', '#7a746a']);
    pebbles(ctx, rand, 60, 3, 7.5, ['#8d9299', '#6a6e74', '#837b6e']);
  },
  volcanic: (ctx, rand) => {
    stones(ctx, rand, {
      cols: 5, rows: 5, jitter: 0.85, round: 1.8, warp: 22, gap: 1, bevel: 28,
      colors: ['#34313a', '#2a2830', '#3f3a43'], mortar: '#121015', grain: 34,
    });
    scatter(rand, 190, 4, (x, y) => {
      const r = 0.6 + rand() * 1.8;
      oval(ctx, x, y, r, r * 0.8, 0, 'rgba(10,8,12,0.75)');
      oval(ctx, x + r * 0.4, y + r * 0.6, r * 0.6, r * 0.3, 0, 'rgba(150,140,160,0.22)');
    });
  },
  lava_crust: (ctx, rand) => {
    glowingCracks(ctx, rand, ['#170d0b', '#2b1712', '#422015'], '#ffd152', '#e2490f', 13, 5);
    scatter(rand, 40, 4, (x, y) => oval(ctx, x, y, 0.9, 0.9, 0, 'rgba(255,140,40,0.7)'));
  },
  ice: (ctx, rand) => {
    earth(ctx, rand, ['#5d9dbd', '#7fbbd5', '#a3d3e6', '#cbeaf5'], 8, 22, 4);
    cracks(ctx, rand, 12, 11, 1.8, 'rgba(240,252,255,0.72)');
    cracks(ctx, rand, 14, 6, 0.8, 'rgba(46,104,134,0.4)');
    scatter(rand, 26, 30, (x, y) => {
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 2 + rand() * 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 16 + rand() * 10, y - 16 - rand() * 10);
      ctx.stroke();
    });
  },
  swamp: (ctx, rand) => {
    earth(ctx, rand, ['#17231a', '#2a3a24', '#45502a', '#575c33'], 14, 24, 4);
    scatter(rand, 15, 40, (x, y) => {
      for (let i = 0; i < 34; i++) {
        const a = rand() * Math.PI * 2;
        const d = rand() * rand() * 24;
        const r = 1 + rand() * 2.2;
        const color = pickFrom(rand, ['#6f8a2f', '#86a03a', '#57732a']);
        oval(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, r, r * 0.75, a, color);
      }
    });
    scatter(rand, 16, 14, (x, y) => {
      ctx.strokeStyle = 'rgba(170,196,160,0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(x, y, 4 + rand() * 8, 2 + rand() * 4, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
    blades(ctx, rand, 60, 10, ['#6b7a35', '#3b4a20']);
  },
  desert_cracked: (ctx, rand) => {
    stones(ctx, rand, {
      cols: 5, rows: 5, jitter: 0.85, round: 1.1, warp: 14, gap: 0.8, bevel: 26,
      colors: ['#b98a5c', '#c4976a', '#ac7f53'], mortar: '#5a3c22', grain: 22,
    });
    cracks(ctx, rand, 20, 3, 1, 'rgba(90,60,34,0.45)');
    pebbles(ctx, rand, 24, 0.8, 2.8, ['#a5805a', '#d2ab7e']);
  },
  autumn_leaves: (ctx, rand) => {
    earth(ctx, rand, ['#38261a', '#513622', '#664329'], 28, 36);
    for (let i = 0; i < 270; i++) {
      const r = 4 + rand() * 7;
      const turn = rand() * Math.PI * 2;
      const color = pickFrom(rand, [
        '#c4571f', '#a9331d', '#d98e26', '#8a4a1f', '#b97a2a', '#7c2a17', '#9c6a2c',
      ]);
      wrapped(rand() * S, rand() * S, r * 2, (x, y) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(turn);
        const leaf = (dx: number, dy: number, fill: string) => {
          ctx.fillStyle = fill;
          ctx.beginPath();
          ctx.moveTo(dx - r, dy);
          ctx.quadraticCurveTo(dx - r * 0.2, dy - r * 0.85, dx + r, dy);
          ctx.quadraticCurveTo(dx - r * 0.2, dy + r * 0.85, dx - r, dy);
          ctx.fill();
        };
        leaf(1.4, 1.8, 'rgba(20,10,4,0.35)');
        leaf(0, 0, color);
        ctx.strokeStyle = 'rgba(60,24,8,0.55)';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(-r * 1.25, 0);
        ctx.lineTo(r * 0.8, 0);
        ctx.stroke();
        ctx.restore();
      });
    }
  },
  arcane_ground: (ctx, rand) => {
    glowingCracks(ctx, rand, ['#1d1430', '#33224a', '#4a3163'], '#d9b8ff', '#7b35d6', 10, 4);
    scatter(rand, 70, 6, (x, y) => {
      const color = pickFrom(rand, ['56,189,248', '192,132,252']);
      oval(ctx, x, y, 3.2, 3.2, 0, `rgba(${color},0.2)`);
      oval(ctx, x, y, 1.1, 1.1, 0, `rgba(${color},0.95)`);
    });
  },
};

// ---------- Floors ----------

// Shared wood look: growth rings stretched along the board.
function woodTone(rand: Rand): (along: number, across: number, tone: number) => number {
  const wave = tileNoise(rand, S, 24, 4);
  const fine = tileNoise(rand, S, 128, 10);
  const speck = tileNoise(rand, S, 110);
  return (along, across, tone) => {
    const a = (across + S * 4) % S;
    const b = (along + tone * 977) % S;
    const ring = Math.sin(a * 0.55 + wave(a, b) * 11 + tone * 20);
    return ring * 7 + (fine(a, b) - 0.5) * 34 + (speck(a, b) - 0.5) * 10 + (tone - 0.5) * 26;
  };
}

function planks(ctx: CanvasRenderingContext2D, rand: Rand, color: string) {
  const grain = woodTone(rand);
  const base = rgb(color);
  const joints = Array.from({ length: 8 }, () => ({
    first: 96 + Math.floor(rand() * 64),
    shift: Math.floor(rand() * S),
  }));
  // Columns of boards: the layout is built sideways and read with x and y swapped.
  const rows = slabRows(
    joints.map(({ first, shift }) => ({ widths: [first, S - first], shift }))
  );
  slabs(
    ctx,
    rand,
    (x, y) => rows(y, x),
    (s, tone) => shade(base, grain(s.u, s.v + s.id * 37, tone)),
    '#24150b',
    0.9,
    14
  );
  joints.forEach(({ first, shift }, i) => {
    for (const at of [shift, shift + first]) {
      for (const [along, across] of [[5, 8], [5, 24], [-5, 8], [-5, 24]]) {
        wrapped(i * 32 + across, (at + along + S) % S, 4, (x, y) => {
          oval(ctx, x, y, 1.6, 1.6, 0, '#1c120b');
          oval(ctx, x - 0.4, y - 0.4, 0.6, 0.6, 0, 'rgba(230,200,160,0.5)');
        });
      }
    }
  });
  scatter(rand, 7, 10, (x, y) => {
    oval(ctx, x, y, 2.6, 5, 0, 'rgba(46,24,10,0.6)');
    ctx.strokeStyle = 'rgba(46,24,10,0.3)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(x, y, 4.5, 8.5, 0, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function herringbone(
  ctx: CanvasRenderingContext2D,
  rand: Rand,
  colors: string[],
  joint: string,
  wood: boolean
) {
  const unit = 16;
  const length = 4;
  const grain = woodTone(rand);
  const speck = tileNoise(rand, S, 100);
  const blotch = fbm(rand, 10);
  const palette = colors.map(rgb);
  const tones = Array.from({ length: 512 }, () => rand());
  const layout = (x: number, y: number): Slab => {
    const i = Math.floor(x / unit);
    const j = Math.floor(y / unit);
    const k = (((i - j) % (length * 2)) + length * 2) % (length * 2);
    const flat = k < length;
    const col = flat ? i - k : i;
    const row = flat ? j : j - (length * 2 - 1 - k);
    const px = x - col * unit;
    const py = y - row * unit;
    const w = flat ? unit * length : unit;
    const h = flat ? unit : unit * length;
    const lit = Math.min(px, py);
    const dark = Math.min(w - px, h - py);
    const id = ((((row + 16) % 16) * 16 + ((col + 16) % 16)) * 2 + (flat ? 0 : 1)) % 512;
    return {
      id,
      u: flat ? px : py,
      v: flat ? py : px,
      w,
      h,
      edge: Math.min(lit, dark),
      lit: lit < dark ? 1 : -1,
    };
  };
  const line = rgb(joint);
  pixels(ctx, (x, y) => {
    const s = layout(x, y);
    const tone = tones[s.id];
    const noise = wood
      ? grain(s.u, s.v + s.id * 13, tone)
      : (blotch(x, y) - 0.5) * 34 + (speck(x, y) - 0.5) * 30;
    const face = shade(
      palette[Math.floor(tone * palette.length)],
      noise + clamp(1 - s.edge / 3.5) * s.lit * 16
    );
    return mix(line, face, s.edge - (wood ? 0.3 : 1));
  });
}

// Veined stone; each square gets its own offset so the veins break at the joints.
function marble(rand: Rand): (x: number, y: number, tone: number, base: RGB, vein: RGB) => RGB {
  const swirl = fbm(rand, 4);
  const twist = fbm(rand, 7);
  const speck = tileNoise(rand, S, 96);
  return (x, y, tone, base, vein) => {
    const ox = (x + tone * 613) % S;
    const oy = (y + tone * 377) % S;
    const wave = Math.abs(Math.sin(((ox + oy) / S) * Math.PI * 4 + swirl(ox, oy) * 11));
    const strong = clamp(1 - wave * 5.5);
    const thin = clamp(1 - Math.abs(twist(ox, oy) - 0.5) * 16);
    const cloud = (swirl(oy, ox) - 0.5) * 22 + (speck(x, y) - 0.5) * 8;
    return mix(shade(base, cloud), vein, strong * 0.8 + thin * 0.35);
  };
}

function checker(
  ctx: CanvasRenderingContext2D,
  rand: Rand,
  light: [string, string],
  dark: [string, string],
  joint: string
) {
  const paint = marble(rand);
  slabs(
    ctx,
    rand,
    even(4, 4, 0),
    (s, tone, x, y) => {
      const [base, vein] = (Math.floor(s.id / 16) + (s.id % 16)) % 2 === 0 ? light : dark;
      return paint(x, y, tone, rgb(base), rgb(vein));
    },
    joint,
    0.8,
    20
  );
}

function carpet(ctx: CanvasRenderingContext2D, rand: Rand, main: string, deep: string) {
  const wear = fbm(rand, 5);
  const weave = tileNoise(rand, S, 128);
  const a = rgb(main);
  const b = rgb(deep);
  pixels(ctx, (x, y) => {
    const thread = ((x % 3 === 0 ? -7 : 0) + (y % 3 === 0 ? -7 : 0)) + (weave(x, y) - 0.5) * 30;
    return shade(mix(b, a, wear(x, y) * 1.2), thread);
  });
  const gold = 'rgba(214,176,98,0.85)';
  const soft = 'rgba(214,176,98,0.4)';
  const diamond = (x: number, y: number, r: number, color: string, width: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r, y);
    ctx.closePath();
    ctx.stroke();
  };
  for (let gx = 0; gx <= S; gx += 128) {
    for (let gy = 0; gy <= S; gy += 128) {
      diamond(gx, gy, 62, soft, 1.5);
      diamond(gx, gy, 54, gold, 2.5);
      diamond(gx + 64, gy + 64, 24, gold, 2);
      diamond(gx + 64, gy + 64, 15, soft, 1.5);
      for (let k = 0; k < 8; k++) {
        const t = (k / 8) * Math.PI * 2;
        const x = gx + Math.cos(t) * 20;
        const y = gy + Math.sin(t) * 20;
        oval(ctx, x, y, 9, 3.6, t, soft);
        oval(ctx, gx + 64 + Math.cos(t) * 7, gy + 64 + Math.sin(t) * 7, 3.5, 1.6, t, gold);
      }
      oval(ctx, gx, gy, 7, 7, 0, gold);
      oval(ctx, gx, gy, 3, 3, 0, deep);
    }
  }
}

const FLOORS: Record<FloorPatternId, Painter> = {
  wood_planks: (ctx, rand) => planks(ctx, rand, '#8b603d'),
  dark_wood: (ctx, rand) => planks(ctx, rand, '#573a27'),
  herringbone: (ctx, rand) =>
    herringbone(ctx, rand, ['#b38a56', '#a87d4c', '#bd9763', '#9f7646'], '#4a3018', true),
  brick_herringbone: (ctx, rand) => {
    herringbone(ctx, rand, ['#95503c', '#864332', '#a35c43', '#7a4034'], '#b09a82', false);
    scatter(rand, 120, 3, (x, y) => oval(ctx, x, y, 1.1, 0.9, 0, 'rgba(50,20,12,0.45)'));
  },
  temple_teal: (ctx, rand) => {
    const glaze = fbm(rand, 9);
    const speck = tileNoise(rand, S, 96);
    slabs(
      ctx,
      rand,
      even(4, 4, 0),
      (s, tone, x, y) => {
        const du = Math.abs(s.u - 32);
        const dv = Math.abs(s.v - 32);
        const noise = (glaze(x, y) - 0.5) * 30 + (speck(x, y) - 0.5) * 14 + (tone - 0.5) * 12;
        const stone = rgb('#b7a882');
        const teal = rgb('#33716a');
        const border = Math.max(du, dv); // cream frame around a glazed teal field
        const corner = Math.hypot(32 - du, 32 - dv);
        let color = border > 26 || corner < 13 ? stone : teal;
        if (color === teal && (Math.abs(border - 23) < 1.1 || Math.abs(du + dv - 15) < 1.6)) {
          color = rgb('#cfa85c');
        }
        if (du + dv < 10) color = rgb('#d9cfae');
        if (du + dv < 3.5) color = teal;
        return shade(color, noise);
      },
      '#2a3a33',
      0.8,
      18
    );
  },
  slate_tile: (ctx, rand) => {
    const paint = fbm(rand, 7);
    const speck = tileNoise(rand, S, 100);
    const layers = tileNoise(rand, S, 12, 48);
    slabs(
      ctx,
      rand,
      even(4, 2, 61),
      (_s, tone, x, y) =>
        shade(
          mix(rgb('#454e59'), rgb('#5b6471'), tone),
          (paint(x, y) - 0.5) * 34 + (layers(x, y) - 0.5) * 18 + (speck(x, y) - 0.5) * 18
        ),
      '#1b1f25',
      1.6,
      26
    );
    cracks(ctx, rand, 5, 4, 1, 'rgba(18,22,28,0.5)');
  },
  dungeon_cracked: (ctx, rand) => {
    const paint = fbm(rand, 7);
    const speck = tileNoise(rand, S, 100);
    const grime = fbm(rand, 3);
    slabs(
      ctx,
      rand,
      slabRows([
        { widths: [96, 64, 96], shift: 0 },
        { widths: [64, 112, 80], shift: 40 },
        { widths: [128, 128], shift: 90 },
        { widths: [80, 96, 80], shift: 20 },
      ]),
      (_s, tone, x, y) => {
        const stone = shade(
          mix(rgb('#43464c'), rgb('#5a5c60'), tone),
          (paint(x, y) - 0.5) * 38 + (speck(x, y) - 0.5) * 26
        );
        return mix(stone, rgb('#333a27'), clamp(grime(x, y) * 2.4 - 1.35));
      },
      '#16171a',
      2,
      28
    );
    cracks(ctx, rand, 16, 7, 2.2, 'rgba(14,15,18,0.85)');
    pebbles(ctx, rand, 30, 0.8, 3.2, ['#5c5e62', '#494b50']);
  },
  rough_cobble: (ctx, rand) =>
    stones(ctx, rand, {
      cols: 5, rows: 5, jitter: 0.7, round: 3.5, warp: 9, gap: 1.8, bevel: 38,
      colors: ['#80786c', '#706c66', '#8a7e6c', '#68645f', '#7a7064'],
      mortar: '#342d25', grain: 22,
    }),
  marble_check: (ctx, rand) =>
    checker(ctx, rand, ['#d8d2c4', '#8e8778'], ['#8e9c96', '#e2e8e2'], '#57564f'),
  checkered_black_white: (ctx, rand) =>
    checker(ctx, rand, ['#e8e6e0', '#98958e'], ['#2c2e35', '#8b8f99'], '#16171b'),
  marble_white_gold: (ctx, rand) => {
    const paint = marble(rand);
    slabs(
      ctx,
      rand,
      even(2, 2, 0),
      (s, tone, x, y) => {
        const frame = Math.min(s.u, s.v, s.w - s.u, s.h - s.v);
        const stone = paint(x, y, tone, rgb('#eae5da'), rgb('#a49d92'));
        const dots = Math.abs(s.u - 64) + Math.abs(s.v - 64) < 9;
        if (!dots && (frame < 7 || frame > 10)) return stone;
        return shade(rgb('#c29a44'), Math.sin((x + y) * 0.16) * 24);
      },
      '#8a7a55',
      0.7,
      16
    );
  },
  bamboo_tatami: (ctx, rand) => {
    const fibre = tileNoise(rand, S, 128, 16);
    const wear = fbm(rand, 6);
    pixels(ctx, (x, y) => {
      const horizontal = (Math.floor(x / 128) + Math.floor(y / 128)) % 2 === 0;
      const along = horizontal ? x : y;
      const across = horizontal ? y : x;
      const edge = across % 64; // two mats per square, each with a cloth border
      if (edge < 6 || edge > 61) {
        const stitch = along % 8 < 4 && (edge === 3 || edge === 63) ? 40 : 0;
        return shade(rgb('#34472c'), stitch + (wear(x, y) - 0.5) * 24);
      }
      const reed = Math.abs((across % 4) - 2) * 9 - 9;
      const tie = along % 21 < 1.5 ? -14 : 0;
      const base = mix(rgb('#9d9258'), rgb('#bcb176'), wear(x, y));
      return shade(base, reed + tie + (fibre(across, along) - 0.5) * 28);
    });
  },
  obsidian_hex: (ctx, rand) => {
    stones(ctx, rand, {
      cols: 6, rows: 6, jitter: 0, round: 0.7, warp: 0, gap: 1.2, bevel: 30,
      colors: ['#2a2638', '#221f2d', '#322c43'], mortar: '#6a4aa8', grain: 12,
    });
    scatter(rand, 34, 24, (x, y) => {
      ctx.strokeStyle = 'rgba(190,170,255,0.2)';
      ctx.lineWidth = 1 + rand() * 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 8 + rand() * 12, y - 6 - rand() * 10);
      ctx.stroke();
    });
  },
  sandstone_tile: (ctx, rand) => {
    const paint = fbm(rand, 7);
    const speck = tileNoise(rand, S, 110);
    const strata = tileNoise(rand, S, 6, 40);
    slabs(
      ctx,
      rand,
      even(4, 2, 53),
      (_s, tone, x, y) =>
        shade(
          mix(rgb('#b08c58'), rgb('#cbaa76'), tone),
          (paint(x, y) - 0.5) * 30 + (strata(x, y) - 0.5) * 26 + (speck(x, y) - 0.5) * 24
        ),
      '#6c5130',
      1.8,
      28
    );
    cracks(ctx, rand, 5, 4, 1, 'rgba(100,72,38,0.5)');
    scatter(rand, 90, 3, (x, y) => oval(ctx, x, y, 1, 0.8, 0, 'rgba(110,80,44,0.4)'));
  },
  copper_plate: (ctx, rand) => {
    const brush = tileNoise(rand, S, 6, 128);
    const stain = fbm(rand, 6);
    slabs(
      ctx,
      rand,
      even(4, 4, 0),
      (s, tone, x, y) => {
        const bump = Math.min(s.u, s.v, 64 - s.u, 64 - s.v);
        const raised = Math.abs(bump - 9) < 2 ? (Math.min(s.u, s.v) < 32 ? 34 : -30) : 0;
        const metal = shade(
          mix(rgb('#7c5334'), rgb('#9a6c42'), tone),
          (brush(x, y) - 0.5) * 34 + Math.sin(((s.u + s.v) / 128) * Math.PI) * 24 - 14 + raised
        );
        return mix(metal, rgb('#4f8272'), clamp(stain(x, y) * 2.6 - 1.6));
      },
      '#241811',
      1.4,
      34
    );
    for (let x = 0; x < S; x += 64) {
      for (let y = 0; y < S; y += 64) {
        for (const [dx, dy] of [[15, 15], [49, 15], [15, 49], [49, 49]]) {
          oval(ctx, x + dx + 1, y + dy + 1.5, 3.4, 3.4, 0, 'rgba(20,10,4,0.55)');
          oval(ctx, x + dx, y + dy, 3, 3, 0, '#c18c55');
          oval(ctx, x + dx - 1, y + dy - 1, 1.1, 1.1, 0, '#f3d3a0');
        }
      }
    }
  },
  castle_flagstone: (ctx, rand) => {
    const paint = fbm(rand, 8);
    const speck = tileNoise(rand, S, 100);
    slabs(
      ctx,
      rand,
      slabRows([
        { widths: [96, 80, 80], shift: 0 },
        { widths: [72, 104, 80], shift: 44 },
        { widths: [112, 72, 72], shift: 14 },
        { widths: [80, 80, 96], shift: 62 },
      ]),
      (_s, tone, x, y) =>
        shade(
          mix(rgb('#5f646d'), rgb('#7d7f83'), tone),
          (paint(x, y) - 0.5) * 36 + (speck(x, y) - 0.5) * 28
        ),
      '#2c2e34',
      2,
      32
    );
    cracks(ctx, rand, 6, 4, 1.1, 'rgba(28,30,36,0.6)');
    scatter(rand, 70, 3, (x, y) => oval(ctx, x, y, 1.2, 1, 0, 'rgba(30,32,38,0.4)'));
  },
  carpet_crimson: (ctx, rand) => carpet(ctx, rand, '#8a2c31', '#5c1a20'),
  carpet_royal_blue: (ctx, rand) => carpet(ctx, rand, '#2c4d86', '#182b50'),
};

export function paintSurface(
  ctx: CanvasRenderingContext2D,
  kind: 'terrain' | 'floor',
  id: string,
  rand: Rand
) {
  const painter =
    kind === 'terrain'
      ? (TERRAIN[id as TerrainMaterialId] ?? TERRAIN.dirt)
      : (FLOORS[id as FloorPatternId] ?? FLOORS.wood_planks);
  painter(ctx, rand);
}
