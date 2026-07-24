import { Company, GeocodeResult, SearchFilters } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export async function searchCompanies(filters: SearchFilters): Promise<Company[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });

  const res = await fetch(`${API_URL}/companies/search?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Falha ao buscar empresas');
  return res.json();
}

export async function getCompany(id: string): Promise<Company> {
  const res = await fetch(`${API_URL}/companies/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Empresa não encontrada');
  return res.json();
}

export async function searchLocations(query: string): Promise<GeocodeResult[]> {
  const res = await fetch(`${API_URL}/geocode/search?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}