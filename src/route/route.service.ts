import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/route.dto';
import { ProjectService } from 'src/project/project.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RouteService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly prisma: PrismaService,
  ) {}
  async create(dto: CreateRouteDto) {
    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const projectId = dto.projectId
        ? dto.projectId
        : await this.projectService.createAuto(tx);
      await tx.route.create({
        data: {
          ...dto,
          projectId,
        },
      });
    });
  }
}
