// CyberGato street furniture, interiors, tech, nightlife, industry, security, plants and lights.
import { cloth, type Kit, liquid, metal, plain, stone, wood } from './kit';
import { add, NEONS, neon, neonLoop, PAINTS, tint } from './cyberRegistry';

type P = [number, number];
const TAU = Math.PI * 2;
const STEEL = metal('#6a7280');
const DARK = metal('#24272d');
const CHROME = metal('#b4bcc6');
const SCREEN = (c: string) => liquid(c);
const around = (n: number, r: number, draw: (x: number, y: number, a: number, i: number) => void, from = 0) => {
  for (let i = 0; i < n; i++) {
    const a = from + (i / n) * TAU;
    draw(0.5 + Math.cos(a) * r, 0.5 + Math.sin(a) * r, a, i);
  }
};
const paint = (id: string) => PAINTS.find((p) => p[0] === id)!;
const glowOf = (id: string) => NEONS.find((n) => n[0] === id)!;

// Shared: a glowing display panel.
function screen(k: Kit, x: number, y: number, w: number, h: number, color: string, lines = 3) {
  k.rect(x, y, w, h, SCREEN(tint(color, -120)), 0.02);
  k.glow(x + w / 2, y + h / 2, Math.max(w, h) * 0.7, color, 0.45);
  for (let i = 0; i < lines; i++) {
    const ly = y + h * (0.25 + (i * 0.5) / Math.max(1, lines - 1));
    k.stroke([[x + w * 0.15, ly], [x + w * (0.4 + k.rand() * 0.45), ly]], color, Math.min(w, h) * 0.08, false);
  }
}

// ======================= Street =======================
for (const [cid, cname, glow] of [glowOf('yellow'), glowOf('cyan'), glowOf('purple')]) {
  add(`street_lamp_${cid}`, `Farola ${cname}`, 'cy_street', 0.8, 0.8, 'farola luz calle', (k) => {
    k.glow(0.5, 0.5, 0.5, glow, 0.6);
    k.disc(0.5, 0.5, 0.14, DARK, { shadow: true });
    k.stroke([[0.5, 0.5], [0.5, 0.12]], '#3a3e46', 0.08);
    k.rect(0.36, 0.06, 0.28, 0.12, DARK, 0.04);
    neon(k, [[0.4, 0.12], [0.6, 0.12]], glow, 0.06);
  }, [glow, 6]);
}
add('traffic_light', 'Semáforo', 'cy_street', 0.6, 1, 'semaforo trafico', (k) => {
  k.rect(0.25, 0.05, 0.5, 0.9, DARK, 0.1, { shadow: true });
  ['#ff3b3b', '#ffb02f', '#3fff8a'].forEach((c, i) => {
    k.disc(0.5, 0.22 + i * 0.28, 0.17, plain('#0c0d10'));
    if (i === 2) k.glow(0.5, 0.78, 0.3, c, 0.7);
    k.dot(0.5, 0.22 + i * 0.28, 0.12, i === 2 ? c : tint(c, -150));
  });
});
add('hydrant', 'Boca de Incendios', 'cy_street', 0.45, 0.45, 'hidrante', (k) => {
  k.disc(0.5, 0.5, 0.42, metal('#c41e24'), { shadow: true });
  for (const x of [0.12, 0.88]) k.disc(x, 0.5, 0.12, metal('#a01a1e'));
  k.disc(0.5, 0.5, 0.2, metal('#e8c21c'));
});
for (const [cid, cname, hex] of [['green', 'Verde', '#2a7a3a'], ['grey', 'Gris', '#5a606a'], ['blue', 'Azul', '#2350a8']] as const) {
  add(`trash_bin_${cid}`, `Papelera ${cname}`, 'cy_street', 0.5, 0.5, 'papelera basura', (k) => {
    k.disc(0.5, 0.5, 0.42, metal(hex), { shadow: true });
    k.disc(0.5, 0.5, 0.3, plain('#151517'));
    for (let i = 0; i < 5; i++) k.dot(k.between(0.35, 0.65), k.between(0.35, 0.65), 0.05, k.pick(['#e8e6e0', '#c82020', '#e8c21c']));
  });
}
for (const [cid, cname, hex] of [['green', 'Verde', '#2a5a34'], ['blue', 'Azul', '#24467a'], ['rust', 'Oxidado', '#7a4a26']] as const) {
  add(`dumpster_${cid}`, `Contenedor de Basura ${cname}`, 'cy_street', 1.8, 1.1, 'contenedor basura', (k) => {
    k.rect(0.02, 0.06, 0.96, 0.88, metal(hex), 0.06, { shadow: true });
    k.rect(0.04, 0.1, 0.45, 0.8, metal(tint(hex, 14)), 0.04);
    k.rect(0.51, 0.1, 0.45, 0.8, metal(tint(hex, -10)), 0.04);
    k.lump(0.75, 0.5, 0.18, plain('#202022'), 8, 0.3);
    k.lump(0.7, 0.46, 0.1, cloth('#3a3a3a'), 7, 0.3, { shadow: true });
  });
}
add('bench', 'Banco Metálico', 'cy_street', 2, 0.7, 'banco asiento', (k) => {
  k.rect(0.02, 0.1, 0.96, 0.25, STEEL, 0.06, { shadow: true });
  k.rect(0.02, 0.42, 0.96, 0.48, STEEL, 0.06, { shadow: true });
  for (let x = 0.08; x < 0.95; x += 0.07) k.stroke([[x, 0.46], [x, 0.86]], '#3a404a', 0.04, false);
});
add('bench_neon', 'Banco Neón', 'cy_street', 2, 0.7, 'banco asiento neon', (k) => {
  k.rect(0.02, 0.15, 0.96, 0.7, DARK, 0.2, { shadow: true });
  neon(k, [[0.06, 0.82], [0.94, 0.82]], '#2fe8ff', 0.06);
}, ['#2fe8ff', 2, 0.4]);
add('bus_stop', 'Parada de Bus', 'cy_street', 3, 1.2, 'parada autobus marquesina', (k) => {
  k.rect(0.02, 0.05, 0.96, 0.9, liquid('#2a5470'), 0.04, { shadow: true });
  k.rect(0.02, 0.05, 0.96, 0.12, DARK, 0.04);
  screen(k, 0.75, 0.3, 0.2, 0.5, '#ff3fb0', 4);
  k.rect(0.08, 0.6, 0.55, 0.22, STEEL, 0.04);
}, ['#ff3fb0', 2.5, 0.5]);
for (const [cid, cname, glow] of NEONS.slice(0, 6)) {
  add(`vending_${cid}`, `Máquina Expendedora ${cname}`, 'cy_street', 0.9, 0.7, 'expendedora maquina bebida', (k) => {
    k.rect(0.04, 0.06, 0.92, 0.88, metal('#1c1d22'), 0.06, { shadow: true });
    k.rect(0.1, 0.12, 0.55, 0.76, SCREEN(tint(glow, -110)), 0.03);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) k.dot(0.17 + c * 0.13, 0.25 + r * 0.25, 0.04, k.pick(['#e8e6e0', '#ff3b4a', '#2fe8ff', '#ffe12f']));
    neonLoop(k, [[0.1, 0.12], [0.65, 0.12], [0.65, 0.88], [0.1, 0.88]], glow, 0.03);
    k.rect(0.72, 0.3, 0.18, 0.3, CHROME, 0.02);
  }, [glow, 2.5, 0.6]);
}
add('atm', 'Cajero Automático', 'cy_street', 0.8, 0.6, 'cajero dinero banco', (k) => {
  k.rect(0.05, 0.08, 0.9, 0.84, STEEL, 0.08, { shadow: true });
  screen(k, 0.2, 0.2, 0.6, 0.35, '#3fff8a', 3);
  k.rect(0.3, 0.65, 0.4, 0.12, DARK, 0.02);
}, ['#3fff8a', 1.5, 0.4]);
add('holo_booth', 'Cabina Holofónica', 'cy_street', 1, 1, 'cabina telefono holo', (k) => {
  k.rect(0.05, 0.05, 0.9, 0.9, liquid('#1a2a40'), 0.12, { shadow: true });
  k.glow(0.5, 0.5, 0.4, '#2fe8ff', 0.6);
  k.disc(0.5, 0.5, 0.18, plain('#0c1420'));
  neonLoop(k, [[0.08, 0.08], [0.92, 0.08], [0.92, 0.92], [0.08, 0.92]], '#2fe8ff', 0.04);
}, ['#2fe8ff', 2, 0.5]);
add('parking_meter', 'Parquímetro', 'cy_street', 0.35, 0.35, 'parquimetro', (k) => {
  k.disc(0.5, 0.5, 0.42, STEEL, { shadow: true });
  k.dot(0.5, 0.5, 0.2, '#3fff8a');
});
add('cone', 'Cono de Tráfico', 'cy_street', 0.45, 0.45, 'cono obra', (k) => {
  k.rect(0.08, 0.08, 0.84, 0.84, plain('#1a1a1a'), 0.08, { shadow: true });
  k.disc(0.5, 0.5, 0.34, plain('#ff6a14'));
  k.ring(0.5, 0.5, 0.22, '#f2f2ee', 0.08);
  k.dot(0.5, 0.5, 0.08, '#ff6a14');
});
add('barrier', 'Valla de Obras', 'cy_street', 2, 0.5, 'barrera obras', (k) => {
  k.rect(0.02, 0.2, 0.96, 0.6, plain('#f2f2ee'), 0.06, { shadow: true });
  for (let x = 0.04; x < 0.96; x += 0.16) k.poly([[x, 0.2], [x + 0.08, 0.2], [x + 0.04, 0.8], [x - 0.04, 0.8]], plain('#d02020'));
  for (const x of [0.06, 0.94]) k.dot(x, 0.2, 0.12, '#ffb02f');
});
add('bollards', 'Bolardos', 'cy_street', 2, 0.4, 'bolardo pivote', (k) => {
  for (let i = 0; i < 4; i++) {
    const x = 0.12 + i * 0.25;
    k.disc(x, 0.5, 0.36, DARK, { shadow: true });
    k.ring(x, 0.5, 0.22, '#e8c21c', 0.1);
  }
});
add('manhole', 'Alcantarilla', 'cy_street', 0.8, 0.8, 'alcantarilla tapa', (k) => {
  k.disc(0.5, 0.5, 0.45, metal('#3a3d42'));
  for (const r of [0.34, 0.22]) k.ring(0.5, 0.5, r, '#22252a', 0.03);
  k.stroke([[0.12, 0.5], [0.88, 0.5]], '#22252a', 0.03, false);
  k.stroke([[0.5, 0.12], [0.5, 0.88]], '#22252a', 0.03, false);
}, undefined, 'below_floor');
add('manhole_steam', 'Alcantarilla con Vapor', 'cy_street', 1, 1, 'alcantarilla vapor humo', (k) => {
  k.disc(0.5, 0.5, 0.3, metal('#3a3d42'));
  for (let i = 0; i < 8; i++) k.disc(k.between(0.25, 0.75), k.between(0.2, 0.7), k.between(0.12, 0.2), plain('rgba(220,225,235,0.22)'), { edge: false });
}, undefined, 'above_walls');
add('drain', 'Rejilla de Desagüe', 'cy_street', 0.8, 0.3, 'desague rejilla', (k) => {
  k.rect(0.02, 0.1, 0.96, 0.8, metal('#2a2d32'), 0.04);
  for (let x = 0.08; x < 0.95; x += 0.08) k.rect(x, 0.2, 0.04, 0.6, plain('#0a0b0c'), 0.01);
}, undefined, 'below_floor');
for (const [cid, cname, hex] of [['red', 'Rojo', '#b82230'], ['blue', 'Azul', '#2350a8']] as const) {
  add(`news_box_${cid}`, `Quiosco de Noticias ${cname}`, 'cy_street', 0.6, 0.5, 'periodico noticias', (k) => {
    k.rect(0.06, 0.08, 0.88, 0.84, metal(hex), 0.06, { shadow: true });
    screen(k, 0.16, 0.2, 0.68, 0.4, '#e8f4ff', 3);
  });
}
add('mailbox', 'Buzón de Paquetes', 'cy_street', 0.8, 0.6, 'buzon paquetes', (k) => {
  k.rect(0.04, 0.08, 0.92, 0.84, metal('#e8b81c'), 0.06, { shadow: true });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) k.rect(0.1 + c * 0.28, 0.16 + r * 0.38, 0.24, 0.32, metal('#c49a14'), 0.02);
});
add('kiosk', 'Kiosco Holográfico', 'cy_street', 1.5, 1.5, 'kiosco tienda', (k) => {
  k.disc(0.5, 0.5, 0.46, DARK, { shadow: true });
  k.disc(0.5, 0.5, 0.36, metal('#3a2a50'));
  k.glow(0.5, 0.5, 0.3, '#b14bff', 0.7);
  around(6, 0.4, (x, y) => k.stud(x, y, 0.04, '#b14bff'));
}, ['#b14bff', 3, 0.6]);
const STALLS: [string, string, string, string[]][] = [
  ['ramen', 'Puesto de Ramen', '#ff3b4a', ['#f2e6c8', '#e8b81c']],
  ['taco', 'Puesto de Tacos', '#ffb02f', ['#d89a3a', '#3a8a2a']],
  ['sushi', 'Puesto de Sushi', '#2fe8ff', ['#f2f0ea', '#e0661c']],
  ['kebab', 'Puesto de Kebab', '#3fff8a', ['#a86a3a', '#e8e6e0']],
  ['noodle_cart', 'Carrito de Fideos', '#ff3fb0', ['#f2e6c8', '#c82020']],
];
for (const [id, name, glow, food] of STALLS) {
  add(`stall_${id}`, name, 'cy_street', 2.2, 1.4, 'comida puesto callejero', (k) => {
    k.rect(0.02, 0.04, 0.96, 0.36, cloth(tint(glow, -100)), 0.04, { shadow: true });
    neon(k, [[0.06, 0.38], [0.94, 0.38]], glow, 0.05);
    k.rect(0.04, 0.44, 0.92, 0.5, metal('#3a3e46'), 0.04, { shadow: true });
    for (let i = 0; i < 5; i++) {
      const x = 0.14 + i * 0.18;
      k.disc(x, 0.68, 0.12, plain('#e8e6e0'), { shadow: true });
      k.dot(x, 0.68, 0.08, food[i % food.length]);
    }
    k.glow(0.5, 0.2, 0.5, glow, 0.35);
  }, [glow, 3, 0.6]);
}
add('trash_pile', 'Montón de Basura', 'cy_street', 1.4, 1.2, 'basura bolsas', (k) => {
  for (let i = 0; i < 7; i++) k.lump(k.between(0.25, 0.75), k.between(0.25, 0.75), k.between(0.14, 0.22), plain(k.pick(['#1c1c1e', '#2a2c30', '#3a3d42'])), 8, 0.25, { shadow: true });
  for (let i = 0; i < 6; i++) k.rect(k.between(0.1, 0.8), k.between(0.1, 0.8), 0.1, 0.08, plain(k.pick(['#c8b890', '#e8e6e0', '#b82230'])), 0.01, { turn: k.between(0, 3) });
});
add('trash_bags', 'Bolsas de Basura', 'cy_street', 1, 0.8, 'basura bolsas', (k) => {
  for (const [x, y, r] of [[0.32, 0.4, 0.28], [0.66, 0.5, 0.3], [0.42, 0.7, 0.22]]) {
    k.lump(x, y, r, plain('#18181a'), 9, 0.15, { shadow: true });
    k.dot(x - r * 0.3, y - r * 0.3, r * 0.2, 'rgba(255,255,255,0.15)');
  }
});
add('power_box', 'Caja Eléctrica', 'cy_street', 0.8, 0.5, 'electricidad cuadro', (k) => {
  k.rect(0.04, 0.06, 0.92, 0.88, STEEL, 0.04, { shadow: true });
  k.poly([[0.5, 0.2], [0.38, 0.52], [0.52, 0.52], [0.44, 0.82], [0.64, 0.44], [0.5, 0.44]], plain('#e8c21c'));
});
add('payphone', 'Teléfono Público', 'cy_street', 0.6, 0.5, 'telefono cabina', (k) => {
  k.rect(0.08, 0.08, 0.84, 0.84, metal('#2a5a8a'), 0.08, { shadow: true });
  screen(k, 0.2, 0.2, 0.6, 0.3, '#2fe8ff', 2);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) k.dot(0.3 + c * 0.2, 0.62 + r * 0.14, 0.04, '#c0c8d0');
});
add('fire_escape', 'Escalera de Incendios', 'cy_street', 1.2, 2.4, 'escalera incendios', (k) => {
  k.rect(0.04, 0.02, 0.92, 0.96, plain('rgba(30,30,34,0.85)'), 0.02, { shadow: true });
  for (let y = 0.06; y < 0.96; y += 0.06) k.stroke([[0.08, y], [0.92, y]], '#5a606a', 0.04, false);
  k.stroke([[0.1, 0.02], [0.1, 0.98]], '#3a3e46', 0.05);
  k.stroke([[0.9, 0.02], [0.9, 0.98]], '#3a3e46', 0.05);
}, undefined, 'above_walls');

