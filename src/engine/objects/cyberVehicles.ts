// CyberGato vehicles, seen from above with the front at the top of the sprite.
import { type Kit, liquid, metal, plain } from './kit';
import { add, NEONS, neon, PAINTS, tint } from './cyberRegistry';

export interface Car {
  body: string;
  hood: number; // where the windscreen starts
  cabin: number; // length of the cabin
  roof?: string;
  round?: number;
  underglow?: string;
  stripes?: string;
  bed?: string; // pickup bed colour
  hover?: string; // hover pads colour instead of wheels
  wheels?: number[];
  extra?: (k: Kit) => void;
}

const GLASS = liquid('#1a2638');

export function vehicle(k: Kit, c: Car) {
  const top = c.hood;
  const bottom = c.hood + c.cabin;
  if (c.underglow) k.glow(0.5, 0.5, 0.75, c.underglow, 0.7);
  if (c.hover) {
    for (const y of [0.16, 0.84]) for (const x of [0.12, 0.88]) {
      k.glow(x, y, 0.2, c.hover, 0.85);
      k.disc(x, y, 0.1, metal('#2a2e36'), { shadow: true });
      k.dot(x, y, 0.05, c.hover);
    }
  } else {
    for (const y of c.wheels ?? [0.2, 0.8]) for (const x of [0.06, 0.94]) {
      k.rect(x - 0.07, y - 0.075, 0.14, 0.15, plain('#111214'), 0.05);
    }
  }
  k.rect(0.08, 0.015, 0.84, 0.97, metal(c.body), c.round ?? 0.18, { shadow: true });
  if (c.stripes) for (const x of [0.4, 0.54]) k.rect(x, 0.02, 0.06, 0.96, plain(c.stripes), 0.01, { edge: false });
  for (const x of [0.02, 0.91]) k.rect(x, top + 0.01, 0.07, 0.035, metal(c.body), 0.02);
  k.poly([[0.17, top], [0.83, top], [0.79, top + 0.09], [0.21, top + 0.09]], GLASS);
  if (c.bed) {
    k.rect(0.2, top + 0.09, 0.6, bottom - top - 0.09, metal(c.roof ?? c.body), 0.04);
    k.poly([[0.2, bottom - 0.02], [0.8, bottom - 0.02], [0.8, bottom + 0.02], [0.2, bottom + 0.02]], GLASS);
    k.rect(0.14, bottom + 0.05, 0.72, 0.9 - bottom, metal(c.bed), 0.03);
    k.rect(0.19, bottom + 0.08, 0.62, 0.84 - bottom, plain('#1a1b1f'), 0.02);
  } else {
    // Short cabs (trucks) have no room for a separate roof panel.
    if (bottom - top > 0.2) k.rect(0.2, top + 0.09, 0.6, bottom - top - 0.16, metal(c.roof ?? tint(c.body, -18)), 0.07);
    k.poly([[0.22, bottom - 0.07], [0.78, bottom - 0.07], [0.82, bottom], [0.18, bottom]], GLASS);
  }
  for (const x of [0.13, 0.71]) {
    k.glow(x + 0.08, 0.03, 0.14, '#fff2c0', 0.45);
    k.rect(x, 0.022, 0.16, 0.032, plain('#fff6d0'), 0.02, { edge: false });
    k.glow(x + 0.08, 0.965, 0.1, '#ff2a3a', 0.55);
    k.rect(x, 0.95, 0.16, 0.028, plain('#ff3040'), 0.02, { edge: false });
  }
  c.extra?.(k);
}

export const lightbar = (y: number, a = '#ff2a3a', b = '#2a6aff') => (k: Kit) => {
  k.rect(0.26, y, 0.48, 0.05, plain('#202228'), 0.02);
  k.glow(0.36, y + 0.025, 0.18, a, 0.8);
  k.glow(0.64, y + 0.025, 0.18, b, 0.8);
  k.rect(0.28, y + 0.008, 0.2, 0.034, plain(a), 0.01, { edge: false });
  k.rect(0.52, y + 0.008, 0.2, 0.034, plain(b), 0.01, { edge: false });
};

