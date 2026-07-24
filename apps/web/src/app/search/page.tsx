'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import FilterPanel from '@/components/FilterPanel';
import LocationSearch from '@/components/LocationSearch';
import ResultsList from '@/components/ResultsList';
import { searchCompanies } from '@/lib/api';
import { Company, SearchFilters } from '@/lib/types';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

// Centro padrão: Santa Luzia, MG
const DEFAULT_CENTER = { lat: -19.7697, lng: -43.8514 };

export default function SearchPage() {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lng: number; nonce: number } | null>(null);
  const [radiusEnabled, setRadiusEnabled] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({ radiusKm: 5 });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const geoFilters = radiusEnabled ? { lat: center.lat, lng: center.lng } : {};

    searchCompanies({ ...filters, ...geoFilters })
      .then((data) => {
        if (active) setCompanies(data);
      })
      .catch(() => {
        if (active) setError('Não consegui buscar as empresas. Confira se a API está rodando.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters, center, radiusEnabled]);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-faro-border bg-faro-surface px-5 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-medium tracking-tight text-faro-gold">FARO</span>
          <span className="text-xs text-neutral-500">sales intelligence</span>
        </div>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          resultCount={companies.length}
          radiusEnabled={radiusEnabled}
          onRadiusEnabledChange={setRadiusEnabled}
        />

        <div className="relative w-[45%] shrink-0 border-r border-faro-border">
          <LocationSearch
            onSelect={(lat, lng) => {
              setCenter({ lat, lng });
              setFlyToTarget({ lat, lng, nonce: Date.now() });
            }}
          />
          <Map
            companies={companies}
            center={center}
            radiusKm={filters.radiusKm}
            flyTo={flyToTarget ?? undefined}
            onMapClick={(lat, lng) => setCenter({ lat, lng })}
            onSelectCompany={(id) => window.open(`/company/${id}`, '_blank')}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <ResultsList companies={companies} loading={loading} />
        </div>
      </div>
    </div>
  );
}