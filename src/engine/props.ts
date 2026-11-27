import type { CustomAsset, PropCategory, PropDefinition } from '../types/map';

export const PROP_CATEGORIES: { id: PropCategory; label: string }[] = [
  { id: 'furniture', label: 'Mobiliario' },
  { id: 'rugs', label: 'Alfombras' },
  { id: 'temple', label: 'Templo' },
  { id: 'storage', label: 'Almacén' },
  { id: 'nature', label: 'Naturaleza' },
  { id: 'lighting', label: 'Antorchas' },
  { id: 'custom', label: 'Propios' },
];

export const BUILTIN_PROPS: PropDefinition[] = [
  // Furniture
  { id: 'bed_teal', name: 'Cama Turquesa', category: 'furniture', widthTiles: 1.2, heightTiles: 2.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cama', 'bed', 'dormitorio'] },
  { id: 'bed_crimson', name: 'Cama Carmesí', category: 'furniture', widthTiles: 1.2, heightTiles: 2.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cama', 'bed', 'posada'] },
  { id: 'bed_double', name: 'Cama Doble', category: 'furniture', widthTiles: 2.0, heightTiles: 2.2, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cama', 'matrimonio'] },
  { id: 'table_round', name: 'Mesa Redonda', category: 'furniture', widthTiles: 1.8, heightTiles: 1.8, defaultLayer: 'above_floor', defaultShadow: true, tags: ['mesa', 'table', 'taberna'] },
  { id: 'table_round_teal', name: 'Mesa Mantel Azul', category: 'furniture', widthTiles: 2.0, heightTiles: 2.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['mesa', 'comedor', 'mantel'] },
  { id: 'table_banquet', name: 'Mesa Banquete', category: 'furniture', widthTiles: 3.0, heightTiles: 1.3, defaultLayer: 'above_floor', defaultShadow: true, tags: ['mesa', 'banquete'] },
  { id: 'pew', name: 'Banco Iglesia', category: 'furniture', widthTiles: 2.6, heightTiles: 0.75, defaultLayer: 'above_floor', defaultShadow: true, tags: ['banco', 'pew', 'templo'] },
  { id: 'chair', name: 'Silla Madera', category: 'furniture', widthTiles: 0.7, heightTiles: 0.7, defaultLayer: 'above_floor', defaultShadow: true, tags: ['silla', 'chair'] },
  { id: 'desk', name: 'Escritorio', category: 'furniture', widthTiles: 1.8, heightTiles: 1.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['escritorio', 'estudio'] },
  { id: 'bookshelf', name: 'Estantería', category: 'furniture', widthTiles: 2.0, heightTiles: 0.65, defaultLayer: 'above_floor', defaultShadow: true, tags: ['libros', 'biblioteca'] },
  { id: 'sofa_teal', name: 'Diván Turquesa', category: 'furniture', widthTiles: 1.7, heightTiles: 0.85, defaultLayer: 'above_floor', defaultShadow: true, tags: ['sofa', 'sillon'] },
  { id: 'fireplace', name: 'Chimenea', category: 'furniture', widthTiles: 1.8, heightTiles: 0.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['fuego', 'hogar'] },

  // Rugs
  { id: 'rug_teal', name: 'Alfombra Turquesa', category: 'rugs', widthTiles: 3.2, heightTiles: 2.1, defaultLayer: 'above_floor', defaultShadow: false, tags: ['alfombra', 'rug', 'templo'] },
  { id: 'rug_crimson', name: 'Alfombra Carmesí', category: 'rugs', widthTiles: 3.0, heightTiles: 2.0, defaultLayer: 'above_floor', defaultShadow: false, tags: ['alfombra', 'rug', 'persa'] },
  { id: 'rug_round', name: 'Alfombra Ovalada', category: 'rugs', widthTiles: 2.4, heightTiles: 1.8, defaultLayer: 'above_floor', defaultShadow: false, tags: ['alfombra', 'oval'] },
  { id: 'rug_runner', name: 'Pasillo Templo', category: 'rugs', widthTiles: 1.4, heightTiles: 3.6, defaultLayer: 'above_floor', defaultShadow: false, tags: ['pasillo', 'runner'] },

  // Temple & Special
  { id: 'altar_gold', name: 'Altar Dorado', category: 'temple', widthTiles: 2.4, heightTiles: 2.4, defaultLayer: 'above_floor', defaultShadow: true, tags: ['altar', 'estatua', 'templo'] },
  { id: 'well', name: 'Pozo de Piedra', category: 'temple', widthTiles: 1.6, heightTiles: 1.6, defaultLayer: 'above_floor', defaultShadow: true, tags: ['pozo', 'patio', 'agua'] },
  { id: 'pool_teal', name: 'Pila Sagrada', category: 'temple', widthTiles: 2.4, heightTiles: 3.0, defaultLayer: 'above_floor', defaultShadow: false, tags: ['agua', 'piscina', 'templo'] },
  { id: 'fountain', name: 'Fuente Piedra', category: 'temple', widthTiles: 2.2, heightTiles: 2.2, defaultLayer: 'above_floor', defaultShadow: true, tags: ['fuente', 'plaza'] },

  // Storage & Dungeon
  { id: 'barrel', name: 'Barril Roble', category: 'storage', widthTiles: 0.85, heightTiles: 0.85, defaultLayer: 'above_floor', defaultShadow: true, tags: ['barril', 'taberna'] },
  { id: 'crate', name: 'Caja Madera', category: 'storage', widthTiles: 1.0, heightTiles: 1.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['caja', 'almacen'] },
  { id: 'sack', name: 'Saco Grano', category: 'storage', widthTiles: 0.85, heightTiles: 0.7, defaultLayer: 'above_floor', defaultShadow: true, tags: ['saco', 'comida'] },
  { id: 'cart', name: 'Carro Suministros', category: 'storage', widthTiles: 1.5, heightTiles: 2.4, defaultLayer: 'above_floor', defaultShadow: true, tags: ['carro', 'carreta'] },
  { id: 'chest', name: 'Cofre Tesoro', category: 'storage', widthTiles: 1.1, heightTiles: 0.75, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cofre', 'tesoro'] },
  { id: 'anvil', name: 'Yunque Herrero', category: 'storage', widthTiles: 1.1, heightTiles: 0.75, defaultLayer: 'above_floor', defaultShadow: true, tags: ['herrero', 'forja'] },

  // Nature
  { id: 'tree_oak', name: 'Árbol Frondoso', category: 'nature', widthTiles: 2.6, heightTiles: 2.6, defaultLayer: 'above_walls', defaultShadow: true, tags: ['arbol', 'bosque', 'tree'] },
  { id: 'tree_pine', name: 'Pino Conífera', category: 'nature', widthTiles: 2.3, heightTiles: 2.3, defaultLayer: 'above_walls', defaultShadow: true, tags: ['pino', 'bosque'] },
  { id: 'bush', name: 'Arbusto', category: 'nature', widthTiles: 1.25, heightTiles: 1.25, defaultLayer: 'above_floor', defaultShadow: true, tags: ['arbusto', 'planta'] },
  { id: 'rock', name: 'Roca Musgosa', category: 'nature', widthTiles: 1.1, heightTiles: 0.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['roca', 'piedra'] },
  { id: 'stump', name: 'Tocón Cortado', category: 'nature', widthTiles: 0.95, heightTiles: 0.95, defaultLayer: 'above_floor', defaultShadow: true, tags: ['tocon', 'madera'] },

  // Lighting Fixtures
  { id: 'brazier', name: 'Brasero Fuego', category: 'lighting', widthTiles: 0.95, heightTiles: 0.95, defaultLayer: 'above_floor', defaultShadow: true, tags: ['brasero', 'fuego', 'luz'] },
  { id: 'torch_wall', name: 'Antorcha', category: 'lighting', widthTiles: 0.65, heightTiles: 0.65, defaultLayer: 'above_walls', defaultShadow: false, tags: ['antorcha', 'luz'] },
  { id: 'candle_cluster', name: 'Velas', category: 'lighting', widthTiles: 0.65, heightTiles: 0.65, defaultLayer: 'above_floor', defaultShadow: false, tags: ['velas', 'altar'] },
  { id: 'lantern', name: 'Farol Calle', category: 'lighting', widthTiles: 0.7, heightTiles: 0.7, defaultLayer: 'above_walls', defaultShadow: true, tags: ['farol', 'calle'] },
];

const spriteCache = new Map<string, HTMLCanvasElement>();
const thumbCache = new Map<string, string>();
const customImageCache = new Map<string, HTMLImageElement>();

const PX_PER_TILE = 96;

export function getPropDefinition(propId: string, customAssets: CustomAsset[] = []): PropDefinition | undefined {
  if (propId.startsWith('custom:')) {
    const cid = propId.slice('custom:'.length);
    const asset = customAssets.find((a) => a.id === cid);
    if (!asset) return undefined;
    return {
      id: propId,
      name: asset.name,
      category: 'custom',
      widthTiles: asset.widthTiles,
      heightTiles: asset.heightTiles,
      defaultLayer: 'above_floor',
      defaultShadow: true,
      tags: ['custom'],
    };
  }
  return BUILTIN_PROPS.find((p) => p.id === propId);
}

export function getCustomImage(asset: CustomAsset, onLoad?: () => void): HTMLImageElement {
  let img = customImageCache.get(asset.id);
  if (!img) {
    img = new Image();
    img.src = asset.dataUrl;
    if (onLoad) img.onload = onLoad;
    customImageCache.set(asset.id, img);
  }
  return img;
}

function renderPropSprite(def: PropDefinition): HTMLCanvasElement {
  const w = Math.max(48, Math.round(def.widthTiles * PX_PER_TILE));
  const h = Math.max(48, Math.round(def.heightTiles * PX_PER_TILE));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const cx = w / 2;
  const cy = h / 2;

  switch (def.id) {
    case 'bed_teal':
    case 'bed_crimson':
    case 'bed_double': {
      const isDouble = def.id === 'bed_double';
      const blanketMain = def.id === 'bed_teal' ? '#3d8f8b' : def.id === 'bed_crimson' ? '#9c363b' : '#4a6b8a';
      const blanketLight = def.id === 'bed_teal' ? '#58ada7' : def.id === 'bed_crimson' ? '#bd4c52' : '#6588a8';
      const trim = '#d8b66c';
      // Wooden frame
      ctx.fillStyle = '#5c3d24';
      ctx.strokeStyle = '#24150a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(4, 4, w - 8, h - 8, 6);
      ctx.fill();
      ctx.stroke();
      // Headboard
      ctx.fillStyle = '#472d18';
      ctx.fillRect(4, 4, w - 8, 14);
      // Mattress / sheet
      ctx.fillStyle = '#e6decb';
      ctx.beginPath();
      ctx.roundRect(10, 18, w - 20, h - 28, 4);
      ctx.fill();
      // Pillows
      const pillowCount = isDouble ? 2 : 1;
      const pw = (w - 28) / pillowCount - (isDouble ? 4 : 0);
      for (let i = 0; i < pillowCount; i++) {
        const px = 14 + i * (pw + 8);
        ctx.fillStyle = '#f4efe2';
        ctx.strokeStyle = '#b5aa94';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(px, 22, pw, 26, 8);
        ctx.fill();
        ctx.stroke();
      }
      // Blanket
      const by = 52;
      const bh = h - by - 12;
      const grad = ctx.createLinearGradient(0, by, 0, by + bh);
      grad.addColorStop(0, blanketLight);
      grad.addColorStop(1, blanketMain);
      ctx.fillStyle = grad;
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(10, by, w - 20, bh, 5);
      ctx.fill();
      ctx.stroke();
      // Folded top cuff
      ctx.fillStyle = '#dcd4be';
      ctx.fillRect(10, by, w - 20, 12);
      // Gold embroidered medallion
      ctx.strokeStyle = trim;
      ctx.lineWidth = 2;
      ctx.strokeRect(18, by + 20, w - 36, bh - 30);
      ctx.beginPath();
      ctx.arc(cx, by + bh * 0.56, Math.min(w, bh) * 0.16, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'table_round':
    case 'table_round_teal': {
      const r = Math.min(w, h) * 0.45;
      const grad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.1, cx, cy, r);
      grad.addColorStop(0, '#c29763');
      grad.addColorStop(0.7, '#996f41');
      grad.addColorStop(1, '#6e4b27');
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#2d1c0d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Plank seams
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = 'rgba(42,24,10,0.32)';
      ctx.lineWidth = 1.5;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * (r * 0.34), cy - r);
        ctx.lineTo(cx + i * (r * 0.34), cy + r);
        ctx.stroke();
      }
      if (def.id === 'table_round_teal') {
        // Teal table runner like screenshot 1
        ctx.fillStyle = '#2e7c77';
        ctx.fillRect(cx - r * 0.26, cy - r, r * 0.52, r * 2);
        ctx.strokeStyle = '#d9b96c';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - r * 0.23, cy - r, r * 0.46, r * 2);
      } else {
        // Wooden mug & plate
        ctx.fillStyle = '#d9cfb8';
        ctx.beginPath();
        ctx.arc(cx - r * 0.32, cy - r * 0.2, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#5a3b22';
        ctx.beginPath();
        ctx.arc(cx + r * 0.28, cy + r * 0.18, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }

    case 'table_banquet': {
      ctx.fillStyle = '#8b6138';
      ctx.strokeStyle = '#29180a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, h - 16, 6);
      ctx.fill();
      ctx.stroke();
      // Plank lines
      ctx.strokeStyle = 'rgba(35,20,8,0.32)';
      ctx.lineWidth = 1.5;
      for (let y = 26; y < h - 18; y += 22) {
        ctx.beginPath();
        ctx.moveTo(8, y);
        ctx.lineTo(w - 8, y);
        ctx.stroke();
      }
      // Subtle highlight
      ctx.strokeStyle = 'rgba(255,235,200,0.18)';
      ctx.strokeRect(10, 12, w - 20, h - 24);
      break;
    }

    case 'pew': {
      // Carved church pew like screenshots 1 & 2
      ctx.fillStyle = '#734d2e';
      ctx.strokeStyle = '#241409';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, h - 16, 4);
      ctx.fill();
      ctx.stroke();
      // Backrest rail
      ctx.fillStyle = '#4e311a';
      ctx.fillRect(8, 8, w - 16, 13);
      // Seat highlight
      ctx.fillStyle = '#8f633e';
      ctx.fillRect(10, 24, w - 20, h - 38);
      // End armrests
      ctx.fillStyle = '#472b15';
      ctx.fillRect(4, 6, 11, h - 12);
      ctx.fillRect(w - 15, 6, 11, h - 12);
      break;
    }

    case 'chair': {
      ctx.fillStyle = '#845935';
      ctx.strokeStyle = '#26160b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(10, 12, w - 20, h - 20, 5);
      ctx.fill();
      ctx.stroke();
      // Backrest
      ctx.fillStyle = '#57371d';
      ctx.fillRect(8, 8, w - 16, 11);
      ctx.strokeRect(8, 8, w - 16, 11);
      break;
    }

    case 'desk': {
      ctx.fillStyle = '#7a5230';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, h - 16, 4);
      ctx.fill();
      ctx.stroke();
      // Parchment sheet
      ctx.save();
      ctx.translate(cx - 10, cy);
      ctx.rotate(-0.08);
      ctx.fillStyle = '#ece1c4';
      ctx.fillRect(-20, -14, 40, 28);
      ctx.strokeStyle = '#9c8c6c';
      ctx.lineWidth = 1;
      ctx.strokeRect(-20, -14, 40, 28);
      ctx.restore();
      // Inkwell
      ctx.fillStyle = '#22262e';
      ctx.beginPath();
      ctx.arc(cx + 32, cy - 10, 6, 0, Math.PI * 2);
      ctx.fill();
      // Candle
      ctx.fillStyle = '#f7e5b7';
      ctx.beginPath();
      ctx.arc(cx + 46, cy + 10, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'bookshelf': {
      ctx.fillStyle = '#5c3b20';
      ctx.strokeStyle = '#221308';
      ctx.lineWidth = 3;
      ctx.fillRect(4, 6, w - 8, h - 12);
      ctx.strokeRect(4, 6, w - 8, h - 12);
      const bookColors = ['#8c2f32', '#2f5c6e', '#4c6e3b', '#8c6b2f', '#5b3c6e', '#7a452d'];
      let bx = 10;
      let idx = 0;
      while (bx < w - 18) {
        const bw = 9 + ((idx * 7) % 7);
        ctx.fillStyle = bookColors[idx % bookColors.length];
        ctx.fillRect(bx, 12, bw, h - 24);
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, 12, bw, h - 24);
        bx += bw + 1;
        idx++;
      }
      break;
    }

    case 'sofa_teal': {
      ctx.fillStyle = '#337d79';
      ctx.strokeStyle = '#183b39';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, h - 16, 10);
      ctx.fill();
      ctx.stroke();
      // Back & arms
      ctx.fillStyle = '#286461';
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, 18, 6);
      ctx.fill();
      ctx.fillRect(6, 8, 16, h - 16);
      ctx.fillRect(w - 22, 8, 16, h - 16);
      // Cushions
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(24, 28, (w - 48) / 2 - 2, h - 40);
      ctx.strokeRect(cx + 2, 28, (w - 48) / 2 - 2, h - 40);
      break;
    }

    case 'fireplace': {
      ctx.fillStyle = '#6c6862';
      ctx.strokeStyle = '#242220';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(4, 4, w - 8, h - 8, 4);
      ctx.fill();
      ctx.stroke();
      // Hearth pit
      ctx.fillStyle = '#231914';
      ctx.fillRect(22, 18, w - 44, h - 28);
      // Glowing embers
      const grad = ctx.createRadialGradient(cx, cy + 4, 4, cx, cy + 4, w * 0.28);
      grad.addColorStop(0, '#fff2a6');
      grad.addColorStop(0.4, '#ff7b24');
      grad.addColorStop(1, 'rgba(180,40,10,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(22, 18, w - 44, h - 28);
      break;
    }

    case 'rug_teal':
    case 'rug_crimson':
    case 'rug_runner': {
      const main = def.id === 'rug_crimson' ? '#842b31' : '#3c857e';
      const inner = def.id === 'rug_crimson' ? '#631d22' : '#2e6b65';
      const gold = '#d6b66f';
      // Fringe
      ctx.strokeStyle = '#cbb98f';
      ctx.lineWidth = 2;
      for (let y = 10; y < h - 10; y += 6) {
        ctx.beginPath();
        ctx.moveTo(2, y);
        ctx.lineTo(10, y);
        ctx.moveTo(w - 10, y);
        ctx.lineTo(w - 2, y);
        ctx.stroke();
      }
      ctx.fillStyle = main;
      ctx.fillRect(10, 6, w - 20, h - 12);
      ctx.strokeStyle = gold;
      ctx.lineWidth = 3;
      ctx.strokeRect(16, 12, w - 32, h - 24);
      ctx.fillStyle = inner;
      ctx.fillRect(24, 20, w - 48, h - 40);
      // Ornate center medallion
      ctx.strokeStyle = gold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, 28);
      ctx.lineTo(w - 32, cy);
      ctx.lineTo(cx, h - 28);
      ctx.lineTo(32, cy);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.14, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'rug_round': {
      ctx.fillStyle = '#4b6485';
      ctx.strokeStyle = '#c9b37d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.45, h * 0.43, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.34, h * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'altar_gold': {
      const r = Math.min(w, h) * 0.46;
      // Stone dais
      ctx.fillStyle = '#9c927d';
      ctx.strokeStyle = '#332d23';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#b8ae96';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2);
      ctx.fill();
      // Golden shrine figure
      const grad = ctx.createRadialGradient(cx - 8, cy - 10, 6, cx, cy, r * 0.6);
      grad.addColorStop(0, '#fae08c');
      grad.addColorStop(0.6, '#c7993c');
      grad.addColorStop(1, '#755318');
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#3b2809';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 0.52, r * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.14, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'well': {
      const r = Math.min(w, h) * 0.44;
      // Stone rim
      ctx.fillStyle = '#7e7970';
      ctx.strokeStyle = '#262420';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Dark water interior
      const grad = ctx.createRadialGradient(cx - 6, cy - 6, 4, cx, cy, r * 0.66);
      grad.addColorStop(0, '#2a4a57');
      grad.addColorStop(1, '#101c24');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.66, 0, Math.PI * 2);
      ctx.fill();
      // Stone wedge lines
      ctx.strokeStyle = 'rgba(30,28,24,0.55)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r * 0.66, cy + Math.sin(a) * r * 0.66);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.stroke();
      }
      break;
    }

    case 'pool_teal': {
      // Stone border
      ctx.fillStyle = '#9c9586';
      ctx.strokeStyle = '#332f28';
      ctx.lineWidth = 3;
      ctx.fillRect(4, 4, w - 8, h - 8);
      ctx.strokeRect(4, 4, w - 8, h - 8);
      // Glowing sanctuary water
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * 0.55);
      grad.addColorStop(0, '#5bc5c9');
      grad.addColorStop(0.55, '#2b8694');
      grad.addColorStop(1, '#174d5c');
      ctx.fillStyle = grad;
      ctx.fillRect(14, 14, w - 28, h - 28);
      // Caustic ripples
      ctx.strokeStyle = 'rgba(210,250,255,0.28)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx - 12, cy - 20, 26, 14, 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx + 16, cy + 28, 22, 12, -0.4, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'fountain': {
      const r = Math.min(w, h) * 0.46;
      ctx.fillStyle = '#8b867d';
      ctx.strokeStyle = '#2d2b27';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#3c8da1';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#a49e94';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'barrel': {
      const r = Math.min(w, h) * 0.42;
      ctx.fillStyle = '#8c6239';
      ctx.strokeStyle = '#291a0d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Iron band
      ctx.strokeStyle = '#43464d';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
      ctx.stroke();
      // Plank seams
      ctx.strokeStyle = 'rgba(35,20,8,0.45)';
      ctx.lineWidth = 1.5;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 10, cy - r + 6);
        ctx.lineTo(cx + i * 10, cy + r - 6);
        ctx.stroke();
      }
      break;
    }

    case 'crate': {
      ctx.fillStyle = '#996f43';
      ctx.strokeStyle = '#2b1b0c';
      ctx.lineWidth = 3;
      ctx.fillRect(8, 8, w - 16, h - 16);
      ctx.strokeRect(8, 8, w - 16, h - 16);
      // Cross brace
      ctx.strokeStyle = '#6c4926';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(14, 14);
      ctx.lineTo(w - 14, h - 14);
      ctx.stroke();
      ctx.strokeStyle = '#2b1b0c';
      ctx.lineWidth = 2;
      ctx.strokeRect(16, 16, w - 32, h - 32);
      break;
    }

    case 'sack': {
      ctx.fillStyle = '#b09872';
      ctx.strokeStyle = '#3b2f1f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.4, h * 0.38, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#856e4d';
      ctx.beginPath();
      ctx.arc(cx + 8, cy - 4, 6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'cart': {
      // Wheels
      ctx.fillStyle = '#472d18';
      ctx.fillRect(4, h * 0.35, 10, h * 0.3);
      ctx.fillRect(w - 14, h * 0.35, 10, h * 0.3);
      // Shafts
      ctx.strokeStyle = '#5c3c22';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(w * 0.3, 10);
      ctx.lineTo(w * 0.3, h * 0.32);
      ctx.moveTo(w * 0.7, 10);
      ctx.lineTo(w * 0.7, h * 0.32);
      ctx.stroke();
      // Cart bed
      ctx.fillStyle = '#855a34';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 3;
      ctx.fillRect(14, h * 0.26, w - 28, h * 0.64);
      ctx.strokeRect(14, h * 0.26, w - 28, h * 0.64);
      // Cargo grain/sacks
      ctx.fillStyle = '#c4ab76';
      ctx.beginPath();
      ctx.ellipse(cx, h * 0.56, w * 0.26, h * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'chest': {
      ctx.fillStyle = '#754926';
      ctx.strokeStyle = '#241408';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(8, 10, w - 16, h - 20, 4);
      ctx.fill();
      ctx.stroke();
      // Iron straps
      ctx.fillStyle = '#474c54';
      ctx.fillRect(20, 10, 9, h - 20);
      ctx.fillRect(w - 29, 10, 9, h - 20);
      // Gold clasp
      ctx.fillStyle = '#d9b252';
      ctx.fillRect(cx - 7, h - 18, 14, 9);
      break;
    }

    case 'anvil': {
      ctx.fillStyle = '#4a4f57';
      ctx.strokeStyle = '#191b1f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(12, cy);
      ctx.lineTo(36, 16);
      ctx.lineTo(w - 14, 16);
      ctx.lineTo(w - 14, h - 16);
      ctx.lineTo(36, h - 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'tree_oak': {
      const r = Math.min(w, h) * 0.44;
      // Rich layered painted canopy clusters (like screenshot 1)
      const puffs = [
        { dx: -0.22, dy: -0.18, rr: 0.44, c: '#294a30' },
        { dx: 0.24, dy: -0.14, rr: 0.42, c: '#2f5436' },
        { dx: -0.18, dy: 0.24, rr: 0.42, c: '#24402a' },
        { dx: 0.2, dy: 0.22, rr: 0.4, c: '#213b27' },
        { dx: 0, dy: 0, rr: 0.52, c: '#3b6b41' },
        { dx: -0.15, dy: -0.15, rr: 0.34, c: '#4d8750' },
        { dx: 0.14, dy: -0.12, rr: 0.3, c: '#5c9c59' },
        { dx: -0.08, dy: -0.22, rr: 0.2, c: '#79b86c' },
      ];
      for (const p of puffs) {
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(cx + p.dx * r, cy + p.dy * r, p.rr * r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Subtle leaf stipples
      ctx.fillStyle = 'rgba(165,220,130,0.32)';
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        const dist = (0.18 + (i % 3) * 0.18) * r;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * dist - 6, cy + Math.sin(a) * dist - 6, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'tree_pine': {
      const r = Math.min(w, h) * 0.45;
      const tiers = [
        { scale: 1.0, color: '#213d2e' },
        { scale: 0.72, color: '#2e573f' },
        { scale: 0.44, color: '#457856' },
      ];
      for (const tier of tiers) {
        ctx.fillStyle = tier.color;
        ctx.beginPath();
        const spikes = 10;
        for (let i = 0; i < spikes * 2; i++) {
          const rad = (i % 2 === 0 ? 1 : 0.58) * r * tier.scale;
          const a = (i / (spikes * 2)) * Math.PI * 2;
          const x = cx + Math.cos(a) * rad;
          const y = cy + Math.sin(a) * rad;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      }
      break;
    }

    case 'bush': {
      const r = Math.min(w, h) * 0.4;
      const puffs = [
        { dx: -0.25, dy: 0.1, rr: 0.48, c: '#2e5232' },
        { dx: 0.25, dy: 0.08, rr: 0.45, c: '#36613a' },
        { dx: 0, dy: -0.18, rr: 0.5, c: '#4a7c48' },
        { dx: -0.08, dy: -0.22, rr: 0.28, c: '#6da360' },
      ];
      for (const p of puffs) {
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(cx + p.dx * r, cy + p.dy * r, p.rr * r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'rock': {
      ctx.fillStyle = '#73706a';
      ctx.strokeStyle = '#292825';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.2, h * 0.25);
      ctx.lineTo(w * 0.65, h * 0.12);
      ctx.lineTo(w * 0.88, h * 0.48);
      ctx.lineTo(w * 0.72, h * 0.84);
      ctx.lineTo(w * 0.25, h * 0.8);
      ctx.lineTo(w * 0.12, h * 0.52);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Facet highlight
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.beginPath();
      ctx.moveTo(w * 0.22, h * 0.27);
      ctx.lineTo(w * 0.63, h * 0.15);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'stump': {
      const r = Math.min(w, h) * 0.4;
      ctx.fillStyle = '#634329';
      ctx.strokeStyle = '#26170b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#b89464';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.76, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(92,60,30,0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.48, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'brazier': {
      const r = Math.min(w, h) * 0.42;
      ctx.fillStyle = '#473c33';
      ctx.strokeStyle = '#1c1713';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Brass rim
      ctx.strokeStyle = '#c99c4a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2);
      ctx.stroke();
      // Fire core
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 0.72);
      grad.addColorStop(0, '#fff7c2');
      grad.addColorStop(0.45, '#ff9d2e');
      grad.addColorStop(0.85, '#c93814');
      grad.addColorStop(1, '#3d150c');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'torch_wall':
    case 'lantern':
    case 'candle_cluster': {
      const r = Math.min(w, h) * 0.34;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 1.15);
      grad.addColorStop(0, '#fff7cc');
      grad.addColorStop(0.5, '#ffaa38');
      grad.addColorStop(1, 'rgba(255,120,20,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = def.id === 'candle_cluster' ? '#f2e8cf' : '#3a3d45';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.42, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  return canvas;
}

export function getPropSprite(propId: string): HTMLCanvasElement | null {
  if (propId.startsWith('custom:')) return null;
  let sprite = spriteCache.get(propId);
  if (!sprite) {
    const def = BUILTIN_PROPS.find((p) => p.id === propId);
    if (!def) return null;
    sprite = renderPropSprite(def);
    spriteCache.set(propId, sprite);
  }
  return sprite;
}

export function getPropThumbnail(propId: string, customAssets: CustomAsset[] = []): string {
  if (propId.startsWith('custom:')) {
    const cid = propId.slice('custom:'.length);
    return customAssets.find((a) => a.id === cid)?.dataUrl ?? '';
  }
  let url = thumbCache.get(propId);
  if (!url) {
    const sprite = getPropSprite(propId);
    if (!sprite) return '';
    url = sprite.toDataURL('image/png');
    thumbCache.set(propId, url);
  }
  return url;
}