// Car families: [id, name, width, height, spec without colour]
const CARS: [string, string, number, number, Omit<Car, 'body'>, string[]][] = [
  ['sedan', 'Sedán', 1, 2, { hood: 0.22, cabin: 0.48 }, ['red', 'blue', 'black', 'white', 'silver', 'green']],
  ['coupe', 'Coupé', 1, 1.9, { hood: 0.28, cabin: 0.38, round: 0.26 }, ['red', 'purple', 'black', 'white', 'cyan']],
  ['sports', 'Deportivo', 1, 2, { hood: 0.32, cabin: 0.3, round: 0.34, extra: (k) => k.rect(0.12, 0.88, 0.76, 0.05, plain('#15161a'), 0.02) }, ['red', 'yellow', 'orange', 'black', 'pink', 'cyan']],
  ['compact', 'Utilitario', 0.9, 1.5, { hood: 0.16, cabin: 0.6, round: 0.24, wheels: [0.2, 0.8] }, ['red', 'blue', 'yellow', 'white', 'green']],
  ['suv', 'Todoterreno', 1.1, 2.1, { hood: 0.18, cabin: 0.64, round: 0.12, extra: (k) => { for (const x of [0.24, 0.72]) k.rect(x, 0.32, 0.04, 0.42, plain('#15161a'), 0.01); } }, ['black', 'white', 'silver', 'green']],
  ['muscle', 'Muscle Car', 1, 2.1, { hood: 0.34, cabin: 0.32, round: 0.14, stripes: '#f2f2ee' }, ['red', 'blue', 'black', 'orange']],
  ['van', 'Furgoneta', 1.1, 2.2, { hood: 0.1, cabin: 0.84, round: 0.1 }, ['white', 'silver', 'blue', 'black']],
  ['pickup', 'Pickup', 1.1, 2.2, { hood: 0.2, cabin: 0.26, round: 0.1, bed: '#3a3d44' }, ['red', 'blue', 'black', 'silver']],
  ['hovercar', 'Aerodeslizador', 1.1, 2, { hood: 0.24, cabin: 0.46, round: 0.42 }, ['purple', 'cyan', 'black', 'white', 'pink', 'silver']],
  ['limo', 'Limusina', 1.1, 3.2, { hood: 0.14, cabin: 0.72, round: 0.12, wheels: [0.14, 0.86] }, ['black', 'white']],
];

const colour = (id: string) => PAINTS.find((p) => p[0] === id)!;
const glowFor = (id: string) => (NEONS.find((n) => n[0] === id) ?? NEONS[0])[2];

for (const [id, name, w, h, spec, colours] of CARS) {
  for (const cid of colours) {
    const [, cname, hex] = colour(cid);
    const hover = id === 'hovercar';
    add(`car_${id}_${cid}`, `${name} ${cname}`, 'cy_vehicles', w, h, `coche vehiculo ${id} ${cname.toLowerCase()}`, (k) =>
      vehicle(k, { ...spec, body: hex, ...(hover ? { hover: glowFor(cid), underglow: glowFor(cid) } : {}) })
    );
  }
}

// Street racers with underglow
for (const [cid, cname, glow] of NEONS.slice(0, 5)) {
  add(`car_tuned_${cid}`, `Tuneado Neón ${cname}`, 'cy_vehicles', 1, 2, 'coche tuning neon', (k) =>
    vehicle(k, { body: '#1c1d22', hood: 0.3, cabin: 0.32, round: 0.3, underglow: glow, extra: (kk) => neon(kk, [[0.12, 0.1], [0.12, 0.9]], glow, 0.025) })
  );
}

