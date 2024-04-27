import { Test, TestingModule } from '@nestjs/testing';
import { BookingRetrievalService } from './booking-retrieval.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { BookingResponse, Customer } from '../graphql/entities';
import Decimal from 'decimal.js';

describe('BookingRetrievalService', () => {
  let service: BookingRetrievalService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingRetrievalService,
        {
          provide: PrismaService,
          useValue: {
            customer: {
              findUnique: jest.fn(),
            },
            booking: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BookingRetrievalService>(BookingRetrievalService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchBookings', () => {
    describe('getCustomerInfo', () => {
      it('should throw not found when customer is not found', async () => {
        const userId = '123';

        jest
          .spyOn(prismaService.customer, 'findUnique')
          .mockResolvedValueOnce(undefined);

        await expect(service.fetchBookings({ userId })).rejects.toThrow(
          NotFoundException,
        );
        await expect(service.fetchBookings({ userId })).rejects.toThrow(
          'Customer not found',
        );
      });

      it('should return the customer object', async () => {
        const userId = 'user123';
        const mockCustomer: Customer = {
          ID: 1,
          Name: 'John Doe',
          Email: 'john@example.com',
          MobileNumber: '+1234567890',
        };

        jest
          .spyOn(prismaService.customer, 'findUnique')
          .mockImplementation(jest.fn().mockReturnValue(mockCustomer));

        const customerInfo = await service.getCustomerInfo(userId);

        expect(customerInfo).toEqual(mockCustomer);
      });
    });
  });

  describe('Successful Booking Retrieval', () => {
    it('should return the expected BookingResponse object', async () => {
      // Arrange
      const userId = 'user123';
      const mockCustomer: Customer = {
        ID: 1,
        Name: 'John Doe',
        Email: 'john@example.com',
        MobileNumber: '+1234567890',
      };

      const mockBookings = [
        // Mock booking data
        {
          UUID: 'booking123',
          BookingNumber: 'B123',
          Location:
            '{"cityName":"New York","stateName":"NY","bookingPinCode":"10001","bookingAddress":"123 Main St"}',
          BookingSource: 'Online',
          CreatedOn: new Date('2022-04-26T12:00:00Z'),
          DealerCode: 'ABC123',
          BranchCode: 789,
          DealerPincode: '2000',
          BookingStatus: 'Confirmed',
          BookingConfirmedDate: new Date('2022-04-27T12:00:00Z'),
          OrderManufacturedDate: new Date('2022-05-10T12:00:00Z'),
          OrderPackedDate: new Date('2022-05-12T12:00:00Z'),
          OrderDispatchedDate: new Date('2022-05-15T12:00:00Z'),
          Vehicle: {
            Model: 'Model X',
            Variant: 'Variant A',
            Color: 'Red',
            ExShowRoomPrice: 50000,
            OnRoadPrice: 60000,
            PartID: 'P001',
            ModelID: 'M001',
            VehicleType: 'SUV',
            IsBTO: false,
          },
          Payments: [
            {
              TransactionID: 'trans123',
              OrderID: 'order123',
              AmountPaid: 40000,
              PaymentType: 'Credit Card',
              PaymentStatus: 'Completed',
            },
          ],
        },
      ];

      const parsedBookings = [
        // Parsed booking data
        {
          UUID: 'booking123',
          BookingNumber: 123,
          Location: {
            cityName: 'New York',
            stateName: 'NY',
            bookingPinCode: '10001',
            bookingAddress: '123 Main St',
          },
          BookingSource: 'Online',
          CreatedOn: new Date('2022-04-26T12:00:00Z'),
          DealerCode: 123,
          BranchCode: 789,
          DealerPincode: '20001',
          BookingStatus: 'Confirmed',
          BookingConfirmedDate: new Date('2022-04-27T12:00:00Z'),
          OrderManufacturedDate: new Date('2022-05-10T12:00:00Z'),
          OrderPackedDate: new Date('2022-05-12T12:00:00Z'),
          OrderDispatchedDate: new Date('2022-05-15T12:00:00Z'),
          Vehicle: {
            Model: 'Model X',
            Variant: 'Variant A',
            Color: 'Red',
            ExShowRoomPrice: new Decimal(50000.05),
            OnRoadPrice: new Decimal(60000.05),
            PartID: 'P001',
            ModelID: 'M001',
            VehicleType: 'SUV',
            IsBTO: false,
          },
          Payments: [
            {
              TransactionID: 'trans123',
              OrderID: 'order123',
              AmountPaid: 40000,
              PaymentType: 'Credit Card',
              PaymentStatus: 'Completed',
            },
          ],
        },
      ];

      const mockBookingResponse: BookingResponse = {
        Customer: mockCustomer,
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
            Amount: new Decimal(payment.AmountPaid),
            PaymentType: payment.PaymentType,
            PaymentStatus: payment.PaymentStatus,
          })),
        })),
      };

      // Mock the external dependencies
      jest
        .spyOn(prismaService.customer, 'findUnique')
        .mockImplementation(jest.fn().mockReturnValue(mockCustomer));
      jest
        .spyOn(service as any, 'getCustomerBookings')
        .mockReturnValueOnce(mockBookings);
      jest
        .spyOn(service as any, 'parseBookingData')
        .mockReturnValueOnce(parsedBookings);
      jest
        .spyOn(service as any, 'constructResponse')
        .mockReturnValueOnce(mockBookingResponse);

      // Act
      const bookingResponse = await service.fetchBookings({ userId });

      // Assert
      expect(bookingResponse).toEqual(mockBookingResponse);

      // Verify interactions with external dependencies
      expect((service as any).getCustomerBookings).toHaveBeenCalledWith(
        mockCustomer.ID,
      );

      // Verify that parseBookingData and constructResponse are called with correct arguments
      expect((service as any).parseBookingData).toHaveBeenCalledWith(
        mockBookings,
      );
      expect((service as any).constructResponse).toHaveBeenCalledWith(
        mockCustomer,
        parsedBookings,
      );
    });
  });
});
