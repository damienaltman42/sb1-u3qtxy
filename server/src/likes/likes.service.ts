import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { RoulettesService } from '../roulettes/roulettes.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    private roulettesService: RoulettesService,
  ) {}

  async like(rouletteId: string, userId: string): Promise<void> {
    const existingLike = await this.likesRepository.findOne({
      where: { rouletteId, userId },
    });

    if (!existingLike) {
      const roulette = await this.roulettesService.findOne(rouletteId);
      roulette.likes++;
      await this.roulettesService.update(rouletteId, { likes: roulette.likes }, roulette.creatorId);

      const like = this.likesRepository.create({
        rouletteId,
        userId,
      });
      await this.likesRepository.save(like);
    }
  }

  async unlike(rouletteId: string, userId: string): Promise<void> {
    const like = await this.likesRepository.findOne({
      where: { rouletteId, userId },
    });

    if (like) {
      const roulette = await this.roulettesService.findOne(rouletteId);
      if (roulette.likes > 0) {
        roulette.likes--;
        await this.roulettesService.update(rouletteId, { likes: roulette.likes }, roulette.creatorId);
      }

      await this.likesRepository.remove(like);
    }
  }

  async getLikedRoulettes(userId: string): Promise<string[]> {
    const likes = await this.likesRepository.find({
      where: { userId },
      select: ['rouletteId'],
    });

    return likes.map(like => like.rouletteId);
  }
}