// ======================= Signs & ads =======================
const SIGN_SHAPES: [string, string, (k: Kit, c: string) => void][] = [
  ['bar', 'Neón BAR', (k, c) => {
    neon(k, [[0.1, 0.25], [0.1, 0.75], [0.25, 0.65], [0.1, 0.5], [0.25, 0.35], [0.1, 0.25]], c);
    neon(k, [[0.35, 0.75], [0.48, 0.25], [0.6, 0.75]], c);
    neon(k, [[0.41, 0.55], [0.55, 0.55]], c);
    neon(k, [[0.7, 0.75], [0.7, 0.25], [0.88, 0.35], [0.7, 0.5], [0.9, 0.75]], c);
  }],
  ['cat', 'Neón Gato', (k, c) => {
    neonLoop(k, [[0.25, 0.85], [0.2, 0.3], [0.32, 0.12], [0.42, 0.3], [0.58, 0.3], [0.68, 0.12], [0.8, 0.3], [0.75, 0.85]], c);
    for (const x of [0.4, 0.6]) neon(k, [[x, 0.5], [x, 0.56]], c, 0.05);
  }],
  ['heart', 'Neón Corazón', (k, c) => {
    neonLoop(k, [[0.5, 0.85], [0.15, 0.45], [0.2, 0.2], [0.38, 0.15], [0.5, 0.3], [0.62, 0.15], [0.8, 0.2], [0.85, 0.45]], c);
  }],
  ['ramen', 'Neón Ramen', (k, c) => {
    neon(k, [[0.15, 0.45], [0.85, 0.45], [0.75, 0.8], [0.25, 0.8], [0.15, 0.45]], c);
    neon(k, [[0.55, 0.45], [0.75, 0.12]], c);
    neon(k, [[0.62, 0.45], [0.85, 0.15]], c);
  }],
  ['pill', 'Neón Farmacia', (k, c) => {
    neon(k, [[0.5, 0.15], [0.5, 0.85]], c, 0.08);
    neon(k, [[0.15, 0.5], [0.85, 0.5]], c, 0.08);
  }],
  ['arrow', 'Neón Flecha', (k, c) => {
    neon(k, [[0.1, 0.5], [0.85, 0.5]], c);
    neon(k, [[0.6, 0.25], [0.85, 0.5], [0.6, 0.75]], c);
  }],
  ['eye', 'Neón Ojo', (k, c) => {
    neon(k, [[0.1, 0.5], [0.3, 0.3], [0.7, 0.3], [0.9, 0.5], [0.7, 0.7], [0.3, 0.7], [0.1, 0.5]], c);
    k.ctx.save();
    neonLoop(k, [[0.5, 0.38], [0.6, 0.5], [0.5, 0.62], [0.4, 0.5]], c);
    k.ctx.restore();
  }],
  ['star', 'Neón Estrella', (k, c) => {
    const pts: P[] = Array.from({ length: 10 }, (_, i) => {
      const a = -Math.PI / 2 + (i / 10) * TAU;
      const r = i % 2 ? 0.16 : 0.4;
      return [0.5 + Math.cos(a) * r, 0.52 + Math.sin(a) * r];
    });
    neonLoop(k, pts, c);
  }],
  ['open', 'Neón OPEN', (k, c) => {
    neonLoop(k, [[0.05, 0.3], [0.2, 0.3], [0.2, 0.7], [0.05, 0.7]], c);
    neon(k, [[0.28, 0.7], [0.28, 0.3], [0.42, 0.3], [0.42, 0.5], [0.28, 0.5]], c);
    neon(k, [[0.62, 0.3], [0.5, 0.3], [0.5, 0.7], [0.62, 0.7]], c);
    neon(k, [[0.5, 0.5], [0.6, 0.5]], c);
    neon(k, [[0.7, 0.7], [0.7, 0.3], [0.93, 0.7], [0.93, 0.3]], c);
  }],
  ['skull', 'Neón Calavera', (k, c) => {
    neonLoop(k, [[0.25, 0.6], [0.2, 0.35], [0.35, 0.15], [0.65, 0.15], [0.8, 0.35], [0.75, 0.6], [0.65, 0.85], [0.35, 0.85]], c);
    for (const x of [0.38, 0.62]) neonLoop(k, [[x - 0.07, 0.4], [x + 0.07, 0.4], [x, 0.52]], c, 0.025);
  }],
];
const SIGN_COLORS = ['pink', 'cyan', 'purple', 'yellow'];
for (const [shape, name, draw] of SIGN_SHAPES) {
  for (const cid of SIGN_COLORS.slice(0, shape === 'bar' || shape === 'cat' ? 4 : 2)) {
    const [, cname, c] = glowOf(cid);
    add(`sign_${shape}_${cid}`, `${name} ${cname}`, 'cy_signs', 1.6, 1, 'neon cartel letrero', (k) => {
      k.rect(0.02, 0.04, 0.96, 0.92, plain('rgba(12,10,18,0.75)'), 0.08, { shadow: true });
      draw(k, c);
    }, [c, 3, 0.7], 'above_walls');
  }
}
for (const [cid, cname, c] of NEONS.slice(0, 4)) {
  add(`billboard_${cid}`, `Valla Publicitaria ${cname}`, 'cy_signs', 3, 1.2, 'valla anuncio publicidad', (k) => {
    k.rect(0.02, 0.08, 0.96, 0.84, DARK, 0.03, { shadow: true });
    const g = k.ctx.createLinearGradient(0, 0, k.W, k.H);
    g.addColorStop(0, tint(c, -60));
    g.addColorStop(1, '#100c1a');
    k.ctx.fillStyle = g;
    k.ctx.fillRect(0.05 * k.W, 0.16 * k.H, 0.9 * k.W, 0.68 * k.H);
    k.disc(0.25, 0.5, 0.25, plain(tint(c, 40)), { edge: false });
    for (let i = 0; i < 3; i++) k.rect(0.45, 0.28 + i * 0.16, 0.42 - i * 0.1, 0.08, plain('#f2f2f2'), 0.02, { edge: false });
    k.glow(0.5, 0.5, 0.6, c, 0.35);
  }, [c, 4, 0.6], 'above_walls');
  add(`holo_ad_${cid}`, `Anuncio Holográfico ${cname}`, 'cy_signs', 1.6, 1.6, 'holograma anuncio', (k) => {
    k.disc(0.5, 0.5, 0.18, DARK, { shadow: true });
    k.glow(0.5, 0.5, 0.48, c, 0.55);
    k.ctx.save();
    k.ctx.globalAlpha = 0.75;
    neonLoop(k, [[0.5, 0.12], [0.86, 0.5], [0.5, 0.88], [0.14, 0.5]], c, 0.03);
    k.ctx.restore();
    k.dot(0.5, 0.5, 0.08, '#ffffff');
  }, [c, 3.5, 0.6], 'above_walls');
}
for (const [i, colors] of [['#ff3fb0', '#2fe8ff', '#ffe12f'], ['#3fff8a', '#b14bff', '#ff8a2f'], ['#e8e6e0', '#ff3b4a', '#3f7bff'], ['#ffe12f', '#ff3fb0', '#1c1c1c'], ['#2fe8ff', '#3fff8a', '#e8e6e0']].entries()) {
  add(`graffiti_${i + 1}`, `Grafiti ${i + 1}`, 'cy_signs', 2, 1.4, 'grafiti pintada', (k) => {
    for (let s = 0; s < 4; s++) {
      const pts: P[] = Array.from({ length: 5 }, (_, j) => [0.1 + j * 0.2, k.between(0.2, 0.8)]);
      k.stroke(pts, colors[s % 3], k.between(0.05, 0.1), s === 0, true);
    }
    for (let d = 0; d < 10; d++) k.dot(k.between(0.05, 0.95), k.between(0.05, 0.95), 0.015, colors[d % 3]);
  }, undefined, 'below_floor');
}
add('street_sign', 'Señal de Calle', 'cy_signs', 1, 0.5, 'senal calle', (k) => {
  k.rect(0.04, 0.2, 0.92, 0.6, metal('#1f6a3a'), 0.05, { shadow: true });
  for (let i = 0; i < 4; i++) k.rect(0.12 + i * 0.18, 0.38, 0.12, 0.24, plain('#f2f2f2'), 0.01, { edge: false });
});
add('hazard_sign', 'Señal de Peligro', 'cy_signs', 0.8, 0.8, 'peligro radiacion aviso', (k) => {
  k.poly([[0.5, 0.06], [0.95, 0.9], [0.05, 0.9]], plain('#e8c21c'), { shadow: true });
  k.dot(0.5, 0.62, 0.08, '#111');
  around(3, 0.16, (x, y, a) => k.poly([[0.5, 0.62], [0.5 + Math.cos(a - 0.4) * 0.22, 0.62 + Math.sin(a - 0.4) * 0.22], [0.5 + Math.cos(a + 0.4) * 0.22, 0.62 + Math.sin(a + 0.4) * 0.22]], plain('#111')), -Math.PI / 2);
});

