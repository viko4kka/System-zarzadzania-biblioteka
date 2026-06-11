process.env.JWT_SECRET = 'test-secret';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';

// Mockujemy zewnętrzne biblioteki — nie wywołujemy prawdziwego bcrypt/jwt
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  // ──────────────────────────────────────────────
  // register
  // ──────────────────────────────────────────────
  describe('register', () => {
    const dto = {
      mail: 'test@example.com',
      password: 'haslo123',
      name: 'Jan',
      lastname: 'Kowalski',
    };

    it('powinno zarejestrować nowego użytkownika', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null); // email wolny
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      mockPrisma.user.create.mockResolvedValue({ id: 1, name: 'Jan', is_Admin: false });
      (jwt.sign as jest.Mock).mockReturnValue('fake-token');

      const result = await service.register(dto);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Jan');
      expect(result.token).toBe('fake-token');
    });

    it('powinno rzucić ConflictException gdy email jest zajęty', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 5, mail: 'test@example.com' });

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });

    it('powinno rzucić InternalServerErrorException gdy baza zwróci błąd przy sprawdzeniu emaila', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error('DB error'));

      await expect(service.register(dto)).rejects.toThrow(InternalServerErrorException);
    });

    it('powinno hashować hasło przed zapisem', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      mockPrisma.user.create.mockResolvedValue({ id: 1, name: 'Jan', is_Admin: false });
      (jwt.sign as jest.Mock).mockReturnValue('fake-token');

      await service.register(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('haslo123', 12);
    });
  });

  // ──────────────────────────────────────────────
  // login
  // ──────────────────────────────────────────────
  describe('login', () => {
    const dto = { mail: 'test@example.com', password: 'haslo123' };

    it('powinno zalogować użytkownika z poprawnymi danymi', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Jan',
        password: 'hashed',
        is_Admin: false,
        is_Banned: false,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('fake-token');

      const result = await service.login(dto);

      expect(result.token).toBe('fake-token');
      expect(result.is_Admin).toBe(false);
    });

    it('powinno rzucić UnauthorizedException gdy użytkownik nie istnieje', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('powinno rzucić UnauthorizedException gdy hasło jest błędne', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Jan',
        password: 'hashed',
        is_Admin: false,
        is_Banned: false,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // złe hasło

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  // ──────────────────────────────────────────────
  // removeUser
  // ──────────────────────────────────────────────
  describe('removeUser', () => {
    it('powinno oznaczyć użytkownika jako usuniętego', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1, name: 'Jan', is_Removed: false });
      mockPrisma.user.update.mockResolvedValue({ id: 1, is_Removed: true });

      const result = await service.removeUser(1);

      expect(result.is_Removed).toBe(true);
    });

    it('powinno rzucić NotFoundException gdy użytkownik nie istnieje', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.removeUser(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ──────────────────────────────────────────────
  // verifyPassword
  // ──────────────────────────────────────────────
  describe('verifyPassword', () => {
    it('powinno zwrócić true dla poprawnego hasła', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.verifyPassword(1, 'mojeHaslo');

      expect(result).toBe(true);
    });

    it('powinno zwrócić false dla błędnego hasła', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.verifyPassword(1, 'zleHaslo');

      expect(result).toBe(false);
    });

    it('powinno rzucić NotFoundException gdy użytkownik nie istnieje', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.verifyPassword(999, 'haslo')).rejects.toThrow(NotFoundException);
    });
  });
});