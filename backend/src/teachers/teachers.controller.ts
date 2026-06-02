import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { TeachersService } from './teachers.service';

import { CreateTeacherDto } from './dto/create-teacher.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';

import { Roles } from '../auth/roles.decorator';

@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateTeacherDto) {
    return this.teachersService.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.teachersService.findOne(id);
  }

  @Get('user/:userId')
  @Roles('ADMIN', 'TEACHER')
  findByUserId(
    @Param('userId', ParseIntPipe)
    userId: number,
  ) {
    return this.teachersService.findByUserId(userId);
  }
}
