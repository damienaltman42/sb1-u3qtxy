import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AccessCodesService } from './access-codes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAccessCodeDto } from './dto/create-access-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller('access-codes')
export class AccessCodesController {
  constructor(private readonly accessCodesService: AccessCodesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createAccessCodeDto: CreateAccessCodeDto) {
    return this.accessCodesService.create(createAccessCodeDto, req.user.id);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() verifyCodeDto: VerifyCodeDto) {
    const accessCode = await this.accessCodesService.verify(verifyCodeDto);
    return {
      id: accessCode.id,
      spinsLeft: accessCode.spinsLeft,
      totalSpins: accessCode.totalSpins,
      expiresAt: accessCode.expiresAt
    };
  }

  @Post(':id/use')
  @HttpCode(HttpStatus.OK)
  async useCode(@Param('id') id: string) {
    return this.accessCodesService.useCode(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.accessCodesService.delete(id, req.user.id);
  }
}