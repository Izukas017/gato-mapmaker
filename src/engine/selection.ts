import type { LayerVisibility, MapLevel, Point, SelectionRef } from '../types/map';
import { polylineTouchesRect, samplePath } from './paths';

// The level as the user sees it: whatever sits on a hidden layer cannot be picked.
export function visibleContent(level: MapLevel, layers: LayerVisibility): MapLevel {
  return {
    ...level,
    objects: layers.objects
      ? level.objects.filter((o) => o.layer !== 'roof' || layers.roofs)
      : [],
    lights: layers.lighting ? level.lights : [],
    portals: layers.portals ? level.portals : [],
    rooms: level.rooms.filter((r) => layers.floors || (layers.walls && r.wallStyle)),
    walls: layers.walls ? level.walls : [],
    paths: layers.paths ? level.paths : [],
    roofs: layers.roofs ? level.roofs : [],
  };
}

// Point items count when their centre is in the box; shapes when the box touches their line.
export function boxSelect(level: MapLevel, min: Point, max: Point): SelectionRef[] {
  const out: SelectionRef[] = [];
  const centred = (kind: 'object' | 'light' | 'portal', items: (Point & { id: string })[]) => {
    for (const it of items) {
      if (it.x >= min.x && it.x <= max.x && it.y >= min.y && it.y <= max.y) {
        out.push({ kind, id: it.id });
      }
    }
  };
  centred('object', level.objects);
  centred('light', level.lights);
  centred('portal', level.portals);

  const touched = (
    kind: 'room' | 'wall' | 'path' | 'roof',
    id: string,
    points: Point[],
    closed: boolean
  ) => {
    if (polylineTouchesRect(points, closed, min, max)) out.push({ kind, id });
  };
  for (const w of level.walls) touched('wall', w.id, w.points, w.closed);
  for (const p of level.paths) touched('path', p.id, samplePath(p), false);
  for (const r of level.rooms) touched('room', r.id, r.points, true);
  for (const r of level.roofs) touched('roof', r.id, r.points, true);
  return out;
}
