import { Injectable, NotFoundException, InternalServerErrorException,ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  private async findBookOrThrow(bookId: number) {
    const book = await this.prisma.book
      .findUnique({ where: { id_book: bookId } })
      .catch(() => { throw new InternalServerErrorException('Błąd bazy danych'); });

    if (!book) throw new NotFoundException(`Książka o id ${bookId} nie istnieje`);
    return book;
  }

async addBook(dto: {
  title: string;
  year: number;
  cover?: string;
  publisher_id: number;
  ISBN?: string;
}) {
  const existing = await this.prisma.book
    .findFirst({
      where: {
        OR: [
          { title: { equals: dto.title, mode: 'insensitive' } },
          ...(dto.ISBN ? [{ ISBN: dto.ISBN }] : []),
        ],
      },
    })
    .catch(() => { throw new InternalServerErrorException('Błąd bazy danych'); });

  if (existing) {
    throw new ConflictException('Książka o takim tytule lub ISBN już istnieje');
  }

  return this.prisma.book
    .create({
      data: dto,
      select: { id_book: true, title: true },
    })
    .catch(() => { throw new InternalServerErrorException('Nie udało się dodać książki'); });
}

  async removeBook(bookId: number) {
    await this.findBookOrThrow(bookId);
    return {message: "Dummy function"};
  }

  async searchBooks(page: number, limit: number, search?: string) {

   
    const where = search
      ? {
          OR: [
            { title:   { contains: search, mode: 'insensitive' as const } },
            { authors: { some: { author_name:     { contains: search, mode: 'insensitive' as const } } } },
            { authors: { some: { author_lastname: { contains: search, mode: 'insensitive' as const } } } },
          ],
        }
      : {};

    const total = await this.prisma.book
      .count({ where })
      .catch(() => { throw new InternalServerErrorException('Błąd bazy danych'); });
    const validLimit = Math.min(Math.max(1, limit), 100);
    const totalPages = Math.max(1, Math.ceil(total / validLimit));
    const validPage = Math.min(Math.max(1, page), totalPages);
    const skip = (validPage - 1) * validLimit;


    const data = await this.prisma.book
      .findMany({
        where,
        skip,
        take: validLimit,
        select: {
          id_book: true,
          title: true,
          year: true,
          ISBN: true,
          cover: true,
          authors: { select: { id_author: true, author_name: true, author_lastname: true } },
        },
        orderBy: { id_book: 'asc' },
      })
      .catch(() => { throw new InternalServerErrorException('Błąd podczas wyszukiwania książek'); });

    return {
      data,
      meta: {
        page:       validPage,
        limit:      validLimit,
        total,
        totalPages,
      },
    };
  }
  async getBook(bookId: number) {
  const book = await this.prisma.book
    .findUnique({
      where: { id_book: bookId },
      select: {
        id_book: true,
        title: true,
        year: true,
        cover: true,
        ISBN: true,
        publisher_id: true,
        _count: {
          select: { copies: true },
        },
      },
    })
    .catch(() => { throw new InternalServerErrorException('Błąd bazy danych'); });

  if (!book) throw new NotFoundException(`Książka o id ${bookId} nie istnieje`);

  const availableCopies = await this.prisma.copy
    .count({
      where: { book_id: bookId, is_actual: true },
    })
    .catch(() => { throw new InternalServerErrorException('Błąd bazy danych'); });

  return {
    id_book:         book.id_book,
    title:           book.title,
    year:            book.year,
    cover:           book.cover,
    ISBN:            book.ISBN,
    publisher_id:    book.publisher_id,
    totalCopies:     book._count.copies,
    availableCopies,
  };
  }
}
