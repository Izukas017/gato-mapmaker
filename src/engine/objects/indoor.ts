// Tavern, shop, rugs, temple and dungeon.
import {
  cloth, COPPER, DARKSTONE, DARKWOOD, GOLD, gold, GRANITE, IRON, type Kit, LINEN, liquid, MARBLE,
  metal, OAK, PALEWOOD, type Painter, plain, STEEL, stone, straw, WATER, wood,
} from './kit';

const TAU = Math.PI * 2;
const around = (count: number, radius: number, draw: (x: number, y: number, a: number, i: number) => void) => {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU;
    draw(0.5 + Math.cos(a) * radius, 0.5 + Math.sin(a) * radius, a, i);
  }
};

function bottle(k: Kit, x: number, y: number, r: number, color: string) {
  k.disc(x, y, r, liquid(color), { shadow: true });
  k.disc(x, y, r * 0.42, plain('#d9c9a0'));
  k.dot(x - 0.008, y - 0.015, r * 0.18, 'rgba(255,255,255,0.85)');
}

function stall(k: Kit, color: string) {
  for (const x of [0.05, 0.95]) for (const y of [0.08, 0.92]) k.disc(x, y, 0.065, DARKWOOD, { shadow: true });
  k.rect(0.06, 0.66, 0.88, 0.28, OAK, 0.04, { shadow: true });
  for (let i = 0; i < 18; i++) {
    k.stud(0.11 + i * 0.046, k.between(0.74, 0.88), 0.045, k.pick(['#c8302c', '#e8a01c', '#7fa82c', '#8d52c4']));
  }
  for (let i = 0; i < 8; i++) {
    const x = 0.04 + i * 0.115;
    k.poly([[x, 0.06], [x + 0.115, 0.06], [x + 0.115, 0.62], [x + 0.057, 0.72], [x, 0.62]], cloth(i % 2 ? '#f1e8d2' : color), { shadow: true });
  }
  k.rect(0.03, 0.03, 0.94, 0.07, DARKWOOD, 0.04, { shadow: true });
  k.stroke([[0.05, 0.34], [0.95, 0.34]], 'rgba(255,255,255,0.35)', 0.02, false);
}

function rug(k: Kit, main: string, deep: string) {
  for (let i = 0; i < 22; i++) {
    const x = 0.05 + i * 0.0428;
    k.stroke([[x, 0.07], [x + k.between(-0.006, 0.006), 0.005]], '#e8d9ac', 0.012, false);
    k.stroke([[x, 0.93], [x + k.between(-0.006, 0.006), 0.995]], '#e8d9ac', 0.012, false);
  }
  k.rect(0.025, 0.05, 0.95, 0.9, cloth(deep), 0.02);
  k.rect(0.06, 0.1, 0.88, 0.8, cloth('#d6b564'), 0.015, { edge: false });
  k.rect(0.08, 0.13, 0.84, 0.74, cloth(deep), 0.015, { edge: false });
  for (let i = 0; i < 11; i++) {
    const x = 0.12 + i * 0.076;
    for (const y of [0.165, 0.835]) k.poly([[x, y - 0.022], [x + 0.016, y], [x, y + 0.022], [x - 0.016, y]], cloth('#d6b564'), { edge: false });
  }
  k.rect(0.12, 0.21, 0.76, 0.58, cloth(main), 0.02);
  k.poly([[0.5, 0.25], [0.78, 0.5], [0.5, 0.75], [0.22, 0.5]], cloth('#d6b564'));
  k.poly([[0.5, 0.31], [0.71, 0.5], [0.5, 0.69], [0.29, 0.5]], cloth(deep));
  around(8, 0.13, (x, y) => k.dot(x, y, 0.028, '#e8cf8a'));
  k.disc(0.5, 0.5, 0.075, cloth(main));
  k.stud(0.5, 0.5, 0.028, '#f2dc9a');
  for (const x of [0.18, 0.82]) for (const y of [0.29, 0.71]) {
    k.poly([[x, y - 0.06], [x + 0.045, y], [x, y + 0.06], [x - 0.045, y]], cloth('#d6b564'));
  }
}

function barrelEnd(k: Kit, x: number, y: number, r: number) {
  k.disc(x, y, r, OAK, { shadow: true });
  k.ring(x, y, r * 0.88, '#3d3a36', r * 0.13);
  k.ring(x, y, r * 0.55, '#3d3a36', r * 0.07);
  k.stud(x, y, r * 0.14, '#c8a24a');
}

function skull(k: Kit, x: number, y: number, r: number) {
  k.disc(x, y, r, stone('#e4dcc6'), { shadow: true });
  for (const side of [-1, 1]) k.dot(x + side * r * 0.35, y - r * 0.1, r * 0.24, '#1c140c');
  k.dot(x, y + r * 0.35, r * 0.13, '#1c140c');
}

