import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nowe imię użytkownika',
    example: 'Tomasz',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Nowe nazwisko użytkownika',
    example: 'Nienacki',
  })
  @IsString()
  lastname!: string;

  @ApiProperty({
    description: 'Obecne hasło użytkownika',
    example: 'SuperTajneHaslo123!',
  })
  @IsString()
  oldpassword!: string;

  @ApiProperty({
    description: 'Nowe hasło użytkownika',
    example: 'NoweSuperTajneHaslo123!',
  })
  @IsString()
  newpassword!: string;

}
