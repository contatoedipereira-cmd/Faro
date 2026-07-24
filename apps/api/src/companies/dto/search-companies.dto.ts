import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchCompaniesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lng?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  @Max(100)
  radiusKm?: number;

  @IsOptional()
  @IsString()
  segment?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  hasWebsite?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  hasInstagram?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  hasWhatsapp?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;
}