function sarcophagus(k: Kit, shell: typeof GRANITE, lid: typeof GRANITE, gem: string) {
  const outline: [number, number][] = [[0.22, 0.02], [0.78, 0.02], [0.97, 0.24], [0.82, 0.98], [0.18, 0.98], [0.03, 0.24]];
  k.poly(outline, shell, { shadow: true });
  k.poly(outline.map(([x, y]) => [0.5 + (x - 0.5) * 0.76, 0.5 + (y - 0.5) * 0.87] as [number, number]), lid, { shadow: true });
  k.disc(0.5, 0.2, 0.15, shell, { shadow: true });
  for (const x of [0.45, 0.55]) k.dot(x, 0.19, 0.022, '#241c14');
  k.rect(0.34, 0.31, 0.32, 0.44, shell, 0.18, { shadow: true });
  for (const side of [-1, 1]) k.stroke([[0.5 + side * 0.17, 0.4], [0.5, 0.48]], shell.c, 0.07);
  k.stroke([[0.5, 0.45], [0.5, 0.88]], '#b8c2cf', 0.045);
  k.stroke([[0.39, 0.52], [0.61, 0.52]], '#c8a24a', 0.045);
  k.stud(0.5, 0.45, 0.05, gem);
}

function columnBase(k: Kit) {
  k.rect(0.04, 0.04, 0.92, 0.92, stone('#b9b3a6'), 0.08, { shadow: true });
  k.rect(0.1, 0.1, 0.8, 0.8, MARBLE, 0.06);
}

