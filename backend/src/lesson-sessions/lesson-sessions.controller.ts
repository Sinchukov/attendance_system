import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../auth/current-user.decorator';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';

import { Roles } from '../auth/roles.decorator';

import { LessonSessionsService } from './lesson-sessions.service';

import { CreateLessonSessionDto } from './dto/create-lesson-session.dto';

import { CancelLessonDto } from './dto/cancel-lesson.dto';

import { UpdateAttendanceDto } from '../attendance/dto/update-attendance.dto';

@Controller('lesson-sessions')
export class LessonSessionsController {
  constructor(private readonly lessonSessionsService: LessonSessionsService) {}

  // =====================================================
  // СОЗДАНИЕ ПАРЫ
  // =====================================================

  @Post()
  create(@Body() dto: CreateLessonSessionDto) {
    return this.lessonSessionsService.create(dto);
  }

  // =====================================================
  // ВСЕ ПАРЫ
  // =====================================================

  @Get()
  findAll() {
    return this.lessonSessionsService.findAll();
  }

  // =====================================================
  // ПАРЫ ПО ДАТЕ
  // =====================================================

  @Get('date/:date')
  findByDate(@Param('date') date: string) {
    return this.lessonSessionsService.findByDate(date);
  }

  // =====================================================
  // ГЕНЕРАЦИЯ ПАР ПО ШАБЛОНАМ
  // =====================================================

  @Post('generate')
  generate(
    @Body()
    body: {
      date: string;
    },
  ) {
    return this.lessonSessionsService.generateForDate(new Date(body.date));
  }

  // =====================================================
  // ОТМЕНА ПАРЫ
  // =====================================================

  @Patch(':id/cancel')
  cancel(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: CancelLessonDto,
  ) {
    return this.lessonSessionsService.cancel(id, dto);
  }

  // =====================================================
  // СТУДЕНТЫ НА ПАРЕ
  // =====================================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TEACHER')
  @Get(':id/students')
  findSessionStudents(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.lessonSessionsService.findSessionStudents(id);
  }

  // =====================================================
  // РУЧНОЕ ИЗМЕНЕНИЕ ПОСЕЩАЕМОСТИ
  // =====================================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TEACHER')
  @Patch('attendance/:attendanceId')
  updateAttendance(
    @Param('attendanceId', ParseIntPipe)
    attendanceId: number,

    @Body()
    dto: UpdateAttendanceDto,
  ) {
    return this.lessonSessionsService.updateAttendance(attendanceId, dto);
  }

  // =====================================================
  // ПАРЫ КОНКРЕТНОГО ПРЕПОДАВАТЕЛЯ
  // =====================================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TEACHER')
  @Get('teacher/:teacherId')
  findTeacherSessions(
    @Param('teacherId', ParseIntPipe)
    teacherId: number,
  ) {
    return this.lessonSessionsService.findTeacherSessions(teacherId);
  }

  // =====================================================
  // НЕДЕЛЯ ПРЕПОДАВАТЕЛЯ
  // =====================================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TEACHER')
  @Get('teacher/:teacherId/week')
  getTeacherWeekSessions(
    @Param('teacherId', ParseIntPipe)
    teacherId: number,
  ) {
    return this.lessonSessionsService.getTeacherWeekSessions(teacherId);
  }

  // =====================================================
  // ПОЛУЧЕНИЕ ПАР ТЕКУЩЕГО ПРЕПОДАВАТЕЛЯ
  // =====================================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER')
  @Get('my')
  async getMySessions(
    @CurrentUser()
    user: {
      userId: number;
      email: string;
      role: string;
    },
  ) {
    const teacher = await this.lessonSessionsService.getTeacherByUserId(
      user.userId,
    );

    if (!teacher) {
      return [];
    }

    return this.lessonSessionsService.getTeacherSessions(teacher.id);
  }

  // =====================================================
  // НЕДЕЛЯ ТЕКУЩЕГО ПРЕПОДАВАТЕЛЯ
  // =====================================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER')
  @Get('my/week')
  async getMyWeekSessions(
    @CurrentUser()
    user: {
      userId: number;
      email: string;
      role: string;
    },
  ) {
    const teacher = await this.lessonSessionsService.getTeacherByUserId(
      user.userId,
    );

    if (!teacher) {
      return [];
    }

    return this.lessonSessionsService.getTeacherWeekSessions(teacher.id);
  }

  // =====================================================
  // QUERY ENDPOINT
  // =====================================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TEACHER')
  @Get('teacher')
  getTeacherSessionsQuery(
    @Query('teacherId')
    teacherId: string,
  ) {
    return this.lessonSessionsService.getTeacherSessions(Number(teacherId));
  }
}
