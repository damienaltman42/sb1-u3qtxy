import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Like } from './entities/like.entity';
import { RoulettesModule } from '../roulettes/roulettes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    RoulettesModule,
  ],
  providers: [LikesService],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}