export const INDOOR: Record<string, Painter> = {
  bar_counter: (k) => {
    k.rect(0.01, 0.12, 0.98, 0.76, DARKWOOD, 0.1, { shadow: true });
    k.rect(0.03, 0.2, 0.94, 0.56, wood('#9a6a3c'), 0.06, { vertical: false });
    k.stroke([[0.04, 0.82], [0.96, 0.82]], '#d0a53f', 0.05);
    for (const x of [0.12, 0.2, 0.27]) bottle(k, x, 0.38, 0.12, k.pick(['#2f6b45', '#8f2b34', '#8c6a28']));
    for (const x of [0.46, 0.58]) {
      k.disc(x, 0.52, 0.12, metal('#8f9aa8'), { shadow: true });
      k.dot(x, 0.52, 0.075, '#e0a02c');
      k.dot(x - 0.004, 0.49, 0.035, '#fff4d0');
    }
    k.rect(0.7, 0.28, 0.14, 0.4, cloth('#cfc3a4'), 0.08, { turn: 0.2, shadow: true });
    barrelEnd(k, 0.91, 0.48, 0.2);
  },
  keg_giant: (k) => {
    for (const y of [0.14, 0.72]) k.rect(0.02, y, 0.96, 0.12, DARKWOOD, 0.08, { shadow: true });
    k.oval(0.5, 0.48, 0.42, 0.46, wood('#8a5528'), { shadow: true, vertical: true });
    for (const x of [0.22, 0.36, 0.5, 0.64, 0.78]) k.stroke([[x, 0.08], [x + (x - 0.5) * 0.24, 0.48], [x, 0.88]], 'rgba(45,22,6,0.65)', 0.012, false, true);
    for (const y of [0.14, 0.28, 0.68, 0.82]) k.rect(0.12 + Math.abs(y - 0.48) * 0.18, y - 0.025, 0.76 - Math.abs(y - 0.48) * 0.36, 0.05, IRON, 0.04, { shadow: true });
    k.disc(0.5, 0.46, 0.1, DARKWOOD, { shadow: true });
    k.rect(0.45, 0.86, 0.1, 0.12, COPPER, 0.04, { shadow: true });
    k.stud(0.5, 0.9, 0.07, '#e2c06a');
  },
  table_feast: (k) => {
    k.rect(0.01, 0.04, 0.98, 0.92, DARKWOOD, 0.12, { shadow: true });
    k.rect(0.04, 0.1, 0.92, 0.8, cloth('#8f2b34'), 0.08);
    k.stroke([[0.06, 0.16], [0.94, 0.16]], '#d6b564', 0.025, false);
    k.stroke([[0.06, 0.84], [0.94, 0.84]], '#d6b564', 0.025, false);
    k.oval(0.5, 0.5, 0.15, 0.24, STEEL, { shadow: true });
    k.oval(0.5, 0.5, 0.1, 0.16, wood('#a34f1e'), { shadow: true });
    for (const x of [0.4, 0.6]) k.stroke([[x, 0.5], [x + (x - 0.5) * 0.4, 0.4]], '#e8dcc0', 0.04);
    for (const x of [0.14, 0.86]) {
      k.disc(x, 0.5, 0.2, STEEL, { shadow: true });
      for (let i = 0; i < 7; i++) k.stud(x + k.between(-0.04, 0.04), 0.5 + k.between(-0.1, 0.1), 0.05, k.pick(['#c8302c', '#7a3a8c', '#e8a01c']));
    }
    for (const x of [0.27, 0.73]) {
      k.disc(x, 0.3, 0.1, wood('#c98c3c'), { shadow: true });
      bottle(k, x, 0.7, 0.09, '#6a1f2c');
    }
  },
  kitchen_stove: (k) => {
    k.rect(0.01, 0.03, 0.98, 0.94, DARKSTONE, 0.1, { shadow: true });
    k.rect(0.04, 0.1, 0.92, 0.8, IRON, 0.07);
    for (const x of [0.2, 0.46]) {
      k.disc(x, 0.5, 0.28, plain('#15100e'));
      k.glow(x, 0.5, 0.32, '#ff7a1f', 0.9);
      k.flame(x, 0.5, 0.15);
      k.ring(x, 0.5, 0.25, '#2c323b', 0.05);
      for (const a of [0, Math.PI / 2]) k.stroke([[x - Math.cos(a) * 0.12, 0.5 - Math.sin(a) * 0.22], [x + Math.cos(a) * 0.12, 0.5 + Math.sin(a) * 0.22]], '#39404a', 0.035);
    }
    k.disc(0.76, 0.48, 0.3, COPPER, { shadow: true });
    k.disc(0.76, 0.48, 0.21, liquid('#b9702c'));
    k.stroke([[0.84, 0.62], [0.95, 0.82]], '#8a4a28', 0.08);
    for (const x of [0.1, 0.9]) k.stud(x, 0.88, 0.05, '#d0a53f');
  },
  roast_spit: (k) => {
    k.rect(0.12, 0.14, 0.76, 0.72, stone('#2a1c16'), 0.3);
    k.glow(0.5, 0.5, 0.62, '#ff8c2e', 0.9);
    for (const t of [0.3, -0.3]) k.rect(0.26, 0.44, 0.48, 0.12, DARKWOOD, 0.08, { turn: t });
    for (const x of [0.32, 0.5, 0.68]) k.flame(x, 0.52, 0.18);
    k.stroke([[0.04, 0.5], [0.96, 0.5]], '#aeb8c4', 0.035);
    k.oval(0.5, 0.5, 0.23, 0.17, wood('#a3521f'), { shadow: true, vertical: false });
    for (const x of [0.36, 0.46, 0.56, 0.66]) k.stroke([[x, 0.37], [x + 0.025, 0.63]], 'rgba(60,20,6,0.7)', 0.022, false);
    for (const side of [-1, 1]) k.stroke([[0.5 + side * 0.2, 0.44], [0.5 + side * 0.28, 0.34]], '#e8dcc0', 0.04);
    for (const x of [0.07, 0.93]) {
      k.stroke([[x, 0.2], [x, 0.8]], '#3a414c', 0.07);
      k.stud(x, 0.5, 0.075, '#79838f');
    }
  },
  cauldron_soup: (k) => {
    for (let i = 0; i < 8; i++) k.rect(0.45, 0.02, 0.1, 0.18, DARKWOOD, 0.06, { turn: 0 });
    k.glow(0.5, 0.5, 0.52, '#ff8c2e', 0.75);
    around(7, 0.42, (x, y, a) => k.rect(x - 0.1, y - 0.035, 0.2, 0.07, DARKWOOD, 0.05, { turn: a }));
    for (const x of [0.14, 0.86]) k.ring(x, 0.5, 0.09, '#2c323b', 0.045);
    k.disc(0.5, 0.5, 0.37, metal('#39404a'), { shadow: true });
    k.disc(0.5, 0.5, 0.28, liquid('#c4842c'));
    for (let i = 0; i < 12; i++) {
      k.disc(k.between(0.34, 0.66), k.between(0.34, 0.66), k.between(0.02, 0.05), plain(k.pick(['#e0652a', '#7fa82c', '#f0d9a0', '#8f4a28'])));
    }
    k.stroke([[0.56, 0.44], [0.88, 0.14]], '#b48a58', 0.05);
  },
  wine_rack: (k) => {
    k.rect(0.01, 0.03, 0.98, 0.94, DARKWOOD, 0.08, { shadow: true });
    for (let i = 0; i < 8; i++) {
      const x = 0.05 + i * 0.116;
      k.rect(x, 0.1, 0.1, 0.8, wood('#2c1a0d'), 0.03);
      k.rect(x + 0.022, 0.3, 0.056, 0.56, liquid(k.pick(['#2f5c34', '#5c1a26', '#2c3a5c'])), 0.1, { shadow: true });
      k.rect(x + 0.036, 0.12, 0.028, 0.2, plain('#d9c9a0'), 0.02);
      k.rect(x + 0.027, 0.5, 0.046, 0.18, LINEN, 0.02);
    }
  },

  // ---------- Shop ----------
  market_stall_red: (k) => stall(k, '#b02f36'),
  market_stall_blue: (k) => stall(k, '#2c62a8'),
  shop_counter: (k) => {
    k.rect(0.01, 0.1, 0.98, 0.8, DARKWOOD, 0.1, { shadow: true });
    k.rect(0.04, 0.18, 0.92, 0.62, OAK, 0.05, { vertical: false });
    k.rect(0.08, 0.28, 0.14, 0.42, cloth('#7a4a2c'), 0.1, { shadow: true });
    for (let i = 0; i < 9; i++) k.stud(k.between(0.27, 0.37), k.between(0.35, 0.65), 0.07, '#e8bd3c');
    k.stroke([[0.46, 0.5], [0.66, 0.5]], '#c8a24a', 0.04);
    for (const x of [0.46, 0.66]) {
      k.disc(x, 0.5, 0.16, GOLD, { shadow: true });
      k.ring(x, 0.5, 0.1, '#7a5614', 0.025);
    }
    k.stud(0.56, 0.5, 0.08, '#c8a24a');
    k.rect(0.76, 0.26, 0.17, 0.48, LINEN, 0.03, { turn: -0.15, shadow: true });
    for (let i = 0; i < 4; i++) k.stroke([[0.79, 0.36 + i * 0.09], [0.89, 0.34 + i * 0.09]], '#5b4a38', 0.022, false);
  },
  display_case: (k) => {
    k.rect(0.02, 0.04, 0.96, 0.92, GOLD, 0.1, { shadow: true });
    k.rect(0.07, 0.13, 0.86, 0.74, cloth('#3a1c46'), 0.07);
    ['#e84a5c', '#3fa7d6', '#44c47a', '#c06ae0'].forEach((c, i) => {
      const x = 0.18 + i * 0.215;
      k.ring(x, 0.36, 0.1, '#e8c860', 0.03);
      k.glow(x, 0.64, 0.16, c, 0.7);
      k.poly([[x, 0.53], [x + 0.045, 0.64], [x, 0.76], [x - 0.045, 0.64]], liquid(c), { shadow: true });
      k.dot(x - 0.012, 0.61, 0.02, '#ffffff');
    });
    k.stroke([[0.14, 0.8], [0.42, 0.18]], 'rgba(220,245,255,0.35)', 0.1, false);
    k.stroke([[0.34, 0.82], [0.56, 0.34]], 'rgba(220,245,255,0.25)', 0.04, false);
  },
  cloth_bolts: (k) => {
    k.rect(0.02, 0.04, 0.96, 0.92, DARKWOOD, 0.06, { shadow: true });
    ['#b02f36', '#2c62a8', '#2f7a4c', '#c98f24', '#6a3a8c'].forEach((c, i) => {
      const x = 0.07 + i * 0.176;
      k.rect(x, 0.09, 0.155, 0.76, cloth(c), 0.1, { shadow: true, vertical: true });
      for (const y of [0.22, 0.72]) k.stroke([[x + 0.01, y], [x + 0.145, y]], '#e8d9ac', 0.025, false);
      k.oval(x + 0.077, 0.1, 0.07, 0.05, cloth(c));
      k.ring(x + 0.077, 0.1, 0.035, '#5c3c22', 0.02);
    });
    k.poly([[0.07, 0.8], [0.23, 0.82], [0.2, 0.99], [0.03, 0.95]], cloth('#b02f36'), { shadow: true });
  },
  potion_shelf: (k) => {
    k.rect(0.01, 0.04, 0.98, 0.92, DARKWOOD, 0.1, { shadow: true });
    k.rect(0.04, 0.14, 0.92, 0.72, wood('#4a2e18'), 0.05);
    ['#e0384c', '#3fd06a', '#3f9ce0', '#c45ae0', '#f0b028', '#2fd0c4', '#e86a28'].forEach((c, i) => {
      const x = 0.1 + i * 0.133;
      const r = i % 2 ? 0.16 : 0.2;
      k.glow(x, 0.52, r * 1.5, c, 0.55);
      bottle(k, x, 0.52, r, c);
    });
  },

  // ---------- Rugs ----------
  rug_teal: (k) => rug(k, '#2f7d74', '#16403c'),
  rug_crimson: (k) => rug(k, '#8f2833', '#4c121c'),
  rug_emerald: (k) => rug(k, '#2c7a46', '#123c24'),
  rug_purple_royal: (k) => rug(k, '#663590', '#2f1648'),
  rug_round: (k) => {
    k.oval(0.5, 0.5, 0.49, 0.49, cloth('#2f4a74'));
    ['#d6b564', '#4a6a98', '#e8dcbc', '#2f4a74', '#6a8ab4'].forEach((c, i) => {
      const s = 0.42 - i * 0.078;
      k.oval(0.5, 0.5, s, s, cloth(c), { edge: false });
    });
    around(16, 0.43, (x, y) => k.dot(0.5 + (x - 0.5) * (k.W / k.m), y, 0.022, '#e8cf8a'));
    k.stud(0.5, 0.5, 0.04, '#d6b564');
  },
  rug_runner: (k) => {
    for (let i = 0; i < 12; i++) {
      const x = 0.1 + i * 0.073;
      k.stroke([[x, 0.03], [x, 0.002]], '#e8d9ac', 0.025, false);
      k.stroke([[x, 0.97], [x, 0.998]], '#e8d9ac', 0.025, false);
    }
    k.rect(0.06, 0.025, 0.88, 0.95, cloth('#174a45'), 0.02);
    k.rect(0.13, 0.05, 0.74, 0.9, cloth('#d6b564'), 0.015, { edge: false });
    k.rect(0.18, 0.065, 0.64, 0.87, cloth('#2f7d74'), 0.015);
    for (let i = 0; i < 5; i++) {
      const y = 0.15 + i * 0.175;
      k.poly([[0.5, y - 0.065], [0.76, y], [0.5, y + 0.065], [0.24, y]], cloth('#d6b564'));
      k.poly([[0.5, y - 0.038], [0.66, y], [0.5, y + 0.038], [0.34, y]], cloth('#174a45'));
      k.stud(0.5, y, 0.07, '#f2dc9a');
    }
  },
  rug_bear: (k) => {
    const fur = straw('#5c3a20');
    for (const [x, y, t] of [[0.18, 0.28, -0.8], [0.82, 0.28, 0.8], [0.17, 0.78, 0.8], [0.83, 0.78, -0.8]]) {
      k.oval(x, y, 0.1, 0.19, fur, { turn: t, shadow: true });
      const out = x < 0.5 ? -1 : 1;
      for (let c = -1; c <= 1; c++) k.stroke([[x + out * 0.1, y + (y < 0.5 ? -0.12 : 0.12) + c * 0.035], [x + out * 0.15, y + (y < 0.5 ? -0.15 : 0.15) + c * 0.045]], '#efe6cc', 0.016);
    }
    k.poly([[0.38, 0.22], [0.62, 0.22], [0.78, 0.4], [0.72, 0.58], [0.8, 0.74], [0.6, 0.86], [0.5, 0.94], [0.4, 0.86], [0.2, 0.74], [0.28, 0.58], [0.22, 0.4]], fur, { shadow: true });
    k.oval(0.5, 0.54, 0.15, 0.25, straw('#7a5230'), { edge: false });
    for (const x of [0.37, 0.63]) {
      k.disc(x, 0.09, 0.055, fur, { shadow: true });
      k.dot(x, 0.09, 0.026, '#b4855c');
    }
    k.oval(0.5, 0.17, 0.14, 0.12, fur, { shadow: true });
    k.oval(0.5, 0.09, 0.075, 0.065, straw('#a87e54'), { shadow: true });
    k.dot(0.5, 0.055, 0.028, '#140c06');
    for (const x of [0.44, 0.56]) k.stud(x, 0.15, 0.018, '#2a1608');
  },
  mat_straw: (k) => {
    k.rect(0.02, 0.04, 0.96, 0.92, straw('#a8842f'), 0.06);
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 9; col++) {
        const across = (row + col) % 2 === 0;
        k.rect(0.065 + col * 0.097, 0.1 + row * 0.134, 0.092, 0.128, straw(across ? '#d2ac4c' : '#bd9638'), 0.03, { vertical: !across });
      }
    }
    for (const y of [0.07, 0.93]) k.stroke([[0.05, y], [0.95, y]], '#6a4a18', 0.022, false);
  },

  // ---------- Temple ----------
  altar_gold: (k) => {
    k.disc(0.5, 0.5, 0.49, stone('#a59d8c'), { shadow: true });
    k.disc(0.5, 0.5, 0.41, MARBLE, { shadow: true });
    around(12, 0.45, (x, y) => k.stud(x, y, 0.022, '#d0a53f'));
    k.rect(0.2, 0.3, 0.6, 0.4, GOLD, 0.06, { shadow: true });
    k.rect(0.38, 0.28, 0.24, 0.44, cloth('#8f1f2e'), 0.02, { shadow: true });
    for (const y of [0.31, 0.69]) k.stroke([[0.39, y], [0.61, y]], '#e8c860', 0.018, false);
    k.glow(0.5, 0.5, 0.28, '#ffe27a', 0.8);
    k.disc(0.5, 0.5, 0.1, GOLD, { shadow: true });
    k.stud(0.5, 0.5, 0.05, '#ff5a3c');
    for (const x of [0.27, 0.73]) {
      k.glow(x, 0.5, 0.13, '#ffcf6b');
      k.stud(x, 0.5, 0.04, '#fff0c0');
    }
  },
  sarcophagus_stone: (k) => sarcophagus(k, GRANITE, stone('#a49f94'), '#6a9ab4'),
  sarcophagus_gold: (k) => sarcophagus(k, gold('#b8912f'), GOLD, '#2f8fd0'),
  statue_knight: (k) => {
    columnBase(k);
    k.poly([[0.28, 0.42], [0.72, 0.42], [0.8, 0.82], [0.2, 0.82]], cloth('#6f6a60'), { shadow: true });
    k.oval(0.5, 0.48, 0.3, 0.17, GRANITE, { shadow: true });
    for (const x of [0.26, 0.74]) k.disc(x, 0.47, 0.11, stone('#a9a499'), { shadow: true });
    k.disc(0.5, 0.42, 0.15, stone('#b4afa4'), { shadow: true });
    k.stroke([[0.39, 0.37], [0.61, 0.37]], '#2f2b25', 0.03, false);
    k.stroke([[0.5, 0.28], [0.5, 0.42]], '#6f6a60', 0.03, false);
    k.stroke([[0.78, 0.2], [0.78, 0.8]], '#c3bdb0', 0.055);
    k.stroke([[0.69, 0.66], [0.87, 0.66]], '#8f897d', 0.045);
    k.poly([[0.14, 0.5], [0.34, 0.52], [0.33, 0.68], [0.24, 0.78], [0.15, 0.68]], stone('#8f897d'), { shadow: true });
    k.stud(0.24, 0.62, 0.035, '#c8a24a');
  },
  statue_angel: (k) => {
    k.disc(0.5, 0.56, 0.4, stone('#b9b3a6'), { shadow: true });
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        k.oval(0.5 + side * (0.22 + i * 0.075), 0.42 + i * 0.1, 0.22 - i * 0.035, 0.085, MARBLE, { turn: side * (-0.45 + i * 0.38), shadow: true });
      }
      k.stroke([[0.5 + side * 0.14, 0.4], [0.5 + side * 0.42, 0.34]], 'rgba(120,110,90,0.6)', 0.018, false);
    }
    k.poly([[0.38, 0.46], [0.62, 0.46], [0.66, 0.86], [0.34, 0.86]], cloth('#d5cfc0'), { shadow: true });
    k.disc(0.5, 0.42, 0.13, MARBLE, { shadow: true });
    k.ring(0.5, 0.4, 0.18, '#e8c860', 0.025);
    for (const side of [-1, 1]) k.stroke([[0.5 + side * 0.13, 0.58], [0.5, 0.7]], '#d9d3c4', 0.055);
  },
  pillar_marble: (k) => {
    columnBase(k);
    k.disc(0.5, 0.5, 0.36, MARBLE, { shadow: true });
    around(14, 0.31, (x, y) => k.dot(x, y, 0.035, 'rgba(120,112,96,0.5)'));
    k.disc(0.5, 0.5, 0.25, stone('#ece7da'), { shadow: true });
    k.ring(0.5, 0.5, 0.17, '#c8a24a', 0.025);
    k.stroke([[0.36, 0.4], [0.46, 0.52], [0.58, 0.55], [0.66, 0.68]], 'rgba(130,126,130,0.6)', 0.012, false, true);
  },
  pillar_ruined: (k) => {
    k.rect(0.08, 0.08, 0.78, 0.78, stone('#a59f92'), 0.06, { shadow: true });
    k.lump(0.44, 0.44, 0.31, MARBLE, 13, 0.16, { shadow: true });
    k.lump(0.42, 0.4, 0.15, stone('#cfc9bc'), 8, 0.3, { shadow: true });
    k.stroke([[0.28, 0.32], [0.45, 0.48], [0.43, 0.66]], '#6a6457', 0.016, false);
    for (const [x, y, r] of [[0.8, 0.78, 0.15], [0.64, 0.87, 0.08], [0.88, 0.55, 0.07], [0.2, 0.86, 0.06]]) k.lump(x, y, r, MARBLE, 7, 0.3, { shadow: true });
    for (let i = 0; i < 18; i++) k.dot(k.between(0.1, 0.45), k.between(0.55, 0.85), k.between(0.012, 0.035), 'rgba(80,115,48,0.8)');
  },
  obelisk_runic: (k) => {
    k.rect(0.05, 0.05, 0.9, 0.9, stone('#46415a'), 0.08, { shadow: true });
    const tip: [number, number] = [0.5, 0.5];
    const corners: [number, number][] = [[0.16, 0.16], [0.84, 0.16], [0.84, 0.84], [0.16, 0.84]];
    ['#6a6484', '#524c6c', '#38334e', '#474060'].forEach((c, i) => k.poly([corners[i], corners[(i + 1) % 4], tip], stone(c)));
    k.glow(0.5, 0.5, 0.35, '#4de3e8', 0.9);
    for (const [x, y] of [[0.5, 0.26], [0.74, 0.5], [0.5, 0.74], [0.26, 0.5]]) {
      k.stroke([[x - 0.045, y - 0.03], [x, y + 0.04], [x + 0.045, y - 0.03]], '#a8fbff', 0.022, false);
      k.stroke([[x, y - 0.055], [x, y + 0.055]], '#a8fbff', 0.016, false);
    }
    k.stud(0.5, 0.5, 0.055, '#d9ffff');
  },
  well: (k) => {
    k.disc(0.5, 0.5, 0.47, DARKSTONE, { shadow: true });
    around(11, 0.375, (x, y) => k.lump(x, y, 0.12, GRANITE, 7, 0.13, { shadow: true }));
    k.disc(0.5, 0.5, 0.28, liquid('#16384c'));
    k.glow(0.42, 0.42, 0.18, '#8fd0e8', 0.5);
    k.stroke([[0.5, 0.06], [0.5, 0.52]], '#c9a869', 0.025);
    k.disc(0.5, 0.56, 0.085, OAK, { shadow: true });
    k.ring(0.5, 0.56, 0.055, '#3d3a36', 0.016);
  },
  pool_teal: (k) => {
    k.rect(0.02, 0.02, 0.96, 0.96, stone('#b3ab98'), 0.1, { shadow: true });
    for (let i = 0; i < 7; i++) {
      for (const x of [0.03, 0.87]) k.rect(x, 0.03 + i * 0.134, 0.1, 0.13, MARBLE, 0.03);
    }
    for (let i = 0; i < 4; i++) for (const y of [0.025, 0.895]) k.rect(0.135 + i * 0.183, y, 0.178, 0.08, MARBLE, 0.03);
    k.rect(0.15, 0.12, 0.7, 0.76, liquid('#2a9c94'), 0.06);
    k.rect(0.24, 0.2, 0.52, 0.6, liquid('#1d7a80'), 0.1, { edge: false });
    k.glow(0.5, 0.5, 0.42, '#8ffff0', 0.45);
    for (let i = 0; i < 3; i++) k.ring(0.5, 0.5, 0.08 + i * 0.07, 'rgba(220,255,250,0.5)', 0.008);
    for (const x of [0.12, 0.88]) for (const y of [0.09, 0.91]) k.stud(x, y, 0.035, '#d0a53f');
  },
  fountain: (k) => {
    k.disc(0.5, 0.5, 0.48, GRANITE, { shadow: true });
    around(16, 0.43, (x, y) => k.dot(x, y, 0.018, 'rgba(60,56,48,0.6)'));
    k.disc(0.5, 0.5, 0.39, WATER);
    for (const r of [0.31, 0.24]) k.ring(0.5, 0.5, r, 'rgba(230,250,255,0.6)', 0.012);
    k.disc(0.5, 0.5, 0.17, MARBLE, { shadow: true });
    k.disc(0.5, 0.5, 0.11, WATER);
    around(8, 0.22, (x, y, a) => {
      k.stroke([[0.5 + Math.cos(a) * 0.07, 0.5 + Math.sin(a) * 0.07], [x, y]], 'rgba(220,248,255,0.85)', 0.022, false);
      k.dot(x, y, 0.025, '#f2fdff');
    });
    k.stud(0.5, 0.5, 0.05, '#e8e2d4');
  },

  // ---------- Dungeon ----------
  iron_cage: (k) => {
    k.rect(0.05, 0.05, 0.9, 0.9, stone('#3a3226'), 0.05, { shadow: true });
    for (let i = 0; i < 20; i++) k.stroke([[k.between(0.15, 0.8), k.between(0.15, 0.8)], [k.between(0.15, 0.85), k.between(0.15, 0.85)]], '#b8963c', 0.008, false);
    skull(k, 0.32, 0.68, 0.08);
    for (let i = 1; i < 6; i++) {
      const p = 0.06 + i * 0.147;
      k.stroke([[p, 0.07], [p, 0.93]], '#5a626e', 0.028);
    }
    for (const y of [0.34, 0.66]) k.stroke([[0.07, y], [0.93, y]], '#49505b', 0.03);
    k.ctx.save();
    k.stroke([[0.06, 0.06], [0.94, 0.06], [0.94, 0.94], [0.06, 0.94], [0.06, 0.06]], '#6a737f', 0.055);
    k.ctx.restore();
    for (const x of [0.06, 0.94]) for (const y of [0.06, 0.94]) k.stud(x, y, 0.05, '#aeb8c4');
    k.rect(0.88, 0.43, 0.11, 0.14, GOLD, 0.03, { shadow: true });
    k.dot(0.935, 0.5, 0.018, '#241806');
  },
  skeleton_remains: (k) => {
    const bone = (points: [number, number][], w = 0.045) => {
      k.stroke(points, '#e4dcc6', w);
      for (const [x, y] of [points[0], points[points.length - 1]]) k.stud(x, y, w * 0.62, '#ece5d0');
    };
    k.lump(0.52, 0.55, 0.36, plain('rgba(74,20,14,0.35)'), 12, 0.35, { edge: false });
    bone([[0.5, 0.26], [0.53, 0.62]], 0.04);
    for (let i = 0; i < 4; i++) {
      const y = 0.31 + i * 0.065;
      for (const side of [-1, 1]) k.stroke([[0.51, y], [0.51 + side * 0.17, y + 0.01], [0.51 + side * 0.15, y + 0.06]], '#d9d0b8', 0.025, true, true);
    }
    bone([[0.42, 0.26], [0.2, 0.36], [0.14, 0.56]]);
    bone([[0.6, 0.26], [0.82, 0.22], [0.86, 0.07]]);
    k.oval(0.53, 0.66, 0.13, 0.065, stone('#d6cdb4'), { shadow: true });
    bone([[0.46, 0.7], [0.3, 0.83], [0.34, 0.96]], 0.055);
    bone([[0.6, 0.7], [0.72, 0.84], [0.62, 0.95]], 0.055);
    skull(k, 0.46, 0.14, 0.14);
    k.stroke([[0.82, 0.45], [0.7, 0.8]], '#8f6a4a', 0.04);
    k.poly([[0.82, 0.45], [0.92, 0.22], [0.86, 0.46]], metal('#8a7a6a'), { shadow: true });
  },
  spike_trap: (k) => {
    k.rect(0.02, 0.02, 0.96, 0.96, DARKSTONE, 0.06, { shadow: true });
    k.rect(0.1, 0.1, 0.8, 0.8, stone('#24211e'), 0.04);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const x = 0.2 + col * 0.2;
        const y = 0.2 + row * 0.2;
        k.disc(x, y, 0.065, plain('#0e0b09'));
        k.poly([[x - 0.05, y + 0.02], [x + 0.012, y - 0.1], [x + 0.045, y + 0.035]], STEEL, { shadow: true });
        if ((row * 3 + col) % 5 === 0) k.dot(x + 0.01, y - 0.075, 0.018, '#8f1418');
      }
    }
    for (const x of [0.06, 0.94]) for (const y of [0.06, 0.94]) k.stud(x, y, 0.022, '#79838f');
  },
  pit_dark: (k) => {
    k.lump(0.5, 0.5, 0.48, GRANITE, 16, 0.07, { shadow: true });
    k.lump(0.5, 0.5, 0.39, stone('#3a352f'), 15, 0.1);
    k.lump(0.5, 0.5, 0.31, plain('#17120e'), 14, 0.12, { edge: false });
    k.glow(0.5, 0.5, 0.34, '#000000', 1);
    k.lump(0.52, 0.53, 0.19, plain('#050303'), 12, 0.15, { edge: false });
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * TAU;
      k.stroke([[0.5 + Math.cos(a) * 0.46, 0.5 + Math.sin(a) * 0.46], [0.5 + Math.cos(a + 0.12) * 0.36, 0.5 + Math.sin(a + 0.12) * 0.36]], '#2a2620', 0.012, false);
    }
    for (const x of [0.4, 0.46]) k.dot(x, 0.46, 0.012, '#ff3b2a');
  },
  guillotine_rack: (k) => {
    k.rect(0.12, 0.08, 0.76, 0.84, DARKWOOD, 0.06, { shadow: true });
    k.boards(0.19, 0.13, 0.62, 0.74, OAK, 5);
    for (const y of [0.08, 0.84]) {
      k.rect(0.03, y, 0.94, 0.08, wood('#4a2d19'), 0.1, { shadow: true, vertical: false });
      for (const x of [0.06, 0.94]) k.stud(x, y + 0.04, 0.055, '#79838f');
    }
    for (const x of [0.32, 0.68]) {
      for (const y of [0.18, 0.8]) {
        k.stroke([[x, y], [x + (x - 0.5) * 0.25, y < 0.5 ? 0.12 : 0.88]], '#c9a869', 0.028);
        k.ring(x, y, 0.085, '#2a2e36', 0.055);
        k.ring(x, y, 0.085, '#9aa3ad', 0.025);
      }
    }
    k.dot(0.45, 0.5, 0.1, 'rgba(110,10,12,0.7)');
    k.dot(0.56, 0.58, 0.05, 'rgba(110,10,12,0.6)');
  },
  chains_shackles: (k) => {
    const chain: [number, number][] = [[0.16, 0.24], [0.26, 0.38], [0.4, 0.4], [0.5, 0.52], [0.46, 0.66], [0.56, 0.76], [0.72, 0.7], [0.82, 0.58]];
    k.disc(0.5, 0.2, 0.11, IRON, { shadow: true });
    k.ring(0.5, 0.2, 0.065, '#aeb8c4', 0.03);
    k.stroke([[0.5, 0.2], [0.4, 0.4]], '#5a626e', 0.03);
    chain.forEach(([x, y], i) => {
      const [nx, ny] = chain[Math.min(i + 1, chain.length - 1)];
      for (const t of [0, 0.5]) {
        const cx = x + (nx - x) * t;
        const cy = y + (ny - y) * t;
        k.ring(cx, cy, 0.05, '#171b22', 0.04);
        k.ring(cx, cy, 0.05, '#9aa6b5', 0.018);
      }
    });
    for (const [x, y] of [[0.16, 0.24], [0.82, 0.56]]) {
      k.ring(x, y, 0.14, '#171b22', 0.095);
      k.ring(x, y, 0.14, '#6b7686', 0.06);
      k.stud(x, y - 0.17, 0.04, '#c3ccd8');
    }
  },
  rubble_pile: (k) => {
    for (let i = 0; i < 26; i++) k.dot(k.between(0.05, 0.95), k.between(0.1, 0.92), k.between(0.015, 0.04), 'rgba(90,82,70,0.75)');
    for (const [x, y, r] of [[0.28, 0.35, 0.2], [0.64, 0.3, 0.17], [0.4, 0.66, 0.22], [0.72, 0.64, 0.18], [0.5, 0.46, 0.23], [0.16, 0.66, 0.11], [0.86, 0.42, 0.1], [0.55, 0.84, 0.09]]) {
      k.lump(x, y, r, stone(k.pick(['#8b877e', '#746f66', '#9a958a'])), 8, 0.3, { shadow: true });
    }
    k.rect(0.2, 0.46, 0.55, 0.07, DARKWOOD, 0.03, { turn: -0.5, shadow: true });
    k.lump(0.62, 0.52, 0.09, stone('#a59f92'), 7, 0.3, { shadow: true });
  },
  spider_web: (k) => {
    const spokes = 11;
    const tips: [number, number][] = Array.from({ length: spokes }, (_, i) => {
      const a = (i / spokes) * TAU + k.between(-0.12, 0.12);
      return [0.5 + Math.cos(a) * 0.48, 0.5 + Math.sin(a) * 0.48];
    });
    for (const tip of tips) k.stroke([[0.5, 0.5], tip], 'rgba(238,244,250,0.75)', 0.007, false);
    for (let ring = 1; ring <= 7; ring++) {
      const f = ring / 7.4;
      for (let i = 0; i < spokes; i++) {
        const a = tips[i];
        const b = tips[(i + 1) % spokes];
        const at = (p: [number, number], s: number): [number, number] => [0.5 + (p[0] - 0.5) * s, 0.5 + (p[1] - 0.5) * s];
        const midpoint: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        k.stroke([at(a, f), at(midpoint, f * 0.9), at(b, f)], 'rgba(232,240,248,0.6)', 0.005, false, true);
      }
    }
    for (let i = 0; i < 9; i++) k.dot(k.between(0.2, 0.8), k.between(0.2, 0.8), 0.008, '#ffffff');
    k.lump(0.7, 0.34, 0.06, cloth('#e4e8ee'), 8, 0.2, { shadow: true });
  },
};
