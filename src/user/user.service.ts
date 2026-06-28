import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: {
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
      },
    });
  }

  async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        userProviders: {
          select: {
            provider: true,
          },
        },
      },
    });
  }

  async createUser(dto: CreateUserDto) {
    return await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const newUser = await tx.user.create({
          data: {
            email: dto.email,
            name: dto.name,
            avatarUrl: dto.avatarUrl,
          },
        });

        //create the provider record
        await tx.userProvider.create({
          data: {
            userId: newUser.id,
            provider: dto.provider,
            providerUserId: dto.providerUserId,
          },
        });
        return newUser;
      },
    );
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({ where: { id } }); //cascade delete user providers
  }
}