// ======================= Home =======================
for (const [cid, cname, glow] of NEONS.slice(0, 3)) {
  add(`capsule_bed_${cid}`, `Cápsula Dormitorio ${cname}`, 'cy_home', 1.2, 2.2, 'cama capsula hotel', (k) => {
    k.rect(0.02, 0.02, 0.96, 0.96, DARK, 0.2, { shadow: true });
    k.rect(0.1, 0.08, 0.8, 0.84, cloth('#2a2836'), 0.15);
    k.rect(0.2, 0.12, 0.6, 0.16, cloth('#d8d4e2'), 0.2, { shadow: true });
    neonLoop(k, [[0.06, 0.04], [0.94, 0.04], [0.94, 0.96], [0.06, 0.96]], glow, 0.035);
    screen(k, 0.3, 0.75, 0.4, 0.14, glow, 2);
  }, [glow, 2, 0.5]);
}
for (const [cid, cname, hex] of [paint('purple'), paint('black'), paint('white'), paint('red')]) {
  add(`bed_${cid}`, `Cama Moderna ${cname}`, 'cy_home', 2, 2.2, 'cama dormitorio', (k) => {
    k.rect(0.02, 0.02, 0.96, 0.96, DARK, 0.06, { shadow: true });
    k.rect(0.06, 0.1, 0.88, 0.86, cloth('#e8e6ee'), 0.06);
    for (const x of [0.12, 0.52]) k.rect(x, 0.12, 0.36, 0.16, cloth('#f6f4fa'), 0.2, { shadow: true });
    k.rect(0.04, 0.38, 0.92, 0.58, cloth(hex), 0.06, { shadow: true });
    neon(k, [[0.04, 0.04], [0.96, 0.04]], '#b14bff', 0.03);
  });
}
for (const [cid, cname, hex] of [paint('black'), paint('purple'), paint('cyan'), paint('white')]) {
  add(`sofa_${cid}`, `Sofá ${cname}`, 'cy_home', 2.2, 1, 'sofa salon', (k) => {
    k.rect(0.02, 0.06, 0.96, 0.88, cloth(tint(hex, -25)), 0.25, { shadow: true });
    k.rect(0.04, 0.08, 0.92, 0.3, cloth(hex), 0.2);
    for (let i = 0; i < 3; i++) k.rect(0.14 + i * 0.245, 0.38, 0.235, 0.5, cloth(hex), 0.15, { shadow: true });
    neon(k, [[0.06, 0.92], [0.94, 0.92]], '#2fe8ff', 0.04);
  });
}
for (const [cid, cname, hex] of [paint('red'), paint('black'), paint('cyan')]) {
  add(`gaming_chair_${cid}`, `Silla Gaming ${cname}`, 'cy_home', 0.8, 0.9, 'silla gamer escritorio', (k) => {
    around(5, 0.38, (x, y) => k.disc(x, y, 0.06, plain('#151517')), -Math.PI / 2);
    k.rect(0.2, 0.3, 0.6, 0.55, cloth('#1c1d22'), 0.2, { shadow: true });
    k.rect(0.22, 0.06, 0.56, 0.3, cloth('#1c1d22'), 0.2, { shadow: true });
    for (const x of [0.28, 0.66]) k.rect(x, 0.08, 0.06, 0.74, cloth(hex), 0.03, { edge: false });
    for (const x of [0.1, 0.82]) k.rect(x, 0.36, 0.08, 0.4, DARK, 0.04);
  });
}
add('office_chair', 'Silla de Oficina', 'cy_home', 0.7, 0.7, 'silla oficina', (k) => {
  around(5, 0.4, (x, y) => k.disc(x, y, 0.07, plain('#151517')), -Math.PI / 2);
  k.disc(0.5, 0.55, 0.3, cloth('#3a3e46'), { shadow: true });
  k.rect(0.24, 0.08, 0.52, 0.18, cloth('#2a2d32'), 0.1, { shadow: true });
});
for (const [n, name] of [[1, 'Escritorio Hacker'], [3, 'Puesto Netrunner']] as const) {
  add(`desk_${n}`, name, 'cy_home', 2, 1, 'escritorio ordenador pantallas', (k) => {
    k.rect(0.02, 0.06, 0.96, 0.88, metal('#2a2d33'), 0.04, { shadow: true });
    for (let i = 0; i < n; i++) {
      const x = n === 1 ? 0.35 : 0.1 + i * 0.28;
      k.rect(x, 0.1, 0.26, 0.12, DARK, 0.02);
      screen(k, x + 0.02, 0.12, 0.22, 0.08, k.pick(['#2fe8ff', '#3fff8a', '#ff3fb0']), 1);
    }
    k.rect(0.32, 0.5, 0.36, 0.16, plain('#121316'), 0.03);
    for (let i = 0; i < 12; i++) k.dot(0.35 + (i % 6) * 0.06, 0.55 + Math.floor(i / 6) * 0.06, 0.012, '#b14bff');
    k.disc(0.78, 0.58, 0.06, plain('#121316'));
    k.disc(0.15, 0.7, 0.08, metal('#e8e6e0'), { shadow: true });
  }, ['#2fe8ff', 2, 0.4]);
}
add('glass_table', 'Mesa de Cristal', 'cy_home', 1.6, 1, 'mesa cristal salon', (k) => {
  k.rect(0.04, 0.08, 0.92, 0.84, liquid('rgba(150,200,230,0.55)'), 0.1, { shadow: true });
  k.stroke([[0.2, 0.75], [0.4, 0.25]], 'rgba(255,255,255,0.6)', 0.04, false);
  k.disc(0.7, 0.5, 0.1, plain('#1a1a1c'), { shadow: true });
});
add('dining_table', 'Mesa de Comedor', 'cy_home', 2, 1.2, 'mesa comedor', (k) => {
  for (const x of [0.15, 0.5, 0.85]) for (const y of [0.04, 0.96]) k.disc(x, y, 0.12, cloth('#3a3e46'), { shadow: true });
  k.rect(0.04, 0.14, 0.92, 0.72, plain('#e8e8ec'), 0.06, { shadow: true });
  for (const x of [0.15, 0.5, 0.85]) for (const y of [0.3, 0.7]) k.disc(x, y, 0.1, plain('#ffffff'));
});
add('bar_stool', 'Taburete Alto', 'cy_home', 0.5, 0.5, 'taburete barra', (k) => {
  k.disc(0.5, 0.5, 0.42, CHROME, { shadow: true });
  k.disc(0.5, 0.5, 0.32, cloth('#b82230'));
});
add('kitchen', 'Cocina Compacta', 'cy_home', 3, 0.8, 'cocina encimera', (k) => {
  k.rect(0.01, 0.04, 0.98, 0.92, plain('#d8dce2'), 0.03, { shadow: true });
  for (const x of [0.12, 0.24]) {
    k.ring(x, 0.5, 0.14, '#1a1a1c', 0.06);
    k.ring(x, 0.5, 0.08, '#ff6a14', 0.02);
  }
  k.rect(0.42, 0.2, 0.18, 0.6, metal('#9aa2ac'), 0.05);
  k.rect(0.44, 0.26, 0.14, 0.48, liquid('#4a6a80'), 0.05);
  k.rect(0.7, 0.2, 0.25, 0.6, plain('#2a2d33'), 0.03);
  screen(k, 0.74, 0.3, 0.16, 0.2, '#3fff8a', 1);
});
add('fridge', 'Nevera Inteligente', 'cy_home', 0.9, 0.8, 'nevera frigorifico', (k) => {
  k.rect(0.04, 0.06, 0.92, 0.88, CHROME, 0.06, { shadow: true });
  k.stroke([[0.5, 0.08], [0.5, 0.92]], '#5a606a', 0.03, false);
  screen(k, 0.58, 0.2, 0.3, 0.3, '#2fe8ff', 2);
});
for (const [cid, cname, glow] of [glowOf('cyan'), glowOf('pink')]) {
  add(`tv_${cid}`, `Pantalla Mural ${cname}`, 'cy_home', 2.4, 0.4, 'television pantalla', (k) => {
    k.rect(0.01, 0.1, 0.98, 0.8, DARK, 0.03, { shadow: true });
    screen(k, 0.03, 0.2, 0.94, 0.6, glow, 1);
  }, [glow, 2.5, 0.5], 'above_walls');
}
add('holo_tv', 'Proyector Holo de Salón', 'cy_home', 1.2, 1.2, 'holograma television', (k) => {
  k.disc(0.5, 0.5, 0.2, DARK, { shadow: true });
  k.glow(0.5, 0.5, 0.48, '#2fe8ff', 0.6);
  neonLoop(k, [[0.25, 0.25], [0.75, 0.25], [0.75, 0.75], [0.25, 0.75]], '#2fe8ff', 0.02);
  k.dot(0.5, 0.5, 0.06, '#e8ffff');
}, ['#2fe8ff', 2.5, 0.5]);
add('shelf_metal', 'Estantería Metálica', 'cy_home', 2, 0.6, 'estanteria almacen', (k) => {
  k.rect(0.01, 0.04, 0.98, 0.92, STEEL, 0.03, { shadow: true });
  for (let i = 0; i < 9; i++) k.rect(0.04 + i * 0.105, 0.15, 0.09, 0.7, plain(k.pick(['#e8e6e0', '#3a3e46', '#b82230', '#2350a8', '#e8b81c'])), 0.02, { shadow: true });
});
add('wardrobe', 'Armario Empotrado', 'cy_home', 1.8, 0.7, 'armario ropa', (k) => {
  k.rect(0.01, 0.04, 0.98, 0.92, metal('#2a2d33'), 0.03, { shadow: true });
  for (const x of [0.03, 0.51]) k.rect(x, 0.1, 0.46, 0.8, liquid('#3a2a50'), 0.02);
  neon(k, [[0.03, 0.92], [0.97, 0.92]], '#b14bff', 0.05);
});
add('toilet', 'Inodoro Inteligente', 'cy_home', 0.6, 0.8, 'baño inodoro', (k) => {
  k.rect(0.12, 0.04, 0.76, 0.26, plain('#eef0f4'), 0.08, { shadow: true });
  k.oval(0.5, 0.62, 0.34, 0.32, plain('#f6f8fa'), { shadow: true });
  k.oval(0.5, 0.64, 0.2, 0.2, liquid('#7ac8e0'));
  k.dot(0.5, 0.17, 0.06, '#2fe8ff');
});
add('shower', 'Ducha de Cristal', 'cy_home', 1, 1, 'ducha baño', (k) => {
  k.rect(0.04, 0.04, 0.92, 0.92, plain('#c8d4dc'), 0.04, { shadow: true });
  k.rect(0.1, 0.1, 0.8, 0.8, liquid('rgba(120,180,210,0.6)'), 0.03);
  k.disc(0.5, 0.5, 0.06, CHROME);
  k.disc(0.5, 0.2, 0.1, CHROME, { shadow: true });
});
add('bathtub', 'Bañera Moderna', 'cy_home', 1, 1.8, 'bañera baño', (k) => {
  k.rect(0.04, 0.02, 0.92, 0.96, plain('#f2f4f8'), 0.3, { shadow: true });
  k.rect(0.14, 0.1, 0.72, 0.8, liquid('#5ab8d8'), 0.28);
  neonLoop(k, [[0.06, 0.04], [0.94, 0.04], [0.94, 0.96], [0.06, 0.96]], '#2fe8ff', 0.025);
});
add('sink', 'Lavabo Flotante', 'cy_home', 0.9, 0.5, 'lavabo baño', (k) => {
  k.rect(0.04, 0.08, 0.92, 0.84, plain('#eef0f4'), 0.2, { shadow: true });
  k.oval(0.5, 0.55, 0.3, 0.26, liquid('#9ad0e0'));
  k.rect(0.46, 0.08, 0.08, 0.3, CHROME, 0.02);
});
for (const [cid, cname, leaf] of [['monstera', 'Monstera', '#2a7a3a'], ['cactus', 'Cactus', '#4a8a3a'], ['bonsai', 'Bonsái', '#3a6a2a']] as const) {
  add(`plant_${cid}`, `Maceta ${cname}`, 'cy_home', 0.8, 0.8, 'planta maceta', (k) => {
    k.disc(0.5, 0.5, 0.3, plain('#e8e6e0'), { shadow: true });
    k.foliage(0.5, 0.5, 0.36, [tint(leaf, -30), leaf, tint(leaf, 30)], 40, 0.09);
  });
}
for (const [cid, cname, glow] of NEONS.slice(0, 4)) {
  add(`rug_${cid}`, `Alfombra Neón ${cname}`, 'cy_home', 3, 2, 'alfombra salon', (k) => {
    k.rect(0.02, 0.04, 0.96, 0.92, cloth('#16141e'), 0.04);
    neonLoop(k, [[0.06, 0.1], [0.94, 0.1], [0.94, 0.9], [0.06, 0.9]], glow, 0.02);
    neonLoop(k, [[0.5, 0.2], [0.8, 0.5], [0.5, 0.8], [0.2, 0.5]], glow, 0.02);
  }, undefined, 'below_floor');
}
for (const [cid, cname, glow] of NEONS.slice(0, 3)) {
  add(`floor_lamp_${cid}`, `Lámpara de Pie ${cname}`, 'cy_home', 0.6, 0.6, 'lampara pie', (k) => {
    k.glow(0.5, 0.5, 0.5, glow, 0.6);
    k.disc(0.5, 0.5, 0.3, DARK, { shadow: true });
    k.disc(0.5, 0.5, 0.18, plain(tint(glow, 40)));
  }, [glow, 3, 0.6]);
}
for (const [cid, cname, hex] of [paint('pink'), paint('cyan'), paint('yellow')]) {
  add(`beanbag_${cid}`, `Puf ${cname}`, 'cy_home', 1, 1, 'puf sillon', (k) => {
    k.lump(0.5, 0.5, 0.45, cloth(hex), 12, 0.08, { shadow: true });
    k.lump(0.45, 0.45, 0.25, cloth(tint(hex, 25)), 10, 0.15);
  });
}
add('aquarium', 'Acuario', 'cy_home', 2, 0.7, 'pecera acuario', (k) => {
  k.rect(0.01, 0.04, 0.98, 0.92, DARK, 0.04, { shadow: true });
  k.rect(0.04, 0.12, 0.92, 0.76, liquid('#1a6a9a'), 0.02);
  for (let i = 0; i < 7; i++) k.oval(k.between(0.1, 0.9), k.between(0.25, 0.75), 0.04, 0.025, plain(k.pick(['#ff8a2f', '#ffe12f', '#ff3fb0', '#2fe8ff'])));
  k.glow(0.5, 0.5, 0.5, '#2fa8ff', 0.4);
}, ['#2fa8ff', 2, 0.5]);
add('mirror', 'Espejo LED', 'cy_home', 1, 0.3, 'espejo', (k) => {
  k.rect(0.02, 0.1, 0.96, 0.8, liquid('#a8c8d8'), 0.2, { shadow: true });
  neonLoop(k, [[0.04, 0.14], [0.96, 0.14], [0.96, 0.86], [0.04, 0.86]], '#f2f2ff', 0.04);
}, undefined, 'above_walls');

