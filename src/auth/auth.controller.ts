import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Redirect,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserType, OAuthUserType } from 'src/common/constants/constants';
import { OauthUser } from 'src/common/decorators/oauth-user.decorator';
import { AuthService } from './auth.service';
import { OAuthResultInterceptor } from './interceptors/oauth-result.interceptor';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GoogleOAuthCallbackGuard } from './guards/google-oauth-callback.guard';
import { GithubOAuthCallbackGuard } from './guards/github-oauth-callback.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Cookie } from 'src/common/decorators/extract-cookie.decorator';
import { SetRefreshTokenCookie } from './interceptors/set-refresh-token.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SetRefreshTokenCookie)
  refresh(@Cookie('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout() {}

  @Post('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: CurrentUserType) {
    return this.authService.getLoggedUser(user);
  }

  @Get('/oauth/google')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('google'))
  google() {}

  @Get('/oauth/google/callback')
  @UseGuards(GoogleOAuthCallbackGuard)
  @UseInterceptors(OAuthResultInterceptor)
  @Redirect()
  googleCallback(@OauthUser() oauthUser: OAuthUserType) {
    return this.authService.oAuthLogin(oauthUser);
  }

  @Get('/oauth/github')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('github'))
  github() {}

  @Get('/oauth/github/callback')
  @UseGuards(GithubOAuthCallbackGuard)
  @UseInterceptors(OAuthResultInterceptor)
  @Redirect()
  githubCallback(@OauthUser() oauthUser: OAuthUserType) {
    return this.authService.oAuthLogin(oauthUser);
  }
}
