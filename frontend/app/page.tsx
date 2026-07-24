import Link from 'next/link';
import { MapPin, Radar, KanbanSquare } from 'lucide-react';

const upcoming = [
  { phase: 'Fase 2', title: 'Enriquecimento automático', desc: 'Site, redes, WhatsApp, tecnologias e pixels detectados sozinhos.' },
  { phase: 'Fase 5', title: 'Lead Score', desc: 'Cada empresa ganha uma pontuação explicada, não uma caixa-preta.' },
  { phase: 'Fase 7', title: 'Cards de ação de IA', desc: 'Diagnóstico, proposta e abordagem — só quando você clicar.' },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-12">
        <h1 className="font-display text-3xl font-medium text-text-primary">
          Bem-vindo ao FARO
        </h1>
        <p className="mt-2 max-w-xl text-text-secondary">
          A Fase 1 está no ar: mapa, busca por raio e filtros essenciais.
          Enriquecimento, score e IA chegam nas próximas fases.
        </p>
      </div>

      <Link
        href="/map"
        className="group flex items-center justify-between rounded-card border border-border bg-surface-1 px-6 py-5 transition-colors hover:border-gold"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-muted text-gold">
            <Radar size={20} />
          </div>
          <div>
            <p className="font-medium text-text-primary">Abrir mapa de busca</p>
            <p className="text-sm text-text-secondary">
              Escolha um ponto, um raio e comece a encontrar empresas
            </p>
          </div>
        </div>
        <MapPin className="text-text-muted transition-colors group-hover:text-gold" size={20} />
      </Link>

      <div className="mt-12">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-text-muted">
          <KanbanSquare size={14} />
          O que vem a seguir no roadmap
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {upcoming.map((item) => (
            <div
              key={item.title}
              className="rounded-card border border-border bg-surface-1 p-5"
            >
              <span className="text-xs font-medium text-gold">{item.phase}</span>
              <p className="mt-2 font-medium text-text-primary">{item.title}</p>
              <p className="mt-1 text-sm text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
