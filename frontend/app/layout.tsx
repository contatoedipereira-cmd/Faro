import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { TopNav } from '@/components/TopNav';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'FARO — Sales Intelligence',
  description: 'Encontre, entenda e aborde as empresas certas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className="font-body min-h-screen bg-background text-text-primary">
        <TopNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
