import { Args, Query, Resolver } from '@nestjs/graphql';
import { BookingRetrievalService } from '../services';
import { BookingResponse } from './entities/booking-response.entity';
import { BookingRetrievalDto } from '../dto';

@Resolver(() => BookingResponse)
export class BookingRetrievalResolver {
  constructor(private bookingRetrievalService: BookingRetrievalService) {}

  @Query(() => BookingResponse)
  async fetchBookings(
    @Args() query: BookingRetrievalDto,
  ): Promise<BookingResponse> {
    return await this.bookingRetrievalService.fetchBookings(query);
  }
}