// ======================= Tech =======================
for (const [cid, cname, glow] of [glowOf('green'), glowOf('cyan'), glowOf('red')]) {
  add(`server_rack_${cid}`, `Rack de Servidores ${cname}`, 'cy_tech', 0.9, 1.2, 'servidor ordenador datos', (k) => {
    k.rect(0.04, 0.03, 0.92, 0.94, DARK, 0.04, { shadow: true });
    for (let i = 0; i < 9; i++) {
      const y = 0.07 + i * 0.1;
      k.rect(0.1, y, 0.8, 0.08, metal('#30343c'), 0.01);
      for (let j = 0; j < 4; j++) k.dot(0.18 + j * 0.06, y + 0.04, 0.02, k.rand() > 0.3 ? glow : '#ffb02f');
    }
  }, [glow, 1.5, 0.4]);
}
add('workstation', 'Estación de Trabajo', 'cy_tech', 1.6, 1.2, 'ordenador estacion', (k) => {
  k.rect(0.02, 0.04, 0.96, 0.92, metal('#2a2d33'), 0.1, { shadow: true });
  for (const [x, t] of [[0.18, -0.3], [0.5, 0], [0.82, 0.3]] as const) {
    k.rect(x - 0.13, 0.1, 0.26, 0.1, DARK, 0.02, { turn: t });
  }
  for (const [x] of [[0.18], [0.5], [0.82]]) screen(k, x - 0.11, 0.12, 0.22, 0.06, '#2fe8ff', 1);
  k.disc(0.5, 0.7, 0.14, cloth('#3a3e46'), { shadow: true });
}, ['#2fe8ff', 2, 0.4]);
for (const [cid, cname, glow] of [glowOf('green'), glowOf('cyan'), glowOf('orange')]) {
  add(`terminal_${cid}`, `Terminal ${cname}`, 'cy_tech', 0.8, 0.6, 'terminal consola pc', (k) => {
    k.rect(0.04, 0.08, 0.92, 0.84, metal('#3a3e46'), 0.06, { shadow: true });
    screen(k, 0.12, 0.16, 0.76, 0.45, glow, 4);
    for (let i = 0; i < 8; i++) k.dot(0.2 + (i % 4) * 0.2, 0.72 + Math.floor(i / 4) * 0.1, 0.03, '#9aa2ac');
  }, [glow, 1.5, 0.4]);
}
for (const [cid, cname, glow] of NEONS.slice(0, 4)) {
  add(`holo_projector_${cid}`, `Proyector Holográfico ${cname}`, 'cy_tech', 1.2, 1.2, 'holograma proyector', (k) => {
    k.glow(0.5, 0.5, 0.5, glow, 0.5);
    k.disc(0.5, 0.5, 0.22, DARK, { shadow: true });
    k.ring(0.5, 0.5, 0.16, glow, 0.03);
    k.ctx.save();
    k.ctx.globalAlpha = 0.6;
    around(3, 0.3, (x, y) => k.dot(x, y, 0.06, glow), -Math.PI / 2);
    k.ctx.restore();
    k.dot(0.5, 0.5, 0.06, '#ffffff');
  }, [glow, 2.5, 0.6]);
}
add('robot_arm', 'Brazo Robótico', 'cy_tech', 1.4, 1.4, 'robot brazo fabrica', (k) => {
  k.disc(0.5, 0.7, 0.24, metal('#e8b81c'), { shadow: true });
  k.stroke([[0.5, 0.7], [0.3, 0.35], [0.7, 0.18]], '#e8b81c', 0.12);
  for (const [x, y] of [[0.5, 0.7], [0.3, 0.35]]) k.disc(x, y, 0.08, DARK);
  k.stroke([[0.7, 0.18], [0.82, 0.1]], '#3a3e46', 0.05);
  k.stroke([[0.7, 0.18], [0.84, 0.24]], '#3a3e46', 0.05);
});
add('charging_station', 'Electrolinera', 'cy_tech', 0.8, 0.6, 'cargador coche electrico', (k) => {
  k.rect(0.1, 0.08, 0.8, 0.84, metal('#e8eaee'), 0.1, { shadow: true });
  screen(k, 0.22, 0.18, 0.56, 0.3, '#3fff8a', 2);
  k.stroke([[0.8, 0.6], [0.98, 0.9], [0.7, 0.98]], '#1a1a1c', 0.06, true, true);
}, ['#3fff8a', 1.5, 0.4]);
add('battery', 'Batería Industrial', 'cy_tech', 1, 0.7, 'bateria energia', (k) => {
  k.rect(0.04, 0.08, 0.92, 0.84, metal('#2a2d33'), 0.06, { shadow: true });
  for (let i = 0; i < 5; i++) k.rect(0.1 + i * 0.17, 0.2, 0.14, 0.6, plain(i < 4 ? '#3fff8a' : '#1a3a24'), 0.02, { edge: false });
}, ['#3fff8a', 1.2, 0.3]);
add('generator', 'Generador', 'cy_tech', 1.6, 1, 'generador energia', (k) => {
  k.rect(0.02, 0.06, 0.96, 0.88, metal('#4a5260'), 0.05, { shadow: true });
  for (const x of [0.22, 0.5]) {
    k.disc(x, 0.5, 0.3, DARK);
    around(6, 0.18, (px, py) => k.stroke([[x, 0.5], [x + (px - 0.5) * 0.9, 0.5 + (py - 0.5) * 0.9]], '#8a9098', 0.03, false));
  }
  screen(k, 0.72, 0.2, 0.2, 0.3, '#ffb02f', 2);
});
for (const [cid, cname, glow] of [glowOf('cyan'), glowOf('green')]) {
  add(`reactor_${cid}`, `Núcleo de Reactor ${cname}`, 'cy_tech', 2.4, 2.4, 'reactor energia nucleo', (k) => {
    k.disc(0.5, 0.5, 0.46, metal('#3a3e46'), { shadow: true });
    around(8, 0.4, (x, y) => k.stud(x, y, 0.04, '#9aa2ac'));
    k.disc(0.5, 0.5, 0.3, DARK);
    k.glow(0.5, 0.5, 0.45, glow, 0.9);
    k.disc(0.5, 0.5, 0.16, plain(tint(glow, 60)), { edge: false });
    k.ring(0.5, 0.5, 0.22, glow, 0.03);
  }, [glow, 6, 0.9]);
}
add('cable_spool', 'Bobina de Cable', 'cy_tech', 1.2, 1.2, 'bobina cable', (k) => {
  k.disc(0.5, 0.5, 0.46, wood('#8a5c34'), { shadow: true });
  for (let r = 0.38; r > 0.14; r -= 0.04) k.ring(0.5, 0.5, r, '#1a1a1c', 0.03);
  k.disc(0.5, 0.5, 0.1, wood('#6a4424'));
});
add('drone_dock', 'Plataforma de Drones', 'cy_tech', 1.6, 1.6, 'dron base aterrizaje', (k) => {
  k.disc(0.5, 0.5, 0.47, metal('#2a2d33'), { shadow: true });
  k.ring(0.5, 0.5, 0.38, '#e8c21c', 0.03);
  k.ctx.save();
  k.ctx.font = `bold ${k.m * 0.3}px sans-serif`;
  k.ctx.fillStyle = '#e8c21c';
  k.ctx.textAlign = 'center';
  k.ctx.textBaseline = 'middle';
  k.ctx.fillText('D', k.W / 2, k.H / 2);
  k.ctx.restore();
  around(8, 0.44, (x, y) => k.dot(x, y, 0.025, '#3fff8a'));
});
add('printer_3d', 'Impresora 3D', 'cy_tech', 1, 1, 'impresora fabricacion', (k) => {
  k.rect(0.06, 0.06, 0.88, 0.88, metal('#2a2d33'), 0.06, { shadow: true });
  k.rect(0.16, 0.16, 0.68, 0.68, liquid('rgba(150,190,220,0.45)'), 0.03);
  k.stroke([[0.16, 0.45], [0.84, 0.45]], '#9aa2ac', 0.03, false);
  k.disc(0.5, 0.45, 0.06, plain('#ff6a14'));
  k.lump(0.5, 0.62, 0.12, plain('#2fe8ff'), 6, 0.1);
});
add('med_pod', 'Cápsula Médica', 'cy_tech', 1.2, 2.2, 'medico cura hospital', (k) => {
  k.rect(0.04, 0.02, 0.92, 0.96, plain('#eef0f4'), 0.3, { shadow: true });
  k.rect(0.14, 0.08, 0.72, 0.84, liquid('rgba(120,220,200,0.6)'), 0.28);
  k.glow(0.5, 0.5, 0.4, '#3fffd0', 0.5);
  k.rect(0.3, 0.86, 0.4, 0.08, plain('#d02030'), 0.02);
}, ['#3fffd0', 2, 0.5]);
for (const [cid, cname, glow] of [['blue', 'Azul', '#7ad8ff'], ['purple', 'Violeta', '#c08aff']] as const) {
  add(`cryo_pod_${cid}`, `Cápsula Criogénica ${cname}`, 'cy_tech', 1.2, 2.2, 'crio congelacion', (k) => {
    k.rect(0.04, 0.02, 0.92, 0.96, metal('#5a606a'), 0.35, { shadow: true });
    k.rect(0.14, 0.08, 0.72, 0.84, liquid(tint(glow, -60)), 0.32);
    k.glow(0.5, 0.5, 0.45, glow, 0.6);
    for (let i = 0; i < 12; i++) k.dot(k.between(0.2, 0.8), k.between(0.15, 0.85), 0.02, '#ffffff');
  }, [glow, 2, 0.5]);
}
add('ripper_chair', 'Sillón de Implantes', 'cy_tech', 1.2, 2, 'quirofano implantes cyberware', (k) => {
  k.rect(0.2, 0.06, 0.6, 0.88, cloth('#3a2a2a'), 0.2, { shadow: true });
  for (const x of [0.08, 0.92]) k.stroke([[x, 0.3], [x, 0.7]], '#9aa2ac', 0.05);
  k.disc(0.5, 0.06, 0.16, metal('#5a606a'), { shadow: true });
  around(3, 0.2, (x, y) => k.stroke([[0.5, 0.06], [x, 0.06 + (y - 0.5) * 0.4]], '#b4bcc6', 0.03), 0.3);
  k.glow(0.5, 0.06, 0.25, '#ff3b4a', 0.5);
}, ['#ff3b4a', 1.5, 0.4]);
add('monitor_wall', 'Muro de Monitores', 'cy_tech', 3, 0.5, 'pantallas vigilancia', (k) => {
  k.rect(0.01, 0.06, 0.98, 0.88, DARK, 0.03, { shadow: true });
  for (let i = 0; i < 6; i++) screen(k, 0.03 + i * 0.16, 0.18, 0.14, 0.64, k.pick(['#2fe8ff', '#3fff8a', '#ff3fb0', '#ffe12f']), 2);
}, ['#2fe8ff', 2.5, 0.5], 'above_walls');
add('satellite_dish', 'Antena Parabólica', 'cy_tech', 1.4, 1.4, 'antena satelite tejado', (k) => {
  k.disc(0.5, 0.5, 0.46, CHROME, { shadow: true });
  for (const r of [0.36, 0.24, 0.12]) k.ring(0.5, 0.5, r, '#7a828c', 0.015);
  around(3, 0.3, (x, y) => k.stroke([[x, y], [0.5, 0.5]], '#5a606a', 0.025), 0.5);
  k.disc(0.5, 0.5, 0.07, DARK);
}, undefined, 'roof');
add('antenna', 'Mástil de Antenas', 'cy_tech', 0.8, 0.8, 'antena comunicaciones', (k) => {
  k.disc(0.5, 0.5, 0.18, DARK, { shadow: true });
  around(4, 0.4, (x, y) => k.stroke([[0.5, 0.5], [x, y]], '#6a7280', 0.04), Math.PI / 4);
  k.glow(0.5, 0.5, 0.2, '#ff3b4a', 0.8);
  k.dot(0.5, 0.5, 0.06, '#ff3b4a');
}, undefined, 'roof');
for (const [cid, cname, hex, eye] of [['white', 'Blanco', '#e8eaee', '#2fe8ff'], ['chrome', 'Cromado', '#b4bcc6', '#ff3b4a']] as const) {
  add(`android_${cid}`, `Androide Desactivado ${cname}`, 'cy_tech', 1, 1.6, 'robot androide', (k) => {
    for (const x of [0.38, 0.62]) k.rect(x - 0.08, 0.55, 0.16, 0.4, metal(tint(hex, -20)), 0.08, { shadow: true });
    for (const x of [0.15, 0.85]) k.rect(x - 0.07, 0.22, 0.14, 0.38, metal(tint(hex, -20)), 0.08, { shadow: true });
    k.oval(0.5, 0.4, 0.28, 0.2, metal(hex), { shadow: true });
    k.disc(0.5, 0.14, 0.18, metal(hex), { shadow: true });
    k.rect(0.38, 0.11, 0.24, 0.04, plain(eye), 0.02, { edge: false });
    k.glow(0.5, 0.13, 0.12, eye, 0.6);
  });
}
add('robot_dog', 'Perro Robot', 'cy_tech', 0.8, 1.2, 'robot perro', (k) => {
  for (const [x, y] of [[0.22, 0.3], [0.78, 0.3], [0.22, 0.75], [0.78, 0.75]]) k.stroke([[0.5, y], [x, y + 0.05]], '#3a3e46', 0.08);
  k.rect(0.26, 0.2, 0.48, 0.65, metal('#e8b81c'), 0.2, { shadow: true });
  k.rect(0.32, 0.04, 0.36, 0.2, metal('#2a2d33'), 0.1, { shadow: true });
  k.dot(0.5, 0.1, 0.05, '#2fe8ff');
});
add('cleaning_bot', 'Robot Limpiador', 'cy_tech', 0.6, 0.6, 'robot aspiradora', (k) => {
  k.disc(0.5, 0.5, 0.45, metal('#2a2d33'), { shadow: true });
  k.ring(0.5, 0.5, 0.32, '#5a606a', 0.03);
  k.dot(0.5, 0.25, 0.06, '#3fff8a');
});
add('security_bot', 'Robot de Seguridad', 'cy_tech', 1, 1, 'robot guardia', (k) => {
  k.disc(0.5, 0.5, 0.44, metal('#eef0f4'), { shadow: true });
  k.disc(0.5, 0.5, 0.3, DARK);
  k.rect(0.3, 0.42, 0.4, 0.08, plain('#3f7bff'), 0.03, { edge: false });
  k.glow(0.5, 0.46, 0.25, '#3f7bff', 0.6);
}, ['#3f7bff', 1.5, 0.4]);

