import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('test')
  test() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('test-protected')
  testProtected() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
