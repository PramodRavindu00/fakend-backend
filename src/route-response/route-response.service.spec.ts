import { Test, TestingModule } from '@nestjs/testing';
import { RouteResponseService } from './route-response.service';

describe('RouteResponseService', () => {
  let service: RouteResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteResponseService],
    }).compile();

    service = module.get<RouteResponseService>(RouteResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
