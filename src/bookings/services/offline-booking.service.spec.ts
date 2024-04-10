import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from "./offline-booking.service";
import { PrismaService } from '../../prisma/prisma.service';
import { OfflineBookingRequestDto } from '../dto';

jest.mock('../prisma/prisma.service');

describe('BookingService', () => {
    let bookingService: BookingService;
    let prismaService: PrismaService;

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
});



