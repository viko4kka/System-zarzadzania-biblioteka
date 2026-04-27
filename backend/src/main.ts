import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { CorsOptionsCallback } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: (origin: string, callback: CorsOptionsCallback) => {
      callback(null, {});
    },
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Biblioteka Informatyczna')
    .setDescription('API obsługujące bibliotekę')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
