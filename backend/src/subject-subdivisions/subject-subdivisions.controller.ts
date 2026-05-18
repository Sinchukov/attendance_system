import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { SubjectSubdivisionsService } from './subject-subdivisions.service';

import { CreateSubjectSubdivisionDto } from './dto/create-subject-subdivision.dto';

import { AddStudentsDto } from './dto/add-students.dto';

@Controller('subject-subdivisions')
export class SubjectSubdivisionsController {
  constructor(
    private readonly subjectSubdivisionsService: SubjectSubdivisionsService,
  ) {}

  // СОЗДАТЬ ПОДГРУППУ
  @Post()
  create(@Body() dto: CreateSubjectSubdivisionDto) {
    return this.subjectSubdivisionsService.create(dto);
  }

  // ДОБАВИТЬ СТУДЕНТОВ
  @Post(':id/students')
  addStudents(@Param('id') id: string, @Body() dto: AddStudentsDto) {
    return this.subjectSubdivisionsService.addStudents(
      Number(id),
      dto.studentIds,
    );
  }

  // ВСЕ ПОДГРУППЫ
  @Get()
  findAll() {
    return this.subjectSubdivisionsService.findAll();
  }

  // ПО ГРУППЕ
  @Get('group/:groupId')
  findByGroup(@Param('groupId') groupId: string) {
    return this.subjectSubdivisionsService.findByGroup(Number(groupId));
  }

  // ПО ПРЕДМЕТУ
  @Get('subject/:subjectId')
  findBySubject(@Param('subjectId') subjectId: string) {
    return this.subjectSubdivisionsService.findBySubject(Number(subjectId));
  }
}
