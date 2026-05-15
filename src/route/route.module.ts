import { Module } from '@nestjs/common';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { ProjectModule } from 'src/project/project.module';
import { ProjectService } from 'src/project/project.service';

@Module({
  imports: [ProjectModule],
  controllers: [RouteController],
  providers: [RouteService, ProjectService],
})
export class RouteModule {}
