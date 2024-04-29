import { IsOptional, IsString } from 'class-validator';

export class VehicleDescriptionDto {
  @IsString()
  model: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  variant: string;
}
