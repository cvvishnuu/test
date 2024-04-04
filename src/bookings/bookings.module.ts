import { Module } from '@nestjs/common';
import { BookingsController } from './controllers/bookings.controller';

@Module({
  controllers: [BookingsController],
})
export class BookingsModule {}
