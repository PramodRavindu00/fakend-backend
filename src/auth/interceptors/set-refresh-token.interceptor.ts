import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable, tap } from 'rxjs';
import { CurrentUserType } from 'src/common/constants/constants';

@Injectable()
export class SetRefreshTokenCookie implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      tap(
        (data: {
          accessToken: string;
          refreshToken: string;
          user: CurrentUserType;
        }) => {
          if (data && data.refreshToken) {
            const isProd = process.env.NODE_ENV === 'production';
            res.cookie('refreshToken', data.refreshToken, {
              httpOnly: true,
              secure: isProd,
              sameSite: isProd ? 'none' : 'lax',
              path: '/auth/refresh',
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });
          }
        },
      ),
      map((data: { accessToken: string; user: CurrentUserType }) => {
        //map transforms the data
        return { accessToken: data.accessToken, user: data.user }; //exclude refresh token returning with response body
      }),
    );
  }
}
