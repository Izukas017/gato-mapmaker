import { describe, expect, it } from 'vitest';
import { EXTRA_ANIMALS } from '../animals';
import { BUILTIN_PROPS } from '../props';

describe('Animals', () => {
  it('adds many animals with unique ids and names', () => {
    expect(EXTRA_ANIMALS.length).toBeGreaterThan(100);
    const ids = BUILTIN_PROPS.map((p) => p.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    const names = BUILTIN_PROPS.filter((p) => p.category === 'animals').map((p) => p.name);
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
  });
});
