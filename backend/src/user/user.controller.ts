import {
  Controller,
  Get,
  Req,
  HttpCode,
  HttpStatus,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Pobranie danych o zalogowanym użytkowniku',
  })
  async getUser(@Req() req: Request) {
    const payload = this.authService.verifyToken(req);
    return this.userService.getUser(payload.id);
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Pobranie danych użytkownika o danym id',
    description:
      'Admin może wyświetlić informacje o dowolnym użytkowniku. Zalogowany użytkownik może wyświetlić wyłącznie swoje dane.',
  })
  async getUserById(@Param('id') id: string, @Req() req: Request) {
    const payload = this.authService.verifyToken(req);
    if (payload.is_Admin || payload.id == parseInt(id)) {
      return this.userService.getUser(parseInt(id));
    }
    throw new UnauthorizedException(
      'Nie masz dostępu do danych tego użytkownika',
    );
  }
}
