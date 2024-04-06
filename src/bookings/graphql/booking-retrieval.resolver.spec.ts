import { Test, TestingModule } from '@nestjs/testing';
import { BookingRetrievalResolver } from './booking-retrieval.resolver';

describe('BookingRetrievalResolver', () => {
  let resolver: BookingRetrievalResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingRetrievalResolver],
    }).compile();

    resolver = module.get<BookingRetrievalResolver>(BookingRetrievalResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
