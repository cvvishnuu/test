import { Controller , Post, Body} from '@nestjs/common';
import { OfflineBookingRequestDto } from '../dto';
import { BookingService } from '../services/offline-booking.service';

@Controller('bookings')
export class BookingsController {
 constructor(private readonly bookingService: BookingService) { }
 
    @Post("offline")
    async createBooking(@Body() bookingInfo: OfflineBookingRequestDto) {
        return this.bookingService.createBooking(bookingInfo);
    }
}
