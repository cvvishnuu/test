import { Injectable } from '@nestjs/common';
import { OfflineBookingRequestDto } from '../../dto';
import { BookingRepository } from '../../repository/booking.repository';
import {
  generateUUID,
  validateDealerCode,
  validatePartAndModel,
} from '../../../shared/utils';
import {
  BOOKING_STATUS,
  RESPONSE_MESSAGE,
} from '../../../shared/constants/constants';
import { QueueModelTransformerService } from '../../../busConductor/services/model-transformer/queue-model-transformer.service';

@Injectable()
export class OfflineBookingService {
  constructor(
    private offlineBookingRepository: BookingRepository,
    private queueTransformerService: QueueModelTransformerService,
  ) {}

  async saveBooking(
    bookingInfo: OfflineBookingRequestDto,
  ): Promise<{ message: string; uuid: string }> {
    await validateDealerCode(bookingInfo.dealer?.dealerCode);

    await validatePartAndModel(
      bookingInfo.vehicle?.partId,
      bookingInfo.vehicle?.modelId,
    );

    const UUID = generateUUID();

    const customerId = await this.offlineBookingRepository.saveCustomer(
      bookingInfo.customer,
    );

    await this.offlineBookingRepository.createBookingEntity(
      bookingInfo.dealer,
      bookingInfo.location,
      bookingInfo.bookingSource,
      UUID,
      customerId,
      BOOKING_STATUS.CONFIRMED,
    );
    await this.offlineBookingRepository.createVehicle(
      bookingInfo.vehicle,
      UUID,
    );
    await this.offlineBookingRepository.createPayment(
      bookingInfo.paymentDetails,
      UUID,
    );

    await this.queueTransformerService.bookingConfirmationEmailDispatcher(
      bookingInfo,
      UUID,
    );

    return { message: RESPONSE_MESSAGE.BOOKING_CREATED, uuid: UUID };
  }
}
