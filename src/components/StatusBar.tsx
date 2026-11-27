import React from 'react';
import { useMapStore } from '../store/useMapStore';

export function StatusBar() {
  const doc = useMapStore((s) => s.doc);
  const zoom = useMapStore((s) => s.zoom);
  const cursorTile = useMapStore((s) => s.cursorTile);
  const updateGrid = useMapStore((s) => s.updateGrid);

  const activeLevel =
    doc.levels.find((l) => l.id === doc.activeLevelId) ?? doc.levels[0];

  return (
    <footer className="statusbar">
      <div className="statusbar-group">
        <span>
          Mapa: {doc.width} × {doc.height} casillas
        </span>
        <span>
          Cursor: {cursorTile ? `X ${cursorTile.x.toFixed(1)}, Y ${cursorTile.y.toFixed(1)}` : '—'}
        </span>
        <span>
          Objetos: {activeLevel.objects.length} · Luces: {activeLevel.lights.length}
        </span>
      </div>

      <div className="statusbar-group">
        <button
          onClick={() => updateGrid({ snap: !doc.grid.snap })}
          style={{
            color: doc.grid.snap ? 'var(--accent-hover)' : 'var(--text-muted)',
            fontSize: 11,
            fontFamily: 'inherit',
          }}
          title="Seguir o no seguir la cuadrícula (S)"
        >
          Seguir cuadrícula: <b>{doc.grid.snap ? 'SÍ' : 'NO'}</b>
        </button>
        {doc.grid.snap && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>Ajuste:</span>
            <select
              value={doc.grid.snapSubdivision}
              onChange={(e) =>
                updateGrid({ snapSubdivision: parseInt(e.target.value, 10) as 1 | 2 | 4 })
              }
              style={{ padding: '1px 4px', fontSize: 11 }}
            >
              <option value={1}>1 casilla</option>
              <option value={2}>1/2 casilla</option>
              <option value={4}>1/4 casilla</option>
            </select>
          </label>
        )}
        <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span>Grilla:</span>
          <select
            value={doc.grid.type}
            onChange={(e) =>
              updateGrid({ type: e.target.value as 'square' | 'hex' })
            }
            style={{ padding: '1px 4px', fontSize: 11 }}
          >
            <option value="square">Cuadrada</option>
            <option value="hex">Hexagonal</option>
          </select>
        </label>
        <span>Zoom: {Math.round(zoom * 100)}%</span>
      </div>
    </footer>
  );
}
