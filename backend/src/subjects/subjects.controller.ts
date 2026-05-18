import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { SubjectsService } from './subjects.service';

import { CreateSubjectDto } from './dto/create-subject.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  // СОЗДАТЬ ПРЕДМЕТ
  @Post()
  create(@Body() dto: CreateSubjectDto) {
    return this.subjectsService.create(dto);
  }

  // ВСЕ ПРЕДМЕТЫ
  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  // ПРЕДМЕТ ПО ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.findOne(id);
  }
}
