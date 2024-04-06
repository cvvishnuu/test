import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class BTODetails {
  @Field({ nullable: true })
  OrderConfirmedDate: Date;

  @Field({ nullable: true })
  OrderManufacturedDate: Date;

  @Field({ nullable: true })
  OrderPackedDate: Date;

  @Field({ nullable: true })
  OrderDispatchedDate: Date;

  @Field({ nullable: true })
  CurrentStage: Date;
}
