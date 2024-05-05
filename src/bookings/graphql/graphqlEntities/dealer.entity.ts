import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Dealer {
  @Field(() => Int)
  DealerCode: number;

  @Field({ nullable: true })
  DealerName: string;

  @Field(() => Int)
  BranchCode: number;

  @Field({ nullable: true })
  DealerPinCode: string;
}
