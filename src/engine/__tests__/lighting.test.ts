import { describe, expect, it } from 'vitest';
import {
  computeVisibilityPolygon,
  extractOccluderSegments,
} from '../lighting';
import {
  createCobblestoneQuarterPreset,
  createSanctuaryPreset,
} from '../presets';

describe('Lighting & Occlusion Engine', () => {
  it('splits wall segments when an open portal sits on the wall', () => {
    const doc = createSanctuaryPreset();
    const level = doc.levels[0];
    const segsWithPortals = extractOccluderSegments(level);
    const segsWithoutPortals = extractOccluderSegments({
      ...level,
      portals: [],
    });
    // Open portals/windows split wall segments into more sub-segments
    expect(segsWithPortals.length).toBeGreaterThan(segsWithoutPortals.length);
  });

  it('computes a valid visibility polygon around a light source', () => {
    const doc = createSanctuaryPreset();
    const level = doc.levels[0];
    const segs = extractOccluderSegments(level);
    const poly = computeVisibilityPolygon(level.lights[0], segs);
    expect(poly.length).toBeGreaterThanOrEqual(4);
    for (const pt of poly) {
      expect(Number.isFinite(pt.x)).toBe(true);
      expect(Number.isFinite(pt.y)).toBe(true);
    }
  });

  it('builds both showcase presets with valid geometry and lights', () => {
    const sanctuary = createSanctuaryPreset();
    const quarter = createCobblestoneQuarterPreset();
    expect(sanctuary.levels[0].rooms.length).toBeGreaterThan(5);
    expect(sanctuary.levels[0].objects.length).toBeGreaterThan(30);
    expect(quarter.levels[0].rooms.length).toBeGreaterThan(4);
    expect(quarter.levels[0].roofs.length).toBeGreaterThan(0);
  });
});
