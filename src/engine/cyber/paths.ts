// CyberGato roads, rails, cables and barriers, painted with the path layer helpers.
import type { PathItem, Point } from '../../types/map';

type Mark = { at: Point; normal: Point };

export interface PathApi {
  path: PathItem;
  line: Point[];
  w: number; // width in px
  paint: (style: string, width: number, dash?: number[], points?: Point[]) => void;
  marks: (spacing: number, draw: (mark: Mark, rand: number, index: number) => void) => void;
  across: (at: Point, normal: Point, from: number, to: number, color: string, thick: number) => void;
  dab: (at: Point, normal: Point, side: number, radius: number, color: string) => void;
  offsetLine: (line: Point[], distance: number) => Point[];
}

// Glowing line: wide soft halo under a bright core.
function neon(api: PathApi, color: string, width: number, points?: Point[]) {
  api.paint(color.replace(/[\d.]+\)$/, '0.18)'), width * 4, [], points);
  api.paint(color.replace(/[\d.]+\)$/, '0.4)'), width * 2, [], points);
  api.paint(color, width, [], points);
  api.paint('rgba(255,255,255,0.85)', Math.max(1, width * 0.35), [], points);
}

function asphalt(api: PathApi, scale = 1) {
  const { paint, w } = api;
  paint('rgba(0,0,0,0.35)', w * scale * 1.1);
  paint('#202227', w * scale);
  paint('rgba(255,255,255,0.03)', w * scale * 0.9, [3, 9]);
}

function side(api: PathApi, offset: number) {
  return api.offsetLine(api.line, api.path.width * offset);
}

