'use client';

import { Company } from '@/lib/types';
import { CompanyCard } from './CompanyCard';

interface CompanyListProps {
  companies: Company[];
  loading: boolean;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}

export function CompanyList({ companies, loading, hoveredId, onHover }: CompanyListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-card border border-border bg-surface-1" />
        ))}
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
        <p className="font-medium text-text-primary">Nenhuma empresa ainda</p>
        <p className="max-w-xs text-sm text-text-secondary">
          Clique no mapa para escolher um ponto, ajuste o raio e os filtros, e clique em
          &quot;Buscar empresas&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 overflow-y-auto p-4">
      <p className="px-1 text-xs uppercase tracking-wide text-text-muted">
        {companies.length} {companies.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}
      </p>
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          active={hoveredId === company.id}
          onHover={onHover}
        />
      ))}
    </div>
  );
}
