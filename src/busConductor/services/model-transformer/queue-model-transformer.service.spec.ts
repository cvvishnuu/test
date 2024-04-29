import { Test, TestingModule } from '@nestjs/testing';
import { QueueModelTransformerService } from './queue-model-transformer.service';

describe('QueueModelTransformerService', () => {
  let service: QueueModelTransformerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueModelTransformerService],
    }).compile();

    service = module.get<QueueModelTransformerService>(
      QueueModelTransformerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
