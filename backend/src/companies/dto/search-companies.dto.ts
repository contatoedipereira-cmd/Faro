import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SearchCompaniesDto {
  // Ponto central da busca (opcional — sem ele, a busca vira uma
  // listagem filtrada por texto, sem raio geográfico)
  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  lat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  lng?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.5)
  @Max(50)
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
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minGoogleRating?: number;

  // 'true' | 'false' | ausente (= "todos") — ver companies.service.ts
  @IsOptional()
  @IsBooleanString()
  runningAds?: string;

  @IsOptional()
  @IsIn(['distance', 'name', 'recent'])
  sortBy?: 'distance' | 'name' | 'recent';
}
