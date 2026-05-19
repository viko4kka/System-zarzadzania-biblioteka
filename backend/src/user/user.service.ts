import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        mail: true,
        name: true,
        lastname: true,
        is_Admin: true,
        is_Banned: true,
        is_Removed: true,
        loans: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Nie ma użytkownika o takim id');
    }
    return user;
  }

  async searchUsers(page: number, limit: number, search?: string) {
    // Walidacja parametrów
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // maksymalnie 100 wyników
    const skip = (validPage - 1) * validLimit;

    // Budowanie warunku wyszukiwania
    const whereClause = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { lastname: { contains: search, mode: 'insensitive' as const } },
            { mail: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    // Pobieranie użytkowników z paginacją
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereClause,
        skip: skip,
        take: validLimit,
        select: {
          id: true,
          name: true,
          lastname: true,
          mail: true,
          is_Admin: true,
          is_Banned: true,
          is_Removed: true,
        },
        orderBy: {
          id: 'asc',
        },
      }),
      this.prisma.user.count({
        where: whereClause,
      }),
    ]);

    // Zwracamy dane z metadanymi paginacji
    return {
      data: users,
      meta: {
        page: validPage,
        limit: validLimit,
        total: total,
        totalPages: Math.ceil(total / validLimit),
      },
    };
  }

  async makeAdmin(userId: number) {
    // Sprawdzenie czy użytkownik istnieje
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Użytkownik nie został znaleziony');
    }

    // Aktualizacja użytkownika - nadanie uprawnień admina
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { is_Admin: true },
      select: {
        id: true,
        name: true,
        is_Admin: true,
      },
    });

    return updatedUser;
  }

  async ban(userId: number) {
    // Sprawdzenie czy użytkownik istnieje
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Użytkownik nie został znaleziony');
    }

    // Aktualizacja użytkownika - nadanie uprawnień admina
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { is_Banned: true },
      select: {
        id: true,
        name: true,
        is_Banned: true,
      },
    });

    return updatedUser;
  }

  async unban(userId: number) {
    // Sprawdzenie czy użytkownik istnieje
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Użytkownik nie został znaleziony');
    }

    // Aktualizacja użytkownika - nadanie uprawnień admina
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { is_Banned: false },
      select: {
        id: true,
        name: true,
        is_Banned: true,
      },
    });

    return updatedUser;
  }
}
