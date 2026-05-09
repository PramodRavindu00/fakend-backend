import { Module } from '@nestjs/common';
import { RouteResponseController } from './route-response.controller';
import { RouteResponseService } from './route-response.service';

@Module({
  controllers: [RouteResponseController],
  providers: [RouteResponseService]
})
export class RouteResponseModule {}
