import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoulettesService } from './roulettes.service';
import { RoulettesController } from './roulettes.controller';
import { Roulette } from './entities/roulette.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roulette])],
  providers: [RoulettesService],
  controllers: [RoulettesController],
  exports: [RoulettesService],
})
export class RoulettesModule {}