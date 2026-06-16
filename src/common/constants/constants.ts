import { Provider } from '@prisma/client';

export class OAuthUserType {
  provider: Provider;
  providerUserId: string;
  email: string | undefined;
  name: string;
  avatarUrl: string | undefined;
}

export class CurrentUserType {
  id: string;
  email: string;
  name: string;
}

export interface OAuthLoginResult {
  refreshToken: string;
  redirectUrl: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: CurrentUserType;
}

export interface RequestWithOauthUser extends Request {
  user: OAuthUserType;
}

export interface ExtendedRequest extends Request {
  cookies?: Record<string, string>;
}
