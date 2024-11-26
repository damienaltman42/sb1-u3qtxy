import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Win } from './entities/win.entity';
import { RoulettesService } from '../roulettes/roulettes.service';
import { CreateWinDto } from './dto/create-win.dto';

@Injectable()
export class WinsService {
  constructor(
    @InjectRepository(Win)
    private winsRepository: Repository<Win>,
    private roulettesService: RoulettesService,
  ) {}

  async create(createWinDto: CreateWinDto, userId: string): Promise<Win> {
    const roulette = await this.roulettesService.findOne(createWinDto.rouletteId);
    
    const win = this.winsRepository.create({
      userId,
      rouletteId: createWinDto.rouletteId,
      prize: JSON.stringify(createWinDto.prize),
      claimed: false,
    });

    return this.winsRepository.save(win);
  }

  async findByUser(userId: string): Promise<Win[]> {
    return this.winsRepository.find({
      where: { userId },
      relations: ['roulette', 'roulette.creator'],
      order: { createdAt: 'DESC' },
    });
  }

  async claim(id: string, userId: string): Promise<Win> {
    const win = await this.winsRepository.findOne({
      where: { id },
    });

    if (!win) {
      throw new NotFoundException('Win not found');
    }

    if (win.userId !== userId) {
      throw new UnauthorizedException();
    }

    if (win.claimed) {
      throw new UnauthorizedException('Prize already claimed');
    }

    win.claimed = true;
    return this.winsRepository.save(win);
  }
}