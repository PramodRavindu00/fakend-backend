import { Global, Module } from '@nestjs/common';
import { pinoConfig } from './index';
import { LoggerModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: pinoConfig,
    }),
  ],
  exports: [LoggerModule],
})
export class AppLoggerModule {}
