import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
const IS_PROD = process.env.NODE_ENV === 'production';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({
    summary: 'Rejestracja nowego użytkownika',
    description:
      'Tworzy nowe konto użytkownika, generuje JWT token i ustawia go w HttpOnly cookie',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Użytkownik został pomyślnie zarejestrowany',
    schema: {
      example: {
        id: 1,
        name: 'Jan',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Nieprawidłowe dane wejściowe',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Nieprawidłowy format adresu email',
          'Hasło musi mieć co najmniej 8 znaków',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Użytkownik z tym adresem email już istnieje',
    schema: {
      example: {
        statusCode: 409,
        message: 'Użytkownik z tym adresem email już istnieje',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Wewnętrzny błąd serwera',
    schema: {
      example: {
        statusCode: 500,
        message: 'Nie udało się utworzyć konta',
        error: 'Internal Server Error',
      },
    },
  })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { id, name, token } = await this.authService.register(dto);

    // Ustaw token w HttpOnly cookie
    res.cookie('access_token', token, {
      httpOnly: true, // JS po stronie klienta nie ma dostępu — ochrona przed XSS
      secure: IS_PROD, // Tylko HTTPS na produkcji
      sameSite: 'lax', // Ochrona przed CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dni w ms
      path: '/',
    });

    return { id, name };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({
    summary: 'Logowanie użytkownika',
    description:
      'Weryfikuje dane logowania, generuje JWT token i ustawia go w HttpOnly cookie',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Użytkownik zalogowany pomyślnie',
    schema: {
      example: { id: 1, name: 'Jan', is_Admin: 'False', is_Banned: 'False' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Nieprawidłowe dane wejściowe',
  })
  @ApiResponse({
    status: 401,
    description: 'Nieprawidłowy email lub hasło',
    schema: {
      example: {
        statusCode: 401,
        message: 'Nieprawidłowy email lub hasło',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Wewnętrzny błąd serwera',
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { id, name, token, is_Admin, is_Banned } =
      await this.authService.login(dto);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { id, name, is_Admin, is_Banned };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Wylogowanie użytkownika',
    description: 'Usuwa token z HttpOnly cookie',
  })
  @ApiResponse({
    status: 200,
    description: 'Użytkownik wylogowany pomyślnie',
    schema: {
      example: { success: true },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Użytkownik niezalogowany',
    schema: {
      example: {
        statusCode: 401,
        message: 'Użytkownik niezalogowany',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Wewnętrzny błąd serwera',
  })
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }
}
