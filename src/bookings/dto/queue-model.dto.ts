import { IsBoolean, IsDate, IsNotEmpty,IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class QueueModelDto {
    @IsString()
    @IsNotEmpty()
    context: string;
  
    @IsString()
    @IsNotEmpty()
    data: string;
  
    @IsString()
    @IsNotEmpty()
    brand: string;
  }