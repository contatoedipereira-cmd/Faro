import Link from 'next/link';
import { Company } from '@/lib/types';

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/company/${company.id}`}
      className="flex flex-col gap-1 rounded-md border border-faro-border bg-faro-surface2 p-4 transition hover:border-faro-gold/60"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-neutral-100">{company.name}</h3>
        {company.googleRating != null && (
          <span className="shrink-0 rounded-full border border-faro-gold/40 px-2 py-0.5 text-xs text-faro-gold">
            {company.googleRating.toFixed(1)} ★
          </span>
        )}
      </div>
      <p className="text-xs text-neutral-500">
        {company.segment} · {company.city}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge active={company.hasWebsite} label="site" />
        <Badge active={company.hasInstagram} label="instagram" />
        <Badge active={company.hasWhatsapp} label="whatsapp" />
      </div>
      {company.distance_m != null && (
        <p className="mt-1 text-xs text-neutral-600">{(company.distance_m / 1000).toFixed(1)} km do pino</p>
      )}
    </Link>
  );
}

function Badge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] ${
        active ? 'border-neutral-500 text-neutral-300' : 'border-faro-border text-neutral-700 line-through'
      }`}
    >
      {label}
    </span>
  );
}
