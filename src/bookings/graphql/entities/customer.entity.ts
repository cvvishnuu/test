import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Customer {
  @Field(() => Int)
  ID: number;

  @Field()
  Name: string;

  @Field()
  MobileNumber: string;

  @Field()
  Email: string;
}
