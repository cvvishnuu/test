import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class BookingRetrievalDto {
  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  customerPhoneNumber?: string;
}
