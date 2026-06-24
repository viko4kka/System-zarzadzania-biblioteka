import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';

// Dodanie zmockowanego bcrypta
jest.mock('bcrypt');

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // GetUser
  describe('getUser', () => {
    it('Zwrócono informacje o użytkowniku', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        mail: 'subiekt@sklep.pl',
        name: 'Ignacy',
        lastname: 'Rzecki',
        is_Admin: false,
        is_Banned: false,
        is_Removed: false,
        loans: [],
      });

      const result = await service.getUser(1);

      expect(result.id).toBe(1);
      expect(result.mail).toBe('subiekt@sklep.pl');
      expect(result.name).toBe('Ignacy');
      expect(result.lastname).toBe('Rzecki');
      expect(result.is_Admin).toBe(false);
      expect(result.is_Banned).toBe(false);
      expect(result.is_Removed).toBe(false);
    });

    it('Nie znaleziono użytkownika', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  // searchUsers
  describe('searchUsers', () => {
    const lista = [
      {
        id: 1,
        name: 'Ignacy',
        lastname: 'Rzecki',
        mail: 'subiekt@sklep.pl',
        is_Admin: false,
        is_Banned: false,
        is_Removed: false,
      },
      {
        id: 2,
        name: 'Stanisław',
        lastname: 'Wokulski',
        mail: 'subiekt2@sklep.pl',
        is_Admin: false,
        is_Banned: false,
        is_Removed: false,
      },
      {
        id: 3,
        name: 'Henryk',
        lastname: 'Szlangbaum',
        mail: 'subiekt3@sklep.pl',
        is_Admin: false,
        is_Banned: false,
        is_Removed: false,
      },
    ];

    it('Uzyskanie listy użytkowników z paginacją', async () => {
      mockPrisma.user.findMany.mockResolvedValue(lista);
      mockPrisma.user.count.mockResolvedValue(3);

      const result = await service.searchUsers(1, 2);

      expect(result.data).toHaveLength(3);
      expect(result.data).toBe(lista);

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(2);
      expect(result.meta.total).toBe(3);
      expect(result.meta.totalPages).toBe(2);
    });

    it('Uzyskanie pustej listy przez źle podaną strone', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(3);

      const result = await service.searchUsers(3, 2);

      expect(result.data).toEqual([]);

      expect(result.meta.page).toBe(3);
      expect(result.meta.limit).toBe(2);
      expect(result.meta.total).toBe(3);
      expect(result.meta.totalPages).toBe(2);
    });

    it('Uzyskanie listy użytkowniku mimo podania ujemnej strony', async () => {
      mockPrisma.user.findMany.mockResolvedValue(lista);
      mockPrisma.user.count.mockResolvedValue(3);

      const result = await service.searchUsers(-1, 2);

      expect(result.data).toBe(lista);

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(2);
      expect(result.meta.total).toBe(3);
      expect(result.meta.totalPages).toBe(2);
    });

    it('Uzyskanie listy użytkowniku mimo podania ujemnego limitu', async () => {
      mockPrisma.user.findMany.mockResolvedValue(lista);
      mockPrisma.user.count.mockResolvedValue(3);

      const result = await service.searchUsers(1, -3);

      expect(result.data).toBe(lista);

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(1);
      expect(result.meta.total).toBe(3);
      expect(result.meta.totalPages).toBe(3);
    });

    it('Uzyskanie listy użytkowniku wraz z wyszukiwaniem po imieniu', async () => {
      mockPrisma.user.findMany.mockResolvedValue(lista[0]);
      mockPrisma.user.count.mockResolvedValue(1);

      const result = await service.searchUsers(1, 2, 'Ign');

      expect(result.data).toBe(lista[0]);

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(2);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });

  // makeAdmin
  describe('makeAdmin', () => {
    it('Użytkownik otrzymał uprawnienia administratora', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Ignacy',
        lastname: 'Rzecki',
        is_Admin: false,
      });

      mockPrisma.user.update.mockResolvedValue({ id: 1, is_Admin: true });

      const result = await service.makeAdmin(1);

      expect(result.id).toBe(1);
      expect(result.is_Admin).toBe(true);
    });

    it('Użytkownik będący adminem nie jest modyfikowany', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Ignacy',
        lastname: 'Rzecki',
        is_Admin: true,
      });

      const result = await service.makeAdmin(1);

      expect(result.id).toBe(1);
      expect(result.is_Admin).toBe(true);
    });

    it('Nie odnaleziono użytkownika', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.makeAdmin(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ban
  describe('ban', () => {
    it('Użytkownik został zablokowany', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Ignacy',
        lastname: 'Rzecki',
        is_Banned: false,
      });

      mockPrisma.user.update.mockResolvedValue({ id: 1, is_Banned: true });

      const result = await service.ban(1);

      expect(result.id).toBe(1);
      expect(result.is_Banned).toBe(true);
    });

    it('Użytkownik zablokowany nie jest modyfikowany', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Ignacy',
        lastname: 'Rzecki',
        is_Banned: true,
      });

      const result = await service.ban(1);

      expect(result.id).toBe(1);
      expect(result.is_Banned).toBe(true);
    });

    it('Nie odnaleziono użytkownika', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.ban(1)).rejects.toThrow(NotFoundException);
    });
  });

  // unban
  describe('unban', () => {
    it('Użytkownik został odblokowany', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Ignacy',
        lastname: 'Rzecki',
        is_Banned: true,
      });

      mockPrisma.user.update.mockResolvedValue({ id: 1, is_Banned: false });

      const result = await service.unban(1);

      expect(result.id).toBe(1);
      expect(result.is_Banned).toBe(false);
    });

    it('Użytkownik niezablokowany nie jest modyfikowany', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Ignacy',
        lastname: 'Rzecki',
        is_Banned: false,
      });

      const result = await service.unban(1);

      expect(result.id).toBe(1);
      expect(result.is_Banned).toBe(false);
    });

    it('Nie odnaleziono użytkownika', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.unban(1)).rejects.toThrow(NotFoundException);
    });
  });

  // updateUser
  describe('updateUser', () => {
    const dto = {
      userId: 1,
      newName: 'Stanisław',
      newLastname: 'Wokulski',
      oldPassword: 'hashed',
      newPassword: 'newhaslo1234',
    };

    it('Dane zostały zmienione', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Ignacy',
        lastname: 'Rzecki',
        password: 'hashed',
      });
      mockPrisma.user.update.mockResolvedValue({
        id: 1,
        name: dto.newName,
        lastname: dto.newLastname,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.updateUser(
        dto.userId,
        dto.newName,
        dto.newLastname,
        dto.oldPassword,
        dto.newPassword,
      );

      expect(result.id).toBe(dto.userId);
      expect(result.name).toBe(dto.newName);
      expect(result.lastname).toBe(dto.newLastname);
    });

    it('Dane zostały zmienione, pomimo podania pustych parametrów nowych danych', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Ignacy',
        lastname: 'Rzecki',
        password: 'hashed',
      });
      mockPrisma.user.update.mockResolvedValue({
        id: 1,
        name: 'Ignacy',
        lastname: 'Rzecki',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.updateUser(
        dto.userId,
        '',
        '',
        dto.oldPassword,
        '',
      );

      expect(result.id).toBe(dto.userId);
      expect(result.name).toBe('Ignacy');
      expect(result.lastname).toBe('Rzecki');
    });

    it('Użytkownik nie istnieje', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateUser(
          dto.userId,
          dto.newName,
          dto.newLastname,
          dto.oldPassword,
          dto.newPassword,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('Podano niepoprawne hasło', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Ignacy',
        lastname: 'Rzecki',
        password: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.updateUser(
          dto.userId,
          dto.newName,
          dto.newLastname,
          dto.oldPassword,
          dto.newPassword,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
