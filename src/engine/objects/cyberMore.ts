// CyberGato, second wave: more vehicles, food and market, clinic, transit, offices, and extras for
// every existing city category.
import { cloth, type Kit, liquid, metal, plain, stone, wood } from './kit';
import { add, NEONS, neon, neonLoop, PAINTS, tint } from './cyberRegistry';
import { type Car, lightbar, vehicle } from './cyberVehicles';

type P = [number, number];
const TAU = Math.PI * 2;
const STEEL = metal('#6a7280');
const DARK = metal('#24272d');
const CHROME = metal('#b4bcc6');
const WHITE = plain('#e8eaee');
const GLASS = liquid('#1e3448');
const BLACK = plain('#111214');
const glowOf = (id: string) => NEONS.find((n) => n[0] === id)!;
const paintOf = (id: string) => PAINTS.find((p) => p[0] === id)!;
const N3 = NEONS.slice(0, 3); // purple, cyan, pink
const N4 = NEONS.slice(0, 4); // + green

function screen(k: Kit, x: number, y: number, w: number, h: number, color: string, lines = 3) {
  k.rect(x, y, w, h, liquid(tint(color, -120)), 0.02);
  k.glow(x + w / 2, y + h / 2, Math.max(w, h) * 0.7, color, 0.45);
  for (let i = 0; i < lines; i++) {
    const ly = y + h * (0.25 + (i * 0.5) / Math.max(1, lines - 1));
    k.stroke([[x + w * 0.15, ly], [x + w * (0.4 + k.rand() * 0.45), ly]], color, Math.min(w, h) * 0.08, false);
  }
}

