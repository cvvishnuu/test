import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from "./offline-booking.service";
import { PrismaService } from '../../prisma/prisma.service';
import { OfflineBookingRequestDto } from '../dto';
import axios from 'axios';

jest.mock('../../prisma/prisma.service');



describe('BookingService', () => {
    let bookingService: BookingService;
    let prismaService: PrismaService;

    const samplePayload: OfflineBookingRequestDto = {
        customer: {
            name: "Dinesh singh Hutiya",
            phone: "9873186224",
            email: "john@example.com"
        },
        location: {
            cityName: "New York",
            cityType: "Metropolitan",
            stateCode: "NY",
            stateName: "New York",
            bookingPinCode: "10001",
            bookingAddress: "123 Main St, New York, NY 10001"
        },
        homeDeliverySelected: true,
        dealer: {
            dealerCode: 1234,
            branchCode: 5678,
            DealerPinCode: "110001"
        },
        vehicle: {
            partId: "123456",
            modelId: "789012",
            description: {
                model: "Jupiter",
                color: "Red",
                variant: "Base Variant"
            },
            evBooking: false,
            onRoadPrice: "500000",
            exShowRoomPrice: "450000"
        },
        paymentDetails: {
            paymentStatus: "Success",
            paymentType: "Credit Card",
            amountPaid: 5000,
            transactionId: "TRAN123",
            orderId: "ORDER789"
        },
        onlineBooking: false,
        bookingSource: "DMS",
        bookingDate: new Date("2024-04-09T00:00:00.000Z")
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingService,
                PrismaService,
            ],
        }).compile();

        bookingService = module.get<BookingService>(BookingService);
        prismaService = module.get<PrismaService>(PrismaService);
    });


    it('should be defined', () => {
        expect(bookingService).toBeDefined();
    });

    describe('validateDealerCode', () => {
        it('should return true for a valid dealer code', async () => {
            jest.spyOn(axios, 'post').mockResolvedValue({ isValid: true });
            const result = await bookingService.validateDealerCode(12345);
            expect(result).toBe(true);
        });

        it('should return false for an invalid dealer code', async () => {
            jest.spyOn(axios, 'post').mockResolvedValue({ isValid: false });
            const result = await bookingService.validateDealerCode(12345);
            expect(result).toBe(false);
        });

        it('should throw an error for an axios error', async () => {
            jest.spyOn(axios, 'post').mockRejectedValue(new Error('Axios error'));
            await expect(bookingService.validateDealerCode(12345)).rejects.toThrow('Axios error');
        });
    });

    describe('validatePartAndModel', () => {
        it('should return true for valid part and model', async () => {
            jest.spyOn(axios, 'post').mockResolvedValue({ isValid: true });
            const result = await bookingService.validatePartAndModel('part123', 'model123');
            expect(result).toBe(true);
        });

        it('should return false for an invalid part and model', async () => {
            jest.spyOn(axios, 'post').mockResolvedValue({ isValid: false });
            const result = await bookingService.validatePartAndModel('part123', 'model123');
            expect(result).toBe(false);
        });

        it('should handle axios errors gracefully', async () => {
            jest.spyOn(axios, 'post').mockRejectedValue(new Error('Axios error'));
            await expect(bookingService.validatePartAndModel('part123', 'model123')).rejects.toThrow('Axios error');
        });
    });

    describe('generateUUID', () => {
        it('should generate a UUID of the correct length', () => {
            const uuid = bookingService['generateUUID']();
            expect(uuid.length).toBe(20);
        });
    });

    describe('createUser', () => {
        let findFirstMock: jest.Mock;
        let createMock: jest.Mock;
      
        beforeEach(() => {
          findFirstMock = jest.fn();
          createMock = jest.fn();
          prismaService.customer.findFirst = findFirstMock;
          prismaService.customer.create = createMock;
        });
      
        it('should return existing user ID when user already exists', async () => {
          const bookingInfo: OfflineBookingRequestDto = {
            customer: samplePayload.customer
          };
          findFirstMock.mockResolvedValue({ ID: 1 }); 
      
          await expect(bookingService.createUser(bookingInfo)).resolves.toBe(1);
          expect(createMock).not.toHaveBeenCalled(); 
        });
      
        it('should create a new user when user does not exist', async () => {
          const bookingInfo: OfflineBookingRequestDto = {
            customer: samplePayload.customer
          };
          findFirstMock.mockResolvedValue(null); 
      
          await expect(bookingService.createUser(bookingInfo)).resolves.toBe(2); 
          expect(createMock).toHaveBeenCalled(); 
        });
      
        it('should throw an error when user creation fails', async () => {
          const bookingInfo: OfflineBookingRequestDto = {
            customer: samplePayload.customer,
          };
          findFirstMock.mockResolvedValue(null);
          createMock.mockRejectedValue(new Error('Failed to create user'));
      
          await expect(bookingService.createUser(bookingInfo)).rejects.toThrow('Failed to create user');
        });
      });
      

    it('should throw an error if dealer code validation fails', async () => {
        const dto: OfflineBookingRequestDto = samplePayload;
        jest.spyOn(bookingService, 'validateDealerCode').mockResolvedValueOnce(false);
        await expect(bookingService.createBooking(dto)).rejects.toThrow('Invalid dealer code, partId, or modelId');
    });

    it('should throw an error if part and model validation fails', async () => {
        const dto: OfflineBookingRequestDto = samplePayload;
        jest.spyOn(bookingService, 'validateDealerCode').mockResolvedValueOnce(true);
        jest.spyOn(bookingService, 'validatePartAndModel').mockResolvedValueOnce(false);
        await expect(bookingService.createBooking(dto)).rejects.toThrow('Invalid dealer code, partId, or modelId');
    });
});



