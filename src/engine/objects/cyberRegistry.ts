// Registry of CyberGato-only objects. Ids start with `cy_`; categories too.
import type { PropCategory, PropDefinition, PropLayer } from '../../types/map';
import type { Kit, Painter } from './kit';

export const CYBER_CATEGORIES: { id: PropCategory; label: string }[] = [
  { id: 'cy_vehicles', label: 'Vehículos' },
  { id: 'cy_street', label: 'Calle y Mobiliario Urbano' },
  { id: 'cy_signs', label: 'Neones y Publicidad' },
  { id: 'cy_home', label: 'Hogar y Apartamentos' },
  { id: 'cy_tech', label: 'Tecnología y Robots' },
  { id: 'cy_nightlife', label: 'Ocio Nocturno' },
  { id: 'cy_industrial', label: 'Industria y Puerto' },
  { id: 'cy_security', label: 'Seguridad y Defensa' },
  { id: 'cy_nature', label: 'Naturaleza Urbana' },
  { id: 'cy_lighting', label: 'Iluminación Neón' },
  { id: 'cy_food', label: 'Comida y Mercado' },
  { id: 'cy_medical', label: 'Clínica y Laboratorio' },
  { id: 'cy_transit', label: 'Transporte y Metro' },
  { id: 'cy_office', label: 'Oficinas Corporativas' },
];

export const CYBER_PROPS: PropDefinition[] = [];
export const CYBER_OBJECTS: Record<string, Painter> = {};
export const CYBER_LIGHTS: Record<string, { color: string; radius: number; intensity: number }> = {};

export function add(
  id: string,
  name: string,
  category: string,
  widthTiles: number,
  heightTiles: number,
  tags: string,
  paint: Painter,
  light?: [color: string, radius: number, intensity?: number],
  layer: PropLayer = 'above_floor'
) {
  const full = `cy_${id}`;
  if (CYBER_OBJECTS[full]) throw new Error(`Duplicate cyber object ${full}`);
  CYBER_PROPS.push({
    id: full,
    name,
    category: category as PropCategory,
    widthTiles,
    heightTiles,
    defaultLayer: layer,
    defaultShadow: layer !== 'below_floor',
    tags: ['cyber', 'ciudad', ...tags.split(' ')],
  });
  CYBER_OBJECTS[full] = paint;
  if (light) CYBER_LIGHTS[full] = { color: light[0], radius: light[1], intensity: light[2] ?? 0.9 };
}

// Colour variants shared by many families: [id suffix, name suffix, colour].
export const PAINTS: [string, string, string][] = [
  ['red', 'Rojo', '#b82230'],
  ['blue', 'Azul', '#2350a8'],
  ['black', 'Negro', '#25272d'],
  ['white', 'Blanco', '#e4e6ea'],
  ['purple', 'Morado', '#6a2ab0'],
  ['green', 'Verde', '#2a8a4a'],
  ['yellow', 'Amarillo', '#e0b020'],
  ['orange', 'Naranja', '#e0661c'],
  ['pink', 'Rosa', '#e03a90'],
  ['cyan', 'Cian', '#1fb0c8'],
  ['silver', 'Plata', '#9aa2ac'],
];

export const NEONS: [string, string, string][] = [
  ['purple', 'Morado', '#b14bff'],
  ['cyan', 'Cian', '#2fe8ff'],
  ['pink', 'Rosa', '#ff3fb0'],
  ['green', 'Verde', '#3fff8a'],
  ['yellow', 'Amarillo', '#ffe12f'],
  ['red', 'Rojo', '#ff3b4a'],
  ['orange', 'Naranja', '#ff8a2f'],
  ['blue', 'Azul', '#3f7bff'],
];


// Glowing line (positions are sprite fractions, width a fraction of the shorter side).
export function neon(k: Kit, points: [number, number][], color: string, width = 0.03) {
  const { ctx, W, H, m } = k;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const path = () => {
    ctx.beginPath();
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x * W, y * H) : ctx.moveTo(x * W, y * H)));
  };
  ctx.shadowColor = color;
  ctx.shadowBlur = m * width * 3.5;
  ctx.strokeStyle = color;
  ctx.lineWidth = m * width;
  path();
  ctx.stroke();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = Math.max(0.8, m * width * 0.35);
  path();
  ctx.stroke();
  ctx.restore();
}

// Neon outline of a closed shape.
export const neonLoop = (k: Kit, points: [number, number][], color: string, width?: number) =>
  neon(k, [...points, points[0]], color, width);

// Lighter / darker version of a #rrggbb colour.
export function tint(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + amount)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}
