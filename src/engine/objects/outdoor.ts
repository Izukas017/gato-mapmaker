// Magic, storage, camp, nature and lights.
import {
  cloth, COPPER, DARKSTONE, DARKWOOD, GOLD, gold, GRANITE, IRON, type Kit, LINEN, liquid, metal,
  OAK, PALEWOOD, type Painter, plain, type Pt, STEEL, stone, straw, wood,
} from './kit';

const TAU = Math.PI * 2;
const at = (a: number, r: number): Pt => [0.5 + Math.cos(a) * r, 0.5 + Math.sin(a) * r];
const around = (count: number, radius: number, draw: (x: number, y: number, a: number, i: number) => void, from = 0) => {
  for (let i = 0; i < count; i++) {
    const a = from + (i / count) * TAU;
    draw(...at(a, radius), a, i);
  }
};

function crystals(k: Kit, dark: string, main: string, light: string) {
  k.glow(0.5, 0.5, 0.52, main, 0.8);
  k.lump(0.5, 0.55, 0.27, DARKSTONE, 10, 0.22, { shadow: true });
  const shard = (x: number, y: number, angle: number, length: number, width: number) => {
    const p = (along: number, side: number): Pt => [
      x + Math.cos(angle) * along - Math.sin(angle) * side,
      y + Math.sin(angle) * along + Math.cos(angle) * side,
    ];
    k.poly([p(0, -width), p(length * 0.72, -width), p(length, 0), p(0, 0)], liquid(main), { shadow: true });
    k.poly([p(0, 0), p(length, 0), p(length * 0.72, width), p(0, width)], liquid(dark));
    k.stroke([p(0.03, -width * 0.4), p(length * 0.7, -width * 0.4)], light, 0.012, false);
  };
  [[-2.6, 0.3, 0.055], [-1.65, 0.42, 0.08], [-0.6, 0.34, 0.065], [0.35, 0.28, 0.05], [1.9, 0.26, 0.05], [2.9, 0.33, 0.055]].forEach(
    ([a, len, w]) => shard(0.5, 0.52, a, len, w)
  );
  shard(0.47, 0.58, -1.35, 0.26, 0.07);
}

function book(k: Kit, x: number, y: number, w: number, h: number, color: string, turn: number) {
  k.rect(x, y, w, h, cloth(color), 0.04, { turn, shadow: true });
  k.rect(x + w * 0.08, y + h * 0.1, w * 0.84, h * 0.8, cloth(color), 0.03, { turn, edge: false });
  k.ctx.save();
  k.ctx.translate((x + w / 2) * k.W, (y + h / 2) * k.H);
  k.ctx.rotate(turn);
  k.ctx.strokeStyle = '#e8c860';
  k.ctx.lineWidth = k.m * 0.015;
  k.ctx.strokeRect(-w * k.W * 0.3, -h * k.H * 0.3, w * k.W * 0.6, h * k.H * 0.6);
  k.ctx.fillStyle = '#f2ead4';
  k.ctx.fillRect(w * k.W * 0.42, -h * k.H * 0.42, w * k.W * 0.07, h * k.H * 0.84);
  k.ctx.restore();
}

function coins(k: Kit, x: number, y: number, rx: number, ry: number, count: number) {
  for (let i = 0; i < count; i++) {
    const a = k.rand() * TAU;
    const d = Math.sqrt(k.rand());
    const cx = x + Math.cos(a) * d * rx;
    const cy = y + Math.sin(a) * d * ry;
    k.stud(cx, cy, 0.032, k.pick(['#d9a926', '#f0c43c', '#ffdc66']));
    k.ring(cx, cy, 0.018, 'rgba(120,80,10,0.7)', 0.006);
  }
}

function squareCrate(k: Kit, x: number, y: number, w: number, h: number) {
  k.rect(x, y, w, h, PALEWOOD, 0.03, { shadow: true });
  k.rect(x + w * 0.12, y + h * 0.12, w * 0.76, h * 0.76, OAK, 0.02);
  k.stroke([[x + w * 0.16, y + h * 0.16], [x + w * 0.84, y + h * 0.84]], '#b48a58', 0.065);
  k.stroke([[x + w * 0.84, y + h * 0.16], [x + w * 0.16, y + h * 0.84]], '#b48a58', 0.065);
  for (const dx of [0.06, 0.94]) for (const dy of [0.06, 0.94]) k.stud(x + w * dx, y + h * dy, 0.022, '#6a737f');
}

function tent(k: Kit, color: string, shade: string) {
  for (const [x, y] of [[0.04, 0.06], [0.96, 0.06], [0.04, 0.94], [0.96, 0.94]]) {
    k.stroke([[x, y], [x < 0.5 ? 0.18 : 0.82, y < 0.5 ? 0.18 : 0.82]], '#d8c9a0', 0.012);
    k.stud(x, y, 0.025, '#8a5c34');
  }
  k.poly([[0.12, 0.1], [0.5, 0.06], [0.5, 0.9], [0.12, 0.86]], cloth(color), { shadow: true });
  k.poly([[0.88, 0.1], [0.5, 0.06], [0.5, 0.9], [0.88, 0.86]], cloth(shade), { shadow: true });
  for (const y of [0.3, 0.52, 0.72]) {
    k.stroke([[0.14, y + 0.03], [0.5, y], [0.86, y + 0.03]], 'rgba(0,0,0,0.25)', 0.012, false, true);
  }
  k.poly([[0.5, 0.74], [0.64, 0.88], [0.5, 0.89], [0.36, 0.88]], plain('#1c1109'));
  k.poly([[0.5, 0.75], [0.37, 0.88], [0.44, 0.96]], cloth(color), { shadow: true });
  k.stroke([[0.5, 0.04], [0.5, 0.9]], '#8a5c34', 0.028);
  for (const y of [0.05, 0.9]) k.stud(0.5, y, 0.035, '#d0a53f');
}

function tree(k: Kit, colors: string[], fruit?: string) {
  k.disc(0.5, 0.5, 0.4, plain('rgba(8,20,6,0.35)'), { edge: false });
  around(7, 0.27, (x, y) => k.foliage(x, y, 0.2, colors.slice(0, 2), 55, 0.05), 0.4);
  for (const a of [0.7, 2.4, 3.9, 5.4]) k.stroke([[0.5, 0.5], at(a, 0.3)], '#4f3018', 0.035);
  k.foliage(0.5, 0.5, 0.32, colors.slice(1), 130, 0.052);
  k.foliage(0.42, 0.4, 0.17, colors.slice(-2), 45, 0.045);
  if (fruit) for (let i = 0; i < 22; i++) k.stud(...at(k.between(0, TAU), k.between(0.05, 0.4)), 0.017, fruit);
}

