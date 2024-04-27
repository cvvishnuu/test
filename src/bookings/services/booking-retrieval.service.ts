import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingResponse, Customer } from '../graphql/entities';
import { BookingRetrievalDto } from '../dto';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingLocationModel } from '../../shared/data-models';

@Injectable()
export class BookingRetrievalService {
  constructor(private prisma: PrismaService) {}

  private async findCustomerById(
    userId: string,
  ): Promise<Customer | undefined> {
    const customer: Customer = await this.prisma.customer.findUnique({
      where: { UserID: userId },
      select: {
        ID: true,
        Name: true,
        MobileNumber: true,
        Email: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async getCustomerInfo(userId: string): Promise<Customer | undefined> {
    const customerInfo = await this.findCustomerById(userId);
    return customerInfo;
  }

  private async getCustomerBookings(customerID: number) {
    return this.prisma.booking.findMany({
      where: { CustomerID: customerID },
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

    const customerInfo = await this.getCustomerInfo(userId);

    const availableBookings = await this.getCustomerBookings(customerInfo.ID);

    const parsedBookings = this.parseBookingData(availableBookings);

    const responseDTO: BookingResponse = this.constructResponse(
      customerInfo,
      parsedBookings,
    );

    return responseDTO;
  }
}