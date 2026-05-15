import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  CreateRouteResponseDto,
  UpdateRouteResponseDto,
} from './dto/route-response.dto';

@Injectable()
export class RouteResponseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRouteResponseDto) {
    await this.prisma.routeResponse.create({ data: { ...dto } });
  }
  async edit(id: string, dto: UpdateRouteResponseDto) {
    await this.prisma.routeResponse.update({ where: { id }, data: { ...dto } });
  }

  async findAll() {}
  async findOne() {}
  async delete() {}
}
