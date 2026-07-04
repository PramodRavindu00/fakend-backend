import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@prisma/client';
import { UserService } from './user.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';

describe('UserService', () => {
  let service: UserService;

  // mocks
  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    userProvider: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  //re-usable test data
  const id = '1234';
  const email = 'existing@user.com';
  const mockUser = {
    id,
    email,
    name: 'Test',
    avatarUrl: 'avatar.jpg',
    userProviders: [
      {
        provider: 'Google',
        providerUserId: '123',
      },
    ],
  };
  const selectQuery = {
    id: true,
    email: true,
    name: true,
    avatarUrl: true,
    userProviders: {
      select: {
        provider: true,
        providerUserId: true,
      },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('Find a user by Email', () => {
    it('Returns user if exists', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.getUserByEmail(email);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        select: selectQuery,
      });
      expect(result).toEqual(mockUser);
    });

    it('Returns null if not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.getUserByEmail(email);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        select: selectQuery,
      });
      expect(result).toBeNull();
    });
  });

  describe('Find a user by Id', () => {
    it('Returns user if exists', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.getUserById(id);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: selectQuery,
      });
      expect(result).toEqual(mockUser);
    });

    it('Returns null if not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.getUserById(id);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: selectQuery,
      });
      expect(result).toBeNull();
    });
  });

  it('Creates user and provider inside a transaction', async () => {
    const createUserDto: CreateUserDto = {
      email: 'new@user.com',
      name: 'New User',
      avatarUrl: 'avatar.png',
      provider: Provider.Google,
      providerUserId: 'google-123',
    };

    const createdUser = {
      id: 'new-id',
      email: createUserDto.email,
      name: createUserDto.name,
      avatarUrl: createUserDto.avatarUrl,
    };
    const tx = {
      user: { create: jest.fn().mockResolvedValue(createdUser) },
      userProvider: { create: jest.fn().mockResolvedValue({}) },
    };

    prisma.$transaction.mockImplementation(async (callback) => callback(tx));

    const result = await service.createUser(createUserDto);

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(tx.user.create).toHaveBeenCalledWith({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        avatarUrl: createUserDto.avatarUrl,
      },
    });
    expect(tx.userProvider.create).toHaveBeenCalledWith({
      data: {
        userId: createdUser.id,
        provider: createUserDto.provider,
        providerUserId: createUserDto.providerUserId,
      },
    });
    expect(result).toEqual(createdUser);
  });

  it('Deletes the user', async () => {
    prisma.user.delete.mockResolvedValue(mockUser);

    await service.deleteUser(id);

    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
