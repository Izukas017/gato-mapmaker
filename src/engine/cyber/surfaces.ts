// CyberGato terrains, floors and roofs. Same seamless 256 px tiles as the classic ones.
import {
  clamp, cracks, earth, even, fbm, herringbone, mix, oval, pebbles, pickFrom, pixels, planks,
  type Painter, type Rand, rgb, scatter, shade, shingles, slabs, SURFACE_SIZE, tileNoise,
  wrapped, blades, grime,
} from '../surfaces';

const S = SURFACE_SIZE;

// Glowing straight line; tile-aligned coordinates keep it seamless.
function neon(ctx: CanvasRenderingContext2D, pts: [number, number][], color: string, width: number) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const path = () => {
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  };
  ctx.shadowColor = color;
  ctx.shadowBlur = width * 4;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  path();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = Math.max(0.6, width * 0.35);
  path();
  ctx.stroke();
  ctx.restore();
}

function puddles(ctx: CanvasRenderingContext2D, rand: Rand, count: number, tint: string, glints: string[]) {
  scatter(rand, count, 40, (x, y) => {
    const r = 10 + rand() * 22;
    const turn = rand() * Math.PI;
    oval(ctx, x, y, r * 1.1, r * 0.62, turn, 'rgba(8,10,18,0.45)');
    oval(ctx, x, y, r, r * 0.55, turn, tint);
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = pickFrom(rand, glints);
      ctx.lineWidth = 1.2 + rand() * 1.8;
      ctx.beginPath();
      const dx = (rand() - 0.5) * r;
      ctx.moveTo(x + dx - r * 0.3, y + (rand() - 0.5) * r * 0.3);
      ctx.lineTo(x + dx + r * 0.3, y + (rand() - 0.5) * r * 0.3);
      ctx.stroke();
    }
  });
}

function asphalt(ctx: CanvasRenderingContext2D, rand: Rand) {
  earth(ctx, rand, ['#18191d', '#212329', '#2a2c32', '#34363d'], 34, 12, 6);
  pebbles(ctx, rand, 260, 0.5, 1.6, ['#45474e', '#3a3c42', '#5a5c63']);
  cracks(ctx, rand, 8, 7, 1.2, 'rgba(6,6,8,0.7)');
  scatter(rand, 6, 30, (x, y) => oval(ctx, x, y, 8 + rand() * 16, 5 + rand() * 9, rand() * 3, 'rgba(0,0,0,0.25)'));
}

function concrete(ctx: CanvasRenderingContext2D, rand: Rand, joints: boolean) {
  earth(ctx, rand, ['#5f6266', '#6e7175', '#7d8084', '#8c8f93'], 24, 16, 5);
  scatter(rand, 10, 30, (x, y) => oval(ctx, x, y, 6 + rand() * 18, 5 + rand() * 12, rand() * 3, 'rgba(40,38,34,0.16)'));
  pebbles(ctx, rand, 90, 0.4, 1.2, ['#9a9da1', '#55585c']);
  if (joints) {
    ctx.strokeStyle = 'rgba(30,32,36,0.6)';
    ctx.lineWidth = 2;
    for (const p of [0, 128, 256]) {
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, S);
      ctx.moveTo(0, p);
      ctx.lineTo(S, p);
      ctx.stroke();
    }
  }
}

function neonTiles(ctx: CanvasRenderingContext2D, rand: Rand, color: string, base: string) {
  const gloss = fbm(rand, 6);
  slabs(
    ctx,
    rand,
    even(4, 4, 0),
    (s, tone, x, y) => shade(mix(rgb(base), rgb('#0a0a12'), tone * 0.4), (gloss(x, y) - 0.5) * 26 + (s.u + s.v < 22 ? 16 : 0)),
    '#05050a',
    1.4,
    16
  );
  for (let p = 0; p <= S; p += 64) {
    neon(ctx, [[p, 0], [p, S]], color, 1.6);
    neon(ctx, [[0, p], [S, p]], color, 1.6);
  }
}

function solidLines(ctx: CanvasRenderingContext2D, color: string, width: number, step: number, vertical: boolean) {
  ctx.fillStyle = color;
  for (let p = 0; p < S; p += step) {
    if (vertical) ctx.fillRect(p, 0, width, S);
    else ctx.fillRect(0, p, S, width);
  }
}

