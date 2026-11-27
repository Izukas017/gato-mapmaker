import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  DoorOpen,
  Hand,
  RotateCw,
  SlidersHorizontal,
  Trash2,
  Undo2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { extractOccluderSegments } from '../engine/lighting';
import { uid } from '../engine/presets';
import { getPropDefinition, getPropSprite } from '../engine/props';
import { renderMapScene, traceBrushShape } from '../engine/renderer';
import { useMapStore } from '../store/useMapStore';
import { useUiPrefs } from '../store/useUiPrefs';
import type { MapDocument, MapLevel, Point, SelectionRef } from '../types/map';

function pointInPolygon(pt: Point, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect =
      yi > pt.y !== yj > pt.y &&
      pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi + 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function distToSegment(p: Point, a: Point, b: Point): { dist: number; proj: Point; angle: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-8) {
    return { dist: Math.hypot(p.x - a.x, p.y - a.y), proj: a, angle: 0 };
  }
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
  const proj = { x: a.x + t * dx, y: a.y + t * dy };
  return {
    dist: Math.hypot(p.x - proj.x, p.y - proj.y),
    proj,
    angle: Math.atan2(dy, dx),
  };
}

function snapPoint(pt: Point, snap: boolean, sub: number): Point {
  if (!snap) return pt;
  return {
    x: Math.round(pt.x * sub) / sub,
    y: Math.round(pt.y * sub) / sub,
  };
}

function findNearestWallPoint(pt: Point, level: MapLevel): { pt: Point; angle: number } | null {
  const segs = extractOccluderSegments(level);
  let bestDist = 0.85;
  let best: { pt: Point; angle: number } | null = null;
  for (const s of segs) {
    const res = distToSegment(pt, { x: s.ax, y: s.ay }, { x: s.bx, y: s.by });
    if (res.dist < bestDist) {
      bestDist = res.dist;
      best = { pt: res.proj, angle: res.angle };
    }
  }
  return best;
}

