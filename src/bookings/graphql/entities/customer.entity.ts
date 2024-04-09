import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Customer {
  @Field()
  Name: string;

  @Field()
  MobileNumber: string;

  @Field()
  Email: string;
}
