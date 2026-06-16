import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { Response } from 'express';
import { OAuthLoginResult } from '../constants/constants';

@Injectable()
export class OAuthResultInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<{ url: string }> {
    const res = context.switchToHttp().getResponse<Response>();
    const isProd = this.config.get('NODE_ENV') === 'production';

    return next.handle().pipe(
      map((data: OAuthLoginResult) => {
        res.cookie('refreshToken', data.refreshToken, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? 'none' : 'lax',
          path: '/auth/refresh',
          maxAge: 604800000, // max age should tally with refresh tokens expire time in token generation
          //check with auth service generateAuthTokens method
        });
        return { url: data.redirectUrl };
      }),
    );
  }
}
