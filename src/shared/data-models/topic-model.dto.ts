import { IsBoolean, IsDate, IsNotEmpty,IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class TopicModelDto {
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