import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingResponse } from '../graphql/entities';
import { BookingRetrievalDto } from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingLocationModel } from '../data-models';

@Injectable()
export class BookingRetrievalService {
  constructor(private prisma: PrismaService) {}

  async fetchBookings(query: BookingRetrievalDto): Promise<BookingResponse> {
    const { userId } = query;

    /* 
        Implement Redis Cache Business Logic here
    */

    if (userId) {
      const parsedUserId = parseInt(userId, 10);

      const customerInfo = await this.prisma.customer.findUnique({
        where: { ID: parsedUserId },
      });

      if (!customerInfo) {
        throw new NotFoundException('Customer not found');
      }

      const availableBookings = await this.prisma.booking.findMany({
        where: { CustomerID: parsedUserId },
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

      const parsedBookings = availableBookings.map((booking) => {
        const { Location, ...rest } = booking;

        const parsedLocation: BookingLocationModel = JSON.parse(Location);
        return {
          ...rest,
          Location: parsedLocation,
        };
      });

      const responseDTO: BookingResponse = {
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
          Dealer: {
            DealerCode: booking.DealerCode,
            DealerName: '',
            BranchCode: booking.BranchCode,
            Location: {
              City: booking.Location.cityName,
              State: booking.Location.stateName,
              Pincode: booking.Location.bookingPinCode,
              BookingAddress: booking.Location.bookingAddress,
              dealerPinCode: booking.DealerPincode,
            },
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

      return responseDTO;

      // const bookings: BookingResponse = availableBookings
    }
    // else if (query.customerPhoneNumber) {
    // }
  }
}
