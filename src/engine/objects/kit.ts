// Small drawing kit for top-down objects. Positions and sizes are fractions of the sprite;
// radii and line widths are fractions of its shorter side.

export type Texture = 'wood' | 'stone' | 'metal' | 'gold' | 'cloth' | 'straw' | 'liquid' | 'plain';

export interface Mat {
  c: string;
  t: Texture;
}

const mat = (t: Texture) => (c: string): Mat => ({ c, t });
export const wood = mat('wood');
export const stone = mat('stone');
export const metal = mat('metal');
export const gold = mat('gold');
export const cloth = mat('cloth');
export const straw = mat('straw');
export const liquid = mat('liquid');
export const plain = mat('plain');

export const OAK = wood('#8a5c34');
export const DARKWOOD = wood('#573721');
export const PALEWOOD = wood('#b48a58');
export const GRANITE = stone('#8b877e');
export const DARKSTONE = stone('#55534f');
export const MARBLE = stone('#ddd8cc');
export const IRON = metal('#5a626e');
export const STEEL = metal('#a9b3c0');
export const GOLD = gold('#d0a53f');
export const COPPER = metal('#b56a3c');
export const LINEN = cloth('#e8e0cc');
export const WATER = liquid('#3f9cc0');
export const OUTLINE = 'rgba(20, 12, 6, 0.85)';

export type Pt = [number, number];

export interface Style {
  turn?: number;
  shadow?: boolean; // soft drop shadow, for parts standing above their base
  edge?: boolean; // dark outline (default true)
  vertical?: boolean; // direction of the grain
}

const TAU = Math.PI * 2;

