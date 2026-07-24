'use client';

import { SearchFilters } from '@/lib/types';

const RADIUS_OPTIONS = [1, 3, 5, 10, 20, 50];

interface Props {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
  resultCount: number;
  radiusEnabled: boolean;
  onRadiusEnabledChange: (enabled: boolean) => void;
}

export default function FilterPanel({ filters, onChange, resultCount, radiusEnabled, onRadiusEnabledChange }: Props) {
  function set<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function toggleTri(key: 'hasWebsite' | 'hasInstagram' | 'hasWhatsapp') {
    const current = filters[key];
    const next = current === 'true' ? 'false' : current === 'false' ? undefined : 'true';
    set(key, next);
  }

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col gap-6 overflow-y-auto border-r border-faro-border bg-faro-surface p-5">
      <div>
        <h2 className="text-sm font-medium text-neutral-200">Filtros</h2>
        <p className="mt-1 text-xs text-neutral-500">{resultCount} empresas encontradas</p>
      </div>

      <Field label="Buscar por nome">
        <input
          type="text"
          value={filters.query ?? ''}
          onChange={(e) => set('query', e.target.value || undefined)}
          placeholder="Ex: clínica, restaurante..."
          className="w-full rounded-md border border-faro-border bg-faro-surface2 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-faro-gold"
        />
      </Field>

      <Field label="Segmento">
        <input
          type="text"
          value={filters.segment ?? ''}
          onChange={(e) => set('segment', e.target.value || undefined)}
          placeholder="Ex: academia"
          className="w-full rounded-md border border-faro-border bg-faro-surface2 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-faro-gold"
        />
      </Field>

      <Field label="Cidade">
        <input
          type="text"
          value={filters.city ?? ''}
          onChange={(e) => set('city', e.target.value || undefined)}
          placeholder="Ex: Santa Luzia"
          className="w-full rounded-md border border-faro-border bg-faro-surface2 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-faro-gold"
        />
      </Field>

      <Field label="Raio de busca a partir do pino">
        <label className="mb-2 flex items-center gap-2 text-xs text-neutral-400">
          <input
            type="checkbox"
            checked={radiusEnabled}
            onChange={(e) => onRadiusEnabledChange(e.target.checked)}
            className="accent-faro-gold"
          />
          Restringir por proximidade do pino
        </label>
        <div className={`flex flex-wrap gap-2 ${radiusEnabled ? '' : 'pointer-events-none opacity-40'}`}>
          {RADIUS_OPTIONS.map((km) => (
            <button
              key={km}
              onClick={() => set('radiusKm', km)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                filters.radiusKm === km
                  ? 'border-faro-gold bg-faro-gold/10 text-faro-gold'
                  : 'border-faro-border text-neutral-400 hover:border-neutral-500'
              }`}
            >
              {km} km
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-neutral-600">
          {radiusEnabled
            ? 'Clique no mapa para posicionar o pino'
            : 'Desligado — a busca ignora a posição do pino e considera empresas de qualquer lugar'}
        </p>
      </Field>

      <div className="flex flex-col gap-3 border-t border-faro-border pt-4">
        <FilterToggleRow label="Possui site" value={filters.hasWebsite} onClick={() => toggleTri('hasWebsite')} />
        <FilterToggleRow
          label="Instagram ativo"
          value={filters.hasInstagram}
          onClick={() => toggleTri('hasInstagram')}
        />
        <FilterToggleRow label="WhatsApp" value={filters.hasWhatsapp} onClick={() => toggleTri('hasWhatsapp')} />
      </div>

      <Field label="Avaliação mínima no Google">
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={filters.minRating ?? 0}
          onChange={(e) => set('minRating', Number(e.target.value) || undefined)}
          className="w-full accent-faro-gold"
        />
        <span className="text-xs text-neutral-500">{filters.minRating ? `${filters.minRating}+` : 'qualquer'}</span>
      </Field>

      <div className="mt-auto rounded-md border border-faro-border bg-faro-surface2 p-3 text-xs text-neutral-500">
        Anúncios, tecnologias do site e descoberta de decisor chegam nas próximas fases — os filtros acima já
        funcionam de verdade sobre o banco de dados.
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-neutral-400">{label}</label>
      {children}
    </div>
  );
}

function FilterToggleRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value?: 'true' | 'false';
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between rounded-md border border-faro-border px-3 py-2 text-left text-sm text-neutral-300 hover:border-neutral-500"
    >
      <span>{label}</span>
      <span
        className={
          value === 'true' ? 'text-faro-gold' : value === 'false' ? 'text-neutral-500' : 'text-neutral-600'
        }
      >
        {value === 'true' ? 'sim' : value === 'false' ? 'não' : 'tanto faz'}
      </span>
    </button>
  );
}