function brazierBowl(k: Kit, glowColor: string, flames: string[]) {
  k.glow(0.5, 0.5, 0.52, glowColor, 0.85);
  around(3, 0.38, (x, y) => k.disc(x, y, 0.09, IRON, { shadow: true }), -1.57);
  k.disc(0.5, 0.5, 0.36, metal('#454d59'), { shadow: true });
  k.disc(0.5, 0.5, 0.27, plain('#160e0c'));
  for (let i = 0; i < 9; i++) k.lump(k.between(0.36, 0.64), k.between(0.36, 0.64), 0.065, stone('#33231c'), 6, 0.3);
  k.flame(0.5, 0.5, 0.24, flames);
  around(8, 0.315, (x, y) => k.stud(x, y, 0.025, '#d0a53f'));
}

function candle(k: Kit, x: number, y: number, r: number) {
  k.glow(x, y, r * 3.4, '#ffbe4a', 0.75);
  k.disc(x, y, r, plain('#efe4c8'), { shadow: true });
  k.ring(x, y, r * 0.62, '#d6c498', r * 0.16);
  k.flame(x, y, r * 0.62, ['#ff9a1f', '#ffd84d', '#fffbe0']);
}

export const OUTDOOR: Record<string, Painter> = {
  // ---------- Magic ----------
  magic_circle: (k) => {
    k.glow(0.5, 0.5, 0.52, '#2fe0c4', 0.45);
    for (const [r, w] of [[0.47, 0.016], [0.43, 0.006], [0.3, 0.012], [0.11, 0.01]]) {
      k.ring(0.5, 0.5, r, 'rgba(94,234,212,0.35)', w * 3.2);
      k.ring(0.5, 0.5, r, '#a6fff0', w);
    }
    for (const turn of [0, 1]) {
      const tri = [0, 1, 2, 0].map((i) => at((i / 3) * TAU - 1.57 + turn * Math.PI, 0.3));
      k.stroke(tri, '#7ef8e2', 0.012, false);
    }
    around(16, 0.45, (x, y, a, i) => {
      const [dx, dy] = [Math.cos(a) * 0.018, Math.sin(a) * 0.018];
      k.stroke(i % 2 ? [[x - dy, y + dx], [x + dx, y + dy], [x + dy, y - dx]] : [[x - dx, y - dy], [x + dx, y + dy], [x + dy, y - dx]], '#d4fff8', 0.007, false);
    });
    around(6, 0.3, (x, y) => k.stud(x, y, 0.028, '#7ef8e2'), -1.57);
    k.glow(0.5, 0.5, 0.13, '#e8fffb', 0.9);
  },
  portal_gate: (k) => {
    k.glow(0.5, 0.5, 0.52, '#a855f7', 0.85);
    const g = k.ctx.createRadialGradient(k.W / 2, k.H / 2, 0, k.W / 2, k.H / 2, k.m * 0.36);
    for (const [stop, c] of [[0, '#fdf2ff'], [0.25, '#d98cff'], [0.65, '#7a28c8'], [1, '#26063f']] as const) g.addColorStop(stop, c);
    k.ctx.fillStyle = g;
    k.ctx.beginPath();
    k.ctx.arc(k.W / 2, k.H / 2, k.m * 0.36, 0, TAU);
    k.ctx.fill();
    for (let arm = 0; arm < 5; arm++) {
      const spiral = Array.from({ length: 9 }, (_, i) => at((arm / 5) * TAU + i * 0.42, 0.34 - i * 0.036));
      k.stroke(spiral, 'rgba(244,214,255,0.75)', 0.018, false, true);
    }
    around(12, 0.41, (x, y, a, i) => {
      k.rect(x - 0.075, y - 0.058, 0.15, 0.116, stone(i % 2 ? '#625d74' : '#524e62'), 0.04, { turn: a + 1.57, shadow: true });
      if (i % 3 === 0) k.stud(x, y, 0.028, '#e29cff');
    });
  },
  alchemy_table: (k) => {
    k.rect(0.02, 0.05, 0.96, 0.9, DARKWOOD, 0.08, { shadow: true });
    k.rect(0.05, 0.12, 0.9, 0.76, OAK, 0.05);
    ['#e0384c', '#3f9ce0', '#3fd06a', '#f0b028'].forEach((c, i) => {
      const x = 0.13 + i * 0.13;
      const y = i % 2 ? 0.66 : 0.34;
      k.glow(x, y, 0.2, c, 0.6);
      k.disc(x, y, 0.12, liquid(c), { shadow: true });
      k.disc(x, y, 0.045, plain('#d9c9a0'));
    });
    k.stroke([[0.26, 0.66], [0.34, 0.2], [0.52, 0.34]], 'rgba(220,245,255,0.8)', 0.03, true, true);
    book(k, 0.62, 0.2, 0.17, 0.42, '#5b3a7a', -0.2);
    k.disc(0.86, 0.66, 0.16, DARKSTONE, { shadow: true });
    k.dot(0.86, 0.66, 0.085, '#7fa84c');
    k.stroke([[0.86, 0.66], [0.94, 0.38]], '#a59f92', 0.07);
    candle(k, 0.62, 0.74, 0.06);
  },
  cauldron_witch: (k) => {
    k.glow(0.5, 0.5, 0.52, '#7fe83c', 0.8);
    around(8, 0.42, (x, y, a) => k.rect(x - 0.095, y - 0.032, 0.19, 0.064, DARKWOOD, 0.05, { turn: a }));
    for (const x of [0.14, 0.86]) k.ring(x, 0.5, 0.09, '#23272e', 0.045);
    k.disc(0.5, 0.5, 0.37, metal('#2e333c'), { shadow: true });
    k.disc(0.5, 0.5, 0.28, liquid('#4cae2c'));
    k.glow(0.5, 0.5, 0.24, '#d4ff6a', 0.75);
    for (let i = 0; i < 13; i++) {
      const [x, y] = at(k.between(0, TAU), k.between(0, 0.22));
      const r = k.between(0.018, 0.058);
      k.disc(x, y, r, liquid('#9be84a'));
      k.dot(x - r * 0.3, y - r * 0.3, r * 0.3, '#f4ffd8');
    }
    k.disc(0.6, 0.42, 0.05, plain('#f2ead4'));
    k.dot(0.605, 0.425, 0.022, '#8f1418');
  },
  crystal_cluster: (k) => crystals(k, '#0f6ea8', '#38bdf8', '#e6f9ff'),
  crystal_magenta: (k) => crystals(k, '#86198f', '#d946ef', '#fdeaff'),
  orrery_brass: (k) => {
    k.disc(0.5, 0.5, 0.48, DARKWOOD, { shadow: true });
    k.disc(0.5, 0.5, 0.43, stone('#1e2440'));
    for (let i = 0; i < 40; i++) k.dot(...at(k.between(0, TAU), k.between(0, 0.4)), 0.006, '#dfe6ff');
    for (const r of [0.38, 0.28, 0.18]) k.ring(0.5, 0.5, r, '#d0a53f', 0.014);
    for (const [a, r, size, c] of [[0.6, 0.38, 0.055, '#3f9ce0'], [2.7, 0.28, 0.07, '#d8632c'], [4.6, 0.18, 0.042, '#b4bcc8'], [4.1, 0.38, 0.038, '#44c47a']] as const) {
      k.stroke([[0.5, 0.5], at(a, r)], '#a8842f', 0.012);
      k.stud(...at(a, r), size, c);
    }
    k.glow(0.5, 0.5, 0.17, '#ffd24a', 0.9);
    k.stud(0.5, 0.5, 0.085, '#ffcf3c');
  },
  books_pile: (k) => {
    book(k, 0.08, 0.14, 0.5, 0.62, '#8f2b34', -0.35);
    book(k, 0.42, 0.28, 0.48, 0.6, '#2c5e8c', 0.4);
    book(k, 0.24, 0.3, 0.44, 0.56, '#2f6b45', 0.06);
    k.rect(0.6, 0.08, 0.3, 0.2, LINEN, 0.02, { turn: 0.5, shadow: true });
    k.stroke([[0.1, 0.9], [0.42, 0.74]], '#f4f0e4', 0.035);
    k.stud(0.82, 0.14, 0.07, '#2a2e46');
  },

  // ---------- Storage ----------
  barrel: (k) => {
    k.disc(0.5, 0.5, 0.47, DARKWOOD, { shadow: true });
    around(14, 0.425, (x, y, a) => k.stroke([at(a, 0.34), at(a, 0.46)], 'rgba(30,14,4,0.7)', 0.016, false));
    k.ring(0.5, 0.5, 0.41, '#4a525e', 0.055);
    k.disc(0.5, 0.5, 0.34, OAK);
    for (const x of [0.36, 0.5, 0.64]) k.stroke([[x, 0.22], [x, 0.78]], 'rgba(40,20,6,0.55)', 0.012, false);
    k.ring(0.5, 0.5, 0.34, '#79838f', 0.028);
    k.disc(0.62, 0.38, 0.06, DARKWOOD, { shadow: true });
    around(6, 0.41, (x, y) => k.stud(x, y, 0.022, '#c3ccd8'));
  },
  crate: (k) => squareCrate(k, 0.04, 0.04, 0.92, 0.92),
  crates_stack: (k) => {
    squareCrate(k, 0.03, 0.08, 0.52, 0.56);
    squareCrate(k, 0.46, 0.4, 0.51, 0.55);
    squareCrate(k, 0.24, 0.2, 0.46, 0.49);
  },
  sack: (k) => {
    k.lump(0.45, 0.54, 0.43, cloth('#b0946a'), 14, 0.1, { shadow: true });
    k.lump(0.4, 0.5, 0.25, cloth('#c4a87c'), 10, 0.18, { edge: false });
    k.poly([[0.64, 0.34], [0.94, 0.14], [0.86, 0.32], [0.98, 0.44], [0.72, 0.48]], cloth('#a8895c'), { shadow: true });
    k.stroke([[0.66, 0.32], [0.72, 0.5]], '#6a4a28', 0.055);
    for (let i = 0; i < 14; i++) k.oval(k.between(0.62, 0.92), k.between(0.64, 0.94), 0.022, 0.017, straw('#e8c45c'), { turn: k.between(0, 3) });
  },
  pottery_jars: (k) => {
    for (const [x, y, r, c] of [[0.28, 0.36, 0.27, '#b4603a'], [0.7, 0.32, 0.22, '#c98a54'], [0.55, 0.68, 0.28, '#9c4e30']] as const) {
      for (const side of [-1, 1]) k.ring(x + side * r * 0.72, y, r * 0.36, '#6a3018', 0.045);
      k.disc(x, y, r, stone(c), { shadow: true });
      k.ring(x, y, r * 0.72, '#e8cf9a', 0.022);
      k.disc(x, y, r * 0.44, stone(c), { shadow: true });
      k.dot(x, y, r * 0.28, '#1e0e07');
    }
  },
  cart: (k) => {
    for (const x of [0.03, 0.84]) {
      k.rect(x, 0.3, 0.13, 0.4, DARKWOOD, 0.14, { shadow: true });
      for (let i = 0; i < 4; i++) k.stroke([[x + 0.015, 0.35 + i * 0.1], [x + 0.115, 0.35 + i * 0.1]], '#9aa3ad', 0.025, false);
    }
    for (const x of [0.32, 0.68]) k.stroke([[x, 0.24], [x + (0.5 - x) * 0.2, 0.01]], '#8a5c34', 0.06);
    k.rect(0.14, 0.2, 0.72, 0.76, DARKWOOD, 0.05, { shadow: true });
    k.boards(0.19, 0.24, 0.62, 0.68, OAK, 5);
    squareCrate(k, 0.22, 0.3, 0.3, 0.2);
    k.disc(0.66, 0.46, 0.14, OAK, { shadow: true });
    k.ring(0.66, 0.46, 0.1, '#3d3a36', 0.025);
    for (const [x, y] of [[0.38, 0.68], [0.62, 0.74]]) k.lump(x, y, 0.17, cloth('#b0946a'), 11, 0.14, { shadow: true });
  },
  chest: (k) => {
    k.rect(0.03, 0.06, 0.94, 0.88, wood('#7a4a22'), 0.16, { shadow: true, vertical: false });
    k.stroke([[0.05, 0.42], [0.95, 0.42]], '#2a1608', 0.035, false);
    for (const x of [0.14, 0.78]) {
      k.rect(x, 0.04, 0.09, 0.92, IRON, 0.05, { shadow: true });
      for (const y of [0.14, 0.5, 0.86]) k.stud(x + 0.045, y, 0.04, '#d0a53f');
    }
    k.rect(0.42, 0.56, 0.16, 0.3, GOLD, 0.08, { shadow: true });
    k.dot(0.5, 0.66, 0.045, '#241806');
    k.stroke([[0.5, 0.67], [0.5, 0.78]], '#241806', 0.03, false);
  },
  chest_open_gold: (k) => {
    k.rect(0.05, 0.02, 0.9, 0.28, wood('#5c3518'), 0.12, { shadow: true, vertical: false });
    k.rect(0.1, 0.08, 0.8, 0.16, cloth('#8f1f2e'), 0.08);
    k.rect(0.03, 0.3, 0.94, 0.68, wood('#7a4a22'), 0.1, { shadow: true, vertical: false });
    k.rect(0.1, 0.38, 0.8, 0.52, stone('#3a2208'), 0.07);
    k.glow(0.5, 0.64, 0.62, '#ffd24a', 0.75);
    coins(k, 0.5, 0.64, 0.34, 0.2, 55);
    k.stud(0.32, 0.56, 0.065, '#d8344a');
    k.stud(0.68, 0.72, 0.058, '#3fa7d6');
    k.stud(0.56, 0.5, 0.045, '#44c47a');
    for (const x of [0.06, 0.88]) k.rect(x, 0.3, 0.06, 0.68, IRON, 0.04);
  },
  treasure_pile: (k) => {
    k.glow(0.5, 0.52, 0.55, '#ffd24a', 0.55);
    k.lump(0.5, 0.54, 0.42, gold('#b8891c'), 15, 0.16, { shadow: true });
    coins(k, 0.5, 0.54, 0.43, 0.4, 120);
    coins(k, 0.46, 0.46, 0.22, 0.2, 40);
    k.disc(0.32, 0.4, 0.12, GOLD, { shadow: true });
    k.disc(0.32, 0.4, 0.07, cloth('#8f1f2e'));
    for (const [x, y, c] of [[0.66, 0.36, '#d8344a'], [0.38, 0.7, '#3fa7d6'], [0.7, 0.66, '#44c47a']] as const) {
      k.poly([[x, y - 0.08], [x + 0.06, y], [x, y + 0.08], [x - 0.06, y]], liquid(c), { shadow: true });
      k.dot(x - 0.015, y - 0.025, 0.018, '#ffffff');
    }
    k.stroke([[0.12, 0.2], [0.5, 0.5]], '#c3ccd8', 0.035);
    k.stroke([[0.14, 0.34], [0.28, 0.18]], '#d0a53f', 0.045);
  },
  weapon_rack: (k) => {
    for (const x of [0.02, 0.91]) k.rect(x, 0.06, 0.07, 0.88, DARKWOOD, 0.1, { shadow: true });
    k.rect(0.05, 0.58, 0.9, 0.16, OAK, 0.05, { shadow: true });
    for (let i = 0; i < 3; i++) {
      const x = 0.17 + i * 0.15;
      k.poly([[x - 0.022, 0.62], [x - 0.018, 0.14], [x, 0.03], [x + 0.018, 0.14], [x + 0.022, 0.62]], STEEL, { shadow: true });
      k.stroke([[x - 0.055, 0.66], [x + 0.055, 0.66]], '#d0a53f', 0.07);
      k.stroke([[x, 0.7], [x, 0.9]], '#5c3820', 0.075);
      k.stud(x, 0.91, 0.06, '#d0a53f');
    }
    for (const x of [0.66, 0.8]) {
      k.stroke([[x, 0.12], [x, 0.94]], '#8a5c34', 0.07);
      if (x < 0.7) k.poly([[x - 0.065, 0.2], [x, 0.14], [x + 0.065, 0.2], [x + 0.03, 0.42], [x - 0.03, 0.42]], STEEL, { shadow: true });
      else k.poly([[x - 0.03, 0.2], [x, 0.01], [x + 0.03, 0.2], [x, 0.28]], STEEL, { shadow: true });
    }
  },
  armor_stand: (k) => {
    k.disc(0.5, 0.52, 0.46, DARKWOOD, { shadow: true });
    k.oval(0.5, 0.52, 0.4, 0.24, STEEL, { shadow: true });
    for (const x of [0.2, 0.8]) {
      k.disc(x, 0.5, 0.17, metal('#8f9aa8'), { shadow: true });
      k.ring(x, 0.5, 0.11, '#d0a53f', 0.022);
      for (const dy of [-0.08, 0.08]) k.stud(x, 0.5 + dy, 0.022, '#e8eef6');
    }
    k.disc(0.5, 0.48, 0.2, metal('#b9c3d0'), { shadow: true });
    k.stroke([[0.5, 0.29], [0.5, 0.68]], '#d0a53f', 0.035);
    k.stroke([[0.36, 0.4], [0.64, 0.4]], '#1c2028', 0.04, false);
    k.lump(0.5, 0.73, 0.1, straw('#b02f36'), 10, 0.3, { shadow: true });
  },
  anvil: (k) => {
    k.rect(0.24, 0.1, 0.5, 0.8, DARKWOOD, 0.12, { shadow: true });
    k.poly([[0.02, 0.5], [0.24, 0.3], [0.32, 0.24], [0.8, 0.24], [0.8, 0.34], [0.94, 0.34], [0.94, 0.66], [0.8, 0.66], [0.8, 0.76], [0.32, 0.76], [0.24, 0.7]], metal('#4a525e'), { shadow: true });
    k.rect(0.32, 0.31, 0.46, 0.38, metal('#6c7684'), 0.06);
    k.rect(0.82, 0.43, 0.06, 0.14, plain('#14171c'), 0.02);
    k.stroke([[0.4, 0.88], [0.62, 0.52]], '#8a5c34', 0.07);
    k.rect(0.55, 0.38, 0.2, 0.2, metal('#8f9aa8'), 0.05, { turn: 0.55, shadow: true });
    k.glow(0.45, 0.44, 0.18, '#ff8c2e', 0.7);
    k.stud(0.45, 0.44, 0.05, '#ffcf6b');
  },
  forge_furnace: (k) => {
    k.rect(0.02, 0.02, 0.96, 0.96, DARKSTONE, 0.1, { shadow: true });
    for (let i = 0; i < 6; i++) {
      for (const y of [0.04, 0.84]) k.rect(0.04 + i * 0.154, y, 0.148, 0.12, stone(i % 2 ? '#8f5a44' : '#7d4a38'), 0.04);
    }
    k.rect(0.12, 0.2, 0.6, 0.6, stone('#1a1210'), 0.14);
    k.glow(0.42, 0.5, 0.62, '#ff6a14', 1);
    for (let i = 0; i < 22; i++) k.lump(k.between(0.2, 0.64), k.between(0.3, 0.7), 0.05, stone(k.pick(['#3a1c14', '#c0481a', '#f08a24'])), 6, 0.3);
    k.flame(0.42, 0.5, 0.2);
    k.poly([[0.74, 0.26], [0.95, 0.34], [0.95, 0.66], [0.74, 0.74]], wood('#6a4222'), { shadow: true });
    for (let i = 1; i < 4; i++) k.stroke([[0.74 + i * 0.052, 0.28 + i * 0.02], [0.74 + i * 0.052, 0.72 - i * 0.02]], '#2a1608', 0.018, false);
    k.stroke([[0.74, 0.5], [0.64, 0.5]], '#8f9aa8', 0.04);
    k.stroke([[0.16, 0.9], [0.4, 0.62]], '#2c323b', 0.03);
  },
  minecart: (k) => {
    for (const x of [0.12, 0.88]) k.stroke([[x, 0.01], [x, 0.99]], '#8f9aa8', 0.045);
    for (const y of [0.2, 0.8]) for (const x of [0.12, 0.88]) k.rect(x - 0.07, y - 0.11, 0.14, 0.22, metal('#2e333c'), 0.1, { shadow: true });
    k.rect(0.16, 0.1, 0.68, 0.8, IRON, 0.09, { shadow: true });
    k.rect(0.24, 0.17, 0.52, 0.66, stone('#2a2420'), 0.05);
    for (let i = 0; i < 16; i++) k.lump(k.between(0.34, 0.66), k.between(0.26, 0.74), 0.11, stone(k.pick(['#5c5650', '#46403a', '#6e665e'])), 7, 0.3, { shadow: true });
    for (let i = 0; i < 6; i++) k.stud(k.between(0.35, 0.65), k.between(0.28, 0.72), 0.04, '#ffd24a');
    for (const x of [0.2, 0.8]) for (const y of [0.14, 0.5, 0.86]) k.stud(x, y, 0.03, '#c3ccd8');
  },

  // ---------- Camp ----------
  tent_red: (k) => tent(k, '#b8353a', '#8a2228'),
  tent_blue: (k) => tent(k, '#356ab0', '#224a84'),
  tent_pavilion: (k) => {
    around(8, 0.49, (x, y, a) => {
      k.stroke([[x, y], at(a, 0.4)], '#d8c9a0', 0.008);
      k.stud(x, y, 0.016, '#8a5c34');
    }, 0.39);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU;
      const b = ((i + 1) / 12) * TAU;
      k.poly([[0.5, 0.5], at(a, 0.43), at((a + b) / 2, 0.46), at(b, 0.43)], cloth(i % 2 ? '#f1e8d2' : '#b02f36'), { shadow: i === 0 });
      k.stud(...at(a, 0.43), 0.018, '#d0a53f');
    }
    k.ring(0.5, 0.5, 0.2, '#d0a53f', 0.016);
    k.disc(0.5, 0.5, 0.09, GOLD, { shadow: true });
    k.poly([[0.5, 0.5], [0.76, 0.4], [0.69, 0.48], [0.76, 0.55]], cloth('#2c62a8'), { shadow: true });
    k.stud(0.5, 0.5, 0.035, '#f4d77a');
  },
  campfire: (k) => {
    k.glow(0.5, 0.5, 0.55, '#ff8c2e', 0.7);
    k.disc(0.5, 0.5, 0.3, stone('#2c1e18'), { edge: false });
    around(11, 0.39, (x, y) => k.lump(x, y, 0.095, stone(k.pick(['#8b877e', '#6f6a62'])), 7, 0.22, { shadow: true }));
    around(5, 0.13, (x, y, a) => {
      k.rect(x - 0.17, y - 0.045, 0.34, 0.09, wood('#6a4222'), 0.06, { turn: a, shadow: true, vertical: false });
      k.dot(...at(a, 0.29), 0.035, '#c99a60');
    });
    k.flame(0.5, 0.5, 0.24);
    for (let i = 0; i < 10; i++) k.dot(...at(k.between(0, TAU), k.between(0.15, 0.34)), 0.008, '#ffd84d');
  },
  bedroll: (k) => {
    k.rect(0.08, 0.04, 0.84, 0.94, cloth('#5f7a38'), 0.28, { shadow: true });
    k.rect(0.15, 0.2, 0.7, 0.74, cloth('#7a9448'), 0.18);
    k.rect(0.22, 0.07, 0.56, 0.15, LINEN, 0.18, { shadow: true });
    k.poly([[0.12, 0.34], [0.88, 0.3], [0.7, 0.46], [0.14, 0.5]], cloth('#c4ad7c'), { shadow: true });
    for (const y of [0.62, 0.8]) {
      k.rect(0.06, y, 0.88, 0.05, wood('#6a4222'), 0.1, { shadow: true });
      k.rect(0.62, y - 0.008, 0.12, 0.066, GOLD, 0.06);
    }
  },
  wagon_covered: (k) => {
    for (const x of [0.02, 0.86]) for (const y of [0.2, 0.7]) {
      k.rect(x, y, 0.12, 0.2, DARKWOOD, 0.14, { shadow: true });
      k.stud(x + 0.06, y + 0.1, 0.045, '#9aa3ad');
    }
    k.stroke([[0.5, 0.18], [0.5, 0.01]], '#8a5c34', 0.06);
    k.stroke([[0.34, 0.03], [0.66, 0.03]], '#8a5c34', 0.05);
    k.rect(0.12, 0.14, 0.76, 0.83, OAK, 0.05, { shadow: true, vertical: true });
    k.rect(0.2, 0.15, 0.6, 0.09, wood('#a8794a'), 0.03, { shadow: true });
    k.rect(0.14, 0.25, 0.72, 0.66, LINEN, 0.14, { shadow: true });
    for (let i = 0; i < 5; i++) {
      const y = 0.28 + i * 0.15;
      k.stroke([[0.15, y], [0.5, y - 0.018], [0.85, y]], '#b5a684', 0.045, false, true);
      k.stroke([[0.16, y + 0.022], [0.5, y + 0.006], [0.84, y + 0.022]], 'rgba(255,255,245,0.7)', 0.025, false, true);
    }
    k.oval(0.5, 0.91, 0.23, 0.035, plain('#24180c'));
    squareCrate(k, 0.4, 0.92, 0.2, 0.065);
  },
  canoe_boat: (k) => {
    const hull = (s: number): Pt[] => [[0.5, 0.5 - 0.49 * s], [0.5 + 0.28 * s, 0.5 - 0.34 * s], [0.5 + 0.34 * s, 0.5], [0.5 + 0.29 * s, 0.5 + 0.33 * s], [0.5, 0.5 + 0.49 * s], [0.5 - 0.29 * s, 0.5 + 0.33 * s], [0.5 - 0.34 * s, 0.5], [0.5 - 0.28 * s, 0.5 - 0.34 * s]];
    k.poly(hull(1), DARKWOOD, { shadow: true });
    k.poly(hull(0.9), PALEWOOD, { vertical: true });
    k.poly(hull(0.72), wood('#7a4f2b'), { vertical: true });
    for (const y of [0.28, 0.52, 0.74]) k.rect(0.24, y, 0.52, 0.055, OAK, 0.04, { shadow: true });
    for (const side of [-1, 1]) {
      const x = 0.5 + side * 0.18;
      k.stroke([[x, 0.34], [x + side * 0.22, 0.68]], '#b48a58', 0.04);
      k.oval(x + side * 0.24, 0.72, 0.065, 0.075, PALEWOOD, { turn: -side * 0.55, shadow: true });
    }
    for (const y of [0.07, 0.93]) k.stud(0.5, y, 0.035, '#9aa3ad');
  },
  signpost: (k) => {
    k.disc(0.5, 0.5, 0.24, DARKSTONE, { shadow: true });
    const board = (y: number, dir: number) => {
      const p = (x: number, dy: number): Pt => [0.5 + dir * x, y + dy];
      k.poly([p(-0.3, -0.1), p(0.3, -0.1), p(0.46, 0), p(0.3, 0.1), p(-0.3, 0.1)], PALEWOOD, { shadow: true, vertical: false });
      for (const dy of [-0.032, 0.035]) k.stroke([p(-0.2, dy), p(0.22, dy)], '#4a2d19', 0.025, false);
      k.stud(0.5 - dir * 0.24, y, 0.025, '#6a737f');
    };
    board(0.28, 1);
    board(0.74, -1);
    k.disc(0.5, 0.5, 0.11, DARKWOOD, { shadow: true });
    k.ring(0.5, 0.5, 0.06, '#c99a60', 0.022);
  },

  // ---------- Nature ----------
  tree_oak: (k) => tree(k, ['#234a1c', '#366824', '#4d852e', '#6aa23c', '#8cbc4c']),
  tree_autumn: (k) => tree(k, ['#6e2a10', '#a8421a', '#d0661e', '#e8942a', '#f4be3c']),
  tree_cherry: (k) => tree(k, ['#8c3a5c', '#c05a82', '#e283a6', '#f4aac4', '#ffd6e4'], '#fff2f7'),
  tree_pine: (k) => {
    [[0.48, '#143a24'], [0.39, '#1d4c2c'], [0.3, '#286038'], [0.21, '#367646'], [0.12, '#4a9056']].forEach(([r, c], layer) => {
      const spikes = 13 - layer;
      const points: Pt[] = Array.from({ length: spikes * 2 }, (_, i) =>
        at((i / (spikes * 2)) * TAU + layer * 0.35, (r as number) * (i % 2 ? 0.62 : 1))
      );
      k.poly(points, straw(c as string), { shadow: true });
      around(spikes, (r as number) * 0.9, (x, y) => k.stroke([[0.5, 0.5], [x, y]], 'rgba(190,230,180,0.28)', 0.007, false), layer * 0.35);
    });
    k.stud(0.5, 0.5, 0.025, '#8a6a3c');
  },
  tree_dead: (k) => {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + k.between(-0.2, 0.2);
      const mid = at(a + k.between(-0.3, 0.3), k.between(0.2, 0.28));
      const end = at(a, k.between(0.38, 0.48));
      k.stroke([[0.5, 0.5], mid, end], '#6a5440', 0.045, true);
      for (const side of [-1, 1]) {
        k.stroke([mid, [mid[0] + Math.cos(a + side * 0.9) * 0.13, mid[1] + Math.sin(a + side * 0.9) * 0.13]], '#7a634c', 0.018);
      }
    }
    k.lump(0.5, 0.5, 0.14, wood('#7a604a'), 11, 0.28, { shadow: true });
    k.disc(0.5, 0.5, 0.065, plain('#2a1c10'));
  },
  tree_palm: (k) => {
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * TAU + k.between(-0.15, 0.15);
      const spine: Pt[] = [[0.5, 0.5], at(a + 0.12, 0.27), at(a + 0.02, 0.48)];
      for (let j = 1; j < 11; j++) {
        const t = j / 11;
        const from = at(a + 0.12 * Math.sin(t * Math.PI), t * 0.48);
        for (const side of [-1, 1]) {
          const len = 0.15 * Math.sin(t * Math.PI) + 0.025;
          k.stroke([from, [from[0] + Math.cos(a + side * 0.85) * len, from[1] + Math.sin(a + side * 0.85) * len]], i % 2 ? '#3f8a30' : '#57a53c', 0.026);
        }
      }
      k.stroke(spine, '#a8c850', 0.016, false, true);
    }
    for (const [x, y] of [[0.45, 0.46], [0.56, 0.48], [0.49, 0.57]]) k.disc(x, y, 0.07, wood('#7a4a20'), { shadow: true });
  },
  bush: (k) => {
    k.disc(0.5, 0.52, 0.4, plain('rgba(8,22,6,0.4)'), { edge: false });
    k.foliage(0.5, 0.5, 0.37, ['#24501e', '#3a6e28', '#548c34', '#74a842'], 150, 0.075);
    for (let i = 0; i < 9; i++) k.stud(k.between(0.22, 0.78), k.between(0.22, 0.78), 0.028, '#c8304a');
  },
  flower_bed: (k) => {
    k.lump(0.5, 0.5, 0.48, stone('#4c3620'), 16, 0.08, { shadow: true });
    k.foliage(0.5, 0.5, 0.38, ['#2f5c22', '#4a8230', '#639c3c'], 110, 0.062);
    for (let i = 0; i < 16; i++) {
      const [x, y] = at(k.between(0, TAU), Math.sqrt(k.rand()) * 0.37);
      const color = k.pick(['#e8384c', '#f4c61e', '#f2f0ea', '#a45ad0', '#4f8fe0', '#f47a2a']);
      for (let p = 0; p < 6; p++) k.dot(x + Math.cos(p * 1.047) * 0.034, y + Math.sin(p * 1.047) * 0.034, 0.025, color);
      k.stud(x, y, 0.019, '#ffd83c');
    }
  },
  mushroom_giant: (k) => {
    k.disc(0.52, 0.53, 0.47, plain('rgba(10,4,2,0.4)'), { edge: false });
    k.disc(0.5, 0.5, 0.45, stone('#c8302a'), { shadow: true });
    k.ring(0.5, 0.5, 0.41, '#f0c8a8', 0.018);
    k.disc(0.46, 0.46, 0.28, stone('#de4636'), { edge: false });
    k.glow(0.38, 0.36, 0.2, '#ffc8b0', 0.7);
    for (const [x, y, r] of [[0.34, 0.3, 0.085], [0.64, 0.28, 0.06], [0.72, 0.55, 0.095], [0.46, 0.55, 0.07], [0.3, 0.66, 0.062], [0.56, 0.76, 0.055], [0.18, 0.48, 0.04]]) {
      k.lump(x, y, r, plain('#f6efe0'), 9, 0.18, { shadow: true });
    }
    for (const [x, y, r] of [[0.1, 0.86, 0.1], [0.88, 0.84, 0.075]]) {
      k.disc(x, y, r, stone('#c8302a'), { shadow: true });
      k.dot(x - r * 0.25, y - r * 0.2, r * 0.25, '#f6efe0');
    }
  },
  lily_pads: (k) => {
    for (const [x, y, r, turn] of [[0.3, 0.32, 0.25, 0.4], [0.7, 0.38, 0.19, 2.4], [0.46, 0.72, 0.23, 4.4], [0.82, 0.76, 0.13, 1.2]]) {
      k.ring(x, y, r * 1.14, 'rgba(180,225,235,0.4)', 0.012);
      const points: Pt[] = [[x, y], ...Array.from({ length: 22 }, (_, i): Pt => {
        const a = turn + 0.35 + (i / 21) * (TAU - 0.7);
        return [x + Math.cos(a) * r, y + Math.sin(a) * r];
      })];
      k.poly(points, cloth('#3f8a34'), { shadow: true });
      for (let i = 1; i < 7; i++) {
        const a = turn + (i / 7) * TAU;
        k.stroke([[x, y], [x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82]], 'rgba(200,235,140,0.55)', 0.008, false);
      }
    }
    for (let p = 0; p < 8; p++) k.oval(0.34 + Math.cos(p * 0.785) * 0.065, 0.28 + Math.sin(p * 0.785) * 0.065, 0.058, 0.028, plain('#f6a8c4'), { turn: p * 0.785 });
    k.stud(0.34, 0.28, 0.04, '#ffd83c');
  },
  fallen_log: (k) => {
    k.stroke([[0.34, 0.4], [0.28, 0.08]], '#5c3a1e', 0.14);
    k.stroke([[0.64, 0.64], [0.74, 0.95]], '#5c3a1e', 0.11);
    k.rect(0.06, 0.24, 0.86, 0.52, wood('#6a4424'), 0.26, { shadow: true, vertical: false });
    for (let i = 0; i < 8; i++) k.stroke([[0.12 + i * 0.1, k.between(0.3, 0.44)], [0.18 + i * 0.1, k.between(0.55, 0.7)]], 'rgba(30,16,6,0.6)', 0.028, false);
    k.oval(0.91, 0.5, 0.07, 0.26, PALEWOOD, { shadow: true });
    for (const s of [0.65, 0.3]) k.oval(0.91, 0.5, 0.07 * s, 0.26 * s, wood('#9a7044'));
    k.foliage(0.34, 0.36, 0.16, ['#3a6e28', '#6a9c3a'], 22, 0.075);
    for (const [x, y] of [[0.55, 0.3], [0.61, 0.36]]) {
      k.stud(x, y, 0.09, '#e8c8a0');
    }
  },
  cactus: (k) => {
    const pad = (x: number, y: number, r: number) => {
      const points: Pt[] = Array.from({ length: 18 }, (_, i) => [x + Math.cos((i / 18) * TAU) * r * (i % 2 ? 0.86 : 1), y + Math.sin((i / 18) * TAU) * r * (i % 2 ? 0.86 : 1)]);
      k.poly(points, cloth('#3f8a42'), { shadow: true });
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * TAU;
        k.stroke([[x, y], [x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8]], 'rgba(20,70,28,0.65)', 0.016, false);
        const [sx, sy] = [x + Math.cos(a) * r * 0.68, y + Math.sin(a) * r * 0.68];
        k.stroke([[sx - 0.018, sy - 0.018], [sx + 0.018, sy + 0.018]], '#f4eecb', 0.007, false);
        k.stroke([[sx + 0.018, sy - 0.018], [sx - 0.018, sy + 0.018]], '#f4eecb', 0.007, false);
      }
    };
    pad(0.18, 0.56, 0.17);
    pad(0.82, 0.4, 0.16);
    pad(0.5, 0.5, 0.31);
    for (let p = 0; p < 6; p++) k.dot(0.5 + Math.cos(p * 1.047) * 0.065, 0.46 + Math.sin(p * 1.047) * 0.065, 0.05, '#f0508c');
    k.stud(0.5, 0.46, 0.045, '#ffd83c');
  },
  rock: (k) => {
    k.lump(0.5, 0.5, 0.48, stone('#6e6a62'), 11, 0.14, { shadow: true });
    k.poly([[0.24, 0.3], [0.52, 0.14], [0.76, 0.32], [0.6, 0.56], [0.34, 0.52]], stone('#928e84'), { shadow: true });
    k.stroke([[0.6, 0.56], [0.72, 0.74], [0.7, 0.86]], '#3a362f', 0.018, false);
    for (let i = 0; i < 42; i++) k.dot(k.between(0.2, 0.5), k.between(0.52, 0.82), k.between(0.016, 0.042), k.pick(['rgba(74,112,40,0.85)', 'rgba(108,142,52,0.85)']));
  },
  stump: (k) => {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + 0.3;
      k.stroke([at(a, 0.25), at(a + 0.18, 0.47)], '#5c3a1e', 0.09);
    }
    k.lump(0.5, 0.5, 0.36, wood('#5c3a1e'), 14, 0.08, { shadow: true });
    k.disc(0.5, 0.5, 0.28, PALEWOOD);
    for (const r of [0.22, 0.16, 0.1, 0.04]) k.ring(0.5, 0.51, r, 'rgba(106,66,28,0.75)', 0.014);
    k.stroke([[0.5, 0.5], [0.66, 0.3]], '#5c3a1e', 0.016, false);
    k.foliage(0.24, 0.7, 0.09, ['#3a6e28', '#6a9c3a'], 12, 0.05);
  },

  // ---------- Lights ----------
  brazier: (k) => brazierBowl(k, '#ff8c2e', ['#e8481a', '#ff9a1f', '#ffd84d', '#fff6c4']),
  brazier_teal: (k) => brazierBowl(k, '#38bdf8', ['#0b6fb8', '#26b0f0', '#7fe4ff', '#eefcff']),
  torch_wall: (k) => {
    k.glow(0.5, 0.46, 0.55, '#ffae42', 0.85);
    k.rect(0.28, 0.76, 0.44, 0.2, IRON, 0.08, { shadow: true });
    k.stroke([[0.5, 0.86], [0.5, 0.48]], '#6a4222', 0.16);
    k.ring(0.5, 0.5, 0.17, '#2c323b', 0.07);
    k.flame(0.5, 0.42, 0.25);
    for (const x of [0.35, 0.65]) k.stud(x, 0.86, 0.045, '#aeb8c4');
  },
  candle_cluster: (k) => {
    k.disc(0.5, 0.52, 0.44, metal('#a8842f'), { shadow: true });
    k.ring(0.5, 0.52, 0.36, '#e8c860', 0.03);
    candle(k, 0.36, 0.4, 0.15);
    candle(k, 0.67, 0.46, 0.12);
    candle(k, 0.46, 0.7, 0.13);
  },
  candelabra: (k) => {
    k.glow(0.5, 0.5, 0.55, '#ffc66e', 0.45);
    around(5, 0.34, (x, y, a) => {
      k.stroke([[0.5, 0.5], at(a + 0.35, 0.2), [x, y]], '#d0a53f', 0.055, true, true);
    }, -1.57);
    k.disc(0.5, 0.5, 0.14, GOLD, { shadow: true });
    around(5, 0.34, (x, y) => {
      k.disc(x, y, 0.1, GOLD, { shadow: true });
      candle(k, x, y, 0.062);
    }, -1.57);
    k.stud(0.5, 0.5, 0.055, '#d8344a');
  },
  chandelier_gold: (k) => {
    k.glow(0.5, 0.5, 0.55, '#ffd58a', 0.5);
    for (const r of [0.38, 0.2]) {
      k.ring(0.5, 0.5, r, '#3a2808', 0.05);
      k.ring(0.5, 0.5, r, '#d0a53f', 0.032);
      k.ring(0.5, 0.5, r - 0.008, '#fff0a8', 0.006);
    }
    around(8, 0.38, (_x, _y, a) => k.stroke([[0.5, 0.5], at(a, 0.38)], '#b8912f', 0.022));
    around(16, 0.29, (x, y) => {
      k.poly([[x, y - 0.028], [x + 0.018, y], [x, y + 0.028], [x - 0.018, y]], liquid('#cfeefa'), { shadow: true });
    }, 0.2);
    around(8, 0.41, (x, y) => {
      k.disc(x, y, 0.055, GOLD, { shadow: true });
      candle(k, x, y, 0.033);
    });
    k.disc(0.5, 0.5, 0.085, GOLD, { shadow: true });
    k.stud(0.5, 0.5, 0.045, '#3fa7d6');
  },
  lantern: (k) => {
    k.glow(0.5, 0.52, 0.56, '#ffc46b', 0.85);
    k.ring(0.5, 0.16, 0.12, '#23272e', 0.07);
    k.rect(0.22, 0.24, 0.56, 0.6, IRON, 0.1, { shadow: true });
    k.rect(0.29, 0.31, 0.42, 0.46, liquid('#ffc23c'), 0.06);
    k.glow(0.5, 0.54, 0.22, '#fff6c8', 1);
    k.flame(0.5, 0.54, 0.11, ['#ff9a1f', '#ffd84d', '#fffbe0']);
    k.stroke([[0.5, 0.31], [0.5, 0.77]], '#2c323b', 0.028, false);
    k.stroke([[0.29, 0.54], [0.71, 0.54]], '#2c323b', 0.028, false);
    for (const x of [0.25, 0.75]) for (const y of [0.27, 0.81]) k.stud(x, y, 0.045, '#aeb8c4');
  },
  crystal_lamp: (k) => {
    k.glow(0.5, 0.5, 0.56, '#c084fc', 0.85);
    k.disc(0.5, 0.5, 0.34, metal('#4a3f66'), { shadow: true });
    around(4, 0.34, (x, y) => k.disc(x, y, 0.085, COPPER, { shadow: true }), 0.78);
    k.disc(0.5, 0.5, 0.23, liquid('#7a28c8'));
    k.poly([[0.5, 0.24], [0.66, 0.5], [0.5, 0.76], [0.34, 0.5]], liquid('#c46af4'), { shadow: true });
    k.poly([[0.5, 0.24], [0.5, 0.76], [0.34, 0.5]], liquid('#e4b0ff'), { edge: false });
    k.glow(0.5, 0.5, 0.17, '#fdf0ff', 0.95);
    around(4, 0.34, (x, y) => k.stud(x, y, 0.035, '#e8c8ff'), 0.78);
  },
};
