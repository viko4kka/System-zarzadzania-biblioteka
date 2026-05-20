import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nowe imię użytkownika',
    example: 'Tomasz',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Nowe nazwisko użytkownika',
    example: 'Nienacki',
  })
  @IsString()
  @IsNotEmpty()
  lastname!: string;

  @ApiProperty({
    description: 'Nowe hasło użytkownika',
    example: 'SuperTajneHaslo123!',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

}
