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
  computeVisibilityPolygon,
  extractOccluderSegments,
  hexToRgb,
} from './lighting';
import {
  getCustomImage,
  getPropDefinition,
  getPropSprite,
} from './props';
import { getTexturePattern, getWallColors } from './textures';

export interface RenderOptions {
  ppg: number; // pixels per grid tile
  showGrid?: boolean;
  showLighting?: boolean;
  selection?: SelectionRef | null;
  showLightHandles?: boolean;
  previewTerrainStroke?: TerrainStroke | null;
  previewWaterStroke?: WaterStroke | null;
  onAssetLoaded?: () => void;
}

// Reusable offscreen canvases for lighting, terrain feathering & water compositing
let lightCanvas: HTMLCanvasElement | null = null;
let waterCanvas: HTMLCanvasElement | null = null;
let strokeMaskCanvas: HTMLCanvasElement | null = null;
let tintCanvas: HTMLCanvasElement | null = null;

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

  const stampDab = (wx: number, wy: number) => {
    const lx = wx - bx;
    const ly = wy - by;
    if (shape === 'circle') {
      const grad = mctx.createRadialGradient(lx, ly, r * innerFrac, lx, ly, r);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      mctx.fillStyle = grad;
      mctx.beginPath();
      mctx.arc(lx, ly, r, 0, Math.PI * 2);
      mctx.fill();
    } else {
      mctx.save();
      mctx.fillStyle = '#ffffff';
      if (stroke.softness > 0.05) {
        mctx.shadowColor = '#ffffff';
        mctx.shadowBlur = r * stroke.softness * 0.55;
        traceBrushShape(mctx, lx, ly, r * innerFrac, shape, angleDeg, rectRatio);
      } else {
        traceBrushShape(mctx, lx, ly, r, shape, angleDeg, rectRatio);
      }
      mctx.fill();
      mctx.restore();
    }
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
    colorFn: (s: WaterStroke) => string
  ) => {
    wctx.clearRect(0, 0, mapW, mapH);
    for (const s of allStrokes) {
      if (s.points.length === 0) continue;
      const rPx = Math.max(2, radiusFn(s.radius * ppg));
      wctx.save();
      wctx.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over';
      wctx.lineCap = 'round';
      wctx.lineJoin = 'round';
      const col = s.erase ? '#000' : colorFn(s);
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
    ctx.drawImage(wc, 0, 0);
  };

  // Unified multi-pass water so overlapping strokes merge seamlessly
  renderWaterPass((r) => r + ppg * 0.18, () => 'rgba(26, 50, 56, 0.55)');
  renderWaterPass((r) => r + ppg * 0.06, (s) => s.shallowColor);
  renderWaterPass((r) => r * 0.94, () => 'rgba(218, 246, 252, 0.26)');
  renderWaterPass((r) => r * 0.72, (s) => s.deepColor);
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
  for (const path of paths) {
    if (path.points.length < 2) continue;
    const w = path.width * ppg;
    ctx.save();
    ctx.lineCap = path.fadeEnds ? 'round' : 'butt';
    ctx.lineJoin = 'round';

    if (path.style === 'dirt_road') {
      ctx.strokeStyle = 'rgba(138, 118, 86, 0.5)';
      ctx.lineWidth = w * 1.25;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
      ctx.strokeStyle = '#9e8863';
      ctx.lineWidth = w;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
    } else if (path.style === 'cobble_path') {
      const pat = getTexturePattern(ctx, 'terrain', 'cobblestone', ppg / 140);
      ctx.strokeStyle = 'rgba(30,28,25,0.55)';
      ctx.lineWidth = w + 4;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
      ctx.strokeStyle = pat ?? '#78746e';
      ctx.lineWidth = w;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
    } else if (path.style === 'wood_bridge') {
      ctx.strokeStyle = '#332011';
      ctx.lineWidth = w + 6;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
      const pat = getTexturePattern(ctx, 'floor', 'wood_planks', ppg / 128);
      ctx.strokeStyle = pat ?? '#8a623f';
      ctx.lineWidth = w;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
    } else if (path.style === 'carpet_teal' || path.style === 'carpet_crimson') {
      const main = path.style === 'carpet_teal' ? '#367d77' : '#852d33';
      ctx.strokeStyle = main;
      ctx.lineWidth = w;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
      ctx.strokeStyle = '#d4b36a';
      ctx.lineWidth = Math.max(2, w * 0.1);
      ctx.setLineDash([8, 4]);
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
    } else if (path.style === 'hedge') {
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = w + 6;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
      ctx.strokeStyle = '#2d5232';
      ctx.lineWidth = w;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
      ctx.strokeStyle = '#487a49';
      ctx.lineWidth = w * 0.6;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
    } else if (path.style === 'rail_tracks') {
      ctx.strokeStyle = '#5c3c20';
      ctx.lineWidth = w;
      ctx.setLineDash([4, 8]);
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = Math.max(2, w * 0.25);
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
    } else if (path.style === 'rope_bridge') {
      ctx.strokeStyle = '#7c532f';
      ctx.lineWidth = w;
      ctx.setLineDash([8, 3]);
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (path.style === 'stream_brook') {
      ctx.strokeStyle = '#1e5b70';
      ctx.lineWidth = w * 1.15;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
      ctx.strokeStyle = '#45a8c4';
      ctx.lineWidth = w * 0.78;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
    } else if (path.style === 'lava_stream') {
      ctx.strokeStyle = '#4a180d';
      ctx.lineWidth = w * 1.25;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = w * 0.85;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = w * 0.35;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
    } else if (path.style === 'stone_wall_low') {
      ctx.strokeStyle = '#292724';
      ctx.lineWidth = w + 3;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
      ctx.strokeStyle = '#7d776e';
      ctx.lineWidth = w;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
    } else {
      // cliff_edge
      ctx.strokeStyle = '#2d2925';
      ctx.lineWidth = w;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
      ctx.strokeStyle = '#70685e';
      ctx.lineWidth = w * 0.55;
      tracePolyline(ctx, path.points, ppg, path.smooth);
      ctx.stroke();
    }

    ctx.restore();
  }
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

      if (p.open) {
        // Swung open door leaf
        ctx.save();
        ctx.translate(-w / 2 + 2, 0);
        ctx.rotate(-Math.PI * 0.42);
        ctx.fillStyle = color;
        ctx.strokeStyle = trim;
        ctx.lineWidth = 2;
        ctx.fillRect(0, -h * 0.25, w * 0.88, h * 0.5);
        ctx.strokeRect(0, -h * 0.25, w * 0.88, h * 0.5);
        ctx.restore();
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

function drawObjectsLayer(
  ctx: CanvasRenderingContext2D,
  objects: MapObject[],
  layer: MapObject['layer'],
  ppg: number,
  drawShadows: boolean,
  customAssets: CustomAsset[],
  onAssetLoaded?: () => void
) {
  for (const obj of objects) {
    if (obj.layer !== layer) continue;
    const def = getPropDefinition(obj.propId, customAssets);
    if (!def) continue;

    const w = def.widthTiles * ppg * Math.abs(obj.scaleX);
    const h = def.heightTiles * ppg * Math.abs(obj.scaleY);

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
  ppg: number
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
  lightCanvas = getOffscreen(lightCanvas, mapW, mapH);
  const lctx = lightCanvas.getContext('2d')!;

  const ambRgb = hexToRgb(doc.ambient.color);
  // Ambient brightness: intensity 1 = bright daylight, 0 = dark night
  const ambIntensity = Math.max(0.05, Math.min(1, doc.ambient.intensity));
  const baseR = Math.round(ambRgb.r * ambIntensity);
  const baseG = Math.round(ambRgb.g * ambIntensity);
  const baseB = Math.round(ambRgb.b * ambIntensity);

  lctx.globalCompositeOperation = 'source-over';
  lctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
  lctx.fillRect(0, 0, mapW, mapH);

  const occluders = extractOccluderSegments(level);

  // Additive light accumulation onto lightmap
  lctx.globalCompositeOperation = 'lighter';

  for (const light of allLights) {
    const rgb = hexToRgb(light.color);
    const rPx = light.radius * ppg;
    const lx = light.x * ppg;
    const ly = light.y * ppg;

    lctx.save();
    if (light.castShadows && occluders.length > 0) {
      const poly = computeVisibilityPolygon(light, occluders);
      if (poly.length >= 3) {
        tracePolygon(lctx, poly, ppg);
        lctx.clip();
      }
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
  ctx.drawImage(lightCanvas, 0, 0);

  // Soft warm bloom pass on top for glowing torches/braziers
  ctx.globalCompositeOperation = 'screen';
  for (const light of allLights) {
    const rgb = hexToRgb(light.color);
    const rPx = light.radius * ppg * 0.55;
    const lx = light.x * ppg;
    const ly = light.y * ppg;
    const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, rPx);
    grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(0.42, 0.25 * light.intensity)})`);
    grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx, ly, rPx, 0, Math.PI * 2);
    ctx.fill();
  }
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
  showLightHandles: boolean | undefined
) {
  if (showLightHandles) {
    for (const light of level.lights) {
      const isSel = selection?.kind === 'light' && selection.id === light.id;
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

  if (!selection) return;
  ctx.save();
  ctx.strokeStyle = '#f0a848';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 4]);

  if (selection.kind === 'object') {
    const obj = level.objects.find((o) => o.id === selection.id);
    if (obj) {
      const def = getPropDefinition(obj.propId, doc.customAssets);
      const w = (def?.widthTiles ?? 1) * ppg * Math.abs(obj.scaleX);
      const h = (def?.heightTiles ?? 1) * ppg * Math.abs(obj.scaleY);
      ctx.translate(obj.x * ppg, obj.y * ppg);
      ctx.rotate(obj.rotation);
      ctx.strokeRect(-w / 2 - 3, -h / 2 - 3, w + 6, h + 6);
      // Rotation handle
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
  } else if (selection.kind === 'portal') {
    const p = level.portals.find((it) => it.id === selection.id);
    if (p) {
      ctx.translate(p.x * ppg, p.y * ppg);
      ctx.rotate(p.angle);
      ctx.strokeRect((-p.width * ppg) / 2 - 4, -ppg * 0.25, p.width * ppg + 8, ppg * 0.5);
    }
  } else if (selection.kind === 'room') {
    const r = level.rooms.find((it) => it.id === selection.id);
    if (r) {
      tracePolygon(ctx, r.points, ppg);
      ctx.stroke();
    }
  } else if (selection.kind === 'wall') {
    const w = level.walls.find((it) => it.id === selection.id);
    if (w) {
      tracePolyline(ctx, w.points, ppg, false, w.closed);
      ctx.stroke();
    }
  } else if (selection.kind === 'path') {
    const p = level.paths.find((it) => it.id === selection.id);
    if (p) {
      tracePolyline(ctx, p.points, ppg, p.smooth, false);
      ctx.stroke();
    }
  } else if (selection.kind === 'roof') {
    const r = level.roofs.find((it) => it.id === selection.id);
    if (r) {
      tracePolygon(ctx, r.points, ppg);
      ctx.stroke();
    }
  }

  ctx.restore();
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

  // 1. Terrain
  if (doc.layers.terrain) {
    drawTerrain(ctx, doc, level, ppg, options.previewTerrainStroke);
  } else {
    ctx.fillStyle = '#1d2027';
    ctx.fillRect(0, 0, mapW, mapH);
  }

  // 2. Water
  if (doc.layers.water) {
    drawWater(ctx, doc, level, ppg, options.previewWaterStroke);
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
    drawLighting(ctx, doc, level, ppg);
  }

  // 12. Grid
  if ((options.showGrid ?? true) && doc.layers.grid) {
    drawGrid(ctx, doc, ppg);
  }

  // 13. Selection & Light Handles (editor only)
  drawSelectionAndHandles(
    ctx,
    doc,
    level,
    ppg,
    options.selection,
    options.showLightHandles
  );

  ctx.restore();
}
