import { Injectable } from '@nestjs/common';
import {
  BookingConfirmationEmailDto,
  OfflineBookingRequestDto,
  QueueModelDto,
} from '../../../bookings/dto';
import { QueueDispatcherService } from '../dispatcher/queue-dispatcher.service';
import {
  COMMUNICATION_CONTEXT,
  VEHICLE_TYPE,
} from '../../../shared/constants/constants';

@Injectable()
export class QueueModelTransformerService {
  constructor(private queueDispatcherService: QueueDispatcherService) {}

  async bookingConfirmationEmailDispatcher(
    bookingInfo: OfflineBookingRequestDto,
    Uuid: string,
  ): Promise<void> {
    const confirmationEmailModel: BookingConfirmationEmailDto =
      new BookingConfirmationEmailDto();
    const topicModel: QueueModelDto = new QueueModelDto();

    confirmationEmailModel.variant = bookingInfo.vehicle.description.variant;
    confirmationEmailModel.email = bookingInfo.customer.email;
    confirmationEmailModel.phoneNumber = bookingInfo.customer.phone;
    confirmationEmailModel.amount = bookingInfo.paymentDetails.amountPaid;
    confirmationEmailModel.isBooked = true;
    confirmationEmailModel.name = bookingInfo.customer.name;
    confirmationEmailModel.vehicleModel = bookingInfo.vehicle.description.model;
    confirmationEmailModel.bookingDate = bookingInfo.bookingDate.toString();
    confirmationEmailModel.amountReceived =
      bookingInfo.paymentDetails.amountPaid.toString();
    confirmationEmailModel.uuid = Uuid;
    confirmationEmailModel.totalVehicleValue = Number(
      bookingInfo.vehicle.onRoadPrice,
    );

    topicModel.context = COMMUNICATION_CONTEXT.CONFIRMATION;
    topicModel.data = JSON.stringify(confirmationEmailModel);
    topicModel.brand = bookingInfo.vehicle.evBooking
      ? VEHICLE_TYPE.EV
      : VEHICLE_TYPE.ICE;

    await this.queueDispatcherService.dispatchConfirmation(topicModel);
  }
}
