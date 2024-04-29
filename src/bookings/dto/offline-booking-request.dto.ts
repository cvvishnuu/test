import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CustomerDto, DealerDto, VehicleDto, LocationDto } from './index';

export class PaymentDetailsDto {
  @IsString()
  @IsNotEmpty()
  paymentStatus: string;

  @IsString()
  @IsNotEmpty()
  paymentType: string;

  @IsNumber()
  @IsNotEmpty()
  amountPaid: number;

  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;
}

export class OfflineBookingRequestDto {
  @ValidateNested()
  @IsNotEmpty()
  customer?: CustomerDto;

  @ValidateNested()
  @IsNotEmpty()
  location?: LocationDto;

  @ValidateNested()
  @IsNotEmpty()
  dealer?: DealerDto;

  @ValidateNested()
  @IsNotEmpty()
  vehicle?: VehicleDto;

  @ValidateNested()
  @IsNotEmpty()
  paymentDetails?: PaymentDetailsDto;

  @IsString()
  @IsNotEmpty()
  bookingSource?: string;

  @IsDateString()
  @IsNotEmpty()
  bookingDate?: Date;
}
