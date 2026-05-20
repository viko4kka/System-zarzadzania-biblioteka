import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CopyController } from './copy.controller';
import { CopyService } from './copy.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [CopyController],
  providers: [CopyService, PrismaService, AuthService],
})
export class CopyModule {}
