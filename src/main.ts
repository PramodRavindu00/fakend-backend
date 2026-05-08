import { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { logger } from './common/app-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule as Type<unknown>);
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  const PORT = process.env.PORT ?? 8080;
  await app.listen(PORT);

  logger.info(`Server started running on Port : ${PORT} `);
}
bootstrap().catch((error) => console.error(error));
