import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@prisma/client';
import { Profile } from 'passport-github2';
import { GithubStrategy } from './github-strategy';

describe('Github Strategy', () => {
  let strategy: GithubStrategy;

  //mocks
  const configService = {
    getOrThrow: jest.fn().mockReturnValue('test-github-config'),
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
        GithubStrategy,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    strategy = module.get<GithubStrategy>(GithubStrategy);
  });

  it('Returns OAuth user from github profile', () => {
    const result = strategy.validate('access-token', 'refresh-token', profile);

    expect(result).toEqual({
      provider: Provider.Github,
      providerUserId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      avatarUrl: profile.photos?.[0]?.value,
    });
  });
});
