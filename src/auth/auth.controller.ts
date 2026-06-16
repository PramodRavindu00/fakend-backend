import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Post('/refresh')
  refresh() {}

  @Post('/logout')
  logout() {}

  @Post('/me')
  me() {}

  @Get('/oauth/google')
  @UseGuards(AuthGuard('google'))
  google() {}

  @Get('/oauth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback() {}

  @Get('/oauth/github')
  @UseGuards(AuthGuard('github'))
  github() {}

  @Get('/oauth/github/callback')
  githubCallback() {}
}