// ======================= Nightlife =======================
for (const [cid, cname, glow] of NEONS.slice(0, 6)) {
  add(`arcade_${cid}`, `Máquina Arcade ${cname}`, 'cy_nightlife', 0.9, 0.9, 'arcade recreativa juego', (k) => {
    k.rect(0.06, 0.04, 0.88, 0.92, metal(tint(glow, -150)), 0.06, { shadow: true });
    screen(k, 0.16, 0.1, 0.68, 0.4, glow, 0);
    k.rect(0.2, 0.25, 0.1, 0.1, plain('#ffffff'), 0.01, { edge: false });
    k.rect(0.1, 0.58, 0.8, 0.3, DARK, 0.04);
    k.disc(0.3, 0.73, 0.06, plain('#d02020'));
    for (const x of [0.55, 0.68, 0.81]) k.dot(x, 0.73, 0.04, k.pick(['#2fe8ff', '#ffe12f', '#3fff8a']));
    neonLoop(k, [[0.06, 0.04], [0.94, 0.04], [0.94, 0.96], [0.06, 0.96]], glow, 0.025);
  }, [glow, 2, 0.6]);
}
for (const [cid, cname, glow] of [glowOf('pink'), glowOf('yellow')]) {
  add(`pachinko_${cid}`, `Pachinko ${cname}`, 'cy_nightlife', 0.9, 0.7, 'pachinko juego apuestas', (k) => {
    k.rect(0.06, 0.06, 0.88, 0.88, metal('#2a2d33'), 0.08, { shadow: true });
    k.disc(0.5, 0.45, 0.32, liquid(tint(glow, -90)));
    for (let i = 0; i < 20; i++) k.dot(k.between(0.25, 0.75), k.between(0.2, 0.7), 0.015, '#d8dce2');
    neon(k, [[0.12, 0.86], [0.88, 0.86]], glow, 0.05);
  }, [glow, 1.5, 0.5]);
}
add('slot_machine', 'Tragaperras', 'cy_nightlife', 0.8, 0.7, 'tragaperras casino', (k) => {
  k.rect(0.06, 0.06, 0.88, 0.88, metal('#c49a2a'), 0.08, { shadow: true });
  for (let i = 0; i < 3; i++) {
    k.rect(0.14 + i * 0.25, 0.22, 0.2, 0.3, plain('#f2f2ee'), 0.02);
    k.dot(0.24 + i * 0.25, 0.37, 0.06, k.pick(['#d02020', '#2350a8', '#e8b81c']));
  }
  k.glow(0.5, 0.4, 0.4, '#ffe12f', 0.4);
}, ['#ffe12f', 1.5, 0.5]);
add('jukebox', 'Jukebox', 'cy_nightlife', 1, 0.7, 'musica jukebox', (k) => {
  k.rect(0.06, 0.06, 0.88, 0.88, cloth('#8a1a2a'), 0.35, { shadow: true });
  k.rect(0.2, 0.18, 0.6, 0.4, liquid('#ffe0a0'), 0.25);
  neonLoop(k, [[0.1, 0.9], [0.1, 0.35], [0.5, 0.1], [0.9, 0.35], [0.9, 0.9]], '#ff8a2f', 0.03);
}, ['#ff8a2f', 2, 0.5]);
add('dj_booth', 'Cabina de DJ', 'cy_nightlife', 2.4, 1, 'dj musica discoteca', (k) => {
  k.rect(0.01, 0.06, 0.98, 0.88, DARK, 0.06, { shadow: true });
  for (const x of [0.2, 0.8]) {
    k.disc(x, 0.5, 0.32, metal('#3a3e46'));
    k.disc(x, 0.5, 0.26, plain('#121214'));
    k.dot(x, 0.5, 0.05, '#ff3fb0');
  }
  for (let i = 0; i < 8; i++) k.rect(0.38 + (i % 4) * 0.06, 0.25 + Math.floor(i / 4) * 0.3, 0.04, 0.2, plain(k.pick(['#2fe8ff', '#ff3fb0', '#3fff8a'])), 0.01, { edge: false });
  neon(k, [[0.03, 0.9], [0.97, 0.9]], '#b14bff', 0.06);
}, ['#b14bff', 3, 0.7]);
for (const [cid, cname] of [['small', 'Pequeño'], ['big', 'Grande']] as const) {
  add(`speaker_${cid}`, `Altavoz ${cname}`, 'cy_nightlife', cid === 'big' ? 1.1 : 0.7, cid === 'big' ? 1.1 : 0.7, 'altavoz musica', (k) => {
    k.rect(0.06, 0.06, 0.88, 0.88, DARK, 0.08, { shadow: true });
    k.disc(0.5, 0.5, 0.34, plain('#121214'));
    k.ring(0.5, 0.5, 0.26, '#3a3e46', 0.04);
    k.dot(0.5, 0.5, 0.1, '#2a2d33');
  });
}
add('bar_counter', 'Barra de Bar Neón', 'cy_nightlife', 4, 1, 'barra bar bebidas', (k) => {
  k.rect(0.01, 0.06, 0.98, 0.88, metal('#1c1a24'), 0.08, { shadow: true });
  k.rect(0.02, 0.12, 0.96, 0.36, liquid('#2a2236'), 0.05);
  for (let i = 0; i < 10; i++) k.disc(0.06 + i * 0.1, 0.3, 0.12, liquid(k.pick(['#ff3fb0', '#2fe8ff', '#ffe12f', '#3fff8a'])), { shadow: true });
  neon(k, [[0.02, 0.9], [0.98, 0.9]], '#ff3fb0', 0.08);
}, ['#ff3fb0', 4, 0.7]);
for (const [cid, cname, glow] of [glowOf('pink'), glowOf('cyan')]) {
  add(`cocktail_table_${cid}`, `Mesa Cóctel ${cname}`, 'cy_nightlife', 0.8, 0.8, 'mesa bar coctel', (k) => {
    k.disc(0.5, 0.5, 0.44, DARK, { shadow: true });
    k.ring(0.5, 0.5, 0.42, glow, 0.03);
    k.disc(0.38, 0.4, 0.09, liquid(glow), { shadow: true });
    k.disc(0.62, 0.58, 0.09, liquid('#ffe12f'), { shadow: true });
  }, [glow, 1.5, 0.4]);
}
add('pool_table', 'Mesa de Billar', 'cy_nightlife', 2.4, 1.4, 'billar juego', (k) => {
  k.rect(0.02, 0.04, 0.96, 0.92, wood('#3a2418'), 0.06, { shadow: true });
  k.rect(0.07, 0.12, 0.86, 0.76, cloth('#3a1a6a'), 0.03);
  for (const x of [0.07, 0.5, 0.93]) for (const y of [0.12, 0.88]) k.dot(x, y, 0.05, '#0a0a0c');
  for (let i = 0; i < 9; i++) k.stud(0.6 + (i % 3) * 0.05, 0.4 + Math.floor(i / 3) * 0.1, 0.035, k.pick(['#e8b81c', '#d02020', '#2350a8', '#2a8a4a']));
  k.stud(0.25, 0.5, 0.035, '#f6f6f2');
  k.stroke([[0.05, 0.75], [0.24, 0.52]], '#c8a070', 0.025);
});
add('poker_table', 'Mesa de Póker', 'cy_nightlife', 2.2, 1.4, 'poker casino cartas', (k) => {
  k.oval(0.5, 0.5, 0.48, 0.46, metal('#1c1d22'), { shadow: true });
  k.oval(0.5, 0.5, 0.42, 0.38, cloth('#1a6a3a'));
  for (let i = 0; i < 5; i++) k.rect(0.32 + i * 0.075, 0.44, 0.06, 0.12, plain('#f6f6f2'), 0.01);
  for (let i = 0; i < 6; i++) k.stud(k.between(0.2, 0.8), k.between(0.25, 0.75), 0.03, k.pick(['#d02020', '#2350a8', '#e8b81c']));
  neonLoop(k, Array.from({ length: 24 }, (_, i): P => [0.5 + Math.cos((i / 24) * TAU) * 0.47, 0.5 + Math.sin((i / 24) * TAU) * 0.44]), '#ffe12f', 0.012);
}, ['#ffe12f', 2.5, 0.4]);
add('vip_booth', 'Reservado VIP', 'cy_nightlife', 2.4, 2, 'reservado sofa vip', (k) => {
  k.poly([[0.02, 0.02], [0.98, 0.02], [0.98, 0.7], [0.82, 0.7], [0.82, 0.2], [0.18, 0.2], [0.18, 0.7], [0.02, 0.7]], cloth('#6a1a4a'), { shadow: true });
  k.oval(0.5, 0.55, 0.24, 0.2, liquid('rgba(150,200,230,0.6)'), { shadow: true });
  neon(k, [[0.04, 0.04], [0.96, 0.04]], '#ff3fb0', 0.03);
}, ['#ff3fb0', 2.5, 0.5]);
add('karaoke', 'Pantalla Karaoke', 'cy_nightlife', 2, 0.4, 'karaoke musica', (k) => {
  k.rect(0.01, 0.1, 0.98, 0.8, DARK, 0.03, { shadow: true });
  screen(k, 0.03, 0.2, 0.94, 0.6, '#ff3fb0', 2);
}, ['#ff3fb0', 2.5, 0.5], 'above_walls');
add('dance_light', 'Bola de Discoteca', 'cy_nightlife', 1, 1, 'discoteca bola luces', (k) => {
  for (const c of ['#ff3fb0', '#2fe8ff', '#ffe12f', '#3fff8a']) k.glow(k.between(0.2, 0.8), k.between(0.2, 0.8), 0.25, c, 0.5);
  k.disc(0.5, 0.5, 0.25, CHROME, { shadow: true });
  for (let i = 0; i < 14; i++) k.dot(k.between(0.32, 0.68), k.between(0.32, 0.68), 0.02, '#ffffff');
}, ['#ff3fb0', 4, 0.6], 'above_walls');
add('beer_tap', 'Grifo de Cerveza', 'cy_nightlife', 1, 0.4, 'cerveza bar', (k) => {
  k.rect(0.02, 0.15, 0.96, 0.7, CHROME, 0.08, { shadow: true });
  for (let i = 0; i < 4; i++) k.stud(0.15 + i * 0.23, 0.5, 0.12, k.pick(['#e8b81c', '#d02020', '#2fe8ff']));
});

