import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Provider } from '@prisma/client';
import { Profile, Strategy } from 'passport-github2';
import { OAuthUserType } from 'src/common/constants/constants';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow('GITHUB_CLIENT_ID'),
      clientSecret: config.getOrThrow('GITHUB_CLIENT_SECRET'),
      callbackURL: config.getOrThrow('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): OAuthUserType {
    return {
      provider: Provider.Github,
      providerUserId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      avatarUrl: profile.photos?.[0]?.value,
    };
  }
}
