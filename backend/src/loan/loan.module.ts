import { Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { PrismaService } from '../prisma.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [LoanController],
  providers: [LoanService, PrismaService, AuthService],
  exports: [LoanService],
})
export class LoanModule {}
