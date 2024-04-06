import { ObjectType, Field } from '@nestjs/graphql';

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
  @Field()
  DealerCode: string;

  @Field()
  DealerName: string;

  @Field()
  BranchCode: string;

  @Field(() => DealerLocation)
  Location: DealerLocation;
}
