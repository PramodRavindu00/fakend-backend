import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/project.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { randomIdrandomUUID } from 'crypto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateProjectDto, tx?: Prisma.TransactionClient) {
    const dbConn = tx ? tx : this.prisma;
    await dbConn.project.create({
      data: { ...dto, secretHash: '' },
    });
  }
  async findAll() {}
  async findOne() {}
  async update() {}
  async delete() {}

  async createAuto(tx: Prisma.TransactionClient) {
    const randomId = randomIdrandomUUID();
    const title = `Project-${randomId}`;
    await this.create({ title }, tx);
  }
}
