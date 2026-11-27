import { useRef } from 'react';
import {
  EDITOR_LAYER_LIMIT,
  renderMapScene,
  type RenderOptions,
} from '../engine/renderer';
import type { MapDocument } from '../types/map';

const PAN_MARGIN = 128; // extra pixels rendered around the screen so short pans need no redraw
const SHARPEN_DELAY = 140; // ms without zooming before the map is redrawn sharp

export interface SceneView {
  width: number;
  height: number;
  dpr: number;
  ppg: number;
  panX: number;
  panY: number;
}

interface Frame extends SceneView {
  doc: MapDocument;
  contentKey: string;
  margin: number;
}

/**
 * Keeps the last rendered map as a bitmap. Hovering and short pans only copy it; zooming
 * stretches it and redraws once the wheel rests; the map itself is redrawn when it changes.
 */
export function useSceneFrame(redraw: () => void) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<Frame | null>(null);
  const sharpenRef = useRef<{ ppg: number; timer: number; due: boolean } | null>(null);

  return (
    target: CanvasRenderingContext2D,
    doc: MapDocument,
    view: SceneView,
    contentKey: string,
    options: Omit<RenderOptions, 'ppg'>
  ) => {
    const { width, height, dpr, ppg, panX, panY } = view;
    const canvas = (canvasRef.current ??= document.createElement('canvas'));
    let frame = frameRef.current;

    const changed =
      !frame ||
      frame.doc !== doc ||
      frame.contentKey !== contentKey ||
      frame.width !== width ||
      frame.height !== height ||
      frame.dpr !== dpr;

    // Where the cached bitmap lands on screen under the current pan and zoom.
    const place = (f: Frame) => {
      const k = ppg / f.ppg;
      return {
        x: panX - (f.panX + f.margin) * k,
        y: panY - (f.panY + f.margin) * k,
        w: (f.width + f.margin * 2) * k,
        h: (f.height + f.margin * 2) * k,
      };
    };

    let render = changed;
    let margin = 0;
    if (frame && !changed) {
      const at = place(frame);
      const covered =
        at.x <= 0.5 && at.y <= 0.5 && at.x + at.w >= width - 0.5 && at.y + at.h >= height - 0.5;
      if (frame.ppg === ppg) {
        if (!covered) {
          render = true;
          margin = PAN_MARGIN;
        }
      } else if (!covered || sharpenRef.current?.due) {
        render = true;
      } else if (sharpenRef.current?.ppg !== ppg) {
        window.clearTimeout(sharpenRef.current?.timer);
        const pending = { ppg, timer: 0, due: false };
        pending.timer = window.setTimeout(() => {
          pending.due = true;
          redraw();
        }, SHARPEN_DELAY);
        sharpenRef.current = pending;
      }
    }

    if (render) {
      window.clearTimeout(sharpenRef.current?.timer);
      sharpenRef.current = null;
      const w = Math.floor((width + margin * 2) * dpr);
      const h = Math.floor((height + margin * 2) * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.setTransform(dpr, 0, 0, dpr, (panX + margin) * dpr, (panY + margin) * dpr);
      renderMapScene(ctx, doc, {
        ...options,
        ppg,
        overlay: false,
        maxLayerSize: EDITOR_LAYER_LIMIT,
      });
      frame = { ...view, doc, contentKey, margin };
      frameRef.current = frame;
    }

    const at = place(frame!);
    target.drawImage(canvas, at.x, at.y, at.w, at.h);
  };
}
