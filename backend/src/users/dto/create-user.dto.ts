import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  mail: string;

  @ApiProperty()
  password: string;
  
  @ApiProperty()
  name: string;

  @ApiProperty()
  lastname: string;
}
