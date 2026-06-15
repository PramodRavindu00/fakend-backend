import { Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { OauthService } from './oauth.service';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('/google')
  @Redirect()
  google() {
    return { url: this.oauthService.getGoogleAuthUrl() };
  }

  @Get('/github')
  github() {}

  @Get('/google/callback')
  googleCallback(@Query() code: string) {
    return this.oauthService.handleGoogleLogin(code);
  }

  @Get('/github/callback')
  githubCallback() {}

  @Post('/link/:provider')
  link() {}
}
