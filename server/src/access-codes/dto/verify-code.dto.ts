import { IsString } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  rouletteId: string;

  @IsString()
  code: string;
}