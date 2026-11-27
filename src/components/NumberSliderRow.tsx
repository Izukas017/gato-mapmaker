import React from 'react';

interface NumberSliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  decimals?: number;
  onChange: (val: number) => void;
}

export function NumberSliderRow({
  label,
  value,
  min,
  max,
  step,
  suffix = '',
  decimals = 2,
  onChange,
}: NumberSliderRowProps) {
  const displayVal = Number(value.toFixed(decimals));

  return (
    <div className="control-row">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={displayVal}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            if (!Number.isNaN(parsed)) {
              onChange(parsed);
            }
          }}
          style={{
            width: 52,
            padding: '2px 4px',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            textAlign: 'right',
          }}
          aria-label={label}
        />
        {suffix && (
          <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 12 }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
