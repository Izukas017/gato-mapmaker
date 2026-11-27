import { describe, expect, it } from 'vitest';
import { useMapStore } from '../../store/useMapStore';
import { BUILTIN_PROPS, PROP_LIGHTS } from '../props';

const place = (id: string, propId: string) => {
  useMapStore.getState().addObject({
    id, propId, x: 1, y: 1, scaleX: 1, scaleY: 1, rotation: 0,
    opacity: 1, layer: 'above_floor', castShadow: false, shadowOffset: 1,
  });
  const { doc } = useMapStore.getState();
  const level = doc.levels.find((l) => l.id === doc.activeLevelId)!;
  return level.objects.find((o) => o.id === id)!;
};

describe('Prop lights', () => {
  it('only references existing props', () => {
    const ids = new Set(BUILTIN_PROPS.map((p) => p.id));
    expect(Object.keys(PROP_LIGHTS).filter((id) => !ids.has(id))).toEqual([]);
  });

  it('enables own light on light-emitting props only', () => {
    expect(place('t1', 'torch_wall').light?.enabled).toBe(true);
    expect(place('t2', 'chair').light).toBeUndefined();
  });
});
