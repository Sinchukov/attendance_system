import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { SubjectsService } from './subjects.service';

import { CreateSubjectDto } from './dto/create-subject.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';

import { Roles } from '../auth/roles.decorator';

@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateSubjectDto) {
    return this.subjectsService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'TEACHER')
  findAll() {
    return this.subjectsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'TEACHER')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.subjectsService.findOne(id);
  }
}
