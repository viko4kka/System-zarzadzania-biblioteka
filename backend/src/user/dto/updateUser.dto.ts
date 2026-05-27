import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nowe imię użytkownika',
    example: 'Tomasz',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    description: 'Nowe nazwisko użytkownika',
    example: 'Nienacki',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  lastname!: string;

  @ApiProperty({
    description: 'Obecne hasło użytkownika',
    example: 'SuperTajneHaslo123!',
    minLength: 8,
    maxLength: 64,
    required: true,
  })
  @IsString()
  @MinLength(8, { message: 'Hasło musi mieć co najmniej 8 znaków' })
  @MaxLength(64, { message: 'Hasło może mieć maksymalnie 64 znaki' })
  @IsNotEmpty()
  oldpassword!: string;

  @ApiProperty({
    description: 'Nowe hasło użytkownika',
    example: 'NoweSuperTajneHaslo123!',
    minLength: 8,
    maxLength: 64,
  })
  @IsString()
  @MinLength(8, { message: 'Hasło musi mieć co najmniej 8 znaków' })
  @MaxLength(64, { message: 'Hasło może mieć maksymalnie 64 znaki' })
  newpassword!: string;
}
