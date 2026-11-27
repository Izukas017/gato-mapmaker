import { describe, expect, it } from 'vitest';
import {
  CYBER_FLOORS, CYBER_PATHS, CYBER_PORTALS, CYBER_ROOFS, CYBER_TERRAIN, CYBER_WALLS, isCyber,
} from '../cyber/catalog';
import { CYBER_WALL_LOOKS } from '../cyber/structures';
import { CYBER_SURFACES } from '../cyber/surfaces';
import { CYBER_CATEGORIES, CYBER_PROPS } from '../objects/cyberRegistry';
import { BUILTIN_PROPS, OBJECTS } from '../props';

describe('CyberGato content', () => {
  it('ships more than 350 models of its own', () => {
    const total = [CYBER_PROPS, CYBER_TERRAIN, CYBER_FLOORS, CYBER_ROOFS, CYBER_WALLS, CYBER_PORTALS, CYBER_PATHS]
      .reduce((sum, list) => sum + list.length, 0);
    expect(total).toBeGreaterThan(350);
  });

  it('has art for every surface, wall and object', () => {
    for (const { id } of [...CYBER_TERRAIN, ...CYBER_FLOORS, ...CYBER_ROOFS]) expect(CYBER_SURFACES[id], id).toBeTypeOf('function');
    for (const { id } of CYBER_WALLS) expect(CYBER_WALL_LOOKS[id], id).toBeDefined();
    for (const p of CYBER_PROPS) expect(OBJECTS[p.id], p.id).toBeTypeOf('function');
  });

  it('keeps cyber and classic content apart', () => {
    const cyberCats = new Set(CYBER_CATEGORIES.map((c) => c.id));
    for (const p of BUILTIN_PROPS) expect(isCyber(p.id), p.id).toBe(cyberCats.has(p.category));
  });
});
