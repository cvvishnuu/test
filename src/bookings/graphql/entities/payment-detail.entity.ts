import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class PaymentDetail {
  @Field()
  TransactionID: string;

  @Field()
  OrderID: string;

  @Field(() => Float)
  Amount: number;

  @Field()
  PaymentType: string;

  @Field()
  PaymentStatus: string;
}
