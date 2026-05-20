import { Body, Controller, Get, Post } from '@nestjs/common';

import { SubjectSubdivisionStudentsService } from './subject-subdivision-students.service';

import { CreateSubdivisionStudentDto } from './dto/create-subdivision-student.dto';

@Controller('subject-subdivision-students')
export class SubjectSubdivisionStudentsController {
  constructor(
    private readonly subdivisionStudentsService: SubjectSubdivisionStudentsService,
  ) {}

  @Post()
  create(@Body() dto: CreateSubdivisionStudentDto) {
    return this.subdivisionStudentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.subdivisionStudentsService.findAll();
  }
}