add('taxi', 'Taxi', 'cy_vehicles', 1, 2, 'coche taxi amarillo', (k) =>
  vehicle(k, { body: '#e8b81c', hood: 0.22, cabin: 0.48, extra: (kk) => { kk.rect(0.36, 0.42, 0.28, 0.07, plain('#fff7c0'), 0.02); kk.glow(0.5, 0.455, 0.16, '#fff1a0', 0.6); } })
);
add('hover_taxi', 'Aerotaxi', 'cy_vehicles', 1.1, 2, 'taxi aereo volador', (k) =>
  vehicle(k, { body: '#e8b81c', hood: 0.24, cabin: 0.46, round: 0.42, hover: '#ffe12f', underglow: '#ffe12f', stripes: '#151515' })
);
add('police', 'Coche Patrulla', 'cy_vehicles', 1, 2, 'policia patrulla', (k) =>
  vehicle(k, { body: '#eef0f4', roof: '#1a1c22', hood: 0.22, cabin: 0.48, extra: lightbar(0.43) }), ['#3a6aff', 3, 0.6]
);
add('police_hover', 'Patrulla Aérea', 'cy_vehicles', 1.1, 2.1, 'policia volador', (k) =>
  vehicle(k, { body: '#1a1c22', roof: '#2a2e36', hood: 0.24, cabin: 0.46, round: 0.4, hover: '#3f7bff', underglow: '#3f7bff', extra: lightbar(0.44) }), ['#3a6aff', 3, 0.7]
);
add('ambulance', 'Ambulancia', 'cy_vehicles', 1.2, 2.5, 'ambulancia emergencia', (k) =>
  vehicle(k, { body: '#f2f2f0', hood: 0.1, cabin: 0.84, round: 0.08, extra: (kk) => {
    kk.rect(0.42, 0.42, 0.16, 0.36, plain('#d02030'), 0.01, { edge: false });
    kk.rect(0.3, 0.54, 0.4, 0.12, plain('#d02030'), 0.01, { edge: false });
    lightbar(0.13)(kk);
  } }), ['#ff2a3a', 3, 0.6]
);
add('firetruck', 'Camión de Bomberos', 'cy_vehicles', 1.3, 3.4, 'bomberos camion', (k) =>
  vehicle(k, { body: '#c41e24', hood: 0.08, cabin: 0.2, round: 0.06, wheels: [0.16, 0.7, 0.86], extra: (kk) => {
    kk.rect(0.32, 0.32, 0.36, 0.6, metal('#b8bec6'), 0.02);
    for (let y = 0.34; y < 0.9; y += 0.05) kk.stroke([[0.32, y], [0.68, y]], '#6a7078', 0.012, false);
    lightbar(0.1)(kk);
  } })
);
add('bus', 'Autobús', 'cy_vehicles', 1.3, 3.8, 'autobus transporte', (k) =>
  vehicle(k, { body: '#2a6ab0', roof: '#d8dce2', hood: 0.04, cabin: 0.92, round: 0.05, wheels: [0.14, 0.84], extra: (kk) => {
    for (const y of [0.3, 0.55]) kk.rect(0.32, y, 0.36, 0.1, metal('#8a9098'), 0.02);
    kk.rect(0.3, 0.06, 0.4, 0.03, plain('#ffe12f'), 0.01, { edge: false });
  } })
);
add('tram', 'Tranvía', 'cy_vehicles', 1.3, 4.6, 'tranvia transporte', (k) =>
  vehicle(k, { body: '#d8dce2', roof: '#5a2a8a', hood: 0.03, cabin: 0.94, round: 0.08, wheels: [], extra: (kk) => {
    kk.stroke([[0.35, 0.5], [0.65, 0.42], [0.35, 0.36]], '#3a3e46', 0.05);
    neon(kk, [[0.2, 0.08], [0.2, 0.92]], '#b14bff', 0.03);
    neon(kk, [[0.8, 0.08], [0.8, 0.92]], '#b14bff', 0.03);
  } })
);
add('box_truck', 'Camión de Reparto', 'cy_vehicles', 1.3, 3, 'camion carga reparto', (k) =>
  vehicle(k, { body: '#e8eaee', hood: 0.06, cabin: 0.16, round: 0.06, wheels: [0.14, 0.72, 0.86], extra: (kk) => {
    kk.rect(0.06, 0.28, 0.88, 0.7, metal('#d8dce2'), 0.02, { shadow: true });
    neon(kk, [[0.25, 0.5], [0.5, 0.42], [0.75, 0.5]], '#2fe8ff', 0.04);
  } })
);
add('semi', 'Tráiler', 'cy_vehicles', 1.4, 4.8, 'camion trailer', (k) =>
  vehicle(k, { body: '#b82230', hood: 0.04, cabin: 0.12, round: 0.05, wheels: [0.1, 0.7, 0.78, 0.9], extra: (kk) => {
    kk.rect(0.05, 0.2, 0.9, 0.79, metal('#8a9098'), 0.01, { shadow: true });
    for (let y = 0.24; y < 0.98; y += 0.06) kk.stroke([[0.07, y], [0.93, y]], 'rgba(40,44,50,0.5)', 0.01, false);
  } })
);
add('garbage_truck', 'Camión de Basura', 'cy_vehicles', 1.3, 3, 'basura limpieza camion', (k) =>
  vehicle(k, { body: '#2a7a3a', hood: 0.06, cabin: 0.16, round: 0.06, wheels: [0.14, 0.72, 0.86], extra: (kk) => {
    kk.rect(0.08, 0.28, 0.84, 0.68, metal('#3a8a4a'), 0.06, { shadow: true });
    for (let y = 0.34; y < 0.9; y += 0.12) kk.rect(0.12, y, 0.76, 0.04, plain('#e8c21c'), 0.01, { edge: false });
  } })
);
add('armored_van', 'Furgón Blindado', 'cy_vehicles', 1.2, 2.4, 'blindado seguridad', (k) =>
  vehicle(k, { body: '#3a3f46', hood: 0.1, cabin: 0.82, round: 0.06, extra: (kk) => {
    for (const y of [0.3, 0.5, 0.7]) kk.rect(0.12, y, 0.76, 0.03, plain('#24272c'), 0.01);
    for (const y of [0.3, 0.5, 0.7]) for (const x of [0.16, 0.84]) kk.stud(x, y + 0.015, 0.03, '#9aa2ac');
  } })
);
add('delivery_van', 'Furgoneta Mensajería', 'cy_vehicles', 1.1, 2.2, 'reparto mensajeria', (k) =>
  vehicle(k, { body: '#f0f0ec', hood: 0.1, cabin: 0.84, round: 0.1, extra: (kk) => neon(kk, [[0.3, 0.6], [0.5, 0.45], [0.7, 0.6]], '#ff3fb0', 0.05) })
);
add('tank', 'Tanque', 'cy_vehicles', 2, 3, 'militar tanque', (k) => {
  for (const x of [0.04, 0.78]) {
    k.rect(x, 0.04, 0.18, 0.92, plain('#1c1e20'), 0.06, { shadow: true });
    for (let y = 0.06; y < 0.96; y += 0.04) k.stroke([[x + 0.01, y], [x + 0.17, y]], '#3a3e44', 0.012, false);
  }
  k.rect(0.2, 0.08, 0.6, 0.84, metal('#4a5a3a'), 0.06, { shadow: true });
  k.disc(0.5, 0.55, 0.36, metal('#5a6a46'), { shadow: true });
  k.rect(0.46, 0.02, 0.08, 0.5, metal('#3a4a2e'), 0.02, { shadow: true });
  k.stud(0.62, 0.62, 0.05, '#2a3020');
});
add('forklift', 'Carretilla Elevadora', 'cy_vehicles', 0.9, 1.5, 'carretilla almacen industria', (k) => {
  for (const x of [0.3, 0.6]) k.rect(x, 0.01, 0.07, 0.3, metal('#8a9098'), 0.01);
  vehicle(k, { body: '#e8b81c', hood: 0.3, cabin: 0.45, round: 0.1, wheels: [0.36, 0.84], extra: (kk) => kk.rect(0.22, 0.24, 0.56, 0.06, metal('#3a3e46'), 0.02) });
});
add('mech', 'Mecha de Combate', 'cy_vehicles', 2, 2, 'robot mecha militar', (k) => {
  for (const [x, y] of [[0.22, 0.24], [0.78, 0.24], [0.22, 0.76], [0.78, 0.76]]) {
    k.stroke([[0.5, 0.5], [x, y]], '#3a3e46', 0.09);
    k.disc(x, y, 0.13, metal('#5a606a'), { shadow: true });
  }
  k.disc(0.5, 0.5, 0.26, metal('#7a8290'), { shadow: true });
  k.rect(0.38, 0.32, 0.24, 0.12, liquid('#2fe8ff'), 0.04);
  k.glow(0.5, 0.38, 0.2, '#2fe8ff', 0.5);
  for (const x of [0.2, 0.8]) k.rect(x - 0.04, 0.4, 0.08, 0.26, metal('#3a3e46'), 0.03);
});

