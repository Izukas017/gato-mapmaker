import { describe, expect, it } from 'vitest';
import type { PathItem } from '../../types/map';
import { bendHandles, bendsWithHandle, samplePath } from '../paths';

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
