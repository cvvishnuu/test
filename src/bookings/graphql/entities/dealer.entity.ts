import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class DealerLocation {
  @Field()
  City: string;

  @Field()
  State: string;

  @Field()
  Pincode: string;

  @Field()
  BookingAddress: string;

  @Field()
  dealerPinCode: string;
}

@ObjectType()
export class Dealer {
  @Field(() => Int)
  DealerCode: number;

  @Field({ nullable: true })
  DealerName: string;

  @Field(() => Int)
  BranchCode: number;

  @Field(() => DealerLocation)
  Location: DealerLocation;
}
