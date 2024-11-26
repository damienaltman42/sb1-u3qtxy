import { IsString, IsArray, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class RouletteItemDto {
  @IsString()
  id: string;

  @IsString()
  text: string;

  @IsString()
  color: string;

  @IsNumber()
  probability: number;
}

class PackageDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  spins: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  isPopular?: boolean;
}

export class CreateRouletteDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RouletteItemDto)
  items: RouletteItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageDto)
  packages: PackageDto[];

  @IsOptional()
  @IsNumber()
  likes?: number;
}