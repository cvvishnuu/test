import { Module } from '@nestjs/common';
import { BookingsController } from './controllers/bookings.controller';
import { BookingRetrievalResolver } from './graphql/resolvers/booking-retrieval/booking-retrieval.resolver';
import { BookingRetrievalService } from './services/booking-retrieval/booking-retrieval.service';
import { OfflineBookingService } from './services/offline-booking/offline-booking.service';
import { CustomBookingRepository } from './customRepository/custom-booking.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Booking,
  BookingJournal,
  BookingJournalKey,
  Customer,
  Payment,
  Vehicle,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Vehicle,
      Payment,
      Customer,
      BookingJournal,
      BookingJournalKey,
    ]),
  ],
  controllers: [BookingsController],
  providers: [
    BookingRetrievalResolver,
    BookingRetrievalService,
    OfflineBookingService,
    CustomBookingRepository,
  ],
})
export class BookingsModule {}
