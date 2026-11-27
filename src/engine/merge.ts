import type {
  MapLevel,
  PathItem,
  Point,
  RoofShape,
  RoomShape,
  SelectionRef,
  WallPolyline,
} from '../types/map';

type Kind = SelectionRef['kind'];

const LIST = {
  object: 'objects',
  light: 'lights',
  portal: 'portals',
  room: 'rooms',
  wall: 'walls',
  path: 'paths',
  roof: 'roofs',
} as const;

interface Item {
  id: string;
  groupId?: string;
}
type Bag = Record<string, unknown>;

const itemsOf = (level: MapLevel, kind: Kind) => level[LIST[kind]] as Item[];
const find = (level: MapLevel, ref: SelectionRef) =>
  itemsOf(level, ref.kind).find((it) => it.id === ref.id);

// A grouped element always drags its whole group into the selection.
export function expandGroups(level: MapLevel, refs: SelectionRef[]): SelectionRef[] {
  const groups = new Set(refs.map((r) => find(level, r)?.groupId).filter(Boolean));
  if (groups.size === 0) return refs;
  const out = [...refs];
  for (const kind of Object.keys(LIST) as Kind[]) {
    for (const it of itemsOf(level, kind)) {
      if (!it.groupId || !groups.has(it.groupId)) continue;
      if (!out.some((r) => r.kind === kind && r.id === it.id)) out.push({ kind, id: it.id });
    }
  }
  return out;
}

// ---------- Polygon union (rooms, roofs) ----------

const EPS = 1e-6;
const same = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y) < 1e-4;
const cross = (o: Point, a: Point, b: Point) =>
  (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

function area(poly: Point[]): number {
  return poly.reduce((sum, p, i) => {
    const q = poly[(i + 1) % poly.length];
    return sum + (p.x * q.y - q.x * p.y) / 2;
  }, 0);
}

function onSegment(p: Point, a: Point, b: Point): boolean {
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  if (len < EPS || Math.abs(cross(a, b, p)) / len > 1e-4) return false;
  return (p.x - a.x) * (p.x - b.x) + (p.y - a.y) * (p.y - b.y) <= 1e-6;
}

function inside(p: Point, poly: Point[]): boolean {
  let odd = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) {
      odd = !odd;
    }
  }
  return odd;
}

// Edges of `poly` cut wherever they meet `other`, keeping only the pieces on the union's border.
function borderPieces(poly: Point[], other: Point[], keepShared: boolean): [Point, Point][] {
  const out: [Point, Point][] = [];
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length];
    const d = { x: b.x - a.x, y: b.y - a.y };
    const lenSq = d.x * d.x + d.y * d.y;
    if (lenSq < EPS) return;
    const cuts = [0, 1];
    other.forEach((c, j) => {
      const e = other[(j + 1) % other.length];
      if (onSegment(c, a, b)) cuts.push(((c.x - a.x) * d.x + (c.y - a.y) * d.y) / lenSq);
      const f = { x: e.x - c.x, y: e.y - c.y };
      const den = d.x * f.y - d.y * f.x;
      if (Math.abs(den) < EPS) return;
      const t = ((c.x - a.x) * f.y - (c.y - a.y) * f.x) / den;
      const u = ((c.x - a.x) * d.y - (c.y - a.y) * d.x) / den;
      if (t > 0 && t < 1 && u >= -EPS && u <= 1 + EPS) cuts.push(t);
    });
    cuts.sort((x, y) => x - y);
    const at = (t: number) => ({ x: a.x + d.x * t, y: a.y + d.y * t });
    for (let k = 1; k < cuts.length; k++) {
      if (cuts[k] - cuts[k - 1] < 1e-5) continue;
      const from = at(cuts[k - 1]);
      const to = at(cuts[k]);
      const m = at((cuts[k - 1] + cuts[k]) / 2);
      const shared = other.findIndex((c, j) => onSegment(m, c, other[(j + 1) % other.length]));
      if (shared >= 0) {
        // Same direction: one outline for both. Opposite: the wall between neighbours disappears.
        const c = other[shared];
        const e = other[(shared + 1) % other.length];
        if (keepShared && d.x * (e.x - c.x) + d.y * (e.y - c.y) > 0) out.push([from, to]);
      } else if (!inside(m, other)) {
        out.push([from, to]);
      }
    }
  });
  return out;
}

