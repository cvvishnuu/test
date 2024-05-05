// import { Test, TestingModule } from '@nestjs/testing';
// import { NonCpgIntegratedService } from "./non-cpg-integrated.service";
// import { PrismaService } from '../../prisma/prisma.service';
// import { NonCpgIntegratedRequestDto } from '../dto';
// import axios from 'axios';

// jest.mock('../../prisma/prisma.service', () => ({
//     PrismaService: jest.fn().mockImplementation(() => ({
//       customer: {
//         findFirst: jest.fn().mockResolvedValue({ ID: 1 }),
//         create: jest.fn()
//       }
//     }))
//   }));

// describe('BookingService', () => {
//     let bookingService: NonCpgIntegratedService;
//     let prismaService: PrismaService;

//     const samplePayload: NonCpgIntegratedRequestDto = {
//         customer: {
//             name: "Dinesh singh Hutiya",
//             phone: "9873186224",
//             email: "john@example.com"
//         },
//         location: {
//             cityName: "New York",
//             cityType: "Metropolitan",
//             stateCode: "NY",
//             stateName: "New York",
//             bookingPinCode: "10001",
//             bookingAddress: "123 Main St, New York, NY 10001"
//         },
//         homeDeliverySelected: true,
//         dealer: {
//             dealerCode: 1234,
//             branchCode: 5678,
//             DealerPinCode: "110001"
//         },
//         vehicle: {
//             partId: "123456",
//             modelId: "789012",
//             description: {
//                 model: "Jupiter",
//                 color: "Red",
//                 variant: "Base Variant"
//             },
//             evBooking: false,
//             onRoadPrice: "500000",
//             exShowRoomPrice: "450000"
//         },
//         paymentDetails: {
//             paymentStatus: "Success",
//             paymentType: "Credit Card",
//             amountPaid: 5000,
//             transactionId: "TRAN123",
//             orderId: "ORDER789"
//         },
//         onlineBooking: false,
//         bookingSource: "DMS",
//         bookingDate: new Date("2024-04-09T00:00:00.000Z")
//     };

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 NonCpgIntegratedService,
//                 PrismaService,
//             ],
//         }).compile();

//         bookingService = module.get<NonCpgIntegratedService>(NonCpgIntegratedService);
//         prismaService = module.get<PrismaService>(PrismaService);

//     });

//     it('should be defined', () => {
//         expect(bookingService).toBeDefined();
//     });

//     describe('validateDealerCode', () => {
//         it('should return true for a valid dealer code', async () => {
//             jest.spyOn(axios, 'post').mockResolvedValue({ isValid: true });
//             const result = await bookingService.validateDealerCode(12345);
//             expect(result).toBe(true);
//         });

//         it('should return false for an invalid dealer code', async () => {
//             jest.spyOn(axios, 'post').mockResolvedValue({ isValid: false });
//             const result = await bookingService.s(12345);
//             expect(result).toBe(false);
//         });

//         it('should throw an error for an axios error', async () => {
//             jest.spyOn(axios, 'post').mockRejectedValue(new Error('Axios error'));
//             await expect(bookingService.validateDealerCode(12345)).rejects.toThrow('Axios error');
//         });
//     });

//     describe('validatePartAndModel', () => {
//         it('should return true for valid part and model', async () => {
//             jest.spyOn(axios, 'post').mockResolvedValue({ isValid: true });
//             const result = await bookingService.validatePartAndModel('part123', 'model123');
//             expect(result).toBe(true);
//         });

//         it('should return false for an invalid part and model', async () => {
//             jest.spyOn(axios, 'post').mockResolvedValue({ isValid: false });
//             const result = await bookingService.validatePartAndModel('part123', 'model123');
//             expect(result).toBe(false);
//         });

//         it('should handle axios errors gracefully', async () => {
//             jest.spyOn(axios, 'post').mockRejectedValue(new Error('Axios error'));
//             await expect(bookingService.validatePartAndModel('part123', 'model123')).rejects.toThrow('Axios error');
//         });
//     });

//     describe('generateUUID', () => {
//         it('should generate a UUID of the correct length', () => {
//             const uuid = bookingService['generateUUID']();
//             expect(uuid.length).toBe(20);
//         });
//     });

//     describe('createUser', () => {
//         let findFirstMock = jest.fn();
//         let createMock = jest.fn();

//         beforeEach(() => {
//             findFirstMock = jest.fn();
//             createMock = jest.fn();
//             jest.spyOn(prismaService.customer, 'findFirst').mockImplementation(findFirstMock);
//             jest.spyOn(prismaService.customer, 'create').mockImplementation(createMock);
//         });

//         it('returns existing user ID when the user already exists', async () => {
//             const bookingInfo: NonCpgIntegratedRequestDto = samplePayload;
//             findFirstMock.mockResolvedValue({ ID: 1 });

