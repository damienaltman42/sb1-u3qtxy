import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoulettesService } from './roulettes.service';
import { CreateRouletteDto } from './dto/create-roulette.dto';

@Controller('roulettes')
export class RoulettesController {
  constructor(private readonly roulettesService: RoulettesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createRouletteDto: CreateRouletteDto) {
    return this.roulettesService.create(createRouletteDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.roulettesService.findAllByCreator(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roulettesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.roulettesService.remove(id, req.user.id);
  }

  @Post(':id/verify-code')
  verifyCode(@Param('id') id: string, @Body('code') code: string) {
    return this.roulettesService.verifyCode(id, code);
  }
}