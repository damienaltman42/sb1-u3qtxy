import { IsString, IsObject } from 'class-validator';

export class CreateWinDto {
  @IsString()
  rouletteId: string;

  @IsObject()
  prize: {
    id: string;
    text: string;
    color: string;
    probability: number;
  };
}