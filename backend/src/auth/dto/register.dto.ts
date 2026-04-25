// walidacja danych do bazy danych
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Adres email użytkownika',
    example: 'jan.kowalski@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'Nieprawidłowy format adresu email' })
  @IsNotEmpty()
  mail!: string;

  @ApiProperty({
    description: 'Hasło użytkownika (min. 8 znaków)',
    example: 'SuperTajneHaslo123!',
    minLength: 8,
    maxLength: 64,
    required: true,
  })
  @IsString()
  @MinLength(8, { message: 'Hasło musi mieć co najmniej 8 znaków' })
  @MaxLength(64, { message: 'Hasło może mieć maksymalnie 64 znaki' })
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    description: 'Imię użytkownika',
    example: 'Jan',
    maxLength: 50,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Imię jest wymagane' })
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    description: 'Nazwisko użytkownika',
    example: 'Kowalski',
    maxLength: 50,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Nazwisko jest wymagane' })
  @MaxLength(50)
  lastname!: string;
}
