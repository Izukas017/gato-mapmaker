import { BUILTIN_PROPS, getPropThumbnail } from './props';
import { getPathThumbnail, getPortalThumbnail, getWallThumbnail } from './renderer';
import {
  FLOOR_PATTERNS,
  getTextureThumbnail,
  ROOF_STYLES,
  TERRAIN_MATERIALS,
  WALL_STYLES,
} from './textures';
import type { PathStyleId, PortalKind } from '../types/map';
import { useUiPrefs } from '../store/useUiPrefs';
import {
  CYBER_FLOORS, CYBER_PATHS, CYBER_PORTALS, CYBER_ROOFS, CYBER_TERRAIN, CYBER_WALLS, isCyber,
} from './cyber/catalog';

const PATHS: PathStyleId[] = [
  'dirt_road', 'cobble_path', 'fence_wood', 'fence_picket', 'fence_iron', 'wood_bridge',
  'rope_bridge', 'rail_tracks', 'stream_brook', 'lava_stream', 'stone_wall_low', 'carpet_teal',
  'carpet_crimson', 'hedge', 'cliff_edge',
];
const PORTALS: PortalKind[] = [
  'door_wood', 'door_double', 'door_iron', 'door_ornate_gold', 'door_secret', 'portcullis',
  'archway', 'window_glass', 'window_stained', 'window_bars',
];

/**
 * Builds textures and thumbnails little by little while the browser is idle, so that opening a
 * tool panel on a slow computer does not freeze it.
 */
export function warmUpAssets() {
  const isConstrainedDevice =
    window.innerWidth <= 860 ||
    ((navigator as { deviceMemory?: number }).deviceMemory ?? 8) <= 4;

  // On mobile/low-RAM devices, skip pre-building 130+ animal thumbnails until opened.
  // Only the content of the variant in use; the other one is built when its tab is opened.
  const cyber = useUiPrefs.getState().appVariant === 'cybergato';
  const propsToWarm = BUILTIN_PROPS.filter(
    (p) => isCyber(p.id) === cyber && !(isConstrainedDevice && p.category === 'animals')
  );

  const jobs: (() => void)[] = cyber ? [
    ...CYBER_TERRAIN.map((m) => () => getTextureThumbnail('terrain', m.id)),
    ...CYBER_FLOORS.map((m) => () => getTextureThumbnail('floor', m.id)),
    ...CYBER_WALLS.map((m) => () => getWallThumbnail(m.id)),
    ...CYBER_PORTALS.map((p) => () => getPortalThumbnail(p.id)),
    ...CYBER_PATHS.map((p) => () => getPathThumbnail(p.id)),
    ...CYBER_ROOFS.map((m) => () => getTextureThumbnail('roof', m.id)),
    ...propsToWarm.map((p) => () => getPropThumbnail(p.id)),
  ] : [
    ...TERRAIN_MATERIALS.map((m) => () => getTextureThumbnail('terrain', m.id)),
    ...FLOOR_PATTERNS.map((m) => () => getTextureThumbnail('floor', m.id)),
    ...WALL_STYLES.map((m) => () => getWallThumbnail(m.id)),
    ...PORTALS.map((id) => () => getPortalThumbnail(id)),
    ...PATHS.map((id) => () => getPathThumbnail(id)),
    ...ROOF_STYLES.map((m) => () => getTextureThumbnail('roof', m.id)),
    ...propsToWarm.map((p) => () => getPropThumbnail(p.id)),
  ];
  const later = (step: (budget: () => number) => void) => {
    if (typeof window.requestIdleCallback === 'function') {
      // The timeout keeps it moving on busy machines that never report idle time.
      window.requestIdleCallback((idle) => step(() => idle.timeRemaining()), { timeout: 700 });
    } else {
      window.setTimeout(() => step(() => 0), 60);
    }
  };
  let next = 0;
  const step = (budget: () => number) => {
    do jobs[next++]?.();
    while (next < jobs.length && budget() > 8);
    if (next < jobs.length) later(step);
  };
  window.setTimeout(() => later(step), 1500);
}
