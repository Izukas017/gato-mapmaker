import type { Point, PortalItem, WallStyleId } from '../types/map';
import { CYBER_WALL_LOOKS, drawCyberPortal } from './cyber/structures';

// Walls, doors and windows seen from above, built piece by piece along their length.

type Rand = () => number;

function seeded(seed: number): Rand {
  let state = (Math.abs(Math.floor(seed)) % 2147483646) + 1;
  state = (state * 48271) % 2147483647;
  return () => (state = (state * 48271) % 2147483647) / 2147483647;
}

const TAU = Math.PI * 2;

function box(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  radius = 0,
  stroke?: string,
  line = 1
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, Math.max(0, Math.min(radius, w / 2, h / 2)));
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = line;
    ctx.stroke();
  }
}

function disc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  fill: string,
  turn = 0
) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), turn, 0, TAU);
  ctx.fillStyle = fill;
  ctx.fill();
}

const LIGHT = 'rgba(255, 246, 226, 0.22)';
const DARK = 'rgba(10, 6, 2, 0.3)';

// A dressed block with a lit top edge and a shaded bottom one.
function block(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  radius: number
) {
  box(ctx, x, y, w, h, color, radius);
  box(ctx, x + 1, y + 1, Math.max(0, w - 2), h * 0.18, LIGHT, radius);
  box(ctx, x + 1, y + h * 0.78, Math.max(0, w - 2), h * 0.19, DARK, radius);
}

export interface WallLook {
  outline: string;
  mortar: string;
  tones: string[];
  piece: [number, number]; // min and max piece length, in wall thicknesses
  // Paints one stretch from x to x+len, with the wall running from -w/2 to w/2.
  draw: (ctx: CanvasRenderingContext2D, x: number, len: number, w: number, rand: Rand, look: WallLook) => void;
  corner?: (ctx: CanvasRenderingContext2D, w: number, rand: Rand, look: WallLook) => void;
}

const tone = (look: WallLook, rand: Rand) => look.tones[Math.floor(rand() * look.tones.length)];

const speckle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  len: number,
  w: number,
  rand: Rand,
  color: string,
  count: number
) => {
  for (let i = 0; i < count; i++) {
    disc(ctx, x + rand() * len, (rand() - 0.5) * w * 0.7, w * 0.025, w * 0.02, color);
  }
};

const ashlar: WallLook['draw'] = (ctx, x, len, w, rand, look) => {
  const gap = w * 0.05;
  block(ctx, x + gap, -w * 0.43, len - gap * 2, w * 0.86, tone(look, rand), w * 0.1);
  speckle(ctx, x + gap, len - gap * 2, w, rand, 'rgba(0,0,0,0.22)', 5);
  speckle(ctx, x + gap, len - gap * 2, w, rand, 'rgba(255,255,255,0.18)', 3);
};

