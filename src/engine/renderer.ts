import type {
  BrushShape,
  CustomAsset,
  MapDocument,
  MapLevel,
  MapObject,
  PathItem,
  Point,
  PortalItem,
  RoomShape,
  SelectionRef,
  TerrainStroke,
  WallPolyline,
  WaterStroke,
} from '../types/map';
import {
  getCachedOccluders,
  getCachedVisibilityPolygon,
  hexToRgb,
} from './lighting';
import {
  bendHandles,
  offsetLine,
  pathSegments,
  samplePath,
  spacedAlong,
} from './paths';
import {
  getCustomImage,
  getPropDefinition,
  getPropSprite,
} from './props';
import { getRoadPattern, getTexturePattern, getWallColors } from './textures';

export interface RenderOptions {
  ppg: number; // pixels per grid tile
  showGrid?: boolean;
  showLighting?: boolean;
  selection?: SelectionRef | null;
  selectedItems?: SelectionRef[];
  showLightHandles?: boolean;
  previewTerrainStroke?: TerrainStroke | null;
  previewWaterStroke?: WaterStroke | null;
  onAssetLoaded?: () => void;
  overlay?: boolean; // false = leave out selection and light handles (drawn separately)
  maxLayerSize?: number; // cap in px for soft offscreen layers; unset = full resolution (export)
}

// Terrain/water bitmap size in the editor; the lightmap, being blurry, uses half of it.
export const EDITOR_LAYER_LIMIT = 2048;

// Reusable offscreen canvases for lighting, terrain feathering & water compositing
let lightCanvas: HTMLCanvasElement | null = null;
let waterCanvas: HTMLCanvasElement | null = null;
let strokeMaskCanvas: HTMLCanvasElement | null = null;
let tintCanvas: HTMLCanvasElement | null = null;
let terrainCacheCanvas: HTMLCanvasElement | null = null;
let terrainCacheState: {
  levelId: string;
  width: number;
  height: number;
  ppg: number;
  terrainBase: string;
  terrainStrokes: MapLevel['terrainStrokes'];
  waterStrokes: MapLevel['waterStrokes'];
  showTerrain: boolean;
  showWater: boolean;
} | null = null;

function getOffscreen(
  existing: HTMLCanvasElement | null,
  w: number,
  h: number
): HTMLCanvasElement {
  const c = existing ?? document.createElement('canvas');
  if (c.width !== w || c.height !== h) {
    c.width = w;
    c.height = h;
  }
  return c;
}

function tracePolygon(ctx: CanvasRenderingContext2D, points: Point[], ppg: number) {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x * ppg, points[0].y * ppg);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x * ppg, points[i].y * ppg);
  }
  ctx.closePath();
}

function tracePolyline(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  ppg: number,
  smooth = false,
  closed = false
) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x * ppg, points[0].y * ppg);
  if (smooth && points.length > 2) {
    for (let i = 1; i < points.length - 1; i++) {
      const xc = ((points[i].x + points[i + 1].x) * 0.5) * ppg;
      const yc = ((points[i].y + points[i + 1].y) * 0.5) * ppg;
      ctx.quadraticCurveTo(points[i].x * ppg, points[i].y * ppg, xc, yc);
    }
    const last = points[points.length - 1];
    ctx.lineTo(last.x * ppg, last.y * ppg);
  } else {
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x * ppg, points[i].y * ppg);
    }
  }
  if (closed) ctx.closePath();
}

export function traceBrushShape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radiusPx: number,
  shape: BrushShape = 'circle',
  angleDeg = 0,
  rectRatio = 2.0
) {
  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(cx, cy, radiusPx, 0, Math.PI * 2);
    return;
  }

  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  if (shape === 'square' || shape === 'rectangle') {
    const hw = radiusPx;
    const hh = shape === 'rectangle' ? radiusPx / Math.max(1.1, rectRatio) : radiusPx;
    const corners = [
      [-hw, -hh],
      [hw, -hh],
      [hw, hh],
      [-hw, hh],
    ];
    corners.forEach(([x, y], idx) => {
      const rx = cx + x * cos - y * sin;
      const ry = cy + x * sin + y * cos;
      if (idx === 0) ctx.moveTo(rx, ry);
      else ctx.lineTo(rx, ry);
    });
    ctx.closePath();
    return;
  }

  const sides = shape === 'diamond' ? 4 : shape === 'hexagon' ? 6 : 8;
  const baseOffset = shape === 'octagon' ? Math.PI / 8 : 0;
  for (let i = 0; i < sides; i++) {
    const a = rad + baseOffset + (i * Math.PI * 2) / sides;
    const vx = cx + Math.cos(a) * radiusPx;
    const vy = cy + Math.sin(a) * radiusPx;
    if (i === 0) ctx.moveTo(vx, vy);
    else ctx.lineTo(vx, vy);
  }
  ctx.closePath();
}

