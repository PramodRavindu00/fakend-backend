import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CurrentUserType, JwtPayload } from 'src/common/constants/constants';

describe('AuthService', () => {
  let service: AuthService;

  //mocks
  const configService = {
    getOrThrow: jest.fn().mockReturnValue('FRONTEND_URL'),
  };

  const userService = {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    getUserById: jest.fn(),
  };

  const prismaService = {
    userProvider: {
      create: jest.fn(),
    },
  };

  const jwtService = {
    verify: jest.fn(),
    sign: jest.fn(),
  };

  //test data
  const payload: JwtPayload = {
    sub: 'user-123',
    email: 'test@example.com',
  };

  const mockUser:CurrentUserType = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: 'avatar.jpg',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: configService },
        { provide: UserService, useValue: userService },
        { provide: PrismaService, useValue: prismaService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Should returns the logged in user', () => {
    expect(service.getLoggedUser(mockUser)).toEqual(mockUser);
  });
});