// ======================= Industrial =======================
for (const [cid, cname, hex] of [paint('red'), paint('blue'), paint('green'), paint('orange'), paint('silver'), paint('yellow')]) {
  add(`container_${cid}`, `Contenedor ${cname}`, 'cy_industrial', 2.4, 6, 'contenedor puerto carga', (k) => {
    k.rect(0.02, 0.01, 0.96, 0.98, metal(hex), 0.02, { shadow: true });
    for (let y = 0.03; y < 0.97; y += 0.025) k.rect(0.05, y, 0.9, 0.008, plain('rgba(0,0,0,0.22)'), 0, { edge: false });
    for (const y of [0.01, 0.97]) k.rect(0.02, y, 0.96, 0.02, metal(tint(hex, -40)), 0.01);
  });
}
add('container_open', 'Contenedor Abierto', 'cy_industrial', 2.4, 6, 'contenedor puerto abierto', (k) => {
  k.rect(0.02, 0.01, 0.96, 0.98, metal('#8a3a22'), 0.02, { shadow: true });
  k.rect(0.08, 0.03, 0.84, 0.94, plain('#1c1a18'), 0.01);
  for (let i = 0; i < 5; i++) k.rect(0.12 + (i % 2) * 0.4, 0.06 + i * 0.17, 0.36, 0.14, wood('#a07040'), 0.02, { shadow: true });
});
for (const [cid, cname, pts] of [
  ['straight', 'Tubería Recta', [[0.5, 0.02], [0.5, 0.98]]],
  ['elbow', 'Codo de Tubería', [[0.5, 0.02], [0.5, 0.5], [0.98, 0.5]]],
  ['tee', 'Unión en T', [[0.02, 0.5], [0.98, 0.5]]],
] as [string, string, P[]][]) {
  add(`pipe_${cid}`, cname, 'cy_industrial', 1, 1, 'tuberia industria', (k) => {
    k.stroke(pts, '#5a626e', 0.34);
    k.stroke(pts, '#8a929e', 0.18, false);
    if (cid === 'tee') k.stroke([[0.5, 0.5], [0.5, 0.98]], '#5a626e', 0.34);
    for (const [x, y] of pts) k.disc(x, y, 0.2, metal('#3a404a'));
    k.disc(0.5, 0.5, 0.22, metal('#e8c21c'), { shadow: true });
  });
}
for (const [cid, cname, hex] of [['water', 'de Agua', '#9aa2ac'], ['gas', 'de Gas', '#e8eaee']] as const) {
  add(`tank_${cid}`, `Depósito ${cname}`, 'cy_industrial', 2, 2, 'deposito tanque', (k) => {
    k.disc(0.5, 0.5, 0.47, metal(hex), { shadow: true });
    for (const r of [0.36, 0.22]) k.ring(0.5, 0.5, r, 'rgba(60,64,70,0.5)', 0.02);
    k.disc(0.5, 0.5, 0.1, DARK);
    around(4, 0.47, (x, y) => k.disc(x, y, 0.05, DARK), Math.PI / 4);
  });
}
for (const [cid, cname, hex, mark] of [['toxic', 'Tóxico', '#e8c21c', '#1a1a1a'], ['oil', 'de Aceite', '#1c1d22', '#e8eaee'], ['red', 'Rojo', '#b82230', '#e8eaee'], ['blue', 'Azul', '#2350a8', '#e8eaee'], ['glow', 'Radiactivo', '#2a4a2a', '#9cf03a']] as const) {
  add(`barrel_${cid}`, `Bidón ${cname}`, 'cy_industrial', 0.6, 0.6, 'bidon barril', (k) => {
    k.disc(0.5, 0.5, 0.44, metal(hex), { shadow: true });
    for (const r of [0.36, 0.26]) k.ring(0.5, 0.5, r, 'rgba(0,0,0,0.3)', 0.03);
    k.dot(0.5, 0.5, 0.12, mark);
    if (cid === 'glow') k.glow(0.5, 0.5, 0.5, '#9cf03a', 0.6);
  }, cid === 'glow' ? ['#9cf03a', 1.5, 0.5] : undefined);
}
add('crane_hook', 'Gancho de Grúa', 'cy_industrial', 1, 1, 'grua gancho puerto', (k) => {
  k.stroke([[0.5, 0], [0.5, 0.4]], '#2a2d33', 0.06);
  k.rect(0.3, 0.35, 0.4, 0.2, metal('#e8b81c'), 0.04, { shadow: true });
  k.stroke([[0.5, 0.55], [0.5, 0.75], [0.35, 0.75], [0.35, 0.65]], '#5a606a', 0.08);
}, undefined, 'above_walls');
for (const [cid, cname] of [['empty', 'Vacío'], ['boxes', 'con Cajas']] as const) {
  add(`pallet_${cid}`, `Palé ${cname}`, 'cy_industrial', 1.2, 1, 'pale carga almacen', (k) => {
    k.boards(0.04, 0.06, 0.92, 0.88, wood('#b48a58'), 5, false);
    if (cid === 'boxes') for (const [x, y] of [[0.1, 0.12], [0.52, 0.12], [0.1, 0.52], [0.52, 0.52]]) k.rect(x, y, 0.38, 0.36, plain('#c8a070'), 0.02, { shadow: true });
  });
}
add('scaffolding', 'Andamio', 'cy_industrial', 2, 1, 'andamio obra', (k) => {
  k.rect(0.02, 0.06, 0.96, 0.88, plain('rgba(30,30,34,0.5)'), 0.02);
  for (let x = 0.02; x <= 0.98; x += 0.24) k.stroke([[x, 0.06], [x, 0.94]], '#9aa2ac', 0.04);
  for (const y of [0.06, 0.94]) k.stroke([[0.02, y], [0.98, y]], '#9aa2ac', 0.04);
  k.stroke([[0.02, 0.06], [0.26, 0.94], [0.5, 0.06], [0.74, 0.94], [0.98, 0.06]], '#6a7280', 0.025, false);
  k.boards(0.03, 0.4, 0.94, 0.2, wood('#b48a58'), 1, false);
}, undefined, 'above_walls');
for (const [cid, cname] of [['small', 'Pequeña'], ['big', 'Grande']] as const) {
  add(`fan_${cid}`, `Turbina ${cname}`, 'cy_industrial', cid === 'big' ? 2 : 1.2, cid === 'big' ? 2 : 1.2, 'ventilador turbina aire', (k) => {
    k.rect(0.04, 0.04, 0.92, 0.92, metal('#4a505a'), 0.08, { shadow: true });
    k.disc(0.5, 0.5, 0.4, plain('#141518'));
    around(6, 0.22, (_x, _y, a) => k.oval(0.5 + Math.cos(a) * 0.22, 0.5 + Math.sin(a) * 0.22, 0.17, 0.07, metal('#8a929e'), { turn: a + 0.5 }));
    k.disc(0.5, 0.5, 0.08, CHROME);
  }, undefined, 'roof');
}
add('ac_unit', 'Aire Acondicionado', 'cy_industrial', 1.2, 0.8, 'aire acondicionado tejado', (k) => {
  k.rect(0.04, 0.06, 0.92, 0.88, metal('#c8ccd2'), 0.06, { shadow: true });
  k.disc(0.62, 0.5, 0.3, plain('#202226'));
  around(4, 0.15, (_x, _y, a) => k.oval(0.62 + Math.cos(a) * 0.1, 0.5 + Math.sin(a) * 0.15, 0.08, 0.04, metal('#8a929e'), { turn: a }));
  for (let y = 0.2; y < 0.82; y += 0.08) k.stroke([[0.1, y], [0.3, y]], '#8a9098', 0.02, false);
}, undefined, 'roof');
add('vent', 'Rejilla de Ventilación', 'cy_industrial', 0.8, 0.8, 'ventilacion conducto', (k) => {
  k.rect(0.06, 0.06, 0.88, 0.88, STEEL, 0.06, { shadow: true });
  for (let y = 0.16; y < 0.86; y += 0.1) k.rect(0.14, y, 0.72, 0.05, plain('#202226'), 0.01);
}, undefined, 'roof');
add('chimney', 'Chimenea Industrial', 'cy_industrial', 1, 1, 'chimenea humo', (k) => {
  k.disc(0.5, 0.5, 0.42, stone('#6a4030'), { shadow: true });
  k.disc(0.5, 0.5, 0.28, plain('#141414'));
  for (let i = 0; i < 6; i++) k.disc(k.between(0.3, 0.8), k.between(0.1, 0.6), k.between(0.1, 0.18), plain('rgba(120,120,130,0.3)'), { edge: false });
}, undefined, 'roof');
add('water_tower', 'Depósito de Azotea', 'cy_industrial', 1.6, 1.6, 'deposito agua tejado', (k) => {
  around(4, 0.42, (x, y) => k.disc(x, y, 0.06, DARK), Math.PI / 4);
  k.disc(0.5, 0.5, 0.42, wood('#7a5230'), { shadow: true });
  around(12, 0.3, (x, y) => k.stroke([[0.5, 0.5], [x, y]], 'rgba(40,24,10,0.5)', 0.015, false));
  k.poly([[0.5, 0.2], [0.8, 0.5], [0.5, 0.8], [0.2, 0.5]], metal('#4a505a'));
}, undefined, 'roof');
add('diesel_generator', 'Generador Diésel', 'cy_industrial', 1.6, 1, 'generador diesel', (k) => {
  k.rect(0.02, 0.08, 0.96, 0.84, metal('#e8b81c'), 0.05, { shadow: true });
  for (let x = 0.1; x < 0.6; x += 0.06) k.stroke([[x, 0.2], [x, 0.8]], '#7a6014', 0.02, false);
  k.disc(0.8, 0.5, 0.16, DARK);
});
add('solar_panel', 'Panel Solar', 'cy_industrial', 1.6, 1, 'solar energia', (k) => {
  k.rect(0.02, 0.06, 0.96, 0.88, metal('#b4bcc6'), 0.02, { shadow: true });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) k.rect(0.05 + c * 0.155, 0.11 + r * 0.27, 0.145, 0.25, liquid('#1c2c5a'), 0.01);
}, undefined, 'roof');
add('ladder', 'Escalera de Mano', 'cy_industrial', 0.5, 2, 'escalera', (k) => {
  for (const x of [0.15, 0.85]) k.stroke([[x, 0.02], [x, 0.98]], '#9aa2ac', 0.12);
  for (let y = 0.06; y < 0.98; y += 0.09) k.stroke([[0.15, y], [0.85, y]], '#9aa2ac', 0.08);
});
add('workbench', 'Banco de Trabajo', 'cy_industrial', 2, 0.9, 'taller herramientas', (k) => {
  k.rect(0.01, 0.06, 0.98, 0.88, wood('#7a5230'), 0.04, { shadow: true });
  k.rect(0.05, 0.12, 0.3, 0.3, metal('#c41e24'), 0.03, { shadow: true });
  k.stroke([[0.45, 0.4], [0.7, 0.7]], '#9aa2ac', 0.05);
  k.rect(0.75, 0.2, 0.18, 0.55, metal('#3a3e46'), 0.03);
  for (let i = 0; i < 6; i++) k.dot(k.between(0.4, 0.95), k.between(0.15, 0.85), 0.02, '#c8a050');
});
add('toolbox', 'Caja de Herramientas', 'cy_industrial', 0.8, 0.5, 'herramientas', (k) => {
  k.rect(0.04, 0.12, 0.92, 0.76, metal('#c41e24'), 0.06, { shadow: true });
  k.stroke([[0.3, 0.5], [0.7, 0.5]], '#1a1a1c', 0.08);
});
add('crate_tech', 'Caja Tecnológica', 'cy_industrial', 1, 1, 'caja carga', (k) => {
  k.rect(0.06, 0.06, 0.88, 0.88, metal('#3a3e46'), 0.06, { shadow: true });
  k.rect(0.16, 0.16, 0.68, 0.68, metal('#4a505a'), 0.04);
  neon(k, [[0.2, 0.5], [0.8, 0.5]], '#2fe8ff', 0.04);
  for (const x of [0.12, 0.88]) for (const y of [0.12, 0.88]) k.stud(x, y, 0.035, '#e8c21c');
});
add('crate_stack', 'Pila de Cajas', 'cy_industrial', 1.6, 1.6, 'cajas carga', (k) => {
  for (const [x, y, s] of [[0.04, 0.04, 0.48], [0.5, 0.04, 0.46], [0.18, 0.48, 0.5]] as const) {
    k.rect(x, y, s, s, metal(k.pick(['#3a3e46', '#4a3a2a', '#2a3a4a'])), 0.04, { shadow: true });
    k.stroke([[x + 0.05, y + s / 2], [x + s - 0.05, y + s / 2]], '#e8c21c', 0.03, false);
  }
});

