import { IsNotEmpty, IsString } from 'class-validator';

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
