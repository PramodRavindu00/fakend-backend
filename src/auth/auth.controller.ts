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
import { OauthUser } from 'src/common/decorators/oauthUser.decorator';
import { AuthService } from './auth.service';
import { OAuthResultInterceptor } from 'src/common/interceptors/oauth-result.interceptor';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GoogleOAuthCallbackGuard } from 'src/common/guards/google-oauth-callback.guard';
import { GithubOAuthCallbackGuard } from 'src/common/guards/github-oauth-callback.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/refresh')
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  refresh() {}

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