const WALLS: Record<WallStyleId, WallLook> = {
  stone_hewn: {
    outline: '#1f1c18', mortar: '#4a443b', piece: [0.9, 1.7],
    tones: ['#8d867a', '#7f786d', '#9a9283', '#756f65'],
    draw: ashlar,
  },
  sandstone_wall: {
    outline: '#3d2b16', mortar: '#7a5f3c', piece: [0.9, 1.8],
    tones: ['#cda970', '#bd9760', '#d8b87f', '#b38c57'],
    draw: (ctx, x, len, w, rand, look) => {
      ashlar(ctx, x, len, w, rand, look);
      ctx.strokeStyle = 'rgba(110,76,38,0.45)';
      ctx.lineWidth = w * 0.035;
      for (const y of [-0.16, 0.12]) {
        ctx.beginPath();
        ctx.moveTo(x + w * 0.1, w * y);
        ctx.lineTo(x + len - w * 0.1, w * (y + (rand() - 0.5) * 0.12));
        ctx.stroke();
      }
    },
  },
  marble_white: {
    outline: '#5b574f', mortar: '#a8a195', piece: [1.6, 2.6],
    tones: ['#ece8de', '#e2ddd2', '#f4f1ea'],
    draw: (ctx, x, len, w, rand, look) => {
      block(ctx, x + w * 0.03, -w * 0.43, len - w * 0.06, w * 0.86, tone(look, rand), w * 0.06);
      ctx.strokeStyle = 'rgba(110,108,112,0.5)';
      ctx.lineWidth = w * 0.025;
      for (let i = 0; i < 2; i++) {
        const from = x + rand() * len * 0.7;
        ctx.beginPath();
        ctx.moveTo(from, -w * 0.4);
        ctx.bezierCurveTo(from + w * 0.4, -w * 0.1, from, w * 0.1, from + w * (0.3 + rand() * 0.5), w * 0.4);
        ctx.stroke();
      }
    },
  },
  temple_gold: {
    outline: '#3a2608', mortar: '#6e4f18', piece: [1.1, 1.4],
    tones: ['#c9a244', '#b98f35', '#d6b256'],
    draw: (ctx, x, len, w, rand, look) => {
      block(ctx, x + w * 0.04, -w * 0.43, len - w * 0.08, w * 0.86, tone(look, rand), w * 0.08);
      box(ctx, x + w * 0.18, -w * 0.25, len - w * 0.36, w * 0.5, 'rgba(255,226,140,0.18)', w * 0.05, '#7a5614', w * 0.04);
      const mid = x + len / 2;
      ctx.beginPath();
      ctx.moveTo(mid, -w * 0.2);
      ctx.lineTo(mid + w * 0.2, 0);
      ctx.lineTo(mid, w * 0.2);
      ctx.lineTo(mid - w * 0.2, 0);
      ctx.closePath();
      ctx.fillStyle = '#2f8f86';
      ctx.fill();
      disc(ctx, mid - w * 0.05, -w * 0.05, w * 0.045, w * 0.045, '#bff3ec');
    },
  },
  obsidian_black: {
    outline: '#08060d', mortar: '#4b2f74', piece: [0.8, 1.6],
    tones: ['#221d2e', '#2b2438', '#191522'],
    draw: (ctx, x, len, w, rand, look) => {
      const slant = w * (0.15 + rand() * 0.2);
      ctx.beginPath();
      ctx.moveTo(x + w * 0.05, -w * 0.43);
      ctx.lineTo(x + len + slant - w * 0.1, -w * 0.43);
      ctx.lineTo(x + len - slant, w * 0.43);
      ctx.lineTo(x - slant * 0.4 + w * 0.12, w * 0.43);
      ctx.closePath();
      ctx.fillStyle = tone(look, rand);
      ctx.fill();
      ctx.strokeStyle = 'rgba(190,160,255,0.55)';
      ctx.lineWidth = w * 0.05;
      ctx.beginPath();
      ctx.moveTo(x + len * 0.2, -w * 0.27);
      ctx.lineTo(x + len * (0.4 + rand() * 0.35), -w * 0.33);
      ctx.stroke();
      speckle(ctx, x, len, w, rand, 'rgba(180,140,255,0.5)', 2);
    },
  },
  rough_masonry: {
    outline: '#1c1915', mortar: '#3b352b', piece: [0.45, 0.8],
    tones: ['#7d766a', '#6a655c', '#8b8274', '#5f5a50'],
    draw: (ctx, x, len, w, rand, look) => {
      const split = (rand() - 0.5) * 0.3;
      for (const [from, to] of [[-0.46, split], [split, 0.46]]) {
        const cx = x + len / 2 + (rand() - 0.5) * len * 0.3;
        const cy = (w * (from + to)) / 2;
        const rx = len * (0.46 + rand() * 0.12);
        const ry = (w * (to - from)) / 2 - w * 0.02;
        disc(ctx, cx, cy, rx, ry, tone(look, rand), (rand() - 0.5) * 0.5);
        disc(ctx, cx - rx * 0.2, cy - ry * 0.35, rx * 0.45, ry * 0.3, LIGHT);
      }
    },
  },
  brick_aged: {
    outline: '#2a120c', mortar: '#b7a48c', piece: [0.85, 0.85],
    tones: ['#9a4d38', '#87402f', '#a85c42', '#74382b', '#9c5a45'],
    draw: (ctx, x, len, w, rand, look) => {
      const gap = w * 0.06;
      block(ctx, x + gap / 2, -w * 0.43, len - gap, w * 0.4, tone(look, rand), w * 0.04);
      block(ctx, x - len / 2 + gap / 2, w * 0.03, len - gap, w * 0.4, tone(look, rand), w * 0.04);
      block(ctx, x + len / 2 + gap / 2, w * 0.03, len - gap, w * 0.4, tone(look, rand), w * 0.04);
      speckle(ctx, x, len, w, rand, 'rgba(40,14,8,0.35)', 3);
    },
  },
  timber_frame: {
    outline: '#1d1007', mortar: '#d8c9a8', piece: [2.4, 2.4],
    tones: ['#7a512d', '#6b4425', '#865b34'],
    draw: (ctx, x, len, w, rand, look) => {
      block(ctx, x, -w * 0.27, len, w * 0.54, tone(look, rand), w * 0.05);
      ctx.strokeStyle = 'rgba(40,20,8,0.55)';
      ctx.lineWidth = w * 0.03;
      for (const y of [-0.12, 0.03, 0.16]) {
        ctx.beginPath();
        ctx.moveTo(x, w * y);
        ctx.bezierCurveTo(x + len * 0.3, w * (y + 0.07), x + len * 0.6, w * (y - 0.07), x + len, w * y);
        ctx.stroke();
      }
      // Upright post with wooden pegs
      block(ctx, x - w * 0.28, -w * 0.48, w * 0.56, w * 0.96, '#4f3018', w * 0.08);
      for (const y of [-0.22, 0.22]) disc(ctx, x, w * y, w * 0.07, w * 0.07, '#caa66f');
    },
  },
  cave_rock: {
    outline: '#15110d', mortar: '#2e2720', piece: [0.4, 0.75],
    tones: ['#5e5347', '#4a4239', '#6b6053', '#3f382f'],
    draw: (ctx, x, len, w, rand, look) => {
      for (let i = 0; i < 2; i++) {
        const cx = x + rand() * len;
        const cy = (rand() - 0.5) * w * 0.55;
        const r = w * (0.28 + rand() * 0.26);
        ctx.beginPath();
        for (let k = 0; k < 7; k++) {
          const a = (k / 7) * TAU;
          const d = r * (0.7 + rand() * 0.5);
          if (k === 0) ctx.moveTo(cx + Math.cos(a) * d, cy + Math.sin(a) * d);
          else ctx.lineTo(cx + Math.cos(a) * d, cy + Math.sin(a) * d);
        }
        ctx.closePath();
        ctx.fillStyle = tone(look, rand);
        ctx.fill();
        ctx.strokeStyle = look.outline;
        ctx.lineWidth = w * 0.05;
        ctx.stroke();
        disc(ctx, cx - r * 0.2, cy - r * 0.3, r * 0.4, r * 0.22, 'rgba(255,240,215,0.16)');
      }
    },
  },
  iron_fortress: {
    outline: '#0d1015', mortar: '#1d222a', piece: [1.3, 1.3],
    tones: ['#515b69', '#475060', '#5b6573'],
    draw: (ctx, x, len, w, rand, look) => {
      block(ctx, x + w * 0.03, -w * 0.43, len - w * 0.06, w * 0.86, tone(look, rand), w * 0.07);
      box(ctx, x + w * 0.2, -w * 0.06, len - w * 0.4, w * 0.12, '#2c333e', w * 0.05);
      for (const dx of [0.17, -0.17]) {
        for (const dy of [-0.25, 0.25]) {
          const px = dx > 0 ? x + w * dx : x + len + w * dx;
          disc(ctx, px + w * 0.02, w * dy + w * 0.025, w * 0.08, w * 0.08, '#151a21');
          disc(ctx, px, w * dy, w * 0.065, w * 0.065, '#9aa6b5');
        }
      }
      speckle(ctx, x, len, w, rand, 'rgba(160,90,40,0.55)', 4);
    },
  },
  hedge_wall: {
    outline: '#10240f', mortar: '#1f401f', piece: [0.35, 0.5],
    tones: ['#356b32', '#44813c', '#2a5628', '#579447'],
    draw: (ctx, x, len, w, rand, look) => {
      for (let i = 0; i < 16; i++) {
        const cx = x + rand() * len;
        const cy = (rand() - 0.5) * w * 0.9;
        const turn = rand() * Math.PI;
        disc(ctx, cx + w * 0.03, cy + w * 0.04, w * 0.15, w * 0.09, 'rgba(6,20,6,0.45)', turn);
        disc(ctx, cx, cy, w * 0.15, w * 0.09, tone(look, rand), turn);
      }
      if (rand() > 0.65) disc(ctx, x + rand() * len, (rand() - 0.5) * w * 0.6, w * 0.07, w * 0.07, '#f0d9e0');
    },
  },
  palisade_wood: {
    outline: '#1c0f05', mortar: '#3a2512', piece: [0.8, 0.9],
    tones: ['#7a512d', '#6d4626', '#8a5e36'],
    draw: (ctx, x, len, w, rand, look) => {
      const cx = x + len / 2;
      const r = Math.min(len, w) * 0.5;
      disc(ctx, cx, 0, r, r, '#3b2411');
      disc(ctx, cx, 0, r * 0.84, r * 0.84, tone(look, rand));
      disc(ctx, cx - r * 0.06, -r * 0.08, r * 0.62, r * 0.62, '#b98d5b');
      ctx.strokeStyle = 'rgba(90,56,28,0.75)';
      ctx.lineWidth = r * 0.07;
      for (const f of [0.42, 0.22]) {
        ctx.beginPath();
        ctx.arc(cx - r * 0.06, -r * 0.08, r * f, 0, TAU);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.06, -r * 0.08);
      ctx.lineTo(cx + (rand() - 0.5) * r, r * 0.45);
      ctx.stroke();
    },
  },
};

