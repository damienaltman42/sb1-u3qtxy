import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roulette } from './entities/roulette.entity';
import { CreateRouletteDto } from './dto/create-roulette.dto';
import { UpdateRouletteDto } from './dto/update-roulette.dto';

@Injectable()
export class RoulettesService {
  constructor(
    @InjectRepository(Roulette)
    private roulettesRepository: Repository<Roulette>,
  ) {}

  async create(createRouletteDto: CreateRouletteDto, creatorId: string): Promise<Roulette> {
    const roulette = this.roulettesRepository.create({
      name: createRouletteDto.name,
      description: createRouletteDto.description,
      items: JSON.stringify(createRouletteDto.items),
      packages: JSON.stringify(createRouletteDto.packages),
      likes: createRouletteDto.likes || 0,
      creatorId,
    });

    return this.roulettesRepository.save(roulette);
  }

  async findAll(): Promise<Roulette[]> {
    return this.roulettesRepository.find({
      relations: ['creator', 'accessCodes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByCreator(creatorId: string): Promise<Roulette[]> {
    return this.roulettesRepository.find({
      where: { creatorId },
      relations: ['accessCodes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Roulette> {
    const roulette = await this.roulettesRepository.findOne({
      where: { id },
      relations: ['creator', 'accessCodes'],
    });

    if (!roulette) {
      throw new NotFoundException('Roulette not found');
    }

    return roulette;
  }

  async update(id: string, updateRouletteDto: UpdateRouletteDto, userId: string): Promise<Roulette> {
    const roulette = await this.findOne(id);

    if (roulette.creatorId !== userId) {
      throw new UnauthorizedException();
    }

    // Create a base update object with simple properties
    const updates: Partial<Roulette> = {
      name: updateRouletteDto.name,
      description: updateRouletteDto.description,
      likes: updateRouletteDto.likes,
    };

    // Handle JSON fields separately
    if (updateRouletteDto.items) {
      updates.items = JSON.stringify(updateRouletteDto.items);
    }
    if (updateRouletteDto.packages) {
      updates.packages = JSON.stringify(updateRouletteDto.packages);
    }

    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });

    // Apply updates and save
    Object.assign(roulette, updates);
    return this.roulettesRepository.save(roulette);
  }

  async remove(id: string, userId: string): Promise<void> {
    const roulette = await this.findOne(id);

    if (roulette.creatorId !== userId) {
      throw new UnauthorizedException();
    }

    await this.roulettesRepository.remove(roulette);
  }
}