// Furniture, bathroom, village and fences.
import {
  cloth, COPPER, DARKSTONE, DARKWOOD, gold, GOLD, GRANITE, IRON, type Kit, LINEN, liquid, MARBLE,
  metal, OAK, PALEWOOD, type Painter, plain, STEEL, stone, straw, WATER, wood,
} from './kit';

const TAU = Math.PI * 2;

function bed(k: Kit, blanket: string, trim: string, pillows: number) {
  k.rect(0.03, 0.02, 0.94, 0.96, DARKWOOD, 0.08);
  k.rect(0.03, 0.02, 0.94, 0.09, wood('#6e4829'), 0.06, { shadow: true });
  for (const x of [0.07, 0.93]) k.stud(x, 0.06, 0.03, '#d8b66c');
  k.rect(0.09, 0.11, 0.82, 0.84, LINEN, 0.08);
  const w = 0.72 / pillows;
  for (let i = 0; i < pillows; i++) {
    const x = 0.14 + i * w;
    k.rect(x, 0.13, w - 0.04, 0.17, cloth('#f6f0e0'), 0.16, { shadow: true });
    k.stroke([[x + 0.06, 0.22], [x + w / 2 - 0.02, 0.235], [x + w - 0.1, 0.215]], 'rgba(150,135,105,0.5)', 0.012, false, true);
  }
  k.rect(0.07, 0.34, 0.86, 0.62, cloth(blanket), 0.1, { shadow: true });
  k.rect(0.07, 0.34, 0.86, 0.1, cloth('#efe6d0'), 0.05);
  k.stroke([[0.1, 0.47], [0.9, 0.47]], trim, 0.025, false);
  k.stroke([[0.15, 0.55], [0.85, 0.55], [0.85, 0.9], [0.15, 0.9], [0.15, 0.55]], trim, 0.014, false);
  k.poly([[0.5, 0.61], [0.64, 0.725], [0.5, 0.84], [0.36, 0.725]], cloth(trim));
  k.disc(0.5, 0.725, 0.055, cloth(blanket));
  for (const x of [0.28, 0.72]) k.stroke([[x, 0.46], [x - 0.04, 0.68], [x + 0.03, 0.95]], 'rgba(0,0,0,0.16)', 0.03, false, true);
}

function tableware(k: Kit, x: number, y: number, r: number) {
  k.disc(x, y, r, MARBLE, { shadow: true });
  k.ring(x, y, r * 0.62, 'rgba(90,80,60,0.45)', 0.008);
  k.dot(x, y, r * 0.4, '#9c5a2c');
}

function mug(k: Kit, x: number, y: number) {
  k.disc(x, y, 0.045, metal('#8f9aa8'), { shadow: true });
  k.dot(x, y, 0.028, '#d99a2a');
}

function roundTable(k: Kit, runner?: string) {
  k.disc(0.5, 0.5, 0.47, DARKWOOD, { shadow: true });
  k.disc(0.5, 0.5, 0.42, OAK);
  for (let i = 0; i < 5; i++) k.stroke([[0.14 + i * 0.18, 0.2], [0.14 + i * 0.18, 0.8]], 'rgba(45,22,8,0.35)', 0.008, false);
  k.ring(0.5, 0.5, 0.445, '#c49a5e', 0.01);
  if (runner) {
    k.rect(0.36, 0.06, 0.28, 0.88, cloth(runner), 0.03, { turn: 0.6, shadow: true });
    k.ring(0.5, 0.5, 0.15, '#e0c06a', 0.016);
    tableware(k, 0.5, 0.5, 0.09);
  } else {
    tableware(k, 0.33, 0.35, 0.1);
    tableware(k, 0.67, 0.64, 0.1);
    mug(k, 0.65, 0.3);
    k.stroke([[0.3, 0.68], [0.45, 0.57]], '#cfd6df', 0.022);
  }
}

function sofa(k: Kit, color: string) {
  k.rect(0.03, 0.05, 0.94, 0.9, DARKWOOD, 0.2, { shadow: true });
  k.rect(0.06, 0.09, 0.88, 0.32, cloth(color), 0.15);
  for (let i = 0; i < 3; i++) k.rect(0.17 + i * 0.22, 0.4, 0.22, 0.5, cloth(color), 0.12, { shadow: true });
  for (const x of [0.05, 0.79]) k.rect(x, 0.28, 0.16, 0.65, cloth(color), 0.22, { shadow: true });
  for (let i = 0; i < 6; i++) k.stud(0.2 + i * 0.12, 0.24, 0.024, '#e2c06a');
  k.rect(0.2, 0.46, 0.16, 0.26, cloth('#d9b968'), 0.14, { turn: 0.25, shadow: true });
}

function tub(k: Kit, shell: ReturnType<typeof wood>, inner: string, hoops: string | null) {
  k.oval(0.5, 0.5, 0.45, 0.47, shell, { shadow: true });
  if (hoops) for (const s of [0.92, 0.82]) k.ring(0.5, 0.5, 0.45 * s, hoops, 0.025);
  k.oval(0.5, 0.5, 0.34, 0.39, liquid(inner));
  for (let i = 0; i < 16; i++) {
    k.disc(k.between(0.28, 0.72), k.between(0.2, 0.55), k.between(0.025, 0.065), plain('#f4fbff'), { edge: false });
  }
  k.rect(0.45, 0.02, 0.1, 0.13, GOLD, 0.1, { shadow: true });
  for (const x of [0.36, 0.64]) k.stud(x, 0.08, 0.035, '#e8c260');
}

function post(k: Kit, x: number, y: number, r: number, material = DARKWOOD) {
  k.disc(x, y, r, material, { shadow: true });
  k.ring(x, y, r * 0.55, 'rgba(235,200,150,0.5)', r * 0.14);
}