export function drawWallStroke(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  closed: boolean,
  style: WallStyleId,
  thicknessTiles: number,
  ppg: number,
  drawShadow: boolean
) {
  if (points.length < 2) return;
  const look = WALLS[style] ?? CYBER_WALL_LOOKS[style] ?? WALLS.stone_hewn;
  const w = Math.max(4, thicknessTiles * ppg);
  const path = () => {
    ctx.beginPath();
    points.forEach((p, i) =>
      i === 0 ? ctx.moveTo(p.x * ppg, p.y * ppg) : ctx.lineTo(p.x * ppg, p.y * ppg)
    );
    if (closed) ctx.closePath();
  };

  ctx.save();
  ctx.lineJoin = 'miter';
  ctx.lineCap = 'square';
  ctx.miterLimit = 6;

  path();
  ctx.save();
  if (drawShadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.58)';
    ctx.shadowBlur = Math.max(8, w * 0.9);
    ctx.shadowOffsetX = w * 0.35;
    ctx.shadowOffsetY = w * 0.45;
  }
  ctx.strokeStyle = look.outline;
  ctx.lineWidth = w + 3;
  ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = look.mortar;
  ctx.lineWidth = w;
  ctx.stroke();

  const count = closed ? points.length : points.length - 1;
  for (let i = 0; i < count; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const length = Math.hypot(b.x - a.x, b.y - a.y) * ppg;
    if (length < 1) continue;
    // Seeded by the position in tiles, so the pieces stay put at every zoom level.
    const rand = seeded(a.x * 7919 + a.y * 104729 + b.x * 1299 + b.y * 15485);
    ctx.save();
    ctx.translate(a.x * ppg, a.y * ppg);
    ctx.rotate(Math.atan2(b.y - a.y, b.x - a.x));
    ctx.beginPath();
    ctx.rect(-w * 0.5, -w * 0.5, length + w, w);
    ctx.clip();
    const [min, max] = look.piece;
    const pieces: number[] = [];
    let total = 0;
    while (total < length / w && pieces.length < 600) {
      pieces.push(min + rand() * (max - min));
      total += pieces[pieces.length - 1];
    }
    // Stretch the pieces so the stretch ends on a whole one.
    const unit = length / Math.max(total, 0.001);
    let x = 0;
    for (const piece of pieces) {
      look.draw(ctx, x, piece * unit, w, rand, look);
      x += piece * unit;
    }
    ctx.restore();
  }

  // Corner and end stones hide the joins between stretches.
  points.forEach((p, i) => {
    const next = points[(i + 1) % points.length];
    const other = i === points.length - 1 && !closed ? points[i - 1] : next;
    ctx.save();
    ctx.translate(p.x * ppg, p.y * ppg);
    ctx.rotate(Math.atan2(other.y - p.y, other.x - p.x));
    const rand = seeded(p.x * 3571 + p.y * 27644);
    if (look.corner) {
      look.corner(ctx, w, rand, look);
    } else if (style === 'hedge_wall' || style === 'cave_rock' || style === 'palisade_wood') {
      ctx.beginPath();
      ctx.arc(0, 0, w * 0.55, 0, TAU);
      ctx.clip();
      look.draw(ctx, -w * 0.45, w * 0.9, w, rand, look);
    } else {
      box(ctx, -w * 0.55, -w * 0.55, w * 1.1, w * 1.1, look.outline, w * 0.16);
      block(ctx, -w * 0.46, -w * 0.46, w * 0.92, w * 0.92, tone(look, rand), w * 0.12);
      if (style === 'temple_gold') disc(ctx, 0, 0, w * 0.17, w * 0.17, '#f2d578');
      if (style === 'iron_fortress') disc(ctx, 0, 0, w * 0.15, w * 0.15, '#9aa6b5');
    }
    ctx.restore();
  });
  ctx.restore();
}