//             await expect(bookingService.saveUser(bookingInfo)).resolves.toBe(1);
//             expect(createMock).not.toHaveBeenCalled();
//         });

//         it('creates a new user when the user does not exist', async () => {
//             const bookingInfo: NonCpgIntegratedRequestDto = samplePayload;
//             findFirstMock.mockResolvedValue(null);

//             createMock.mockResolvedValue({ ID: 2 });

//             await expect(bookingService.saveUser(bookingInfo)).resolves.toBe(2);
//             expect(createMock).toHaveBeenCalled();
//         });

//         it('throws an error when user creation fails', async () => {
//             const bookingInfo: NonCpgIntegratedRequestDto = samplePayload;
//             findFirstMock.mockResolvedValue(null);
//             const errorMessage = 'Failed to create user';
//             createMock.mockRejectedValue(new Error(errorMessage));

//             await expect(bookingService.saveUser(bookingInfo)).rejects.toThrow(errorMessage);
//         });
//     });

//     it('should throw an error if dealer code validation fails', async () => {
//         const dto: NonCpgIntegratedRequestDto = samplePayload;
//         jest.spyOn(bookingService, 'validateDealerCode').mockResolvedValueOnce(false);
//         await expect(bookingService.saveBooking(dto)).rejects.toThrow('Invalid dealer code');
//     });

//     it('should throw an error if part and model validation fails', async () => {
//         const dto: NonCpgIntegratedRequestDto = samplePayload;
//         jest.spyOn(bookingService, 'validateDealerCode').mockResolvedValueOnce(true);
//         jest.spyOn(bookingService, 'validatePartAndModel').mockResolvedValueOnce(false);
//         await expect(bookingService.saveBooking(dto)).rejects.toThrow('Invalid partId, or modelId');
//     });
// });
import { Test, TestingModule } from '@nestjs/testing';
import { OfflineBookingService } from './offline-booking.service';
import { NonCpgIntegratedRequestDto } from '../../dto';
import { BadRequestException } from '@nestjs/common';

describe('NonCpgIntegratedService', () => {
  let service: OfflineBookingService;

  const samplePayload: NonCpgIntegratedRequestDto = {
    customer: {
      name: 'Dinesh singh Hutiya',
      phone: '9873186224',
      email: 'john@example.com',
      userId: '3434',
    },
    location: {
      cityName: 'New York',
      cityType: 'Metropolitan',
      stateCode: 'NY',
      stateName: 'New York',
      bookingPinCode: '10001',
      bookingAddress: '123 Main St, New York, NY 10001',
    },
    homeDeliverySelected: true,
    dealer: {
      dealerCode: 1234,
      branchCode: 5678,
      DealerPinCode: '110001',
    },
    vehicle: {
      partId: '123456',
      modelId: '789012',
      description: {
        model: 'Jupiter',
        color: 'Red',
        variant: 'Base Variant',
      },
      evBooking: false,
      onRoadPrice: '500000',
      exShowRoomPrice: '450000',
    },
    paymentDetails: {
      paymentStatus: 'Success',
      paymentType: 'Credit Card',
      amountPaid: 5000,
      transactionId: 'TRAN123',
      orderId: 'ORDER789',
    },
    onlineBooking: false,
    bookingSource: 'DMS',
    bookingDate: new Date('2024-04-09T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfflineBookingService],
    }).compile();

    service = module.get<OfflineBookingService>(OfflineBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveBooking', () => {
    it('should create a booking successfully with valid input', async () => {
      (service as any).validateDealerCode = jest
        .fn()
        .mockResolvedValueOnce(true);
      (service as any).validatePartAndModel = jest
        .fn()
        .mockResolvedValueOnce(true);
      (service as any).saveUser = jest.fn().mockResolvedValueOnce(1);
      (service as any).createBookingEntity = jest
        .fn()
        .mockResolvedValueOnce(undefined);
      (service as any).createVehicle = jest
        .fn()
        .mockResolvedValueOnce(undefined);
      (service as any).createPayment = jest
        .fn()
        .mockResolvedValueOnce(undefined);

      const result = await service.processBooking(samplePayload);

      expect(result).toBeDefined();
    });

    it('should throw BadRequestException for invalid dealer code', async () => {
      (service as any).validateDealerCode = jest
        .fn()
        .mockResolvedValueOnce(false);

      await expect(service.processBooking(samplePayload)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid partId or modelId', async () => {
      (service as any).validateDealerCode = jest
        .fn()
        .mockResolvedValueOnce(true);
      (service as any).validatePartAndModel = jest
        .fn()
        .mockResolvedValueOnce(false);
      await expect(service.processBooking(samplePayload)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
