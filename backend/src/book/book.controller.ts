import {
  Controller,
  Get,
  Post,
  Patch,
  Query,
  Param,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import type { Request } from 'express';
import { BookService } from './book.service';
import { AuthService } from '../auth/auth.service';

class AddBookDto {
  title: string;
  year: number;
  cover?: string;
  publisher_id: number;
  ISBN?: string;
}

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly authService: AuthService,
  ) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Dodanie nowej książki',
    description: 'Tylko administrator może dodawać książki.',
  })
  @ApiBody({
    schema: {
      example: {
        title: 'C++ w systemach wbudowanych. Skuteczna migracja z C do nowoczesnego C++',
        year: 1993,
        cover: 'https://example.com/cover.jpg',
        publisher_id: 1,
        ISBN: '978-83-7575-245-5',
      },
    },
  })
  async addBook(@Body() dto: AddBookDto, @Req() req: Request) {
    const payload = this.authService.verifyToken(req);
    if (!payload.is_Admin) {
      throw new ForbiddenException('Tylko administrator może dodawać książki');
    }
    return this.bookService.addBook(dto);
  }

  @Patch('remove')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Usunięcie książki',
    description: 'Tylko administrator może usuwać książki.',
  })
  async removeBook(@Body('id') id: number, @Req() req: Request) {
    const payload = this.authService.verifyToken(req);
    if (!payload.is_Admin) {
      throw new ForbiddenException('Tylko administrator może usuwać książki');
    }
    return this.bookService.removeBook(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Wyszukiwanie książek',
    description: 'Zwraca paginowaną listę książek z możliwością wyszukiwania po tytule lub autorze.',
  })
  @ApiQuery({ name: 'page',   required: false, type: Number, description: 'Numer strony (domyślnie 1)' })
  @ApiQuery({ name: 'limit',  required: false, type: Number, description: 'Liczba wyników na stronę (domyślnie 10)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Fraza wyszukiwania (tytuł lub autor)' })
  async searchBooks(
    @Query('page')   page?:   string,
    @Query('limit')  limit?:  string,
    @Query('search') search?: string,
  ) {
    const pageNum  = page  ? parseInt(page)  : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.bookService.searchBooks(pageNum, limitNum, search);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Pobranie danych książki',
    description: 'Zwraca szczegółowe dane książki wraz z liczbą kopii.',
  })
  async getBook(@Param('id') id: string) {
    return this.bookService.getBook(parseInt(id));
  }
}
