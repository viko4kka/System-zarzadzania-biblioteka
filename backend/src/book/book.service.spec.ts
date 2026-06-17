import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { PrismaService } from '../prisma.service';

// Mockujemy cały PrismaService — nie potrzebujemy prawdziwej bazy danych
const mockPrisma = {
  book: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
  author: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  publisher: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  copy: {
    count: jest.fn(),
  },
};

describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    // Resetujemy wszystkie mocki przed każdym testem
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  // ──────────────────────────────────────────────
  // addBook
  // ──────────────────────────────────────────────
  describe('addBook', () => {
    const dto = {
      title: 'Wiedźmin',
      year: 1990,
      cover: 'url',
      ISBN: '1234567890123',
      publisher_name: 'SuperNOWA',
      authors: [{ author_name: 'Andrzej', author_lastname: 'Sapkowski' }],
    };

    it('powinno dodać książkę jeśli tytuł i ISBN są unikalne', async () => {
      mockPrisma.book.findFirst.mockResolvedValue(null); // brak duplikatu
      mockPrisma.author.findFirst.mockResolvedValue({ id_author: 1, author_name: 'Andrzej', author_lastname: 'Sapkowski' });
      mockPrisma.publisher.findFirst.mockResolvedValue({ id_publisher: 1, publisher_name: 'SuperNOWA' });
      mockPrisma.book.create.mockResolvedValue({ id_book: 1, title: 'Wiedźmin' });

      const result = await service.addBook(dto);

      expect(result).toEqual({ id_book: 1, title: 'Wiedźmin' });
      expect(mockPrisma.book.create).toHaveBeenCalledTimes(1);
    });

    it('powinno rzucić ConflictException jeśli książka już istnieje', async () => {
      mockPrisma.book.findFirst.mockResolvedValue({ id_book: 5, title: 'Wiedźmin' });

      await expect(service.addBook(dto)).rejects.toThrow(ConflictException);
    });

    it('powinno rzucić BadRequestException gdy ISBN ma nieprawidłową długość', async () => {
      mockPrisma.book.findFirst.mockResolvedValue(null);
      const badDto = { ...dto, ISBN: '123' }; // za krótki ISBN

      await expect(service.addBook(badDto)).rejects.toThrow(BadRequestException);
    });

    it('powinno rzucić InternalServerErrorException gdy baza zwróci błąd', async () => {
      mockPrisma.book.findFirst.mockRejectedValue(new Error('DB error'));

      await expect(service.addBook(dto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  // ──────────────────────────────────────────────
  // searchBooks
  // ──────────────────────────────────────────────
  describe('searchBooks', () => {
    it('powinno zwrócić paginowaną listę książek', async () => {
      mockPrisma.book.count.mockResolvedValue(25);
      mockPrisma.book.findMany.mockResolvedValue([
        { id_book: 1, title: 'Wiedźmin', year: 1990, ISBN: '1234567890123', cover: null, authors: [] },
      ]);

      const result = await service.searchBooks(1, 10);

      expect(result.meta.total).toBe(25);
      expect(result.meta.totalPages).toBe(3);
      expect(result.data).toHaveLength(1);
    });

    it('powinno ograniczyć limit do 100', async () => {
      mockPrisma.book.count.mockResolvedValue(5);
      mockPrisma.book.findMany.mockResolvedValue([]);

      const result = await service.searchBooks(1, 999);

      expect(result.meta.limit).toBe(100);
    });

    it('powinno obsłużyć stronę 0 jako stronę 1', async () => {
      mockPrisma.book.count.mockResolvedValue(5);
      mockPrisma.book.findMany.mockResolvedValue([]);

      const result = await service.searchBooks(0, 10);

      expect(result.meta.page).toBe(1);
    });

    it('powinno rzucić InternalServerErrorException gdy count się nie powiedzie', async () => {
      mockPrisma.book.count.mockRejectedValue(new Error('DB error'));

      await expect(service.searchBooks(1, 10)).rejects.toThrow(InternalServerErrorException);
    });
  });

  // ──────────────────────────────────────────────
  // getBook
  // ──────────────────────────────────────────────
  describe('getBook', () => {
    it('powinno zwrócić książkę z liczbą kopii', async () => {
      mockPrisma.book.findUnique.mockResolvedValue({
        id_book: 1,
        title: 'Wiedźmin',
        year: 1990,
        cover: null,
        ISBN: '1234567890123',
        publisher_id: 1,
        authors: [
          {
            id_author: 1,
            author_name: 'Andrzej',
            author_lastname: 'Sapkowski',
          },
        ],
        _count: { copies: 3 },
      });
      mockPrisma.copy.count.mockResolvedValue(2); // 2 dostępne kopie

      const result = await service.getBook(1);

      expect(result.totalCopies).toBe(3);
      expect(result.availableCopies).toBe(2);
      expect(result.authors).toHaveLength(1);
    });

    it('powinno rzucić NotFoundException gdy książka nie istnieje', async () => {
      mockPrisma.book.findUnique.mockResolvedValue(null);

      await expect(service.getBook(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ──────────────────────────────────────────────
  // getOrAddAuthor
  // ──────────────────────────────────────────────
  describe('getOrAddAuthor', () => {
    it('powinno zwrócić istniejącego autora', async () => {
      const existingAuthor = { id_author: 1, author_name: 'Andrzej', author_lastname: 'Sapkowski' };
      mockPrisma.author.findFirst.mockResolvedValue(existingAuthor);

      const result = await service.getOrAddAuthor('Andrzej', 'Sapkowski');

      expect(result).toEqual(existingAuthor);
      expect(mockPrisma.author.create).not.toHaveBeenCalled();
    });

    it('powinno stworzyć nowego autora gdy nie istnieje', async () => {
      mockPrisma.author.findFirst.mockResolvedValue(null);
      mockPrisma.author.create.mockResolvedValue({ id_author: 2, author_name: 'Nowy', author_lastname: 'Autor' });

      const result = await service.getOrAddAuthor('Nowy', 'Autor');

      expect(result.id_author).toBe(2);
      expect(mockPrisma.author.create).toHaveBeenCalledTimes(1);
    });
  });
});