function drawTerrainStrokeFeathered(
  ctx: CanvasRenderingContext2D,
  stroke: TerrainStroke,
  mapW: number,
  mapH: number,
  ppg: number,
  texScale: number
) {
  if (stroke.points.length === 0) return;

  const shape = stroke.shape ?? 'circle';
  const angleDeg = stroke.shapeAngle ?? 0;
  const rectRatio = stroke.rectRatio ?? 2.0;
  const r = Math.max(4, stroke.radius * ppg);
  const pad = Math.ceil(r * 1.45 + 6);

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of stroke.points) {
    const px = p.x * ppg;
    const py = p.y * ppg;
    if (px < minX) minX = px;
    if (py < minY) minY = py;
    if (px > maxX) maxX = px;
    if (py > maxY) maxY = py;
  }

  const bx = Math.max(0, Math.floor(minX - pad));
  const by = Math.max(0, Math.floor(minY - pad));
  const bx2 = Math.min(Math.ceil(mapW), Math.ceil(maxX + pad));
  const by2 = Math.min(Math.ceil(mapH), Math.ceil(maxY + pad));
  const bw = bx2 - bx;
  const bh = by2 - by;
  if (bw <= 0 || bh <= 0) return;

  strokeMaskCanvas = getOffscreen(strokeMaskCanvas, bw, bh);
  const mctx = strokeMaskCanvas.getContext('2d')!;
  mctx.clearRect(0, 0, bw, bh);

  // 1. Paint soft radial or geometric dabs along the interpolated path
  const innerFrac = Math.max(0.1, 1 - stroke.softness * 0.72);
  const step = Math.max(2, r * 0.25);

  const dab = document.createElement('canvas');
  dab.width = dab.height = pad * 2;
  const dctx = dab.getContext('2d')!;
  if (shape === 'circle') {
    const grad = dctx.createRadialGradient(pad, pad, r * innerFrac, pad, pad, r);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    dctx.fillStyle = grad;
    dctx.beginPath();
    dctx.arc(pad, pad, r, 0, Math.PI * 2);
    dctx.fill();
  } else {
    dctx.fillStyle = '#ffffff';
    if (stroke.softness > 0.05) {
      dctx.shadowColor = '#ffffff';
      dctx.shadowBlur = r * stroke.softness * 0.55;
      traceBrushShape(dctx, pad, pad, r * innerFrac, shape, angleDeg, rectRatio);
    } else {
      traceBrushShape(dctx, pad, pad, r, shape, angleDeg, rectRatio);
    }
    dctx.fill();
  }
  const stampDab = (wx: number, wy: number) => {
    mctx.drawImage(dab, wx - bx - pad, wy - by - pad);
  };

  mctx.globalCompositeOperation = 'source-over';
  if (stroke.points.length === 1) {
    stampDab(stroke.points[0].x * ppg, stroke.points[0].y * ppg);
  } else {
    for (let i = 0; i < stroke.points.length - 1; i++) {
      const ax = stroke.points[i].x * ppg;
      const ay = stroke.points[i].y * ppg;
      const cx = stroke.points[i + 1].x * ppg;
      const cy = stroke.points[i + 1].y * ppg;
      const dist = Math.hypot(cx - ax, cy - ay);
      const steps = Math.max(1, Math.ceil(dist / step));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        stampDab(ax + (cx - ax) * t, ay + (cy - ay) * t);
      }
    }
  }

  // 2. Fill mask with world-aligned sharp terrain texture
  const pat = getTexturePattern(mctx, 'terrain', stroke.material, texScale);
  if (!pat) return;
  mctx.save();
  mctx.globalCompositeOperation = 'source-in';
  mctx.translate(-bx, -by);
  mctx.fillStyle = pat;
  mctx.fillRect(bx, by, bw, bh);
  mctx.restore();

  // 3. Composite onto main scene
  ctx.save();
  ctx.globalAlpha = stroke.opacity;
  ctx.drawImage(strokeMaskCanvas, bx, by);
  ctx.restore();
}

function drawTerrain(
  ctx: CanvasRenderingContext2D,
  doc: MapDocument,
  level: MapLevel,
  ppg: number,
  previewStroke?: TerrainStroke | null
) {
  const mapW = doc.width * ppg;
  const mapH = doc.height * ppg;
  const texScale = ppg / 128;

  // Base terrain fill
  const basePat = getTexturePattern(ctx, 'terrain', level.terrainBase, texScale);
  ctx.fillStyle = basePat ?? '#6e5e46';
  ctx.fillRect(0, 0, mapW, mapH);

  // Feathered sharp-texture strokes
  for (const stroke of level.terrainStrokes) {
    drawTerrainStrokeFeathered(ctx, stroke, mapW, mapH, ppg, texScale);
  }
  if (previewStroke) {
    drawTerrainStrokeFeathered(ctx, previewStroke, mapW, mapH, ppg, texScale);
  }
}

function drawWater(
  ctx: CanvasRenderingContext2D,
  doc: MapDocument,
  level: MapLevel,
  ppg: number,
  previewStroke?: WaterStroke | null
) {
  const allStrokes = previewStroke
    ? [...level.waterStrokes, previewStroke]
    : level.waterStrokes;
  if (allStrokes.length === 0) return;

  const mapW = Math.max(1, Math.round(doc.width * ppg));
  const mapH = Math.max(1, Math.round(doc.height * ppg));
  const wc = getOffscreen(waterCanvas, mapW, mapH);
  waterCanvas = wc;
  const wctx = wc.getContext('2d')!;

  const renderWaterPass = (
    radiusFn: (rPx: number) => number,
    colorFn: (s: WaterStroke) => string,
    removes: (s: WaterStroke) => boolean = (s) => Boolean(s.erase),
    alpha = 1
  ) => {
    wctx.clearRect(0, 0, mapW, mapH);
    for (const s of allStrokes) {
      if (s.points.length === 0) continue;
      const rPx = Math.max(2, radiusFn(s.radius * ppg));
      wctx.save();
      const cut = removes(s);
      wctx.globalCompositeOperation = cut ? 'destination-out' : 'source-over';
      wctx.lineCap = 'round';
      wctx.lineJoin = 'round';
      const col = cut ? '#000' : colorFn(s);
      wctx.fillStyle = col;
      wctx.strokeStyle = col;
      drawStrokeShape(
        wctx,
        s.points,
        rPx,
        ppg,
        s.shape ?? 'circle',
        s.shapeAngle ?? 0,
        s.rectRatio ?? 2.0
      );
      wctx.restore();
    }
    // Translucency is applied once to the whole pass, so overlapping strokes never stack it.
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.drawImage(wc, 0, 0);
    ctx.restore();
  };

  // Unified multi-pass water so overlapping strokes merge seamlessly
  renderWaterPass((r) => r + ppg * 0.18, () => 'rgb(26, 50, 56)', undefined, 0.55);
  renderWaterPass((r) => r + ppg * 0.06, (s) => s.shallowColor);
  renderWaterPass((r) => r * 0.94, () => 'rgb(218, 246, 252)', undefined, 0.26);
  renderWaterPass(
    (r) => r * 0.72,
    (s) => s.deepColor,
    (s) => Boolean(s.erase) || s.deep === false
  );
}

function drawStrokeShape(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  radiusPx: number,
  ppg: number,
  shape: BrushShape = 'circle',
  angleDeg = 0,
  rectRatio = 2.0
) {
  if (shape === 'circle') {
    if (points.length === 1) {
      ctx.beginPath();
      ctx.arc(points[0].x * ppg, points[0].y * ppg, radiusPx, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.lineWidth = radiusPx * 2;
      tracePolyline(ctx, points, ppg, true, false);
      ctx.stroke();
    }
    return;
  }

  const step = Math.max(2, radiusPx * 0.25);
  if (points.length === 1) {
    traceBrushShape(ctx, points[0].x * ppg, points[0].y * ppg, radiusPx, shape, angleDeg, rectRatio);
    ctx.fill();
  } else {
    for (let i = 0; i < points.length - 1; i++) {
      const ax = points[i].x * ppg;
      const ay = points[i].y * ppg;
      const cx = points[i + 1].x * ppg;
      const cy = points[i + 1].y * ppg;
      const dist = Math.hypot(cx - ax, cy - ay);
      const steps = Math.max(1, Math.ceil(dist / step));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        traceBrushShape(
          ctx,
          ax + (cx - ax) * t,
          ay + (cy - ay) * t,
          radiusPx,
          shape,
          angleDeg,
          rectRatio
        );
        ctx.fill();
      }
    }
  }
}

