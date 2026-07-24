import Link from 'next/link';

export function TopNav() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-medium tracking-tight text-text-primary">
            FARO
          </span>
          <span className="text-xs text-text-muted">sales intelligence</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-text-secondary">
          <Link href="/" className="hover:text-text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/map" className="hover:text-gold transition-colors">
            Mapa de busca
          </Link>
        </nav>
      </div>
    </header>
  );
}
