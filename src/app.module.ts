import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';

import { ConfigModule } from '@nestjs/config';
import { AppLoggerModule } from './common/app-logger';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AppLoggerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
