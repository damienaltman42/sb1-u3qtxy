import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAccessCodeDto {
  @IsString()
  rouletteId: string;

  @IsNumber()
  totalSpins: number;

  @IsOptional()
  @IsNumber()
  expiresIn?: number; // Days until expiration
}