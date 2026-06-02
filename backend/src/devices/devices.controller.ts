import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { DevicesService } from './devices.service';

import { CreateDeviceDto } from './dto/create-device.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';

import { Roles } from '../auth/roles.decorator';

@Controller('devices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateDeviceDto) {
    return this.devicesService.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.devicesService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.devicesService.findOne(id);
  }

  @Get('serial/:serialNumber')
  @Roles('ADMIN')
  findBySerial(
    @Param('serialNumber')
    serialNumber: string,
  ) {
    return this.devicesService.findBySerial(serialNumber);
  }
}
