import { Controller , Post, Body, Inject} from '@nestjs/common';
import { NonCpgIntegratedRequestDto } from '../dto';
import { NonCpgIntegratedService } from '../services/non-cpg-integrated.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InvalidDealerCodeException,InvalidPartOrModelIdException } from "../../shared/exceptions"


@Controller('bookings')
export class BookingsController {
 constructor(
     private readonly nonCpgBookingService: NonCpgIntegratedService,
     @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
 ) {}

    @Post("offline")
    async createBooking(@Body() bookingInfo: NonCpgIntegratedRequestDto) {
        try {
            return await this.nonCpgBookingService.saveBooking(bookingInfo);
        } catch (error) {
            if (error instanceof InvalidDealerCodeException) {
                this.logger.error(`Invalid dealer code: ${error.message}`);
            } else if (error instanceof InvalidPartOrModelIdException) {
                this.logger.error(`Invalid partId or modelId: ${error.message}`);
            } else {
                this.logger.error(`Unknown error occurred while saving booking: ${error}`);
            }
            throw error;
        }
    }
}
