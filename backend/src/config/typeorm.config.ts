import { DataSourceOptions } from 'typeorm';
import { Company } from '../companies/company.entity';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER ?? 'faro',
  password: process.env.DB_PASSWORD ?? 'faro',
  database: process.env.DB_NAME ?? 'faro',
  entities: [Company],
  // As migrations controlam o schema (incluindo a extensão PostGIS e o
  // índice espacial). synchronize fica sempre desligado para evitar
  // divergência entre o schema real e o que o TypeORM "acha" que existe.
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
};
