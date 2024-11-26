import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinsService } from './wins.service';
import { WinsController } from './wins.controller';
import { Win } from './entities/win.entity';
import { RoulettesModule } from '../roulettes/roulettes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Win]),
    RoulettesModule,
  ],
  providers: [WinsService],
  controllers: [WinsController],
  exports: [WinsService],
})
export class WinsModule {}