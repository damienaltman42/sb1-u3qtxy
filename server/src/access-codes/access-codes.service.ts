import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessCode } from './entities/access-code.entity';
import { RoulettesService } from '../roulettes/roulettes.service';
import { CreateAccessCodeDto } from './dto/create-access-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Injectable()
export class AccessCodesService {
  constructor(
    @InjectRepository(AccessCode)
    private accessCodesRepository: Repository<AccessCode>,
    private roulettesService: RoulettesService,
  ) {}

  async create(createAccessCodeDto: CreateAccessCodeDto, userId: string): Promise<AccessCode> {
    const roulette = await this.roulettesService.findOne(createAccessCodeDto.rouletteId);
    
    if (roulette.creatorId !== userId) {
      throw new UnauthorizedException();
    }

    const code = this.accessCodesRepository.create({
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      spinsLeft: createAccessCodeDto.totalSpins,
      totalSpins: createAccessCodeDto.totalSpins,
      isUsed: false,
      rouletteId: createAccessCodeDto.rouletteId,
      roulette
    });

    if (createAccessCodeDto.expiresIn) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + createAccessCodeDto.expiresIn);
      code.expiresAt = expirationDate;
    }

    return this.accessCodesRepository.save(code);
  }

  async verify(verifyCodeDto: VerifyCodeDto): Promise<AccessCode> {
    const { rouletteId, code } = verifyCodeDto;

    const accessCode = await this.accessCodesRepository.findOne({
      where: { rouletteId, code, isUsed: false },
      relations: ['roulette']
    });

    if (!accessCode) {
      throw new NotFoundException('Invalid or expired code');
    }

    if (accessCode.spinsLeft <= 0) {
      throw new UnauthorizedException('No spins remaining');
    }

    if (accessCode.expiresAt && new Date() > accessCode.expiresAt) {
      throw new UnauthorizedException('Code has expired');
    }

    return accessCode;
  }

  async useCode(id: string): Promise<AccessCode> {
    const accessCode = await this.accessCodesRepository.findOne({
      where: { id }
    });

    if (!accessCode) {
      throw new NotFoundException('Access code not found');
    }

    accessCode.spinsLeft--;
    if (accessCode.spinsLeft <= 0) {
      accessCode.isUsed = true;
    }

    return this.accessCodesRepository.save(accessCode);
  }

  async delete(id: string, userId: string): Promise<void> {
    const accessCode = await this.accessCodesRepository.findOne({
      where: { id },
      relations: ['roulette']
    });

    if (!accessCode) {
      throw new NotFoundException('Access code not found');
    }

    if (accessCode.roulette.creatorId !== userId) {
      throw new UnauthorizedException();
    }

    await this.accessCodesRepository.remove(accessCode);
  }
}