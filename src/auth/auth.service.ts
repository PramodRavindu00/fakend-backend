import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Provider } from '@prisma/client';
import {
  CurrentUserType,
  JwtPayload,
  OAuthLoginResult,
  OAuthUserType,
} from 'src/common/constants/constants';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async oAuthLogin(oAuthUser: OAuthUserType): Promise<OAuthLoginResult> {
    if (!oAuthUser.email) {
      throw new BadRequestException('Email is not provided by OAuth provider');
    }

    const { email, name, avatarUrl, provider, providerUserId } = oAuthUser;

    // check system user record existing with oAuth verified email
    const existingUser = await this.userService.getUserByEmail(oAuthUser.email);

    let jwtPayLoad: JwtPayload;

    if (existingUser) {
      //check current provider is linked, if not link this provider
      const isCurrentProviderLinked = existingUser?.userProviders?.some(
        (existingProvider) =>
          existingProvider.provider === provider &&
          existingProvider.providerUserId === providerUserId,
      );

      // link current provider to the existing user
      if (!isCurrentProviderLinked) {
        await this.linkOAuthProvider(existingUser.id, provider, providerUserId);
      }

      //extract data required for the internal token creation
      jwtPayLoad = { sub: existingUser.id, email: existingUser.email };
    } else {
      // create new user
      const newUser = await this.userService.createUser({
        email,
        name,
        avatarUrl,
        provider,
        providerUserId,
      });

      //get jwt payload
      jwtPayLoad = { sub: newUser.id, email: newUser.email };
    }
    //generate tokens
    const { accessToken, refreshToken } = this.generateAuthTokens(jwtPayLoad);

    //generate redirect url for the frontend application
    const frontEndUrl = this.config.getOrThrow<string>('FRONTEND_URL');
    const redirectUrl = new URL('/auth/oauth/callback', frontEndUrl);
    redirectUrl.searchParams.set('token', accessToken); //set access token as a query param

    return {
      redirectUrl: redirectUrl.toString(),
      refreshToken,
    };
  }

  getLoggedUser(user: CurrentUserType) {
    return user;
  }

  private async linkOAuthProvider(
    userId: string,
    provider: Provider,
    providerUserId: string,
  ) {
    await this.prisma.userProvider.create({
      data: {
        userId,
        provider,
        providerUserId,
      },
    });
  }

  private generateAuthTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign({
      sub: payload.sub,
      email: payload.email,
    });
    const refreshToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email },
      { expiresIn: '7d' }, // refresh token cookies expire time should be same with this
      //check OAuthRedirectInterceptor for refresh token's cookie generation
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
