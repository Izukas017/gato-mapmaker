import type { PathItem, Point } from '../types/map';

const STEPS = 24;

const mid = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

function cubic(a: Point, b: Point, c: Point, d: Point): Point[] {
  return Array.from({ length: STEPS + 1 }, (_, k) => {
    const t = k / STEPS;
    const u = 1 - t;
    const wa = u * u * u;
    const wb = 3 * u * u * t;
    const wc = 3 * u * t * t;
    const wd = t * t * t;
    return {
      x: wa * a.x + wb * b.x + wc * c.x + wd * d.x,
      y: wa * a.y + wb * b.y + wc * c.y + wd * d.y,
    };
  });
}

function quadratic(a: Point, c: Point, b: Point): Point[] {
  const toward = (p: Point): Point => ({
    x: p.x + ((c.x - p.x) * 2) / 3,
    y: p.y + ((c.y - p.y) * 2) / 3,
  });
  return cubic(a, toward(a), toward(b), b);
}

// The path's real geometry as dense polyline pieces: drawing, picking and posts all use it.
export function pathSegments(path: PathItem): Point[][] {
  const pts = path.points;
  if (pts.length < 2) return [];

  if (!path.smooth) {
    return pts.slice(1).map((b, i) => {
      const a = pts[i];
      const bend = path.bends?.[i];
      if (!bend) return [a, b];
      const m = mid(a, b);
      // Doubling the offset makes the curve pass exactly through the dragged handle.
      return quadratic(a, { x: m.x + bend.x * 2, y: m.y + bend.y * 2 }, b);
    });
  }

  const k = path.curvature;
  if (k === undefined) {
    // Original smoothing, kept so that maps saved without a curvature look the same.
    if (pts.length === 2) return [[pts[0], pts[1]]];
    const out: Point[][] = [];
    let start = pts[0];
    for (let i = 1; i < pts.length - 1; i++) {
      const end = mid(pts[i], pts[i + 1]);
      out.push(quadratic(start, pts[i], end));
      start = end;
    }
    out.push([start, pts[pts.length - 1]]);
    return out;
  }

  // Cardinal spline through every point; curvature scales the tangents (0 = straight).
  return pts.slice(1).map((b, i) => {
    const a = pts[i];
    const before = pts[i - 1] ?? a;
    const after = pts[i + 2] ?? b;
    return cubic(
      a,
      { x: a.x + ((b.x - before.x) * k) / 6, y: a.y + ((b.y - before.y) * k) / 6 },
      { x: b.x - ((after.x - a.x) * k) / 6, y: b.y - ((after.y - a.y) * k) / 6 },
      b
    );
  });
}

export function samplePath(path: PathItem): Point[] {
  return pathSegments(path).flatMap((seg, i) => (i === 0 ? seg : seg.slice(1)));
}

// Drag handles that bend each segment (used when smoothing is off).
export function bendHandles(path: PathItem): Point[] {
  return path.points.slice(1).map((b, i) => {
    const m = mid(path.points[i], b);
    const bend = path.bends?.[i];
    return bend ? { x: m.x + bend.x, y: m.y + bend.y } : m;
  });
}

export function bendsWithHandle(path: PathItem, index: number, to: Point): (Point | null)[] {
  const m = mid(path.points[index], path.points[index + 1]);
  return path.points
    .slice(1)
    .map((_, i) =>
      i === index ? { x: to.x - m.x, y: to.y - m.y } : (path.bends?.[i] ?? null)
    );
}

// True when any segment of the polyline crosses or lies inside the box (Liang-Barsky clipping).
export function polylineTouchesRect(
  points: Point[],
  closed: boolean,
  min: Point,
  max: Point
): boolean {
  const segments = closed ? points.length : points.length - 1;
  for (let i = 0; i < segments; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    let from = 0;
    let to = 1;
    const inside = [
      [-dx, a.x - min.x],
      [dx, max.x - a.x],
      [-dy, a.y - min.y],
      [dy, max.y - a.y],
    ].every(([p, q]) => {
      if (p === 0) return q >= 0;
      if (p < 0) from = Math.max(from, q / p);
      else to = Math.min(to, q / p);
      return from <= to;
    });
    if (inside) return true;
  }
  return false;
}

function normal(a: Point, b: Point): Point {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: (a.y - b.y) / len, y: (b.x - a.x) / len };
}

// A line running parallel to the polyline, `distance` to one side (mitred at corners).
export function offsetLine(line: Point[], distance: number): Point[] {
  return line.map((p, i) => {
    const before = i > 0 ? normal(line[i - 1], p) : normal(p, line[i + 1]);
    const after = i < line.length - 1 ? normal(p, line[i + 1]) : before;
    // The clamp keeps hairpin corners from shooting the mitre far away.
    const scale = distance / Math.max(0.5, 1 + before.x * after.x + before.y * after.y);
    return { x: p.x + (before.x + after.x) * scale, y: p.y + (before.y + after.y) * scale };
  });
}

// Points evenly spaced along the polyline, each with the unit normal of the line there.
export function spacedAlong(line: Point[], spacing: number): { at: Point; normal: Point }[] {
  const out: { at: Point; normal: Point }[] = [];
  let next = spacing / 2;
  let walked = 0;
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1];
    const b = line[i];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    while (len > 0 && next <= walked + len) {
      const t = (next - walked) / len;
      out.push({
        at: { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t },
        normal: normal(a, b),
      });
      next += spacing;
    }
    walked += len;
  }
  return out;
}