// Wrecks
add('wreck_burnt', 'Coche Calcinado', 'cy_vehicles', 1, 2, 'chatarra quemado restos', (k) => {
  vehicle(k, { body: '#2a2624', hood: 0.22, cabin: 0.48, roof: '#181614', wheels: [] });
  for (let i = 0; i < 8; i++) k.dot(k.between(0.15, 0.85), k.between(0.1, 0.9), 0.04, 'rgba(255,120,30,0.6)');
});
add('wreck_rust', 'Chatarra Oxidada', 'cy_vehicles', 1, 2, 'chatarra oxido restos', (k) =>
  vehicle(k, { body: '#8a4a26', hood: 0.22, cabin: 0.48, roof: '#5a3a22', wheels: [0.8] })
);
add('wreck_flipped', 'Coche Volcado', 'cy_vehicles', 1, 2, 'accidente restos', (k) => {
  k.rect(0.08, 0.015, 0.84, 0.97, metal('#2a2c30'), 0.12, { shadow: true });
  for (const y of [0.2, 0.8]) for (const x of [0.16, 0.84]) k.disc(x, y, 0.13, plain('#101012'));
  k.rect(0.44, 0.1, 0.12, 0.8, metal('#4a4e56'), 0.02);
  k.rect(0.3, 0.42, 0.4, 0.16, metal('#3a3e46'), 0.04);
});

