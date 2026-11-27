import type { MapDocument } from '../types/map';
import { extractOccluderSegments } from './lighting';
import { renderMapScene } from './renderer';

export interface ExportOptions {
  format: 'png' | 'webp' | 'dd2vtt';
  ppg: number;
  includeGrid: boolean;
  includeLighting: boolean;
  quality?: number;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportMap(doc: MapDocument, opts: ExportOptions): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(doc.width * opts.ppg);
  canvas.height = Math.round(doc.height * opts.ppg);
  const ctx = canvas.getContext('2d')!;

  renderMapScene(ctx, doc, {
    ppg: opts.ppg,
    showGrid: opts.includeGrid,
    showLighting: opts.includeLighting,
    selection: null,
    showLightHandles: false,
  });

  const safeName = doc.name.toLowerCase().replace(/[^a-z0-9-_]+/g, '-') || 'mapa';

  if (opts.format === 'dd2vtt') {
    // Universal VTT (.dd2vtt) compatible with Foundry VTT, Roll20, Fantasy Grounds, Owlbear
    const dataUrl = canvas.toDataURL('image/webp', 0.92);
    const base64Image = dataUrl.split(',')[1] ?? '';
    const level =
      doc.levels.find((l) => l.id === doc.activeLevelId) ?? doc.levels[0];

    const occluders = level ? extractOccluderSegments(level) : [];
    const lineOfSight = occluders.map((seg) => [
      { x: seg.ax, y: seg.ay },
      { x: seg.bx, y: seg.by },
    ]);

    const portals = (level?.portals ?? []).map((p) => {
      const dx = Math.cos(p.angle) * (p.width / 2);
      const dy = Math.sin(p.angle) * (p.width / 2);
      return {
        position: { x: p.x, y: p.y },
        bounds: [
          { x: p.x - dx, y: p.y - dy },
          { x: p.x + dx, y: p.y + dy },
        ],
        rotation: p.angle,
        closed: !p.open,
        freestanding: false,
      };
    });

    const lights = (level?.lights ?? []).map((l) => ({
      position: { x: l.x, y: l.y },
      range: l.radius,
      intensity: l.intensity,
      color: l.color.replace('#', 'ff'),
      shadows: l.castShadows,
    }));

    const uvtt = {
      format: 0.3,
      resolution: {
        map_origin: { x: 0, y: 0 },
        map_size: { x: doc.width, y: doc.height },
        pixels_per_grid: opts.ppg,
      },
      line_of_sight: lineOfSight,
      portals,
      environment: {
        baked_lighting: opts.includeLighting,
        ambient_light: doc.ambient.color.replace('#', 'ff'),
      },
      lights,
      image: base64Image,
    };

    const blob = new Blob([JSON.stringify(uvtt, null, 2)], {
      type: 'application/json',
    });
    triggerDownload(blob, `${safeName}.dd2vtt`);
    return;
  }

  const mime = opts.format === 'webp' ? 'image/webp' : 'image/png';
  const ext = opts.format === 'webp' ? 'webp' : 'png';

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mime, opts.quality ?? 0.94)
  );
  if (blob) {
    triggerDownload(blob, `${safeName}.${ext}`);
  }
}

export function saveProjectJson(doc: MapDocument) {
  const safeName = doc.name.toLowerCase().replace(/[^a-z0-9-_]+/g, '-') || 'mapa';
  const blob = new Blob([JSON.stringify(doc, null, 2)], {
    type: 'application/json',
  });
  triggerDownload(blob, `${safeName}.ddraft.json`);
}
