import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Injectable()
export class GoogleOAuthCallbackGuard extends AuthGuard('google') {
  constructor(private readonly config: ConfigService) {
    super();
  }
  handleRequest<TUser = any>(
    err: any,
    user: TUser,
    _info: any,
    context: ExecutionContext,
  ): TUser {
    const res = context.switchToHttp().getResponse<Response>();
    const req = context.switchToHttp().getRequest<Request>();

    if (err || !user) {
      const providerError = req.query?.error as string | undefined;
      const errorCode = providerError ?? 'oauth_cancelled';

      const frontEndUrl = this.config.getOrThrow<string>('FRONTEND_URL');
      const url = new URL('/auth/oauth/callback', frontEndUrl);
      url.searchParams.set('error', errorCode);
      res.redirect(url.toString());
      return undefined as TUser;
    }
    return user;
  }
}
