import { Test, TestingModule } from '@nestjs/testing';
import { RouteResponseController } from './route-response.controller';

describe('RouteResponseController', () => {
  let controller: RouteResponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteResponseController],
    }).compile();

    controller = module.get<RouteResponseController>(RouteResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
