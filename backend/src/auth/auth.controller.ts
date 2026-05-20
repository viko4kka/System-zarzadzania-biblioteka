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
  Patch,
  UnauthorizedException,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RemoveUserDto } from './dto/removeUser.dto';
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
      example: {
        success: true,
      },
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
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }

  @Patch('removeUser')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Usuwanie konta zalogowanego użytkownika',
    description:
      'Usuwa konto zalogowanego użytkownika jeżeli potwierdzi czynność swoim hasłem',
  })
  @ApiResponse({
    status: 200,
    description: 'Użytkownik usunięty pomyślnie',
    schema: {
      example: {
        id: 1,
        is_Removed: true,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Błędne hasło',
    schema: {
      example: {
        statusCode: 401,
        message: 'Błędne hasło',
        error: 'Unauthorized',
      },
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
  async removeUser(@Body() dto: RemoveUserDto, @Req() req: Request) {
    const payload = await this.authService.verifyToken(req);

    const verify = await this.authService.verifyPassword(
      payload.id,
      dto.password,
    );
    if (verify == true) {
      return this.authService.removeUser(payload.id);
    }
    throw new UnauthorizedException('Błędne hasło');
  }

  @Patch('removeUser/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Usuwanie konta użytkownika przez administratora',
    description: 'Usuwa konto podanego użytkownika. Tylko administrator.',
  })
  @ApiResponse({
    status: 200,
    description: 'Użytkownik usunięty pomyślnie',
    schema: {
      example: {
        id: 1,
        is_Removed: true,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Tylko administrator może usuwać użytkowników',
    schema: {
      example: {
        statusCode: 403,
        message: 'Tylko administrator może usuwać użytkowników',
        error: 'Forbidden',
      },
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
  async removeUserById(@Param('id') id: string, @Req() req: Request) {
    const payload = await this.authService.verifyToken(req);
    if (payload.is_Admin !== true) {
      throw new ForbiddenException(
        'Tylko administrator może usuwać użytkowników',
      );
    }
    return this.authService.removeUser(parseInt(id));
  }
}
