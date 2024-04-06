import { Test, TestingModule } from '@nestjs/testing';
import { BookingRetrievalService } from './booking-retrieval.service';

describe('BookingRetrievalService', () => {
  let service: BookingRetrievalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingRetrievalService],
    }).compile();

    service = module.get<BookingRetrievalService>(BookingRetrievalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
