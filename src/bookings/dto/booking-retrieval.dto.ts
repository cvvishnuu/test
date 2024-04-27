import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class BookingRetrievalDto {
  @IsString()
  @Field({ nullable: true })
  userId?: string;
}
