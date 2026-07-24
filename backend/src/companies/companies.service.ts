import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { SearchCompaniesDto } from './dto/search-companies.dto';
import { CreateCompanyDto } from './dto/create-company.dto';

export interface CompanySearchResult extends Omit<Company, 'location'> {
  lat: number | null;
  lng: number | null;
  distanceMeters: number | null;
}

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(dto: CreateCompanyDto): Promise<Company> {
    const { lat, lng, ...rest } = dto;

    const insertResult = await this.companiesRepository
      .createQueryBuilder()
      .insert()
      .into(Company)
      .values({
        ...rest,
        location:
          lat != null && lng != null
            ? () => `ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`
            : undefined,
      })
      .returning('id')
      .execute();

    const id = insertResult.identifiers[0].id as string;
    return this.findById(id);
  }

  async findById(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Empresa ${id} não encontrada`);
    }
    return company;
  }

  /**
   * Busca combinando filtros essenciais + raio geográfico opcional.
   *
   * Com lat/lng/radiusKm: usa ST_DWithin sobre geography (metros),
   * que já considera a curvatura da Terra — importante em raios maiores.
   * Sem lat/lng: vira uma listagem filtrada, ordenada por nome.
   */
  async search(query: SearchCompaniesDto): Promise<CompanySearchResult[]> {
    const { lat, lng, radiusKm, segment, city, state, minGoogleRating, runningAds, sortBy } =
      query;

    const hasGeoSearch = lat != null && lng != null;
    const params: unknown[] = [];
    const whereClauses: string[] = [];

    let selectDistance = 'NULL as "distanceMeters"';

    if (hasGeoSearch) {
      const radiusMeters = (radiusKm ?? 5) * 1000;
      params.push(lng, lat);
      selectDistance = `ST_Distance(location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) as "distanceMeters"`;
      params.push(radiusMeters);
      whereClauses.push(
        `location IS NOT NULL AND ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $${params.length})`,
      );
    }

    if (segment) {
      params.push(`%${segment}%`);
      whereClauses.push(`segment ILIKE $${params.length}`);
    }
    if (city) {
      params.push(`%${city}%`);
      whereClauses.push(`city ILIKE $${params.length}`);
    }
    if (state) {
      params.push(state);
      whereClauses.push(`state = $${params.length}`);
    }
    if (minGoogleRating != null) {
      params.push(minGoogleRating);
      whereClauses.push(`google_rating >= $${params.length}`);
    }
    if (runningAds === 'true') {
      whereClauses.push(`running_ads = true`);
    } else if (runningAds === 'false') {
      whereClauses.push(`running_ads = false`);
    }
    // runningAds ausente = "todos", não filtra (inclui os ainda não analisados)

    const whereSql = whereClauses.length
      ? `WHERE ${whereClauses.join(' AND ')}`
      : '';

    const orderSql = hasGeoSearch && sortBy !== 'name'
      ? `ORDER BY "distanceMeters" ASC NULLS LAST`
      : sortBy === 'recent'
        ? `ORDER BY created_at DESC`
        : `ORDER BY name ASC`;

    const sql = `
      SELECT
        id, name, address, city, state,
        zip_code as "zipCode", segment, phone, whatsapp, email, website,
        instagram, facebook,
        google_rating as "googleRating", google_reviews_count as "googleReviewsCount",
        employees_estimate as "employeesEstimate", revenue_range_estimate as "revenueRangeEstimate",
        running_ads as "runningAds",
        ST_Y(location::geometry) as lat, ST_X(location::geometry) as lng,
        created_at as "createdAt", updated_at as "updatedAt",
        ${selectDistance}
      FROM companies
      ${whereSql}
      ${orderSql}
      LIMIT 200;
    `;

    return this.companiesRepository.query(sql, params);
  }
}
