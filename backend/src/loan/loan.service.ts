import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LoanService {
  constructor(private readonly prisma: PrismaService) {}

  async loanBook(userId: number, copyId: number) {

    const copy = await this.prisma.copy
      .findUnique({
        where: { id_copy: copyId },
        select: { id_copy: true, is_actual: true },
      })
      .catch(() => {
        throw new InternalServerErrorException('Błąd bazy danych');
      });

    if (!copy || !copy.is_actual) {
      throw new NotFoundException('Kopia o podanym id nie istnieje');
    }

    const activeLoan = await this.prisma.loan
      .findFirst({
        where: { copy_id: copyId, return_date: null },
      })
      .catch(() => {
        throw new InternalServerErrorException('Błąd bazy danych');
      });

    if (activeLoan) {
      throw new ConflictException('Kopia jest już wypożyczona');
    }

    return await this.prisma.loan
      .create({
        data: {
          user_id: userId,
          copy_id: copyId,
          start_date: new Date(),
        },
        select: { copy_id: true, start_date: true },
      })
      .catch(() => {
        throw new InternalServerErrorException('Nie udało się wypożyczyć książki');
      });
  }

  async returnBook(userId: number, copyId: number) {

    const activeLoan = await this.prisma.loan
      .findFirst({
        where: {
          user_id: userId,
          copy_id: copyId,
          return_date: null,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Błąd bazy danych');
      });

    if (!activeLoan) {
      throw new NotFoundException('Brak aktywnego wypożyczenia tej kopii');
    }

    return await this.prisma.loan
      .update({
        where: { id_loan: activeLoan.id_loan },
        data: { return_date: new Date() },
        select: { copy_id: true, return_date: true },
      })
      .catch(() => {
        throw new InternalServerErrorException('Nie udało się zwrócić książki');
      });
  }

  async getUserLoans(userId: number) {
    return await this.prisma.loan
      .findMany({
        where: { user_id: userId },
        orderBy: { start_date: 'desc' },
        select: {
          id_loan: true,
          copy_id: true,
          start_date: true,
          return_date: true,
          copy: {
            select: {
              book: {
                select: {
                  id_book: true,
                  title: true,
                  cover: true,
                  ISBN: true,
                  authors: true,
                },
              },
            },
          },
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Błąd bazy danych');
      });
  }

  async getUserActiveLoans(userId: number, page: number, limit: number) {
    // Walidacja parametrów
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // maksymalnie 100 wyników
    const skip = (validPage - 1) * validLimit;

    //
    const [loans, total] = await Promise.all([
      this.prisma.loan.findMany({
        where: { user_id: userId, return_date: null },
        skip: skip,
        take: validLimit,
        select: {
          id_loan: true,
          copy_id: true,
          start_date: true,
          return_date: true,
          copy: {
            select: {
              book: {
                select: {
                  id_book: true,
                  title: true,
                  cover: true,
                  ISBN: true,
                  authors: true,
                },
              },
            },
          },
        },
        orderBy: {
          start_date: 'desc',
        },
      }),
      this.prisma.loan.count({
        where: {
          user_id: userId,
          return_date: null,
        }
      }),
    ]).catch(() => {
        throw new InternalServerErrorException('Błąd bazy danych');
      });;

    // Zwracamy dane z metadanymi paginacji
    return {
      data: loans,
      meta: {
        page: validPage,
        limit: validLimit,
        total: total,
        totalPages: Math.ceil(total / validLimit),
      },
    };


  }
}
