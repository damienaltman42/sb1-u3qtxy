import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessCodesService } from './access-codes.service';
import { AccessCodesController } from './access-codes.controller';
import { AccessCode } from './entities/access-code.entity';
import { RoulettesModule } from '../roulettes/roulettes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessCode]),
    RoulettesModule,
  ],
  providers: [AccessCodesService],
  controllers: [AccessCodesController],
  exports: [AccessCodesService],
})
export class AccessCodesModule {}