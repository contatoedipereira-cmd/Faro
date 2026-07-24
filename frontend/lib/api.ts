import { Company, SearchFilters } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function buildQuery(filters: SearchFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export async function searchCompanies(filters: SearchFilters): Promise<Company[]> {
  const query = buildQuery(filters);
  const res = await fetch(`${API_URL}/companies/search${query ? `?${query}` : ''}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Falha ao buscar empresas (${res.status})`);
  }
  return res.json();
}

export async function getCompanyById(id: string): Promise<Company> {
  const res = await fetch(`${API_URL}/companies/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Empresa não encontrada (${res.status})`);
  }
  return res.json();
}
