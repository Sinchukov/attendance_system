import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { PairTimesService } from './pair-times.service';

import { CreatePairTimeDto } from './dto/create-pair-time.dto';
import { UpdatePairTimeDto } from './dto/update-pair-time.dto';

@Controller('pair-times')
export class PairTimesController {
  constructor(private readonly pairTimesService: PairTimesService) {}

  @Post()
  create(@Body() dto: CreatePairTimeDto) {
    return this.pairTimesService.create(dto);
  }

  @Get()
  findAll() {
    return this.pairTimesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pairTimesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePairTimeDto,
  ) {
    return this.pairTimesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pairTimesService.remove(id);
  }
}
