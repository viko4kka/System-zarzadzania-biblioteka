import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PrismaService } from '../prisma.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [BookController],
  providers: [BookService, PrismaService, AuthService],
  exports: [BookService],
})
export class BookModule {}
