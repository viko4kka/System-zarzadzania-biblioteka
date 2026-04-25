import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

export interface RegisterResult {
  id: number;
  name: string;
  token: string;
}
export interface LoginResult {
  id: number;
  name: string;
  token: string;
  is_Admin: boolean;
  is_Banned: boolean;
}

export interface JwtPayload {
  id: number;
  name: string;
  is_Admin: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  signToken(user: { id: number; name: string; is_Admin: boolean }) {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET musi być zdefiniowany w .env');
    }
    // Wygeneruj JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, is_Admin: user.is_Admin },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );
    return token;
  }

  verifyToken(req: Request) {
    const token = req.cookies?.access_token as string;
    if (!token) {
      throw new UnauthorizedException('Użytkownik niezalogowany');
    }
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET musi być zdefiniowany w .env');
    }
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!payload) {
      throw new UnauthorizedException('Błędny Token');
    }
    return payload;
  }

  async register(dto: RegisterDto): Promise<RegisterResult> {
    // Sprawdź czy email jest już zajęty
    const existing = await this.prisma.user
      .findUnique({
        where: { mail: dto.mail },
      })
      .catch(() => {
        throw new InternalServerErrorException('Błąd bazy danych');
      });

    if (existing) {
      throw new ConflictException(
        'Użytkownik z tym adresem email już istnieje',
      );
    }

    // Zahashuj hasło
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // Zapisz użytkownika
    const user = await this.prisma.user
      .create({
        data: {
          mail: dto.mail,
          password: passwordHash,
          name: dto.name,
          lastname: dto.lastname,
        },
        select: {
          id: true,
          name: true,
          is_Admin: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Nie udało się utworzyć konta');
      });

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    // Wygeneruj JWT
    const token = this.signToken(user);

    return { id: user.id, name: user.name, token };
  }

  async login(dto: LoginDto): Promise<LoginResult> {
    // Znajdź użytkownika po emailu
    const user = await this.prisma.user
      .findUnique({
        where: { mail: dto.mail },
        select: {
          id: true,
          name: true,
          password: true,
          is_Admin: true,
          is_Banned: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Błąd bazy danych');
      });

    // Jeśli nie znaleziono lub hasło nieprawidłowe
    if (!user) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    // Wygeneruj token
    const token = this.signToken(user);

    return {
      id: user.id,
      name: user.name,
      token,
      is_Admin: user.is_Admin,
      is_Banned: user.is_Banned,
    };
  }
}
