import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
  await app.listen(port);
  console.log(`FARO API rodando em http://localhost:${port}`);
}

bootstrap();