// ---------- Doors and windows ----------

interface DoorLook {
  base: string;
  dark: string;
  metal: string;
}

const DOORS: Partial<Record<PortalItem['kind'], DoorLook>> = {
  door_wood: { base: '#8a5a30', dark: '#2b180a', metal: '#3f3a35' },
  door_double: { base: '#7c4c28', dark: '#241306', metal: '#c79a45' },
  door_iron: { base: '#566070', dark: '#14181e', metal: '#a5b2c2' },
  door_ornate_gold: { base: '#c49b3c', dark: '#4a3208', metal: '#fbe9a4' },
  door_secret: { base: '#837c70', dark: '#2a2620', metal: '#6a645a' },
};

// One door leaf from x = 0 to len, centred on y = 0.
function leaf(
  ctx: CanvasRenderingContext2D,
  kind: PortalItem['kind'],
  len: number,
  t: number
) {
  const look = DOORS[kind] ?? DOORS.door_wood!;
  const line = Math.max(1, t * 0.09);
  box(ctx, 0, -t / 2, len, t, look.base, t * 0.14, look.dark, line);
  box(ctx, line, -t / 2 + line, len - line * 2, t * 0.16, LIGHT, t * 0.08);
  box(ctx, line, t * 0.24, len - line * 2, t * 0.18, DARK, t * 0.08);

  if (kind === 'door_wood' || kind === 'door_double') {
    ctx.strokeStyle = look.dark;
    ctx.lineWidth = line * 0.6;
    ctx.beginPath();
    for (const y of [-0.16, 0.17]) {
      ctx.moveTo(line, t * y);
      ctx.lineTo(len - line, t * y);
    }
    ctx.stroke();
    // Iron straps with studs
    for (const f of [0.16, 0.74]) {
      box(ctx, len * f, -t / 2, len * 0.1, t, look.metal, 1, look.dark, line * 0.5);
      for (const y of [-0.27, 0.27]) disc(ctx, len * (f + 0.05), t * y, t * 0.07, t * 0.07, '#d9d2c4');
    }
  } else if (kind === 'door_iron') {
    ctx.strokeStyle = look.dark;
    ctx.lineWidth = line * 0.7;
    ctx.beginPath();
    for (let f = 0.25; f < 0.9; f += 0.25) {
      ctx.moveTo(len * f, -t / 2);
      ctx.lineTo(len * f, t / 2);
    }
    ctx.stroke();
    for (let f = 0.06; f < 1; f += 0.125) {
      for (const y of [-0.28, 0.28]) disc(ctx, len * f, t * y, t * 0.075, t * 0.075, look.metal);
    }
  } else if (kind === 'door_ornate_gold') {
    for (const f of [0.07, 0.55]) {
      box(ctx, len * f, -t * 0.28, len * 0.38, t * 0.56, 'rgba(120,80,10,0.4)', t * 0.12, look.metal, line * 0.7);
      disc(ctx, len * (f + 0.19), 0, t * 0.16, t * 0.16, '#b02f3a');
      disc(ctx, len * (f + 0.19) - t * 0.05, -t * 0.05, t * 0.05, t * 0.05, '#ffd0d4');
    }
  } else if (kind === 'door_secret') {
    // Looks like masonry, with only a hairline to give it away.
    for (let i = 0; i < 4; i++) {
      block(ctx, (len / 4) * i + 1, -t * 0.42, len / 4 - 2, t * 0.84, i % 2 ? '#8d867a' : '#797267', t * 0.1);
    }
    ctx.strokeStyle = 'rgba(255,214,120,0.75)';
    ctx.setLineDash([t * 0.18, t * 0.22]);
    ctx.lineWidth = line * 0.6;
    ctx.beginPath();
    ctx.moveTo(0, t / 2);
    ctx.lineTo(len, t / 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function handle(ctx: CanvasRenderingContext2D, x: number, t: number) {
  disc(ctx, x + t * 0.04, t * 0.5, t * 0.17, t * 0.15, 'rgba(0,0,0,0.45)');
  disc(ctx, x, t * 0.46, t * 0.15, t * 0.13, '#d9ac45');
  disc(ctx, x - t * 0.04, t * 0.42, t * 0.05, t * 0.04, '#fff0bd');
}

export function drawPortals(
  ctx: CanvasRenderingContext2D,
  portals: PortalItem[],
  ppg: number
) {
  for (const p of portals) {
    ctx.save();
    ctx.translate(p.x * ppg, p.y * ppg);
    ctx.rotate(p.angle);

    const w = p.width * ppg;
    const h = Math.max(10, ppg * 0.28);
    if (p.kind.startsWith('cy_')) {
      drawCyberPortal(ctx, p, w, h);
      ctx.restore();
      continue;
    }
    const line = Math.max(1, h * 0.08);
    const jamb = Math.max(5, h * 0.42);
    const jambs = () => {
      for (const x of [-w / 2 - jamb * 0.45, w / 2 - jamb * 0.55]) {
        box(ctx, x, -h * 0.72, jamb, h * 1.44, '#2a251f', jamb * 0.18);
        block(ctx, x + line, -h * 0.72 + line, jamb - line * 2, h * 1.44 - line * 2, '#8f877a', jamb * 0.14);
      }
    };

    // Worn threshold under the opening
    box(ctx, -w / 2, -h * 0.58, w, h * 1.16, '#4a4137', 0);
    for (let i = 0; i < 4; i++) {
      box(ctx, -w / 2 + (w / 4) * i + 1, -h * 0.5, w / 4 - 2, h, i % 2 ? '#675d50' : '#5d5448', 2);
    }

    if (p.kind === 'archway') {
      box(ctx, -w * 0.5, -h * 0.5, w, h * 0.18, 'rgba(0,0,0,0.28)', 0);
      jambs();
      ctx.strokeStyle = 'rgba(214,204,184,0.55)';
      ctx.lineWidth = line;
      ctx.setLineDash([h * 0.3, h * 0.22]);
      ctx.beginPath();
      ctx.moveTo(-w / 2 + jamb, 0);
      ctx.lineTo(w / 2 - jamb, 0);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (p.kind === 'portcullis') {
      box(ctx, -w / 2, -h * 0.2, w, h * 0.4, '#3a414c', 2, '#12161c', line);
      const bars = Math.max(3, Math.round(w / (h * 0.55)));
      for (let i = 0; i < bars; i++) {
        const x = -w / 2 + (w / bars) * (i + 0.5);
        box(ctx, x - h * 0.08, -h * 0.55, h * 0.16, h * 1.1, '#5b6675', h * 0.08, '#12161c', line * 0.6);
        disc(ctx, x, 0, h * 0.17, h * 0.17, '#8f9cad');
        disc(ctx, x - h * 0.05, -h * 0.05, h * 0.06, h * 0.06, '#e2e9f2');
      }
      jambs();
    } else if (p.kind.startsWith('window')) {
      box(ctx, -w / 2, -h * 0.52, w, h * 1.04, '#8f877a', 2, '#2a251f', line);
      box(ctx, -w / 2 + line * 2, -h * 0.34, w - line * 4, h * 0.68, '#241a10', 2);
      const panes = Math.max(2, Math.round(w / (h * 1.1)));
      const inner = w - line * 6;
      const stained = ['#d8434f', '#e8b23a', '#3d8fd6', '#44a86a', '#8d52c4'];
      for (let i = 0; i < panes; i++) {
        const x = -inner / 2 + (inner / panes) * i;
        const pw = inner / panes - line;
        if (p.kind === 'window_stained') {
          for (let k = 0; k < 2; k++) {
            box(ctx, x + (pw / 2) * k, -h * 0.26, pw / 2 - 0.5, h * 0.52, stained[(i * 2 + k) % stained.length], 1);
          }
          disc(ctx, x + pw / 2, 0, h * 0.13, h * 0.13, '#ffe9a8');
        } else {
          const glass = ctx.createLinearGradient(x, -h * 0.26, x + pw, h * 0.26);
          const dim = p.kind === 'window_bars';
          glass.addColorStop(0, dim ? '#3a4a58' : '#c9ecf5');
          glass.addColorStop(0.5, dim ? '#1f2a34' : '#6fb4cc');
          glass.addColorStop(1, dim ? '#34424f' : '#8fd0e2');
          ctx.fillStyle = glass;
          ctx.fillRect(x, -h * 0.26, pw, h * 0.52);
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.55)';
        ctx.lineWidth = line * 0.6;
        ctx.beginPath();
        ctx.moveTo(x + pw * 0.18, h * 0.16);
        ctx.lineTo(x + pw * 0.45, -h * 0.18);
        ctx.stroke();
      }
      if (p.kind === 'window_bars') {
        for (let x = -inner / 2 + h * 0.25; x < inner / 2; x += h * 0.42) {
          box(ctx, x, -h * 0.5, h * 0.13, h, '#8d98a8', h * 0.06, '#12161c', line * 0.5);
        }
        box(ctx, -inner / 2, -h * 0.07, inner, h * 0.14, '#6b7686', h * 0.05, '#12161c', line * 0.5);
      }
    } else {
      const swing = ((p.openAngle ?? (p.open ? 75 : 0)) * Math.PI) / 180;
      const open = swing > Math.PI / 180;
      const thick = open ? h * 0.52 : h * 0.72;
      const double = p.kind === 'door_double';
      const len = double ? (w - 4) / 2 : w - 4;
      jambs();
      const sides = double ? [-1, 1] : [-1];
      for (const side of sides) {
        ctx.save();
        ctx.translate(side * (w / 2 - 2), 0);
        // The right leaf is the left one mirrored, so both swing the same way.
        ctx.scale(-side, 1);
        if (open) ctx.rotate(-swing);
        leaf(ctx, p.kind, open && !double ? len * 0.9 : len, thick);
        if (p.kind !== 'door_secret') handle(ctx, len * 0.84, thick);
        disc(ctx, thick * 0.2, 0, thick * 0.18, thick * 0.18, '#26211c');
        ctx.restore();
      }
    }

    ctx.restore();
  }
}
