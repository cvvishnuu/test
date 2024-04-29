import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DealerDto {
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
