import {
  Controller,
  Post,
  Body,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { OfflineBookingRequestDto } from '../dto';
import { OfflineBookingService } from '../services';
import { API_ROUTE, EXCEPTION_MESSAGE } from '../../shared/constants/constants';
import {
  InvalidDealerCodeException,
  InvalidPartOrModelIdException,
} from '../../shared/exceptions';
import { validateDealerCode, validatePartAndModel } from '../../shared/utils';
import { QueueModelTransformerService } from '../../cloudConductor/services/model-transformer/queue-model-transformer.service';

@Controller(API_ROUTE.BOOKINGS)
export class BookingsController {
  constructor(
    private readonly offlineBookingService: OfflineBookingService,
    private readonly queueTransformerService: QueueModelTransformerService,
  ) {}

  /*
    Please specify the response type based on the outgoing response from the respective service 
    It cannot be any
  */
  @Post(API_ROUTE.OFFLINE)
  async createBooking(@Body() bookingInfo: OfflineBookingRequestDto) {
    try {
      /*
        Implementing SRP - Controllers controlles which service to be called based on the excecution level
      */

      // Validate Dealer Code
      await validateDealerCode(bookingInfo.dealer?.dealerCode);

      // Part ID Model ID of the vehicle
      await validatePartAndModel(
        bookingInfo.vehicle?.partId,
        bookingInfo.vehicle?.modelId,
      );

      const response =
        await this.offlineBookingService.processBooking(bookingInfo);

      await this.queueTransformerService.bookingConfirmationEmailDispatcher(
        bookingInfo,
        response.uuid,
      );
    } catch (error) {
      if (
        error instanceof InvalidDealerCodeException ||
        error instanceof InvalidPartOrModelIdException ||
        error instanceof HttpException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          `${EXCEPTION_MESSAGE.CREATE_BOOKING_FAILED}: ${error}`,
        );
      }
    }
  }
}
