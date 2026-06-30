import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const mockUser = {
    id: '1',
    email: 'test@test.com',
    name: 'Test',
    avatarUrl: 'avatar.jpg',
    userProviders: [
      {
        provider: 'Google',
        providerUserId: '123',
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('Find a user by Email', () => {
    it('Returns user if exists', () => {});
    it('Returns null if not found', () => {});
  });
  describe('Find a user by Id', () => {
    it('Returns user if exists', () => {});
    it('Returns null if not found', () => {});
  });
});
