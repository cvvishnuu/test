import { Module } from '@nestjs/common';
import { BookingsController } from './controllers/bookings.controller';
import { BookingRetrievalResolver } from './graphql/booking-retrieval.resolver';
import { BookingRetrievalService } from './services/booking-retrieval.service';
import { BookingService } from './services/offline-booking.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingRetrievalResolver, BookingRetrievalService,BookingService],
})
export class BookingsModule {}
