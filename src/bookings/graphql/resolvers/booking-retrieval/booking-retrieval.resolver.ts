import { Args, Query, Resolver } from '@nestjs/graphql';
import { BookingRetrievalService } from '../../../services';
import { BookingResponse } from '../../entities/booking-response.entity';
import { BookingRetrievalDto } from '../../../dto';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => BookingResponse)
export class BookingRetrievalResolver {
  constructor(private bookingRetrievalService: BookingRetrievalService) {}

  @Query(() => BookingResponse)
  async fetchBookings(
    @Args() query: BookingRetrievalDto,
  ): Promise<BookingResponse> {
    try {
      return await this.bookingRetrievalService.fetchBookings(query);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw error;
      }
    }
  }
}
