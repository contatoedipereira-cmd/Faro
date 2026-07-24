import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FARO — Sales Intelligence',
  description: 'Encontre, entenda e aborde as empresas certas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-black font-sans text-neutral-100 antialiased">{children}</body>
    </html>
  );
}
