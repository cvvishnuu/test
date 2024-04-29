import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { VehicleDescriptionDto } from './index';

export class VehicleDto {
  @IsString()
  @IsNotEmpty()
  partId: string;

  @IsString()
  @IsNotEmpty()
  modelId: string;

  @ValidateNested()
  description: VehicleDescriptionDto;

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
