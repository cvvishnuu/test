import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class LocationDto {
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
