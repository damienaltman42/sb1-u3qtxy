import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Roulette } from './entities/roulette.entity';
import { CreateRouletteDto } from './dto/create-roulette.dto';

@Injectable()
export class RoulettesService {
  constructor(
    @InjectRepository(Roulette)
    private roulettesRepository: Repository<Roulette>,
  ) {}

  async create(createRouletteDto: CreateRouletteDto, creatorId: string) {
    const roulette = this.roulettesRepository.create({
      ...createRouletteDto,
      creatorId,
      accessCode: uuidv4().slice(0, 8),
    });
    return this.roulettesRepository.save(roulette);
  }

  async findAllByCreator(creatorId: string) {
    return this.roulettesRepository.find({
      where: { creatorId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const roulette = await this.roulettesRepository.findOne({
      where: { id },
    });
    if (!roulette) {
      throw new NotFoundException('Roulette not found');
    }
    return roulette;
  }

  async remove(id: string, creatorId: string) {
    const roulette = await this.findOne(id);
    if (roulette.creatorId !== creatorId) {
      throw new UnauthorizedException();
    }
    await this.roulettesRepository.remove(roulette);
    return { id };
  }

  async verifyCode(id: string, code: string) {
    const roulette = await this.findOne(id);
    if (roulette.accessCode !== code) {
      throw new UnauthorizedException('Invalid access code');
    }
    return { valid: true };
  }
}