import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { PairTimesService } from './pair-times.service';

import { CreatePairTimeDto } from './dto/create-pair-time.dto';

import { UpdatePairTimeDto } from './dto/update-pair-time.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';

import { Roles } from '../auth/roles.decorator';

@Controller('pair-times')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PairTimesController {
  constructor(private readonly pairTimesService: PairTimesService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreatePairTimeDto) {
    return this.pairTimesService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'TEACHER')
  findAll() {
    return this.pairTimesService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'TEACHER')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.pairTimesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    dto: UpdatePairTimeDto,
  ) {
    return this.pairTimesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.pairTimesService.remove(id);
  }
}
