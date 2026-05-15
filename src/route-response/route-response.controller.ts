import { Body, Controller } from '@nestjs/common';
import { CreateRouteResponseDto } from './dto/route-response.dto';
import { RouteResponseService } from './route-response.service';

@Controller('route-response')
export class RouteResponseController {
  constructor(private readonly routeResponseService: RouteResponseService) {}
  create(@Body() dto: CreateRouteResponseDto) {
    return this.routeResponseService.create(dto);
  }
}
