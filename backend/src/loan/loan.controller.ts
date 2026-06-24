import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { LoanService } from './loan.service';

@ApiTags('Loan')
@Controller('loan')
export class LoanController {
  constructor(
    private readonly loanService: LoanService,
    private readonly authService: AuthService,
  ) {}

  @Post('loanBook/:copy_id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Wypożyczenie kopii książki',
    description:
      'Wypożycza wybraną kopię książki dla zalogowanego użytkownika.',
  })
  async loanBook(@Param('copy_id') copyIdParam: string, @Req() req: Request) {
    const payload = await this.authService.verifyToken(req);

    if (payload.is_Banned) {
      throw new ForbiddenException('Użytkownik jest zbanowany');
    }

    const copyId = Number(copyIdParam);
    if (!Number.isInteger(copyId) || copyId <= 0) {
      throw new BadRequestException(
        'copy_id musi być dodatnią liczbą całkowitą',
      );
    }

    return await this.loanService.loanBook(payload.id, copyId);
  }

  @Patch('returnBook/:copy_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Zwrot kopii książki',
    description: 'Zwraca aktywne wypożyczenie wybranej kopii książki.',
  })
  async returnBook(@Param('copy_id') copyIdParam: string, @Req() req: Request) {
    const payload = await this.authService.verifyToken(req);

    const copyId = Number(copyIdParam);
    if (!Number.isInteger(copyId) || copyId <= 0) {
      throw new BadRequestException(
        'copy_id musi być dodatnią liczbą całkowitą',
      );
    }

    return await this.loanService.returnBook(payload.id, copyId);
  }

  @Get('loans')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Historia wypożyczeń użytkownika',
    description:
      'Zwraca wszystkie wypożyczenia zalogowanego użytkownika, także zwrócone.',
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
  async getUserLoans(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const payload = await this.authService.verifyToken(req);

    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return await this.loanService.getUserLoans(payload.id, pageNum, limitNum);
  }

  @Get('ActiveLoans')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lista wypożyczeń użytkownika, które nie zostały jeszcze zwrócone',
    description:
      'Zwraca wszystkie aktywne wypożyczenia zalogowanego użytkownika.',
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
  async getUserActiveLoans(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const payload = await this.authService.verifyToken(req);

    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return await this.loanService.getUserActiveLoans(
      payload.id,
      pageNum,
      limitNum,
    );
  }

  @Get('loans/:user_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Historia wypożyczeń wybranego użytkownika',
    description:
      'Tylko administrator może zobaczyć wypożyczenia dowolnego użytkownika.',
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
  async getUserLoansByAdmin(
    @Param('user_id') userIdParam: string,
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const payload = await this.authService.verifyToken(req);

    if (!payload.is_Admin) {
      throw new ForbiddenException(
        'Tylko administrator może przeglądać wypożyczenia innych użytkowników',
      );
    }

    const userId = Number(userIdParam);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException(
        'user_id musi być dodatnią liczbą całkowitą',
      );
    }

    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return await this.loanService.getUserLoans(userId, pageNum, limitNum);
  }
}