// ======================= Security =======================
for (const [cid, cname, glow] of [glowOf('red'), glowOf('cyan')]) {
  add(`turret_${cid}`, `Torreta ${cname}`, 'cy_security', 1, 1, 'torreta arma defensa', (k) => {
    k.disc(0.5, 0.55, 0.4, DARK, { shadow: true });
    k.disc(0.5, 0.55, 0.26, metal('#5a606a'), { shadow: true });
    for (const x of [0.42, 0.58]) k.rect(x - 0.04, 0.05, 0.08, 0.45, metal('#3a3e46'), 0.02, { shadow: true });
    k.dot(0.5, 0.55, 0.06, glow);
    k.glow(0.5, 0.55, 0.2, glow, 0.5);
  });
}
for (const [cid, cname] of [['wall', 'de Pared'], ['dome', 'Domo']] as const) {
  add(`camera_${cid}`, `Cámara ${cname}`, 'cy_security', 0.5, 0.5, 'camara vigilancia', (k) => {
    if (cid === 'dome') k.disc(0.5, 0.5, 0.42, liquid('#1a1c22'), { shadow: true });
    else k.rect(0.3, 0.1, 0.4, 0.8, metal('#e8eaee'), 0.15, { shadow: true });
    k.dot(0.5, 0.35, 0.1, '#0a0a0c');
    k.dot(0.5, 0.35, 0.04, '#ff3b4a');
  }, undefined, 'above_walls');
}
add('laser_emitter', 'Emisor Láser', 'cy_security', 0.5, 0.5, 'laser alarma', (k) => {
  k.disc(0.5, 0.5, 0.4, DARK, { shadow: true });
  k.glow(0.5, 0.5, 0.4, '#ff2f4a', 0.8);
  k.dot(0.5, 0.5, 0.12, '#ff2f4a');
}, ['#ff2f4a', 1, 0.5]);
for (const [cid, cname] of [['metal', 'Metálica'], ['concrete', 'de Hormigón']] as const) {
  add(`barricade_${cid}`, `Barricada ${cname}`, 'cy_security', 2, 0.7, 'barricada defensa', (k) => {
    if (cid === 'metal') {
      for (let i = 0; i < 3; i++) k.poly([[0.04 + i * 0.32, 0.9], [0.18 + i * 0.32, 0.1], [0.32 + i * 0.32, 0.9]], metal('#6a7280'), { shadow: true });
      k.stroke([[0.04, 0.5], [0.96, 0.5]], '#3a3e46', 0.08);
    } else {
      k.rect(0.02, 0.1, 0.96, 0.8, stone('#9a9a94'), 0.2, { shadow: true });
      k.rect(0.3, 0.38, 0.4, 0.24, plain('#d02020'), 0.05);
    }
  });
}
add('sandbags', 'Sacos Terreros', 'cy_security', 2, 0.8, 'sacos defensa', (k) => {
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) k.oval(0.14 + c * 0.24 + (r % 2) * 0.12, 0.3 + r * 0.4, 0.13, 0.22, cloth('#8a7a54'), { shadow: true });
});
add('weapon_rack', 'Armero', 'cy_security', 2, 0.6, 'armas rifle', (k) => {
  k.rect(0.01, 0.1, 0.98, 0.8, DARK, 0.04, { shadow: true });
  for (let i = 0; i < 5; i++) {
    const x = 0.1 + i * 0.19;
    k.rect(x - 0.03, 0.15, 0.06, 0.7, metal('#3a3e46'), 0.02);
    k.rect(x - 0.05, 0.45, 0.1, 0.15, metal('#1c1d22'), 0.02);
    k.dot(x, 0.2, 0.015, '#ff3b4a');
  }
});
for (const [cid, cname, hex] of [['grey', 'Gris', '#5a606a'], ['red', 'Rojo', '#8a2028']] as const) {
  add(`locker_${cid}`, `Taquillas ${cname}`, 'cy_security', 1.6, 0.6, 'taquilla vestuario', (k) => {
    k.rect(0.01, 0.06, 0.98, 0.88, metal(hex), 0.03, { shadow: true });
    for (let i = 0; i < 4; i++) {
      k.rect(0.03 + i * 0.245, 0.12, 0.225, 0.76, metal(tint(hex, 12)), 0.02);
      for (let y = 0.2; y < 0.4; y += 0.06) k.stroke([[0.07 + i * 0.245, y], [0.22 + i * 0.245, y]], 'rgba(0,0,0,0.4)', 0.02, false);
      k.dot(0.21 + i * 0.245, 0.55, 0.02, '#c8ccd2');
    }
  });
}
add('safe', 'Caja Fuerte', 'cy_security', 0.9, 0.9, 'caja fuerte dinero', (k) => {
  k.rect(0.06, 0.06, 0.88, 0.88, metal('#3a3e46'), 0.06, { shadow: true });
  k.rect(0.14, 0.14, 0.72, 0.72, metal('#4a505a'), 0.04);
  k.disc(0.5, 0.5, 0.18, CHROME);
  around(8, 0.13, (x, y) => k.dot(x, y, 0.015, '#2a2d33'));
  k.dot(0.8, 0.5, 0.03, '#3fff8a');
});
add('scanner_gate', 'Arco Escáner', 'cy_security', 1.6, 0.6, 'detector escaner control', (k) => {
  for (const x of [0.04, 0.84]) k.rect(x, 0.1, 0.12, 0.8, metal('#e8eaee'), 0.04, { shadow: true });
  neon(k, [[0.16, 0.5], [0.84, 0.5]], '#2fe8ff', 0.05);
  for (const x of [0.1, 0.9]) k.dot(x, 0.25, 0.03, '#3fff8a');
}, ['#2fe8ff', 1.5, 0.4]);
add('alarm', 'Baliza de Alarma', 'cy_security', 0.5, 0.5, 'alarma sirena', (k) => {
  k.glow(0.5, 0.5, 0.5, '#ff3b3b', 0.8);
  k.disc(0.5, 0.5, 0.3, plain('#c41e24'), { shadow: true });
  k.dot(0.45, 0.45, 0.08, '#ffb0b0');
}, ['#ff3b3b', 2.5, 0.7], 'above_walls');
for (const [cid, cname] of [['green', 'Verde'], ['black', 'Negra']] as const) {
  add(`ammo_crate_${cid}`, `Caja de Munición ${cname}`, 'cy_security', 1, 0.6, 'municion caja militar', (k) => {
    k.rect(0.04, 0.08, 0.92, 0.84, metal(cid === 'green' ? '#3a4a2a' : '#1c1d22'), 0.05, { shadow: true });
    k.rect(0.3, 0.38, 0.4, 0.24, plain('#e8c21c'), 0.02);
    for (const x of [0.1, 0.9]) k.stud(x, 0.5, 0.05, '#9aa2ac');
  });
}

