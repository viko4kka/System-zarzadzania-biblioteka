import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET ?? 'change_me_in_env';
const JWT_EXPIRES_IN = '7d';

export interface AuthResult {
  id: number;
  name: string;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    // Sprawdź czy email jest już zajęty
    const existing = await this.prisma.user.findUnique({
      where: { mail: dto.mail },
    }).catch(() => {
      throw new InternalServerErrorException('Błąd bazy danych');
    });

    if (existing) {
      throw new ConflictException('Użytkownik z tym adresem email już istnieje');
    }

    // Zahashuj hasło
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // Zapisz użytkownika
    const user = await this.prisma.user.create({
      data: {
        mail: dto.mail,
        password: passwordHash,
        name: dto.name,
        lastname: dto.lastname,
      },
      select: {
        id: true,
        name: true,
      },
    }).catch(() => {
      throw new InternalServerErrorException('Nie udało się utworzyć konta');
    });

    // Wygeneruj JWT
    const token = jwt.sign(
      { sub: user.id, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return { id: user.id, name: user.name, token };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    // Znajdź użytkownika po emailu
    const user = await this.prisma.user.findUnique({
      where: { mail: dto.mail },
      select: {
        id: true,
        name: true,
        password: true,
      },
    }).catch(() => {
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

    // Wygeneruj token
    const token = jwt.sign(
      { sub: user.id, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return { id: user.id, name: user.name, token };
  }

}

