'use client';

import { Search } from 'lucide-react';
import { RadiusControl } from './RadiusControl';
import { SearchFilters } from '@/lib/types';

interface FiltersPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  loading: boolean;
  hasPoint: boolean;
}

export function FiltersPanel({
  filters,
  onChange,
  onSearch,
  loading,
  hasPoint,
}: FiltersPanelProps) {
  return (
    <aside className="flex w-full flex-col gap-6 border-r border-border bg-surface-1 p-6 lg:w-80 lg:shrink-0">
      <div>
        <h2 className="font-display text-lg font-medium text-text-primary">Filtros</h2>
        <p className="mt-1 text-sm text-text-secondary">
          {hasPoint
            ? 'Clique no mapa para mover o ponto de busca'
            : 'Clique em qualquer lugar do mapa para escolher o centro da busca'}
        </p>
      </div>

      <RadiusControl
        value={filters.radiusKm ?? 5}
        onChange={(radiusKm) => onChange({ ...filters, radiusKm })}
      />

      <div>
        <label htmlFor="segment" className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted">
          Segmento
        </label>
        <input
          id="segment"
          type="text"
          placeholder="ex: clínica, restaurante..."
          value={filters.segment ?? ''}
          onChange={(e) => onChange({ ...filters, segment: e.target.value })}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-gold"
        />
      </div>

      <div>
        <label htmlFor="city" className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted">
          Cidade
        </label>
        <input
          id="city"
          type="text"
          placeholder="ex: Santa Luzia"
          value={filters.city ?? ''}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-gold"
        />
      </div>

      <div>
        <label htmlFor="minRating" className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted">
          Avaliação mínima no Google
        </label>
        <input
          id="minRating"
          type="number"
          min={0}
          max={5}
          step={0.1}
          placeholder="ex: 4.0"
          value={filters.minGoogleRating ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              minGoogleRating: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-gold"
        />
      </div>

      <div>
        <label htmlFor="runningAds" className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted">
          Anuncia atualmente
        </label>
        <select
          id="runningAds"
          value={filters.runningAds ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              runningAds: (e.target.value || undefined) as SearchFilters['runningAds'],
            })
          }
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary focus:border-gold"
        >
          <option value="">Todos (inclui não analisadas ainda)</option>
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </select>
        <p className="mt-1 text-xs text-text-muted">
          Detecção automática de anúncios chega na Fase 3.
        </p>
      </div>

      <button
        type="button"
        onClick={onSearch}
        disabled={loading}
        className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 font-medium text-[#1a1204] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <Search size={16} />
        {loading ? 'Buscando...' : 'Buscar empresas'}
      </button>
    </aside>
  );
}
