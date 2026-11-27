import type { LightSource, MapLevel, Point, PortalItem } from '../types/map';

export interface Segment {
  ax: number;
  ay: number;
  bx: number;
  by: number;
}

/**
 * Extracts all shadow-casting wall segments from rooms and freeform walls,
 * splitting segments around portals that do not block light (windows, archways, open doors).
 */
export function extractOccluderSegments(level: MapLevel): Segment[] {
  const raw: Segment[] = [];

  for (const room of level.rooms) {
    if (!room.wallStyle || !room.castShadows || room.points.length < 3) continue;
    for (let i = 0; i < room.points.length; i++) {
      const a = room.points[i];
      const b = room.points[(i + 1) % room.points.length];
      if (Math.hypot(b.x - a.x, b.y - a.y) > 0.01) {
        raw.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y });
      }
    }
  }

  for (const wall of level.walls) {
    if (!wall.castShadows || wall.points.length < 2) continue;
    const count = wall.closed ? wall.points.length : wall.points.length - 1;
    for (let i = 0; i < count; i++) {
      const a = wall.points[i];
      const b = wall.points[(i + 1) % wall.points.length];
      if (Math.hypot(b.x - a.x, b.y - a.y) > 0.01) {
        raw.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y });
      }
    }
  }

  // Filter portals that pass light
  const openings = level.portals.filter(
    (p) => !p.blocksLight || p.open || (p.openAngle ?? 0) > 5
  );
  if (openings.length === 0) return raw;

  let segments = raw;
  for (const portal of openings) {
    segments = splitSegmentsByPortal(segments, portal);
  }
  return segments;
}

function splitSegmentsByPortal(segments: Segment[], portal: PortalItem): Segment[] {
  const result: Segment[] = [];
  const halfW = portal.width * 0.5;

  for (const seg of segments) {
    const dx = seg.bx - seg.ax;
    const dy = seg.by - seg.ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq < 1e-6) continue;
    const len = Math.sqrt(lenSq);

    // Project portal center onto segment
    const t = ((portal.x - seg.ax) * dx + (portal.y - seg.ay) * dy) / lenSq;
    if (t < -0.1 || t > 1.1) {
      result.push(seg);
      continue;
    }

    const px = seg.ax + t * dx;
    const py = seg.ay + t * dy;
    const dist = Math.hypot(portal.x - px, portal.y - py);
    if (dist > 0.42) {
      result.push(seg);
      continue;
    }

    const dt = halfW / len;
    const t0 = Math.max(0, t - dt);
    const t1 = Math.min(1, t + dt);

    if (t0 > 0.01) {
      result.push({
        ax: seg.ax,
        ay: seg.ay,
        bx: seg.ax + t0 * dx,
        by: seg.ay + t0 * dy,
      });
    }
    if (t1 < 0.99) {
      result.push({
        ax: seg.ax + t1 * dx,
        ay: seg.ay + t1 * dy,
        bx: seg.bx,
        by: seg.by,
      });
    }
  }
  return result;
}

function raySegmentIntersect(
  ox: number,
  oy: number,
  rdx: number,
  rdy: number,
  seg: Segment
): number | null {
  const sdx = seg.bx - seg.ax;
  const sdy = seg.by - seg.ay;
  const denom = rdx * sdy - rdy * sdx;
  if (Math.abs(denom) < 1e-9) return null;

  const qpx = seg.ax - ox;
  const qpy = seg.ay - oy;
  const t = (qpx * sdy - qpy * sdx) / denom;
  const u = (qpx * rdy - qpy * rdx) / denom;

  if (t >= 0 && u >= -1e-6 && u <= 1 + 1e-6) {
    return t;
  }
  return null;
}

/**
 * Computes a 2D visibility polygon in grid coordinates for a point light
 * bounded by a bounding box of its radius and occluded by wall segments.
 */
export function computeVisibilityPolygon(
  light: LightSource,
  segments: Segment[]
): Point[] {
  const r = light.radius;
  const ox = light.x;
  const oy = light.y;

  // Clip box around light radius
  const pad = r + 0.5;
  const boxSegments: Segment[] = [
    { ax: ox - pad, ay: oy - pad, bx: ox + pad, by: oy - pad },
    { ax: ox + pad, ay: oy - pad, bx: ox + pad, by: oy + pad },
    { ax: ox + pad, ay: oy + pad, bx: ox - pad, by: oy + pad },
    { ax: ox - pad, ay: oy + pad, bx: ox - pad, by: oy - pad },
  ];

  // Filter nearby segments
  const active: Segment[] = [...boxSegments];
  const minX = ox - pad;
  const maxX = ox + pad;
  const minY = oy - pad;
  const maxY = oy + pad;

  for (const s of segments) {
    if (
      Math.max(s.ax, s.bx) < minX ||
      Math.min(s.ax, s.bx) > maxX ||
      Math.max(s.ay, s.by) < minY ||
      Math.min(s.ay, s.by) > maxY
    ) {
      continue;
    }
    active.push(s);
  }

  // Collect & deduplicate ray angles towards segment endpoints
  const rawAngles: number[] = [];
  const eps = 0.0004;
  for (const s of active) {
    const a1 = Math.atan2(s.ay - oy, s.ax - ox);
    const a2 = Math.atan2(s.by - oy, s.bx - ox);
    rawAngles.push(a1 - eps, a1, a1 + eps, a2 - eps, a2, a2 + eps);
  }
  rawAngles.sort((a, b) => a - b);

  const angles: number[] = [];
  for (const a of rawAngles) {
    if (angles.length === 0 || a - angles[angles.length - 1] > 1e-5) {
      angles.push(a);
    }
  }

  const hits: Point[] = [];
  for (const angle of angles) {
    const rdx = Math.cos(angle);
    const rdy = Math.sin(angle);
    let closest = pad * 1.5;

    for (const s of active) {
      const t = raySegmentIntersect(ox, oy, rdx, rdy, s);
      if (t !== null && t < closest) {
        closest = t;
      }
    }
    hits.push({
      x: ox + rdx * closest,
      y: oy + rdy * closest,
    });
  }

  return hits;
}

// Per-level occluder & visibility polygon caches to avoid redundant raycasting
let cachedOccluderKey: {
  rooms: MapLevel['rooms'];
  walls: MapLevel['walls'];
  portals: MapLevel['portals'];
  segments: Segment[];
} | null = null;

const polyCache = new Map<
  string,
  { x: number; y: number; radius: number; poly: Point[] }
>();

export function getCachedOccluders(level: MapLevel): Segment[] {
  if (
    cachedOccluderKey &&
    cachedOccluderKey.rooms === level.rooms &&
    cachedOccluderKey.walls === level.walls &&
    cachedOccluderKey.portals === level.portals
  ) {
    return cachedOccluderKey.segments;
  }
  const segments = extractOccluderSegments(level);
  cachedOccluderKey = {
    rooms: level.rooms,
    walls: level.walls,
    portals: level.portals,
    segments,
  };
  polyCache.clear();
  return segments;
}

export function getCachedVisibilityPolygon(
  light: LightSource,
  occluders: Segment[]
): Point[] {
  const prev = polyCache.get(light.id);
  if (
    prev &&
    prev.x === light.x &&
    prev.y === light.y &&
    prev.radius === light.radius
  ) {
    return prev.poly;
  }
  const poly = computeVisibilityPolygon(light, occluders);
  polyCache.set(light.id, {
    x: light.x,
    y: light.y,
    radius: light.radius,
    poly,
  });
  return poly;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return { r: 255, g: 200, b: 120 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}