// Outline of two overlapping or adjacent polygons; null if it would be disjoint or have holes.
export function unionPolygons(first: Point[], second: Point[]): Point[] | null {
  const p = area(first) < 0 ? [...first].reverse() : first;
  const q = area(second) < 0 ? [...second].reverse() : second;
  const pieces = [...borderPieces(p, q, true), ...borderPieces(q, p, false)];
  if (pieces.length < 3) return null;
  const [start, ...rest] = pieces;
  const loop = [start[0]];
  let end = start[1];
  while (!same(end, loop[0])) {
    const i = rest.findIndex(([from]) => same(from, end));
    if (i < 0) return null;
    loop.push(end);
    end = rest.splice(i, 1)[0][1];
  }
  if (rest.length > 0) return null;
  return loop.filter((v, i) => {
    const before = loop[(i + loop.length - 1) % loop.length];
    const after = loop[(i + 1) % loop.length];
    return Math.abs(cross(before, v, after)) > 1e-5;
  });
}

// ---------- Polyline joining (paths, walls) ----------

type Line = PathItem | WallPolyline;

function reversed<T extends Line>(line: T): T {
  const out = { ...line, points: [...line.points].reverse() };
  if ('bends' in out && out.bends) {
    const full = Array.from({ length: line.points.length - 1 }, (_, i) => out.bends![i] ?? null);
    out.bends = full.reverse();
  }
  return out;
}

// One polyline out of two whose ends meet; null when no ends are close enough.
export function joinLines<T extends Line>(a: T, b: T, reach: number): T | null {
  if (('closed' in a && a.closed) || ('closed' in b && b.closed)) return null;
  const options = [
    [a, b],
    [a, reversed(b)],
    [reversed(a), b],
    [reversed(a), reversed(b)],
  ].map(([head, tail]) => {
    const x = head.points[head.points.length - 1];
    const y = tail.points[0];
    return { head, tail, gap: Math.hypot(x.x - y.x, x.y - y.y) };
  });
  const best = options.reduce((m, o) => (o.gap < m.gap ? o : m));
  if (best.gap > reach) return null;
  const { head, tail } = best;
  const touching = best.gap < 0.05;
  const points = [...head.points, ...tail.points.slice(touching ? 1 : 0)];
  const joined = { ...a, points } as T;

  if ('closed' in joined) {
    if (points.length > 3 && same(points[0], points[points.length - 1])) {
      joined.points = points.slice(0, -1);
      joined.closed = true;
    }
    return joined;
  }
  const bendsOf = (l: Line) =>
    Array.from({ length: l.points.length - 1 }, (_, i) => (l as PathItem).bends?.[i] ?? null);
  const bends = [...bendsOf(head), ...(touching ? [] : [null]), ...bendsOf(tail)];
  (joined as PathItem).bends = bends.some(Boolean) ? bends : undefined;
  return joined;
}

// ---------- Merge ----------

// Folds every item into the others as long as `combine` finds a way; the first one leads.
function fold<T>(items: T[], combine: (a: T, b: T) => T | null): T[] {
  const out = [...items];
  for (let i = 0; i < out.length; i++) {
    for (let j = i + 1; j < out.length; j++) {
      const merged = combine(out[i], out[j]);
      if (!merged) continue;
      out[i] = merged;
      out.splice(j, 1);
      j = i;
    }
  }
  return out;
}

const pick = (source: Bag, keys: string[]): Bag =>
  Object.fromEntries(keys.filter((k) => source[k] !== undefined).map((k) => [k, source[k]]));

