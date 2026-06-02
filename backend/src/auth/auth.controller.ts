/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from './jwt-auth.guard';

import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(
    @CurrentUser()
    user: any,
  ) {
    return user;
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
