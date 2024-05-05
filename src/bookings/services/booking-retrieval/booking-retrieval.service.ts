import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingResponse, Customer } from '../../graphql/graphqlEntities';
import { BookingRetrievalDto } from '../../dto';
import { BookingLocationModel } from '../../../shared/data-models';
import { CustomBookingRepository } from '../../customRepository/custom-booking.repository';
import { EXCEPTION_MESSAGE } from '../../../shared/constants/constants';
import { Payment } from '../../../entities';

@Injectable()
export class BookingRetrievalService {
  constructor(private readonly bookingRepository: CustomBookingRepository) {}

  async getCustomerInfo(userId: string): Promise<Customer | undefined> {
    const customerInfo =
      await this.bookingRepository.findCustomerByUserId(userId);

    if (!customerInfo) {
      throw new NotFoundException(EXCEPTION_MESSAGE.CUSTOMER_NOT_FOUND);
    }

    delete customerInfo.Bookings;
    delete customerInfo.CreatedOn;
    delete customerInfo.UserID;
    delete customerInfo.UpdatedOn;
    delete customerInfo.UpdatedBy;

    return customerInfo;
  }

  private parseBookingData(bookings) {
    return bookings.map((booking) => {
      const { Location, ...rest } = booking;
      const parsedLocation: BookingLocationModel = JSON.parse(Location);
      return {
        ...rest,
        Location: parsedLocation,
      };
    });
  }

  private constructResponse(
    customerInfo: Customer,
    parsedBookings,
  ): BookingResponse {
    return {
      Customer: {
        ID: customerInfo.ID,
        Name: customerInfo.Name,
        Email: customerInfo.Email,
        MobileNumber: customerInfo.MobileNumber,
      },
      Bookings: parsedBookings.map((booking) => ({
        UUID: booking.UUID,
        BookingNumber: booking.BookingNumber,
        BookingSource: booking.BookingSource,
        BookingReceivedDate: booking.CreatedOn,
        CurrentStage: booking.BookingStatus,
        OrderConfirmedDate: booking.BookingConfirmedDate,
        OrderManufacturedDate: booking.OrderManufacturedDate,
        OrderPackedDate: booking.OrderPackedDate,
        OrderDispatchedDate: booking.OrderDispatchedDate,
        City: booking.Location.cityName,
        State: booking.Location.stateName,
        Pincode: booking.Location.bookingPinCode,
        BookingAddress: booking.Location.bookingAddress,
        Dealer: {
          DealerCode: booking.DealerCode,
          DealerName: '',
          BranchCode: booking.BranchCode,
          DealerPinCode: booking.DealerPincode,
        },
        Vehicle: {
          Name: booking.Vehicle.Model,
          Variant: booking.Vehicle.Variant,
          Color: booking.Vehicle.Color,
          ExShowRoomPrice: booking.Vehicle.ExShowRoomPrice,
          OnRoadPrice: booking.Vehicle.OnRoadPrice,
          PartID: booking.Vehicle.PartID,
          ModelID: booking.Vehicle.ModelID,
          VehicleType: booking.Vehicle.VehicleType,
          IsBTO: booking.Vehicle.IsBTO,
        },
        PaymentDetails: booking.Payments.map((payment: Payment) => ({
          TransactionID: payment.TransactionID,
          OrderID: payment.OrderID,
          Amount: payment.AmountPaid,
          PaymentType: payment.PaymentType,
          PaymentStatus: payment.PaymentStatus,
        })),
      })),
    };
  }

  async fetchBookings(query: BookingRetrievalDto): Promise<BookingResponse> {
    const { userId } = query;

    const customerInfo = await this.getCustomerInfo(userId);

    const availableBookings =
      await this.bookingRepository.fetchBookingsByCustomerID(customerInfo.ID);

    const parsedBookings = this.parseBookingData(availableBookings);

    const responseDTO: BookingResponse = this.constructResponse(
      customerInfo,
      parsedBookings,
    );

    return responseDTO;
  }
}
