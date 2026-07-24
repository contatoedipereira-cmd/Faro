import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dados de exemplo para desenvolvimento local — a Fase 2 substitui isso por coleta real.
const companies = [
  { name: 'Sabor de Minas Restaurante', segment: 'Restaurante', city: 'Santa Luzia', state: 'MG', address: 'Av. Aliança, 500', latitude: -19.7697, longitude: -43.8514, website: 'https://sabordeminas.example', instagram: '@sabordeminas', hasWebsite: true, hasInstagram: true, hasWhatsapp: true, whatsapp: '5531988880001', googleRating: 4.6, googleReviews: 312 },
  { name: 'OdontoVida Clínica Odontológica', segment: 'Clínica odontológica', city: 'Santa Luzia', state: 'MG', address: 'Rua das Palmeiras, 120', latitude: -19.7742, longitude: -43.8489, hasWebsite: false, hasInstagram: true, instagram: '@odontovida', hasWhatsapp: true, whatsapp: '5531988880002', googleRating: 4.9, googleReviews: 88 },
  { name: 'Studio Fit Academia', segment: 'Academia', city: 'Belo Horizonte', state: 'MG', address: 'Av. Cristiano Machado, 2200', latitude: -19.8622, longitude: -43.9142, hasWebsite: true, website: 'https://studiofit.example', hasInstagram: true, instagram: '@studiofitbh', hasWhatsapp: false, googleRating: 4.3, googleReviews: 150 },
  { name: 'Bela Hair Salão de Beleza', segment: 'Salão de beleza', city: 'Santa Luzia', state: 'MG', address: 'Rua Goiás, 45', latitude: -19.7655, longitude: -43.8570, hasWebsite: false, hasInstagram: true, instagram: '@belahairsalao', hasWhatsapp: true, whatsapp: '5531988880003', googleRating: 4.7, googleReviews: 64 },
  { name: 'Contmais Contabilidade', segment: 'Contabilidade', city: 'Belo Horizonte', state: 'MG', address: 'Av. Amazonas, 1800', latitude: -19.9245, longitude: -43.9542, hasWebsite: true, website: 'https://contmais.example', hasInstagram: false, hasWhatsapp: true, whatsapp: '5531988880004', googleRating: 4.1, googleReviews: 40 },
  { name: 'Trend Moda Loja de Roupas', segment: 'Loja de roupas', city: 'Santa Luzia', state: 'MG', address: 'Rua Rio de Janeiro, 300', latitude: -19.7710, longitude: -43.8460, hasWebsite: false, hasInstagram: true, instagram: '@trendmodasl', hasWhatsapp: true, whatsapp: '5531988880005', googleRating: 4.4, googleReviews: 97 },
  { name: 'Amigo Fiel Pet Shop', segment: 'Pet shop', city: 'Santa Luzia', state: 'MG', address: 'Av. Brasil, 890', latitude: -19.7663, longitude: -43.8558, hasWebsite: false, hasInstagram: false, hasWhatsapp: true, whatsapp: '5531988880006', googleRating: 4.8, googleReviews: 210 },
  { name: 'Oficina Motor Forte', segment: 'Oficina mecânica', city: 'Belo Horizonte', state: 'MG', address: 'Rua dos Andradas, 700', latitude: -19.9080, longitude: -43.9370, hasWebsite: false, hasInstagram: false, hasWhatsapp: false, googleRating: 3.9, googleReviews: 25 },
  { name: 'Justo & Associados Advocacia', segment: 'Escritório de advocacia', city: 'Belo Horizonte', state: 'MG', address: 'Av. Afonso Pena, 3200', latitude: -19.9312, longitude: -43.9378, hasWebsite: true, website: 'https://justoassociados.example', hasInstagram: false, hasWhatsapp: true, whatsapp: '5531988880007', googleRating: 4.5, googleReviews: 18 },
  { name: 'Madeira Nobre Marcenaria', segment: 'Marcenaria', city: 'Santa Luzia', state: 'MG', address: 'Rua Tiradentes, 210', latitude: -19.7725, longitude: -43.8602, hasWebsite: false, hasInstagram: true, instagram: '@madeiranobre', hasWhatsapp: true, whatsapp: '5531988880008', googleRating: 4.9, googleReviews: 33 },
];

async function main() {
  console.log('Limpando tabela companies...');
  await prisma.company.deleteMany();

  console.log(`Inserindo ${companies.length} empresas de exemplo...`);
  for (const c of companies) {
    await prisma.company.create({ data: c });
  }
  console.log('Seed concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
