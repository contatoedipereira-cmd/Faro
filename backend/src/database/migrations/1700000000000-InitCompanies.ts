import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitCompanies1700000000000 implements MigrationInterface {
  name = 'InitCompanies1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE "companies" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "address" varchar,
        "city" varchar,
        "state" varchar,
        "zip_code" varchar,
        "segment" varchar,
        "phone" varchar,
        "whatsapp" varchar,
        "email" varchar,
        "website" varchar,
        "instagram" varchar,
        "facebook" varchar,
        "google_rating" float,
        "google_reviews_count" int,
        "employees_estimate" varchar,
        "revenue_range_estimate" varchar,
        "running_ads" boolean,
        "location" geometry(Point, 4326),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_companies_id" PRIMARY KEY ("id")
      );
    `);

    // Índice GIST: é o que faz a busca por raio/polígono ser rápida
    // mesmo com dezenas de milhares de empresas na tabela.
    await queryRunner.query(`
      CREATE INDEX "IDX_companies_location" ON "companies" USING GIST ("location");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_companies_city" ON "companies" ("city");
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_companies_segment" ON "companies" ("segment");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "companies";`);
  }
}
