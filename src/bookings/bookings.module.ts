import { Module } from '@nestjs/common';
import { BookingsController } from './controllers/bookings.controller';
import { BookingRetrievalResolver } from './graphql/resolvers/booking-retrieval/booking-retrieval.resolver';
import { BookingRetrievalService } from './services/booking-retrieval/booking-retrieval.service';
import { OfflineBookingService } from './services/offline-booking/offline-booking.service';
import { BookingRepository } from './repository/booking.repository';

@Module({
  controllers: [BookingsController],
  providers: [
    BookingRetrievalResolver,
    BookingRetrievalService,
    OfflineBookingService,
    BookingRepository,
  ],
})
export class BookingsModule {}
