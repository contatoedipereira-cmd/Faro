import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Representa uma empresa encontrada pelo FARO.
 *
 * Campos de enriquecimento (tecnologias, pixel, decisor, score...) chegam
 * nas Fases 2 a 5 do roadmap. Por enquanto eles existem no perfil da
 * empresa como "ainda não coletado" até os módulos correspondentes
 * rodarem sobre este registro.
 */
@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ name: 'zip_code', nullable: true })
  zipCode?: string;

  @Column({ nullable: true })
  segment?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  whatsapp?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  facebook?: string;

  @Column({ name: 'google_rating', type: 'float', nullable: true })
  googleRating?: number;

  @Column({ name: 'google_reviews_count', type: 'int', nullable: true })
  googleReviewsCount?: number;

  @Column({ name: 'employees_estimate', nullable: true })
  employeesEstimate?: string;

  @Column({ name: 'revenue_range_estimate', nullable: true })
  revenueRangeEstimate?: string;

  // null = ainda não verificado (Fase 3 é quem preenche este campo)
  @Column({ name: 'running_ads', type: 'boolean', nullable: true })
  runningAds?: boolean | null;

  // Ponto geográfico (SRID 4326). Lido/escrito via SQL bruto nas queries
  // espaciais em companies.service.ts — ver ST_MakePoint / ST_DWithin.
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