// What an element hands to another one, depending on how much they have in common.
function shared(from: Kind, source: Bag, to: Kind, target: Bag): Bag {
  if (from === to) {
    switch (to) {
      case 'object':
        return pick(source, [
          'scaleX', 'scaleY', 'opacity', 'tint', 'layer', 'castShadow', 'shadowOffset',
          // A light only travels between identical props: a chair must not start glowing.
          ...(source.propId === target.propId ? ['rotation', 'light'] : []),
        ]);
      case 'light':
        return pick(source, ['color', 'radius', 'intensity', 'castShadows', 'flicker']);
      case 'portal':
        return pick(source, ['width', 'kind', 'open', 'openAngle', 'blocksLight']);
      case 'room':
        return pick(source, [
          'floor', 'floorTint', 'floorRotation', 'wallStyle', 'wallThickness', 'castShadows',
        ]);
      case 'wall':
        return pick(source, ['style', 'thickness', 'castShadows']);
      case 'path':
        return pick(source, ['style', 'width', 'smooth', 'curvature', 'fadeEnds']);
      case 'roof':
        return pick(source, ['style', 'ridgeAngle', 'opacity']);
    }
  }

  const out: Bag = {};
  const size = { path: 'width', wall: 'thickness', room: 'wallThickness' } as Bag;
  if (size[from] && size[to]) out[size[to] as string] = source[size[from] as string];
  if (from === 'wall' && to === 'room') {
    Object.assign(out, { wallStyle: source.style, castShadows: source.castShadows });
  }
  if (from === 'room' && to === 'wall') {
    if (source.wallStyle) out.style = source.wallStyle;
    out.castShadows = source.castShadows;
  }
  const seeThrough = (k: Kind) => k === 'object' || k === 'roof';
  if (seeThrough(from) && seeThrough(to)) out.opacity = source.opacity;
  return out;
}

/**
 * Merges the selection: shared properties come from the first element, pieces of the same kind
 * fuse into one when their geometry allows it, and whatever stays separate becomes a group.
 */
export function mergeSelection(
  level: MapLevel,
  refs: SelectionRef[],
  groupId: string
): { level: MapLevel; selected: SelectionRef[] } {
  const chosen = refs.filter((r) => find(level, r));
  if (chosen.length < 2) return { level, selected: refs };
  const lead = chosen[0];
  const leadItem = find(level, lead) as unknown as Bag;

  // 1. Share properties: from the first of each kind to its peers, and from the lead across kinds.
  const updated = new Map<string, Bag>();
  const leadOfKind = new Map<Kind, Bag>();
  for (const ref of chosen) {
    const item = find(level, ref) as unknown as Bag;
    const first = leadOfKind.get(ref.kind);
    const next = {
      ...item,
      ...(ref.kind !== lead.kind ? shared(lead.kind, leadItem, ref.kind, item) : {}),
    };
    if (first) Object.assign(next, shared(ref.kind, first, ref.kind, next));
    else leadOfKind.set(ref.kind, next);
    updated.set(`${ref.kind}:${ref.id}`, next);
  }

  // 2. Fuse geometry.
  const result = { ...level };
  const survivors: SelectionRef[] = [];
  for (const kind of leadOfKind.keys()) {
    const ids = chosen.filter((r) => r.kind === kind).map((r) => r.id);
    let items = ids.map((id) => updated.get(`${kind}:${id}`) as unknown as Item);
    if (kind === 'room' || kind === 'roof') {
      items = fold(items as unknown as (RoomShape | RoofShape)[], (a, b) => {
        const points = unionPolygons(a.points, b.points);
        return points ? { ...a, points } : null;
      });
    } else if (kind === 'path') {
      items = fold(items as unknown as PathItem[], (a, b) =>
        joinLines(a, b, Math.max(0.6, a.width))
      );
    } else if (kind === 'wall') {
      items = fold(items as unknown as WallPolyline[], (a, b) => joinLines(a, b, 0.6));
    }
    survivors.push(...items.map((it) => ({ kind, id: it.id })));
    const kept = new Map(items.map((it) => [it.id, it]));
    (result as unknown as Record<string, Item[]>)[LIST[kind]] = itemsOf(level, kind).flatMap(
      (it) => (!ids.includes(it.id) ? [it] : kept.has(it.id) ? [kept.get(it.id)!] : [])
    );
  }

  // 3. Group what is still separate (a single survivor needs no group).
  const group = survivors.length > 1 ? groupId : undefined;
  return { level: assignGroup(result, survivors, group), selected: survivors };
}

export function assignGroup(
  level: MapLevel,
  refs: SelectionRef[],
  groupId: string | undefined
): MapLevel {
  const result = { ...level };
  for (const kind of new Set(refs.map((r) => r.kind))) {
    const ids = new Set(refs.filter((r) => r.kind === kind).map((r) => r.id));
    (result as unknown as Record<string, Item[]>)[LIST[kind]] = itemsOf(result, kind).map(
      (it) => (ids.has(it.id) ? { ...it, groupId } : it)
    );
  }
  return result;
}
