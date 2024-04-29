import {
  IsDecimal,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class BookingConfirmationEmailDto {
  @IsString()
  variant: string | null;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsDecimal()
  amount: number;

  @IsNotEmpty()
  isBooked: boolean;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  vehicleModel: string;

  @IsNotEmpty()
  @IsString()
  bookingDate?: string | null;

  @IsNotEmpty()
  @IsNumberString()
  amountReceived: string;

  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsDecimal()
  totalVehicleValue?: number;
}
