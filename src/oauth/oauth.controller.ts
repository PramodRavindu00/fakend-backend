import {
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { OauthService } from './oauth.service';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('google'))
  googleCallback(@Query('code') code: string) {
    return this.oauthService.handleGoogleLogin(code);
  }

  @Get('/github/callback')
  githubCallback() {}

  @Post('/link/:provider')
  link() {}
}
