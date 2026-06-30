import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Provider } from '@prisma/client';
import { Profile, Strategy } from 'passport-google-oauth20';
import { OAuthUserType } from 'src/common/constants/constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.getOrThrow('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): OAuthUserType {
    return {
      provider: Provider.Google,
      providerUserId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      avatarUrl: profile.photos?.[0]?.value,
    };
  }
}
