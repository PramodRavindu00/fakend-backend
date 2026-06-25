import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithOauthUser } from '../constants/constants';

export const OauthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithOauthUser>();
    return request.user;
  },
);
