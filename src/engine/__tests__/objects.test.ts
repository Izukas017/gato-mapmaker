import { describe, expect, it } from 'vitest';
import { EXTRA_ANIMALS } from '../animals';
import { BUILTIN_PROPS, OBJECTS } from '../props';

describe('Object art', () => {
  it('has its own painter for every object that is not an animal', () => {
    const ids = BUILTIN_PROPS.filter((p) => p.category !== 'animals' && p.id !== 'blood_pool').map(
      (p) => p.id
    );
    expect(ids.filter((id) => !OBJECTS[id])).toEqual([]);
    expect(Object.keys(OBJECTS).filter((id) => !ids.includes(id))).toEqual([]);
    expect(ids.length).toBeGreaterThanOrEqual(150);
    expect(EXTRA_ANIMALS.length).toBeGreaterThan(100);
  });
});
