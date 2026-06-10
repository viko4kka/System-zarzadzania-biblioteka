import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { PrismaService } from '../prisma.service';

const mockPrisma = {
  copy: {
    findUnique: jest.fn(),
  },
  loan: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('LoanService', () => {
  let service: LoanService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<LoanService>(LoanService);
  });

  // ──────────────────────────────────────────────
  // loanBook
  // ──────────────────────────────────────────────
  describe('loanBook', () => {
    it('powinno wypożyczyć dostępną kopię', async () => {
      mockPrisma.copy.findUnique.mockResolvedValue({ id_copy: 1, is_actual: true });
      mockPrisma.loan.findFirst.mockResolvedValue(null); // brak aktywnego wypożyczenia
      mockPrisma.loan.create.mockResolvedValue({ copy_id: 1, start_date: new Date() });

      const result = await service.loanBook(42, 1);

      expect(result.copy_id).toBe(1);
      expect(mockPrisma.loan.create).toHaveBeenCalledTimes(1);
    });

    it('powinno rzucić NotFoundException gdy kopia nie istnieje', async () => {
      mockPrisma.copy.findUnique.mockResolvedValue(null);

      await expect(service.loanBook(42, 999)).rejects.toThrow(NotFoundException);
    });

    it('powinno rzucić NotFoundException gdy kopia jest nieaktualna (usunięta)', async () => {
      mockPrisma.copy.findUnique.mockResolvedValue({ id_copy: 1, is_actual: false });

      await expect(service.loanBook(42, 1)).rejects.toThrow(NotFoundException);
    });

    it('powinno rzucić ConflictException gdy kopia jest już wypożyczona', async () => {
      mockPrisma.copy.findUnique.mockResolvedValue({ id_copy: 1, is_actual: true });
      mockPrisma.loan.findFirst.mockResolvedValue({ id_loan: 99, copy_id: 1, return_date: null }); // aktywne wypożyczenie

      await expect(service.loanBook(42, 1)).rejects.toThrow(ConflictException);
    });

    it('powinno rzucić InternalServerErrorException gdy baza zwróci błąd przy szukaniu kopii', async () => {
      mockPrisma.copy.findUnique.mockRejectedValue(new Error('DB error'));

      await expect(service.loanBook(42, 1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  // ──────────────────────────────────────────────
  // returnBook
  // ──────────────────────────────────────────────
  describe('returnBook', () => {
    it('powinno zwrócić książkę gdy istnieje aktywne wypożyczenie', async () => {
      const returnDate = new Date();
      mockPrisma.loan.findFirst.mockResolvedValue({ id_loan: 10, user_id: 42, copy_id: 1, return_date: null });
      mockPrisma.loan.update.mockResolvedValue({ copy_id: 1, return_date: returnDate });

      const result = await service.returnBook(42, 1);

      expect(result.return_date).toBeDefined();
      expect(mockPrisma.loan.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id_loan: 10 } }),
      );
    });

    it('powinno rzucić NotFoundException gdy brak aktywnego wypożyczenia', async () => {
      mockPrisma.loan.findFirst.mockResolvedValue(null);

      await expect(service.returnBook(42, 1)).rejects.toThrow(NotFoundException);
    });

    it('powinno rzucić InternalServerErrorException gdy update się nie powiedzie', async () => {
      mockPrisma.loan.findFirst.mockResolvedValue({ id_loan: 10, user_id: 42, copy_id: 1, return_date: null });
      mockPrisma.loan.update.mockRejectedValue(new Error('DB error'));

      await expect(service.returnBook(42, 1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  // ──────────────────────────────────────────────
  // getUserLoans
  // ──────────────────────────────────────────────
  describe('getUserLoans', () => {
    it('powinno zwrócić historię wypożyczeń użytkownika', async () => {
      const loans = [
        {
          id_loan: 1,
          copy_id: 1,
          start_date: new Date('2024-01-01'),
          return_date: new Date('2024-01-15'),
          copy: { id_copy: 1, book: { id_book: 1, title: 'Wiedźmin', cover: null, ISBN: '1234567890123' } },
        },
      ];
      mockPrisma.loan.findMany.mockResolvedValue(loans);

      const result = await service.getUserLoans(42);

      expect(result).toHaveLength(1);
      expect(result[0].copy.book.title).toBe('Wiedźmin');
    });

    it('powinno zwrócić pustą tablicę gdy użytkownik nie ma wypożyczeń', async () => {
      mockPrisma.loan.findMany.mockResolvedValue([]);

      const result = await service.getUserLoans(42);

      expect(result).toEqual([]);
    });

    it('powinno rzucić InternalServerErrorException gdy baza zwróci błąd', async () => {
      mockPrisma.loan.findMany.mockRejectedValue(new Error('DB error'));

      await expect(service.getUserLoans(42)).rejects.toThrow(InternalServerErrorException);
    });
  });
});