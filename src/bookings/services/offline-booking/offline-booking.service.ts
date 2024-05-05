import { Injectable } from '@nestjs/common';
import { OfflineBookingRequestDto } from '../../dto';
import { CustomBookingRepository } from '../../customRepository/custom-booking.repository';
import { generateUUID } from '../../../shared/utils';
import {
  BOOKING_STATUS,
  RESPONSE_MESSAGE,
} from '../../../shared/constants/constants';

@Injectable()
export class OfflineBookingService {
  constructor(private readonly bookingRepository: CustomBookingRepository) {}

  async processBooking(
    bookingInfo: OfflineBookingRequestDto,
  ): Promise<{ message: string; uuid: string }> {
    const UUID = generateUUID();

    const customer = await this.bookingRepository.saveCustomer(
      bookingInfo.customer,
    );

    const booking = await this.bookingRepository.saveBooking(
      bookingInfo.dealer,
      bookingInfo.location,
      bookingInfo.bookingSource,
      UUID,
      customer,
      BOOKING_STATUS.CONFIRMED,
    );
    await this.bookingRepository.saveVehicle(bookingInfo.vehicle, booking);
    await this.bookingRepository.savePayment(
      bookingInfo.paymentDetails,
      booking,
    );

    return { message: RESPONSE_MESSAGE.BOOKING_CREATED, uuid: UUID };
  }
}
