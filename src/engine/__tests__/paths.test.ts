import { describe, expect, it } from 'vitest';
import type { PathItem } from '../../types/map';
import {
  bendHandles,
  bendsWithHandle,
  offsetLine,
  polylineTouchesRect,
  samplePath,
  spacedAlong,
} from '../paths';

const base: PathItem = {
  id: 'p',
  points: [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }],
  style: 'cobble_path',
  width: 1,
  smooth: false,
  fadeEnds: true,
};

describe('Path geometry', () => {
  it('stays straight without bends', () => {
    expect(samplePath(base)).toEqual(base.points);
  });

  it('bends a segment through the dragged handle and keeps its ends', () => {
    const bent = { ...base, bends: bendsWithHandle(base, 0, { x: 2, y: -1 }) };
    const line = samplePath(bent);
    expect(bendHandles(bent)[0]).toEqual({ x: 2, y: -1 });
    expect(line[0]).toEqual(base.points[0]);
    expect(line[12].x).toBeCloseTo(2);
    expect(line[12].y).toBeCloseTo(-1);
    expect(line[line.length - 1]).toEqual(base.points[2]);
  });

  it('bulges more as curvature grows and is straight at zero', () => {
    const bulge = (curvature: number) =>
      Math.min(...samplePath({ ...base, smooth: true, curvature }).map((p) => p.y));
    expect(bulge(0)).toBeCloseTo(0);
    expect(bulge(2)).toBeLessThan(bulge(1));
    expect(bulge(1)).toBeLessThan(0);
  });
});

describe('Box selection of walls', () => {
  const square = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }];
  const touches = (x0: number, y0: number, x1: number, y1: number, closed = false) =>
    polylineTouchesRect(square, closed, { x: x0, y: y0 }, { x: x1, y: y1 });

  it('selects a wall crossed by the box, not one merely around it', () => {
    expect(touches(1, -1, 2, 1)).toBe(true);
    expect(touches(1, 1, 3, 3)).toBe(false);
  });

  it('counts the closing segment only on closed walls', () => {
    expect(touches(-1, 1, 1, 2)).toBe(false);
    expect(touches(-1, 1, 1, 2, true)).toBe(true);
  });
});

describe('Rail geometry', () => {
  const corner = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }];

  it('keeps a parallel rail at the same distance through a corner', () => {
    expect(offsetLine(corner, 1)).toEqual([{ x: 0, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 4 }]);
  });

  it('places sleepers evenly with a perpendicular normal', () => {
    const marks = spacedAlong(corner, 2);
    expect(marks.map((m) => m.at)).toEqual([
      { x: 1, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 3 },
    ]);
    expect(marks[2].normal.x).toBeCloseTo(-1);
  });
});
