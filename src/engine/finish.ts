import { tileNoise } from './surfaces';

// Painterly finish for flat object sprites: material texture chosen by colour, volume from
// the silhouette and the inner edges, a top-left light and a dark outline.

const SIZE = 256;

function seeded(seed: number): () => number {
  let state = (seed % 2147483646) + 1;
  return () => (state = (state * 48271) % 2147483647) / 2147483647;
}

type Noise = (x: number, y: number) => number;
let noises: { wave: Noise; fine: Noise; speck: Noise; blot: Noise } | null = null;

function noise() {
  if (!noises) {
    const rand = seeded(4177);
    noises = {
      wave: tileNoise(rand, SIZE, 20, 5),
      fine: tileNoise(rand, SIZE, 128, 12),
      speck: tileNoise(rand, SIZE, 112),
      blot: tileNoise(rand, SIZE, 18),
    };
  }
  return noises;
}

// Brightness change that makes a flat colour read as a material. `along` follows the grain.
export function materialShade(
  r: number,
  g: number,
  b: number,
  along: number,
  across: number
): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const light = (max + min) / 510;
  const chroma = max - min;
  const saturation = chroma === 0 ? 0 : chroma / (255 - Math.abs(max + min - 255));
  let hue = 0;
  if (chroma > 0) {
    if (max === r) hue = ((g - b) / chroma + 6) % 6;
    else if (max === g) hue = (b - r) / chroma + 2;
    else hue = (r - g) / chroma + 4;
    hue *= 60;
  }
  const { wave, fine, speck, blot } = noise();
  const x = along & 255;
  const y = across & 255;

  if (saturation > 0.75 && light > 0.6) return 0; // flames and glows stay clean
  if (saturation < 0.16) {
    return (blot(x, y) - 0.5) * 30 + (speck(x, y) - 0.5) * 24; // stone and plain metal
  }
  if (hue >= 12 && hue < 40 && light < 0.58) {
    // wood and leather
    return Math.sin(y * 0.38 + wave(x, y) * 9) * 6 + (fine(x, y) - 0.5) * 11;
  }
  if (hue >= 36 && hue < 56 && saturation > 0.45) {
    return Math.sin((x + y) * 0.13) * 14 + (speck(x, y) - 0.5) * 12; // gold and brass
  }
  if (hue >= 65 && hue < 165) {
    return (blot(x * 2, y * 2) - 0.5) * 34 + (speck(x, y) - 0.5) * 22; // foliage
  }
  return (blot(x, y) - 0.5) * 18 + (speck(x, y) - 0.5) * 9; // cloth, paint, liquid
}

export function finishSprite(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const image = ctx.getImageData(0, 0, w, h);
  const out = image.data;
  const src = new Uint8ClampedArray(out);
  const at = (x: number, y: number) =>
    (Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))) * 4;
  const alpha = (x: number, y: number) =>
    x < 0 || y < 0 || x >= w || y >= h ? 0 : src[(y * w + x) * 4 + 3];
  const luma = (o: number) => src[o] * 0.3 + src[o + 1] * 0.59 + src[o + 2] * 0.11;
  const wide = w >= h;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      const a = src[o + 3];
      if (a < 40) {
        // Outline around solid shapes only; faint things such as cobwebs keep no border.
        const near = Math.max(alpha(x - 2, y), alpha(x + 2, y), alpha(x, y - 2), alpha(x, y + 2));
        if (near > 200 && a < near) {
          out[o] = 22;
          out[o + 1] = 14;
          out[o + 2] = 8;
          out[o + 3] = 190;
        }
        continue;
      }
      const material = materialShade(
        src[o],
        src[o + 1],
        src[o + 2],
        wide ? x : y,
        wide ? y : x
      );
      const rim = ((alpha(x + 4, y + 4) - alpha(x - 4, y - 4)) / 255) * 30;
      const emboss = Math.max(-26, Math.min(26, (luma(at(x - 2, y - 2)) - luma(at(x + 2, y + 2))) * 0.22));
      const sun = 10 - ((x / w + y / h) / 2) * 24;
      const d = material + rim + emboss + sun;
      out[o] = src[o] + d;
      out[o + 1] = src[o + 1] + d * 0.96;
      out[o + 2] = src[o + 2] + d * 0.9;
    }
  }
  ctx.putImageData(image, 0, 0);
}
