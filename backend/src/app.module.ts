import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { CopyModule } from './copy/copy.module';

@Module({
  imports: [HealthModule, AuthModule, UserModule, BookModule, CopyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