export function MapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const doc = useMapStore((s) => s.doc);
  const activeTool = useMapStore((s) => s.activeTool);
  const toolSettings = useMapStore((s) => s.toolSettings);
  const selection = useMapStore((s) => s.selection);
  const selectedItems = useMapStore((s) => s.selectedItems);
  const zoom = useMapStore((s) => s.zoom);
  const panX = useMapStore((s) => s.panX);
  const panY = useMapStore((s) => s.panY);
  const showCanvasHints = useUiPrefs((s) => s.showCanvasHints);
  const alwaysShowLightHandles = useUiPrefs((s) => s.alwaysShowLightHandles);
  const alignToObjects = useUiPrefs((s) => s.alignToObjects);
  const zoomSpeed = useUiPrefs((s) => s.zoomSpeed);

  const setViewport = useMapStore((s) => s.setViewport);
  const setSelection = useMapStore((s) => s.setSelection);
  const toggleSelectionItem = useMapStore((s) => s.toggleSelectionItem);
  const setSelectedItems = useMapStore((s) => s.setSelectedItems);
  const setCursorTile = useMapStore((s) => s.setCursorTile);
  const updateToolSettings = useMapStore((s) => s.updateToolSettings);

  // Interactive transient drawing state
  const [hoverTile, setHoverTile] = useState<Point | null>(null);
  const [draftPoints, setDraftPoints] = useState<Point[]>([]);
  const [rectStart, setRectStart] = useState<Point | null>(null);
  const [marqueeStart, setMarqueeStart] = useState<Point | null>(null);
  const [alignGuides, setAlignGuides] = useState<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const [isPanning, setIsPanning] = useState(false);
  const [spaceDown, setSpaceDown] = useState(false);
  const [handPanMode, setHandPanMode] = useState(false);
  const [renderTick, setRenderTick] = useState(0);

  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchRef = useRef<{
    startDist: number;
    startMidX: number;
    startMidY: number;
    startZoom: number;
    startPanX: number;
    startPanY: number;
  } | null>(null);

  const dragRef = useRef<{
    mode: 'none' | 'pan' | 'move_sel' | 'terrain' | 'water' | 'scatter';
    startScreenX: number;
    startScreenY: number;
    startPanX: number;
    startPanY: number;
    lastTile: Point;
    strokePoints: Point[];
    moved: boolean;
    snapshotDoc?: MapDocument | null;
    anchorOffset?: Point;
  }>({
    mode: 'none',
    startScreenX: 0,
    startScreenY: 0,
    startPanX: 0,
    startPanY: 0,
    lastTile: { x: 0, y: 0 },
    strokePoints: [],
    moved: false,
    snapshotDoc: null,
    anchorOffset: { x: 0, y: 0 },
  });

  const activeLevel =
    doc.levels.find((l) => l.id === doc.activeLevelId) ?? doc.levels[0];

  const snapWithObjectGuides = useCallback(
    (
      pt: Point,
      excludeRefs: SelectionRef[] = []
    ): { pt: Point; guideX: number | null; guideY: number | null } => {
      if (!alignToObjects) return { pt, guideX: null, guideY: null };
      const threshold = 0.22;
      const exObj = new Set(excludeRefs.filter((r) => r.kind === 'object').map((r) => r.id));
      const exLight = new Set(excludeRefs.filter((r) => r.kind === 'light').map((r) => r.id));
      const exPortal = new Set(excludeRefs.filter((r) => r.kind === 'portal').map((r) => r.id));

      let bestDx = threshold;
      let bestDy = threshold;
      let guideX: number | null = null;
      let guideY: number | null = null;

      const check = (ox: number, oy: number) => {
        const dx = Math.abs(pt.x - ox);
        if (dx < bestDx) {
          bestDx = dx;
          guideX = ox;
        }
        const dy = Math.abs(pt.y - oy);
        if (dy < bestDy) {
          bestDy = dy;
          guideY = oy;
        }
      };

      for (const o of activeLevel.objects) {
        if (!exObj.has(o.id)) check(o.x, o.y);
      }
      for (const l of activeLevel.lights) {
        if (!exLight.has(l.id)) check(l.x, l.y);
      }
      for (const p of activeLevel.portals) {
        if (!exPortal.has(p.id)) check(p.x, p.y);
      }

      return {
        pt: {
          x: guideX !== null ? guideX : pt.x,
          y: guideY !== null ? guideY : pt.y,
        },
        guideX,
        guideY,
      };
    },
    [activeLevel, alignToObjects]
  );

  const screenToTile = useCallback(
    (clientX: number, clientY: number): Point => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      const ppg = doc.pixelsPerGrid * zoom;
      return {
        x: (sx - panX) / ppg,
        y: (sy - panY) / ppg,
      };
    },
    [doc.pixelsPerGrid, zoom, panX, panY]
  );

  // Auto-center map on first load or map size change
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 100 || rect.height < 100) return;
    const mapPxW = doc.width * doc.pixelsPerGrid;
    const mapPxH = doc.height * doc.pixelsPerGrid;
    const fitZoom = Math.min(
      (rect.width - 60) / mapPxW,
      (rect.height - 60) / mapPxH,
      1.1
    );
    const z = Math.max(0.25, Math.min(2, fitZoom));
    const px = (rect.width - mapPxW * z) / 2;
    const py = (rect.height - mapPxH * z) / 2;
    setViewport(z, px, py);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.width, doc.height, doc.name]);

  // Clear draft geometry when switching tools
  useEffect(() => {
    setDraftPoints([]);
    setRectStart(null);
  }, [activeTool]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.code === 'Space') {
        setSpaceDown(true);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) useMapStore.getState().redo();
        else useMapStore.getState().undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        useMapStore.getState().redo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        useMapStore.getState().copySelected();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        useMapStore.getState().pasteClipboard(hoverTile);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        useMapStore.getState().duplicateSelected();
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        useMapStore.getState().deleteSelected();
        return;
      }
      if (e.key === 'Escape') {
        setDraftPoints([]);
        setRectStart(null);
        setSelection(null);
        return;
      }
      if (e.key === 'Enter' && draftPoints.length >= 2) {
        commitDraftPolyline();
        return;
      }
      // Single-key tool shortcuts
      const toolMap: Record<string, typeof activeTool> = {
        v: 'select',
        t: 'terrain',
        w: 'water',
        b: 'building',
        l: 'wall',
        p: 'portal',
        h: 'path',
        o: 'object',
        i: 'light',
        r: 'roof',
      };
      const lower = e.key.toLowerCase();
      if (!e.ctrlKey && !e.altKey && !e.metaKey && lower === 's') {
        const st = useMapStore.getState();
        st.updateGrid({ snap: !st.doc.grid.snap });
        return;
      }
      if (!e.ctrlKey && !e.altKey && !e.metaKey && toolMap[lower]) {
        useMapStore.getState().setTool(toolMap[lower]);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceDown(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  });

  const commitDraftPolyline = useCallback(() => {
    const store = useMapStore.getState();
    const s = store.toolSettings;
    if (activeTool === 'building' && draftPoints.length >= 3) {
      store.addRoom({
        id: uid('room'),
        points: draftPoints,
        floor: s.floorPattern,
        wallStyle: s.buildingWallStyle,
        wallThickness: s.wallThickness,
        castShadows: true,
      });
    } else if (activeTool === 'wall' && draftPoints.length >= 2) {
      store.addWall({
        id: uid('w'),
        points: draftPoints,
        closed: false,
        style: s.wallStyle,
        thickness: s.wallThickness,
        castShadows: s.wallCastShadows,
      });
    } else if (activeTool === 'path' && draftPoints.length >= 2) {
      store.addPath({
        id: uid('path'),
        points: draftPoints,
        style: s.pathStyle,
        width: s.pathWidth,
        smooth: s.pathSmooth,
        fadeEnds: true,
      });
    } else if (activeTool === 'roof' && draftPoints.length >= 3) {
      store.addRoof({
        id: uid('roof'),
        points: draftPoints,
        style: s.roofStyle,
        ridgeAngle: 0,
        opacity: s.roofOpacity,
      });
    }
    setDraftPoints([]);
  }, [activeTool, draftPoints]);

  // Hit-testing for Select tool
  const hitTest = useCallback(
    (pt: Point, touchPad = 0): SelectionRef | null => {
      // 1. Lights
      for (let i = activeLevel.lights.length - 1; i >= 0; i--) {
        const l = activeLevel.lights[i];
        if (Math.hypot(pt.x - l.x, pt.y - l.y) <= 0.45 + touchPad) {
          return { kind: 'light', id: l.id };
        }
      }
      // 2. Portals
      for (let i = activeLevel.portals.length - 1; i >= 0; i--) {
        const p = activeLevel.portals[i];
        if (Math.hypot(pt.x - p.x, pt.y - p.y) <= Math.max(0.5, p.width * 0.5) + touchPad) {
          return { kind: 'portal', id: p.id };
        }
      }
      // 3. Objects (top-most first)
      for (let i = activeLevel.objects.length - 1; i >= 0; i--) {
        const o = activeLevel.objects[i];
        const def = getPropDefinition(o.propId, doc.customAssets);
        const rx = ((def?.widthTiles ?? 1) * Math.abs(o.scaleX)) / 2 + touchPad;
        const ry = ((def?.heightTiles ?? 1) * Math.abs(o.scaleY)) / 2 + touchPad;
        const dx = pt.x - o.x;
        const dy = pt.y - o.y;
        const cos = Math.cos(-o.rotation);
        const sin = Math.sin(-o.rotation);
        const lx = dx * cos - dy * sin;
        const ly = dx * sin + dy * cos;
        if (Math.abs(lx) <= rx && Math.abs(ly) <= ry) {
          return { kind: 'object', id: o.id };
        }
      }
      // 4. Roofs
      for (let i = activeLevel.roofs.length - 1; i >= 0; i--) {
        if (pointInPolygon(pt, activeLevel.roofs[i].points)) {
          return { kind: 'roof', id: activeLevel.roofs[i].id };
        }
      }
      // 5. Walls
      for (let i = activeLevel.walls.length - 1; i >= 0; i--) {
        const w = activeLevel.walls[i];
        for (let k = 0; k < w.points.length - 1; k++) {
          if (distToSegment(pt, w.points[k], w.points[k + 1]).dist <= 0.35) {
            return { kind: 'wall', id: w.id };
          }
        }
      }
      // 6. Paths
      for (let i = activeLevel.paths.length - 1; i >= 0; i--) {
        const p = activeLevel.paths[i];
        for (let k = 0; k < p.points.length - 1; k++) {
          if (distToSegment(pt, p.points[k], p.points[k + 1]).dist <= p.width * 0.55) {
            return { kind: 'path', id: p.id };
          }
        }
      }
      // 7. Rooms
      for (let i = activeLevel.rooms.length - 1; i >= 0; i--) {
        if (pointInPolygon(pt, activeLevel.rooms[i].points)) {
          return { kind: 'room', id: activeLevel.rooms[i].id };
        }
      }
      return null;
    },
    [activeLevel, doc.customAssets]
  );

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const cw = Math.max(1, Math.floor(rect.width));
    const ch = Math.max(1, Math.floor(rect.height));

    if (canvas.width !== Math.floor(cw * dpr) || canvas.height !== Math.floor(ch * dpr)) {
      canvas.width = Math.floor(cw * dpr);
      canvas.height = Math.floor(ch * dpr);
    }

    const ctx = canvas.getContext('2d')!;
    ctx.save();
    ctx.scale(dpr, dpr);

    // Viewport dark canvas backdrop
    ctx.fillStyle = '#0f1115';
    ctx.fillRect(0, 0, cw, ch);

    const ppg = doc.pixelsPerGrid * zoom;
    const mapW = doc.width * ppg;
    const mapH = doc.height * ppg;

    ctx.save();
    ctx.translate(panX, panY);

    // Subtle map frame shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.65)';
    ctx.shadowBlur = 32;
    ctx.fillStyle = '#181a20';
    ctx.fillRect(0, 0, mapW, mapH);
    ctx.restore();

    // Build live brush preview stroke so painting renders with real texture/water immediately
    const previewTerrainStroke =
      dragRef.current.mode === 'terrain' && dragRef.current.strokePoints.length > 0
        ? {
            id: '__preview_terrain__',
            material: toolSettings.terrainMaterial,
            points: dragRef.current.strokePoints,
            radius: toolSettings.terrainRadius,
            opacity: toolSettings.terrainOpacity,
            softness: toolSettings.terrainSoftness,
            shape: toolSettings.terrainBrushShape,
            shapeAngle: toolSettings.terrainBrushAngle,
            rectRatio: toolSettings.terrainRectRatio,
          }
        : null;

    const previewWaterStroke =
      dragRef.current.mode === 'water' && dragRef.current.strokePoints.length > 0
        ? {
            id: '__preview_water__',
            points: dragRef.current.strokePoints,
            radius: toolSettings.waterRadius,
            deepColor: toolSettings.waterDeepColor,
            shallowColor: toolSettings.waterShallowColor,
            erase: toolSettings.waterErase,
            shape: toolSettings.waterBrushShape,
            shapeAngle: toolSettings.waterBrushAngle,
            rectRatio: toolSettings.waterRectRatio,
          }
        : null;

    // Render full map
    renderMapScene(ctx, doc, {
      ppg,
      showGrid: doc.layers.grid,
      showLighting: doc.layers.lighting,
      selection,
      selectedItems,
      showLightHandles:
        alwaysShowLightHandles || activeTool === 'light' || activeTool === 'select',
      previewTerrainStroke,
      previewWaterStroke,
      onAssetLoaded: () => setRenderTick((t) => t + 1),
    });

    // Map border outline
    ctx.strokeStyle = '#3d4454';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, mapW, mapH);

    // Interactive tool previews
    if (hoverTile) {
      const snapped = snapPoint(hoverTile, doc.grid.snap, doc.grid.snapSubdivision);

      if (activeTool === 'select' && marqueeStart) {
        const x0 = Math.min(marqueeStart.x, hoverTile.x) * ppg;
        const y0 = Math.min(marqueeStart.y, hoverTile.y) * ppg;
        const w = Math.abs(hoverTile.x - marqueeStart.x) * ppg;
        const h = Math.abs(hoverTile.y - marqueeStart.y) * ppg;
        ctx.save();
        ctx.fillStyle = 'rgba(217, 140, 54, 0.14)';
        ctx.strokeStyle = '#f0a848';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 3]);
        ctx.fillRect(x0, y0, w, h);
        ctx.strokeRect(x0, y0, w, h);
        ctx.restore();
      }

      if (activeTool === 'terrain' || activeTool === 'water') {
        const isTerrain = activeTool === 'terrain';
        const r = (isTerrain ? toolSettings.terrainRadius : toolSettings.waterRadius) * ppg;
        const shape = isTerrain ? toolSettings.terrainBrushShape : toolSettings.waterBrushShape;
        const angle = isTerrain ? toolSettings.terrainBrushAngle : toolSettings.waterBrushAngle;
        const ratio = isTerrain ? toolSettings.terrainRectRatio : toolSettings.waterRectRatio;
        ctx.save();
        ctx.strokeStyle = !isTerrain
          ? toolSettings.waterErase
            ? '#f0706c'
            : '#4dc8db'
          : '#f0a848';
        ctx.lineWidth = 1.5;
        traceBrushShape(ctx, hoverTile.x * ppg, hoverTile.y * ppg, r, shape, angle, ratio);
        ctx.stroke();
        // Inner softness ring for terrain brush
        if (isTerrain && toolSettings.terrainSoftness > 0.05) {
          ctx.setLineDash([4, 4]);
          ctx.globalAlpha = 0.5;
          traceBrushShape(
            ctx,
            hoverTile.x * ppg,
            hoverTile.y * ppg,
            r * Math.max(0.1, 1 - toolSettings.terrainSoftness * 0.72),
            shape,
            angle,
            ratio
          );
          ctx.stroke();
        }
        ctx.restore();
      }

      if (activeTool === 'building' && toolSettings.buildingMode === 'rect' && rectStart) {
        const x0 = Math.min(rectStart.x, snapped.x) * ppg;
        const y0 = Math.min(rectStart.y, snapped.y) * ppg;
        const w = Math.abs(snapped.x - rectStart.x) * ppg;
        const h = Math.abs(snapped.y - rectStart.y) * ppg;
        ctx.fillStyle = 'rgba(217, 140, 54, 0.18)';
        ctx.strokeStyle = '#f0a848';
        ctx.lineWidth = 2;
        ctx.fillRect(x0, y0, w, h);
        ctx.strokeRect(x0, y0, w, h);
      }

      if (draftPoints.length > 0) {
        ctx.save();
        ctx.strokeStyle = '#f0a848';
        ctx.fillStyle = 'rgba(217, 140, 54, 0.16)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        draftPoints.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x * ppg, p.y * ppg);
          else ctx.lineTo(p.x * ppg, p.y * ppg);
        });
        ctx.lineTo(snapped.x * ppg, snapped.y * ppg);
        if (activeTool === 'building' || activeTool === 'roof') {
          ctx.fill();
        }
        ctx.stroke();
        for (const p of draftPoints) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x * ppg, p.y * ppg, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (activeTool === 'object') {
        const def = getPropDefinition(toolSettings.propId, doc.customAssets);
        if (def) {
          const objPos = !doc.grid.snap ? snapWithObjectGuides(snapped).pt : snapped;
          const pw = def.widthTiles * ppg * toolSettings.propScale;
          const ph = def.heightTiles * ppg * toolSettings.propScale;
          ctx.save();
          ctx.globalAlpha = 0.72;
          ctx.translate(objPos.x * ppg, objPos.y * ppg);
          ctx.rotate((toolSettings.propRotationDeg * Math.PI) / 180);
          const sprite = getPropSprite(toolSettings.propId);
          if (sprite) {
            ctx.drawImage(sprite, -pw / 2, -ph / 2, pw, ph);
          } else {
            ctx.strokeStyle = '#f0a848';
            ctx.strokeRect(-pw / 2, -ph / 2, pw, ph);
          }
          ctx.restore();
        }
      }

      if (activeTool === 'portal') {
        const near = findNearestWallPoint(hoverTile, activeLevel);
        const pos = near ? near.pt : snapped;
        const ang = near ? near.angle : 0;
        ctx.save();
        ctx.translate(pos.x * ppg, pos.y * ppg);
        ctx.rotate(ang);
        ctx.strokeStyle = '#4de3e8';
        ctx.fillStyle = 'rgba(77, 227, 232, 0.32)';
        ctx.lineWidth = 2;
        const w = toolSettings.portalWidth * ppg;
        ctx.fillRect(-w / 2, -ppg * 0.16, w, ppg * 0.32);
        ctx.strokeRect(-w / 2, -ppg * 0.16, w, ppg * 0.32);
        ctx.restore();
      }

      if (activeTool === 'light') {
        ctx.save();
        ctx.strokeStyle = toolSettings.lightColor;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(
          snapped.x * ppg,
          snapped.y * ppg,
          toolSettings.lightRadius * ppg,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.fillStyle = toolSettings.lightColor;
        ctx.beginPath();
        ctx.arc(snapped.x * ppg, snapped.y * ppg, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Smart alignment guide lines
    if (alignGuides.x !== null || alignGuides.y !== null) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.25;
      ctx.setLineDash([6, 4]);
      if (alignGuides.x !== null) {
        const gx = alignGuides.x * ppg;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, mapH);
        ctx.stroke();
      }
      if (alignGuides.y !== null) {
        const gy = alignGuides.y * ppg;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(mapW, gy);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();
    ctx.restore();
  }, [
    doc,
    activeLevel,
    activeTool,
    toolSettings,
    selection,
    selectedItems,
    zoom,
    panX,
    panY,
    hoverTile,
    draftPoints,
    rectStart,
    marqueeStart,
    alignGuides,
    alwaysShowLightHandles,
    snapWithObjectGuides,
    renderTick,
  ]);

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setRenderTick((t) => t + 1));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore if capture unsupported
    }

    if (typeof window !== 'undefined' && window.innerWidth <= 860) {
      const ui = useUiPrefs.getState();
      if (ui.leftPanelOpen || ui.rightPanelOpen) {
        ui.setPrefs({ leftPanelOpen: false, rightPanelOpen: false });
      }
    }

    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Two-finger touch: pinch-to-zoom + two-finger pan
    if (pointersRef.current.size >= 2) {
      dragRef.current.mode = 'none';
      dragRef.current.strokePoints = [];
      dragRef.current.snapshotDoc = null;
      setIsPanning(false);
      setRectStart(null);
      setMarqueeStart(null);
      setAlignGuides({ x: null, y: null });

      const pts = Array.from(pointersRef.current.values());
      const p1 = pts[0];
      const p2 = pts[1];
      const rect = canvasRef.current?.getBoundingClientRect();
      const midX = (p1.x + p2.x) / 2 - (rect?.left ?? 0);
      const midY = (p1.y + p2.y) / 2 - (rect?.top ?? 0);
      const dist = Math.max(12, Math.hypot(p2.x - p1.x, p2.y - p1.y));
      pinchRef.current = {
        startDist: dist,
        startMidX: midX,
        startMidY: midY,
        startZoom: zoom,
        startPanX: panX,
        startPanY: panY,
      };
      setRenderTick((t) => t + 1);
      return;
    }

    const rawTile = screenToTile(e.clientX, e.clientY);
    const snapped = snapPoint(rawTile, doc.grid.snap, doc.grid.snapSubdivision);

    // Middle button, Space+Left, Hand mode, or Right-drag pans
    if (e.button === 1 || (e.button === 0 && (spaceDown || handPanMode)) || e.button === 2) {
      setIsPanning(true);
      dragRef.current = {
        mode: 'pan',
        startScreenX: e.clientX,
        startScreenY: e.clientY,
        startPanX: panX,
        startPanY: panY,
        lastTile: rawTile,
        strokePoints: [],
        moved: false,
      };
      return;
    }

    if (e.button !== 0) return;

    const store = useMapStore.getState();

    if (activeTool === 'select') {
      const touchPad = e.pointerType === 'touch' ? 0.28 : 0;
      const hit = hitTest(rawTile, touchPad);
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        if (hit) {
          toggleSelectionItem(hit);
        } else {
          setMarqueeStart(rawTile);
        }
        return;
      }

      if (hit) {
        const alreadyIn = selectedItems.some(
          (it) => it.kind === hit.kind && it.id === hit.id
        );
        if (!alreadyIn) {
          setSelection(hit);
        }
        // Anchor offset from cursor to primary hit item center for smart alignment
        let anchorPt = snapped;
        if (hit.kind === 'object') {
          const it = activeLevel.objects.find((o) => o.id === hit.id);
          if (it) anchorPt = { x: it.x, y: it.y };
        } else if (hit.kind === 'light') {
          const it = activeLevel.lights.find((o) => o.id === hit.id);
          if (it) anchorPt = { x: it.x, y: it.y };
        } else if (hit.kind === 'portal') {
          const it = activeLevel.portals.find((o) => o.id === hit.id);
          if (it) anchorPt = { x: it.x, y: it.y };
        }
        dragRef.current = {
          mode: 'move_sel',
          startScreenX: e.clientX,
          startScreenY: e.clientY,
          startPanX: panX,
          startPanY: panY,
          lastTile: snapped,
          strokePoints: [],
          moved: false,
          snapshotDoc: store.doc,
          anchorOffset: { x: anchorPt.x - snapped.x, y: anchorPt.y - snapped.y },
        };
      } else {
        setSelection(null);
        setMarqueeStart(rawTile);
      }
      return;
    }

    if (activeTool === 'terrain') {
      dragRef.current = {
        mode: 'terrain',
        startScreenX: e.clientX,
        startScreenY: e.clientY,
        startPanX: panX,
        startPanY: panY,
        lastTile: rawTile,
        strokePoints: [rawTile],
        moved: false,
      };
      setRenderTick((t) => t + 1);
      return;
    }

    if (activeTool === 'water') {
      dragRef.current = {
        mode: 'water',
        startScreenX: e.clientX,
        startScreenY: e.clientY,
        startPanX: panX,
        startPanY: panY,
        lastTile: rawTile,
        strokePoints: [rawTile],
        moved: false,
      };
      setRenderTick((t) => t + 1);
      return;
    }

    if (activeTool === 'building') {
      if (toolSettings.buildingMode === 'rect') {
        setRectStart(snapped);
      } else {
        setDraftPoints((prev) => [...prev, snapped]);
      }
      return;
    }

    if (activeTool === 'wall' || activeTool === 'path' || activeTool === 'roof') {
      setDraftPoints((prev) => [...prev, snapped]);
      return;
    }

    if (activeTool === 'portal') {
      const near = findNearestWallPoint(rawTile, activeLevel);
      const pos = near ? near.pt : snapped;
      const angle = near ? near.angle : 0;
      const blocksLight =
        toolSettings.portalKind === 'door_wood' ||
        toolSettings.portalKind === 'door_double' ||
        toolSettings.portalKind === 'door_iron' ||
        toolSettings.portalKind === 'door_ornate_gold' ||
        toolSettings.portalKind === 'door_secret';
      store.addPortal({
        id: uid('p'),
        x: pos.x,
        y: pos.y,
        angle,
        width: toolSettings.portalWidth,
        kind: toolSettings.portalKind,
        open: toolSettings.portalOpen,
        openAngle: toolSettings.portalOpen ? toolSettings.portalOpenAngle : 0,
        blocksLight: blocksLight && !toolSettings.portalOpen,
      });
      return;
    }

    if (activeTool === 'object') {
      const placeOne = (pt: Point, randomJitter: boolean) => {
        const alignedPt =
          !doc.grid.snap && !randomJitter ? snapWithObjectGuides(pt).pt : pt;
        const rot = randomJitter
          ? Math.random() * Math.PI * 2
          : (toolSettings.propRotationDeg * Math.PI) / 180;
        const scale = randomJitter
          ? toolSettings.propScale * (0.8 + Math.random() * 0.4)
          : toolSettings.propScale;
        store.addObject({
          id: uid('obj'),
          propId: toolSettings.propId,
          x: alignedPt.x,
          y: alignedPt.y,
          scaleX: scale,
          scaleY: scale,
          rotation: rot,
          opacity: 1,
          layer: toolSettings.propLayer,
          castShadow: toolSettings.propShadow,
          shadowOffset: 1,
        });
      };

      placeOne(snapped, toolSettings.propScatter);
      if (toolSettings.propScatter) {
        dragRef.current = {
          mode: 'scatter',
          startScreenX: e.clientX,
          startScreenY: e.clientY,
          startPanX: panX,
          startPanY: panY,
          lastTile: rawTile,
          strokePoints: [],
          moved: false,
        };
      }
      return;
    }

    if (activeTool === 'light') {
      const light = {
        id: uid('l'),
        x: snapped.x,
        y: snapped.y,
        color: toolSettings.lightColor,
        radius: toolSettings.lightRadius,
        intensity: toolSettings.lightIntensity,
        castShadows: toolSettings.lightShadows,
      };
      store.addLight(light);
      setSelection({ kind: 'light', id: light.id });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (pointersRef.current.has(e.pointerId)) {
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (pointersRef.current.size >= 2 && pinchRef.current) {
      const pts = Array.from(pointersRef.current.values());
      const p1 = pts[0];
      const p2 = pts[1];
      const rect = canvasRef.current?.getBoundingClientRect();
      const midX = (p1.x + p2.x) / 2 - (rect?.left ?? 0);
      const midY = (p1.y + p2.y) / 2 - (rect?.top ?? 0);
      const dist = Math.max(12, Math.hypot(p2.x - p1.x, p2.y - p1.y));

      const p = pinchRef.current;
      const nextZoom = Math.max(0.2, Math.min(3.5, p.startZoom * (dist / p.startDist)));
      const effRatio = nextZoom / p.startZoom;
      const nextPanX = midX - (p.startMidX - p.startPanX) * effRatio;
      const nextPanY = midY - (p.startMidY - p.startPanY) * effRatio;
      setViewport(nextZoom, nextPanX, nextPanY);
      return;
    }

    if (pinchRef.current) {
      return;
    }

    const rawTile = screenToTile(e.clientX, e.clientY);
    setHoverTile(rawTile);
    setCursorTile({
      x: Math.round(rawTile.x * 10) / 10,
      y: Math.round(rawTile.y * 10) / 10,
    });

    const drag = dragRef.current;
    if (drag.mode === 'pan') {
      const dx = e.clientX - drag.startScreenX;
      const dy = e.clientY - drag.startScreenY;
      setViewport(zoom, drag.startPanX + dx, drag.startPanY + dy);
      return;
    }

    if (drag.mode === 'move_sel') {
      let target = snapPoint(rawTile, doc.grid.snap, doc.grid.snapSubdivision);
      if (!doc.grid.snap && !e.altKey && alignToObjects) {
        const off = drag.anchorOffset ?? { x: 0, y: 0 };
        const anchorTarget = {
          x: target.x + off.x,
          y: target.y + off.y,
        };
        const guided = snapWithObjectGuides(anchorTarget, selectedItems);
        target = {
          x: guided.pt.x - off.x,
          y: guided.pt.y - off.y,
        };
        setAlignGuides({ x: guided.guideX, y: guided.guideY });
      } else if (alignGuides.x !== null || alignGuides.y !== null) {
        setAlignGuides({ x: null, y: null });
      }
      const dx = target.x - drag.lastTile.x;
      const dy = target.y - drag.lastTile.y;
      if (Math.abs(dx) > 1e-4 || Math.abs(dy) > 1e-4) {
        useMapStore.getState().moveSelectedBy(dx, dy, false);
        drag.lastTile = target;
        drag.moved = true;
      }
      return;
    }

    if (activeTool === 'object' && !doc.grid.snap && !e.altKey && alignToObjects) {
      const guided = snapWithObjectGuides(rawTile);
      if (guided.guideX !== alignGuides.x || guided.guideY !== alignGuides.y) {
        setAlignGuides({ x: guided.guideX, y: guided.guideY });
      }
    } else if (alignGuides.x !== null || alignGuides.y !== null) {
      setAlignGuides({ x: null, y: null });
    }

    if (drag.mode === 'terrain' || drag.mode === 'water') {
      const last = drag.strokePoints[drag.strokePoints.length - 1];
      if (!last || Math.hypot(rawTile.x - last.x, rawTile.y - last.y) > 0.25) {
        drag.strokePoints.push(rawTile);
        setRenderTick((t) => t + 1);
      }
      return;
    }

    if (drag.mode === 'scatter') {
      const dist = Math.hypot(rawTile.x - drag.lastTile.x, rawTile.y - drag.lastTile.y);
      if (dist >= 1.35 * toolSettings.propScale) {
        drag.lastTile = rawTile;
        const scale = toolSettings.propScale * (0.8 + Math.random() * 0.4);
        useMapStore.getState().addObject({
          id: uid('obj'),
          propId: toolSettings.propId,
          x: rawTile.x + (Math.random() - 0.5) * 0.4,
          y: rawTile.y + (Math.random() - 0.5) * 0.4,
          scaleX: scale,
          scaleY: scale,
          rotation: Math.random() * Math.PI * 2,
          opacity: 1,
          layer: toolSettings.propLayer,
          castShadow: toolSettings.propShadow,
          shadowOffset: 1,
        });
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointersRef.current.delete(e.pointerId);

    if (pinchRef.current) {
      if (pointersRef.current.size === 0) {
        pinchRef.current = null;
      }
      dragRef.current.mode = 'none';
      dragRef.current.strokePoints = [];
      return;
    }

    const rawTile = screenToTile(e.clientX, e.clientY);
    const snapped = snapPoint(rawTile, doc.grid.snap, doc.grid.snapSubdivision);
    const drag = dragRef.current;

    if (drag.mode === 'pan') {
      setIsPanning(false);
    } else if (drag.mode === 'move_sel') {
      if (drag.moved && drag.snapshotDoc) {
        useMapStore.getState().commitSnapshot(drag.snapshotDoc);
      }
      drag.snapshotDoc = null;
      setAlignGuides({ x: null, y: null });
    } else if (drag.mode === 'terrain' && drag.strokePoints.length > 0) {
      useMapStore.getState().addTerrainStroke({
        id: uid('ts'),
        material: toolSettings.terrainMaterial,
        points: drag.strokePoints,
        radius: toolSettings.terrainRadius,
        opacity: toolSettings.terrainOpacity,
        softness: toolSettings.terrainSoftness,
        shape: toolSettings.terrainBrushShape,
        shapeAngle: toolSettings.terrainBrushAngle,
        rectRatio: toolSettings.terrainRectRatio,
      });
    } else if (drag.mode === 'water' && drag.strokePoints.length > 0) {
      useMapStore.getState().addWaterStroke({
        id: uid('ws'),
        points: drag.strokePoints,
        radius: toolSettings.waterRadius,
        deepColor: toolSettings.waterDeepColor,
        shallowColor: toolSettings.waterShallowColor,
        erase: toolSettings.waterErase,
        shape: toolSettings.waterBrushShape,
        shapeAngle: toolSettings.waterBrushAngle,
        rectRatio: toolSettings.waterRectRatio,
      });
    }

    if (activeTool === 'select' && marqueeStart) {
      const minX = Math.min(marqueeStart.x, rawTile.x);
      const maxX = Math.max(marqueeStart.x, rawTile.x);
      const minY = Math.min(marqueeStart.y, rawTile.y);
      const maxY = Math.max(marqueeStart.y, rawTile.y);
      if (maxX - minX > 0.25 || maxY - minY > 0.25) {
        const boxed: SelectionRef[] = [];
        for (const o of activeLevel.objects) {
          if (o.x >= minX && o.x <= maxX && o.y >= minY && o.y <= maxY) {
            boxed.push({ kind: 'object', id: o.id });
          }
        }
        for (const l of activeLevel.lights) {
          if (l.x >= minX && l.x <= maxX && l.y >= minY && l.y <= maxY) {
            boxed.push({ kind: 'light', id: l.id });
          }
        }
        for (const p of activeLevel.portals) {
          if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) {
            boxed.push({ kind: 'portal', id: p.id });
          }
        }
        if (e.ctrlKey || e.metaKey || e.shiftKey) {
          const merged = [...selectedItems];
          for (const b of boxed) {
            if (!merged.some((m) => m.kind === b.kind && m.id === b.id)) {
              merged.push(b);
            }
          }
          setSelectedItems(merged);
        } else {
          setSelectedItems(boxed);
        }
      }
      setMarqueeStart(null);
    }

    if (activeTool === 'building' && toolSettings.buildingMode === 'rect' && rectStart) {
      const x0 = Math.min(rectStart.x, snapped.x);
      const y0 = Math.min(rectStart.y, snapped.y);
      const x1 = Math.max(rectStart.x, snapped.x);
      const y1 = Math.max(rectStart.y, snapped.y);
      if (x1 - x0 >= 0.4 && y1 - y0 >= 0.4) {
        useMapStore.getState().addRoom({
          id: uid('room'),
          points: [
            { x: x0, y: y0 },
            { x: x1, y: y0 },
            { x: x1, y: y1 },
            { x: x0, y: y1 },
          ],
          floor: toolSettings.floorPattern,
          wallStyle: toolSettings.buildingWallStyle,
          wallThickness: toolSettings.wallThickness,
          castShadows: true,
        });
      }
      setRectStart(null);
    }

    dragRef.current.mode = 'none';
    dragRef.current.strokePoints = [];
  };

  const handleDoubleClick = () => {
    if (draftPoints.length >= 2) {
      commitDraftPolyline();
    }
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      // Ctrl + Wheel: zoom the map centered on the cursor
      if (e.ctrlKey || e.metaKey) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const stepIn = zoomSpeed === 'slow' ? 1.06 : zoomSpeed === 'fast' ? 1.22 : 1.12;
        const factor = e.deltaY < 0 ? stepIn : 1 / stepIn;
        const nextZoom = Math.max(0.2, Math.min(3.5, zoom * factor));
        const ratio = nextZoom / zoom;
        const nextPanX = mx - (mx - panX) * ratio;
        const nextPanY = my - (my - panY) * ratio;
        setViewport(nextZoom, nextPanX, nextPanY);
        return;
      }

      // Shift + Wheel: rotate active prop/brush, or pan horizontally
      if (e.shiftKey) {
        const step = e.deltaY > 0 ? 15 : -15;
        if (activeTool === 'object') {
          updateToolSettings({
            propRotationDeg: (toolSettings.propRotationDeg + step + 360) % 360,
          });
          return;
        }
        if (activeTool === 'terrain' && toolSettings.terrainBrushShape !== 'circle') {
          updateToolSettings({
            terrainBrushAngle: (toolSettings.terrainBrushAngle + step + 360) % 360,
          });
          return;
        }
        if (activeTool === 'water' && toolSettings.waterBrushShape !== 'circle') {
          updateToolSettings({
            waterBrushAngle: (toolSettings.waterBrushAngle + step + 360) % 360,
          });
          return;
        }
        setViewport(zoom, panX - e.deltaY * 0.65, panY);
        return;
      }

      // Plain Wheel: pan vertically (and horizontally on trackpad deltaX)
      setViewport(zoom, panX - e.deltaX * 0.65, panY - e.deltaY * 0.65);
    },
    [
      activeTool,
      panX,
      panY,
      setViewport,
      toolSettings.propRotationDeg,
      toolSettings.terrainBrushAngle,
      toolSettings.terrainBrushShape,
      toolSettings.waterBrushAngle,
      toolSettings.waterBrushShape,
      updateToolSettings,
      zoom,
      zoomSpeed,
    ]
  );

  // Attach non-passive wheel listener so Ctrl+Wheel never triggers browser page zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const toolHint = (() => {
    switch (activeTool) {
      case 'select':
        return 'Clic o recuadro para seleccionar · Ctrl+Clic selección múltiple · Ctrl+C/V copiar/pegar · Ctrl+D duplicar · Supr borrar';
      case 'terrain':
        return 'Arrastra para pintar terreno suavizado sobre el mapa';
      case 'water':
        return 'Arrastra para pintar agua con orilla automática';
      case 'building':
        return toolSettings.buildingMode === 'rect'
          ? 'Arrastra para crear una habitación con suelo y muros'
          : 'Clic para añadir vértices · Doble clic o Enter para cerrar la habitación';
      case 'wall':
        return 'Clic para trazar segmentos de muro · Doble clic o Enter para terminar';
      case 'portal':
        return 'Acércate a un muro y haz clic para encajar puerta o ventana automáticamente';
      case 'path':
        return 'Clic para trazar un camino · Doble clic o Enter para finalizar';
      case 'object':
        return 'Clic para colocar objeto · Shift + Rueda para rotar · Activa Dispersión para pintar bosques';
      case 'light':
        return 'Clic para colocar una fuente de luz dinámica con sombras en tiempo real';
      case 'roof':
        return 'Clic para marcar vértices del tejado · Doble clic o Enter para cerrar';
    }
  })();

  const minDraftPts = activeTool === 'building' || activeTool === 'roof' ? 3 : 2;
  const selectedObj =
    selection?.kind === 'object'
      ? activeLevel.objects.find((o) => o.id === selection.id) ?? null
      : null;
  const selectedPortal =
    selection?.kind === 'portal'
      ? activeLevel.portals.find((p) => p.id === selection.id) ?? null
      : null;

  const zoomCentered = (factor: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const cx = rect ? rect.width / 2 : 300;
    const cy = rect ? rect.height / 2 : 300;
    const nextZoom = Math.max(0.2, Math.min(3.5, zoom * factor));
    const ratio = nextZoom / zoom;
    setViewport(nextZoom, cx - (cx - panX) * ratio, cy - (cy - panY) * ratio);
  };

  return (
    <div
      ref={containerRef}
      className="canvas-stage"
      style={{
        cursor:
          isPanning || spaceDown || handPanMode
            ? 'grabbing'
            : activeTool === 'select'
              ? 'default'
              : 'crosshair',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(e) => e.preventDefault()}
      />

      <div className="canvas-floating-controls">
        <button
          type="button"
          className={`canvas-fab-btn ${handPanMode ? 'active' : ''}`}
          onClick={() => setHandPanMode((v) => !v)}
          title="Modo Mano: arrastrar mapa con 1 dedo o clic"
          aria-label="Modo Mano para mover el mapa"
          aria-pressed={handPanMode}
        >
          <Hand size={16} />
        </button>
        <button
          type="button"
          className="canvas-fab-btn"
          onClick={() => zoomCentered(1.2)}
          title="Acercar mapa"
          aria-label="Acercar"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          className="canvas-fab-btn"
          onClick={() => zoomCentered(1 / 1.2)}
          title="Alejar mapa"
          aria-label="Alejar"
        >
          <ZoomOut size={16} />
        </button>
      </div>

      {draftPoints.length > 0 && (
        <div className="canvas-action-bar" role="toolbar" aria-label="Acciones de trazado">
          <span className="canvas-action-count">{draftPoints.length} pts</span>
          <button
            type="button"
            className="action-pill-btn primary"
            disabled={draftPoints.length < minDraftPts}
            onClick={commitDraftPolyline}
          >
            <Check size={14} /> Terminar
          </button>
          <button
            type="button"
            className="action-pill-btn"
            onClick={() => setDraftPoints((prev) => prev.slice(0, -1))}
          >
            <Undo2 size={14} /> Punto
          </button>
          <button
            type="button"
            className="action-pill-btn danger"
            onClick={() => setDraftPoints([])}
          >
            <X size={14} /> Cancelar
          </button>
        </div>
      )}

      {selectedItems.length > 0 && draftPoints.length === 0 && (
        <div className="canvas-selection-bar" role="toolbar" aria-label="Acciones rápidas de selección">
          {selectedObj && (
            <button
              type="button"
              className="action-pill-btn"
              onClick={() =>
                useMapStore.getState().updateSelectedObject({
                  rotation: (selectedObj.rotation + Math.PI / 4) % (Math.PI * 2),
                })
              }
            >
              <RotateCw size={14} /> +45°
            </button>
          )}
          {selectedPortal && (
            <button
              type="button"
              className="action-pill-btn"
              onClick={() => {
                const nextOpen = !selectedPortal.open;
                const isSolidDoor =
                  selectedPortal.kind === 'door_wood' ||
                  selectedPortal.kind === 'door_double' ||
                  selectedPortal.kind === 'door_iron' ||
                  selectedPortal.kind === 'door_ornate_gold' ||
                  selectedPortal.kind === 'door_secret';
                useMapStore.getState().updateSelectedPortal({
                  open: nextOpen,
                  openAngle: nextOpen ? (selectedPortal.openAngle || 90) : 0,
                  blocksLight: isSolidDoor && !nextOpen,
                });
              }}
            >
              <DoorOpen size={14} /> {selectedPortal.open ? 'Cerrar' : 'Abrir'}
            </button>
          )}
          <button
            type="button"
            className="action-pill-btn"
            onClick={() => useMapStore.getState().duplicateSelected()}
          >
            <Copy size={14} /> Duplicar
          </button>
          <button
            type="button"
            className="action-pill-btn"
            onClick={() => useUiPrefs.getState().setPrefs({ rightPanelOpen: true })}
          >
            <SlidersHorizontal size={14} /> Editar
          </button>
          <button
            type="button"
            className="action-pill-btn danger"
            onClick={() => useMapStore.getState().deleteSelected()}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {showCanvasHints && draftPoints.length === 0 && (
        <div className="canvas-hint-pill">{toolHint}</div>
      )}
    </div>
  );
}
