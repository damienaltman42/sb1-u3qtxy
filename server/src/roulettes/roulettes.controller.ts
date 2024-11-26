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
import { RoulettesService } from './roulettes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRouletteDto } from './dto/create-roulette.dto';
import { UpdateRouletteDto } from './dto/update-roulette.dto';

@Controller('roulettes')
export class RoulettesController {
  constructor(private readonly roulettesService: RoulettesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createRouletteDto: CreateRouletteDto) {
    return this.roulettesService.create(createRouletteDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.roulettesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findAllByCreator(@Request() req) {
    return this.roulettesService.findAllByCreator(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roulettesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRouletteDto: UpdateRouletteDto,
    @Request() req,
  ) {
    return this.roulettesService.update(id, updateRouletteDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.roulettesService.remove(id, req.user.id);
  }
}