// ======================= Urban nature =======================
for (const [cid, cname, glow] of NEONS.slice(0, 4)) {
  add(`neon_tree_${cid}`, `Árbol Bioluminiscente ${cname}`, 'cy_nature', 2.2, 2.2, 'arbol neon bio', (k) => {
    k.glow(0.5, 0.5, 0.55, glow, 0.45);
    k.foliage(0.5, 0.5, 0.42, ['#141020', '#201a32', tint(glow, -60), glow], 120, 0.06);
    for (let i = 0; i < 16; i++) k.dot(k.between(0.15, 0.85), k.between(0.15, 0.85), 0.018, '#ffffff');
  }, [glow, 3, 0.5], 'above_walls');
}
add('potted_palm', 'Palmera en Maceta', 'cy_nature', 1.4, 1.4, 'palmera maceta', (k) => {
  k.rect(0.3, 0.3, 0.4, 0.4, metal('#2a2d33'), 0.06, { shadow: true });
  around(7, 0.36, (x, y) => k.stroke([[0.5, 0.5], [x, y]], '#3f8a30', 0.1, true, true));
  k.disc(0.5, 0.5, 0.06, plain('#6a4a24'));
}, undefined, 'above_walls');
for (const [cid, cname] of [['flowers', 'con Flores'], ['shrub', 'con Arbustos']] as const) {
  add(`planter_${cid}`, `Jardinera ${cname}`, 'cy_nature', 2, 0.8, 'jardinera planta', (k) => {
    k.rect(0.02, 0.06, 0.96, 0.88, stone('#8a8d92'), 0.06, { shadow: true });
    k.rect(0.06, 0.16, 0.88, 0.68, plain('#3a2a1a'), 0.04);
    k.foliage(0.5, 0.5, 0.36, ['#2a5a24', '#3a7a30', '#4f9a3c'], 60, 0.08);
    if (cid === 'flowers') for (let i = 0; i < 14; i++) k.dot(k.between(0.1, 0.9), k.between(0.25, 0.75), 0.04, k.pick(['#ff3fb0', '#ffe12f', '#f2f2f2']));
  });
}
add('holo_tree', 'Árbol Holográfico', 'cy_nature', 2, 2, 'holograma arbol', (k) => {
  k.disc(0.5, 0.5, 0.1, DARK, { shadow: true });
  k.ctx.save();
  k.ctx.globalAlpha = 0.55;
  k.foliage(0.5, 0.5, 0.42, ['#1aa8c8', '#2fe8ff', '#a8ffff'], 90, 0.06);
  k.ctx.restore();
  k.glow(0.5, 0.5, 0.5, '#2fe8ff', 0.3);
}, ['#2fe8ff', 3, 0.4], 'above_walls');
add('dead_tree', 'Árbol Muerto', 'cy_nature', 1.8, 1.8, 'arbol seco', (k) => {
  around(7, 0.42, (x, y) => k.stroke([[0.5, 0.5], [x, y]], '#3a2e26', 0.05), 0.3);
  k.disc(0.5, 0.5, 0.12, wood('#3a2e26'), { shadow: true });
}, undefined, 'above_walls');
for (const [cid, cname, c] of [['green', 'Verde', '#7aff3a'], ['purple', 'Morada', '#c05aff']] as const) {
  add(`mutant_plant_${cid}`, `Planta Mutante ${cname}`, 'cy_nature', 1.2, 1.2, 'planta mutante toxica', (k) => {
    k.glow(0.5, 0.5, 0.5, c, 0.5);
    around(6, 0.32, (x, y) => k.stroke([[0.5, 0.5], [x, y]], tint(c, -80), 0.1, true, true), 0.4);
    around(6, 0.32, (x, y) => k.disc(x, y, 0.08, plain(c)), 0.4);
    k.disc(0.5, 0.5, 0.12, plain(tint(c, -40)), { shadow: true });
  }, [c, 2, 0.5]);
}
for (const [cid, cname] of [['concrete', 'de Hormigón'], ['metal', 'Metálicos']] as const) {
  add(`rubble_${cid}`, `Escombros ${cname}`, 'cy_nature', 1.6, 1.4, 'escombros ruinas', (k) => {
    for (let i = 0; i < 9; i++) k.lump(k.between(0.2, 0.8), k.between(0.2, 0.8), k.between(0.08, 0.18), cid === 'concrete' ? stone(k.pick(['#8a8d92', '#6a6d72', '#9a9da2'])) : metal(k.pick(['#5a626e', '#7a4a26', '#3a3e46'])), 6, 0.3, { shadow: true });
    for (let i = 0; i < 4; i++) k.stroke([[k.between(0.1, 0.9), k.between(0.1, 0.9)], [k.between(0.1, 0.9), k.between(0.1, 0.9)]], '#7a4a26', 0.02);
  });
}
add('toxic_puddle', 'Charco Tóxico', 'cy_nature', 1.4, 1.2, 'charco toxico residuo', (k) => {
  k.glow(0.5, 0.5, 0.55, '#9cf03a', 0.5);
  k.lump(0.5, 0.5, 0.44, liquid('#4ea41c'), 14, 0.15);
  for (let i = 0; i < 8; i++) k.ring(k.between(0.25, 0.75), k.between(0.25, 0.75), k.between(0.03, 0.06), '#d8ff9a', 0.012);
}, ['#9cf03a', 1.5, 0.5], 'below_floor');
add('rat', 'Rata Cibernética', 'cy_nature', 0.4, 0.7, 'rata animal', (k) => {
  k.stroke([[0.5, 0.6], [0.6, 0.98]], '#b48a8a', 0.06, false);
  k.oval(0.5, 0.5, 0.32, 0.3, plain('#4a4440'), { shadow: true });
  k.oval(0.5, 0.2, 0.18, 0.14, plain('#4a4440'));
  k.dot(0.42, 0.16, 0.04, '#ff3b4a');
});
add('pigeon', 'Paloma Urbana', 'cy_nature', 0.4, 0.5, 'paloma ave', (k) => {
  k.oval(0.5, 0.55, 0.36, 0.38, plain('#8a909a'), { shadow: true });
  k.oval(0.5, 0.2, 0.2, 0.16, plain('#5a8a7a'));
  k.dot(0.5, 0.06, 0.06, '#e8c21c');
});

// ======================= Lighting =======================
for (const [cid, cname, glow] of NEONS) {
  add(`neon_tube_${cid}`, `Tubo de Neón ${cname}`, 'cy_lighting', 2, 0.3, 'neon tubo luz', (k) => {
    neon(k, [[0.06, 0.5], [0.94, 0.5]], glow, 0.35);
    for (const x of [0.04, 0.96]) k.rect(x - 0.03, 0.2, 0.06, 0.6, DARK, 0.02);
  }, [glow, 3, 0.8], 'above_walls');
}
add('spotlight', 'Foco de Escenario', 'cy_lighting', 0.8, 0.8, 'foco luz escenario', (k) => {
  k.glow(0.5, 0.3, 0.5, '#fff6d0', 0.7);
  k.disc(0.5, 0.55, 0.3, DARK, { shadow: true });
  k.disc(0.5, 0.45, 0.18, plain('#fff6d0'));
}, ['#fff6d0', 6, 1], 'above_walls');
for (const [cid, cname, glow] of [glowOf('purple'), glowOf('cyan'), glowOf('pink')]) {
  add(`uplight_${cid}`, `Foco de Suelo ${cname}`, 'cy_lighting', 0.5, 0.5, 'foco suelo luz', (k) => {
    k.glow(0.5, 0.5, 0.5, glow, 0.8);
    k.disc(0.5, 0.5, 0.3, CHROME, { shadow: true });
    k.disc(0.5, 0.5, 0.18, plain(tint(glow, 60)));
  }, [glow, 3, 0.7], 'below_floor');
}
for (const [cid, cname, c] of [['red', 'Rojo', '#ff3b3b'], ['white', 'Blanco', '#fff2d8'], ['gold', 'Dorado', '#ffc040']] as const) {
  add(`paper_lantern_${cid}`, `Farol de Papel ${cname}`, 'cy_lighting', 0.6, 0.6, 'farol papel asiatico', (k) => {
    k.glow(0.5, 0.5, 0.5, c, 0.7);
    k.disc(0.5, 0.5, 0.34, cloth(c), { shadow: true });
    for (const r of [0.26, 0.16]) k.ring(0.5, 0.5, r, 'rgba(80,20,10,0.4)', 0.02);
    k.dot(0.5, 0.5, 0.07, '#1a1a1a');
  }, [c, 3, 0.7], 'above_walls');
}
for (const [cid, cname, glow] of [glowOf('cyan'), glowOf('pink')]) {
  add(`led_strip_${cid}`, `Tira LED ${cname}`, 'cy_lighting', 3, 0.2, 'led tira luz', (k) => {
    neon(k, [[0.02, 0.5], [0.98, 0.5]], glow, 0.3);
    for (let x = 0.05; x < 0.98; x += 0.05) k.dot(x, 0.5, 0.1, '#ffffff');
  }, [glow, 2.5, 0.6], 'above_walls');
}
for (const [cid, cname, glow] of [glowOf('blue'), glowOf('green')]) {
  add(`holo_lamp_${cid}`, `Lámpara Holo ${cname}`, 'cy_lighting', 0.6, 0.6, 'lampara holo', (k) => {
    k.glow(0.5, 0.5, 0.5, glow, 0.7);
    k.disc(0.5, 0.5, 0.16, DARK, { shadow: true });
    k.ctx.save();
    k.ctx.globalAlpha = 0.6;
    k.disc(0.5, 0.5, 0.3, plain(glow), { edge: false });
    k.ctx.restore();
  }, [glow, 3, 0.6]);
}
add('flare', 'Bengala', 'cy_lighting', 0.4, 0.4, 'bengala emergencia', (k) => {
  k.glow(0.5, 0.5, 0.55, '#ff3b3b', 0.9);
  k.rect(0.4, 0.3, 0.2, 0.5, plain('#c41e24'), 0.05);
  k.flame(0.5, 0.3, 0.14, ['#ff3b3b', '#ff8a8a', '#fff0f0']);
}, ['#ff3b3b', 3, 0.8]);
add('street_light_tall', 'Báculo Doble', 'cy_lighting', 2.4, 0.6, 'farola doble calle', (k) => {
  k.stroke([[0.1, 0.5], [0.9, 0.5]], '#3a3e46', 0.12);
  k.disc(0.5, 0.5, 0.2, DARK, { shadow: true });
  for (const x of [0.1, 0.9]) {
    k.glow(x, 0.5, 0.5, '#fff0c0', 0.7);
    k.rect(x - 0.06, 0.3, 0.12, 0.4, plain('#fff6d0'), 0.03);
  }
}, ['#fff0c0', 7, 0.9], 'above_walls');
