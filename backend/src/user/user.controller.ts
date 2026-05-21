import {
  Controller,
  Get,
  Patch,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  Param,
  UnauthorizedException,
  ForbiddenException,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from './dto/updateUser.dto';

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
    summary:
      'Pobranie danych o zalogowanym użytkowniku lub wyszukiwanie użytkowników',
    description:
      'Bez parametrów zwraca dane zalogowanego użytkownika. Z parametrami page/limit/search - wyszukuje użytkowników (tylko admin).',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numer strony (domyślnie 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Liczba wyników na stronę (domyślnie 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Fraza wyszukiwania (imię, nazwisko lub email)',
  })
  async getUser(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const payload = await this.authService.verifyToken(req);

    // Jeśli są parametry paginacji/wyszukiwania - endpoint wyszukiwania
    if (page || limit || search) {
      // Tylko admin może wyszukiwać użytkowników
      if (!payload.is_Admin) {
        throw new ForbiddenException(
          'Tylko administrator może wyszukiwać użytkowników',
        );
      }

      const pageNum = page ? parseInt(page) : 1;
      const limitNum = limit ? parseInt(limit) : 10;

      return await this.userService.searchUsers(pageNum, limitNum, search);
    }

    // Bez parametrów - zwraca dane zalogowanego użytkownika
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
    const payload = await this.authService.verifyToken(req);
    if (payload.is_Admin == true || payload.id == parseInt(id)) {
      return await this.userService.getUser(parseInt(id));
    }
    throw new UnauthorizedException(
      'Nie masz dostępu do danych tego użytkownika',
    );
  }

  @Patch(':id/makeAdmin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Nadanie uprawnień administratora użytkownikowi',
    description:
      'Endpoint pozwala administratorowi nadać uprawnienia administratora innemu użytkownikowi poprzez jego ID.',
  })
  async makeAdmin(@Param('id') id: string, @Req() req: Request) {
    const payload = await this.authService.verifyToken(req);

    // Sprawdzenie czy użytkownik wykonujący żądanie jest adminem
    if (!payload.is_Admin) {
      throw new ForbiddenException(
        'Tylko administrator może nadawać uprawnienia administratora',
      );
    }

    // Nadanie uprawnień administratora
    return await this.userService.makeAdmin(parseInt(id));
  }

  @Patch(':id/ban')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Zablokowanie użytkownika przez admina',
    description:
      'Endpoint pozwala administratorowi zablokować innego użytkownika przez jego ID.',
  })
  async ban(@Param('id') id: string, @Req() req: Request) {
    const payload = await this.authService.verifyToken(req);

    // Sprawdzenie czy użytkownik wykonujący żądanie jest adminem
    if (!payload.is_Admin) {
      throw new ForbiddenException(
        'Tylko administrator może blokować użytkowników',
      );
    }

    return await this.userService.ban(parseInt(id));
  }

  @Patch(':id/unban')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Odblokowanie użytkownika przez admina',
    description:
      'Endpoint pozwala administratorowi odblokować innego użytkownika przez jego ID.',
  })
  async unban(@Param('id') id: string, @Req() req: Request) {
    const payload = await this.authService.verifyToken(req);

    // Sprawdzenie czy użytkownik wykonujący żądanie jest adminem
    if (!payload.is_Admin) {
      throw new ForbiddenException(
        'Tylko administrator może odblokowywać użytkowników',
      );
    }

    return await this.userService.unban(parseInt(id));
  }


  @Patch('updateUser')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({
    summary: 'Zmiana danych użytkownika',
    description:
      'Endpoint pozwala użytkownikowi na zmianę swojego hasła, imienia i nazwiska po wczesniejszym podaniu hasła.',
  })
  @ApiBody({ type: UpdateUserDto})
  @ApiResponse({
      status: 200,
      description: 'Dane użytkownika zostały zmienione pomyślnie',
      schema: {
        example: {
          id: 1,
          name: 'Tomasz',
          lastname: 'Nienacki'
        },
      },
    })
  @ApiResponse({
    status: 400,
    description: 'Nieprawidłowe dane wejściowe',
    schema: {
      example: {
        message: [
          'Nieprawidłowe dane wejściowe.'
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Użytkownik nie jest zalogowany',
    schema: {
      example: {
        message: [
          'Użytkownik nie jest zalogowany.'
        ],
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Niepoprawne hasło',
    schema: {
      example: {
        message: 'Niepoprawne hasło',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
      status: 500,
      description: 'Wewnętrzny błąd serwera',
      schema: {
        example: {
          message: 'Nie udało się zmienić danych użytkownika',
          error: 'Internal Server Error',
          statusCode: 500,
        },
      },
    })
  async updateData(@Body() dto: UpdateUserDto, @Req() req: Request) {
    const payload = await this.authService.verifyToken(req);
    
    return await this.userService.updateUser(payload.id, dto.name, dto.lastname, dto.oldpassword, dto.newpassword);
  }


}
