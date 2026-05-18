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

import { AcademicGroupsService } from './academic-groups.service';
import { CreateAcademicGroupDto } from './dto/create-academic-group.dto';
import { UpdateAcademicGroupDto } from './dto/update-academic-group.dto';

@Controller('academic-groups')
export class AcademicGroupsController {
  constructor(private service: AcademicGroupsService) {}

  @Post()
  create(@Body() dto: CreateAcademicGroupDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAcademicGroupDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