export const CYBER_SURFACES: Record<string, Painter> = {
  // ---------- Terrain ----------
  cy_asphalt: asphalt,
  cy_asphalt_wet: (ctx, rand) => {
    asphalt(ctx, rand);
    puddles(ctx, rand, 8, 'rgba(26,32,52,0.85)', ['rgba(255,60,200,0.6)', 'rgba(60,220,255,0.6)', 'rgba(255,200,80,0.45)']);
  },
  cy_oil_ground: (ctx, rand) => {
    asphalt(ctx, rand);
    scatter(rand, 9, 40, (x, y) => {
      const r = 10 + rand() * 20;
      const g = ctx.createRadialGradient(x, y, 1, x, y, r);
      ['rgba(20,10,30,0.9)', 'rgba(130,40,170,0.55)', 'rgba(40,160,200,0.5)', 'rgba(220,200,60,0.4)', 'rgba(10,10,10,0)'].forEach((c, i, a) => g.addColorStop(i / (a.length - 1), c));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.7, rand() * 3, 0, Math.PI * 2);
      ctx.fill();
    });
  },
  cy_concrete: (ctx, rand) => concrete(ctx, rand, true),
  cy_concrete_cracked: (ctx, rand) => {
    concrete(ctx, rand, true);
    cracks(ctx, rand, 18, 9, 2, 'rgba(26,26,28,0.8)');
    blades(ctx, rand, 60, 6, ['#4b6b2c', '#5f7d34']);
  },
  cy_sidewalk: (ctx, rand) => {
    const n = fbm(rand, 8);
    slabs(ctx, rand, even(4, 4, 0), (_s, tone, x, y) => shade(mix(rgb('#7c7f84'), rgb('#9a9ca0'), tone), (n(x, y) - 0.5) * 24), '#3e4045', 1.2, 20);
    scatter(rand, 30, 3, (x, y) => oval(ctx, x, y, 1.6, 1.6, 0, 'rgba(30,30,30,0.35)'));
  },
  cy_rubble_lot: (ctx, rand) => {
    earth(ctx, rand, ['#2c2b2a', '#3d3b38', '#4d4a46', '#5f5b55'], 30, 40);
    pebbles(ctx, rand, 320, 1.2, 6, ['#6d6a66', '#85817b', '#55524e', '#7a6656']);
    scatter(rand, 12, 20, (x, y) => {
      ctx.strokeStyle = '#7a4a2a';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rand() - 0.5) * 30, y + (rand() - 0.5) * 30);
      ctx.stroke();
    });
  },
  cy_scrap_ground: (ctx, rand) => {
    earth(ctx, rand, ['#221f1d', '#302b27', '#3e3731'], 30, 26);
    scatter(rand, 70, 14, (x, y) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rand() * Math.PI);
      const w = 4 + rand() * 12;
      const h = 2 + rand() * 6;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(-w / 2 + 1, -h / 2 + 1.5, w, h);
      ctx.fillStyle = pickFrom(rand, ['#6a6e75', '#8a5a34', '#4a5560', '#9aa0a8', '#6a3a24']);
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.restore();
    });
  },
  cy_rust_dirt: (ctx, rand) => {
    earth(ctx, rand, ['#40220f', '#5e3216', '#7e431d', '#9c5424'], 32, 34);
    pebbles(ctx, rand, 80, 1, 3.5, ['#a86a3a', '#5a3a22']);
  },
  cy_toxic_sludge: (ctx, rand) => {
    earth(ctx, rand, ['#16260c', '#244510', '#3a7314', '#72c822'], 16, 40, 4);
    scatter(rand, 60, 8, (x, y) => {
      const r = 1.5 + rand() * 4;
      ctx.strokeStyle = 'rgba(200,255,120,0.75)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      oval(ctx, x - r * 0.3, y - r * 0.3, r * 0.3, r * 0.3, 0, 'rgba(240,255,200,0.8)');
    });
  },
  cy_turf: (ctx, rand) => {
    const n = fbm(rand, 5);
    pixels(ctx, (x, y) => shade(rgb('#3f8a3a'), (n(x, y) - 0.5) * 18 + (x % 4 < 2 ? 8 : -6)));
    blades(ctx, rand, 900, 4, ['#4ea044', '#5cb44f', '#3a7d35']);
  },
  cy_wasteland: (ctx, rand) => {
    earth(ctx, rand, ['#6a5c44', '#7f6e50', '#94805c', '#a69270'], 26, 30);
    cracks(ctx, rand, 22, 4, 1.2, 'rgba(60,46,30,0.55)');
    pebbles(ctx, rand, 40, 1, 3, ['#8f8a7a', '#5f5040']);
    scatter(rand, 6, 30, (x, y) => oval(ctx, x, y, 10 + rand() * 14, 6 + rand() * 9, rand() * 3, 'rgba(120,160,40,0.18)'));
  },
  cy_slush: (ctx, rand) => {
    earth(ctx, rand, ['#6e7680', '#8c949e', '#aab2bb', '#c8cfd6'], 18, 30, 4);
    for (const x0 of [60, 82, 180, 202]) {
      ctx.strokeStyle = 'rgba(50,56,64,0.45)';
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.bezierCurveTo(x0 + 10, 80, x0 - 10, 170, x0, S);
      ctx.stroke();
    }
  },
  cy_ash: (ctx, rand) => {
    earth(ctx, rand, ['#141313', '#211f1e', '#302d2b', '#423e3b'], 26, 26);
    scatter(rand, 90, 4, (x, y) => {
      oval(ctx, x, y, 2.4, 2.4, 0, 'rgba(255,90,20,0.25)');
      oval(ctx, x, y, 0.9, 0.9, 0, pickFrom(rand, ['#ff7a1c', '#ffb02a', '#d2361a']));
    });
  },

  // ---------- Floors ----------
  cy_metal_grate: (ctx, rand) => {
    const n = fbm(rand, 6);
    pixels(ctx, (x, y) => {
      const gx = x % 16;
      const gy = y % 16;
      const bar = gx < 4 || gy < 4;
      if (!bar) return shade(rgb('#0b0c10'), (n(x, y) - 0.5) * 10);
      const lit = gx < 2 || gy < 2 ? 34 : gx < 4 && gy < 4 ? 10 : -8;
      return shade(rgb('#5f6670'), lit + (n(x, y) - 0.5) * 30);
    });
  },
  cy_diamond_plate: (ctx, rand) => {
    const n = fbm(rand, 7);
    pixels(ctx, (x, y) => {
      const cx = (x % 32) - 16;
      const cy = (y % 32) - 16;
      const flip = (Math.floor(x / 32) + Math.floor(y / 32)) % 2 === 0;
      const u = flip ? cx + cy : cx - cy;
      const v = flip ? cx - cy : cx + cy;
      const bump = Math.abs(u) < 14 && Math.abs(v) < 3.2 ? (v < 0 ? 46 : -30) : 0;
      return shade(rgb('#8a9099'), bump + (n(x, y) - 0.5) * 34);
    });
  },
  cy_neon_tile_purple: (ctx, rand) => neonTiles(ctx, rand, '#b14bff', '#1d1430'),
  cy_neon_tile_cyan: (ctx, rand) => neonTiles(ctx, rand, '#2fe8ff', '#0f1e2a'),
  cy_neon_tile_pink: (ctx, rand) => neonTiles(ctx, rand, '#ff3fb0', '#2a0f22'),
  cy_hex_tech: (ctx, rand) => {
    const n = fbm(rand, 7);
    const r = 16;
    const hw = Math.sqrt(3) * r;
    pixels(ctx, (x, y) => {
      // Nearest hex centre on a lattice that repeats every 256 px is approximated by a soft pattern.
      const row = Math.round(y / (r * 1.5));
      const cx = Math.round((x - (row % 2) * hw * 0.5) / hw) * hw + (row % 2) * hw * 0.5;
      const d = Math.hypot(x - cx, y - row * r * 1.5);
      const edge = d > r * 0.82;
      return edge ? shade(rgb('#1fd0e0'), (n(x, y) - 0.5) * 30 - 60) : shade(rgb('#141c2c'), (n(x, y) - 0.5) * 22 + (d < 4 ? 30 : 0));
    });
    scatter(rand, 18, 4, (x, y) => oval(ctx, x, y, 1.6, 1.6, 0, '#7ff6ff'));
  },
  cy_circuit: (ctx, rand) => {
    const n = fbm(rand, 6);
    pixels(ctx, (x, y) => shade(rgb('#0e3a24'), (n(x, y) - 0.5) * 22));
    for (let i = 0; i < 34; i++) {
      const color = pickFrom(rand, ['#d9b44a', '#3fe0c4', '#d9b44a']);
      let x = Math.round(rand() * 16) * 16;
      let y = Math.round(rand() * 16) * 16;
      const pts: [number, number][] = [[x, y]];
      for (let k = 0; k < 4; k++) {
        if (rand() > 0.5) x += (rand() > 0.5 ? 1 : -1) * 16 * (1 + Math.floor(rand() * 3));
        else y += (rand() > 0.5 ? 1 : -1) * 16 * (1 + Math.floor(rand() * 3));
        pts.push([x, y]);
      }
      wrapped(0, 0, S, (dx, dy) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        pts.forEach(([px, py], j) => (j ? ctx.lineTo(px + dx, py + dy) : ctx.moveTo(px + dx, py + dy)));
        ctx.stroke();
        for (const [px, py] of [pts[0], pts[pts.length - 1]]) oval(ctx, px + dx, py + dy, 3.4, 3.4, 0, color);
      });
    }
    scatter(rand, 8, 20, (x, y) => {
      ctx.fillStyle = '#121214';
      ctx.fillRect(x - 10, y - 7, 20, 14);
      ctx.fillStyle = '#9aa0a8';
      for (let k = -8; k <= 8; k += 4) {
        ctx.fillRect(x + k - 0.6, y - 9, 1.2, 2);
        ctx.fillRect(x + k - 0.6, y + 7, 1.2, 2);
      }
    });
  },
  cy_glass_floor: (ctx, rand) => {
    const n = fbm(rand, 4);
    slabs(ctx, rand, even(2, 2, 0), (s, tone, x, y) => {
      const sheen = clamp(1 - Math.abs((s.u - s.v) / 40 + 0.5)) * 50;
      return shade(mix(rgb('#163246'), rgb('#26506a'), tone), sheen + (n(x, y) - 0.5) * 20);
    }, '#c8d4dc', 1.8, 10);
  },
  cy_carbon: (ctx) => {
    pixels(ctx, (x, y) => {
      const cell = (Math.floor(x / 8) + Math.floor(y / 8)) % 2;
      const t = cell ? (x % 8) / 8 : (y % 8) / 8;
      return shade(rgb('#1a1c20'), Math.sin(t * Math.PI) * 26 - 6);
    });
  },
  cy_rubber_mat: (ctx, rand) => {
    const n = fbm(rand, 8);
    pixels(ctx, (x, y) => shade(rgb('#1c1d20'), (n(x, y) - 0.5) * 12));
    for (let x = 8; x < S; x += 16) {
      for (let y = 8; y < S; y += 16) {
        oval(ctx, x + 0.8, y + 1, 4.4, 4.4, 0, 'rgba(0,0,0,0.6)');
        oval(ctx, x, y, 4, 4, 0, '#2c2e33');
        oval(ctx, x - 1.2, y - 1.2, 1.4, 1.4, 0, 'rgba(255,255,255,0.15)');
      }
    }
  },
  cy_epoxy_white: (ctx, rand) => {
    const n = fbm(rand, 4);
    slabs(ctx, rand, even(2, 2, 0), (_s, tone, x, y) => shade(rgb('#e4e8ec'), (n(x, y) - 0.5) * 10 + tone * 6), '#a8b2bc', 0.8, 8);
  },
  cy_concrete_polished: (ctx, rand) => {
    concrete(ctx, rand, false);
    scatter(rand, 26, 40, (x, y) => {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 6 + rand() * 10;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 30, y - 30);
      ctx.stroke();
    });
  },
  cy_laminate_dark: (ctx, rand) => planks(ctx, rand, '#3a3335'),
  cy_parquet_dark: (ctx, rand) => herringbone(ctx, rand, ['#2c1f1a', '#3a2a22', '#463328', '#24190f'], '#0c0806', true),
  cy_vinyl_checker: (ctx, rand) => {
    const n = fbm(rand, 6);
    pixels(ctx, (x, y) => {
      const dark = (Math.floor(x / 32) + Math.floor(y / 32)) % 2 === 0;
      return shade(rgb(dark ? '#b8202c' : '#efe9de'), (n(x, y) - 0.5) * 14 - (x % 32 === 0 || y % 32 === 0 ? 30 : 0));
    });
  },
  cy_dance_floor: (ctx, rand) => {
    const colors = ['#ff2fa0', '#2fe0ff', '#ffe12f', '#8a3fff', '#3fff8a', '#ff7a2f'];
    for (let x = 0; x < S; x += 32) {
      for (let y = 0; y < S; y += 32) {
        const c = pickFrom(rand, colors);
        const g = ctx.createRadialGradient(x + 16, y + 16, 2, x + 16, y + 16, 22);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.35, c);
        g.addColorStop(1, '#14101c');
        ctx.fillStyle = g;
        ctx.fillRect(x, y, 32, 32);
        ctx.strokeStyle = '#08060c';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, 32, 32);
      }
    }
  },
  cy_raised_floor: (ctx, rand) => {
    slabs(ctx, rand, even(4, 4, 0), (_s, tone) => shade(rgb('#a7adb4'), tone * 10), '#4c5158', 1.4, 18);
    for (let x = 0; x < S; x += 64) {
      for (let y = 0; y < S; y += 64) {
        for (let i = 12; i < 56; i += 6) for (let j = 12; j < 56; j += 6) oval(ctx, x + i, y + j, 1.1, 1.1, 0, '#30343a');
      }
    }
  },
  cy_garage_floor: (ctx, rand) => {
    concrete(ctx, rand, false);
    scatter(rand, 5, 40, (x, y) => oval(ctx, x, y, 12 + rand() * 18, 8 + rand() * 10, rand() * 3, 'rgba(10,8,6,0.35)'));
    ctx.fillStyle = '#e8c21c';
    ctx.fillRect(0, 0, 6, S);
    ctx.fillRect(128, 0, 6, S);
  },
  cy_bathroom_tile: (ctx, rand) => {
    slabs(ctx, rand, even(16, 16, 0), (_s, tone) => shade(rgb(tone > 0.85 ? '#2fa8a0' : '#e6ecee'), tone * 8), '#9aa6aa', 0.7, 14);
  },
  cy_holo_floor: (ctx, rand) => {
    const n = fbm(rand, 5);
    pixels(ctx, (x, y) => shade(rgb('#071428'), (n(x, y) - 0.5) * 22));
    for (let p = 0; p <= S; p += 32) {
      neon(ctx, [[p, 0], [p, S]], 'rgba(60,200,255,0.55)', 0.9);
      neon(ctx, [[0, p], [S, p]], 'rgba(60,200,255,0.55)', 0.9);
    }
    scatter(rand, 12, 8, (x, y) => oval(ctx, x, y, 3, 3, 0, 'rgba(120,240,255,0.6)'));
  },
  cy_rusty_plates: (ctx, rand) => {
    const n = fbm(rand, 8);
    const rust = fbm(rand, 5);
    slabs(ctx, rand, even(2, 4, 32), (_s, tone, x, y) => mix(shade(rgb('#5d6268'), (n(x, y) - 0.5) * 30 + tone * 12), rgb('#8a4520'), clamp(rust(x, y) * 2 - 0.7)), '#1e1d1c', 1.4, 24);
    for (let y = 0; y < S; y += 128) for (let x = 0; x < S; x += 32) for (const dy of [8, 120]) oval(ctx, x + 16, y + dy, 2.4, 2.4, 0, '#9aa0a8');
  },
  cy_carpet_office: (ctx, rand) => {
    const n = fbm(rand, 7);
    const fine = tileNoise(rand, S, 128);
    pixels(ctx, (x, y) => shade(mix(rgb('#3d4554'), rgb('#4b5568'), (Math.floor(x / 64) + Math.floor(y / 64)) % 2), (n(x, y) - 0.5) * 12 + (fine(x, y) - 0.5) * 20));
  },

  // ---------- Roofs ----------
  cy_solar: (ctx, rand) => {
    slabs(ctx, rand, even(4, 2, 0), (s, tone) => {
      const cell = (Math.floor(s.u / 16) + Math.floor(s.v / 16)) % 2;
      return shade(rgb('#1c2c5a'), cell * 8 + tone * 8 + (s.u % 16 < 1 || s.v % 16 < 1 ? 40 : 0));
    }, '#b8c0ca', 2.4, 10);
  },
  cy_tar_roof: (ctx, rand) => {
    earth(ctx, rand, ['#101113', '#17181b', '#1f2024'], 24, 10);
    scatter(rand, 5, 20, (x, y) => {
      oval(ctx, x + 2, y + 3, 12, 12, 0, 'rgba(0,0,0,0.55)');
      oval(ctx, x, y, 11, 11, 0, '#6c727a');
      oval(ctx, x, y, 7, 7, 0, '#2c2f34');
    });
  },
  cy_corrugated: (ctx, rand) => {
    const n = fbm(rand, 6);
    pixels(ctx, (x, y) => shade(rgb('#7a8088'), Math.sin((x / 16) * Math.PI * 2) * 28 + (n(x, y) - 0.5) * 20 - (y % 128 < 2 ? 40 : 0)));
  },
  cy_green_roof: (ctx, rand) => {
    earth(ctx, rand, ['#26451e', '#335c26', '#41722f'], 20, 30);
    blades(ctx, rand, 700, 6, ['#4f8a3a', '#62a046', '#3a6c2c']);
    ctx.strokeStyle = '#6c6f73';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, S - 6, S - 6);
  },
  cy_roof_concrete: (ctx, rand) => {
    concrete(ctx, rand, true);
    for (let x = -S; x < S * 2; x += 24) {
      ctx.fillStyle = '#e2b51c';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 12, 0);
      ctx.lineTo(x + 24, 12);
      ctx.lineTo(x + 12, 12);
      ctx.fill();
    }
  },
  cy_glass_roof: (ctx, rand) => {
    slabs(ctx, rand, even(4, 4, 0), (s, tone) => shade(rgb('#2a5670'), tone * 14 + (s.u > s.v ? 24 : 0)), '#c0c8d0', 1.8, 10);
  },
  cy_rusty_sheet: (ctx, rand) => {
    const rust = fbm(rand, 6);
    pixels(ctx, (x, y) => mix(shade(rgb('#6a6e72'), Math.sin((x / 20) * Math.PI * 2) * 22), rgb('#8c4a22'), clamp(rust(x, y) * 2.2 - 0.6)));
    grime(ctx, rand, 'rgba(60,30,10,0.35)', 120);
  },
  cy_neon_trim: (ctx, rand) => {
    shingles(ctx, rand, 'slate', 8, 8, ['#23202e', '#2a2638', '#1d1a26'], '#0a080e');
    for (let y = 0; y < S; y += 64) neon(ctx, [[0, y + 1], [S, y + 1]], '#c04bff', 1.4);
  },
  cy_gravel_roof: (ctx, rand) => {
    earth(ctx, rand, ['#55575b', '#666a6e', '#777b80'], 30, 16);
    pebbles(ctx, rand, 700, 1, 2.8, ['#8a8d92', '#6c6f74', '#a0a3a8', '#5a5d61']);
  },
  cy_vent_roof: (ctx, rand) => {
    slabs(ctx, rand, even(2, 2, 0), (_s, tone) => shade(rgb('#5a6068'), tone * 14), '#202328', 2, 22);
    for (const [x, y] of [[64, 64], [192, 64], [64, 192], [192, 192]]) {
      oval(ctx, x, y, 40, 40, 0, '#2a2d32');
      oval(ctx, x, y, 34, 34, 0, '#121316');
      for (let k = 0; k < 5; k++) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((k / 5) * Math.PI * 2 + rand());
        oval(ctx, 16, 0, 15, 6, 0.5, '#8a9098');
        ctx.restore();
      }
      oval(ctx, x, y, 6, 6, 0, '#b8bec6');
    }
  },
};

