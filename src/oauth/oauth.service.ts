import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class OauthService {
  getGoogleAuthUrl() {
    const base = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `${base}?${params.toString()}`;
  }

  getGithubAuthUrl() {}

  async handleGoogleLogin(code: string) {
    if (!code) throw new BadRequestException('Google Auth Code Not Found');
  }
}
