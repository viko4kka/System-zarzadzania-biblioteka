import { BadRequestException, NotFoundException, InternalServerErrorException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CopyService {
  constructor(private readonly prisma: PrismaService) {}

  async getCopyIsLoan(id_copy: number) {
    const is_loan =
      (await this.prisma.loan.count({
        where: {
          copy_id: id_copy,
          return_date: null,
        },
      })) > 0;
    return is_loan;
  }

  async getCopy(id_copy: number) {
    const copy = await this.prisma.copy.findUnique({
      where: {
        id_copy: id_copy,
      },
    });
    if (!copy) {
      return null;
    }
    return {
      ...copy,
      is_loan: await this.getCopyIsLoan(id_copy),
    };
  }

  async getBookCopies(id_book: number, page: number, limit: number) {
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100);
    const skip = (validPage - 1) * validLimit;

    const [copy_ids, total] = await Promise.all([
      this.prisma.copy.findMany({
        where: {
          book_id: id_book,
        },
        skip: skip,
        take: validLimit,
        orderBy: {
          id_copy: 'asc',
        },
      }),
      this.prisma.copy.count({
        where: {
          book_id: id_book,
        },
      }),
    ]);

    const copies = await Promise.all(
      copy_ids.map(async (c) => ({
        ...c,
        is_loan: await this.getCopyIsLoan(c.id_copy),
      })),
    );

    return {
      data: copies,
      meta: {
        page: validPage,
        limit: validLimit,
        total: total,
        totalPages: Math.ceil(total / validLimit),
      },
    };
  }

  async addCopy(id_book: number) {
    const book = await this.prisma.book
      .findUnique({
        where: { id_book: id_book },
        select: {
          id_book: true,
        },
      }).catch(() => {
        throw new InternalServerErrorException('Błąd bazy danych');
      });

    if (!book)
      throw new NotFoundException(`Książka o id ${id_book} nie istnieje`);


    const newCopy = await this.prisma.copy.create({
      data: {
        book_id: id_book,
      },
    });
    return {
      ...newCopy,
      is_loan: await this.getCopyIsLoan(newCopy.id_copy),
    };
  }

  async removeCopy(id_copy: number) {
    const copy = await this.getCopy(id_copy);
    if (copy) {
      if (copy.is_loan === true) {
        throw new BadRequestException('Dana kopia jest aktualnie wyporzyczona');
      }
      if (copy.is_actual === false) {
        throw new BadRequestException('Dana kopia jest już usunięta');
      }
      const updatedCopy = await this.prisma.copy.update({
        where: {
          id_copy: id_copy,
        },
        data: {
          is_actual: false,
        },
      });
      return {
        ...updatedCopy,
        is_loan: copy.is_loan,
      };
    }
    throw new BadRequestException('Nie ma kopii o podanym id');
  }
}
