import { Test, TestingModule } from '@nestjs/testing';
import { BookingConfirmationDispatcherService } from './booking-confirmation-dispatcher.service';

describe('BookingConfirmationDispatcherService', () => {
  let service: BookingConfirmationDispatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingConfirmationDispatcherService],
    }).compile();

    service = module.get<BookingConfirmationDispatcherService>(BookingConfirmationDispatcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
