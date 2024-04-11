import { IsBoolean, IsDate, IsDecimal, IsEmail, IsNotEmpty,IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from 'class-validator';


export class BookingConfirmationDto {
    @IsString()
    variant: string | null;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;
  
    @IsNotEmpty()
    @IsString()
    bookingId: string;
  
    @IsNotEmpty()
    @IsDecimal()
    amount: number;
  
    @IsNotEmpty()
    isBooked: boolean;
  
    @IsNotEmpty()
    @IsString()
    color1: string;
  
    @IsNotEmpty()
    @IsString()
    color2: string;
  
    @IsNotEmpty()
    @IsString()
    dealershipName: string;
  
    @IsNotEmpty()
    @IsString()
    dealerPhone1: string;
  
    @IsNotEmpty()
    @IsString()
    dealerPhone2: string;
  
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsString()
    vehicleModel: string;
  
    @IsNotEmpty()
    @IsDecimal()
    mrpOrderReceipt: number;
  
    @IsNotEmpty()
    @IsString()
    package: string;
  
    @IsNotEmpty()
    @IsDecimal()
    mrpChargingSolution: number;
  
    @IsNotEmpty()
    @IsString()
    dealershipAddress: string;
  
    @IsNotEmpty()
    @IsString()
    city: string;
  
    @IsString()
    residence: string | null;
  
    @IsString()
    customerAddress: string | null;
  
    @IsNotEmpty()
    @IsString()
    pincode: string;
  
    @IsNotEmpty()
    @IsDate()
    bookingDate?: string | null;
  
    @IsNotEmpty()
    @IsString()
    transactionId: string;
  
    @IsNotEmpty()
    @IsNumberString()
    amountReceived: string;
  
    @IsString()
    estimatedDelivery: string | null;
  
    @IsNotEmpty()
    @IsString()
    vehicleDelivery: string;
  
    @IsNotEmpty()
    @IsString()
    uuid: string;
  }