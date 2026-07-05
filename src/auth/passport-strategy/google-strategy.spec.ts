import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@prisma/client';
import { Profile } from 'passport-google-oauth20';
import { GoogleStrategy } from './google-strategy';

describe('Google Strategy', () => {
  let strategy: GoogleStrategy;

  const configService = {
    getOrThrow: jest.fn().mockReturnValue('test-google-config'),
  };

  const profile = {
    id: '1234',
    displayName: 'test user',
    emails: [{ value: 'test@test.com' }],
    photos: [{ value: 'test.png' }],
  } as Profile;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    strategy = module.get<GoogleStrategy>(GoogleStrategy);
  });

  it('returns OAuth user from google profile', () => {
    const result = strategy.validate('access-token', 'refresh-token', profile);

    expect(result).toEqual({
      provider: Provider.Google,
      providerUserId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      avatarUrl: profile.photos?.[0]?.value,
    });
  });
});
