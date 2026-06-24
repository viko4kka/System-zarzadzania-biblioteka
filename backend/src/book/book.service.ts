import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddBookDto } from './dto/addBook.dto';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  private async findBookOrThrow(bookId: number) {
    const book = await this.prisma.book
      .findUnique({ where: { id_book: bookId } })
      .catch(() => {
        throw new InternalServerErrorException('Błąd bazy danych');
      });

    if (!book)
      throw new NotFoundException(`Książka o id ${bookId} nie istnieje`);
    return book;
  }

  async addBook(dto: AddBookDto) {
    const existing = await this.prisma.book
      .findFirst({
        where: {
          OR: [
            { title: { equals: dto.title, mode: 'insensitive' } },
            ...(dto.ISBN ? [{ ISBN: dto.ISBN }] : []),
          ],
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Błąd bazy danych');
      });
    if (dto.ISBN && dto.ISBN.length !== 13)
      throw new BadRequestException('ISBN musi mieć 13 znaków');
    if (existing) {
      throw new ConflictException(
        'Książka o takim tytule lub ISBN już istnieje',
      );
    }

    const authors = await Promise.all(
      dto.authors.map((a) =>
        this.getOrAddAuthor(a.author_name, a.author_lastname),
      ),
    );
    const publisher = await this.getOrAddPublisher(dto.publisher_name);

    return this.prisma.book
      .create({
        data: {
          title: dto.title,
          year: dto.year,
          cover: dto.cover,
          ISBN: dto.ISBN,
          publisher: {
            connect: {
              id_publisher: publisher.id_publisher,
            },
          },
          authors: {
            connect: authors.map((a) => ({ id_author: a.id_author })),
          },
        },
        select: { id_book: true, title: true },
      })
      .catch(() => {
        throw new InternalServerErrorException('Nie udało się dodać książki');
      });
  }

  async searchBooks(page: number, limit: number, search?: string) {
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            {
              authors: {
                some: {
                  author_name: {
                    contains: search,
                    mode: 'insensitive' as const,
                  },
                },
              },
            },
            {
              authors: {
                some: {
                  author_lastname: {
                    contains: search,
                    mode: 'insensitive' as const,
                  },
                },
              },
            },
          ],
        }
      : {};

    const total = await this.prisma.book.count({ where }).catch(() => {
      throw new InternalServerErrorException('Błąd bazy danych');
    });
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
          authors: {
            select: {
              id_author: true,
              author_name: true,
              author_lastname: true,
            },
          },
        },
        orderBy: { id_book: 'asc' },
      })
      .catch(() => {
        throw new InternalServerErrorException(
          'Błąd podczas wyszukiwania książek',
        );
      });

    return {
      data,
      meta: {
        page: validPage,
        limit: validLimit,
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
          publisher: {
            select: {
              id_publisher: true,
              publisher_name: true,
            },
          },
          authors: {
            select: {
              id_author: true,
              author_name: true,
              author_lastname: true,
            },
          },
          _count: {
            select: {
              copies: {
                where: { is_actual: true },
              },
            },
          },
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Błąd bazy danych');
      });

    if (!book)
      throw new NotFoundException(`Książka o id ${bookId} nie istnieje`);

    const availableCopies = await this.prisma.copy
      .count({
        where: {
          book_id: bookId,
          is_actual: true,
          loans: {
            none: { return_date: null },
          },
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Błąd bazy danych');
      });

    return {
      id_book: book.id_book,
      title: book.title,
      year: book.year,
      cover: book.cover,
      ISBN: book.ISBN,
      publisher_id: book.publisher_id,
      publisher: book.publisher,
      authors: book.authors,
      totalCopies: book._count.copies,
      availableCopies,
    };
  }

  async getOrAddAuthor(author_name: string, author_lastname: string) {
    const author = await this.prisma.author.findFirst({
      where: {
        author_name: author_name,
        author_lastname: author_lastname,
      },
    });

    if (author) {
      return author;
    }

    const newAuthor = await this.prisma.author.create({
      data: {
        author_name: author_name,
        author_lastname: author_lastname,
      },
    });

    if (newAuthor) {
      return newAuthor;
    }

    throw new InternalServerErrorException('Nie udało się dodać autora');
  }

  async getOrAddPublisher(publisher_name: string) {
    const publisher = await this.prisma.publisher.findFirst({
      where: {
        publisher_name: publisher_name,
      },
    });

    if (publisher) {
      return publisher;
    }

    const newPublisher = await this.prisma.publisher.create({
      data: {
        publisher_name: publisher_name,
      },
    });

    if (newPublisher) {
      return newPublisher;
    }

    throw new InternalServerErrorException('Nie udało się dodać wydawnictwa');
  }

  async updateBook(
    bookId: number,
    dto: {
      title?: string;
      year?: number;
      cover?: string;
      publisher_name?: string;
      ISBN?: string;
      authors?: { author_name: string; author_lastname: string }[];
    },
  ) {
    await this.findBookOrThrow(bookId);

    if (dto.ISBN && dto.ISBN.length !== 13) {
      throw new BadRequestException('ISBN musi mieć dokładnie 13 znaków');
    }

    const currentYear = new Date().getFullYear();
    if (dto.year && (dto.year < 1900 || dto.year > currentYear + 3)) {
      throw new BadRequestException(
        `Rok publikacji musi być między 1900 a ${currentYear + 3}`,
      );
    }

    if (dto.title || dto.ISBN) {
      const existing = await this.prisma.book
        .findFirst({
          where: {
            AND: [
              { id_book: { not: bookId } },
              {
                OR: [
                  ...(dto.title
                    ? [
                        {
                          title: {
                            equals: dto.title,
                            mode: 'insensitive' as const,
                          },
                        },
                      ]
                    : []),
                  ...(dto.ISBN ? [{ ISBN: dto.ISBN }] : []),
                ],
              },
            ],
          },
        })
        .catch(() => {
          throw new InternalServerErrorException('Błąd bazy danych');
        });

      if (existing) {
        throw new ConflictException(
          'Książka o takim tytule lub ISBN już istnieje',
        );
      }
    }

    const publisher = dto.publisher_name
      ? await this.getOrAddPublisher(dto.publisher_name)
      : undefined;

    const authors = dto.authors
      ? await Promise.all(
          dto.authors.map((a) =>
            this.getOrAddAuthor(a.author_name, a.author_lastname),
          ),
        )
      : undefined;

    return this.prisma.book
      .update({
        where: { id_book: bookId },
        data: {
          ...(dto.title && { title: dto.title }),
          ...(dto.year && { year: dto.year }),
          ...(dto.cover && { cover: dto.cover }),
          ...(dto.ISBN && { ISBN: dto.ISBN }),
          ...(publisher && {
            publisher: { connect: { id_publisher: publisher.id_publisher } },
          }),
          ...(authors && {
            authors: { set: authors.map((a) => ({ id_author: a.id_author })) },
          }),
        },
        select: {
          id_book: true,
          title: true,
          year: true,
          cover: true,
          ISBN: true,
          publisher: { select: { id_publisher: true, publisher_name: true } },
          authors: {
            select: {
              id_author: true,
              author_name: true,
              author_lastname: true,
            },
          },
        },
      })
      .catch(() => {
        throw new InternalServerErrorException(
          'Nie udało się zaktualizować książki',
        );
      });
  }
  async hardDeleteBook(bookId: number) {
    await this.findBookOrThrow(bookId);

    await this.prisma.loan.deleteMany({
      where: { copy: { book_id: bookId } },
    });

    await this.prisma.copy.deleteMany({ where: { book_id: bookId } });

    return this.prisma.book.delete({ where: { id_book: bookId } });
  }
}
