import { Test, TestingModule } from '@nestjs/testing';
import { QueueDispatcherService } from './queue-dispatcher.service';

describe('QueueDispatcherService', () => {
  let service: QueueDispatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueDispatcherService],
    }).compile();

    service = module.get<QueueDispatcherService>(QueueDispatcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
