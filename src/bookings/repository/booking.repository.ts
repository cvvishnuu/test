import { Injectable } from '@nestjs/common';
import {
  CustomerDto,
  DealerDto,
  LocationDto,
  PaymentDetailsDto,
  VehicleDto,
} from '../dto';
import { PrismaService } from '../../prisma/prisma.service';
import { BOOKING_STATUS, VEHICLE_TYPE } from '../../shared/constants/constants';

@Injectable()
export class BookingRepository {
  constructor(private prisma: PrismaService) {}

  private async findCustomerByUserId(userId: string): Promise<number | null> {
    const existingUser = await this.prisma.customer.findFirst({
      where: {
        UserID: userId,
      },
    });
    return existingUser ? existingUser.ID : null;
  }

  public async saveCustomer(customerInfo: CustomerDto): Promise<number> {
    const existingUserId = await this.findCustomerByUserId(customerInfo.userId);
    if (existingUserId) {
      return existingUserId;
    }

    const newUser = await this.prisma.customer.create({
      data: {
        Name: customerInfo.name,
        MobileNumber: customerInfo.phone,
        Email: customerInfo.email,
        UserID: customerInfo.userId,
      },
    });

    return newUser.ID;
  }

  public async createBookingEntity(
    dealerInfo: DealerDto,
    locationInfo: LocationDto,
    bookingSource: string,
    UUID: string,
    customerId: number,
    bookingStatus: BOOKING_STATUS,
  ): Promise<void> {
    await this.prisma.booking.create({
      data: {
        UUID: UUID,
        Customer: {
          connect: { ID: customerId },
        },
        Location: JSON.stringify(locationInfo),
        HomeDeliverySelected: false,
        DealerCode: dealerInfo.dealerCode,
        BranchCode: dealerInfo.branchCode,
        DealerPincode: dealerInfo.DealerPinCode,
        OnlineBooking: false,
        PreBooked: false,
        BookingStatus: bookingStatus,
        BookingSource: bookingSource,
        BookingConfirmedDate:
          bookingStatus === BOOKING_STATUS.CONFIRMED ? new Date() : null,
      },
    });
  }

  public async createVehicle(
    vehicleInfo: VehicleDto,
    UUID: string,
  ): Promise<void> {
    await this.prisma.vehicle.create({
      data: {
        Model: vehicleInfo.description.model,
        Variant: vehicleInfo.description.variant,
        Color: vehicleInfo.description.color,
        PartID: vehicleInfo.partId,
        ModelID: vehicleInfo.modelId,
        ExShowRoomPrice: vehicleInfo.exShowRoomPrice,
        OnRoadPrice: vehicleInfo.onRoadPrice,
        VehicleType: vehicleInfo.evBooking ? VEHICLE_TYPE.EV : VEHICLE_TYPE.ICE, // enum
        IsBTO: false,
        BookingUUID: UUID,
      },
    });
  }

  public async createPayment(
    paymentInfo: PaymentDetailsDto,
    UUID: string,
  ): Promise<void> {
    await this.prisma.payment.create({
      data: {
        OrderID: paymentInfo.orderId,
        TransactionID: paymentInfo.transactionId,
        PaymentStatus: paymentInfo.paymentStatus,
        PaymentType: paymentInfo.paymentType,
        AmountPaid: paymentInfo.amountPaid,
        OnlinePayment: false,
        BookingUUID: UUID,
      },
    });
  }
}
