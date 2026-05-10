import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/route.dto';

@Injectable()
export class RouteService {
  async create(dto: CreateRouteDto) {}
}
