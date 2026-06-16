import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OAuthUserType } from 'src/common/constants/constants';
import { OauthUser } from 'src/common/decorators/oauthUser.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
  googleCallback(@OauthUser() oauthUser: OAuthUserType) {
    return this.authService.oAuthLogin(oauthUser);
  }

  @Get('/oauth/github')
  @UseGuards(AuthGuard('github'))
  github() {}

  @Get('/oauth/github/callback')
  githubCallback(@OauthUser() oauthUser: OAuthUserType) {
    return this.authService.oAuthLogin(oauthUser);
  }
}
