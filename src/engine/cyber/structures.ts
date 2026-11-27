// CyberGato walls, doors and windows, drawn along the wall like the classic ones.
import type { PortalItem } from '../../types/map';
import type { WallLook } from '../structures';

type Rand = () => number;
const TAU = Math.PI * 2;

function box(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string | CanvasGradient, r = 0) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2)));
  ctx.fillStyle = fill;
  ctx.fill();
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.3, r), 0, TAU);
  ctx.fillStyle = fill;
  ctx.fill();
}

function glowLine(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, color: string, width: number) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.shadowColor = color;
  ctx.shadowBlur = width * 3.5;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = width * 0.35;
  ctx.stroke();
  ctx.restore();
}

const pick = (look: WallLook, rand: Rand) => look.tones[Math.floor(rand() * look.tones.length)];

// A panel with a lit top edge and a shaded bottom one.
function panel(ctx: CanvasRenderingContext2D, x: number, len: number, w: number, color: string, gap = 0.04) {
  box(ctx, x + w * gap, -w * 0.44, len - w * gap * 2, w * 0.88, color, w * 0.06);
  box(ctx, x + w * gap, -w * 0.44, len - w * gap * 2, w * 0.12, 'rgba(255,255,255,0.18)', w * 0.04);
  box(ctx, x + w * gap, w * 0.32, len - w * gap * 2, w * 0.12, 'rgba(0,0,0,0.3)', w * 0.04);
}

function neonWall(color: string): WallLook {
  return {
    outline: '#050308',
    mortar: '#0e0b14',
    piece: [1.6, 2.4],
    tones: ['#1c1726', '#221c2e', '#18141f'],
    draw: (ctx, x, len, w, rand, look) => {
      panel(ctx, x, len, w, pick(look, rand));
      glowLine(ctx, x + w * 0.15, 0, x + len - w * 0.15, 0, color, Math.max(1.2, w * 0.16));
    },
    corner: (ctx, w) => {
      box(ctx, -w * 0.55, -w * 0.55, w * 1.1, w * 1.1, '#050308', w * 0.12);
      box(ctx, -w * 0.45, -w * 0.45, w * 0.9, w * 0.9, '#2a2236', w * 0.1);
      dot(ctx, 0, 0, w * 0.16, color);
    },
  };
}

const post = (fill: string) => (ctx: CanvasRenderingContext2D, w: number) => {
  dot(ctx, w * 0.06, w * 0.08, w * 0.34, 'rgba(0,0,0,0.45)');
  dot(ctx, 0, 0, w * 0.3, fill);
  dot(ctx, -w * 0.08, -w * 0.08, w * 0.1, 'rgba(255,255,255,0.5)');
};

