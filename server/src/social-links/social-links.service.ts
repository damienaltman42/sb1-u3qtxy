import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialLink } from './entities/social-link.entity';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';

@Injectable()
export class SocialLinksService {
  constructor(
    @InjectRepository(SocialLink)
    private socialLinksRepository: Repository<SocialLink>,
  ) {}

  async create(createSocialLinkDto: CreateSocialLinkDto, userId: string): Promise<SocialLink> {
    const socialLink = this.socialLinksRepository.create({
      ...createSocialLinkDto,
      userId,
    });
    return this.socialLinksRepository.save(socialLink);
  }

  async findByUser(userId: string): Promise<SocialLink[]> {
    return this.socialLinksRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateSocialLinkDto: UpdateSocialLinkDto, userId: string): Promise<SocialLink> {
    const socialLink = await this.socialLinksRepository.findOne({
      where: { id },
    });

    if (!socialLink) {
      throw new NotFoundException('Social link not found');
    }

    if (socialLink.userId !== userId) {
      throw new UnauthorizedException();
    }

    Object.assign(socialLink, updateSocialLinkDto);
    return this.socialLinksRepository.save(socialLink);
  }

  async remove(id: string, userId: string): Promise<void> {
    const socialLink = await this.socialLinksRepository.findOne({
      where: { id },
    });

    if (!socialLink) {
      throw new NotFoundException('Social link not found');
    }

    if (socialLink.userId !== userId) {
      throw new UnauthorizedException();
    }

    await this.socialLinksRepository.remove(socialLink);
  }
}