function drawRoomFloors(
  ctx: CanvasRenderingContext2D,
  rooms: RoomShape[],
  ppg: number
) {
  const texScale = ppg / 128;
  for (const room of rooms) {
    if (room.points.length < 3) continue;
    ctx.save();
    tracePolygon(ctx, room.points, ppg);
    ctx.clip();

    if (room.floorRotation) {
      const cx =
        (room.points.reduce((s, p) => s + p.x, 0) / room.points.length) * ppg;
      const cy =
        (room.points.reduce((s, p) => s + p.y, 0) / room.points.length) * ppg;
      ctx.translate(cx, cy);
      ctx.rotate((room.floorRotation * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    const pat = getTexturePattern(ctx, 'floor', room.floor, texScale);
    ctx.fillStyle = pat ?? '#826040';
    ctx.fill();

    if (room.floorTint) {
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = room.floorTint;
      ctx.globalAlpha = 0.35;
      ctx.fill();
    }

    // Inner ambient occlusion shadow along room perimeter (makes floors feel recessed inside walls!)
    if (room.wallStyle) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(10, 8, 6, 0.36)';
      ctx.lineWidth = Math.max(6, room.wallThickness * ppg * 1.9);
      ctx.lineJoin = 'round';
      tracePolygon(ctx, room.points, ppg);
      ctx.stroke();
    }

    ctx.restore();
  }
}

function drawPaths(
  ctx: CanvasRenderingContext2D,
  paths: PathItem[],
  ppg: number
) {
  // Same-style paths share layers (all borders, then all fills) so crossings merge.
  const byStyle = new Map<PathItem['style'], PathItem[]>();
  for (const path of paths) {
    if (path.points.length < 2) continue;
    byStyle.set(path.style, [...(byStyle.get(path.style) ?? []), path]);
  }
  for (const group of byStyle.values()) {
    const layered = group.map((path) => pathLayers(ctx, path, ppg));
    const depth = Math.max(...layered.map((layers) => layers.length));
    for (let i = 0; i < depth; i++) {
      for (const layers of layered) layers[i]?.();
    }
  }
}

// Paint steps of one path, bottom to top.
function pathLayers(
  ctx: CanvasRenderingContext2D,
  path: PathItem,
  ppg: number
): (() => void)[] {
  const w = path.width * ppg;
  const line = samplePath(path);
  const layers: (() => void)[] = [];
  const paint = (
    style: string | CanvasPattern,
    width: number,
    dash: number[] = [],
    points: Point[] = line
  ) => {
    layers.push(() => {
      ctx.save();
      ctx.lineCap = path.fadeEnds ? 'round' : 'butt';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = style;
      ctx.lineWidth = width;
      ctx.setLineDash(dash);
      tracePolyline(ctx, points, ppg);
      ctx.stroke();
      ctx.restore();
    });
  };

  if (path.style === 'dirt_road') {
    const earth = getRoadPattern(ctx, ppg / 128) ?? '#96794f';
    paint('rgba(74, 56, 32, 0.22)', w * 1.34);
    paint('rgba(84, 64, 38, 0.4)', w * 1.16);
    // Ragged edges: small lobes of earth spilling over both sides.
    const lobes = spacedAlong(line, Math.max(0.07, path.width * 0.09));
    layers.push(() => {
      ctx.save();
      ctx.fillStyle = earth;
      ctx.beginPath();
      lobes.forEach(({ at, normal }, i) => {
        for (const side of [-1, 1]) {
          // Repeatable pseudo-random value, so edges stay put between redraws.
          const seed = Math.sin((i + 1) * 12.9898 + side * 4.1) * 43758.5453;
          const noise = seed - Math.floor(seed);
          const out = side * path.width * (0.445 + noise * 0.06);
          const x = (at.x + normal.x * out) * ppg;
          const y = (at.y + normal.y * out) * ppg;
          const radius = w * (0.03 + noise * noise * 0.075);
          ctx.moveTo(x + radius, y);
          ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
      });
      ctx.fill();
      ctx.restore();
    });
    paint(earth, w);
    // Trodden middle and two wheel ruts
    paint('rgba(226, 196, 140, 0.13)', w * 0.62);
    for (const side of [-1, 1]) {
      const rut = offsetLine(line, side * path.width * 0.22);
      paint('rgba(66, 46, 24, 0.2)', w * 0.15, [], rut);
      paint('rgba(60, 40, 20, 0.24)', w * 0.06, [], rut);
    }
  } else if (path.style === 'cobble_path') {
    const pat = getTexturePattern(ctx, 'terrain', 'cobblestone', ppg / 140);
    paint('rgba(30,28,25,0.55)', w + 4);
    paint(pat ?? '#78746e', w);
  } else if (path.style === 'wood_bridge') {
    const pat = getTexturePattern(ctx, 'floor', 'wood_planks', ppg / 128);
    paint('#332011', w + 6);
    paint(pat ?? '#8a623f', w);
  } else if (path.style === 'carpet_teal' || path.style === 'carpet_crimson') {
    paint(path.style === 'carpet_teal' ? '#367d77' : '#852d33', w);
    paint('#d4b36a', Math.max(2, w * 0.1), [8, 4]);
  } else if (path.style === 'hedge') {
    paint('rgba(0,0,0,0.35)', w + 6);
    paint('#2d5232', w);
    paint('#487a49', w * 0.6);
  } else if (path.style === 'rail_tracks') {
    // Gravel bed, wooden sleepers, then two steel rails. Sizes follow the path width (in tiles).
    paint('#3d3933', w * 1.08);
    paint('#6a645a', w * 0.94);
    paint('#827b6f', w * 0.9, [2, 5]);
    const sleepers = spacedAlong(line, Math.max(0.28, path.width * 0.3));
    const half = path.width * 0.42;
    const sleeper = (color: string, thickness: number) => {
      layers.push(() => {
        ctx.save();
        ctx.lineCap = 'butt';
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        for (const { at, normal } of sleepers) {
          ctx.moveTo((at.x - normal.x * half) * ppg, (at.y - normal.y * half) * ppg);
          ctx.lineTo((at.x + normal.x * half) * ppg, (at.y + normal.y * half) * ppg);
        }
        ctx.stroke();
        ctx.restore();
      });
    };
    sleeper('#26180d', w * 0.17);
    sleeper('#6e4a2a', w * 0.12);
    const rails = [-1, 1].map((side) => offsetLine(line, side * path.width * 0.25));
    for (const [color, width] of [
      ['#1b1d21', 0.12],
      ['#7d8794', 0.075],
      ['#d5dbe3', 0.025],
    ] as const) {
      for (const rail of rails) paint(color, Math.max(1, w * width), [], rail);
    }
  } else if (path.style === 'rope_bridge') {
    paint('#7c532f', w, [8, 3]);
  } else if (path.style === 'stream_brook') {
    paint('#1e5b70', w * 1.15);
    paint('#45a8c4', w * 0.78);
  } else if (path.style === 'lava_stream') {
    paint('#4a180d', w * 1.25);
    paint('#f97316', w * 0.85);
    paint('#fde047', w * 0.35);
  } else if (path.style === 'stone_wall_low') {
    paint('#292724', w + 3);
    paint('#7d776e', w);
  } else if (
    path.style === 'fence_wood' ||
    path.style === 'fence_picket' ||
    path.style === 'fence_iron'
  ) {
    const isIron = path.style === 'fence_iron';
    const isPicket = path.style === 'fence_picket';
    const railW = Math.max(3, Math.min(w * 0.42, ppg * 0.22));
    // Ground shadow, outer dark stroke, rail core
    paint('rgba(0, 0, 0, 0.38)', railW + 5);
    paint(isIron ? '#12151c' : '#26160a', railW + 2.5);
    paint(isIron ? '#475569' : isPicket ? '#ded6c3' : '#8c5e35', railW);
    if (isPicket || isIron) {
      paint(isIron ? '#94a3b8' : '#f5efe2', railW * 1.55, [
        Math.max(2, ppg * 0.06),
        Math.max(4, ppg * 0.14),
      ]);
    }
    // Posts at piece ends and every ~1 tile, following the curve
    const postSize = Math.max(5, railW * 1.75);
    const drawPost = (px: number, py: number) => {
      ctx.fillStyle = isIron ? '#334155' : isPicket ? '#e7dfd0' : '#6e4726';
      ctx.strokeStyle = isIron ? '#0f172a' : '#241408';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      if (isIron) {
        ctx.arc(px, py, postSize * 0.55, 0, Math.PI * 2);
      } else {
        ctx.rect(px - postSize * 0.5, py - postSize * 0.5, postSize, postSize);
      }
      ctx.fill();
      ctx.stroke();
    };
    layers.push(() => {
      ctx.save();
      for (const seg of pathSegments(path)) {
        const lengths = seg.slice(1).map((b, i) => Math.hypot(b.x - seg[i].x, b.y - seg[i].y));
        const total = lengths.reduce((sum, len) => sum + len, 0);
        const count = Math.max(1, Math.round(total));
        let piece = 0;
        let before = 0;
        for (let k = 0; k < count; k++) {
          const at = (total * k) / count;
          while (piece < lengths.length - 1 && before + lengths[piece] < at) {
            before += lengths[piece++];
          }
          const t = lengths[piece] ? (at - before) / lengths[piece] : 0;
          const a = seg[piece];
          const b = seg[piece + 1];
          drawPost((a.x + (b.x - a.x) * t) * ppg, (a.y + (b.y - a.y) * t) * ppg);
        }
      }
      const last = line[line.length - 1];
      drawPost(last.x * ppg, last.y * ppg);
      ctx.restore();
    });
  } else {
    // cliff_edge
    paint('#2d2925', w);
    paint('#70685e', w * 0.55);
  }

  return layers;
}

const pathThumbs = new Map<PathItem['style'], string>();

// Preview of a path style, drawn with the same code as the map.
export function getPathThumbnail(style: PathItem['style']): string {
  let url = pathThumbs.get(style);
  if (!url) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#4c633c';
    ctx.fillRect(0, 0, 64, 64);
    const points = [{ x: -0.5, y: 0.5 }, { x: 1.5, y: 0.5 }];
    drawPaths(
      ctx,
      [{ id: 'thumb', points, style, width: 0.7, smooth: false, fadeEnds: false }],
      64
    );
    url = canvas.toDataURL('image/png');
    pathThumbs.set(style, url);
  }
  return url;
}

function drawWallStroke(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  closed: boolean,
  style: WallPolyline['style'],
  thicknessTiles: number,
  ppg: number,
  drawShadow: boolean
) {
  if (points.length < 2) return;
  const colors = getWallColors(style);
  const w = Math.max(4, thicknessTiles * ppg);

  ctx.save();
  ctx.lineJoin = 'miter';
  ctx.lineCap = 'square';
  ctx.miterLimit = 6;

  // Outer drop shadow on ground
  if (drawShadow) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.58)';
    ctx.shadowBlur = Math.max(8, w * 0.9);
    ctx.shadowOffsetX = w * 0.35;
    ctx.shadowOffsetY = w * 0.45;
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = w + 3;
    tracePolyline(ctx, points, ppg, false, closed);
    ctx.stroke();
    ctx.restore();
  }

  // Dark outer outline
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = w + 3;
  tracePolyline(ctx, points, ppg, false, closed);
  ctx.stroke();

  // Main wall body
  ctx.strokeStyle = colors.fill;
  ctx.lineWidth = w;
  tracePolyline(ctx, points, ppg, false, closed);
  ctx.stroke();

  // Top bevel / masonry core
  ctx.strokeStyle = colors.core;
  ctx.lineWidth = w * 0.58;
  tracePolyline(ctx, points, ppg, false, closed);
  ctx.stroke();

  // Stone block ticks along wall
  ctx.strokeStyle = 'rgba(20, 16, 12, 0.38)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([w * 0.12, w * 0.95]);
  tracePolyline(ctx, points, ppg, false, closed);
  ctx.stroke();
  ctx.setLineDash([]);

  // Subtle top highlight
  ctx.strokeStyle = colors.highlight;
  ctx.globalAlpha = 0.32;
  ctx.lineWidth = Math.max(1.5, w * 0.16);
  tracePolyline(ctx, points, ppg, false, closed);
  ctx.stroke();

  ctx.restore();
}