export const CYBER_WALL_LOOKS: Record<string, WallLook> = {
  cy_concrete_wall: {
    outline: '#1a1b1e', mortar: '#3a3c40', piece: [2, 3],
    tones: ['#7d8085', '#74777c', '#86898e'],
    draw: (ctx, x, len, w, rand, look) => {
      panel(ctx, x, len, w, pick(look, rand), 0.02);
      for (const f of [0.25, 0.75]) dot(ctx, x + len * f, 0, w * 0.07, '#4a4d52');
      if (rand() > 0.6) dot(ctx, x + rand() * len, (rand() - 0.5) * w * 0.5, w * 0.12, 'rgba(40,40,40,0.25)');
    },
  },
  cy_steel_panel: {
    outline: '#0c0e12', mortar: '#22262d', piece: [1.4, 1.4],
    tones: ['#5d6672', '#56606b', '#66707c'],
    draw: (ctx, x, len, w, rand, look) => {
      panel(ctx, x, len, w, pick(look, rand));
      for (const fx of [0.12, 0.88]) for (const fy of [-0.28, 0.28]) dot(ctx, x + len * fx, w * fy, w * 0.05, '#b4bcc6');
    },
  },
  cy_neon_purple: neonWall('#b14bff'),
  cy_neon_cyan: neonWall('#2fe8ff'),
  cy_neon_pink: neonWall('#ff3fb0'),
  cy_glass_curtain: {
    outline: '#1a2a36', mortar: '#9aa8b4', piece: [1.8, 1.8],
    tones: ['#244e66', '#2a5872', '#1f465c'],
    draw: (ctx, x, len, w, rand, look) => {
      box(ctx, x + w * 0.06, -w * 0.36, len - w * 0.12, w * 0.72, pick(look, rand), 2);
      ctx.strokeStyle = 'rgba(210,240,255,0.55)';
      ctx.lineWidth = Math.max(1, w * 0.05);
      ctx.beginPath();
      ctx.moveTo(x + len * 0.2, w * 0.25);
      ctx.lineTo(x + len * 0.45, -w * 0.25);
      ctx.stroke();
    },
  },
  cy_brick_graffiti: {
    outline: '#22100c', mortar: '#6a5a50', piece: [0.8, 0.8],
    tones: ['#7a3a2c', '#6c3326', '#8a4434', '#5e2c22'],
    draw: (ctx, x, len, w, rand, look) => {
      for (const [y, shift] of [[-0.43, 0], [0.02, 0.5]] as const) {
        box(ctx, x - len * shift + w * 0.03, w * y, len - w * 0.06, w * 0.4, pick(look, rand), w * 0.04);
        box(ctx, x + len * (1 - shift) + w * 0.03, w * y, len - w * 0.06, w * 0.4, pick(look, rand), w * 0.04);
      }
      if (rand() > 0.55) {
        ctx.strokeStyle = ['#ff3fb0', '#2fe8ff', '#e8ff2f', '#b14bff'][Math.floor(rand() * 4)];
        ctx.lineWidth = Math.max(1.2, w * 0.12);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, (rand() - 0.5) * w * 0.6);
        ctx.bezierCurveTo(x + len * 0.3, -w * 0.4, x + len * 0.6, w * 0.4, x + len, (rand() - 0.5) * w * 0.6);
        ctx.stroke();
      }
    },
  },
  cy_chainlink: {
    outline: 'rgba(0,0,0,0)', mortar: 'rgba(0,0,0,0)', piece: [3, 3],
    tones: ['#9aa3ae'],
    draw: (ctx, x, len, w) => {
      ctx.strokeStyle = 'rgba(170,180,190,0.85)';
      ctx.lineWidth = Math.max(0.6, w * 0.04);
      ctx.beginPath();
      for (let p = 0; p < len; p += w * 0.3) {
        ctx.moveTo(x + p, -w * 0.12);
        ctx.lineTo(x + p + w * 0.15, w * 0.12);
        ctx.moveTo(x + p + w * 0.15, -w * 0.12);
        ctx.lineTo(x + p, w * 0.12);
      }
      ctx.stroke();
      box(ctx, x, -w * 0.06, len, w * 0.12, 'rgba(120,128,138,0.9)');
      dot(ctx, x, 0, w * 0.22, '#5a626e');
    },
    corner: post('#6a7380'),
  },
  cy_corrugated_wall: {
    outline: '#16181b', mortar: '#3c4046', piece: [0.35, 0.35],
    tones: ['#7c838c', '#6e757e'],
    draw: (ctx, x, len, w, rand, look) => {
      box(ctx, x, -w * 0.44, len * 0.55, w * 0.88, pick(look, rand));
      box(ctx, x + len * 0.55, -w * 0.44, len * 0.45, w * 0.88, '#4c5259');
    },
  },
  cy_hazard: {
    outline: '#0c0c0c', mortar: '#1a1a1a', piece: [0.5, 0.5],
    tones: ['#e8c21c'],
    draw: (ctx, x, len, w) => {
      ctx.fillStyle = '#e8c21c';
      ctx.beginPath();
      ctx.moveTo(x, w * 0.44);
      ctx.lineTo(x + len * 0.5, -w * 0.44);
      ctx.lineTo(x + len, -w * 0.44);
      ctx.lineTo(x + len * 0.5, w * 0.44);
      ctx.closePath();
      ctx.fill();
    },
  },
  cy_tech_panel: {
    outline: '#0a0d14', mortar: '#151b26', piece: [1.2, 1.8],
    tones: ['#2b3446', '#323c50', '#262e3e'],
    draw: (ctx, x, len, w, rand, look) => {
      panel(ctx, x, len, w, pick(look, rand));
      const n = 2 + Math.floor(rand() * 3);
      for (let i = 0; i < n; i++) dot(ctx, x + len * (0.2 + i * 0.18), -w * 0.2, w * 0.05, ['#2fff8a', '#ff3b3b', '#2fe8ff'][Math.floor(rand() * 3)]);
      box(ctx, x + len * 0.15, w * 0.04, len * 0.7, w * 0.14, '#121722', w * 0.03);
    },
  },
  cy_rusted_sheet: {
    outline: '#1a0e08', mortar: '#3a2214', piece: [0.9, 1.5],
    tones: ['#7a4a2c', '#5e5a56', '#8a4f26', '#6a6460'],
    draw: (ctx, x, len, w, rand, look) => {
      panel(ctx, x, len, w, pick(look, rand), 0.02);
      for (let i = 0; i < 3; i++) dot(ctx, x + rand() * len, (rand() - 0.5) * w * 0.6, w * (0.06 + rand() * 0.1), 'rgba(120,50,15,0.6)');
    },
  },
  cy_laser_fence: {
    outline: 'rgba(0,0,0,0)', mortar: 'rgba(0,0,0,0)', piece: [3, 3],
    tones: ['#ff2f4a'],
    draw: (ctx, x, len, w) => {
      for (const y of [-0.22, 0, 0.22]) glowLine(ctx, x, w * y, x + len, w * y, '#ff2f4a', Math.max(1, w * 0.07));
    },
    corner: (ctx, w) => {
      dot(ctx, 0, 0, w * 0.34, '#20232a');
      dot(ctx, 0, 0, w * 0.18, '#ff2f4a');
      dot(ctx, 0, 0, w * 0.07, '#ffe0e4');
    },
  },
  cy_container_wall: {
    outline: '#0e0e10', mortar: '#202226', piece: [4, 4],
    tones: ['#b8442a', '#2a6ab0', '#3a8a4a', '#c9922a', '#6a6e74'],
    draw: (ctx, x, len, w, rand, look) => {
      const c = pick(look, rand);
      box(ctx, x + w * 0.05, -w * 0.46, len - w * 0.1, w * 0.92, c, w * 0.04);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      for (let p = x + w * 0.2; p < x + len - w * 0.1; p += w * 0.22) ctx.fillRect(p, -w * 0.4, w * 0.08, w * 0.8);
    },
  },
  cy_jersey_barrier: {
    outline: '#2a2a2a', mortar: '#4a4a4a', piece: [1.6, 1.6],
    tones: ['#b8b8b2', '#a8a8a2'],
    draw: (ctx, x, len, w, rand, look) => {
      box(ctx, x + w * 0.05, -w * 0.44, len - w * 0.1, w * 0.88, pick(look, rand), w * 0.2);
      box(ctx, x + w * 0.05, -w * 0.15, len - w * 0.1, w * 0.3, '#d8d8d2', w * 0.1);
      box(ctx, x + len * 0.35, -w * 0.12, len * 0.3, w * 0.24, rand() > 0.5 ? '#d02020' : '#e8e8e8', w * 0.05);
    },
  },
  cy_server_wall: {
    outline: '#050608', mortar: '#0d0f14', piece: [1, 1],
    tones: ['#1a1d24'],
    draw: (ctx, x, len, w, rand) => {
      box(ctx, x + w * 0.03, -w * 0.46, len - w * 0.06, w * 0.92, '#1a1d24', w * 0.04);
      for (let i = 0; i < 4; i++) {
        const y = -w * 0.36 + i * w * 0.2;
        box(ctx, x + w * 0.1, y, len - w * 0.2, w * 0.13, '#252a33', w * 0.02);
        dot(ctx, x + len - w * 0.18, y + w * 0.065, w * 0.035, rand() > 0.3 ? '#2fff8a' : '#ffb02f');
        dot(ctx, x + len - w * 0.28, y + w * 0.065, w * 0.035, '#2fa8ff');
      }
    },
  },
};

