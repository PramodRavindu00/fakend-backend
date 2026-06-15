import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('/refresh')
  refresh() {}

  @Post('/logout')
  logout() {}

  @Post('/me')
  me() {}
}