function drawPortals(
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

    // Wall cutout / threshold backing
    ctx.fillStyle = '#3b3329';
    ctx.fillRect(-w / 2, -h * 0.65, w, h * 1.3);

    if (p.kind === 'archway') {
      // Stone pillars on sides, open middle
      ctx.fillStyle = '#8d8578';
      ctx.strokeStyle = '#24201b';
      ctx.lineWidth = 2;
      ctx.fillRect(-w / 2 - 3, -h * 0.7, 8, h * 1.4);
      ctx.strokeRect(-w / 2 - 3, -h * 0.7, 8, h * 1.4);
      ctx.fillRect(w / 2 - 5, -h * 0.7, 8, h * 1.4);
      ctx.strokeRect(w / 2 - 5, -h * 0.7, 8, h * 1.4);
    } else if (p.kind === 'window_glass' || p.kind === 'window_stained' || p.kind === 'window_bars') {
      ctx.fillStyle =
        p.kind === 'window_stained'
          ? '#4fb3b8'
          : p.kind === 'window_bars'
            ? '#333840'
            : '#7ac2d6';
      ctx.strokeStyle = '#2b2218';
      ctx.lineWidth = 2.5;
      ctx.fillRect(-w / 2, -h * 0.42, w, h * 0.84);
      ctx.strokeRect(-w / 2, -h * 0.42, w, h * 0.84);
      // Mullion crossbars
      ctx.strokeStyle = '#3d3023';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.42);
      ctx.lineTo(0, h * 0.42);
      ctx.moveTo(-w / 2, 0);
      ctx.lineTo(w / 2, 0);
      ctx.stroke();
    } else if (p.kind === 'portcullis') {
      ctx.strokeStyle = '#4a5059';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-w / 2, -h * 0.35, w, h * 0.7);
      for (let x = -w / 2 + 6; x < w / 2; x += 8) {
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(x, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Doors
      const color =
        p.kind === 'door_iron'
          ? '#4a5059'
          : p.kind === 'door_secret'
            ? '#787166'
            : p.kind === 'door_ornate_gold'
              ? '#b89342'
              : '#784c28';
      const trim = p.kind === 'door_iron' ? '#22262b' : '#2e1b0d';
      // Jambs
      ctx.fillStyle = '#574636';
      ctx.fillRect(-w / 2 - 2, -h * 0.72, 6, h * 1.44);
      ctx.fillRect(w / 2 - 4, -h * 0.72, 6, h * 1.44);

      const swingDeg = p.openAngle ?? (p.open ? 75 : 0);
      const swingRad = (swingDeg * Math.PI) / 180;

      if (swingDeg > 1) {
        if (p.kind === 'door_double') {
          const leafW = (w - 4) * 0.48;
          // Left leaf
          ctx.save();
          ctx.translate(-w / 2 + 2, 0);
          ctx.rotate(-swingRad);
          ctx.fillStyle = color;
          ctx.strokeStyle = trim;
          ctx.lineWidth = 2;
          ctx.fillRect(0, -h * 0.25, leafW, h * 0.5);
          ctx.strokeRect(0, -h * 0.25, leafW, h * 0.5);
          ctx.restore();
          // Right leaf
          ctx.save();
          ctx.translate(w / 2 - 2, 0);
          ctx.rotate(swingRad);
          ctx.fillStyle = color;
          ctx.strokeStyle = trim;
          ctx.lineWidth = 2;
          ctx.fillRect(-leafW, -h * 0.25, leafW, h * 0.5);
          ctx.strokeRect(-leafW, -h * 0.25, leafW, h * 0.5);
          ctx.restore();
        } else {
          // Single swung door leaf
          ctx.save();
          ctx.translate(-w / 2 + 2, 0);
          ctx.rotate(-swingRad);
          ctx.fillStyle = color;
          ctx.strokeStyle = trim;
          ctx.lineWidth = 2;
          ctx.fillRect(0, -h * 0.25, w * 0.88, h * 0.5);
          ctx.strokeRect(0, -h * 0.25, w * 0.88, h * 0.5);
          ctx.restore();
        }
      } else {
        ctx.fillStyle = color;
        ctx.strokeStyle = trim;
        ctx.lineWidth = 2;
        ctx.fillRect(-w / 2 + 2, -h * 0.35, w - 4, h * 0.7);
        ctx.strokeRect(-w / 2 + 2, -h * 0.35, w - 4, h * 0.7);
        if (p.kind === 'door_double') {
          ctx.beginPath();
          ctx.moveTo(0, -h * 0.35);
          ctx.lineTo(0, h * 0.35);
          ctx.stroke();
        }
        // Brass handle
        ctx.fillStyle = '#d9b35b';
        ctx.beginPath();
        ctx.arc(w * 0.28, h * 0.2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

const structureThumbs = new Map<string, string>();

function thumbnail(key: string, draw: (ctx: CanvasRenderingContext2D, size: number) => void) {
  let url = structureThumbs.get(key);
  if (!url) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 80;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = getTexturePattern(ctx, 'floor', 'wood_planks', 0.5) ?? '#826040';
    ctx.fillRect(0, 0, 80, 80);
    draw(ctx, 80);
    url = canvas.toDataURL('image/png');
    structureThumbs.set(key, url);
  }
  return url;
}

// Previews drawn with the same code as the map, so they match what gets placed.
export function getWallThumbnail(style: WallPolyline['style']): string {
  return thumbnail(`wall:${style}`, (ctx, size) => {
    const points = [{ x: -0.5, y: 0.5 }, { x: 1.5, y: 0.5 }];
    drawWallStroke(ctx, points, false, style, 0.42, size, true);
  });
}

export function getPortalThumbnail(kind: PortalItem['kind']): string {
  return thumbnail(`portal:${kind}`, (ctx, size) => {
    // A stretch of wall with the door or window set into it, zoomed in on the opening.
    drawWallStroke(ctx, [{ x: -0.5, y: 0.5 }, { x: 0.08, y: 0.5 }], false, 'stone_hewn', 0.26, size, false);
    drawWallStroke(ctx, [{ x: 0.92, y: 0.5 }, { x: 1.5, y: 0.5 }], false, 'stone_hewn', 0.26, size, false);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.scale(1.6, 1.6);
    ctx.translate(-size / 4, -size / 4);
    drawPortals(
      ctx,
      [{ id: 'thumb', x: 0.5, y: 0.5, angle: 0, width: 0.9, kind, open: false, blocksLight: true }],
      size / 2
    );
    ctx.restore();
  });
}

function drawObjectsLayer(
  ctx: CanvasRenderingContext2D,
  objects: MapObject[],
  layer: MapObject['layer'],
  ppg: number,
  drawShadows: boolean,
  customAssets: CustomAsset[],
  onAssetLoaded?: () => void
) {
  const toScreen = ctx.getTransform();
  for (const obj of objects) {
    if (obj.layer !== layer) continue;
    const def = getPropDefinition(obj.propId, customAssets);
    if (!def) continue;

    const w = def.widthTiles * ppg * Math.abs(obj.scaleX);
    const h = def.heightTiles * ppg * Math.abs(obj.scaleY);

    // Off-screen objects cost nothing (shadows reach about half a tile further).
    const centre = toScreen.transformPoint({ x: obj.x * ppg, y: obj.y * ppg });
    const reach = (Math.hypot(w, h) / 2 + ppg * 0.5) * Math.hypot(toScreen.a, toScreen.b);
    if (
      centre.x < -reach ||
      centre.y < -reach ||
      centre.x > ctx.canvas.width + reach ||
      centre.y > ctx.canvas.height + reach
    ) {
      continue;
    }

    ctx.save();
    ctx.translate(obj.x * ppg, obj.y * ppg);
    ctx.rotate(obj.rotation);
    ctx.scale(obj.scaleX < 0 ? -1 : 1, obj.scaleY < 0 ? -1 : 1);
    ctx.globalAlpha = obj.opacity;

    if (drawShadows && obj.castShadow) {
      const off = Math.max(3, ppg * 0.09 * (obj.shadowOffset || 1));
      ctx.shadowColor = 'rgba(0, 0, 0, 0.52)';
      ctx.shadowBlur = Math.max(6, ppg * 0.14);
      ctx.shadowOffsetX = off;
      ctx.shadowOffsetY = off * 1.2;
    }

    let drawSource: CanvasImageSource | null = null;
    if (obj.propId.startsWith('custom:')) {
      const cid = obj.propId.slice('custom:'.length);
      const asset = customAssets.find((a) => a.id === cid);
      if (asset) {
        const img = getCustomImage(asset, onAssetLoaded);
        if (img.complete && img.naturalWidth > 0) {
          drawSource = img;
        }
      }
    } else {
      drawSource = getPropSprite(obj.propId);
    }

    if (drawSource) {
      if (obj.tint) {
        const tw = Math.max(8, Math.round(w));
        const th = Math.max(8, Math.round(h));
        const tc = getOffscreen(tintCanvas, tw, th);
        tintCanvas = tc;
        const tctx = tc.getContext('2d')!;
        tctx.clearRect(0, 0, tw, th);
        tctx.globalCompositeOperation = 'source-over';
        tctx.globalAlpha = 1;
        tctx.drawImage(drawSource, 0, 0, tw, th);
        tctx.globalCompositeOperation = 'source-atop';
        tctx.fillStyle = obj.tint;
        tctx.globalAlpha = 0.45;
        tctx.fillRect(0, 0, tw, th);
        ctx.drawImage(tc, -w / 2, -h / 2, w, h);
      } else {
        ctx.drawImage(drawSource, -w / 2, -h / 2, w, h);
      }
    }

    ctx.restore();
  }
}

function drawRoofs(
  ctx: CanvasRenderingContext2D,
  level: MapLevel,
  ppg: number,
  drawShadows: boolean
) {
  const texScale = ppg / 128;
  for (const roof of level.roofs) {
    if (roof.points.length < 3) continue;
    ctx.save();
    ctx.globalAlpha = roof.opacity;

    if (drawShadows) {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = ppg * 0.45;
      ctx.shadowOffsetX = ppg * 0.25;
      ctx.shadowOffsetY = ppg * 0.35;
      ctx.fillStyle = '#000';
      tracePolygon(ctx, roof.points, ppg);
      ctx.fill();
      ctx.restore();
    }

    tracePolygon(ctx, roof.points, ppg);
    ctx.clip();

    const pat = getTexturePattern(ctx, 'roof', roof.style, texScale);
    ctx.fillStyle = pat ?? '#3e5468';
    ctx.fill();

    // Pitched ridge highlight across bounding box center
    const xs = roof.points.map((p) => p.x * ppg);
    const ys = roof.points.map((p) => p.y * ppg);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const grad = ctx.createLinearGradient(minX, minY, maxX, maxY);
    grad.addColorStop(0, 'rgba(255,255,255,0.14)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.02)');
    grad.addColorStop(1, 'rgba(0,0,0,0.34)');
    ctx.fillStyle = grad;
    ctx.fillRect(minX, minY, maxX - minX, maxY - minY);

    // Ridge beam line
    ctx.strokeStyle = 'rgba(20,25,30,0.65)';
    ctx.lineWidth = Math.max(3, ppg * 0.08);
    ctx.beginPath();
    if (maxX - minX >= maxY - minY) {
      ctx.moveTo(minX, cy);
      ctx.lineTo(maxX, cy);
    } else {
      ctx.moveTo(cx, minY);
      ctx.lineTo(cx, maxY);
    }
    ctx.stroke();

    ctx.restore();

    // Roof eaves outline
    ctx.save();
    ctx.globalAlpha = roof.opacity;
    ctx.strokeStyle = '#181c22';
    ctx.lineWidth = 2.5;
    tracePolygon(ctx, roof.points, ppg);
    ctx.stroke();
    ctx.restore();
  }
}

function drawLighting(
  ctx: CanvasRenderingContext2D,
  doc: MapDocument,
  level: MapLevel,
  ppg: number,
  maxSize?: number
) {
  const objectLights = level.objects
    .filter((o) => o.light?.enabled)
    .map((o) => ({
      id: `obj_${o.id}`,
      x: o.x,
      y: o.y,
      color: o.light!.color,
      radius: o.light!.radius,
      intensity: o.light!.intensity,
      castShadows: o.light!.castShadows,
    }));

  const allLights = [...level.lights, ...objectLights];
  if (!doc.ambient.enabled && allLights.length === 0) return;

  const mapW = Math.max(1, Math.round(doc.width * ppg));
  const mapH = Math.max(1, Math.round(doc.height * ppg));
  const scale = maxSize ? Math.min(1, maxSize / Math.max(mapW, mapH)) : 1;
  lightCanvas = getOffscreen(
    lightCanvas,
    Math.max(1, Math.round(mapW * scale)),
    Math.max(1, Math.round(mapH * scale))
  );
  const lctx = lightCanvas.getContext('2d')!;
  lctx.setTransform(lightCanvas.width / mapW, 0, 0, lightCanvas.height / mapH, 0, 0);

  const ambRgb = hexToRgb(doc.ambient.color);
  // Ambient brightness: intensity 1 = bright daylight, 0 = dark night
  const ambIntensity = Math.max(0.05, Math.min(1, doc.ambient.intensity));
  const baseR = Math.round(ambRgb.r * ambIntensity);
  const baseG = Math.round(ambRgb.g * ambIntensity);
  const baseB = Math.round(ambRgb.b * ambIntensity);

  lctx.globalCompositeOperation = 'source-over';
  lctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
  lctx.fillRect(0, 0, mapW, mapH);

  const strictWalls = doc.ambient.strictWallBlocking ?? true;
  const occluders = getCachedOccluders(level);

  // Additive light accumulation onto lightmap
  lctx.globalCompositeOperation = 'lighter';

  const lightPolys: (Point[] | null)[] = [];

  for (const light of allLights) {
    const rgb = hexToRgb(light.color);
    const rPx = light.radius * ppg;
    const lx = light.x * ppg;
    const ly = light.y * ppg;

    let poly: Point[] | null = null;
    if ((strictWalls || light.castShadows) && occluders.length > 0) {
      poly = getCachedVisibilityPolygon(light, occluders);
    }
    lightPolys.push(poly);

    lctx.save();
    if (poly && poly.length >= 3) {
      tracePolygon(lctx, poly, ppg);
      lctx.clip();
    }

    const grad = lctx.createRadialGradient(lx, ly, rPx * 0.04, lx, ly, rPx);
    const peak = Math.min(1, 0.85 * light.intensity);
    const mid = Math.min(1, 0.42 * light.intensity);
    grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${peak})`);
    grad.addColorStop(0.45, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${mid})`);
    grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

    lctx.fillStyle = grad;
    lctx.beginPath();
    lctx.arc(lx, ly, rPx, 0, Math.PI * 2);
    lctx.fill();
    lctx.restore();
  }

  // Multiply lightmap over the scene for rich shadows & warm pools of light
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(lightCanvas, 0, 0, mapW, mapH);

  // Soft warm bloom pass on top for glowing torches/braziers (clipped to walls when strictWalls is on)
  ctx.globalCompositeOperation = 'screen';
  allLights.forEach((light, idx) => {
    const poly = lightPolys[idx];
    const rgb = hexToRgb(light.color);
    const rPx = light.radius * ppg * 0.55;
    const lx = light.x * ppg;
    const ly = light.y * ppg;
    ctx.save();
    if (strictWalls && poly && poly.length >= 3) {
      tracePolygon(ctx, poly, ppg);
      ctx.clip();
    }
    const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, rPx);
    grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(0.42, 0.25 * light.intensity)})`);
    grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx, ly, rPx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  doc: MapDocument,
  ppg: number
) {
  if (!doc.grid.visible) return;
  const mapW = doc.width * ppg;
  const mapH = doc.height * ppg;

  ctx.save();
  ctx.strokeStyle = doc.grid.color;
  ctx.globalAlpha = doc.grid.opacity;
  ctx.lineWidth = 1;

  if (doc.grid.type === 'square') {
    ctx.beginPath();
    for (let x = 0; x <= doc.width; x++) {
      const px = Math.round(x * ppg) + 0.5;
      ctx.moveTo(px, 0);
      ctx.lineTo(px, mapH);
    }
    for (let y = 0; y <= doc.height; y++) {
      const py = Math.round(y * ppg) + 0.5;
      ctx.moveTo(0, py);
      ctx.lineTo(mapW, py);
    }
    ctx.stroke();
  } else {
    // Pointy-top hex grid
    const r = ppg * 0.577;
    const hexW = Math.sqrt(3) * r;
    const hexH = 1.5 * r;
    ctx.beginPath();
    for (let row = 0; row * hexH <= mapH + r; row++) {
      for (let col = 0; col * hexW <= mapW + hexW; col++) {
        const cx = col * hexW + (row % 2 === 1 ? hexW / 2 : 0);
        const cy = row * hexH;
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 180) * (60 * i - 30);
          const vx = cx + r * Math.cos(a);
          const vy = cy + r * Math.sin(a);
          if (i === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
      }
    }
    ctx.stroke();
  }

  ctx.restore();
}

function drawSelectionAndHandles(
  ctx: CanvasRenderingContext2D,
  doc: MapDocument,
  level: MapLevel,
  ppg: number,
  selection: SelectionRef | null | undefined,
  selectedItems: SelectionRef[] | undefined,
  showLightHandles: boolean | undefined
) {
  const items =
    selectedItems && selectedItems.length > 0
      ? selectedItems
      : selection
        ? [selection]
        : [];
  const isSelected = (kind: SelectionRef['kind'], id: string) =>
    items.some((it) => it.kind === kind && it.id === id);

  if (showLightHandles) {
    for (const light of level.lights) {
      const isSel = isSelected('light', light.id);
      const lx = light.x * ppg;
      const ly = light.y * ppg;
      ctx.save();
      if (isSel) {
        ctx.strokeStyle = 'rgba(232, 159, 75, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(lx, ly, light.radius * ppg, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.fillStyle = light.color;
      ctx.strokeStyle = isSel ? '#ffffff' : '#181a20';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(lx, ly, isSel ? 8 : 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  for (const sel of items) {
    ctx.save();
    ctx.strokeStyle = '#f0a848';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);

    if (sel.kind === 'object') {
      const obj = level.objects.find((o) => o.id === sel.id);
      if (obj) {
        const def = getPropDefinition(obj.propId, doc.customAssets);
        const w = (def?.widthTiles ?? 1) * ppg * Math.abs(obj.scaleX);
        const h = (def?.heightTiles ?? 1) * ppg * Math.abs(obj.scaleY);
        ctx.translate(obj.x * ppg, obj.y * ppg);
        ctx.rotate(obj.rotation);
        ctx.strokeRect(-w / 2 - 3, -h / 2 - 3, w + 6, h + 6);
        if (items.length === 1) {
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(0, -h / 2 - 3);
          ctx.lineTo(0, -h / 2 - 18);
          ctx.stroke();
          ctx.fillStyle = '#f0a848';
          ctx.beginPath();
          ctx.arc(0, -h / 2 - 18, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (sel.kind === 'portal') {
      const p = level.portals.find((it) => it.id === sel.id);
      if (p) {
        ctx.translate(p.x * ppg, p.y * ppg);
        ctx.rotate(p.angle);
        ctx.strokeRect((-p.width * ppg) / 2 - 4, -ppg * 0.25, p.width * ppg + 8, ppg * 0.5);
      }
    } else if (sel.kind === 'room') {
      const r = level.rooms.find((it) => it.id === sel.id);
      if (r) {
        tracePolygon(ctx, r.points, ppg);
        ctx.stroke();
      }
    } else if (sel.kind === 'wall') {
      const w = level.walls.find((it) => it.id === sel.id);
      if (w) {
        tracePolyline(ctx, w.points, ppg, false, w.closed);
        ctx.stroke();
      }
    } else if (sel.kind === 'path') {
      const p = level.paths.find((it) => it.id === sel.id);
      if (p) {
        tracePolyline(ctx, samplePath(p), ppg);
        ctx.stroke();
        if (!p.smooth && items.length === 1) {
          ctx.setLineDash([]);
          ctx.fillStyle = '#f0a848';
          ctx.strokeStyle = '#ffffff';
          for (const h of bendHandles(p)) {
            ctx.beginPath();
            ctx.arc(h.x * ppg, h.y * ppg, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }
      }
    } else if (sel.kind === 'roof') {
      const r = level.roofs.find((it) => it.id === sel.id);
      if (r) {
        tracePolygon(ctx, r.points, ppg);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

export function renderMapScene(
  ctx: CanvasRenderingContext2D,
  doc: MapDocument,
  options: RenderOptions
) {
  const level =
    doc.levels.find((l) => l.id === doc.activeLevelId) ?? doc.levels[0];
  if (!level) return;

  const { ppg } = options;
  const mapW = doc.width * ppg;
  const mapH = doc.height * ppg;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, mapW, mapH);
  ctx.clip();

  // 1 & 2. Cached Terrain + Water layer (blits in <1ms when not actively painting).
  // With a size cap the bitmap stops growing with the zoom, so it is rebuilt far less often.
  const limit = options.maxLayerSize;
  const layerPpg = limit ? Math.min(ppg, limit / Math.max(doc.width, doc.height)) : ppg;
  const cacheW = Math.max(1, Math.round(doc.width * layerPpg));
  const cacheH = Math.max(1, Math.round(doc.height * layerPpg));
  const waterPreview = options.previewWaterStroke ?? null;

  if (limit || (!waterPreview && cacheW <= 4096 && cacheH <= 4096)) {
    const cacheValid =
      !waterPreview &&
      terrainCacheCanvas &&
      terrainCacheState &&
      terrainCacheState.levelId === level.id &&
      terrainCacheState.width === doc.width &&
      terrainCacheState.height === doc.height &&
      Math.abs(terrainCacheState.ppg - layerPpg) < 0.001 &&
      terrainCacheState.terrainBase === level.terrainBase &&
      terrainCacheState.terrainStrokes === level.terrainStrokes &&
      terrainCacheState.waterStrokes === level.waterStrokes &&
      terrainCacheState.showTerrain === doc.layers.terrain &&
      terrainCacheState.showWater === doc.layers.water;

    if (!cacheValid) {
      const tc = getOffscreen(terrainCacheCanvas, cacheW, cacheH);
      terrainCacheCanvas = tc;
      const tctx = tc.getContext('2d')!;
      tctx.clearRect(0, 0, cacheW, cacheH);
      if (doc.layers.terrain) {
        drawTerrain(tctx, doc, level, layerPpg, null);
      } else {
        tctx.fillStyle = '#1d2027';
        tctx.fillRect(0, 0, cacheW, cacheH);
      }
      if (doc.layers.water) {
        drawWater(tctx, doc, level, layerPpg, waterPreview);
      }
      // A bitmap holding a half-painted stroke is never reused.
      terrainCacheState = waterPreview
        ? null
        : {
            levelId: level.id,
            width: doc.width,
            height: doc.height,
            ppg: layerPpg,
            terrainBase: level.terrainBase,
            terrainStrokes: level.terrainStrokes,
            waterStrokes: level.waterStrokes,
            showTerrain: doc.layers.terrain,
            showWater: doc.layers.water,
          };
    }

    if (terrainCacheCanvas) {
      ctx.drawImage(terrainCacheCanvas, 0, 0, mapW, mapH);
    }
    if (options.previewTerrainStroke && doc.layers.terrain) {
      drawTerrainStrokeFeathered(
        ctx,
        options.previewTerrainStroke,
        mapW,
        mapH,
        ppg,
        ppg / 128
      );
    }
  } else {
    if (doc.layers.terrain) {
      drawTerrain(ctx, doc, level, ppg, options.previewTerrainStroke);
    } else {
      ctx.fillStyle = '#1d2027';
      ctx.fillRect(0, 0, mapW, mapH);
    }
    if (doc.layers.water) {
      drawWater(ctx, doc, level, ppg, waterPreview);
    }
  }

  // 3. Objects below floor
  if (doc.layers.objects) {
    drawObjectsLayer(
      ctx,
      level.objects,
      'below_floor',
      ppg,
      doc.layers.shadows,
      doc.customAssets,
      options.onAssetLoaded
    );
  }

  // 4. Room Floors
  if (doc.layers.floors) {
    drawRoomFloors(ctx, level.rooms, ppg);
  }

  // 5. Paths
  if (doc.layers.paths) {
    drawPaths(ctx, level.paths, ppg);
  }

  // 6. Objects above floor (rugs first, then furniture/props)
  if (doc.layers.objects) {
    const rugs = level.objects.filter(
      (o) => o.layer === 'above_floor' && o.propId.startsWith('rug_')
    );
    const props = level.objects.filter(
      (o) => o.layer === 'above_floor' && !o.propId.startsWith('rug_')
    );
    drawObjectsLayer(ctx, rugs, 'above_floor', ppg, false, doc.customAssets, options.onAssetLoaded);
    drawObjectsLayer(
      ctx,
      props,
      'above_floor',
      ppg,
      doc.layers.shadows,
      doc.customAssets,
      options.onAssetLoaded
    );
  }

  // 7. Walls (from rooms + freeform walls)
  if (doc.layers.walls) {
    for (const room of level.rooms) {
      if (!room.wallStyle || room.points.length < 3) continue;
      drawWallStroke(
        ctx,
        room.points,
        true,
        room.wallStyle,
        room.wallThickness,
        ppg,
        doc.layers.shadows && room.castShadows
      );
    }
    for (const wall of level.walls) {
      drawWallStroke(
        ctx,
        wall.points,
        wall.closed,
        wall.style,
        wall.thickness,
        ppg,
        doc.layers.shadows && wall.castShadows
      );
    }
  }

  // 8. Portals (doors & windows)
  if (doc.layers.portals) {
    drawPortals(ctx, level.portals, ppg);
  }

  // 9. Objects above walls (trees, canopies, torches)
  if (doc.layers.objects) {
    drawObjectsLayer(
      ctx,
      level.objects,
      'above_walls',
      ppg,
      doc.layers.shadows,
      doc.customAssets,
      options.onAssetLoaded
    );
  }

  // 10. Roofs & Roof objects
  if (doc.layers.roofs) {
    drawRoofs(ctx, level, ppg, doc.layers.shadows);
    if (doc.layers.objects) {
      drawObjectsLayer(
        ctx,
        level.objects,
        'roof',
        ppg,
        doc.layers.shadows,
        doc.customAssets,
        options.onAssetLoaded
      );
    }
  }

  // 11. Dynamic Lighting & Ambient Shadows
  if ((options.showLighting ?? true) && doc.layers.lighting) {
    drawLighting(ctx, doc, level, ppg, limit && limit / 2);
  }

  // 12. Grid
  if ((options.showGrid ?? true) && doc.layers.grid) {
    drawGrid(ctx, doc, ppg);
  }

  // 13. Selection & Light Handles (editor only)
  if (options.overlay !== false) drawEditorOverlay(ctx, doc, options);

  ctx.restore();
}

export function drawEditorOverlay(
  ctx: CanvasRenderingContext2D,
  doc: MapDocument,
  options: RenderOptions
) {
  const level =
    doc.levels.find((l) => l.id === doc.activeLevelId) ?? doc.levels[0];
  if (!level) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, doc.width * options.ppg, doc.height * options.ppg);
  ctx.clip();
  drawSelectionAndHandles(
    ctx,
    doc,
    level,
    options.ppg,
    options.selection,
    options.selectedItems,
    options.showLightHandles
  );
  ctx.restore();
}
