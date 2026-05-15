import { Body, Controller, Post } from '@nestjs/common';
import { CreateRouteDto } from './dto/route.dto';
import { RouteService } from './route.service';

@Controller('route')
export class RouteController {
  constructor(private readonly service: RouteService) {}

  @Post()
  create(@Body() dto: CreateRouteDto) {
    return this.service.create(dto);
  }
}
