import { Logger } from '@nestjs/common';

export abstract class AppLoggerBase {
  protected readonly logger: Logger;
  protected constructor() {
    this.logger = new Logger(this.constructor.name);
  }
}
