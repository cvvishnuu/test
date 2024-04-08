import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingResponse, Customer } from '../graphql/entities';
import { BookingRetrievalDto } from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingLocationModel } from '../../shared/data-models';

@Injectable()
export class BookingRetrievalService {
  constructor(private prisma: PrismaService) {}

  private async getCustomerInfo(userId: number): Promise<Customer | undefined> {
    const customerInfo = await this.prisma.customer.findUnique({
      where: { ID: userId },
    });

    if (!customerInfo) {
      throw new NotFoundException('Customer not found');
    }

    return customerInfo;
  }

  private async getCustomerBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { CustomerID: userId },
      select: {
        UUID: true,
        BookingNumber: true,
        BookingSource: true,
        CreatedOn: true,
        DealerCode: true,
        BranchCode: true,
        DealerPincode: true,
        Location: true,
        BookingStatus: true,
        BookingConfirmedDate: true,
        OrderManufacturedDate: true,
        OrderPackedDate: true,
        OrderDispatchedDate: true,
        Vehicle: {
          select: {
            Model: true,
            Variant: true,
            Color: true,
            ExShowRoomPrice: true,
            OnRoadPrice: true,
            PartID: true,
            ModelID: true,
            VehicleType: true,
            IsBTO: true,
          },
        },
        Payments: {
          select: {
            TransactionID: true,
            OrderID: true,
            AmountPaid: true,
            PaymentType: true,
            PaymentStatus: true,
          },
        },
      },
    });
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
          dealerPinCode: booking.DealerPincode,
        },
        Vehicle: {
          Name: booking.Vehicle.Model,
          Variant: booking.Vehicle.Variant,
          Color: booking.Vehicle.Color,
          ExShowRoomPrice: booking.Vehicle.ExShowRoomPrice,
          onRoadPrice: booking.Vehicle.OnRoadPrice,
          PartID: booking.Vehicle.PartID,
          ModelID: booking.Vehicle.ModelID,
          VehicleType: booking.Vehicle.VehicleType,
        },
        PaymentDetails: booking.Payments.map((payment) => ({
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

    if (userId) {
      const parsedUserId = parseInt(userId, 10);

      const customerInfo = await this.getCustomerInfo(parsedUserId);

      const availableBookings = await this.getCustomerBookings(parsedUserId);

      const parsedBookings = this.parseBookingData(availableBookings);

      const responseDTO: BookingResponse = this.constructResponse(
        customerInfo,
        parsedBookings,
      );

      return responseDTO;
    }
    // else if (query.customerPhoneNumber) {
    // }
  }
}