export function createKit(ctx: CanvasRenderingContext2D, W: number, H: number, seed: number) {
  const m = Math.min(W, H);
  const line = Math.max(1.2, m * 0.022);
  let state = (seed % 2147483646) + 1;
  const rand = () => (state = (state * 48271) % 2147483647) / 2147483647;
  const between = (a: number, b: number) => a + rand() * (b - a);
  const pick = <T,>(list: T[]): T => list[Math.floor(rand() * list.length)];

  // Texture strokes inside the current clip, covering the box (px).
  function grain(t: Texture, x: number, y: number, w: number, h: number, vertical: boolean) {
    const dot = (color: string, rx: number, ry: number) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x + rand() * w, y + rand() * h, rx, ry, 0, 0, TAU);
      ctx.fill();
    };
    const count = Math.min(260, Math.round((w * h) / 70) + 4);
    if (t === 'wood') {
      const lines = Math.max(3, Math.round((vertical ? w : h) / 5));
      for (let i = 0; i < lines; i++) {
        const at = (i + rand()) / lines;
        ctx.strokeStyle = rand() > 0.35 ? 'rgba(35,17,5,0.32)' : 'rgba(255,214,160,0.2)';
        ctx.lineWidth = 0.7 + rand() * 1.1;
        ctx.beginPath();
        const wave = (rand() - 0.5) * 7;
        if (vertical) {
          ctx.moveTo(x + at * w, y);
          ctx.bezierCurveTo(x + at * w + wave, y + h * 0.33, x + at * w - wave, y + h * 0.66, x + at * w, y + h);
        } else {
          ctx.moveTo(x, y + at * h);
          ctx.bezierCurveTo(x + w * 0.33, y + at * h + wave, x + w * 0.66, y + at * h - wave, x + w, y + at * h);
        }
        ctx.stroke();
      }
      if (w * h > 3000) dot('rgba(40,20,6,0.45)', 3.4, 1.8);
    } else if (t === 'stone') {
      for (let i = 0; i < count; i++) {
        dot(rand() > 0.5 ? 'rgba(25,20,14,0.24)' : 'rgba(255,250,235,0.22)', 0.6 + rand() * 2.2, 0.6 + rand() * 1.6);
      }
      for (let i = 0; i < 2; i++) {
        ctx.strokeStyle = 'rgba(30,24,18,0.35)';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        let px = x + rand() * w;
        let py = y + rand() * h;
        ctx.moveTo(px, py);
        for (let k = 0; k < 3; k++) {
          px += (rand() - 0.5) * w * 0.25;
          py += (rand() - 0.5) * h * 0.25;
          ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    } else if (t === 'metal' || t === 'gold') {
      for (let i = 0; i < 4; i++) {
        const at = x + (i / 4 + rand() * 0.15) * (w + h) - h;
        ctx.strokeStyle = t === 'gold' ? 'rgba(255,244,180,0.38)' : 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 1 + rand() * m * 0.05;
        ctx.beginPath();
        ctx.moveTo(at, y + h);
        ctx.lineTo(at + h, y);
        ctx.stroke();
      }
      for (let i = 0; i < count / 4; i++) dot('rgba(30,18,4,0.2)', 0.8, 0.8);
    } else if (t === 'cloth') {
      ctx.lineWidth = 0.7;
      for (let k = 0; k < w + h; k += 5) {
        ctx.strokeStyle = 'rgba(0,0,0,0.13)';
        ctx.beginPath();
        ctx.moveTo(x + k, y);
        ctx.lineTo(x + k - h, y + h);
        ctx.stroke();
      }
      for (let i = 0; i < count / 3; i++) dot('rgba(255,255,255,0.12)', 0.9, 0.9);
    } else if (t === 'straw') {
      for (let i = 0; i < count * 1.6; i++) {
        const px = x + rand() * w;
        const py = y + rand() * h;
        const a = vertical ? Math.PI / 2 + (rand() - 0.5) * 0.7 : (rand() - 0.5) * 0.9;
        const len = 5 + rand() * 12;
        ctx.strokeStyle = pick(['rgba(255,230,150,0.75)', 'rgba(110,80,20,0.55)', 'rgba(220,180,90,0.7)']);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(a) * len, py + Math.sin(a) * len);
        ctx.stroke();
      }
    } else if (t === 'liquid') {
      ctx.strokeStyle = 'rgba(230,250,255,0.42)';
      ctx.lineWidth = Math.max(1, m * 0.012);
      for (let i = 0; i < count / 9 + 3; i++) {
        ctx.beginPath();
        ctx.arc(x + rand() * w, y + rand() * h, 3 + rand() * m * 0.09, 3.5, 5.3);
        ctx.stroke();
      }
    }
  }

  // Fills a path as a lit solid: base, texture, volume gradient and outline.
  function solid(path: () => void, m_: Mat, bx: number, by: number, bw: number, bh: number, style: Style) {
    ctx.save();
    if (style.shadow) {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = m * 0.06;
      ctx.shadowOffsetX = m * 0.03;
      ctx.shadowOffsetY = m * 0.04;
      path();
      ctx.fillStyle = m_.c;
      ctx.fill();
      ctx.restore();
    }
    path();
    ctx.fillStyle = m_.c;
    ctx.fill();
    ctx.save();
    ctx.clip();
    grain(m_.t, bx, by, bw, bh, style.vertical ?? bh > bw);
    const light = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
    light.addColorStop(0, 'rgba(255,246,222,0.3)');
    light.addColorStop(0.45, 'rgba(255,246,222,0)');
    light.addColorStop(1, 'rgba(10,4,0,0.34)');
    ctx.fillStyle = light;
    ctx.fillRect(bx, by, bw, bh);
    // Inner bevel along the border
    path();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = line * 3.2;
    ctx.stroke();
    ctx.restore();
    if (style.edge !== false) {
      path();
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = line;
      ctx.stroke();
    }
    ctx.restore();
  }

  function rect(x: number, y: number, w: number, h: number, material: Mat, radius = 0.04, style: Style = {}) {
    const pw = w * W;
    const ph = h * H;
    ctx.save();
    ctx.translate((x + w / 2) * W, (y + h / 2) * H);
    if (style.turn) ctx.rotate(style.turn);
    solid(
      () => {
        ctx.beginPath();
        ctx.roundRect(-pw / 2, -ph / 2, pw, ph, Math.min(radius * m, pw / 2, ph / 2));
      },
      material,
      -pw / 2,
      -ph / 2,
      pw,
      ph,
      style
    );
    ctx.restore();
  }

  function oval(x: number, y: number, rx: number, ry: number, material: Mat, style: Style = {}) {
    const px = rx * W;
    const py = ry * H;
    ctx.save();
    ctx.translate(x * W, y * H);
    if (style.turn) ctx.rotate(style.turn);
    solid(
      () => {
        ctx.beginPath();
        ctx.ellipse(0, 0, px, py, 0, 0, TAU);
      },
      material,
      -px,
      -py,
      px * 2,
      py * 2,
      style
    );
    ctx.restore();
  }

  // A true circle, radius relative to the shorter side.
  const disc = (x: number, y: number, r: number, material: Mat, style: Style = {}) =>
    oval(x, y, (r * m) / W, (r * m) / H, material, style);

  function poly(points: Pt[], material: Mat, style: Style = {}) {
    const xs = points.map((p) => p[0] * W);
    const ys = points.map((p) => p[1] * H);
    const bx = Math.min(...xs);
    const by = Math.min(...ys);
    solid(
      () => {
        ctx.beginPath();
        points.forEach((_, i) => (i === 0 ? ctx.moveTo(xs[i], ys[i]) : ctx.lineTo(xs[i], ys[i])));
        ctx.closePath();
      },
      material,
      bx,
      by,
      Math.max(...xs) - bx,
      Math.max(...ys) - by,
      style
    );
  }

  // A rough rounded rock or clump around a centre.
  function lump(x: number, y: number, r: number, material: Mat, sides = 9, rough = 0.28, style: Style = {}) {
    const points: Pt[] = Array.from({ length: sides }, (_, i) => {
      const a = (i / sides) * TAU + rand() * 0.25;
      const d = r * m * (1 - rough + rand() * rough * 2);
      return [x + (Math.cos(a) * d) / W, y + (Math.sin(a) * d) / H];
    });
    poly(points, material, style);
  }

  // Open line through the points; `smooth` bends it through their midpoints.
  function stroke(points: Pt[], color: string, width: number, edged = true, smooth = false) {
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(points[0][0] * W, points[0][1] * H);
      for (let i = 1; i < points.length; i++) {
        const [px, py] = points[i];
        if (smooth && i < points.length - 1) {
          const [nx, ny] = points[i + 1];
          ctx.quadraticCurveTo(px * W, py * H, ((px + nx) / 2) * W, ((py + ny) / 2) * H);
        } else ctx.lineTo(px * W, py * H);
      }
    };
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (edged) {
      path();
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = width * m + line * 1.5;
      ctx.stroke();
    }
    path();
    ctx.strokeStyle = color;
    ctx.lineWidth = width * m;
    ctx.stroke();
    ctx.restore();
  }

  function dot(x: number, y: number, r: number, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x * W, y * H, r * m, 0, TAU);
    ctx.fill();
  }

  function ring(x: number, y: number, r: number, color: string, width: number, from = 0, to = TAU) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width * m;
    ctx.beginPath();
    ctx.arc(x * W, y * H, r * m, from, to);
    ctx.stroke();
  }

  // Rounded stud, nail or bead with its highlight.
  function stud(x: number, y: number, r: number, color: string) {
    dot(x + (r * m * 0.3) / W, y + (r * m * 0.45) / H, r * 1.15, 'rgba(0,0,0,0.45)');
    dot(x, y, r, color);
    dot(x - (r * m * 0.3) / W, y - (r * m * 0.3) / H, r * 0.38, 'rgba(255,255,255,0.75)');
  }

  function glow(x: number, y: number, r: number, color: string, alpha = 0.75) {
    const g = ctx.createRadialGradient(x * W, y * H, 0, x * W, y * H, r * m);
    const n = parseInt(color.slice(1), 16);
    const rgb = `${n >> 16},${(n >> 8) & 255},${n & 255}`;
    g.addColorStop(0, `rgba(${rgb},${alpha})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x * W, y * H, r * m, 0, TAU);
    ctx.fill();
  }

  // Flickering tongues of fire seen from above.
  function flame(x: number, y: number, r: number, colors = ['#e8481a', '#ff9a1f', '#ffd84d', '#fff6c4']) {
    colors.forEach((color, layer) => {
      const size = r * (1 - layer * 0.23);
      const tongues = 11 - layer;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i <= tongues * 2; i++) {
        const a = (i / (tongues * 2)) * TAU + layer;
        const d = size * m * (i % 2 ? 0.52 + rand() * 0.16 : 0.85 + rand() * 0.35);
        const px = x * W + Math.cos(a) * d;
        const py = y * H + Math.sin(a) * d;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.quadraticCurveTo(x * W + Math.cos(a - 0.2) * d * 0.9, y * H + Math.sin(a - 0.2) * d * 0.9, px, py);
      }
      ctx.fill();
    });
  }

  // Boards side by side, each its own tone.
  function boards(x: number, y: number, w: number, h: number, material: Mat, count: number, vertical = true) {
    for (let i = 0; i < count; i++) {
      if (vertical) rect(x + (w / count) * i, y, w / count, h, material, 0.015, { vertical: true });
      else rect(x, y + (h / count) * i, w, h / count, material, 0.015, { vertical: false });
    }
  }

  // Leaf clumps filling a round crown.
  function foliage(x: number, y: number, r: number, colors: string[], count: number, leaf = 0.09) {
    for (let i = 0; i < count; i++) {
      const a = rand() * TAU;
      const d = Math.sqrt(rand()) * r * m;
      const px = x * W + Math.cos(a) * d;
      const py = y * H + Math.sin(a) * d;
      const size = leaf * m * (0.6 + rand() * 0.8);
      const turn = rand() * Math.PI;
      const shape = (dx: number, dy: number, fill: string) => {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.ellipse(px + dx, py + dy, size, size * 0.58, turn, 0, TAU);
        ctx.fill();
      };
      shape(size * 0.25, size * 0.35, 'rgba(8,18,4,0.4)');
      // Lower index = deeper in the crown, so later (higher) leaves use lighter tones.
      shape(0, 0, colors[Math.min(colors.length - 1, Math.floor((i / count) * colors.length + rand() * 0.8))]);
      ctx.strokeStyle = 'rgba(255,255,230,0.22)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(px - Math.cos(turn) * size * 0.7, py - Math.sin(turn) * size * 0.7);
      ctx.lineTo(px + Math.cos(turn) * size * 0.7, py + Math.sin(turn) * size * 0.7);
      ctx.stroke();
    }
  }

  return {
    ctx, W, H, m, rand, between, pick,
    rect, oval, disc, poly, lump, stroke, dot, ring, stud, glow, flame, boards, foliage,
  };
}

export type Kit = ReturnType<typeof createKit>;
export type Painter = (k: Kit) => void;
