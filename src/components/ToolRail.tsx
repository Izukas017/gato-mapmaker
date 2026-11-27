import React from 'react';
import {
  Armchair,
  BrickWall,
  DoorOpen,
  Droplets,
  Flame,
  Home,
  MousePointer2,
  Mountain,
  Route,
  SquareDashed,
} from 'lucide-react';
import { useMapStore } from '../store/useMapStore';
import type { ToolId } from '../types/map';

const TOOLS: { id: ToolId; label: string; key: string; icon: React.ReactNode }[] = [
  { id: 'select', label: 'Seleccionar', key: 'V', icon: <MousePointer2 size={18} /> },
  { id: 'terrain', label: 'Pincel de Terreno', key: 'T', icon: <Mountain size={18} /> },
  { id: 'water', label: 'Pincel de Agua', key: 'W', icon: <Droplets size={18} /> },
  { id: 'building', label: 'Edificios y Suelos', key: 'B', icon: <SquareDashed size={18} /> },
  { id: 'wall', label: 'Muros Libres', key: 'L', icon: <BrickWall size={18} /> },
  { id: 'portal', label: 'Puertas y Ventanas', key: 'P', icon: <DoorOpen size={18} /> },
  { id: 'path', label: 'Caminos y Senderos', key: 'H', icon: <Route size={18} /> },
  { id: 'object', label: 'Objetos y Mobiliario', key: 'O', icon: <Armchair size={18} /> },
  { id: 'light', label: 'Iluminación Dinámica', key: 'I', icon: <Flame size={18} /> },
  { id: 'roof', label: 'Tejados', key: 'R', icon: <Home size={18} /> },
];

export function ToolRail() {
  const activeTool = useMapStore((s) => s.activeTool);
  const setTool = useMapStore((s) => s.setTool);

  return (
    <nav className="tool-rail" aria-label="Herramientas de diseño">
      {TOOLS.map((t) => (
        <button
          key={t.id}
          className={`rail-btn ${activeTool === t.id ? 'active' : ''}`}
          onClick={() => setTool(t.id)}
          title={`${t.label} (${t.key})`}
          aria-label={t.label}
          aria-pressed={activeTool === t.id}
        >
          {t.icon}
          <span className="rail-key">{t.key}</span>
        </button>
      ))}
    </nav>
  );
}
