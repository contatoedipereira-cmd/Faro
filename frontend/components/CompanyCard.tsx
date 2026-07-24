'use client';

import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { Company } from '@/lib/types';

interface CompanyCardProps {
  company: Company;
  active?: boolean;
  onHover?: (id: string | null) => void;
}

export function CompanyCard({ company, active, onHover }: CompanyCardProps) {
  return (
    <Link
      href={`/companies/${company.id}`}
      onMouseEnter={() => onHover?.(company.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`block rounded-card border p-4 transition-colors ${
        active ? 'border-gold bg-surface-2' : 'border-border bg-surface-1 hover:border-border-strong'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-text-primary">{company.name}</p>
          <p className="mt-0.5 text-sm text-text-secondary">
            {company.segment ?? 'Segmento não informado'}
            {company.city ? ` · ${company.city}` : ''}
          </p>
        </div>
        {company.googleRating != null && (
          <div className="flex shrink-0 items-center gap-1 text-sm text-gold">
            <Star size={14} fill="currentColor" />
            {company.googleRating.toFixed(1)}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
        {company.distanceMeters != null && (
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {(company.distanceMeters / 1000).toFixed(1)} km
          </span>
        )}
        {company.website ? (
          <span>Tem site</span>
        ) : (
          <span className="text-gold-soft">Sem site</span>
        )}
        {company.runningAds == null ? (
          <span>Anúncios: não analisado</span>
        ) : company.runningAds ? (
          <span>Anuncia</span>
        ) : (
          <span>Não anuncia</span>
        )}
      </div>
    </Link>
  );
}
