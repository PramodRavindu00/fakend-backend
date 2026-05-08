import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { pinoHttpConfig } from './logger';

@Global()
@Module({
  imports: [LoggerModule.forRoot(pinoHttpConfig)],
  exports: [LoggerModule],
})
export class AppLoggerModule {}
