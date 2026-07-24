import Link from 'next/link';
import { getCompany } from '@/lib/api';

export default async function CompanyProfilePage({ params }: { params: { id: string } }) {
  const company = await getCompany(params.id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/search" className="text-xs text-neutral-500 hover:text-faro-gold">
        ← voltar para a busca
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-neutral-100">{company.name}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {company.segment} · {company.city}, {company.state}
          </p>
        </div>
        {company.googleRating != null && (
          <span className="shrink-0 rounded-full border border-faro-gold/40 px-3 py-1 text-sm text-faro-gold">
            {company.googleRating.toFixed(1)} ★ ({company.googleReviews})
          </span>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoRow label="Endereço" value={company.address} />
        <InfoRow label="Telefone" value={company.phone} />
        <InfoRow label="WhatsApp" value={company.whatsapp} />
        <InfoRow label="E-mail" value={company.email} />
        <InfoRow label="Site" value={company.website} href={company.website ?? undefined} />
        <InfoRow label="Instagram" value={company.instagram} />
        <InfoRow label="Facebook" value={company.facebook} />
      </div>

      <div className="mt-10 rounded-md border border-faro-border bg-faro-surface2 p-4">
        <h2 className="text-sm font-medium text-neutral-200">Próximas fases</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Score, análise de anúncios, tecnologias do site e descoberta de decisor aparecem aqui a partir da Fase 2.
          Por enquanto este perfil mostra os dados básicos já salvos no banco.
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value, href }: { label: string; value: string | null; href?: string }) {
  return (
    <div className="rounded-md border border-faro-border bg-faro-surface2 p-3">
      <p className="text-xs text-neutral-500">{label}</p>
      {value ? (
        href ? (
          <a href={href} target="_blank" rel="noreferrer" className="text-sm text-faro-gold hover:underline">
            {value}
          </a>
        ) : (
          <p className="text-sm text-neutral-200">{value}</p>
        )
      ) : (
        <p className="text-sm text-neutral-700">não informado</p>
      )}
    </div>
  );
}
