import { Query, Resolver } from '@nestjs/graphql';
import { BookingRetrievalService } from '../services';
import { BookingResponse } from './entities/booking-response.entity';

@Resolver(() => BookingResponse)
export class BookingRetrievalResolver {
  constructor(private bookingRetrievalService: BookingRetrievalService) {}

  @Query(() => BookingResponse)
  fetchBookings(): string {
    return 'wassup';
  }
}
