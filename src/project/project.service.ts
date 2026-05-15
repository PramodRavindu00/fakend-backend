import { Injectable } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateProjectDto,
    tx?: Prisma.TransactionClient,
  ): Promise<string> {
    const dbConn = tx ? tx : this.prisma;
    const newProject = await dbConn.project.create({
      data: {
        ...dto,
        secretHash: await this.generateProjectSecret(),
        ownerId: '',
      },
    });

    return newProject.id;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async findAll() {}
  async findOne() {}
  async delete() {}

  async createAuto(tx: Prisma.TransactionClient): Promise<string> {
    const title = `Project-${randomBytes(8).toString('hex')}`;
    return await this.create({ title }, tx);
  }

  private async generateProjectSecret(): Promise<string> {
    const projectSecret = randomBytes(32).toString('hex');
    return await bcrypt.hash(projectSecret, 10);
  }
}
