import { describe, expect, it } from 'vitest';
import { createSanctuaryPreset } from '../presets';
import { boxSelect, visibleContent } from '../selection';

describe('Selection', () => {
  const doc = createSanctuaryPreset();
  const level = doc.levels[0];
  const everything = () =>
    boxSelect(level, { x: -1, y: -1 }, { x: doc.width + 1, y: doc.height + 1 });

  it('box-selects every kind present on the level', () => {
    const kinds = new Set(everything().map((r) => r.kind));
    for (const kind of ['object', 'light', 'portal', 'room', 'path'] as const) {
      const list = level[`${kind}s`];
      expect(kinds.has(kind)).toBe(list.length > 0);
    }
  });

  it('never picks hidden layers', () => {
    const layers = { ...doc.layers, objects: false, floors: false, walls: false };
    const kinds = new Set(
      boxSelect(
        visibleContent(level, layers),
        { x: -1, y: -1 },
        { x: doc.width + 1, y: doc.height + 1 }
      ).map((r) => r.kind)
    );
    expect(kinds.has('object')).toBe(false);
    expect(kinds.has('room')).toBe(false);
    expect(kinds.has('wall')).toBe(false);
    expect(kinds.has('light')).toBe(true);
  });
});
