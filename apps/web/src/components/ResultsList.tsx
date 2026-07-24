import { Company } from '@/lib/types';
import CompanyCard from './CompanyCard';

export default function ResultsList({ companies, loading }: { companies: Company[]; loading: boolean }) {
  if (loading) {
    return <p className="p-6 text-sm text-neutral-500">Buscando empresas...</p>;
  }

  if (companies.length === 0) {
    return <p className="p-6 text-sm text-neutral-500">Nenhuma empresa encontrada com esses filtros.</p>;
  }

  return (
    <div className="grid h-full grid-cols-1 gap-3 overflow-y-auto p-4 sm:grid-cols-2">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
