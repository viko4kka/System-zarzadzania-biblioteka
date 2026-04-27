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
        loans: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Nie ma użytkownika o takim id');
    }
    return user;
  }
}
