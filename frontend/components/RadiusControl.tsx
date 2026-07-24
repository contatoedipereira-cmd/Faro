'use client';

import clsx from 'clsx';

const OPTIONS = [1, 3, 5, 10, 20];

interface RadiusControlProps {
  value: number;
  onChange: (value: number) => void;
}

// Elemento de assinatura do FARO: o raio de varredura, remetendo ao
// nome da marca (o instinto que "escaneia" o mapa a partir de um ponto).
export function RadiusControl({ value, onChange }: RadiusControlProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted">
        Raio de busca
      </label>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((km) => {
          const active = km === value;
          return (
            <button
              key={km}
              type="button"
              onClick={() => onChange(km)}
              className={clsx(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all',
                active
                  ? 'border-gold bg-gold-muted text-gold shadow-[0_0_0_1px_#ed9e19] shadow-gold/20'
                  : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary',
              )}
            >
              {km} km
            </button>
          );
        })}
      </div>
    </div>
  );
}
