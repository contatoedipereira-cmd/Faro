import 'dotenv/config';
import { AppDataSource } from '../database/data-source';

/**
 * Empresas 100% fictícias, espalhadas ao redor da Grande BH, só para
 * validar mapa, filtros e busca por raio antes do motor de coleta
 * (Fase 2) trazer dados reais.
 */
const SEED_COMPANIES = [
  { name: 'Padaria Sabor da Serra', segment: 'Alimentação', city: 'Santa Luzia', state: 'MG', lat: -19.7697, lng: -43.8514, googleRating: 4.3, googleReviewsCount: 87, website: null },
  { name: 'Clínica OdontoVida', segment: 'Saúde', city: 'Santa Luzia', state: 'MG', lat: -19.7735, lng: -43.8552, googleRating: 4.7, googleReviewsCount: 143, website: 'https://odontovida.example.com' },
  { name: 'Contabilidade Rocha & Associados', segment: 'Serviços contábeis', city: 'Belo Horizonte', state: 'MG', lat: -19.9167, lng: -43.9345, googleRating: 4.1, googleReviewsCount: 32, website: null },
  { name: 'Academia Vigor Total', segment: 'Fitness', city: 'Belo Horizonte', state: 'MG', lat: -19.9245, lng: -43.9352, googleRating: 4.5, googleReviewsCount: 210, website: 'https://vigortotal.example.com' },
  { name: 'Pet Shop Amigo Fiel', segment: 'Pet', city: 'Ribeirão das Neves', state: 'MG', lat: -19.7669, lng: -44.0867, googleRating: 4.0, googleReviewsCount: 58, website: null },
  { name: 'Marcenaria Bom Corte', segment: 'Móveis planejados', city: 'Santa Luzia', state: 'MG', lat: -19.7802, lng: -43.8471, googleRating: 4.6, googleReviewsCount: 21, website: null },
  { name: 'Autopeças Central MG', segment: 'Autopeças', city: 'Belo Horizonte', state: 'MG', lat: -19.9101, lng: -43.9345, googleRating: 3.9, googleReviewsCount: 64, website: 'https://autopecascentral.example.com' },
  { name: 'Salão Estilo & Cor', segment: 'Beleza e estética', city: 'Santa Luzia', state: 'MG', lat: -19.7714, lng: -43.8489, googleRating: 4.8, googleReviewsCount: 176, website: null },
  { name: 'Agência Viaja Minas', segment: 'Turismo', city: 'Belo Horizonte', state: 'MG', lat: -19.9227, lng: -43.9451, googleRating: 4.2, googleReviewsCount: 39, website: 'https://viajaminas.example.com' },
  { name: 'Restaurante Fogo de Chão Caseiro', segment: 'Alimentação', city: 'Vespasiano', state: 'MG', lat: -19.6919, lng: -43.9236, googleRating: 4.4, googleReviewsCount: 98, website: null },
];

async function run() {
  const dataSource = await AppDataSource.initialize();

  console.log(`Semeando ${SEED_COMPANIES.length} empresas fictícias...`);

  for (const company of SEED_COMPANIES) {
    await dataSource.query(
      `
      INSERT INTO companies
        (name, segment, city, state, google_rating, google_reviews_count, website, location)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($8, $9), 4326))
      `,
      [
        company.name,
        company.segment,
        company.city,
        company.state,
        company.googleRating,
        company.googleReviewsCount,
        company.website,
        company.lng,
        company.lat,
      ],
    );
  }

  console.log('Concluído. Empresas de teste disponíveis no banco.');
  await dataSource.destroy();
}

run().catch((err) => {
  console.error('Falha ao semear o banco:', err);
  process.exit(1);
});