function railFence(k: Kit, posts: number, material = OAK) {
  for (const y of [0.3, 0.6]) {
    k.rect(0.03, y, 0.94, 0.15, material, 0.04, { shadow: true, turn: k.between(-0.012, 0.012) });
  }
  for (let i = 0; i < posts; i++) {
    const x = 0.07 + (0.86 * i) / (posts - 1);
    k.rect(x - 0.035, 0.16, 0.07, 0.68, DARKWOOD, 0.08, { shadow: true, vertical: true });
    for (const y of [0.37, 0.67]) k.stud(x, y, 0.035, '#9aa3ad');
  }
}

export const HOME: Record<string, Painter> = {
  bed_teal: (k) => bed(k, '#2f817c', '#e0c06a', 1),
  bed_crimson: (k) => bed(k, '#93303a', '#e0c06a', 1),
  bed_double: (k) => bed(k, '#3d618c', '#d8d2c0', 2),
  cot_straw: (k) => {
    k.rect(0.05, 0.03, 0.9, 0.94, DARKWOOD, 0.1);
    k.rect(0.12, 0.08, 0.76, 0.84, straw('#c4a052'), 0.14, { vertical: true });
    k.rect(0.24, 0.11, 0.52, 0.15, cloth('#b9a98a'), 0.2, { turn: -0.06, shadow: true });
    k.poly([[0.12, 0.45], [0.86, 0.4], [0.89, 0.86], [0.2, 0.91]], cloth('#7c6a52'), { shadow: true });
    for (const [x, y] of [[0.3, 0.55], [0.64, 0.72]]) k.rect(x, y, 0.2, 0.11, cloth('#9a8464'), 0.04, { turn: 0.2 });
  },
  table_round: (k) => roundTable(k),
  table_round_teal: (k) => roundTable(k, '#2f817c'),
  table_banquet: (k) => {
    k.rect(0.02, 0.06, 0.96, 0.88, DARKWOOD, 0.12, { shadow: true });
    k.boards(0.05, 0.12, 0.9, 0.76, OAK, 4, false);
    k.rect(0.12, 0.4, 0.76, 0.2, cloth('#8f2b34'), 0.03, { shadow: true });
    for (const x of [0.17, 0.39, 0.61, 0.83]) {
      tableware(k, x, 0.26, 0.11);
      tableware(k, x, 0.74, 0.11);
      mug(k, x + 0.07, 0.3);
    }
    k.oval(0.5, 0.5, 0.07, 0.13, wood('#a9602c'), { shadow: true });
    for (const x of [0.28, 0.72]) k.glow(x, 0.5, 0.2, '#ffcf6b', 0.8);
    for (const x of [0.28, 0.72]) k.stud(x, 0.5, 0.05, '#ffe9a8');
  },
  pew: (k) => {
    k.rect(0.02, 0.1, 0.96, 0.26, DARKWOOD, 0.08, { shadow: true });
    k.rect(0.04, 0.4, 0.92, 0.46, OAK, 0.08, { shadow: true });
    for (const x of [0.02, 0.92]) k.rect(x, 0.08, 0.06, 0.84, wood('#4a2d19'), 0.2, { shadow: true });
    for (const x of [0.33, 0.66]) k.stroke([[x, 0.42], [x, 0.84]], 'rgba(30,15,5,0.7)', 0.025, false);
    k.stroke([[0.1, 0.23], [0.9, 0.23]], '#c49a5e', 0.025, false);
  },
  bench_stone: (k) => {
    for (const x of [0.1, 0.78]) k.rect(x, 0.06, 0.12, 0.88, DARKSTONE, 0.08, { shadow: true });
    k.rect(0.03, 0.18, 0.94, 0.64, GRANITE, 0.12, { shadow: true });
    k.stroke([[0.07, 0.3], [0.93, 0.3]], 'rgba(255,250,235,0.35)', 0.03, false);
    for (let i = 0; i < 14; i++) k.dot(k.between(0.05, 0.3), k.between(0.5, 0.8), k.between(0.02, 0.05), 'rgba(80,110,50,0.75)');
  },
  chair: (k) => {
    for (const [x, y] of [[0.14, 0.34], [0.72, 0.34], [0.14, 0.78], [0.72, 0.78]]) k.rect(x, y, 0.14, 0.14, DARKWOOD, 0.06);
    k.rect(0.17, 0.3, 0.66, 0.6, OAK, 0.14, { shadow: true });
    k.rect(0.26, 0.4, 0.48, 0.4, cloth('#8f2b34'), 0.18, { shadow: true });
    k.rect(0.12, 0.08, 0.76, 0.2, DARKWOOD, 0.1, { shadow: true });
    for (const x of [0.2, 0.8]) k.stud(x, 0.18, 0.055, '#caa05a');
  },
  stool_wood: (k) => {
    for (const a of [0.5, 2.6, 4.7]) post(k, 0.5 + Math.cos(a) * 0.34, 0.5 + Math.sin(a) * 0.34, 0.11);
    k.disc(0.5, 0.5, 0.34, OAK, { shadow: true });
    for (const r of [0.25, 0.16, 0.07]) k.ring(0.5, 0.5, r, 'rgba(70,35,12,0.55)', 0.018);
  },
  throne_gold: (k) => {
    k.rect(0.12, 0.2, 0.76, 0.76, GOLD, 0.1, { shadow: true });
    k.poly([[0.1, 0.28], [0.14, 0.04], [0.3, 0.14], [0.5, 0.01], [0.7, 0.14], [0.86, 0.04], [0.9, 0.28]], GOLD, { shadow: true });
    k.rect(0.24, 0.34, 0.52, 0.52, cloth('#8f1f2e'), 0.14, { shadow: true });
    for (const x of [0.08, 0.76]) {
      k.rect(x, 0.34, 0.16, 0.56, gold('#b98b2c'), 0.14, { shadow: true });
      k.stud(x + 0.08, 0.86, 0.065, '#f4d77a');
    }
    k.stud(0.5, 0.18, 0.075, '#3fa7d6');
    for (const x of [0.22, 0.78]) k.stud(x, 0.17, 0.045, '#d8344a');
  },
  desk: (k) => {
    k.rect(0.02, 0.04, 0.96, 0.92, DARKWOOD, 0.08, { shadow: true });
    k.rect(0.06, 0.1, 0.88, 0.8, OAK, 0.05);
    k.rect(0.28, 0.32, 0.42, 0.5, cloth('#2c5e48'), 0.05);
    k.rect(0.36, 0.36, 0.2, 0.4, LINEN, 0.02, { turn: -0.12, shadow: true });
    for (let i = 0; i < 4; i++) k.stroke([[0.39, 0.44 + i * 0.07], [0.52, 0.43 + i * 0.07]], '#5b4a38', 0.01, false);
    k.stroke([[0.58, 0.7], [0.7, 0.38]], '#f4f0e4', 0.028);
    k.disc(0.75, 0.32, 0.07, IRON, { shadow: true });
    k.dot(0.75, 0.32, 0.035, '#10121e');
    k.rect(0.1, 0.18, 0.13, 0.34, cloth('#8f2b34'), 0.03, { turn: 0.2, shadow: true });
    k.glow(0.84, 0.7, 0.22, '#ffcf6b');
    k.stud(0.84, 0.7, 0.08, '#ffe9a8');
  },
  lectern_book: (k) => {
    k.rect(0.2, 0.2, 0.6, 0.72, DARKWOOD, 0.1, { shadow: true });
    k.rect(0.06, 0.12, 0.88, 0.64, wood('#6e4829'), 0.06, { shadow: true });
    k.poly([[0.1, 0.2], [0.5, 0.24], [0.5, 0.72], [0.1, 0.66]], LINEN, { shadow: true });
    k.poly([[0.9, 0.2], [0.5, 0.24], [0.5, 0.72], [0.9, 0.66]], cloth('#f2ead4'), { shadow: true });
    for (let i = 0; i < 5; i++) {
      k.stroke([[0.17, 0.3 + i * 0.075], [0.44, 0.32 + i * 0.075]], '#5b4a38', 0.012, false);
      k.stroke([[0.56, 0.32 + i * 0.075], [0.83, 0.3 + i * 0.075]], '#5b4a38', 0.012, false);
    }
    k.stroke([[0.5, 0.25], [0.55, 0.88]], '#b02f3a', 0.035);
  },
  bookshelf: (k) => {
    k.rect(0.01, 0.03, 0.98, 0.94, DARKWOOD, 0.08, { shadow: true });
    k.rect(0.04, 0.12, 0.92, 0.76, wood('#2f1c0f'), 0.03);
    let x = 0.05;
    while (x < 0.92) {
      const w = k.between(0.022, 0.05);
      const tall = k.between(0.52, 0.7);
      k.rect(x, 0.82 - tall, Math.min(w, 0.95 - x), tall, cloth(k.pick(['#8f2b34', '#2c5e8c', '#2f6b45', '#8c6a28', '#5b3a7a', '#b3a486'])), 0.015);
      k.stroke([[x + 0.005, 0.9 - tall], [x + w - 0.005, 0.9 - tall]], '#e2c06a', 0.02, false);
      x += w + 0.004;
    }
  },
  wardrobe: (k) => {
    k.rect(0.02, 0.04, 0.96, 0.92, DARKWOOD, 0.08, { shadow: true });
    for (const x of [0.07, 0.51]) {
      k.rect(x, 0.12, 0.42, 0.76, OAK, 0.05, { vertical: true });
      k.rect(x + 0.06, 0.22, 0.3, 0.56, wood('#7a4f2b'), 0.04, { vertical: true });
    }
    for (const x of [0.45, 0.55]) k.stud(x, 0.5, 0.05, '#e2c06a');
  },
  sofa_teal: (k) => sofa(k, '#2f817c'),
  sofa_crimson: (k) => sofa(k, '#93303a'),
  piano_harpsichord: (k) => {
    k.poly([[0.06, 0.04], [0.94, 0.04], [0.94, 0.3], [0.7, 0.5], [0.58, 0.94], [0.3, 0.97], [0.06, 0.8]], wood('#3d2013'), { shadow: true });
    k.poly([[0.13, 0.3], [0.84, 0.28], [0.62, 0.47], [0.5, 0.88], [0.16, 0.76]], wood('#a9702f'), { vertical: true });
    for (let i = 0; i < 12; i++) k.stroke([[0.17 + i * 0.045, 0.31], [0.19 + i * 0.027, 0.78]], 'rgba(255,236,180,0.7)', 0.008, false);
    k.rect(0.1, 0.07, 0.8, 0.17, plain('#f4efe2'), 0.01, { shadow: true });
    for (let i = 1; i < 15; i++) k.stroke([[0.1 + i * 0.0533, 0.08], [0.1 + i * 0.0533, 0.23]], '#4a4238', 0.006, false);
    for (let i = 1; i < 15; i++) if (i % 7 !== 3 && i % 7 !== 0) k.rect(0.087 + i * 0.0533, 0.07, 0.027, 0.1, plain('#171210'), 0.005);
  },
  mirror_standing: (k) => {
    for (const x of [0.04, 0.82]) k.rect(x, 0.08, 0.14, 0.84, DARKWOOD, 0.2, { shadow: true });
    k.rect(0.12, 0.2, 0.76, 0.6, GOLD, 0.2, { shadow: true });
    k.rect(0.19, 0.32, 0.62, 0.36, liquid('#a9d8ea'), 0.1);
    k.stroke([[0.28, 0.62], [0.46, 0.38]], 'rgba(255,255,255,0.85)', 0.07, false);
    k.stroke([[0.5, 0.62], [0.58, 0.5]], 'rgba(255,255,255,0.65)', 0.035, false);
    for (const x of [0.11, 0.89]) k.stud(x, 0.5, 0.09, '#e2c06a');
  },
  fireplace: (k) => {
    k.rect(0.01, 0.03, 0.98, 0.94, GRANITE, 0.1, { shadow: true });
    for (let i = 0; i < 7; i++) k.rect(0.02 + i * 0.138, 0.04, 0.132, 0.2, i % 2 ? GRANITE : DARKSTONE, 0.04);
    k.rect(0.16, 0.26, 0.68, 0.66, stone('#171210'), 0.12);
    k.glow(0.5, 0.62, 0.75, '#ff8c2e');
    for (const t of [0.35, -0.35]) k.rect(0.3, 0.57, 0.4, 0.13, DARKWOOD, 0.1, { turn: t, vertical: false });
    k.flame(0.5, 0.6, 0.27);
    k.flame(0.38, 0.66, 0.13);
    k.flame(0.63, 0.66, 0.13);
  },

  // ---------- Bathroom ----------
  bathtub_wood: (k) => tub(k, OAK, '#4aa5c6', '#3d3a36'),
  bathtub_copper: (k) => tub(k, COPPER as ReturnType<typeof wood>, '#55b0c9', null),
  bathtub_marble: (k) => {
    tub(k, MARBLE as ReturnType<typeof wood>, '#57bcd6', null);
    for (let i = 0; i < 9; i++) k.dot(k.between(0.3, 0.7), k.between(0.45, 0.8), 0.028, k.pick(['#d84a62', '#f08aa0']));
  },
  privy_wood: (k) => {
    k.rect(0.04, 0.04, 0.92, 0.92, DARKWOOD, 0.06, { shadow: true });
    k.boards(0.09, 0.09, 0.82, 0.82, OAK, 5);
    k.disc(0.5, 0.56, 0.25, DARKWOOD, { shadow: true });
    k.disc(0.5, 0.56, 0.18, plain('#120a05'));
    k.rect(0.18, 0.12, 0.64, 0.12, DARKWOOD, 0.06, { shadow: true });
    k.stroke([[0.74, 0.7], [0.86, 0.84]], '#d8c9a0', 0.05);
  },
  toilet_porcelain: (k) => {
    k.rect(0.12, 0.04, 0.76, 0.28, MARBLE, 0.1, { shadow: true });
    k.stud(0.5, 0.17, 0.065, '#d8b050');
    k.oval(0.5, 0.64, 0.32, 0.3, plain('#f6f4ee'), { shadow: true });
    k.oval(0.5, 0.66, 0.2, 0.2, liquid('#6cc0da'));
    k.ring(0.5, 0.65, 0.3, 'rgba(120,130,140,0.5)', 0.018);
  },
  washbasin_stand: (k) => {
    k.rect(0.02, 0.05, 0.96, 0.9, DARKWOOD, 0.1, { shadow: true });
    k.disc(0.34, 0.5, 0.37, plain('#f2efe6'), { shadow: true });
    k.disc(0.34, 0.5, 0.27, WATER);
    k.disc(0.76, 0.42, 0.2, plain('#e8e2d4'), { shadow: true });
    k.disc(0.76, 0.42, 0.1, WATER);
    k.stroke([[0.76, 0.6], [0.8, 0.76]], '#e8e2d4', 0.08);
    k.rect(0.64, 0.7, 0.28, 0.2, cloth('#4f7fb0'), 0.04, { turn: -0.15, shadow: true });
  },
  sink_stone: (k) => {
    k.rect(0.02, 0.05, 0.96, 0.9, GRANITE, 0.14, { shadow: true });
    k.rect(0.13, 0.22, 0.74, 0.64, DARKSTONE, 0.22);
    k.rect(0.18, 0.3, 0.64, 0.5, WATER, 0.18);
    k.stroke([[0.5, 0.1], [0.5, 0.42]], '#d0a53f', 0.07);
    for (const x of [0.3, 0.7]) k.stud(x, 0.13, 0.06, '#e2c06a');
  },
  vanity_mirror: (k) => {
    k.rect(0.02, 0.3, 0.96, 0.66, DARKWOOD, 0.08, { shadow: true });
    k.rect(0.06, 0.36, 0.88, 0.54, OAK, 0.05);
    k.rect(0.25, 0.05, 0.5, 0.34, GOLD, 0.16, { shadow: true });
    k.rect(0.3, 0.11, 0.4, 0.2, liquid('#b4deee'), 0.06);
    k.stroke([[0.38, 0.28], [0.48, 0.13]], 'rgba(255,255,255,0.85)', 0.05, false);
    for (const [x, c] of [[0.16, '#d8446a'], [0.24, '#8d52c4'], [0.8, '#3fa7a0']] as const) k.stud(x, 0.6, 0.075, c);
    k.stroke([[0.42, 0.72], [0.62, 0.66]], '#e8dcc0', 0.05);
    k.disc(0.68, 0.7, 0.08, LINEN, { shadow: true });
  },
  folding_screen: (k) => {
    const points: [number, number][] = [[0.04, 0.72], [0.27, 0.28], [0.5, 0.72], [0.73, 0.28], [0.96, 0.72]];
    for (let i = 0; i < 4; i++) {
      k.stroke([points[i], points[i + 1]], '#6e4829', 0.34);
      k.stroke([points[i], points[i + 1]], i % 2 ? '#a8404c' : '#c0535c', 0.18, false);
    }
    for (const [x, y] of points) k.stud(x, y, 0.13, '#e2c06a');
  },
  towel_rack: (k) => {
    for (const x of [0.04, 0.86]) k.rect(x, 0.08, 0.1, 0.84, DARKWOOD, 0.2, { shadow: true });
    k.stroke([[0.09, 0.5], [0.91, 0.5]], '#6e4829', 0.14);
    k.rect(0.17, 0.2, 0.3, 0.66, cloth('#3f8fa6'), 0.1, { shadow: true });
    k.rect(0.53, 0.14, 0.28, 0.66, LINEN, 0.1, { shadow: true });
    for (const y of [0.62, 0.7]) k.stroke([[0.54, y], [0.8, y]], '#b04a50', 0.04, false);
  },
  laundry_tub: (k) => {
    k.disc(0.5, 0.5, 0.47, OAK, { shadow: true });
    k.ring(0.5, 0.5, 0.43, '#3d3a36', 0.035);
    k.disc(0.5, 0.5, 0.36, liquid('#7fbcd0'));
    k.lump(0.4, 0.42, 0.17, LINEN, 8, 0.35, { shadow: true });
    k.lump(0.62, 0.6, 0.13, cloth('#a8404c'), 8, 0.35, { shadow: true });
    k.rect(0.55, 0.18, 0.2, 0.34, PALEWOOD, 0.04, { turn: 0.5, shadow: true });
    for (let i = 0; i < 5; i++) k.stroke([[0.57 - i * 0.017, 0.25 + i * 0.045], [0.73 - i * 0.017, 0.33 + i * 0.045]], '#6a4a2a', 0.016, false);
    for (let i = 0; i < 12; i++) k.dot(k.between(0.25, 0.75), k.between(0.25, 0.75), k.between(0.012, 0.03), '#f4fbff');
  },
  chamber_pot: (k) => {
    k.ring(0.22, 0.46, 0.16, '#d9d3c2', 0.08);
    k.disc(0.38, 0.46, 0.3, plain('#eee9da'), { shadow: true });
    k.disc(0.38, 0.46, 0.2, liquid('#9c8c50'));
    k.disc(0.76, 0.68, 0.2, OAK, { shadow: true });
    k.disc(0.76, 0.68, 0.12, plain('#20150c'));
    k.ring(0.76, 0.68, 0.18, '#3d3a36', 0.025);
    k.stroke([[0.64, 0.58], [0.76, 0.4], [0.9, 0.62]], '#7d848c', 0.025, true, true);
  },
  sauna_brazier: (k) => {
    k.disc(0.5, 0.5, 0.47, IRON, { shadow: true });
    k.disc(0.5, 0.5, 0.37, plain('#1c1210'));
    k.glow(0.5, 0.5, 0.46, '#ff8c2e', 0.9);
    for (let i = 0; i < 11; i++) {
      const a = (i / 11) * TAU;
      const r = i < 8 ? 0.22 : 0.07;
      k.lump(0.5 + Math.cos(a * (i < 8 ? 11 / 8 : 4)) * r, 0.5 + Math.sin(a * (i < 8 ? 11 / 8 : 4)) * r, 0.11, DARKSTONE, 8, 0.2, { shadow: true });
    }
    for (let i = 0; i < 6; i++) k.stud(0.5 + Math.cos((i / 6) * TAU) * 0.42, 0.5 + Math.sin((i / 6) * TAU) * 0.42, 0.03, '#aeb8c4');
  },

  // ---------- Village ----------
  village_well_roofed: (k) => {
    k.disc(0.5, 0.5, 0.45, DARKSTONE, { shadow: true });
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU;
      k.lump(0.5 + Math.cos(a) * 0.36, 0.5 + Math.sin(a) * 0.36, 0.11, GRANITE, 7, 0.15);
    }
    k.disc(0.5, 0.5, 0.27, liquid('#123246'));
    for (const x of [0.04, 0.86]) k.rect(x, 0.44, 0.1, 0.12, DARKWOOD, 0.04, { shadow: true });
    k.rect(0.18, 0.12, 0.64, 0.34, wood('#8a4a30'), 0.04, { shadow: true });
    for (let i = 1; i < 6; i++) k.stroke([[0.18 + i * 0.107, 0.13], [0.18 + i * 0.107, 0.45]], 'rgba(30,12,4,0.65)', 0.012, false);
    k.rect(0.15, 0.27, 0.7, 0.06, DARKWOOD, 0.03, { shadow: true });
    k.stroke([[0.5, 0.46], [0.5, 0.6]], '#caa86a', 0.018);
    k.disc(0.5, 0.64, 0.08, OAK, { shadow: true });
  },
  notice_board: (k) => {
    k.rect(0.02, 0.18, 0.96, 0.64, DARKWOOD, 0.1, { shadow: true });
    k.rect(0.06, 0.28, 0.88, 0.44, wood('#a8794a'), 0.04);
    [0.13, 0.3, 0.47, 0.66, 0.8].forEach((x, i) => {
      k.rect(x, 0.2 + (i % 2) * 0.08, 0.13, 0.54, cloth(i === 3 ? '#e8c88a' : '#f2ecda'), 0.02, { turn: k.between(-0.12, 0.12), shadow: true });
      for (let l = 0; l < 3; l++) k.stroke([[x + 0.025, 0.4 + l * 0.11], [x + 0.1, 0.41 + l * 0.11]], '#6a5a46', 0.025, false);
      k.stud(x + 0.065, 0.27 + (i % 2) * 0.08, 0.055, '#c0343c');
    });
  },
  street_lamppost: (k) => {
    k.glow(0.5, 0.5, 0.5, '#ffd27a', 0.7);
    k.disc(0.5, 0.5, 0.16, IRON, { shadow: true });
    k.stroke([[0.16, 0.5], [0.84, 0.5]], '#39404a', 0.055);
    k.stroke([[0.5, 0.16], [0.5, 0.84]], '#39404a', 0.055);
    for (const [x, y] of [[0.16, 0.5], [0.84, 0.5], [0.5, 0.16], [0.5, 0.84]]) {
      k.disc(x, y, 0.1, IRON, { shadow: true });
      k.stud(x, y, 0.06, '#ffe9a8');
    }
    k.stud(0.5, 0.5, 0.07, '#8f9aa8');
  },
  water_trough: (k) => {
    k.rect(0.02, 0.08, 0.96, 0.84, DARKWOOD, 0.14, { shadow: true });
    k.rect(0.07, 0.22, 0.86, 0.56, WATER, 0.1);
    for (const x of [0.16, 0.84]) {
      k.rect(x - 0.025, 0.03, 0.05, 0.94, IRON, 0.05, { shadow: true });
      for (const y of [0.13, 0.87]) k.stud(x, y, 0.04, '#c3ccd8');
    }
    for (let i = 0; i < 7; i++) k.dot(k.between(0.25, 0.75), k.between(0.35, 0.65), 0.025, 'rgba(200,180,90,0.9)');
  },
  hay_bale_round: (k) => {
    k.disc(0.5, 0.5, 0.46, straw('#c9a244'), { shadow: true });
    for (let i = 0; i < 6; i++) k.ring(0.5 + i * 0.006, 0.5, 0.42 - i * 0.068, 'rgba(110,76,18,0.6)', 0.018);
    for (const x of [0.34, 0.66]) k.stroke([[x, 0.09], [x + 0.01, 0.5], [x, 0.91]], '#6a4a20', 0.022, false, true);
  },
  hay_pile: (k) => {
    k.lump(0.5, 0.52, 0.47, straw('#b98f34'), 14, 0.18, { shadow: true });
    k.lump(0.42, 0.44, 0.31, straw('#d0aa48'), 11, 0.22, { shadow: true });
    k.lump(0.56, 0.52, 0.18, straw('#e2c25c'), 9, 0.25, { shadow: true });
    for (let i = 0; i < 26; i++) {
      const x = k.between(0.08, 0.9);
      const y = k.between(0.08, 0.9);
      k.stroke([[x, y], [x + k.between(-0.08, 0.08), y + k.between(-0.06, 0.06)]], '#f0d474', 0.01, false);
    }
    k.stroke([[0.62, 0.9], [0.84, 0.3]], '#8a5c34', 0.035);
    for (const dx of [-0.05, 0, 0.05]) k.stroke([[0.84 + dx, 0.3], [0.87 + dx, 0.16]], '#aeb8c4', 0.016);
  },
  wheelbarrow: (k) => {
    k.rect(0.42, 0.02, 0.16, 0.17, DARKWOOD, 0.2, { shadow: true });
    k.stud(0.5, 0.1, 0.06, '#9aa3ad');
    for (const x of [0.2, 0.8]) k.stroke([[x, 0.3], [x + (x - 0.5) * 0.3, 0.96]], '#6e4829', 0.08);
    k.poly([[0.12, 0.18], [0.88, 0.18], [0.78, 0.72], [0.22, 0.72]], OAK, { shadow: true });
    k.poly([[0.22, 0.25], [0.78, 0.25], [0.71, 0.64], [0.29, 0.64]], DARKWOOD);
    for (let i = 0; i < 9; i++) k.lump(k.between(0.34, 0.66), k.between(0.32, 0.56), 0.1, stone(k.pick(['#7a5c3c', '#8f7048'])), 7, 0.25);
  },
  woodpile_logs: (k) => {
    for (let i = 0; i < 4; i++) {
      const y = 0.06 + i * 0.225;
      const shift = (i % 2) * 0.05;
      k.rect(0.05 + shift, y, 0.86, 0.21, wood('#6a4222'), 0.12, { shadow: true, vertical: false });
      k.oval(0.06 + shift, y + 0.105, 0.05, 0.1, PALEWOOD);
      k.ring(0.06 + shift, y + 0.105, 0.045, 'rgba(90,55,25,0.8)', 0.012);
      k.dot(k.between(0.3, 0.7), y + 0.1, 0.035, 'rgba(40,20,8,0.7)');
    }
    for (const x of [0.2, 0.8]) k.rect(x, 0.01, 0.045, 0.98, DARKWOOD, 0.1, { shadow: true });
  },
  chopping_block: (k) => {
    k.disc(0.5, 0.52, 0.43, wood('#5c3c20'), { shadow: true });
    k.disc(0.5, 0.52, 0.34, PALEWOOD);
    for (const r of [0.26, 0.17, 0.08]) k.ring(0.5, 0.52, r, 'rgba(100,62,28,0.65)', 0.014);
    for (let i = 0; i < 8; i++) k.rect(k.between(0.05, 0.85), k.between(0.7, 0.9), 0.09, 0.04, PALEWOOD, 0.02, { turn: k.between(0, 3) });
    k.stroke([[0.52, 0.5], [0.86, 0.16]], '#8a5c34', 0.075);
    k.poly([[0.3, 0.44], [0.46, 0.34], [0.62, 0.52], [0.5, 0.66]], STEEL, { shadow: true });
    k.stroke([[0.32, 0.46], [0.48, 0.64]], '#eef3f8', 0.02, false);
  },
  vegetable_patch: (k) => {
    k.rect(0.02, 0.02, 0.96, 0.96, stone('#5c3f26'), 0.06);
    for (let row = 0; row < 4; row++) {
      const y = 0.15 + row * 0.235;
      k.rect(0.07, y - 0.075, 0.86, 0.15, stone('#46301c'), 0.07);
      for (let i = 0; i < 7; i++) {
        const x = 0.13 + i * 0.123;
        if (row % 2 === 0) {
          k.foliage(x, y, 0.065, ['#3d7a2a', '#63a83c'], 8, 0.032);
          if (row === 2) k.stud(x, y, 0.022, '#e0652a');
        } else {
          k.disc(x, y, 0.055, cloth(row === 1 ? '#6fae48' : '#8cba5a'), { shadow: true });
          k.ring(x, y, 0.028, '#d6ecaa', 0.008);
        }
      }
    }
  },
  scarecrow: (k) => {
    k.stroke([[0.08, 0.5], [0.92, 0.5]], '#6e4829', 0.06);
    for (const x of [0.08, 0.92]) for (let i = 0; i < 7; i++) k.stroke([[x, 0.5], [x + (x - 0.5) * k.between(0.05, 0.2), 0.5 + k.between(-0.12, 0.12)]], '#e2c25c', 0.016, false);
    k.rect(0.18, 0.4, 0.64, 0.2, cloth('#8f3a34'), 0.08, { shadow: true });
    k.rect(0.34, 0.34, 0.32, 0.4, cloth('#4a6a8c'), 0.12, { shadow: true });
    k.disc(0.5, 0.46, 0.22, straw('#c9a244'), { shadow: true });
    k.disc(0.5, 0.46, 0.13, cloth('#6a4a28'), { shadow: true });
    k.ring(0.5, 0.46, 0.115, '#b04a40', 0.025);
  },
  clothesline: (k) => {
    for (const x of [0.04, 0.96]) post(k, x, 0.5, 0.2);
    k.stroke([[0.04, 0.5], [0.5, 0.58], [0.96, 0.5]], '#e8dcc0', 0.025, true, true);
    const items: [number, number, string][] = [[0.13, 0.17, '#e8e2d0'], [0.35, 0.12, '#b8424a'], [0.52, 0.18, '#4f7fb0'], [0.75, 0.14, '#d9b24a']];
    for (const [x, w, c] of items) {
      k.rect(x, 0.28, w, 0.58, cloth(c), 0.08, { shadow: true, turn: k.between(-0.05, 0.05) });
      for (const dx of [0.025, w - 0.025]) k.stud(x + dx, 0.42, 0.06, '#8a5c34');
    }
  },
  chicken_coop: (k) => {
    k.rect(0.03, 0.04, 0.78, 0.92, OAK, 0.05, { shadow: true });
    k.boards(0.07, 0.09, 0.34, 0.82, wood('#8f4630'), 6, false);
    k.boards(0.43, 0.09, 0.34, 0.82, wood('#a35238'), 6, false);
    k.rect(0.39, 0.04, 0.06, 0.92, DARKWOOD, 0.03, { shadow: true });
    k.poly([[0.8, 0.36], [0.99, 0.42], [0.99, 0.6], [0.8, 0.66]], PALEWOOD, { shadow: true });
    for (let i = 0; i < 4; i++) k.stroke([[0.83 + i * 0.045, 0.4], [0.83 + i * 0.045, 0.62]], '#6e4829', 0.016, false);
    for (let i = 0; i < 14; i++) k.dot(k.between(0.82, 0.99), k.between(0.68, 0.96), 0.012, '#e8c85c');
  },
  doghouse: (k) => {
    k.rect(0.06, 0.04, 0.88, 0.78, DARKWOOD, 0.06, { shadow: true });
    k.boards(0.09, 0.07, 0.41, 0.72, wood('#9c3a30'), 5, false);
    k.boards(0.5, 0.07, 0.41, 0.72, wood('#b34a3a'), 5, false);
    k.rect(0.46, 0.04, 0.08, 0.78, PALEWOOD, 0.03, { shadow: true });
    k.oval(0.5, 0.85, 0.2, 0.1, plain('#160d07'));
    k.stroke([[0.74, 0.9], [0.9, 0.93]], '#f2ead4', 0.05);
    for (const [x, y] of [[0.73, 0.88], [0.74, 0.93], [0.91, 0.91], [0.9, 0.96]]) k.stud(x, y, 0.025, '#f2ead4');
  },
  beehive_skep: (k) => {
    k.disc(0.5, 0.52, 0.44, straw('#b4872c'), { shadow: true });
    for (let i = 0; i < 5; i++) k.disc(0.5 - i * 0.008, 0.52 - i * 0.012, 0.39 - i * 0.075, straw(i % 2 ? '#c99c38' : '#dab04a'));
    k.oval(0.5, 0.83, 0.09, 0.06, plain('#1c1005'));
    for (let i = 0; i < 7; i++) {
      const x = k.between(0.1, 0.9);
      const y = k.between(0.08, 0.92);
      for (const dx of [-0.02, 0.02]) k.dot(x + dx, y - 0.016, 0.02, 'rgba(235,245,255,0.8)');
      k.dot(x, y, 0.022, '#f4c218');
      k.dot(x, y + 0.012, 0.011, '#1c140a');
    }
  },
  pillory_stocks: (k) => {
    for (const x of [0.03, 0.87]) k.rect(x, 0.06, 0.1, 0.88, DARKWOOD, 0.12, { shadow: true });
    k.rect(0.08, 0.24, 0.84, 0.25, OAK, 0.05, { shadow: true });
    k.rect(0.08, 0.52, 0.84, 0.25, OAK, 0.05, { shadow: true });
    k.disc(0.5, 0.505, 0.18, plain('#1a0f07'));
    for (const x of [0.28, 0.72]) k.disc(x, 0.505, 0.11, plain('#1a0f07'));
    for (const x of [0.14, 0.86]) k.rect(x - 0.025, 0.2, 0.05, 0.62, IRON, 0.03, { shadow: true });
    k.stud(0.9, 0.5, 0.08, '#aeb8c4');
  },
  fruit_crates: (k) => {
    const crate = (x: number, y: number, w: number, h: number, colors: string[], r: number) => {
      k.rect(x, y, w, h, PALEWOOD, 0.04, { shadow: true });
      k.rect(x + 0.025, y + 0.03, w - 0.05, h - 0.06, DARKWOOD, 0.02);
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          k.stud(x + 0.07 + col * ((w - 0.14) / 3), y + 0.09 + row * ((h - 0.18) / 2), r, k.pick(colors));
        }
      }
    };
    crate(0.03, 0.05, 0.46, 0.5, ['#c8302c', '#e04a34'], 0.05);
    crate(0.52, 0.12, 0.45, 0.46, ['#e8851c', '#f2a02c'], 0.05);
    crate(0.24, 0.55, 0.48, 0.41, ['#7fa82c', '#a6c23c'], 0.045);
  },

  // ---------- Fences ----------
  fence_wood_straight: (k) => railFence(k, 4),
  fence_wood_short: (k) => railFence(k, 2),
  fence_wood_corner: (k) => {
    for (const o of [0.12, 0.24]) {
      k.stroke([[o, 0.94], [o, o], [0.94, o]], '#8a5c34', 0.075);
    }
    for (const [x, y] of [[0.18, 0.18], [0.56, 0.18], [0.9, 0.18], [0.18, 0.56], [0.18, 0.9]]) {
      k.rect(x - 0.08, y - 0.08, 0.16, 0.16, DARKWOOD, 0.05, { shadow: true });
      k.stud(x, y, 0.025, '#9aa3ad');
    }
  },
  fence_gate_wood: (k) => {
    for (const x of [0.07, 0.93]) post(k, x, 0.5, 0.3);
    for (const y of [0.34, 0.6]) k.rect(0.13, y, 0.74, 0.13, OAK, 0.03, { shadow: true });
    for (let i = 0; i < 6; i++) k.rect(0.15 + i * 0.127, 0.2, 0.065, 0.62, PALEWOOD, 0.04, { shadow: true, vertical: true });
    k.stroke([[0.18, 0.72], [0.82, 0.28]], '#6e4829', 0.1);
    for (const x of [0.15, 0.85]) k.stud(x, 0.5, 0.07, '#4a525e');
  },
  fence_picket_white: (k) => {
    for (const y of [0.34, 0.6]) k.rect(0.02, y, 0.96, 0.12, plain('#d9d2c0'), 0.03, { shadow: true });
    for (let i = 0; i < 12; i++) {
      const x = 0.025 + i * 0.081;
      k.poly([[x, 0.22], [x + 0.025, 0.06], [x + 0.05, 0.22], [x + 0.05, 0.9], [x, 0.9]], plain('#f6f2e6'), { shadow: true });
      for (const y of [0.4, 0.66]) k.dot(x + 0.025, y, 0.022, '#8f887a');
    }
  },
  fence_iron_straight: (k) => {
    for (const y of [0.36, 0.64]) k.rect(0.02, y - 0.05, 0.96, 0.1, IRON, 0.05, { shadow: true });
    for (let i = 0; i < 11; i++) {
      const x = 0.04 + i * 0.092;
      k.stroke([[x, 0.2], [x, 0.8]], '#454d59', 0.07);
      k.poly([[x - 0.018, 0.22], [x, 0.04], [x + 0.018, 0.22], [x, 0.3]], STEEL);
    }
    for (const x of [0.04, 0.96]) k.stud(x, 0.5, 0.16, '#79838f');
  },
  fence_iron_gate: (k) => {
    for (const x of [0.07, 0.93]) {
      k.rect(x - 0.065, 0.14, 0.13, 0.72, DARKSTONE, 0.12, { shadow: true });
      k.stud(x, 0.5, 0.15, '#c8a24a');
    }
    for (const side of [0, 1]) {
      const a = side ? 0.52 : 0.14;
      k.rect(a, 0.43, 0.34, 0.14, IRON, 0.05, { shadow: true });
      for (let i = 0; i < 5; i++) {
        const x = a + 0.035 + i * 0.067;
        k.stroke([[x, 0.2], [x, 0.8]], '#454d59', 0.06);
        k.stud(x, 0.2, 0.055, '#aeb8c4');
      }
      k.ring(a + 0.17, 0.5, 0.19, '#c8a24a', 0.045);
    }
  },
  fence_palisade_logs: (k) => {
    for (let i = 0; i < 9; i++) {
      const x = 0.06 + i * 0.11;
      const y = 0.5 + k.between(-0.05, 0.05);
      k.disc(x, y, 0.42, wood('#5c3a1e'), { shadow: true });
      k.disc(x - 0.004, y - 0.02, 0.28, PALEWOOD);
      k.ring(x - 0.004, y - 0.02, 0.16, 'rgba(100,62,28,0.7)', 0.03);
      k.dot(x, y, 0.05, '#6a421f');
    }
  },
  fence_rope_posts: (k) => {
    const xs = [0.06, 0.35, 0.65, 0.94];
    for (let i = 0; i < 3; i++) {
      k.stroke([[xs[i], 0.5], [(xs[i] + xs[i + 1]) / 2, 0.82], [xs[i + 1], 0.5]], '#c9a869', 0.1, true, true);
    }
    for (const x of xs) {
      post(k, x, 0.48, 0.24, wood('#7a4f2b'));
      k.ring(x, 0.48, 0.17, '#c9a869', 0.06);
    }
  },
  hitching_post: (k) => {
    for (const x of [0.07, 0.93]) post(k, x, 0.45, 0.28);
    k.rect(0.05, 0.34, 0.9, 0.22, OAK, 0.1, { shadow: true });
    for (const x of [0.3, 0.55, 0.78]) {
      k.ring(x, 0.68, 0.14, '#2a2e36', 0.08);
      k.ring(x, 0.68, 0.14, '#9aa3ad', 0.04);
      k.stud(x, 0.53, 0.07, '#5a626e');
    }
    k.stroke([[0.3, 0.7], [0.34, 0.9], [0.5, 0.86]], '#c9a869', 0.07, true, true);
  },
};