// Two wheelers and small craft
function bike(k: Kit, body: string, hover?: string) {
  if (hover) {
    for (const y of [0.15, 0.85]) {
      k.glow(0.5, y, 0.4, hover, 0.8);
      k.oval(0.5, y, 0.34, 0.12, metal('#2a2e36'), { shadow: true });
      k.oval(0.5, y, 0.22, 0.06, plain(hover), { edge: false });
    }
  } else for (const y of [0.12, 0.88]) k.oval(0.5, y, 0.2, 0.12, plain('#111214'), { shadow: true });
  k.oval(0.5, 0.5, 0.3, 0.36, metal(body), { shadow: true });
  k.oval(0.5, 0.62, 0.18, 0.16, plain('#1a1a1c'));
  k.stroke([[0.08, 0.26], [0.92, 0.26]], '#2a2c30', 0.05);
  k.glow(0.5, 0.03, 0.3, '#fff2c0', 0.4);
}
for (const [cid, cname, hex] of PAINTS.filter((p) => ['red', 'black', 'blue', 'yellow', 'green'].includes(p[0]))) {
  add(`moto_${cid}`, `Moto ${cname}`, 'cy_vehicles', 0.5, 1.2, 'moto motocicleta', (k) => bike(k, hex));
}
for (const [cid, cname, glow] of NEONS.slice(0, 5)) {
  add(`hoverbike_${cid}`, `Aerobici ${cname}`, 'cy_vehicles', 0.6, 1.3, 'moto voladora hover', (k) => bike(k, '#1c1d22', glow));
}
for (const [cid, cname, hex] of PAINTS.filter((p) => ['white', 'pink', 'cyan'].includes(p[0]))) {
  add(`scooter_${cid}`, `Patinete ${cname}`, 'cy_vehicles', 0.35, 0.9, 'patinete electrico', (k) => {
    for (const y of [0.1, 0.9]) k.oval(0.5, y, 0.25, 0.08, plain('#111214'));
    k.rect(0.36, 0.12, 0.28, 0.78, metal(hex), 0.2, { shadow: true });
    k.stroke([[0.05, 0.12], [0.95, 0.12]], '#2a2c30', 0.08);
    neon(k, [[0.5, 0.3], [0.5, 0.8]], '#2fe8ff', 0.05);
  });
}
for (const [cid, cname, hex] of PAINTS.filter((p) => ['red', 'green', 'silver'].includes(p[0]))) {
  add(`bicycle_${cid}`, `Bicicleta ${cname}`, 'cy_vehicles', 0.35, 1, 'bici bicicleta', (k) => {
    for (const y of [0.15, 0.85]) k.oval(0.5, y, 0.14, 0.14, plain('#16171a'));
    k.stroke([[0.5, 0.15], [0.5, 0.85]], hex, 0.12);
    k.stroke([[0.1, 0.22], [0.9, 0.22]], '#2a2c30', 0.08);
    k.oval(0.5, 0.62, 0.16, 0.08, plain('#1a1a1c'));
  });
}
function drone(k: Kit, body: string, light: string, cargo = false) {
  for (const [x, y] of [[0.2, 0.2], [0.8, 0.2], [0.2, 0.8], [0.8, 0.8]]) {
    k.stroke([[0.5, 0.5], [x, y]], '#2a2d33', 0.06);
    k.disc(x, y, 0.17, plain('rgba(180,190,200,0.25)'), { edge: false });
    k.ring(x, y, 0.17, 'rgba(220,230,240,0.6)', 0.012);
    k.disc(x, y, 0.04, metal('#3a3e46'));
  }
  k.disc(0.5, 0.5, 0.2, metal(body), { shadow: true });
  if (cargo) k.rect(0.38, 0.38, 0.24, 0.24, metal('#a07040'), 0.02, { shadow: true });
  k.glow(0.5, 0.5, 0.14, light, 0.8);
  k.dot(0.5, 0.42, 0.03, light);
}
add('drone_scout', 'Dron Explorador', 'cy_vehicles', 0.8, 0.8, 'dron volador', (k) => drone(k, '#2a2e36', '#ff3b4a'));
add('drone_police', 'Dron Policial', 'cy_vehicles', 0.8, 0.8, 'dron policia', (k) => drone(k, '#eef0f4', '#3f7bff'), ['#3f7bff', 2, 0.5]);
add('drone_cargo', 'Dron de Carga', 'cy_vehicles', 1, 1, 'dron reparto paquete', (k) => drone(k, '#e8b81c', '#3fff8a', true));
add('drone_camera', 'Dron Cámara', 'cy_vehicles', 0.6, 0.6, 'dron prensa', (k) => drone(k, '#6a2ab0', '#ff3fb0'));
for (const [cid, cname, hex, glow] of [['black', 'Negro', '#1c1d22', '#2fe8ff'], ['white', 'Blanco', '#e8eaee', '#b14bff'], ['red', 'Rojo', '#b82230', '#ff8a2f']] as const) {
  add(`aerodyne_${cid}`, `Aerodino ${cname}`, 'cy_vehicles', 1.8, 2.6, 'aerodino volador vtol', (k) => {
    for (const [x, y] of [[0.14, 0.2], [0.86, 0.2], [0.14, 0.8], [0.86, 0.8]]) {
      k.glow(x, y, 0.18, glow, 0.7);
      k.disc(x, y, 0.13, metal('#2a2e36'), { shadow: true });
      k.ring(x, y, 0.09, glow, 0.02);
    }
    k.oval(0.5, 0.5, 0.3, 0.46, metal(hex), { shadow: true });
    k.oval(0.5, 0.3, 0.16, 0.12, GLASS);
    k.rect(0.2, 0.46, 0.6, 0.08, metal(tint(hex, -20)), 0.03);
  });
}
