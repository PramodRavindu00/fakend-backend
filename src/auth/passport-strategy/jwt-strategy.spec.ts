import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt-strategy';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/constants/constants';
import { UnauthorizedException } from '@nestjs/common';

describe('JWT Strategy', () => {
  let strategy: JwtStrategy;

  // mocks
  const configService = {
    getOrThrow: jest.fn().mockReturnValue('test-jwt-secret'),
  };
  const userService = {
    getUserById: jest.fn(),
  };

  //test data
  const payload: JwtPayload = {
    sub: 'user-123',
    email: 'test@example.com',
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: 'avatar.jpg',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: configService },
        { provide: UserService, useValue: userService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('Returns current user when exists', async () => {
    userService.getUserById.mockResolvedValue(mockUser);
    await expect(strategy.validate(payload)).resolves.toEqual(mockUser);
    expect(userService.getUserById).toHaveBeenCalledWith(payload.sub);
  });

  it('Throws UnauthorizedException when user is not found', async () => {
    userService.getUserById.mockResolvedValue(null);
    await expect(strategy.validate(payload)).rejects.toThrow(
      new UnauthorizedException('User not Found'),
    );
    expect(userService.getUserById).toHaveBeenCalledWith(payload.sub);
  });
});