function label(k: Kit, text: string, x: number, y: number, size: number, color: string) {
  const { ctx } = k;
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `bold ${Math.max(6, k.m * size)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x * k.W, y * k.H);
  ctx.restore();
}

const frame = (k: Kit, color: string, inset = 0.06, width = 0.04) =>
  neonLoop(k, [[inset, inset], [1 - inset, inset], [1 - inset, 1 - inset], [inset, 1 - inset]], color, width);

// ======================= Vehicles =======================
const MORE_CARS: [string, string, number, number, Omit<Car, 'body'>, string[], boolean?][] = [
  ['hatch', 'Compacto Urbano', 0.95, 1.7, { hood: 0.18, cabin: 0.58, round: 0.2 }, ['red', 'blue', 'white', 'green', 'orange']],
  ['wagon', 'Familiar', 1, 2.2, { hood: 0.2, cabin: 0.66, round: 0.12 }, ['silver', 'black', 'blue', 'green']],
  ['roadster', 'Descapotable', 1, 1.9, { hood: 0.3, cabin: 0.2, round: 0.3, extra: (k) => { for (const x of [0.24, 0.54]) k.rect(x, 0.52, 0.22, 0.16, cloth('#2a1c18'), 0.05); } }, ['red', 'yellow', 'white', 'cyan', 'purple']],
  ['micro', 'Microcoche', 0.7, 1.1, { hood: 0.12, cabin: 0.64, round: 0.34, wheels: [0.22, 0.78] }, ['pink', 'cyan', 'yellow', 'white', 'green', 'orange']],
  ['armored_pickup', 'Pickup Blindada', 1.2, 2.3, { hood: 0.22, cabin: 0.3, round: 0.03, bed: '#2a2d33' }, ['silver', 'black', 'white']],
  ['hoversport', 'Aerodeportivo', 1, 2, { hood: 0.32, cabin: 0.28, round: 0.4 }, ['purple', 'pink', 'cyan', 'green', 'yellow', 'red'], true],
];
for (const [id, name, w, h, spec, colours, hover] of MORE_CARS) {
  for (const cid of colours) {
    const [, cname, hex] = paintOf(cid);
    const g = (NEONS.find((n) => n[0] === cid) ?? NEONS[0])[2];
    add(`car_${id}_${cid}`, `${name} ${cname}`, 'cy_vehicles', w, h, `coche vehiculo ${id} ${cname.toLowerCase()}`, (k) =>
      vehicle(k, { ...spec, body: hex, ...(hover ? { hover: g, underglow: g } : {}) })
    );
  }
}

['red', 'blue', 'yellow', 'green'].forEach((cid, i) => {
  const [, cname, hex] = paintOf(cid);
  add(`race_car_${cid}`, `Coche de Carreras ${cname}`, 'cy_vehicles', 1, 2.1, 'coche carreras deportivo', (k) =>
    vehicle(k, { body: hex, hood: 0.36, cabin: 0.24, round: 0.36, stripes: '#f2f2ee', extra: (kk) => {
      kk.rect(0.08, 0.86, 0.84, 0.06, plain('#15161a'), 0.02);
      kk.disc(0.5, 0.22, 0.12, WHITE);
      label(kk, String(i + 7), 0.5, 0.22, 0.16, '#111');
    } })
  );
});

for (const cid of ['pink', 'cyan', 'yellow', 'orange']) {
  const [, cname, g] = glowOf(cid);
  add(`food_truck_${cid}`, `Food Truck ${cname}`, 'cy_vehicles', 1.2, 2.4, 'furgoneta comida food truck', (k) =>
    vehicle(k, { body: '#e4e6ea', hood: 0.12, cabin: 0.8, round: 0.1, extra: (kk) => {
      kk.glow(0.08, 0.58, 0.3, g, 0.5);
      for (let y = 0.3; y < 0.85; y += 0.1) kk.rect(0.04, y, 0.06, 0.05, plain(g), 0.01, { edge: false });
      neon(kk, [[0.3, 0.36], [0.7, 0.36]], g, 0.03);
      kk.disc(0.5, 0.62, 0.1, metal('#8a9098'));
    } }), [g, 2.5, 0.5]
  );
}

const SPECIALS: [string, string, number, number, string, Car, [string, number, number?]?][] = [
  ['news_van', 'Furgoneta de Noticias', 1.1, 2.2, 'furgoneta prensa noticias antena', { body: '#e4e6ea', hood: 0.1, cabin: 0.84, round: 0.1, stripes: '#2350a8', extra: (k) => { k.disc(0.5, 0.55, 0.16, CHROME); k.ring(0.5, 0.55, 0.1, '#6a7078', 0.02); k.dot(0.5, 0.55, 0.03, '#ff3b4a'); } }],
  ['swat_van', 'Furgón de Asalto', 1.2, 2.4, 'policia swat furgon', { body: '#1a1c22', hood: 0.1, cabin: 0.84, round: 0.06, extra: (k) => { lightbar(0.13)(k); k.rect(0.3, 0.55, 0.4, 0.12, plain('#e8e6e0'), 0.01, { edge: false }); } }, ['#3a6aff', 3, 0.6]],
  ['tow_truck', 'Grúa', 1.2, 2.6, 'grua remolque camion', { body: '#e0661c', hood: 0.08, cabin: 0.22, round: 0.06, wheels: [0.16, 0.8], extra: (k) => { k.rect(0.16, 0.36, 0.68, 0.56, metal('#3a3d44'), 0.02); k.stroke([[0.5, 0.42], [0.5, 0.96]], '#c8ccd2', 0.06); k.ring(0.5, 0.97, 0.05, '#c8ccd2', 0.02); lightbar(0.12, '#ffb02f', '#ffb02f')(k); } }],
  ['cement_mixer', 'Hormigonera', 1.3, 3, 'camion hormigonera obra', { body: '#d8dce2', hood: 0.08, cabin: 0.2, round: 0.06, wheels: [0.16, 0.68, 0.86], extra: (k) => { k.oval(0.5, 0.62, 0.34, 0.27, metal('#e0661c')); for (let y = 0.42; y < 0.86; y += 0.08) k.stroke([[0.2, y], [0.8, y + 0.04]], '#a04a14', 0.03, false); } }],
  ['fuel_tanker', 'Camión Cisterna', 1.3, 3.4, 'cisterna combustible camion', { body: '#c41e24', hood: 0.08, cabin: 0.18, round: 0.06, wheels: [0.14, 0.7, 0.86], extra: (k) => { k.rect(0.14, 0.3, 0.72, 0.64, CHROME, 0.3); k.poly([[0.5, 0.56], [0.58, 0.64], [0.5, 0.72], [0.42, 0.64]], plain('#ffb02f')); } }],
  ['motorhome', 'Autocaravana', 1.3, 3.2, 'caravana casa rodante', { body: '#e8e4d8', hood: 0.1, cabin: 0.86, round: 0.08, wheels: [0.16, 0.84], stripes: '#5a3a22', extra: (k) => { k.rect(0.32, 0.4, 0.36, 0.12, GLASS, 0.03); k.rect(0.36, 0.66, 0.28, 0.12, metal('#9aa2ac'), 0.03); } }],
  ['military_jeep', 'Todoterreno Militar', 1.1, 1.9, 'jeep militar ejercito', { body: '#4a5a3a', hood: 0.26, cabin: 0.5, round: 0.06, extra: (k) => { k.disc(0.5, 0.92, 0.12, BLACK); k.rect(0.3, 0.52, 0.4, 0.14, plain('#3a4a2a'), 0.02); } }],
  ['hover_limo', 'Aerolimusina', 1.1, 3.2, 'limusina voladora lujo', { body: '#1c1d22', hood: 0.14, cabin: 0.72, round: 0.3, hover: '#b14bff', underglow: '#b14bff', extra: (k) => neon(k, [[0.12, 0.15], [0.12, 0.85]], '#b14bff', 0.02) }],
  ['hover_bus', 'Aerobús', 1.3, 3.6, 'autobus volador transporte', { body: '#2a6ab0', roof: '#d8dce2', hood: 0.04, cabin: 0.92, round: 0.12, hover: '#2fe8ff', underglow: '#2fe8ff' }],
  ['hover_ambulance', 'Aeroambulancia', 1.2, 2.4, 'ambulancia voladora emergencia', { body: '#f2f2f0', hood: 0.1, cabin: 0.84, round: 0.2, hover: '#ff3b4a', underglow: '#ff3b4a', extra: (k) => { k.rect(0.42, 0.42, 0.16, 0.36, plain('#d02030'), 0.01, { edge: false }); k.rect(0.3, 0.54, 0.4, 0.12, plain('#d02030'), 0.01, { edge: false }); lightbar(0.13)(k); } }, ['#ff2a3a', 3, 0.6]],
  ['street_sweeper', 'Barredora', 1.1, 1.8, 'barredora limpieza calle', { body: '#e0b020', hood: 0.12, cabin: 0.34, round: 0.12, wheels: [0.3, 0.8], extra: (k) => { for (const x of [0.2, 0.8]) { k.disc(x, 0.08, 0.14, plain('#3a3d44')); k.ring(x, 0.08, 0.1, '#6a7078', 0.02); } lightbar(0.48, '#ffb02f', '#ffb02f')(k); } }],
  ['prison_bus', 'Furgón Penitenciario', 1.3, 3.6, 'autobus prision presos', { body: '#3a3d44', hood: 0.04, cabin: 0.92, round: 0.05, wheels: [0.14, 0.84], extra: (k) => { for (let y = 0.2; y < 0.9; y += 0.08) k.stroke([[0.22, y], [0.78, y]], '#1a1c20', 0.03, false); lightbar(0.08)(k); } }],
  ['mail_van', 'Furgoneta de Correos', 1.1, 2.1, 'correos reparto furgoneta', { body: '#2350a8', hood: 0.1, cabin: 0.84, round: 0.1, stripes: '#e0b020' }],
  ['armored_limo', 'Limusina Blindada', 1.2, 3.2, 'limusina blindada corporativa', { body: '#25272d', roof: '#3a3d44', hood: 0.14, cabin: 0.72, round: 0.08, wheels: [0.14, 0.86], extra: (k) => { for (let y = 0.3; y < 0.8; y += 0.1) k.rect(0.12, y, 0.04, 0.06, metal('#5a606a'), 0.01); } }],
];
for (const [id, name, w, h, tags, car, light] of SPECIALS) add(id, name, 'cy_vehicles', w, h, tags, (k) => vehicle(k, car), light);

function bike(k: Kit, body: string, glow?: string) {
  if (glow) k.glow(0.5, 0.5, 0.6, glow, 0.5);
  for (const y of [0.02, 0.8]) k.rect(0.36, y, 0.28, 0.18, BLACK, 0.08, { shadow: true });
  k.stroke([[0.5, 0.1], [0.5, 0.9]], '#2a2d33', 0.14);
  k.stroke([[0.1, 0.2], [0.9, 0.2]], '#9aa2ac', 0.06);
  k.oval(0.5, 0.42, 0.2, 0.14, metal(body), { shadow: true });
  k.oval(0.5, 0.64, 0.15, 0.11, cloth('#1a1414'));
  k.glow(0.5, 0.04, 0.2, '#fff2c0', 0.5);
}
for (const cid of ['red', 'black', 'purple', 'silver']) {
  const [, cname, hex] = paintOf(cid);
  add(`chopper_${cid}`, `Chopper ${cname}`, 'cy_vehicles', 0.7, 1.8, 'moto chopper', (k) => bike(k, hex));
}
add('sidecar', 'Moto con Sidecar', 'cy_vehicles', 1.3, 1.8, 'moto sidecar', (k) => {
  k.ctx.save();
  k.ctx.scale(0.55, 1);
  bike(k, '#2a5a34');
  k.ctx.restore();
  k.oval(0.78, 0.52, 0.18, 0.26, metal('#2a5a34'), { shadow: true });
  k.oval(0.78, 0.56, 0.11, 0.14, cloth('#1a1414'));
});
add('trike', 'Triciclo Motorizado', 'cy_vehicles', 1, 1.6, 'triciclo moto', (k) => {
  for (const x of [0.12, 0.88]) k.rect(x - 0.1, 0.72, 0.2, 0.24, BLACK, 0.08);
  k.rect(0.4, 0.02, 0.2, 0.16, BLACK, 0.08);
  k.rect(0.16, 0.66, 0.68, 0.24, metal('#b82230'), 0.1, { shadow: true });
  k.stroke([[0.5, 0.1], [0.5, 0.7]], '#2a2d33', 0.1);
  k.oval(0.5, 0.42, 0.14, 0.12, metal('#b82230'));
  k.stroke([[0.25, 0.2], [0.75, 0.2]], '#9aa2ac', 0.05);
});
for (const [cid, cname, g] of N4) {
  add(`hoverboard_${cid}`, `Aeropatín ${cname}`, 'cy_vehicles', 0.5, 1, 'patin volador hoverboard', (k) => {
    k.glow(0.5, 0.5, 0.6, g, 0.7);
    k.oval(0.5, 0.5, 0.36, 0.46, DARK, { shadow: true });
    neonLoop(k, [[0.3, 0.12], [0.7, 0.12], [0.8, 0.5], [0.7, 0.88], [0.3, 0.88], [0.2, 0.5]], g, 0.05);
  }, [g, 1.5, 0.5]);
}
for (const cid of ['red', 'blue', 'white', 'yellow']) {
  const [, cname, hex] = paintOf(cid);
  add(`wreck_car_${cid}`, `Coche Destrozado ${cname}`, 'cy_vehicles', 1, 2, 'chatarra coche accidente', (k) =>
    vehicle(k, { body: tint(hex, -50), hood: 0.22, cabin: 0.48, round: 0.1, extra: (kk) => {
      for (let i = 0; i < 6; i++) kk.lump(kk.between(0.15, 0.85), kk.between(0.1, 0.9), kk.between(0.06, 0.12), metal('#6a3a1c'), 7, 0.4);
      for (let i = 0; i < 5; i++) {
        const x = kk.between(0.25, 0.75);
        const y = kk.between(0.25, 0.7);
        kk.stroke([[x, y], [x + kk.between(-0.15, 0.15), y + kk.between(-0.1, 0.1)]], 'rgba(220,240,255,0.7)', 0.012, false);
      }
    } })
  );
}
add('shopping_cart', 'Carrito de Compra', 'cy_vehicles', 0.6, 0.9, 'carro compra supermercado', (k) => {
  k.rect(0.08, 0.1, 0.84, 0.72, CHROME, 0.04, { shadow: true });
  for (let x = 0.16; x < 0.9; x += 0.1) k.stroke([[x, 0.12], [x, 0.8]], '#6a7078', 0.02, false);
  k.stroke([[0.08, 0.92], [0.92, 0.92]], '#c41e24', 0.06);
  k.lump(0.45, 0.4, 0.14, cloth('#3a3a3a'), 7, 0.3);
});
add('hand_truck', 'Carretilla de Carga', 'cy_vehicles', 0.5, 0.8, 'carretilla transporte cajas', (k) => {
  k.rect(0.12, 0.05, 0.76, 0.85, plain('rgba(0,0,0,0)'), 0.02, { edge: false });
  for (const x of [0.15, 0.85]) k.stroke([[x, 0.05], [x, 0.92]], '#c41e24', 0.06);
  k.rect(0.18, 0.2, 0.64, 0.5, wood('#a07a4a'), 0.02, { shadow: true });
  k.stroke([[0.18, 0.45], [0.82, 0.45]], '#c8b080', 0.03, false);
  for (const x of [0.15, 0.85]) k.disc(x, 0.9, 0.1, BLACK);
});
for (const [cid, cname, g] of N3) {
  add(`rickshaw_${cid}`, `Rickshaw Neón ${cname}`, 'cy_vehicles', 1, 1.6, 'rickshaw taxi bicicleta', (k) => {
    k.glow(0.5, 0.6, 0.6, g, 0.4);
    k.rect(0.36, 0.02, 0.28, 0.16, BLACK, 0.08);
    k.stroke([[0.5, 0.1], [0.5, 0.45]], '#2a2d33', 0.08);
    for (const x of [0.1, 0.9]) k.rect(x - 0.08, 0.6, 0.16, 0.28, BLACK, 0.08);
    k.rect(0.14, 0.42, 0.72, 0.5, cloth(tint(g, -100)), 0.14, { shadow: true });
    neon(k, [[0.16, 0.44], [0.84, 0.44]], g, 0.04);
  }, [g, 2, 0.4]);
}
for (const [cid, cname, hex] of [['white', 'Blanco', '#e4e6ea'], ['black', 'Negro', '#25272d']] as const) {
  add(`delivery_bot_${cid}`, `Robot de Reparto ${cname}`, 'cy_vehicles', 0.6, 0.7, 'robot reparto pedido', (k) => {
    for (const y of [0.12, 0.88]) for (const x of [0.1, 0.9]) k.disc(x, y, 0.1, BLACK);
    k.rect(0.1, 0.08, 0.8, 0.84, metal(hex), 0.12, { shadow: true });
    k.rect(0.2, 0.2, 0.6, 0.12, liquid('#103040'), 0.04);
    k.dot(0.35, 0.26, 0.04, '#2fe8ff');
    k.dot(0.65, 0.26, 0.04, '#2fe8ff');
    k.stroke([[0.78, 0.6], [0.78, 0.2]], '#3a3d44', 0.03, false);
    k.dot(0.78, 0.18, 0.05, '#ff8a2f');
  });
}
add('cargo_drone_big', 'Dron de Carga Pesado', 'cy_vehicles', 1.6, 1.6, 'dron carga grande', (k) => {
  for (const [x, y] of [[0.18, 0.18], [0.82, 0.18], [0.18, 0.82], [0.82, 0.82]] as P[]) {
    k.stroke([[0.5, 0.5], [x, y]], '#3a3d44', 0.06);
    k.disc(x, y, 0.15, plain('rgba(150,160,175,0.35)'), { edge: false });
    k.ring(x, y, 0.15, '#2a2d33', 0.02);
    k.disc(x, y, 0.04, DARK);
  }
  k.rect(0.3, 0.3, 0.4, 0.4, wood('#a07a4a'), 0.03, { shadow: true });
  k.rect(0.36, 0.36, 0.28, 0.28, metal('#e0b020'), 0.03);
  k.dot(0.5, 0.5, 0.04, '#ff3b4a');
});

// ======================= Food & market =======================
for (const [cid, cname, g] of NEONS.slice(0, 6)) {
  add(`food_cart_${cid}`, `Carrito de Comida ${cname}`, 'cy_food', 1.6, 1, 'carrito puesto comida callejera', (k) => {
    k.rect(0.04, 0.3, 0.92, 0.62, metal('#3a3d44'), 0.06, { shadow: true });
    k.rect(0.1, 0.4, 0.4, 0.4, metal('#1a1b1f'), 0.04);
    k.flame(0.3, 0.6, 0.12);
    for (let i = 0; i < 3; i++) k.disc(0.62 + i * 0.1, 0.6, 0.06, plain('#e8e0cc'));
    for (let i = 0; i < 6; i++) k.rect(0.02 + i * 0.16, 0.02, 0.16, 0.3, plain(i % 2 ? '#f2f0ea' : tint(g, -40)), 0, { edge: false, shadow: i === 0 });
    neon(k, [[0.03, 0.31], [0.97, 0.31]], g, 0.04);
  }, [g, 2.5, 0.6]);
}
const FRUITS: [string, string, string][] = [
  ['apple', 'Manzanas', '#c8202a'], ['orange', 'Naranjas', '#f08a1c'], ['lime', 'Limas', '#7ac83a'],
  ['grape', 'Uvas', '#6a2a8a'], ['banana', 'Plátanos', '#f0d030'], ['synth', 'Fruta Sintética', '#2fe8ff'],
];
for (const [id, name, hex] of FRUITS) {
  add(`fruit_crate_${id}`, `Caja de ${name}`, 'cy_food', 1, 0.7, 'fruta caja mercado', (k) => {
    k.rect(0.04, 0.06, 0.92, 0.88, wood('#9a7244'), 0.03, { shadow: true });
    k.rect(0.1, 0.14, 0.8, 0.72, plain('#3a2a1a'), 0.02);
    for (let i = 0; i < 22; i++) k.stud(k.between(0.16, 0.84), k.between(0.2, 0.8), k.between(0.06, 0.08), hex);
    if (id === 'synth') k.glow(0.5, 0.5, 0.5, hex, 0.35);
  });
}
for (const [id, name, hex] of [['chili', 'Chile', '#c03018'], ['curry', 'Cúrcuma', '#e0a020'], ['herb', 'Hierbas', '#4a7a2a'], ['salt', 'Sal', '#e8e4dc']] as const) {
  add(`spice_sack_${id}`, `Saco de ${name}`, 'cy_food', 0.8, 0.8, 'saco especias mercado', (k) => {
    k.lump(0.5, 0.5, 0.44, cloth('#b09a70'), 10, 0.18, { shadow: true });
    k.lump(0.5, 0.5, 0.3, plain(hex), 10, 0.2);
    for (let i = 0; i < 12; i++) k.dot(k.between(0.32, 0.68), k.between(0.32, 0.68), 0.02, tint(hex, k.rand() > 0.5 ? 40 : -40));
  });
}
for (const [cid, cname, g] of N3) {
  add(`soda_cooler_${cid}`, `Nevera de Refrescos ${cname}`, 'cy_food', 1.2, 0.7, 'nevera refrescos bebidas', (k) => {
    k.rect(0.03, 0.06, 0.94, 0.88, metal('#e4e6ea'), 0.08, { shadow: true });
    k.rect(0.08, 0.14, 0.84, 0.72, liquid('#1a3a50'), 0.04);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) k.dot(0.15 + c * 0.11, 0.28 + r * 0.22, 0.05, k.pick(['#c8202a', '#2350a8', '#e8e6e0', g]));
    neon(k, [[0.08, 0.92], [0.92, 0.92]], g, 0.04);
  }, [g, 1.5, 0.4]);
}
for (const [cid, cname, g] of NEONS.slice(0, 5)) {
  add(`umbrella_table_${cid}`, `Mesa con Sombrilla ${cname}`, 'cy_food', 1.4, 1.4, 'mesa sombrilla terraza', (k) => {
    for (let i = 0; i < 8; i++) {
      const a0 = (i / 8) * TAU;
      const a1 = ((i + 1) / 8) * TAU;
      k.poly([[0.5, 0.5], [0.5 + Math.cos(a0) * 0.46, 0.5 + Math.sin(a0) * 0.46], [0.5 + Math.cos(a1) * 0.46, 0.5 + Math.sin(a1) * 0.46]], cloth(i % 2 ? '#f2f0ea' : tint(g, -50)), { shadow: i === 0 });
    }
    k.dot(0.5, 0.5, 0.04, g);
  });
}
for (const cid of ['red', 'blue', 'green', 'yellow']) {
  const [, cname, hex] = paintOf(cid);
  add(`plastic_stool_${cid}`, `Taburete de Plástico ${cname}`, 'cy_food', 0.4, 0.4, 'taburete plastico asiento', (k) => {
    k.disc(0.5, 0.5, 0.42, plain(hex), { shadow: true });
    k.disc(0.5, 0.5, 0.08, plain(tint(hex, -60)));
    for (let i = 0; i < 6; i++) k.dot(0.5 + Math.cos((i / 6) * TAU) * 0.24, 0.5 + Math.sin((i / 6) * TAU) * 0.24, 0.04, tint(hex, -60));
  });
}
add('noodle_counter', 'Barra de Fideos', 'cy_food', 3, 1, 'barra fideos ramen restaurante', (k) => {
  k.rect(0.01, 0.05, 0.98, 0.9, wood('#5a3a22'), 0.04, { shadow: true });
  k.rect(0.02, 0.6, 0.96, 0.32, wood('#8a5c34'), 0.03);
  for (let i = 0; i < 5; i++) {
    const x = 0.1 + i * 0.2;
    k.disc(x, 0.76, 0.1, plain('#f2f0ea'));
    k.disc(x, 0.76, 0.07, plain('#d8a050'));
    k.stroke([[x - 0.02, 0.7], [x + 0.03, 0.82]], '#3a2a1a', 0.01, false);
  }
  for (let i = 0; i < 3; i++) { k.disc(0.2 + i * 0.3, 0.3, 0.14, metal('#8a9098')); k.flame(0.2 + i * 0.3, 0.3, 0.07); }
}, ['#ff9a1f', 2.5, 0.5]);
add('sushi_belt', 'Cinta de Sushi', 'cy_food', 3, 1.2, 'sushi cinta restaurante', (k) => {
  k.rect(0.01, 0.1, 0.98, 0.8, metal('#9aa2ac'), 0.3, { shadow: true });
  k.rect(0.08, 0.32, 0.84, 0.36, wood('#5a3a22'), 0.2);
  for (let i = 0; i < 14; i++) {
    const top = i < 7;
    const x = 0.08 + (i % 7) * 0.14;
    const y = top ? 0.2 : 0.8;
    k.disc(x, y, 0.08, plain(k.pick(['#2a6ab0', '#c8202a', '#e0b020', '#2a8a4a'])));
    k.dot(x, y, 0.045, k.pick(['#f08060', '#f2f0ea', '#e8b030']));
  }
});
add('dumpling_steamer', 'Vaporera de Dumplings', 'cy_food', 0.7, 0.7, 'vaporera dumplings bambu', (k) => {
  k.disc(0.5, 0.5, 0.44, wood('#c8a060'), { shadow: true });
  k.ring(0.5, 0.5, 0.36, '#8a6a3a', 0.03);
  around7(k, (x, y) => k.disc(x, y, 0.1, plain('#f2ece0')));
  for (let i = 0; i < 3; i++) k.disc(k.between(0.3, 0.7), k.between(0.3, 0.7), 0.16, plain('rgba(240,240,245,0.25)'), { edge: false });
});
function around7(k: Kit, draw: (x: number, y: number) => void) {
  draw(0.5, 0.5);
  for (let i = 0; i < 6; i++) draw(0.5 + Math.cos((i / 6) * TAU) * 0.22, 0.5 + Math.sin((i / 6) * TAU) * 0.22);
}
add('street_grill', 'Parrilla Callejera', 'cy_food', 1.2, 0.7, 'parrilla barbacoa brochetas', (k) => {
  k.rect(0.03, 0.08, 0.94, 0.84, DARK, 0.05, { shadow: true });
  k.rect(0.08, 0.16, 0.84, 0.68, plain('#3a1a0a'), 0.03);
  k.glow(0.5, 0.5, 0.45, '#ff6a1a', 0.6);
  for (let i = 0; i < 7; i++) {
    const x = 0.14 + i * 0.12;
    k.stroke([[x, 0.12], [x, 0.88]], '#9aa2ac', 0.015, false);
    for (let j = 0; j < 3; j++) k.lump(x, 0.3 + j * 0.2, 0.05, plain('#8a3a1a'), 6, 0.3);
  }
}, ['#ff6a1a', 2, 0.5]);
add('pizza_oven', 'Horno de Pizza', 'cy_food', 1.2, 1.2, 'horno pizza leña', (k) => {
  k.disc(0.5, 0.5, 0.46, stone('#8a5a3a'), { shadow: true });
  k.disc(0.5, 0.5, 0.34, stone('#5a3a2a'));
  k.rect(0.38, 0.8, 0.24, 0.16, plain('#1a0a04'), 0.04);
  k.glow(0.5, 0.88, 0.25, '#ff8a2f', 0.7);
  k.flame(0.5, 0.9, 0.07);
}, ['#ff8a2f', 2.5, 0.6]);
add('coffee_machine', 'Máquina de Café', 'cy_food', 0.6, 0.5, 'cafe cafetera barista', (k) => {
  k.rect(0.05, 0.08, 0.9, 0.84, CHROME, 0.06, { shadow: true });
  k.rect(0.12, 0.16, 0.76, 0.3, DARK, 0.04);
  for (const x of [0.32, 0.68]) { k.disc(x, 0.68, 0.12, plain('#f2f0ea')); k.disc(x, 0.68, 0.08, plain('#5a3a22')); }
  k.dot(0.8, 0.3, 0.04, '#3fff8a');
});
add('cash_register', 'Caja Registradora', 'cy_food', 0.6, 0.5, 'caja registradora tienda pago', (k) => {
  k.rect(0.05, 0.1, 0.9, 0.8, DARK, 0.06, { shadow: true });
  screen(k, 0.15, 0.16, 0.7, 0.26, '#3fff8a', 2);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) k.rect(0.17 + c * 0.17, 0.5 + r * 0.12, 0.12, 0.09, plain('#5a606a'), 0.02);
});
add('takeout_pile', 'Montón de Comida para Llevar', 'cy_food', 0.8, 0.8, 'cajas comida llevar basura', (k) => {
  for (let i = 0; i < 7; i++) {
    const x = k.between(0.2, 0.8);
    const y = k.between(0.2, 0.8);
    k.rect(x - 0.12, y - 0.1, 0.24, 0.2, plain(k.pick(['#f2f0ea', '#e8dcc0', '#c8202a'])), 0.03, { shadow: true });
    k.stroke([[x - 0.1, y], [x + 0.1, y]], '#a8a090', 0.01, false);
  }
});
add('fish_stall', 'Puesto de Pescado', 'cy_food', 2, 1, 'pescado mercado puesto hielo', (k) => {
  k.rect(0.02, 0.06, 0.96, 0.88, metal('#9aa2ac'), 0.04, { shadow: true });
  k.rect(0.06, 0.14, 0.88, 0.72, plain('#d8eef4'), 0.03);
  for (let i = 0; i < 9; i++) {
    const x = 0.14 + (i % 5) * 0.18;
    const y = i < 5 ? 0.35 : 0.65;
    k.oval(x, y, 0.07, 0.08, metal(k.pick(['#8a9aa8', '#c87060', '#6a7a88'])));
    k.dot(x - 0.04, y, 0.012, '#111');
  }
});
add('meat_hooks', 'Ganchos de Carne', 'cy_food', 1.6, 0.6, 'carne carniceria ganchos', (k) => {
  k.stroke([[0.04, 0.2], [0.96, 0.2]], '#6a7078', 0.05);
  for (let i = 0; i < 5; i++) {
    const x = 0.14 + i * 0.18;
    k.stroke([[x, 0.2], [x, 0.36]], '#9aa2ac', 0.02, false);
    k.lump(x, 0.58, 0.16, plain(k.pick(['#a03028', '#8a2a24', '#b04a3a'])), 8, 0.25, { shadow: true });
    k.oval(x, 0.6, 0.04, 0.1, plain('#e8d8c8'));
  }
}, undefined, 'above_walls');
add('noodle_bowl', 'Cuenco de Ramen', 'cy_food', 0.4, 0.4, 'ramen fideos cuenco', (k) => {
  k.disc(0.5, 0.5, 0.44, plain('#c8202a'), { shadow: true });
  k.disc(0.5, 0.5, 0.36, plain('#d8a050'));
  k.disc(0.36, 0.42, 0.1, plain('#f2f0ea'));
  k.dot(0.36, 0.42, 0.05, '#f0b020');
  k.rect(0.55, 0.5, 0.18, 0.08, plain('#2a4a2a'), 0.01);
  k.stroke([[0.2, 0.9], [0.9, 0.2]], '#3a2a1a', 0.04, false);
});
add('tea_set', 'Juego de Té', 'cy_food', 0.6, 0.6, 'te tetera tazas', (k) => {
  k.rect(0.05, 0.05, 0.9, 0.9, wood('#5a3a22'), 0.08, { shadow: true });
  k.disc(0.5, 0.45, 0.2, plain('#2a6a5a'));
  k.dot(0.5, 0.45, 0.06, '#1a4a3a');
  for (const [x, y] of [[0.22, 0.78], [0.5, 0.82], [0.78, 0.78]] as P[]) { k.disc(x, y, 0.08, plain('#f2f0ea')); k.dot(x, y, 0.05, '#8a6a2a'); }
});
for (const [cid, cname, g] of N3) {
  add(`synth_vat_${cid}`, `Cuba de Proteína ${cname}`, 'cy_food', 1.1, 1.1, 'cuba proteina sintetica fabrica', (k) => {
    k.disc(0.5, 0.5, 0.46, STEEL, { shadow: true });
    k.disc(0.5, 0.5, 0.36, liquid(tint(g, -60)));
    k.glow(0.5, 0.5, 0.4, g, 0.6);
    k.ring(0.5, 0.5, 0.4, '#3a3d44', 0.03);
    for (let i = 0; i < 5; i++) k.dot(k.between(0.3, 0.7), k.between(0.3, 0.7), 0.03, tint(g, 60));
  }, [g, 2, 0.5]);
}
for (const [cid, cname, g] of [glowOf('pink'), glowOf('cyan'), glowOf('yellow')]) {
  add(`menu_board_${cid}`, `Menú Holográfico ${cname}`, 'cy_food', 1.4, 0.4, 'menu cartel precios', (k) => {
    k.rect(0.02, 0.08, 0.96, 0.84, plain('rgba(10,10,18,0.8)'), 0.06, { shadow: true });
    for (let i = 0; i < 3; i++) screen(k, 0.06 + i * 0.31, 0.18, 0.26, 0.64, g, 2);
  }, [g, 1.5, 0.5], 'above_walls');
}

// ======================= Clinic & lab =======================
for (const [cid, cname, hex] of [['white', 'Blanco', '#e8eaee'], ['blue', 'Azul', '#7ab0d8']] as const) {
  add(`hospital_bed_${cid}`, `Cama de Hospital ${cname}`, 'cy_medical', 1, 2, 'cama hospital clinica', (k) => {
    k.rect(0.04, 0.02, 0.92, 0.96, CHROME, 0.06, { shadow: true });
    k.rect(0.1, 0.06, 0.8, 0.88, plain('#f2f4f6'), 0.05);
    k.rect(0.2, 0.08, 0.6, 0.14, cloth('#ffffff'), 0.06);
    k.rect(0.1, 0.36, 0.8, 0.56, cloth(hex), 0.04);
    k.rect(0.7, 0.02, 0.24, 0.1, DARK, 0.02);
    k.dot(0.82, 0.07, 0.025, '#3fff8a');
  });
}
add('surgery_table', 'Mesa de Quirófano', 'cy_medical', 1.2, 2.2, 'quirofano cirugia operacion', (k) => {
  k.glow(0.5, 0.4, 0.6, '#e8f4ff', 0.5);
  k.rect(0.2, 0.06, 0.6, 0.88, plain('#4a8a9a'), 0.1, { shadow: true });
  k.disc(0.5, 0.35, 0.28, CHROME, { shadow: true });
  for (let i = 0; i < 6; i++) k.dot(0.5 + Math.cos((i / 6) * TAU) * 0.16, 0.35 + Math.sin((i / 6) * TAU) * 0.08, 0.04, '#fffbe8');
  k.rect(0.82, 0.6, 0.16, 0.3, CHROME, 0.02);
}, ['#e8f4ff', 2.5, 0.7]);
add('med_cabinet', 'Armario de Medicinas', 'cy_medical', 1, 0.5, 'armario medicinas botiquin', (k) => {
  k.rect(0.03, 0.08, 0.94, 0.84, plain('#e8eaee'), 0.04, { shadow: true });
  k.stroke([[0.5, 0.1], [0.5, 0.9]], '#a8b0b8', 0.02, false);
  k.rect(0.42, 0.28, 0.16, 0.44, plain('#d02030'), 0.01, { edge: false });
  k.rect(0.3, 0.42, 0.4, 0.16, plain('#d02030'), 0.01, { edge: false });
});
add('iv_stand', 'Gotero', 'cy_medical', 0.4, 0.4, 'gotero suero hospital', (k) => {
  for (let i = 0; i < 5; i++) k.stroke([[0.5, 0.5], [0.5 + Math.cos((i / 5) * TAU) * 0.42, 0.5 + Math.sin((i / 5) * TAU) * 0.42]], '#9aa2ac', 0.05);
  k.rect(0.32, 0.3, 0.36, 0.4, liquid('#d8eef8'), 0.1, { shadow: true });
  k.dot(0.5, 0.5, 0.06, '#c8202a');
});
add('biohazard_bin', 'Contenedor Biológico', 'cy_medical', 0.5, 0.5, 'residuos biologicos peligro', (k) => {
  k.rect(0.06, 0.06, 0.88, 0.88, plain('#e8c21c'), 0.1, { shadow: true });
  k.ring(0.5, 0.5, 0.12, '#111', 0.05);
  for (let i = 0; i < 3; i++) k.ring(0.5 + Math.cos((i / 3) * TAU - Math.PI / 2) * 0.16, 0.5 + Math.sin((i / 3) * TAU - Math.PI / 2) * 0.16, 0.14, '#111', 0.05);
});
add('organ_cooler', 'Nevera de Órganos', 'cy_medical', 0.7, 0.5, 'organos transplante nevera', (k) => {
  k.rect(0.05, 0.08, 0.9, 0.84, plain('#f2f4f6'), 0.08, { shadow: true });
  k.rect(0.1, 0.14, 0.8, 0.3, plain('#2a6ab0'), 0.04);
  label(k, 'ORGAN', 0.5, 0.68, 0.18, '#c8202a');
});
add('limb_rack', 'Estante de Prótesis', 'cy_medical', 1.6, 0.6, 'protesis brazos piernas implantes', (k) => {
  k.rect(0.02, 0.1, 0.96, 0.8, DARK, 0.03, { shadow: true });
  for (let i = 0; i < 5; i++) {
    const x = 0.12 + i * 0.19;
    k.stroke([[x, 0.2], [x, 0.78]], i % 2 ? '#b4bcc6' : '#5a606a', 0.08);
    k.disc(x, 0.8, 0.08, CHROME);
    k.dot(x, 0.46, 0.03, '#2fe8ff');
  }
});
add('prosthetic_table', 'Mesa de Implantes', 'cy_medical', 1.4, 0.8, 'implantes cyberware mesa', (k) => {
  k.rect(0.03, 0.06, 0.94, 0.88, STEEL, 0.04, { shadow: true });
  k.stroke([[0.2, 0.5], [0.55, 0.5], [0.7, 0.35]], '#b4bcc6', 0.12);
  for (const [x, y] of [[0.72, 0.3], [0.76, 0.36], [0.74, 0.42]] as P[]) k.stroke([[0.7, 0.35], [x + 0.04, y - 0.04]], '#b4bcc6', 0.03);
  k.dot(0.4, 0.5, 0.04, '#2fe8ff');
  k.glow(0.4, 0.5, 0.15, '#2fe8ff', 0.5);
  for (let i = 0; i < 4; i++) k.rect(0.08 + i * 0.06, 0.12, 0.04, 0.16, CHROME, 0.01);
});
add('dna_sequencer', 'Secuenciador de ADN', 'cy_medical', 1, 0.8, 'adn genetica laboratorio', (k) => {
  k.rect(0.04, 0.06, 0.92, 0.88, plain('#e8eaee'), 0.06, { shadow: true });
  k.rect(0.12, 0.14, 0.76, 0.56, liquid('#0a1a2a'), 0.04);
  const a: P[] = [];
  const b: P[] = [];
  for (let i = 0; i <= 12; i++) {
    const x = 0.16 + i * 0.056;
    a.push([x, 0.42 + Math.sin(i * 0.9) * 0.18]);
    b.push([x, 0.42 - Math.sin(i * 0.9) * 0.18]);
  }
  neon(k, a, '#3fff8a', 0.025);
  neon(k, b, '#2fe8ff', 0.025);
  k.rect(0.3, 0.78, 0.4, 0.08, DARK, 0.02);
}, ['#3fff8a', 1.5, 0.4]);
add('microscope_bench', 'Mesa de Microscopios', 'cy_medical', 1.6, 0.7, 'microscopio laboratorio', (k) => {
  k.rect(0.02, 0.06, 0.96, 0.88, plain('#e8eaee'), 0.04, { shadow: true });
  for (const x of [0.25, 0.7]) {
    k.oval(x, 0.5, 0.1, 0.2, DARK);
    k.disc(x, 0.34, 0.06, CHROME);
    k.dot(x, 0.6, 0.04, '#fff6d0');
  }
  for (let i = 0; i < 4; i++) k.rect(0.86, 0.15 + i * 0.18, 0.08, 0.12, liquid(k.pick(['#c8202a', '#2a8a4a', '#2a6ab0'])), 0.02);
});
for (const [cid, cname, g] of N4) {
  add(`specimen_tank_${cid}`, `Tanque de Especímenes ${cname}`, 'cy_medical', 0.9, 0.9, 'tanque especimen experimento', (k) => {
    k.disc(0.5, 0.5, 0.46, DARK, { shadow: true });
    k.disc(0.5, 0.5, 0.38, liquid(tint(g, -90)));
    k.glow(0.5, 0.5, 0.4, g, 0.55);
    k.lump(0.5, 0.5, 0.18, plain(tint(g, -130)), 9, 0.4);
    for (let i = 0; i < 6; i++) k.dot(k.between(0.25, 0.75), k.between(0.25, 0.75), 0.02, '#ffffff');
  }, [g, 2, 0.5]);
}
add('lab_bench', 'Banco de Laboratorio', 'cy_medical', 2, 0.8, 'laboratorio quimica matraces', (k) => {
  k.rect(0.02, 0.06, 0.96, 0.88, plain('#2a2d33'), 0.04, { shadow: true });
  for (let i = 0; i < 8; i++) {
    const x = 0.08 + i * 0.12;
    const c = k.pick(['#3fff8a', '#ff3fb0', '#2fe8ff', '#ffe12f']);
    k.disc(x, k.between(0.35, 0.65), 0.08, liquid(tint(c, -60)));
  }
  k.rect(0.7, 0.15, 0.25, 0.2, CHROME, 0.02);
});
add('centrifuge', 'Centrifugadora', 'cy_medical', 0.7, 0.7, 'centrifugadora laboratorio', (k) => {
  k.rect(0.05, 0.05, 0.9, 0.9, plain('#e8eaee'), 0.12, { shadow: true });
  k.disc(0.5, 0.5, 0.32, DARK);
  for (let i = 0; i < 8; i++) k.dot(0.5 + Math.cos((i / 8) * TAU) * 0.22, 0.5 + Math.sin((i / 8) * TAU) * 0.22, 0.04, '#9aa2ac');
  k.dot(0.85, 0.15, 0.04, '#3fff8a');
});
add('gurney', 'Camilla', 'cy_medical', 0.8, 1.8, 'camilla hospital', (k) => {
  k.rect(0.08, 0.02, 0.84, 0.96, CHROME, 0.06, { shadow: true });
  k.rect(0.14, 0.06, 0.72, 0.88, cloth('#d8eef4'), 0.05);
  k.rect(0.24, 0.08, 0.52, 0.12, cloth('#ffffff'), 0.05);
  for (const y of [0.04, 0.96]) for (const x of [0.12, 0.88]) k.dot(x, y, 0.04, '#111');
});
add('wheelchair', 'Silla de Ruedas', 'cy_medical', 0.7, 0.8, 'silla ruedas', (k) => {
  for (const x of [0.08, 0.92]) k.rect(x - 0.06, 0.2, 0.12, 0.62, BLACK, 0.06);
  k.rect(0.18, 0.15, 0.64, 0.7, cloth('#2a2d33'), 0.06, { shadow: true });
  k.rect(0.2, 0.7, 0.6, 0.12, cloth('#1a1b1f'), 0.04);
  for (const x of [0.24, 0.76]) k.stroke([[x, 0.88], [x, 0.98]], '#9aa2ac', 0.04);
});
add('defibrillator', 'Desfibrilador', 'cy_medical', 0.6, 0.5, 'desfibrilador emergencia', (k) => {
  k.rect(0.05, 0.08, 0.9, 0.84, plain('#e0b020'), 0.08, { shadow: true });
  screen(k, 0.14, 0.16, 0.44, 0.3, '#3fff8a', 1);
  for (const x of [0.28, 0.72]) k.disc(x, 0.72, 0.13, plain('#c8202a'));
});
add('pharmacy_shelf', 'Estante de Farmacia', 'cy_medical', 2, 0.5, 'farmacia medicamentos', (k) => {
  k.rect(0.01, 0.06, 0.98, 0.88, plain('#e8eaee'), 0.03, { shadow: true });
  for (let i = 0; i < 16; i++) k.rect(0.03 + (i % 8) * 0.12, i < 8 ? 0.14 : 0.54, 0.1, 0.32, plain(k.pick(['#f2f0ea', '#2a6ab0', '#3fbf6a', '#d02030', '#e0b020'])), 0.02);
});
for (const [cid, cname, g] of [glowOf('green'), glowOf('cyan'), glowOf('pink')]) {
  add(`pill_vending_${cid}`, `Expendedora de Pastillas ${cname}`, 'cy_medical', 0.9, 0.7, 'pastillas drogas expendedora', (k) => {
    k.rect(0.04, 0.06, 0.92, 0.88, metal('#e4e6ea'), 0.06, { shadow: true });
    k.rect(0.1, 0.12, 0.55, 0.76, liquid('#10202a'), 0.03);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) k.dot(0.17 + c * 0.13, 0.22 + r * 0.18, 0.035, k.pick([g, '#f2f0ea', '#ff3b4a']));
    k.rect(0.42 + 0.3, 0.2, 0.14, 0.14, plain(g), 0.02, { edge: false });
    neon(k, [[0.08, 0.92], [0.92, 0.92]], g, 0.035);
  }, [g, 2, 0.5]);
}
add('scanner_bed', 'Escáner Corporal', 'cy_medical', 1.2, 2.2, 'escaner tac resonancia', (k) => {
  k.rect(0.25, 0.04, 0.5, 0.92, plain('#e8eaee'), 0.1, { shadow: true });
  k.rect(0.06, 0.5, 0.88, 0.26, plain('#f2f4f6'), 0.3, { shadow: true });
  k.rect(0.12, 0.56, 0.76, 0.14, DARK, 0.3);
  neon(k, [[0.14, 0.63], [0.86, 0.63]], '#2fe8ff', 0.03);
}, ['#2fe8ff', 2, 0.5]);
add('xray_box', 'Negatoscopio', 'cy_medical', 1, 0.4, 'rayos x radiografia', (k) => {
  k.rect(0.02, 0.08, 0.96, 0.84, DARK, 0.04, { shadow: true });
  k.rect(0.06, 0.18, 0.88, 0.64, plain('#e8f4ff'), 0.02);
  k.glow(0.5, 0.5, 0.5, '#e8f4ff', 0.4);
  for (let i = 0; i < 3; i++) k.stroke([[0.15 + i * 0.28, 0.3], [0.25 + i * 0.28, 0.7]], 'rgba(60,70,90,0.5)', 0.06, false);
}, ['#e8f4ff', 1.5, 0.4], 'above_walls');
for (const [cid, cname, g] of [glowOf('green'), glowOf('cyan')]) {
  add(`clone_vat_${cid}`, `Cuba de Clonación ${cname}`, 'cy_medical', 1.2, 1.2, 'clon clonacion cuba', (k) => {
    k.disc(0.5, 0.5, 0.47, STEEL, { shadow: true });
    k.disc(0.5, 0.5, 0.38, liquid(tint(g, -80)));
    k.glow(0.5, 0.5, 0.45, g, 0.6);
    k.oval(0.5, 0.5, 0.1, 0.26, plain(tint(g, -140)));
    k.disc(0.5, 0.3, 0.08, plain(tint(g, -140)));
    for (let i = 0; i < 4; i++) k.stroke([[0.5 + Math.cos((i / 4) * TAU + 0.8) * 0.47, 0.5 + Math.sin((i / 4) * TAU + 0.8) * 0.47], [0.5 + Math.cos((i / 4) * TAU + 0.8) * 0.6, 0.5 + Math.sin((i / 4) * TAU + 0.8) * 0.6]], '#3a3d44', 0.05);
  }, [g, 2.5, 0.6]);
}
add('chem_hood', 'Campana de Gases', 'cy_medical', 1.4, 0.8, 'campana extractora quimica', (k) => {
  k.rect(0.02, 0.05, 0.96, 0.9, plain('#d8dce2'), 0.04, { shadow: true });
  k.rect(0.08, 0.12, 0.84, 0.6, liquid('#2a4050'), 0.02);
  for (let i = 0; i < 4; i++) k.disc(0.2 + i * 0.2, 0.42, 0.07, liquid(k.pick(['#3fff8a', '#ffe12f', '#ff3fb0'])));
  k.rect(0.08, 0.78, 0.84, 0.1, DARK, 0.02);
});

// ======================= Transit =======================
for (const [cid, cname, g] of [glowOf('cyan'), glowOf('pink'), glowOf('yellow')]) {
  add(`subway_car_${cid}`, `Vagón de Metro ${cname}`, 'cy_transit', 1.4, 6, 'metro vagon tren', (k) => {
    k.rect(0.04, 0.005, 0.92, 0.99, metal('#b4bcc6'), 0.1, { shadow: true });
    k.rect(0.12, 0.02, 0.76, 0.96, metal('#9aa2ac'), 0.06);
    for (let y = 0.1; y < 0.95; y += 0.12) k.rect(0.3, y, 0.4, 0.05, DARK, 0.02);
    for (const x of [0.04, 0.92]) for (let y = 0.15; y < 0.9; y += 0.25) k.rect(x, y, 0.04, 0.08, plain(g), 0.01, { edge: false });
    k.glow(0.5, 0.01, 0.4, '#fff2c0', 0.4);
  }, [g, 3, 0.4]);
}
add('turnstile', 'Torniquete', 'cy_transit', 1, 0.5, 'torniquete acceso metro', (k) => {
  for (const x of [0.04, 0.42, 0.8]) k.rect(x, 0.1, 0.16, 0.8, CHROME, 0.04, { shadow: true });
  for (const x of [0.2, 0.58]) { k.stroke([[x, 0.5], [x + 0.2, 0.5]], '#c41e24', 0.04); }
  for (const x of [0.12, 0.5, 0.88]) k.dot(x, 0.3, 0.04, '#3fff8a');
});
for (const [cid, cname, g] of N3) {
  add(`ticket_machine_${cid}`, `Máquina de Billetes ${cname}`, 'cy_transit', 0.8, 0.6, 'billetes metro maquina', (k) => {
    k.rect(0.05, 0.08, 0.9, 0.84, DARK, 0.06, { shadow: true });
    screen(k, 0.14, 0.16, 0.72, 0.4, g, 3);
    k.rect(0.3, 0.66, 0.4, 0.1, plain('#0a0b0c'), 0.02);
  }, [g, 1.5, 0.5]);
}
add('subway_bench', 'Banco de Andén', 'cy_transit', 2, 0.6, 'banco anden metro', (k) => {
  k.rect(0.02, 0.1, 0.96, 0.8, metal('#3a6aa0'), 0.08, { shadow: true });
  for (let x = 0.2; x < 0.95; x += 0.2) k.stroke([[x, 0.12], [x, 0.88]], '#2a4a70', 0.03, false);
});
add('platform_edge', 'Borde de Andén', 'cy_transit', 4, 0.4, 'anden borde tactil', (k) => {
  k.rect(0, 0.1, 1, 0.8, plain('#e0b020'), 0);
  for (let x = 0.01; x < 1; x += 0.025) for (const y of [0.3, 0.7]) k.dot(x, y, 0.06, '#b08a10');
}, undefined, 'below_floor');
add('metro_map', 'Mapa del Metro', 'cy_transit', 1.6, 0.3, 'mapa metro lineas', (k) => {
  k.rect(0.02, 0.05, 0.96, 0.9, plain('#f2f0ea'), 0.03, { shadow: true });
  for (const [c, y] of [['#c8202a', 0.3], ['#2350a8', 0.5], ['#2a8a4a', 0.7]] as const) {
    k.stroke([[0.06, y], [0.4, y + 0.1], [0.94, y - 0.05]], c, 0.12, false);
  }
}, undefined, 'above_walls');
add('escalator', 'Escalera Mecánica', 'cy_transit', 1.2, 3, 'escalera mecanica', (k) => {
  for (const x of [0.04, 0.84]) k.rect(x, 0.01, 0.12, 0.98, CHROME, 0.05, { shadow: true });
  k.rect(0.16, 0.01, 0.68, 0.98, metal('#3a3d44'), 0.02);
  for (let y = 0.03; y < 0.98; y += 0.04) k.stroke([[0.17, y], [0.83, y]], '#1a1b1f', 0.015, false);
  for (const x of [0.1, 0.9]) neon(k, [[x, 0.03], [x, 0.97]], '#2fe8ff', 0.02);
}, undefined, 'below_floor');
add('elevator', 'Ascensor', 'cy_transit', 1.4, 1.4, 'ascensor elevador', (k) => {
  k.rect(0.04, 0.04, 0.92, 0.92, metal('#3a3d44'), 0.03, { shadow: true });
  k.rect(0.1, 0.1, 0.8, 0.8, CHROME, 0.02);
  k.stroke([[0.5, 0.1], [0.5, 0.9]], '#6a7078', 0.02, false);
  k.dot(0.92, 0.5, 0.03, '#ffe12f');
});
for (const [cid, cname, g] of [glowOf('cyan'), glowOf('green'), glowOf('yellow'), glowOf('blue')]) {
  add(`charge_post_${cid}`, `Cargador Eléctrico ${cname}`, 'cy_transit', 0.5, 0.5, 'cargador electrico coche', (k) => {
    k.glow(0.5, 0.5, 0.5, g, 0.5);
    k.rect(0.15, 0.15, 0.7, 0.7, DARK, 0.12, { shadow: true });
    k.poly([[0.55, 0.22], [0.38, 0.52], [0.5, 0.52], [0.45, 0.78], [0.62, 0.46], [0.5, 0.46]], plain(g));
  }, [g, 1.2, 0.5]);
}
add('parking_gate', 'Barrera de Parking', 'cy_transit', 2.2, 0.4, 'barrera parking aparcamiento', (k) => {
  k.rect(0.02, 0.1, 0.14, 0.8, metal('#e0b020'), 0.04, { shadow: true });
  for (let x = 0.16; x < 0.98; x += 0.08) k.rect(x, 0.38, 0.08, 0.24, plain(Math.round(x * 12.5) % 2 ? '#d02020' : '#f2f2ee'), 0, { edge: false });
  k.dot(0.09, 0.5, 0.06, '#ff3b4a');
}, undefined, 'above_walls');
add('toll_booth', 'Cabina de Peaje', 'cy_transit', 1.2, 1.6, 'peaje cabina', (k) => {
  k.rect(0.08, 0.06, 0.84, 0.88, metal('#e4e6ea'), 0.06, { shadow: true });
  k.rect(0.14, 0.12, 0.72, 0.5, GLASS, 0.03);
  k.rect(0.02, 0.02, 0.96, 0.08, plain('#e0b020'), 0.02);
  k.dot(0.5, 0.78, 0.07, '#3fff8a');
});
const ARROWS: [string, string, P[]][] = [
  ['straight', 'Recta', [[0.5, 0.92], [0.5, 0.2]]],
  ['left', 'Izquierda', [[0.6, 0.92], [0.6, 0.45], [0.25, 0.25]]],
  ['right', 'Derecha', [[0.4, 0.92], [0.4, 0.45], [0.75, 0.25]]],
  ['uturn', 'Cambio de Sentido', [[0.7, 0.92], [0.7, 0.35], [0.5, 0.15], [0.3, 0.35], [0.3, 0.6]]],
];
for (const [id, name, pts] of ARROWS) {
  add(`road_arrow_${id}`, `Flecha de Carril ${name}`, 'cy_transit', 1, 2, 'flecha carretera señal suelo', (k) => {
    k.stroke(pts, 'rgba(240,240,235,0.9)', 0.12, false);
    const [x1, y1] = pts[pts.length - 1];
    const [x0, y0] = pts[pts.length - 2];
    const a = Math.atan2((y1 - y0) * k.H, (x1 - x0) * k.W);
    const r = 0.16;
    k.poly([
      [x1 + (Math.cos(a) * r * k.m) / k.W, y1 + (Math.sin(a) * r * k.m) / k.H],
      [x1 + (Math.cos(a + 2.4) * r * k.m) / k.W, y1 + (Math.sin(a + 2.4) * r * k.m) / k.H],
      [x1 + (Math.cos(a - 2.4) * r * k.m) / k.W, y1 + (Math.sin(a - 2.4) * r * k.m) / k.H],
    ], plain('rgba(240,240,235,0.9)'), { edge: false });
  }, undefined, 'below_floor');
}
add('crosswalk', 'Paso de Peatones', 'cy_transit', 3, 1, 'paso cebra peatones', (k) => {
  for (let x = 0.02; x < 1; x += 0.1) k.rect(x, 0.04, 0.055, 0.92, plain('rgba(240,240,235,0.88)'), 0, { edge: false });
}, undefined, 'below_floor');
add('bike_rack', 'Aparcabicis', 'cy_transit', 2, 0.6, 'aparcamiento bicicletas', (k) => {
  for (let i = 0; i < 6; i++) k.ring(0.1 + i * 0.16, 0.5, 0.18, '#9aa2ac', 0.05, Math.PI, TAU);
  k.stroke([[0.02, 0.5], [0.98, 0.5]], '#6a7078', 0.04);
});
add('scooter_dock', 'Estación de Patinetes', 'cy_transit', 1.6, 0.6, 'patinetes alquiler', (k) => {
  k.rect(0.02, 0.1, 0.96, 0.25, DARK, 0.04, { shadow: true });
  for (let i = 0; i < 4; i++) {
    const x = 0.14 + i * 0.24;
    k.stroke([[x, 0.3], [x, 0.9]], '#2fe8ff', 0.08);
    k.dot(x, 0.22, 0.04, '#3fff8a');
  }
}, ['#2fe8ff', 1.2, 0.3]);
for (const [cid, cname, g] of [glowOf('cyan'), glowOf('yellow'), glowOf('pink')]) {
  add(`landing_pad_${cid}`, `Plataforma de Aterrizaje ${cname}`, 'cy_transit', 3, 3, 'plataforma aterrizaje aerodino', (k) => {
    k.disc(0.5, 0.5, 0.48, stone('#3a3d42'));
    k.ring(0.5, 0.5, 0.42, g, 0.02);
    for (let i = 0; i < 12; i++) k.dot(0.5 + Math.cos((i / 12) * TAU) * 0.45, 0.5 + Math.sin((i / 12) * TAU) * 0.45, 0.015, g);
    neonLoop(k, [[0.5, 0.25], [0.72, 0.65], [0.28, 0.65]], g, 0.02);
  }, [g, 4, 0.4], 'below_floor');
}
add('helipad', 'Helipuerto', 'cy_transit', 4, 4, 'helipuerto helicoptero', (k) => {
  k.disc(0.5, 0.5, 0.48, stone('#4a4d52'));
  k.ring(0.5, 0.5, 0.4, '#f2f2ee', 0.02);
  label(k, 'H', 0.5, 0.52, 0.4, '#f2f2ee');
  for (let i = 0; i < 8; i++) k.dot(0.5 + Math.cos((i / 8) * TAU) * 0.46, 0.5 + Math.sin((i / 8) * TAU) * 0.46, 0.012, '#ffe12f');
}, undefined, 'below_floor');
for (const [cid, cname, hex] of [['red', 'Roja', '#c41e24'], ['green', 'Verde', '#2a8a4a'], ['blue', 'Azul', '#2350a8']] as const) {
  add(`fuel_pump_${cid}`, `Surtidor ${cname}`, 'cy_transit', 0.8, 0.6, 'surtidor gasolinera combustible', (k) => {
    k.rect(0.1, 0.08, 0.8, 0.84, metal(hex), 0.06, { shadow: true });
    k.rect(0.2, 0.16, 0.6, 0.28, liquid('#0a1a10'), 0.03);
    label(k, '88.8', 0.5, 0.3, 0.16, '#3fff8a');
    k.stroke([[0.88, 0.6], [0.98, 0.7], [0.9, 0.9]], '#111', 0.04, false, true);
  });
}
add('car_wash', 'Túnel de Lavado', 'cy_transit', 2.5, 3, 'lavado coches tunel', (k) => {
  for (const x of [0.02, 0.88]) k.rect(x, 0.02, 0.1, 0.96, metal('#e4e6ea'), 0.03, { shadow: true });
  for (const y of [0.3, 0.7]) for (const x of [0.25, 0.75]) {
    k.disc(x, y, 0.13, plain('#2a6ab0'));
    k.ring(x, y, 0.09, '#5a9ae0', 0.04);
  }
  k.rect(0.02, 0.48, 0.96, 0.04, CHROME, 0.01);
}, undefined, 'above_walls');
add('speed_bump', 'Badén', 'cy_transit', 2, 0.3, 'baden reductor velocidad', (k) => {
  k.rect(0.01, 0.1, 0.98, 0.8, plain('#2a2a2a'), 0.3);
  for (let x = 0.04; x < 0.96; x += 0.12) k.poly([[x, 0.15], [x + 0.06, 0.15], [x + 0.1, 0.85], [x + 0.04, 0.85]], plain('#e0b020'), { edge: false });
}, undefined, 'below_floor');
for (const [cid, cname, c] of [['white', 'Blanca', 'rgba(240,240,235,0.85)'], ['yellow', 'Amarilla', 'rgba(230,190,30,0.9)']] as const) {
  add(`parking_spot_${cid}`, `Plaza de Parking ${cname}`, 'cy_transit', 1.4, 2.6, 'plaza aparcamiento lineas', (k) => {
    k.stroke([[0.04, 0.02], [0.04, 0.98], [0.96, 0.98], [0.96, 0.02]], c, 0.06, false);
  }, undefined, 'below_floor');
}

// ======================= Corporate offices =======================
const DESKS: [string, string, string, typeof plain][] = [
  ['black', 'Negro', '#1c1d22', metal], ['white', 'Blanco', '#e4e6ea', plain], ['walnut', 'Nogal', '#5a3a22', wood], ['glass', 'Cristal', '#7ab8d0', liquid],
];
for (const [id, name, hex, mat] of DESKS) {
  add(`exec_desk_${id}`, `Escritorio Ejecutivo ${name}`, 'cy_office', 2, 1, 'escritorio oficina despacho', (k) => {
    k.rect(0.02, 0.06, 0.96, 0.88, mat(hex), 0.06, { shadow: true });
    k.rect(0.3, 0.12, 0.4, 0.1, DARK, 0.02);
    k.glow(0.5, 0.17, 0.2, '#2fe8ff', 0.35);
    k.rect(0.36, 0.4, 0.28, 0.12, plain('#2a2d33'), 0.02);
    k.disc(0.75, 0.46, 0.05, plain('#2a2d33'));
    k.disc(0.15, 0.3, 0.07, plain('#f2f0ea'));
  });
}
add('meeting_table', 'Mesa de Reuniones', 'cy_office', 3, 1.5, 'mesa reuniones sala juntas', (k) => {
  for (let i = 0; i < 6; i++) for (const y of [0.08, 0.92]) k.disc(0.15 + i * 0.14, y, 0.1, cloth('#1a1b1f'), { shadow: true });
  k.oval(0.5, 0.5, 0.46, 0.36, liquid('#3a5a6a'), { shadow: true });
  k.oval(0.5, 0.5, 0.4, 0.3, liquid('#4a6a7a'));
  k.glow(0.5, 0.5, 0.2, '#2fe8ff', 0.4);
  k.disc(0.5, 0.5, 0.06, DARK);
});
add('cubicle', 'Cubículo', 'cy_office', 2, 2, 'cubiculo oficina mesa', (k) => {
  k.stroke([[0.03, 0.97], [0.03, 0.03], [0.97, 0.03], [0.97, 0.6]], '#7a8290', 0.05);
  k.poly([[0.07, 0.07], [0.93, 0.07], [0.93, 0.35], [0.35, 0.35], [0.35, 0.93], [0.07, 0.93]], plain('#d8dce2'), { shadow: true });
  k.rect(0.4, 0.1, 0.22, 0.08, DARK, 0.02);
  k.disc(0.55, 0.55, 0.12, cloth('#2a2d33'), { shadow: true });
});
for (const [cid, cname, hex] of [['grey', 'Gris', '#6a7280'], ['black', 'Negro', '#25272d'], ['white', 'Blanco', '#e4e6ea']] as const) {
  add(`filing_cabinet_${cid}`, `Archivador ${cname}`, 'cy_office', 0.6, 0.6, 'archivador cajones', (k) => {
    k.rect(0.05, 0.05, 0.9, 0.9, metal(hex), 0.04, { shadow: true });
    for (let i = 0; i < 3; i++) k.rect(0.38, 0.18 + i * 0.28, 0.24, 0.06, CHROME, 0.02);
  });
}
add('water_cooler', 'Dispensador de Agua', 'cy_office', 0.5, 0.5, 'agua dispensador', (k) => {
  k.rect(0.1, 0.1, 0.8, 0.8, plain('#e8eaee'), 0.08, { shadow: true });
  k.disc(0.5, 0.5, 0.3, liquid('#6ab0e0'));
  k.dot(0.5, 0.5, 0.1, '#2a6ab0');
});
add('copier', 'Fotocopiadora', 'cy_office', 1, 0.7, 'fotocopiadora impresora', (k) => {
  k.rect(0.04, 0.06, 0.92, 0.88, plain('#d8dce2'), 0.05, { shadow: true });
  k.rect(0.1, 0.12, 0.6, 0.5, GLASS, 0.02);
  k.rect(0.76, 0.14, 0.16, 0.2, DARK, 0.02);
  k.rect(0.2, 0.7, 0.5, 0.16, plain('#f2f0ea'), 0.01);
});
add('reception', 'Recepción Corporativa', 'cy_office', 3, 1.2, 'recepcion mostrador corporativo', (k) => {
  k.poly([[0.02, 0.3], [0.5, 0.08], [0.98, 0.3], [0.98, 0.95], [0.02, 0.95]], metal('#e4e6ea'), { shadow: true });
  k.poly([[0.08, 0.5], [0.5, 0.32], [0.92, 0.5], [0.92, 0.9], [0.08, 0.9]], wood('#3a2a1e'));
  neon(k, [[0.02, 0.3], [0.5, 0.08], [0.98, 0.3]], '#2fe8ff', 0.03);
  for (const x of [0.3, 0.7]) k.rect(x - 0.06, 0.55, 0.12, 0.08, DARK, 0.02);
}, ['#2fe8ff', 2.5, 0.5]);
for (const [cid, cname, g] of N4) {
  add(`logo_holo_${cid}`, `Logotipo Holográfico ${cname}`, 'cy_office', 1.5, 1.5, 'logo holograma corporacion', (k) => {
    k.disc(0.5, 0.5, 0.2, DARK, { shadow: true });
    k.glow(0.5, 0.5, 0.48, g, 0.55);
    neonLoop(k, [[0.5, 0.14], [0.82, 0.32], [0.82, 0.68], [0.5, 0.86], [0.18, 0.68], [0.18, 0.32]], g, 0.025);
    neonLoop(k, [[0.5, 0.3], [0.66, 0.6], [0.34, 0.6]], g, 0.025);
  }, [g, 2.5, 0.6]);
}
add('bonsai', 'Bonsái', 'cy_office', 0.6, 0.6, 'bonsai arbol planta', (k) => {
  k.rect(0.12, 0.25, 0.76, 0.5, stone('#3a3d42'), 0.06, { shadow: true });
  k.stroke([[0.5, 0.5], [0.4, 0.35], [0.6, 0.3]], '#5a3a22', 0.06, false, true);
  k.foliage(0.45, 0.35, 0.22, ['#2a5a2a', '#3a7a3a', '#4a8a4a'], 18, 0.08);
});
add('whiteboard', 'Pizarra Digital', 'cy_office', 1.6, 0.3, 'pizarra pantalla', (k) => {
  k.rect(0.02, 0.05, 0.96, 0.9, plain('#f2f4f6'), 0.03, { shadow: true });
  k.stroke([[0.1, 0.6], [0.3, 0.3], [0.5, 0.5], [0.8, 0.25]], '#2a6ab0', 0.08, false);
  k.stroke([[0.1, 0.8], [0.9, 0.8]], '#c8202a', 0.05, false);
}, undefined, 'above_walls');
add('ceo_chair', 'Sillón de Director', 'cy_office', 0.8, 0.8, 'sillon director ejecutivo', (k) => {
  for (let i = 0; i < 5; i++) k.stroke([[0.5, 0.5], [0.5 + Math.cos((i / 5) * TAU) * 0.44, 0.5 + Math.sin((i / 5) * TAU) * 0.44]], '#9aa2ac', 0.05);
  k.rect(0.16, 0.2, 0.68, 0.66, cloth('#3a1a14'), 0.18, { shadow: true });
  k.rect(0.14, 0.08, 0.72, 0.2, cloth('#2a120e'), 0.1);
  for (const x of [0.1, 0.9]) k.rect(x - 0.05, 0.3, 0.1, 0.45, cloth('#2a120e'), 0.05);
});
for (const [cid, cname, hex] of [['black', 'Negro', '#1c1c20'], ['brown', 'Marrón', '#5a3420'], ['white', 'Blanco', '#e8e4dc']] as const) {
  add(`leather_couch_${cid}`, `Sofá de Cuero ${cname}`, 'cy_office', 2.2, 0.9, 'sofa cuero', (k) => {
    k.rect(0.02, 0.06, 0.96, 0.88, cloth(hex), 0.14, { shadow: true });
    k.rect(0.02, 0.06, 0.96, 0.28, cloth(tint(hex, -14)), 0.12);
    for (const x of [0.06, 0.38, 0.66]) k.rect(x, 0.36, 0.28, 0.52, cloth(tint(hex, 10)), 0.08);
    for (let i = 0; i < 6; i++) k.dot(0.12 + i * 0.15, 0.2, 0.012, tint(hex, -40));
  });
}
add('glass_partition', 'Mampara de Cristal', 'cy_office', 3, 0.2, 'mampara cristal pared', (k) => {
  k.rect(0, 0.2, 1, 0.6, liquid('#9ac8e0'), 0.02);
  for (const x of [0.005, 0.33, 0.66, 0.99]) k.rect(x - 0.005, 0.1, 0.01, 0.8, CHROME, 0);
}, undefined, 'above_walls');
add('plant_wall', 'Jardín Vertical', 'cy_office', 3, 0.4, 'jardin vertical plantas pared', (k) => {
  k.rect(0.005, 0.05, 0.99, 0.9, plain('#2a2d33'), 0.02, { shadow: true });
  k.foliage(0.5, 0.5, 0.48, ['#2a6a2a', '#3a8a3a', '#4aa04a', '#1a4a1a'], 60, 0.03);
});
add('coffee_table_glass', 'Mesa Baja de Cristal', 'cy_office', 1.2, 0.7, 'mesa baja cristal', (k) => {
  k.rect(0.04, 0.06, 0.92, 0.88, liquid('#7ab0c8'), 0.1, { shadow: true });
  k.rect(0.3, 0.3, 0.2, 0.3, plain('#f2f0ea'), 0.02);
  k.disc(0.7, 0.5, 0.1, plain('#3a3d44'));
});
add('deposit_boxes', 'Cajas de Seguridad', 'cy_office', 2, 0.5, 'cajas seguridad banco', (k) => {
  k.rect(0.01, 0.06, 0.98, 0.88, metal('#8a8070'), 0.02, { shadow: true });
  for (let i = 0; i < 20; i++) {
    const x = 0.03 + (i % 10) * 0.097;
    const y = i < 10 ? 0.14 : 0.54;
    k.rect(x, y, 0.08, 0.32, metal('#b0a488'), 0.01);
    k.dot(x + 0.04, y + 0.16, 0.025, '#3a3020');
  }
});
add('data_vault', 'Cámara de Datos', 'cy_office', 1.6, 1.6, 'boveda datos servidor', (k) => {
  k.rect(0.04, 0.04, 0.92, 0.92, DARK, 0.06, { shadow: true });
  k.disc(0.5, 0.5, 0.36, metal('#5a606a'));
  k.ring(0.5, 0.5, 0.28, '#2fe8ff', 0.02);
  for (let i = 0; i < 6; i++) k.stroke([[0.5, 0.5], [0.5 + Math.cos((i / 6) * TAU) * 0.22, 0.5 + Math.sin((i / 6) * TAU) * 0.22]], '#b4bcc6', 0.04);
  k.dot(0.5, 0.5, 0.06, '#2fe8ff');
  frame(k, '#ff3b4a', 0.08, 0.02);
}, ['#2fe8ff', 2, 0.4]);
add('shredder', 'Destructora de Papel', 'cy_office', 0.5, 0.4, 'destructora papel', (k) => {
  k.rect(0.08, 0.08, 0.84, 0.84, DARK, 0.06, { shadow: true });
  k.rect(0.16, 0.42, 0.68, 0.08, plain('#0a0b0c'), 0.01);
  k.dot(0.82, 0.2, 0.04, '#3fff8a');
});
add('conference_screen', 'Pantalla de Conferencias', 'cy_office', 2.4, 0.3, 'pantalla videollamada', (k) => {
  k.rect(0.02, 0.06, 0.96, 0.88, DARK, 0.03, { shadow: true });
  for (let i = 0; i < 4; i++) screen(k, 0.04 + i * 0.24, 0.14, 0.2, 0.72, k.pick(['#2fe8ff', '#b14bff', '#3fff8a']), 1);
}, ['#2fe8ff', 2, 0.4], 'above_walls');

// ======================= More neon signs =======================
const SHAPES2: [string, string, (k: Kit, c: string) => void][] = [
  ['bolt', 'Neón Rayo', (k, c) => neonLoop(k, [[0.56, 0.12], [0.34, 0.54], [0.5, 0.54], [0.42, 0.88], [0.68, 0.42], [0.52, 0.42]], c)],
  ['music', 'Neón Nota Musical', (k, c) => {
    neon(k, [[0.38, 0.75], [0.38, 0.22], [0.66, 0.15], [0.66, 0.66]], c);
    k.ring(0.33, 0.76, 0.06, c, 0.025);
    k.ring(0.61, 0.68, 0.06, c, 0.025);
  }],
  ['dollar', 'Neón Dólar', (k, c) => {
    neon(k, [[0.64, 0.28], [0.36, 0.28], [0.36, 0.5], [0.64, 0.5], [0.64, 0.72], [0.36, 0.72]], c);
    neon(k, [[0.5, 0.14], [0.5, 0.86]], c);
  }],
  ['moon', 'Neón Luna', (k, c) => {
    k.ring(0.5, 0.5, 0.3, c, 0.03, 0.9, 5.4);
    k.ring(0.5, 0.5, 0.3, '#ffffff', 0.01, 0.9, 5.4);
  }],
  ['cocktail', 'Neón Cóctel', (k, c) => {
    neonLoop(k, [[0.28, 0.2], [0.72, 0.2], [0.5, 0.52]], c);
    neon(k, [[0.5, 0.52], [0.5, 0.82], [0.36, 0.84], [0.64, 0.84]], c);
    neon(k, [[0.58, 0.32], [0.74, 0.12]], c, 0.02);
  }],
  ['crown', 'Neón Corona', (k, c) => neonLoop(k, [[0.2, 0.75], [0.2, 0.3], [0.35, 0.5], [0.5, 0.22], [0.65, 0.5], [0.8, 0.3], [0.8, 0.75]], c)],
  ['diamond', 'Neón Diamante', (k, c) => {
    neonLoop(k, [[0.3, 0.3], [0.7, 0.3], [0.84, 0.42], [0.5, 0.86], [0.16, 0.42]], c);
    neon(k, [[0.16, 0.42], [0.84, 0.42]], c, 0.02);
  }],
];
for (const [shape, name, draw] of SHAPES2) {
  for (const [cid, cname, c] of [glowOf('pink'), glowOf('cyan'), glowOf('yellow')]) {
    add(`sign2_${shape}_${cid}`, `${name} ${cname}`, 'cy_signs', 1, 1, 'neon cartel letrero', (k) => {
      k.rect(0.04, 0.04, 0.92, 0.92, plain('rgba(12,10,18,0.75)'), 0.1, { shadow: true });
      draw(k, c);
    }, [c, 3, 0.7], 'above_walls');
  }
}
for (const [cid, cname, g] of NEONS.slice(0, 6)) {
  add(`vsign_${cid}`, `Cartel Vertical ${cname}`, 'cy_signs', 0.6, 2, 'cartel vertical kanji neon', (k) => {
    k.rect(0.06, 0.02, 0.88, 0.96, plain('rgba(12,10,18,0.85)'), 0.06, { shadow: true });
    frame(k, g, 0.08, 0.03);
    for (let i = 0; i < 4; i++) {
      const y = 0.1 + i * 0.21;
      for (let s = 0; s < 3; s++) {
        const a: P = [k.between(0.25, 0.75), y + k.between(0, 0.16)];
        neon(k, [a, [k.between(0.25, 0.75), y + k.between(0, 0.16)]], g, 0.04);
      }
    }
  }, [g, 2.5, 0.6], 'above_walls');
}
for (let i = 1; i <= 4; i++) {
  add(`poster_wall_${i}`, `Pared de Carteles ${i}`, 'cy_signs', 2, 0.3, 'carteles posters pared', (k) => {
    for (let j = 0; j < 9; j++) {
      const x = k.between(0.02, 0.86);
      k.rect(x, k.between(0.05, 0.25), k.between(0.1, 0.16), k.between(0.6, 0.7), plain(k.pick(['#ff3fb0', '#2fe8ff', '#ffe12f', '#f2f0ea', '#e0661c', '#b14bff'])), 0.01, { shadow: true });
    }
  }, undefined, 'above_walls');
}

// ======================= Street extras =======================
for (const [cid, cname, g] of N4) {
  add(`neon_puddle_${cid}`, `Charco con Reflejo ${cname}`, 'cy_street', 1.4, 1, 'charco agua reflejo lluvia', (k) => {
    k.lump(0.5, 0.5, 0.46, plain('rgba(16,24,32,0.75)'), 12, 0.3, { edge: false });
    k.glow(0.45, 0.48, 0.35, g, 0.45);
    k.stroke([[0.3, 0.42], [0.6, 0.45]], g, 0.03, false);
  }, undefined, 'below_floor');
}
add('overhead_cables', 'Cables Colgantes', 'cy_street', 4, 1, 'cables tendido electrico', (k) => {
  for (let i = 0; i < 5; i++) k.stroke([[0, k.between(0.1, 0.9)], [0.5, k.between(0.2, 0.8)], [1, k.between(0.1, 0.9)]], '#15161a', 0.025, false, true);
}, undefined, 'above_walls');
add('utility_pole', 'Poste Eléctrico', 'cy_street', 0.6, 0.6, 'poste electrico transformador', (k) => {
  k.disc(0.5, 0.5, 0.2, wood('#4a3a2a'), { shadow: true });
  k.stroke([[0.05, 0.5], [0.95, 0.5]], '#3a3d44', 0.08);
  k.rect(0.6, 0.2, 0.24, 0.2, metal('#6a7280'), 0.04);
});
add('fire_barrel', 'Bidón con Fuego', 'cy_street', 0.6, 0.6, 'bidon fuego calor', (k) => {
  k.disc(0.5, 0.5, 0.44, metal('#5a3a22'), { shadow: true });
  k.disc(0.5, 0.5, 0.34, plain('#1a0a04'));
  k.flame(0.5, 0.5, 0.3);
}, ['#ff8a2f', 3, 0.8]);
for (const [cid, cname, hex] of [['blue', 'Azul', '#2a5a9a'], ['green', 'Verde', '#3a6a3a'], ['orange', 'Naranja', '#c86a1a']] as const) {
  add(`tarp_tent_${cid}`, `Tienda de Lona ${cname}`, 'cy_street', 1.6, 1.4, 'tienda lona refugio', (k) => {
    k.poly([[0.04, 0.9], [0.5, 0.06], [0.96, 0.9]], cloth(hex), { shadow: true });
    k.stroke([[0.5, 0.06], [0.5, 0.9]], tint(hex, -40), 0.03, false);
    for (let i = 0; i < 3; i++) k.rect(k.between(0.2, 0.7), k.between(0.4, 0.8), 0.1, 0.08, cloth(tint(hex, 30)), 0.02);
  });
}
for (const [cid, cname, hex] of [['yellow', 'Amarillo', '#e0b020'], ['blue', 'Azul', '#2350a8'], ['green', 'Verde', '#2a8a4a']] as const) {
  add(`recycle_bin_${cid}`, `Contenedor de Reciclaje ${cname}`, 'cy_street', 1.2, 0.8, 'reciclaje contenedor', (k) => {
    k.rect(0.04, 0.06, 0.92, 0.88, plain(hex), 0.08, { shadow: true });
    k.rect(0.3, 0.4, 0.4, 0.2, plain(tint(hex, -60)), 0.06);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU - Math.PI / 2;
      k.dot(0.5 + Math.cos(a) * 0.12, 0.5 + Math.sin(a) * 0.16, 0.03, '#f2f2ee');
    }
  });
}
add('cardboard_boxes', 'Cajas de Cartón', 'cy_street', 1, 1, 'cajas carton basura', (k) => {
  for (let i = 0; i < 5; i++) {
    const x = k.between(0.2, 0.7);
    const y = k.between(0.2, 0.7);
    k.rect(x - 0.15, y - 0.15, k.between(0.26, 0.36), k.between(0.26, 0.36), plain('#b08a5a'), 0.02, { shadow: true });
    k.stroke([[x - 0.12, y], [x + 0.12, y]], '#8a6a40', 0.012, false);
  }
});

// ======================= Security extras =======================
add('checkpoint_booth', 'Garita de Control', 'cy_security', 1.4, 1.4, 'garita control policia', (k) => {
  k.rect(0.06, 0.06, 0.88, 0.88, metal('#3a3d44'), 0.06, { shadow: true });
  k.rect(0.14, 0.14, 0.72, 0.4, GLASS, 0.03);
  lightbar(0.04)(k);
  k.rect(0.3, 0.7, 0.4, 0.1, plain('#e0b020'), 0.02);
}, ['#ff2a3a', 2, 0.4]);
add('spike_strip', 'Banda de Pinchos', 'cy_security', 2, 0.3, 'pinchos trampa ruedas', (k) => {
  k.rect(0.01, 0.25, 0.98, 0.5, DARK, 0.05);
  for (let x = 0.03; x < 0.98; x += 0.05) k.poly([[x, 0.3], [x + 0.025, 0.05], [x + 0.05, 0.3]], CHROME, { edge: false });
}, undefined, 'below_floor');
add('razor_wire', 'Alambre de Espino', 'cy_security', 3, 0.5, 'alambre espino concertina', (k) => {
  for (let i = 0; i < 14; i++) k.ring(0.04 + i * 0.07, 0.5, 0.22, '#9aa2ac', 0.02);
  for (let i = 0; i < 30; i++) k.dot(k.between(0.02, 0.98), k.between(0.2, 0.8), 0.012, '#d8dce2');
});
for (const [cid, cname, g] of [glowOf('red'), glowOf('green'), glowOf('purple')]) {
  add(`laser_grid_${cid}`, `Rejilla Láser ${cname}`, 'cy_security', 3, 0.4, 'laser rejilla seguridad trampa', (k) => {
    for (const x of [0.03, 0.97]) k.rect(x - 0.025, 0.1, 0.05, 0.8, DARK, 0.04, { shadow: true });
    for (let i = 0; i < 4; i++) neon(k, [[0.05, 0.2 + i * 0.2], [0.95, 0.2 + (3 - i) * 0.2]], g, 0.025);
  }, [g, 2, 0.5]);
}
add('guard_tower', 'Torre de Vigilancia', 'cy_security', 2, 2, 'torre vigilancia guardia', (k) => {
  for (const [x, y] of [[0.1, 0.1], [0.9, 0.1], [0.1, 0.9], [0.9, 0.9]] as P[]) k.disc(x, y, 0.06, DARK);
  k.rect(0.14, 0.14, 0.72, 0.72, metal('#4a4d54'), 0.04, { shadow: true });
  k.rect(0.22, 0.22, 0.56, 0.56, metal('#3a3d44'), 0.03);
  k.glow(0.75, 0.25, 0.35, '#fff6d0', 0.5);
  k.disc(0.75, 0.25, 0.08, CHROME);
}, ['#fff6d0', 4, 0.6], 'above_walls');
add('police_barricade', 'Barrera Policial', 'cy_security', 2, 0.5, 'barrera policia cordon', (k) => {
  k.rect(0.02, 0.2, 0.96, 0.6, plain('#2350a8'), 0.06, { shadow: true });
  label(k, 'POLICE', 0.5, 0.5, 0.25, '#f2f2ee');
  for (const x of [0.04, 0.96]) { k.glow(x, 0.5, 0.15, '#3f7bff', 0.8); k.dot(x, 0.5, 0.06, '#3f7bff'); }
}, ['#3f7bff', 1.5, 0.4]);
add('riot_rack', 'Estante Antidisturbios', 'cy_security', 1.6, 0.6, 'escudos porras antidisturbios', (k) => {
  k.rect(0.02, 0.08, 0.96, 0.84, DARK, 0.03, { shadow: true });
  for (let i = 0; i < 4; i++) k.rect(0.06 + i * 0.23, 0.15, 0.18, 0.7, liquid('#5a7a90'), 0.04);
  for (let i = 0; i < 4; i++) k.stroke([[0.15 + i * 0.23, 0.2], [0.15 + i * 0.23, 0.8]], '#1a1b1f', 0.03, false);
});
add('sentry_pad', 'Base de Dron Centinela', 'cy_security', 1.2, 1.2, 'dron centinela base', (k) => {
  k.disc(0.5, 0.5, 0.46, metal('#3a3d44'), { shadow: true });
  k.ring(0.5, 0.5, 0.36, '#ff3b4a', 0.02);
  for (const [x, y] of [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]] as P[]) k.disc(x, y, 0.1, plain('rgba(150,160,175,0.35)'), { edge: false });
  k.disc(0.5, 0.5, 0.14, DARK);
  k.dot(0.5, 0.5, 0.05, '#ff3b4a');
}, ['#ff3b4a', 1.2, 0.4]);

// ======================= Nightlife extras =======================
for (const [cid, cname, g] of N4) {
  add(`neon_couch_${cid}`, `Sofá de Club ${cname}`, 'cy_nightlife', 2.4, 1.2, 'sofa club reservado', (k) => {
    k.poly([[0.02, 0.1], [0.98, 0.1], [0.98, 0.95], [0.8, 0.95], [0.8, 0.4], [0.2, 0.4], [0.2, 0.95], [0.02, 0.95]], cloth(tint(g, -130)), { shadow: true });
    neon(k, [[0.03, 0.95], [0.03, 0.12], [0.97, 0.12], [0.97, 0.95]], g, 0.025);
  }, [g, 2, 0.4]);
}
add('liquor_shelf', 'Estante de Licores', 'cy_nightlife', 2, 0.5, 'licores botellas bar', (k) => {
  k.rect(0.01, 0.06, 0.98, 0.88, wood('#2a1a12'), 0.03, { shadow: true });
  for (let i = 0; i < 18; i++) k.disc(0.04 + (i % 9) * 0.115, i < 9 ? 0.3 : 0.7, 0.08, liquid(k.pick(['#c8a040', '#8a2a1a', '#2a6a3a', '#e8e4dc', '#6a2a8a'])));
  neon(k, [[0.02, 0.5], [0.98, 0.5]], '#ff3fb0', 0.02);
}, ['#ff3fb0', 1.5, 0.3]);
for (const [cid, cname, g] of N3) {
  add(`hookah_${cid}`, `Cachimba ${cname}`, 'cy_nightlife', 0.6, 0.6, 'cachimba shisha', (k) => {
    k.disc(0.5, 0.5, 0.3, liquid(tint(g, -80)), { shadow: true });
    k.glow(0.5, 0.5, 0.35, g, 0.5);
    k.disc(0.5, 0.5, 0.12, metal('#c8a040'));
    k.dot(0.5, 0.5, 0.05, '#ff6a1a');
    k.stroke([[0.6, 0.55], [0.85, 0.7], [0.9, 0.9]], '#2a2d33', 0.03, false, true);
  }, [g, 1, 0.4]);
}
add('stage', 'Escenario', 'cy_nightlife', 4, 2, 'escenario concierto banda', (k) => {
  k.rect(0.01, 0.02, 0.98, 0.96, wood('#1a1416'), 0.03, { shadow: true });
  neon(k, [[0.02, 0.96], [0.98, 0.96]], '#b14bff', 0.03);
  for (const x of [0.08, 0.92]) k.rect(x - 0.06, 0.1, 0.12, 0.3, DARK, 0.03);
  k.disc(0.5, 0.35, 0.12, metal('#c8a040'));
  for (const x of [0.4, 0.6]) k.disc(x, 0.4, 0.06, metal('#b4bcc6'));
  k.dot(0.3, 0.7, 0.03, '#9aa2ac');
  k.dot(0.7, 0.7, 0.03, '#9aa2ac');
}, ['#b14bff', 4, 0.5]);
add('dancer_cage', 'Jaula de Baile', 'cy_nightlife', 1.2, 1.2, 'jaula baile go go', (k) => {
  k.disc(0.5, 0.5, 0.46, DARK, { shadow: true });
  k.glow(0.5, 0.5, 0.4, '#ff3fb0', 0.5);
  for (let i = 0; i < 12; i++) k.dot(0.5 + Math.cos((i / 12) * TAU) * 0.42, 0.5 + Math.sin((i / 12) * TAU) * 0.42, 0.025, '#d8dce2');
  k.ring(0.5, 0.5, 0.42, '#9aa2ac', 0.015);
}, ['#ff3fb0', 2, 0.6]);
add('disco_floor', 'Pista de Baile Led', 'cy_nightlife', 3, 3, 'pista baile disco led', (k) => {
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
    k.rect(c / 6 + 0.005, r / 6 + 0.005, 1 / 6 - 0.01, 1 / 6 - 0.01, plain(k.pick(['#ff3fb0', '#2fe8ff', '#b14bff', '#ffe12f', '#3fff8a', '#1a1a22'])), 0.01, { edge: false });
  }
}, ['#b14bff', 4, 0.5], 'below_floor');

// ======================= Tech extras =======================
for (const [cid, cname, g] of N4) {
  add(`hologram_figure_${cid}`, `Holograma Humano ${cname}`, 'cy_tech', 1, 1, 'holograma persona proyeccion', (k) => {
    k.disc(0.5, 0.5, 0.3, DARK, { shadow: true });
    k.glow(0.5, 0.5, 0.45, g, 0.6);
    k.disc(0.5, 0.42, 0.1, plain(g + '99'), { edge: false });
    k.oval(0.5, 0.6, 0.16, 0.1, plain(g + '77'), { edge: false });
    k.ring(0.5, 0.5, 0.28, g, 0.015);
  }, [g, 2, 0.5]);
  add(`cyberdeck_${cid}`, `Cyberdeck ${cname}`, 'cy_tech', 0.8, 0.5, 'cyberdeck hacker portatil', (k) => {
    k.rect(0.04, 0.06, 0.92, 0.88, DARK, 0.06, { shadow: true });
    screen(k, 0.1, 0.12, 0.5, 0.36, g, 3);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) k.rect(0.1 + c * 0.1, 0.56 + r * 0.11, 0.08, 0.08, plain('#3a3d44'), 0.01, { edge: false });
    k.stroke([[0.9, 0.3], [0.99, 0.2]], g, 0.02, false);
  }, [g, 1, 0.3]);
  add(`vr_pod_${cid}`, `Cápsula de Realidad Virtual ${cname}`, 'cy_tech', 1.2, 2, 'realidad virtual capsula inmersion', (k) => {
    k.rect(0.06, 0.02, 0.88, 0.96, metal('#e4e6ea'), 0.4, { shadow: true });
    k.rect(0.16, 0.1, 0.68, 0.8, liquid(tint(g, -110)), 0.36);
    k.glow(0.5, 0.5, 0.5, g, 0.4);
    neonLoop(k, [[0.16, 0.3], [0.84, 0.3], [0.84, 0.7], [0.16, 0.7]], g, 0.02);
  }, [g, 2, 0.5]);
}
add('mech_suit', 'Exotraje de Combate', 'cy_tech', 1.4, 1.4, 'exotraje armadura mecha', (k) => {
  for (const x of [0.22, 0.78]) k.rect(x - 0.12, 0.3, 0.24, 0.5, metal('#5a606a'), 0.08, { shadow: true });
  k.rect(0.28, 0.2, 0.44, 0.6, metal('#7a8290'), 0.1, { shadow: true });
  k.disc(0.5, 0.42, 0.12, liquid('#1a2a3a'));
  k.dot(0.5, 0.42, 0.04, '#ff3b4a');
  for (const x of [0.12, 0.88]) k.disc(x, 0.85, 0.1, DARK);
});
for (const [cid, cname, g] of [glowOf('cyan'), glowOf('purple')]) {
  add(`quantum_core_${cid}`, `Núcleo Cuántico ${cname}`, 'cy_tech', 1.4, 1.4, 'nucleo cuantico energia', (k) => {
    k.disc(0.5, 0.5, 0.46, DARK, { shadow: true });
    k.glow(0.5, 0.5, 0.48, g, 0.7);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI;
      const pts: P[] = Array.from({ length: 25 }, (_, j) => {
        const t = (j / 24) * TAU;
        const x = Math.cos(t) * 0.34;
        const y = Math.sin(t) * 0.12;
        return [0.5 + x * Math.cos(a) - y * Math.sin(a), 0.5 + x * Math.sin(a) + y * Math.cos(a)];
      });
      neon(k, pts, g, 0.02);
    }
    k.dot(0.5, 0.5, 0.08, '#ffffff');
  }, [g, 3, 0.8]);
}

// ======================= Lighting extras =======================
for (const [cid, cname, g] of NEONS) {
  add(`ring_lamp_${cid}`, `Lámpara Anillo ${cname}`, 'cy_lighting', 0.8, 0.8, 'lampara anillo neon', (k) => {
    k.glow(0.5, 0.5, 0.5, g, 0.6);
    k.ring(0.5, 0.5, 0.32, '#2a2d33', 0.08);
    k.ring(0.5, 0.5, 0.32, g, 0.04);
    k.ring(0.5, 0.5, 0.32, '#ffffff', 0.012);
  }, [g, 3, 0.8], 'above_walls');
}
for (const [id, name, c] of [['warm', 'Cálidas', '#ffd88a'], ['neon', 'Neón', '#ff3fb0']] as const) {
  add(`hanging_bulbs_${id}`, `Guirnalda de Bombillas ${name}`, 'cy_lighting', 4, 0.6, 'guirnalda bombillas luces', (k) => {
    k.stroke([[0, 0.2], [0.25, 0.7], [0.5, 0.3], [0.75, 0.7], [1, 0.2]], '#15161a', 0.02, false, true);
    for (let i = 0; i < 12; i++) {
      const x = 0.04 + i * 0.083;
      const y = 0.45 + Math.sin(x * TAU * 2 - 1.6) * 0.2;
      k.glow(x, y, 0.3, c, 0.6);
      k.dot(x, y, 0.08, c);
    }
  }, [c, 4, 0.6], 'above_walls');
}
for (const [cid, cname, g] of N4) {
  add(`lava_lamp_${cid}`, `Lámpara de Lava ${cname}`, 'cy_lighting', 0.4, 0.4, 'lampara lava retro', (k) => {
    k.glow(0.5, 0.5, 0.6, g, 0.6);
    k.disc(0.5, 0.5, 0.36, metal('#3a3d44'), { shadow: true });
    k.disc(0.5, 0.5, 0.26, liquid(tint(g, -60)));
    k.lump(0.45, 0.45, 0.12, plain(g), 7, 0.4);
  }, [g, 1.5, 0.6]);
}

// ======================= Nature extras =======================
for (const [i, name] of ['Cactus Redondo', 'Cactus Columnar', 'Cactus Florido'].entries()) {
  add(`cactus_pot_${i + 1}`, name, 'cy_nature', 0.5, 0.5, 'cactus maceta planta', (k) => {
    k.disc(0.5, 0.5, 0.44, plain('#b8643a'), { shadow: true });
    k.disc(0.5, 0.5, 0.36, plain('#5a3a22'));
    if (i === 0) k.disc(0.5, 0.5, 0.26, plain('#3a8a4a'));
    else for (const [x, y] of [[0.5, 0.5], [0.36, 0.4], [0.64, 0.58]] as P[]) k.disc(x, y, 0.13, plain('#3a7a3a'));
    for (let j = 0; j < 10; j++) k.dot(k.between(0.3, 0.7), k.between(0.3, 0.7), 0.012, '#e8e4c0');
    if (i === 2) k.dot(0.5, 0.42, 0.07, '#ff3fb0');
  });
}
for (const [id, name, hex] of [['pink', 'Rosas', '#ff6ab0'], ['red', 'Rojas', '#d02030'], ['yellow', 'Amarillas', '#ffd030'], ['purple', 'Moradas', '#9a4ad0']] as const) {
  add(`flower_bed_${id}`, `Parterre de Flores ${name}`, 'cy_nature', 2, 1, 'flores parterre jardin', (k) => {
    k.rect(0.02, 0.06, 0.96, 0.88, stone('#6a6e74'), 0.06, { shadow: true });
    k.rect(0.06, 0.14, 0.88, 0.72, plain('#3a2a1a'), 0.04);
    k.foliage(0.5, 0.5, 0.42, ['#2a5a2a', '#3a7a3a'], 30, 0.06);
    for (let j = 0; j < 22; j++) k.stud(k.between(0.1, 0.9), k.between(0.2, 0.8), 0.035, hex);
  });
}
add('moss_patch', 'Musgo', 'cy_nature', 1.2, 1, 'musgo verde suelo', (k) => {
  for (let i = 0; i < 8; i++) k.lump(k.between(0.25, 0.75), k.between(0.25, 0.75), k.between(0.12, 0.22), plain(k.pick(['#3a6a2a', '#4a7a3a', '#2a5a22'])), 9, 0.4, { edge: false });
}, undefined, 'below_floor');
add('koi_pond', 'Estanque Koi', 'cy_nature', 2, 1.6, 'estanque peces koi', (k) => {
  k.lump(0.5, 0.5, 0.48, stone('#6a6e74'), 14, 0.15, { shadow: true });
  k.lump(0.5, 0.5, 0.4, liquid('#2a5a70'), 14, 0.15);
  for (let i = 0; i < 4; i++) {
    const x = k.between(0.3, 0.7);
    const y = k.between(0.3, 0.7);
    k.oval(x, y, 0.06, 0.03, plain(k.pick(['#f08a1c', '#f2f0ea', '#d02020'])), { edge: false });
  }
  k.disc(0.7, 0.35, 0.08, plain('#3a7a3a'));
});
for (const [cid, cname, g] of [glowOf('purple'), glowOf('pink')]) {
  add(`hydroponic_rack_${cid}`, `Cultivo Hidropónico ${cname}`, 'cy_nature', 2, 0.6, 'hidroponico cultivo plantas', (k) => {
    k.rect(0.01, 0.08, 0.98, 0.84, CHROME, 0.04, { shadow: true });
    k.glow(0.5, 0.5, 0.6, g, 0.4);
    for (let i = 0; i < 10; i++) k.foliage(0.06 + i * 0.098, 0.5, 0.1, ['#3a8a3a', '#5aa04a'], 6, 0.06);
    neon(k, [[0.03, 0.12], [0.97, 0.12]], g, 0.03);
  }, [g, 2, 0.5]);
}

// ======================= Home extras =======================
add('kitchen_island', 'Isla de Cocina', 'cy_home', 2, 1, 'cocina isla encimera', (k) => {
  k.rect(0.02, 0.06, 0.96, 0.88, stone('#e8e4dc'), 0.04, { shadow: true });
  k.rect(0.1, 0.25, 0.25, 0.5, metal('#2a2d33'), 0.03);
  for (const [x, y] of [[0.17, 0.38], [0.28, 0.38], [0.17, 0.62], [0.28, 0.62]] as P[]) k.ring(x, y, 0.05, '#ff6a1a', 0.012);
  k.rect(0.55, 0.3, 0.3, 0.4, CHROME, 0.05);
});
add('washing_machine', 'Lavadora', 'cy_home', 0.6, 0.6, 'lavadora ropa', (k) => {
  k.rect(0.05, 0.05, 0.9, 0.9, plain('#e8eaee'), 0.06, { shadow: true });
  k.disc(0.5, 0.55, 0.28, CHROME);
  k.disc(0.5, 0.55, 0.2, liquid('#4a7a9a'));
  k.dot(0.8, 0.15, 0.04, '#3fff8a');
});
add('laundry_pile', 'Montón de Ropa', 'cy_home', 0.8, 0.8, 'ropa sucia monton', (k) => {
  for (let i = 0; i < 8; i++) k.lump(k.between(0.3, 0.7), k.between(0.3, 0.7), k.between(0.1, 0.18), cloth(k.pick(['#2a2d33', '#b82230', '#2350a8', '#e8e4dc', '#6a2ab0'])), 7, 0.35, { shadow: i === 0 });
});
add('cat_tree', 'Rascador para Gatos', 'cy_home', 1, 1, 'gato rascador arbol', (k) => {
  k.rect(0.05, 0.05, 0.9, 0.9, cloth('#a08a6a'), 0.08, { shadow: true });
  k.disc(0.3, 0.3, 0.2, cloth('#8a7050'), { shadow: true });
  k.disc(0.7, 0.65, 0.22, cloth('#8a7050'), { shadow: true });
  k.disc(0.7, 0.65, 0.12, cloth('#5a4a3a'));
  k.dot(0.3, 0.3, 0.05, '#ff3fb0');
});
for (const [cid, cname, g] of N3) {
  add(`cat_bed_${cid}`, `Cama de Gato ${cname}`, 'cy_home', 0.6, 0.6, 'gato cama cojin', (k) => {
    k.disc(0.5, 0.5, 0.44, cloth(tint(g, -100)), { shadow: true });
    k.disc(0.5, 0.5, 0.3, cloth(tint(g, -60)));
    k.ring(0.5, 0.5, 0.42, g, 0.03);
  }, [g, 0.8, 0.3]);
}
add('pet_bowls', 'Comederos de Mascota', 'cy_home', 0.6, 0.3, 'comedero gato perro', (k) => {
  for (const [x, c] of [[0.27, '#c8a060'], [0.73, '#6ab0e0']] as const) {
    k.disc(x, 0.5, 0.36, metal('#b82230'), { shadow: true });
    k.disc(x, 0.5, 0.24, plain(c));
  }
});
add('bookshelf_neon', 'Estantería Neón', 'cy_home', 2, 0.5, 'estanteria libros', (k) => {
  k.rect(0.01, 0.06, 0.98, 0.88, DARK, 0.03, { shadow: true });
  for (let i = 0; i < 24; i++) k.rect(0.03 + (i % 12) * 0.08, i < 12 ? 0.12 : 0.54, 0.06, 0.34, plain(k.pick(['#b82230', '#2350a8', '#e0b020', '#2a8a4a', '#e8e4dc', '#6a2ab0'])), 0.01);
  neon(k, [[0.02, 0.5], [0.98, 0.5]], '#2fe8ff', 0.02);
}, ['#2fe8ff', 1.5, 0.3]);
add('electric_guitar', 'Guitarra Eléctrica', 'cy_home', 0.5, 1.2, 'guitarra musica', (k) => {
  k.oval(0.5, 0.72, 0.4, 0.22, metal('#b82230'), { shadow: true });
  k.rect(0.44, 0.04, 0.12, 0.6, wood('#3a2a1a'), 0.02);
  for (const y of [0.66, 0.76]) k.rect(0.3, y, 0.4, 0.04, CHROME, 0.01);
  k.rect(0.4, 0.01, 0.2, 0.06, plain('#1a1b1f'), 0.02);
});
add('synth_keyboard', 'Sintetizador', 'cy_home', 1.4, 0.5, 'sintetizador teclado musica', (k) => {
  k.rect(0.02, 0.08, 0.96, 0.84, DARK, 0.04, { shadow: true });
  for (let i = 0; i < 20; i++) k.rect(0.05 + i * 0.045, 0.45, 0.04, 0.42, plain('#f2f2ee'), 0.005, { edge: false });
  for (let i = 0; i < 6; i++) k.dot(0.1 + i * 0.14, 0.25, 0.04, k.pick(['#ff3fb0', '#2fe8ff', '#ffe12f']));
});
add('punching_bag', 'Saco de Boxeo', 'cy_home', 0.6, 0.6, 'saco boxeo gimnasio', (k) => {
  k.disc(0.5, 0.5, 0.38, cloth('#b82230'), { shadow: true });
  k.ring(0.5, 0.5, 0.26, '#8a1a24', 0.03);
  k.dot(0.5, 0.5, 0.06, '#2a2d33');
});
