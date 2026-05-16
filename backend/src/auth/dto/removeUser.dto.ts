import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveUserDto {
  @ApiProperty({
    description: 'Hasło użytkownika',
    example: 'SuperTajneHaslo123!',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
