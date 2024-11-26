import { PartialType } from '@nestjs/mapped-types';
import { CreateRouletteDto } from './create-roulette.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateRouletteDto extends PartialType(CreateRouletteDto) {
  @IsOptional()
  @IsNumber()
  likes?: number;
}