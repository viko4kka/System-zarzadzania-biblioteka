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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import type { Request } from 'express';
import { BookService } from './book.service';
import { AuthService } from '../auth/auth.service';
import { AddBookDto } from './dto/addBook.dto';

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly authService: AuthService,
  ) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiBody({ type: AddBookDto })
  @ApiOperation({
    summary: 'Dodanie nowej książki',
    description: 'Tylko administrator może dodawać książki.',
  })
  async addBook(@Body() dto: AddBookDto, @Req() req: Request) {
    const payload = await this.authService.verifyToken(req);
    if (!payload.is_Admin) {
      throw new ForbiddenException('Tylko administrator może dodawać książki');
    }
    return this.bookService.addBook(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Wyszukiwanie książek',
    description:
      'Zwraca paginowaną listę książek z możliwością wyszukiwania po tytule lub autorze.',
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
    description: 'Fraza wyszukiwania (tytuł lub autor)',
  })
  async searchBooks(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
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


  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Aktualizacja danych książki',
    description: 'Tylko administrator może modyfikować książki.',
  })
  @ApiBody({
    schema: {
      example: {
        title: 'C++ dla początkujących',
        year: 1993,
        cover: 'https://example.com/cover.jpg',
        publisher_name: 'SuperNowa',
        ISBN: '9788375352458',
        authors: [
          { author_name: 'Artur', author_lastname: 'Nowak' }
        ],
      },
    },
  })
  async updateBook(
    @Param('id') id: string,
    @Body() dto: {
      title?: string;
      year?: number;
      cover?: string;
      publisher_name?: string;
      ISBN?: string;
      authors?: { author_name: string; author_lastname: string }[];
    },
    @Req() req: Request,
  ) {
    const payload = await this.authService.verifyToken(req);
    if (!payload.is_Admin) {
      throw new ForbiddenException('Tylko administrator może modyfikować książki');
    }
    return this.bookService.updateBook(parseInt(id), dto);
  }
}
