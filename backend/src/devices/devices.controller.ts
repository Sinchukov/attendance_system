import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { DevicesService } from './devices.service';

import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  // СОЗДАТЬ DEVICE
  @Post()
  create(@Body() dto: CreateDeviceDto) {
    return this.devicesService.create(dto);
  }

  // ВСЕ DEVICES
  @Get()
  findAll() {
    return this.devicesService.findAll();
  }

  // DEVICE ПО ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.devicesService.findOne(id);
  }

  // DEVICE ПО SERIAL
  @Get('serial/:serialNumber')
  findBySerial(
    @Param('serialNumber')
    serialNumber: string,
  ) {
    return this.devicesService.findBySerial(serialNumber);
  }
}
