import { IsBoolean, IsDate, IsDateString, IsNotEmpty,IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class Customer {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}



export class Location {
  @IsNumber()
  @IsOptional()
  cityId?: number;

  @IsString()
  @IsNotEmpty()
  cityName: string;

  @IsString()
  @IsOptional()
  cityType: string;

  @IsString()
  @IsOptional()
  stateCode: string;

  @IsString()
  stateName: string;

  @IsString()
  @IsNotEmpty()
  bookingPinCode: string;

  @IsString()
  @IsNotEmpty()
  bookingAddress: string;
}

export class Dealer {
  @IsNumber()
  @IsNotEmpty()
  dealerCode: number;

  @IsNumber()
  @IsNotEmpty()
  branchCode: number;

  @IsString()
  @IsNotEmpty()
  DealerPinCode: string;
}
export class Description {
  @IsString()
  model: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  variant: string;
}
export class Vehicle {
  @IsString()
  @IsNotEmpty()
  partId: string;

  @IsString()
  @IsNotEmpty()
  modelId: string;

  @ValidateNested()
  description: Description;

  @IsBoolean()
  @IsNotEmpty()
  evBooking: boolean;

  @IsString()
  @IsNotEmpty()
  onRoadPrice: string;

  @IsString()
  @IsNotEmpty()
  exShowRoomPrice: string;

}



export class PaymentDetails {
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
  customer?: Customer;

  @ValidateNested()
  @IsNotEmpty()
  location?: Location;

  @IsBoolean()
  @IsOptional()
  homeDeliverySelected?: boolean=false;

  @ValidateNested()
  @IsNotEmpty()
  dealer?: Dealer;

  @ValidateNested()
  @IsNotEmpty()
  vehicle?: Vehicle;

  @ValidateNested()
  @IsNotEmpty()
  paymentDetails?: PaymentDetails;

  @IsBoolean()
  @IsOptional()
  onlineBooking?: boolean=false;

  @IsString()
  @IsNotEmpty()
  bookingSource?: string;

  @IsDateString()
  @IsNotEmpty()
  bookingDate?: Date;
}
