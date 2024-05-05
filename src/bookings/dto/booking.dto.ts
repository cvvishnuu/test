import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { OfflineBookingRequestDto } from './offline-booking-request.dto';

export class BookingRequestDto {
  @IsNotEmpty()
  @IsString()
  source: string;

  @IsNotEmpty()
  @ValidateNested()
  Booking: OfflineBookingRequestDto | string; //Change the type string and add your dto type here
}
