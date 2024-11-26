import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialLinksService } from './social-links.service';
import { SocialLinksController } from './social-links.controller';
import { SocialLink } from './entities/social-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocialLink])],
  providers: [SocialLinksService],
  controllers: [SocialLinksController],
  exports: [SocialLinksService],
})
export class SocialLinksModule {}