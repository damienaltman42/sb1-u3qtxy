import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WinsService } from './wins.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWinDto } from './dto/create-win.dto';

@Controller('wins')
export class WinsController {
  constructor(private readonly winsService: WinsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createWinDto: CreateWinDto) {
    return this.winsService.create(createWinDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findByUser(@Request() req) {
    return this.winsService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/claim')
  claim(@Param('id') id: string, @Request() req) {
    return this.winsService.claim(id, req.user.id);
  }
}