import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class AddBookAuthorDto {
  @ApiProperty({
    description: 'Imię autora',
    example: 'Jan',
  })
  @IsString()
  @IsNotEmpty()
  author_name: string;

  @ApiProperty({
    description: 'Nazwisko autora',
    example: 'Nowak',
  })
  @IsString()
  @IsNotEmpty()
  author_lastname: string;
}

export class AddBookDto {
  @ApiProperty({
    description: 'Tytuł książki',
    example: 'Java: podstawy',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Rok wydania książki',
    example: 2013,
  })
  @IsNumber()
  year: number;

  @ApiProperty({
    description: 'Nazwa wydawnictwa',
    example: 'PWN',
  })
  @IsString()
  @IsNotEmpty()
  publisher_name: string;

  @ApiProperty({
    description: 'Autorzy książki',
    example: [
      {
        author_name: 'Cay',
        author_lastname: 'Horstmann',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddBookAuthorDto)
  authors: AddBookAuthorDto[];

  @ApiProperty({
    description: 'URL okładki książki',
    example: 'https://static01.helion.com.pl/global/okladki/vbig/javp13.jpg',
  })
  @IsOptional()
  @IsString()
  cover?: string;

  @ApiProperty({
    description: 'Kod ISBN książki',
    example: '9788328930247',
  })
  @IsOptional()
  @IsString()
  ISBN?: string;
}
