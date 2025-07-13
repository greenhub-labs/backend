import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger(AppModule.name);
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4100);
  const url = await app.getUrl();
  logger.log(`🚀 Server is running on ${url}`);
}
bootstrap();
