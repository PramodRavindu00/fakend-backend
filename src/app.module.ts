import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppLoggerModule } from './common/app-logger';
import { AppController } from './app.controller';
import { ProjectModule } from './project/project.module';
import { RouteModule } from './route/route.module';
import { RouteResponseModule } from './route-response/route-response.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
    }),
    PrismaModule,
    AppLoggerModule,
    ProjectModule,
    RouteModule,
    RouteResponseModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
