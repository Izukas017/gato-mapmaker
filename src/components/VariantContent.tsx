import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { isCyber } from '../engine/cyber/catalog';
import { useUiPrefs } from '../store/useUiPrefs';

interface Choice {
  id: string;
  name?: string;
  label?: string;
}

export const useCyberMode = () => useUiPrefs((s) => s.appVariant) === 'cybergato';

/**
 * Classic Gato MapMaker content inside CyberGato: a folded tab whose contents are only built
 * (thumbnails included) once it is opened.
 */
export function ClassicTab({
  count,
  open: forced,
  children,
}: {
  count: number;
  open?: boolean;
  children: () => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const shown = forced || open;
  return (
    <div className="classic-tab">
      <button className="accordion-header" onClick={() => setOpen(!open)} aria-expanded={shown}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {shown ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          Clásico · Gato MapMaker
        </span>
        <span className="accordion-count">{count}</span>
      </button>
      {shown && <div className="classic-tab-body">{children()}</div>}
    </div>
  );
}

// Gato shows only the classic list; CyberGato shows its own list and the classic one folded.
export function VariantList<A extends Choice, B extends Choice>({
  classic,
  cyber,
  render,
}: {
  classic: A[];
  cyber: B[];
  render: (items: (A | B)[]) => React.ReactNode;
}) {
  if (!useCyberMode()) return <>{render(classic)}</>;
  return (
    <>
      {render(cyber)}
      <ClassicTab count={classic.length}>{() => render(classic)}</ClassicTab>
    </>
  );
}

// <option>s for a style select; cyber styles appear in CyberGato or when already in use.
export function StyleOptions({ classic, cyber, value }: { classic: Choice[]; cyber: Choice[]; value?: string | null }) {
  const cyberMode = useCyberMode();
  const option = (o: Choice) => (
    <option key={o.id} value={o.id}>
      {o.name ?? o.label}
    </option>
  );
  if (!cyberMode && !isCyber(value)) return <>{classic.map(option)}</>;
  return (
    <>
      <optgroup label="CyberGato">{cyber.map(option)}</optgroup>
      <optgroup label="Clásico · Gato MapMaker">{classic.map(option)}</optgroup>
    </>
  );
}
