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
  DatabaseException,
  InvalidDealerCodeException,
  InvalidPartOrModelIdException,
} from '../../shared/exceptions';
import {
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';

@Controller(API_ROUTE.BOOKINGS)
export class BookingsController {
  constructor(private readonly offlineBookingService: OfflineBookingService) {}

  @Post(API_ROUTE.OFFLINE)
  async createBooking(@Body() bookingInfo: OfflineBookingRequestDto) {
    try {
      return await this.offlineBookingService.saveBooking(bookingInfo);
    } catch (error) {
      if (
        error instanceof InvalidDealerCodeException ||
        error instanceof InvalidPartOrModelIdException ||
        error instanceof HttpException
      ) {
        throw error;
      } else if (error instanceof PrismaClientInitializationError) {
        throw new DatabaseException(
          EXCEPTION_MESSAGE.PRISMA_INITIALIZATION_ERROR,
        );
      } else if (error instanceof PrismaClientUnknownRequestError) {
        throw new DatabaseException(
          EXCEPTION_MESSAGE.PRISMA_UNKNOWN_REQUEST_ERROR,
        );
      } else {
        throw new InternalServerErrorException(
          `${EXCEPTION_MESSAGE.CREATE_BOOKING_FAILED}: ${error}`,
        );
      }
    }
  }
}
