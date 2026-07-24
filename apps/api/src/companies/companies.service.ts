import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SearchCompaniesDto } from './dto/search-companies.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async search(filters: SearchCompaniesDto) {
    const { lat, lng, radiusKm, segment, city, state, query, hasWebsite, hasInstagram, hasWhatsapp, minRating } =
      filters;

    const conditions: Prisma.Sql[] = [];

    if (segment) conditions.push(Prisma.sql`segment ILIKE ${'%' + segment + '%'}`);
    if (city) conditions.push(Prisma.sql`city ILIKE ${'%' + city + '%'}`);
    if (state) conditions.push(Prisma.sql`state ILIKE ${'%' + state + '%'}`);
    if (query) conditions.push(Prisma.sql`name ILIKE ${'%' + query + '%'}`);
    if (hasWebsite !== undefined) conditions.push(Prisma.sql`"hasWebsite" = ${hasWebsite === 'true'}`);
    if (hasInstagram !== undefined) conditions.push(Prisma.sql`"hasInstagram" = ${hasInstagram === 'true'}`);
    if (hasWhatsapp !== undefined) conditions.push(Prisma.sql`"hasWhatsapp" = ${hasWhatsapp === 'true'}`);
    if (minRating !== undefined) conditions.push(Prisma.sql`"googleRating" >= ${minRating}`);

    // Busca geoespacial: usa PostGIS para calcular distância e filtrar por raio,
    // sem precisar de uma coluna geography dedicada — lat/lng bastam.
    let distanceSelect = Prisma.sql`NULL::float AS distance_m`;
    if (lat !== undefined && lng !== undefined) {
      const radiusMeters = (radiusKm ?? 10) * 1000;
      distanceSelect = Prisma.sql`ST_Distance(
        ST_MakePoint(longitude, latitude)::geography,
        ST_MakePoint(${lng}, ${lat})::geography
      ) AS distance_m`;
      conditions.push(
        Prisma.sql`ST_DWithin(
          ST_MakePoint(longitude, latitude)::geography,
          ST_MakePoint(${lng}, ${lat})::geography,
          ${radiusMeters}
        )`,
      );
    }

    const whereClause = conditions.length ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}` : Prisma.empty;
    const orderClause =
      lat !== undefined && lng !== undefined ? Prisma.sql`ORDER BY distance_m ASC` : Prisma.sql`ORDER BY "createdAt" DESC`;

    return this.prisma.$queryRaw<any[]>(Prisma.sql`
      SELECT *, ${distanceSelect}
      FROM companies
      ${whereClause}
      ${orderClause}
      LIMIT 200
    `);
  }

  findOne(id: string) {
    return this.prisma.company.findUnique({ where: { id } });
  }
}
