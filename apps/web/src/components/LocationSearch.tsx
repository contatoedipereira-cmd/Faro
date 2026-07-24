'use client';

import { useEffect, useRef, useState } from 'react';
import { searchLocations } from '@/lib/api';
import { GeocodeResult } from '@/lib/types';

interface Props {
  onSelect: (lat: number, lng: number, label: string) => void;
}

export default function LocationSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setLoading(true);
      searchLocations(query)
        .then((data) => {
          setResults(data);
          setOpen(true);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(result: GeocodeResult) {
    onSelect(result.lat, result.lng, result.displayName);
    setQuery(result.displayName);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="absolute left-3 top-3 z-10 w-[calc(100%-1.5rem)] max-w-sm">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Pesquisar cidade, bairro, país..."
        className="w-full rounded-md border border-faro-border bg-faro-surface2/95 px-3 py-2 text-sm text-neutral-100 shadow-lg outline-none backdrop-blur focus:border-faro-gold"
      />

      {open && (loading || results.length > 0) && (
        <div className="mt-1 max-h-64 overflow-y-auto rounded-md border border-faro-border bg-faro-surface2/95 shadow-lg backdrop-blur">
          {loading && <p className="px-3 py-2 text-xs text-neutral-500">Buscando...</p>}
          {!loading &&
            results.map((result, index) => (
              <button
                key={`${result.lat}-${result.lng}-${index}`}
                onClick={() => handleSelect(result)}
                className="block w-full truncate px-3 py-2 text-left text-xs text-neutral-300 hover:bg-black/40 hover:text-faro-gold"
              >
                {result.displayName}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}