// ---------- Doors and windows ----------

export function drawCyberPortal(ctx: CanvasRenderingContext2D, p: PortalItem, w: number, h: number) {
  const open = p.open || (p.openAngle ?? 0) > 1;
  const frame = (fill = '#2c313a') => {
    for (const x of [-w / 2 - h * 0.25, w / 2 - h * 0.2]) {
      box(ctx, x, -h * 0.7, h * 0.45, h * 1.4, '#0c0e12', h * 0.08);
      box(ctx, x + h * 0.05, -h * 0.64, h * 0.35, h * 1.28, fill, h * 0.06);
    }
  };
  const sill = () => box(ctx, -w / 2, -h * 0.55, w, h * 1.1, '#15171c', 2);
  const leaf = (from: number, to: number, fill: string | CanvasGradient) => box(ctx, from, -h * 0.32, to - from, h * 0.64, fill, h * 0.08);

  sill();
  switch (p.kind) {
    case 'cy_sliding': {
      const gap = open ? w * 0.4 : 0;
      leaf(-w / 2, -gap / 2 - 1, '#7a8392');
      leaf(gap / 2 + 1, w / 2, '#7a8392');
      glowLine(ctx, -w / 2 + h * 0.3, 0, -gap / 2 - h * 0.2, 0, '#2fe8ff', h * 0.12);
      glowLine(ctx, gap / 2 + h * 0.2, 0, w / 2 - h * 0.3, 0, '#2fe8ff', h * 0.12);
      frame();
      break;
    }
    case 'cy_blast': {
      if (!open) {
        leaf(-w / 2, w / 2, '#4a515c');
        ctx.fillStyle = '#e8c21c';
        for (let x = -w / 2; x < w / 2; x += h * 0.6) {
          ctx.beginPath();
          ctx.moveTo(x, h * 0.32);
          ctx.lineTo(x + h * 0.3, -h * 0.32);
          ctx.lineTo(x + h * 0.55, -h * 0.32);
          ctx.lineTo(x + h * 0.25, h * 0.32);
          ctx.fill();
        }
        box(ctx, -h * 0.2, -h * 0.42, h * 0.4, h * 0.84, '#262b33', h * 0.06);
      }
      frame('#3a404a');
      dot(ctx, w / 2 + h * 0.05, -h * 0.5, h * 0.1, open ? '#2fff8a' : '#ff3b3b');
      break;
    }
    case 'cy_shutter': {
      if (!open) {
        leaf(-w / 2, w / 2, '#8a9099');
        ctx.strokeStyle = 'rgba(30,32,36,0.6)';
        ctx.lineWidth = 1;
        for (let x = -w / 2; x < w / 2; x += h * 0.18) {
          ctx.beginPath();
          ctx.moveTo(x, -h * 0.32);
          ctx.lineTo(x, h * 0.32);
          ctx.stroke();
        }
      } else box(ctx, -w / 2, -h * 0.5, w, h * 0.18, '#8a9099', 2);
      frame();
      break;
    }
    case 'cy_airlock': {
      const r = Math.min(w, h * 2.2) * 0.45;
      dot(ctx, 0, 0, r * 1.1, '#20242c');
      if (!open) {
        for (let k = 0; k < 6; k++) {
          ctx.fillStyle = k % 2 ? '#6a7382' : '#5a6372';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, r, (k / 6) * TAU, ((k + 1) / 6) * TAU);
          ctx.fill();
        }
      } else dot(ctx, 0, 0, r * 0.8, '#0a0b0e');
      ctx.strokeStyle = '#e8c21c';
      ctx.lineWidth = h * 0.12;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.05, 0, TAU);
      ctx.stroke();
      break;
    }
    case 'cy_glass_door': {
      const g = ctx.createLinearGradient(-w / 2, -h, w / 2, h);
      g.addColorStop(0, 'rgba(180,230,255,0.85)');
      g.addColorStop(1, 'rgba(60,130,170,0.85)');
      if (!open) leaf(-w / 2 + 2, w / 2 - 2, g);
      else leaf(-w / 2 + 2, -w / 2 + w * 0.2, g);
      box(ctx, -h * 0.05, -h * 0.25, h * 0.1, h * 0.5, '#c0c8d0');
      frame('#b8c0c8');
      break;
    }
    case 'cy_holo_door': {
      if (!open) {
        ctx.save();
        ctx.globalAlpha = 0.75;
        leaf(-w / 2, w / 2, 'rgba(60,200,255,0.35)');
        ctx.restore();
        for (let y = -h * 0.25; y <= h * 0.25; y += h * 0.125) glowLine(ctx, -w / 2, y, w / 2, y, 'rgba(80,220,255,0.8)', 1);
      }
      frame('#1c2430');
      for (const x of [-w / 2, w / 2]) dot(ctx, x, 0, h * 0.14, '#2fe8ff');
      break;
    }
    case 'cy_garage': {
      if (!open) {
        leaf(-w / 2, w / 2, '#9aa0a8');
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        for (let x = -w / 2 + h * 0.2; x < w / 2; x += h * 0.45) ctx.fillRect(x, -h * 0.32, h * 0.05, h * 0.64);
      }
      frame('#5a6068');
      break;
    }
    case 'cy_turnstile': {
      const n = Math.max(2, Math.round(w / (h * 1.6)));
      for (let i = 0; i <= n; i++) {
        const x = -w / 2 + (w / n) * i;
        box(ctx, x - h * 0.18, -h * 0.6, h * 0.36, h * 1.2, '#3a414c', h * 0.08);
        dot(ctx, x, -h * 0.4, h * 0.07, open ? '#2fff8a' : '#ff3b3b');
        if (i < n) {
          ctx.strokeStyle = '#c0c8d0';
          ctx.lineWidth = h * 0.08;
          ctx.beginPath();
          ctx.moveTo(x + h * 0.2, 0);
          ctx.lineTo(x + (w / n) * (open ? 0.3 : 0.6), open ? -h * 0.3 : 0);
          ctx.stroke();
        }
      }
      break;
    }
    case 'cy_neon_window': {
      box(ctx, -w / 2, -h * 0.4, w, h * 0.8, '#1a1424', 2);
      box(ctx, -w / 2 + h * 0.15, -h * 0.22, w - h * 0.3, h * 0.44, 'rgba(120,60,200,0.65)', 2);
      glowLine(ctx, -w / 2 + h * 0.1, -h * 0.3, w / 2 - h * 0.1, -h * 0.3, '#ff3fb0', h * 0.1);
      glowLine(ctx, -w / 2 + h * 0.1, h * 0.3, w / 2 - h * 0.1, h * 0.3, '#2fe8ff', h * 0.1);
      break;
    }
    default: {
      // cy_slit_window
      box(ctx, -w / 2, -h * 0.5, w, h, '#3a3f48', 2);
      box(ctx, -w / 2 + h * 0.2, -h * 0.08, w - h * 0.4, h * 0.16, '#0c1016', 1);
      for (let x = -w / 2 + h * 0.3; x < w / 2 - h * 0.2; x += h * 0.5) box(ctx, x, -h * 0.12, h * 0.08, h * 0.24, '#8a929c');
    }
  }
}