export function cyberPathLayers(api: PathApi) {
  const { paint, marks, across, dab, w, path } = api;
  switch (path.style) {
    case 'cy_road':
      asphalt(api);
      for (const o of [-0.44, 0.44]) paint('#d8d8d0', Math.max(1, w * 0.03), [], side(api, o));
      paint('#e8c21c', Math.max(1.2, w * 0.035), [w * 0.4, w * 0.3]);
      break;
    case 'cy_avenue':
      asphalt(api);
      for (const o of [-0.46, 0.46]) paint('#d8d8d0', Math.max(1, w * 0.02), [], side(api, o));
      for (const o of [-0.23, 0.23]) paint('rgba(230,230,220,0.85)', Math.max(1, w * 0.018), [w * 0.25, w * 0.25], side(api, o));
      for (const o of [-0.02, 0.02]) paint('#e8c21c', Math.max(1, w * 0.018), [], side(api, o));
      break;
    case 'cy_highway':
      paint('rgba(0,0,0,0.5)', w * 1.35);
      paint('#5a5e66', w * 1.12);
      asphalt(api);
      for (const o of [-0.5, 0.5]) paint('#9aa0a8', Math.max(2, w * 0.06), [], side(api, o));
      for (const o of [-0.25, 0, 0.25]) paint('rgba(240,240,230,0.85)', Math.max(1, w * 0.018), [w * 0.3, w * 0.25], side(api, o));
      marks(2.2, ({ at, normal }) => {
        for (const s of [-0.56, 0.56]) {
          dab(at, normal, s, 0.08, '#3a3e46');
          dab(at, normal, s, 0.04, '#ffd27a');
        }
      });
      break;
    case 'cy_sidewalk_path':
      paint('rgba(0,0,0,0.3)', w * 1.08);
      paint('#8a8d92', w);
      paint('#4a4d52', w * 0.98, [1.5, w * 0.6 - 1.5]);
      paint('#b0b3b8', Math.max(1.5, w * 0.08), [], side(api, -0.47));
      break;
    case 'cy_crosswalk':
      asphalt(api);
      marks(0.22, ({ at, normal }) => across(at, normal, -0.45, 0.45, '#eeeeea', 0.11));
      break;
    case 'cy_bike_lane':
      paint('rgba(0,0,0,0.3)', w * 1.06);
      paint('#2c7a4a', w);
      for (const o of [-0.46, 0.46]) paint('#eeeeea', Math.max(1, w * 0.04), [], side(api, o));
      marks(1.6, ({ at, normal }) => {
        dab(at, normal, -0.12, 0.14, 'rgba(238,238,234,0.9)');
        dab(at, normal, 0.12, 0.14, 'rgba(238,238,234,0.9)');
      });
      break;
    case 'cy_alley':
      paint('rgba(0,0,0,0.35)', w * 1.1);
      paint('#1c1d21', w);
      marks(0.5, ({ at, normal }, rand) => {
        if (rand < 0.4) return;
        dab(at, normal, (rand - 0.7) * 0.8, 0.12 + rand * 0.1, 'rgba(30,40,70,0.9)');
        dab(at, normal, (rand - 0.7) * 0.8, 0.05, rand > 0.75 ? 'rgba(255,60,200,0.55)' : 'rgba(60,220,255,0.55)');
      });
      marks(0.9, ({ at, normal }, rand) => {
        if (rand > 0.35) return;
        dab(at, normal, rand > 0.15 ? 0.42 : -0.42, 0.1, '#3a3530');
      });
      break;
    case 'cy_tram':
      asphalt(api);
      for (const o of [-0.22, 0.22]) {
        const rail = side(api, o);
        paint('#121316', Math.max(2, w * 0.09), [], rail);
        paint('#aeb6c0', Math.max(1, w * 0.04), [], rail);
      }
      marks(1.4, ({ at, normal }) => {
        for (const s of [-0.48, 0.48]) dab(at, normal, s, 0.05, '#3a3e46');
      });
      break;
    case 'cy_maglev':
      paint('rgba(0,0,0,0.4)', w * 0.8);
      paint('#3a3f48', w * 0.6);
      paint('#5a606a', w * 0.42);
      neon(api, 'rgba(47,232,255,1)', Math.max(1.5, w * 0.06));
      marks(0.6, ({ at, normal }) => across(at, normal, -0.28, 0.28, '#20242c', 0.04));
      break;
    case 'cy_neon_strip':
      neon(api, 'rgba(177,75,255,1)', Math.max(2, w * 0.14));
      break;
    case 'cy_cables': {
      const colors = ['#1a1a1a', '#c82020', '#2050c8', '#202020', '#e8c21c'];
      colors.forEach((c, i) => {
        const strand = side(api, (i - 2) * 0.12);
        paint('#050505', Math.max(2, w * 0.14), [], strand);
        paint(c, Math.max(1.5, w * 0.1), [], strand);
      });
      marks(1.8, ({ at, normal }) => across(at, normal, -0.36, 0.36, '#6a6e74', 0.08));
      break;
    }
    case 'cy_pipeline':
      paint('rgba(0,0,0,0.4)', w * 0.95);
      paint('#4a525e', w * 0.75);
      paint('#7a8492', w * 0.5);
      paint('rgba(255,255,255,0.35)', w * 0.12, [], side(api, -0.12));
      marks(1.5, ({ at, normal }) => {
        across(at, normal, -0.42, 0.42, '#2a2e36', 0.12);
        dab(at, normal, -0.42, 0.06, '#b4bcc6');
        dab(at, normal, 0.42, 0.06, '#b4bcc6');
      });
      break;
    case 'cy_conveyor':
      paint('#14161a', w * 1.05);
      paint('#2a2d33', w * 0.86);
      marks(0.14, ({ at, normal }) => across(at, normal, -0.42, 0.42, '#3e434b', 0.05));
      for (const o of [-0.48, 0.48]) paint('#e8c21c', Math.max(1.5, w * 0.06), [w * 0.2, w * 0.2], side(api, o));
      break;
    case 'cy_toxic_canal':
      paint('rgba(0,0,0,0.4)', w * 1.3);
      paint('#5a5e66', w * 1.15);
      paint('#2a6a14', w * 0.95);
      paint('#4ea41c', w * 0.7);
      paint('#9cf03a', w * 0.25, [w * 0.6, w * 0.4]);
      marks(0.45, ({ at, normal }, rand) => {
        if (rand > 0.5) dab(at, normal, (rand - 0.75) * 1.4, 0.06, 'rgba(220,255,150,0.85)');
      });
      break;
    case 'cy_holo_barrier':
      marks(0.9, ({ at, normal }) => {
        for (const s of [-0.5, 0.5]) {
          dab(at, normal, s, 0.12, '#1e232c');
          dab(at, normal, s, 0.06, '#2fe8ff');
        }
      });
      neon(api, 'rgba(47,232,255,0.55)', Math.max(1.2, w * 0.05), side(api, -0.15));
      neon(api, 'rgba(47,232,255,0.55)', Math.max(1.2, w * 0.05), side(api, 0.15));
      paint('rgba(47,200,255,0.12)', w * 0.9);
      break;
    default:
      // cy_laser_line
      neon(api, 'rgba(255,47,74,1)', Math.max(1.5, w * 0.06));
      marks(1.2, ({ at, normal }) => {
        dab(at, normal, 0, 0.12, '#20232a');
        dab(at, normal, 0, 0.06, '#ff2f4a');
      });
  }
}
