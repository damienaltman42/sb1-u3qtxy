import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SocialLinksService } from './social-links.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';

@Controller('social-links')
export class SocialLinksController {
  constructor(private readonly socialLinksService: SocialLinksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createSocialLinkDto: CreateSocialLinkDto) {
    return this.socialLinksService.create(createSocialLinkDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findByUser(@Request() req) {
    return this.socialLinksService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSocialLinkDto: UpdateSocialLinkDto,
    @Request() req,
  ) {
    return this.socialLinksService.update(id, updateSocialLinkDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.socialLinksService.remove(id, req.user.id);
  }
}