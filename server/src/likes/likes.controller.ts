import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':rouletteId')
  like(@Param('rouletteId') rouletteId: string, @Request() req) {
    return this.likesService.like(rouletteId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':rouletteId')
  unlike(@Param('rouletteId') rouletteId: string, @Request() req) {
    return this.likesService.unlike(rouletteId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getLikedRoulettes(@Request() req) {
    return this.likesService.getLikedRoulettes(req.user.id);
  }
}