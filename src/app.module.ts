import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';

import { ConfigModule } from '@nestjs/config';
import { AppLoggerModule } from './common/app-logger';
import { AppController } from './app.controller';
import { ProjectModule } from './project/project.module';
import { RouteModule } from './route/route.module';
import { RouteResponseModule } from './route-response/route-response.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OauthModule } from './oauth/oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AppLoggerModule,
    ProjectModule,
    RouteModule,
    RouteResponseModule,
    AuthModule,
    OauthModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
