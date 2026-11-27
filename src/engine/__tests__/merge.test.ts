import { describe, expect, it } from 'vitest';
import { useMapStore } from '../../store/useMapStore';
import type { PathItem, Point } from '../../types/map';
import { joinLines, unionPolygons } from '../merge';

const rect = (x0: number, y0: number, x1: number, y1: number): Point[] => [
  { x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 },
];
const size = (poly: Point[] | null) =>
  Math.abs(
    (poly ?? []).reduce((s, p, i, all) => {
      const q = all[(i + 1) % all.length];
      return s + (p.x * q.y - q.x * p.y) / 2;
    }, 0)
  );

describe('Polygon union', () => {
  it('merges adjacent, overlapping and contained shapes', () => {
    const side = unionPolygons(rect(0, 0, 4, 4), rect(4, 0, 8, 4));
    expect(side).toHaveLength(4);
    expect(size(side)).toBeCloseTo(32);
    expect(size(unionPolygons(rect(0, 0, 4, 4), rect(2, 2, 6, 6)))).toBeCloseTo(28);
    expect(size(unionPolygons(rect(0, 0, 4, 4), rect(4, 1, 6, 3).reverse()))).toBeCloseTo(20);
    expect(size(unionPolygons(rect(0, 0, 8, 8), rect(0, 2, 3, 4)))).toBeCloseTo(64);
    expect(size(unionPolygons(rect(0, 0, 4, 4), rect(0, 0, 4, 4)))).toBeCloseTo(16);
  });

  it('refuses disjoint shapes', () => {
    expect(unionPolygons(rect(0, 0, 1, 1), rect(3, 3, 4, 4))).toBeNull();
  });
});

describe('Line joining', () => {
  const path = (id: string, points: Point[]): PathItem => ({
    id, points, style: 'cobble_path', width: 1, smooth: false, fadeEnds: true,
  });

  it('joins touching ends in any direction and keeps bends on their segment', () => {
    const a = path('a', [{ x: 0, y: 0 }, { x: 2, y: 0 }]);
    const b = { ...path('b', [{ x: 4, y: 0 }, { x: 2, y: 0 }]), bends: [{ x: 0, y: 1 }] };
    const out = joinLines(a, b, 0.6)!;
    expect(out.points).toEqual([{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 0 }]);
    expect(out.bends).toEqual([null, { x: 0, y: 1 }]);
    expect(joinLines(a, path('c', [{ x: 9, y: 9 }, { x: 10, y: 9 }]), 0.6)).toBeNull();
  });
});

describe('Merge action', () => {
  it('equalizes, groups, selects the group together and can be undone', () => {
    const store = useMapStore.getState;
    const add = (id: string, propId: string, x: number, scale: number) =>
      store().addObject({
        id, propId, x, y: 1, scaleX: scale, scaleY: scale, rotation: 0,
        opacity: 1, layer: 'above_floor', castShadow: false, shadowOffset: 1,
      });
    const objects = () => {
      const { doc } = store();
      const level = doc.levels.find((l) => l.id === doc.activeLevelId)!;
      return level.objects.filter((o) => o.id.startsWith('m'));
    };
    add('m1', 'torch_wall', 1, 2);
    add('m2', 'chair', 3, 1);
    store().setSelectedItems([{ kind: 'object', id: 'm1' }, { kind: 'object', id: 'm2' }]);
    store().mergeSelected();
    expect(objects().map((o) => o.scaleX)).toEqual([2, 2]);
    expect(objects()[1].light).toBeUndefined();

    store().setSelection({ kind: 'object', id: 'm2' });
    expect(store().selectedItems).toHaveLength(2);
    store().duplicateSelected();
    const groups = new Set(objects().concat().map((o) => o.groupId));
    expect(groups.size).toBe(1);

    store().undo();
    store().setSelection({ kind: 'object', id: 'm2' });
    store().ungroupSelected();
    store().setSelection({ kind: 'object', id: 'm2' });
    expect(store().selectedItems).toHaveLength(1);
  });
});
