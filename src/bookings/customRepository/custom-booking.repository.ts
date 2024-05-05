import { Injectable } from '@nestjs/common';
import {
  CustomerDto,
  DealerDto,
  LocationDto,
  PaymentDetailsDto,
  VehicleDto,
} from '../dto';
import { BOOKING_STATUS, VEHICLE_TYPE } from '../../shared/constants/constants';
import { Booking, Customer, Payment, Vehicle } from '../../entities';
import { EntityManager } from 'typeorm';

@Injectable()
export class CustomBookingRepository {
  constructor(private readonly entityManager: EntityManager) {}

  private async saveRecord(entity: Customer | Booking | Vehicle | Payment) {
    await this.entityManager.transaction(async (entityManager) => {
      await entityManager.save(entity);
    });
  }

  public async findCustomerByUserId(userId: string): Promise<Customer | null> {
    return await this.entityManager.transaction(async (entityManager) => {
      const existingCustomer = await entityManager.findOneBy(Customer, {
        UserID: userId,
      });
      return existingCustomer ? existingCustomer : null;
    });
  }

  public async saveCustomer(customerInfo: CustomerDto): Promise<Customer> {
    const customer = await this.findCustomerByUserId(customerInfo.userId);

    if (customer) {
      return customer;
    }

    const newCustomer = new Customer({
      UserID: customerInfo.userId,
      Email: customerInfo.email,
      MobileNumber: customerInfo.phone,
      Name: customerInfo.name,
    });

    await this.saveRecord(newCustomer);

    return newCustomer;
  }

  public async saveBooking(
    dealerInfo: DealerDto,
    locationInfo: LocationDto,
    bookingSource: string,
    UUID: string,
    customer: Customer,
    bookingStatus: BOOKING_STATUS,
  ): Promise<Booking> {
    const booking = new Booking({
      UUID: UUID,
      Customer: customer,
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
    });

    await this.saveRecord(booking);

    return booking;
  }

  public async saveVehicle(
    vehicleInfo: VehicleDto,
    booking: Booking,
  ): Promise<void> {
    const vehicle = new Vehicle({
      Model: vehicleInfo.description.model,
      Variant: vehicleInfo.description.variant,
      Color: vehicleInfo.description.color,
      PartID: vehicleInfo.partId,
      ModelID: vehicleInfo.modelId,
      ExShowRoomPrice: parseInt(vehicleInfo.exShowRoomPrice),
      OnRoadPrice: parseInt(vehicleInfo.onRoadPrice),
      VehicleType: vehicleInfo.evBooking ? VEHICLE_TYPE.EV : VEHICLE_TYPE.ICE, // enum
      IsBTO: false,
      Booking: booking,
    });

    await this.saveRecord(vehicle);
  }

  public async savePayment(
    paymentInfo: PaymentDetailsDto,
    booking: Booking,
  ): Promise<void> {
    const payment = new Payment({
      OrderID: paymentInfo.orderId,
      TransactionID: paymentInfo.transactionId,
      PaymentStatus: paymentInfo.paymentStatus,
      PaymentType: paymentInfo.paymentType,
      AmountPaid: paymentInfo.amountPaid,
      OnlinePayment: false,
      Booking: booking,
    });

    await this.saveRecord(payment);
  }

  public async fetchBookingsByCustomerID(
    customerID: number,
  ): Promise<Booking[]> {
    return this.entityManager.transaction((entityManager) => {
      return entityManager
        .createQueryBuilder(Booking, 'bookings')
        .innerJoinAndSelect('bookings.vehicles', 'vehicles')
        .innerJoinAndSelect('bookings.payments', 'payments')
        .innerJoinAndSelect('bookings.customer', 'customer')
        .where('customer.id = :customerID', { customerID })
        .select([
          'bookings.UUID',
          'bookings.BookingNumber',
          'bookings.BookingSource',
          'bookings.CreatedOn',
          'bookings.DealerCode',
          'bookings.BranchCode',
          'bookings.DealerPincode',
          'bookings.Location',
          'bookings.BookingStatus',
          'bookings.BookingConfirmedDate',
          'bookings.OrderManufacturedDate',
          'bookings.OrderPackedDate',
          'bookings.OrderDispatchedDate',
          'vehicles.Model',
          'vehicles.Variant',
          'vehicles.Color',
          'vehicles.ExShowRoomPrice',
          'vehicles.OnRoadPrice',
          'vehicles.PartID',
          'vehicles.ModelID',
          'vehicles.VehicleType',
          'vehicles.IsBTO',
          'payments.TransactionID',
          'payments.OrderID',
          'payments.AmountPaid',
          'payments.PaymentType',
          'payments.PaymentStatus',
        ])
        .getMany();
    });
  }
}
