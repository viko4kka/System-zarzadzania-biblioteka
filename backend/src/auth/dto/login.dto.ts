import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Adres email użytkownika',
    example: 'jan.kowalski@example.com',
  })
  @IsEmail({}, { message: 'Nieprawidłowy format adresu email' })
  @IsNotEmpty()
  mail!: string;

  @ApiProperty({
    description: 'Hasło użytkownika',
    example: 'SuperTajneHaslo123!',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}