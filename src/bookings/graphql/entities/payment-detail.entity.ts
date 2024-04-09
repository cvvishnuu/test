import { ObjectType, Field } from '@nestjs/graphql';
import Decimal from 'decimal.js';
import { DecimalScalar } from 'src/scalars';

@ObjectType()
export class PaymentDetail {
  @Field()
  TransactionID: string;

  @Field()
  OrderID: string;

  @Field(() => DecimalScalar)
  Amount: Decimal;

  @Field()
  PaymentType: string;

  @Field()
  PaymentStatus: string;
}
