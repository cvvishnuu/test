import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Vehicle {
  @Field()
  Name: string;

  @Field()
  Variant: string;

  @Field()
  Color: string;

  @Field()
  ExShowRoomPrice: number;

  @Field()
  onRoadPrice: number;

  @Field()
  PartID: string;

  @Field()
  ModelID: string;

  @Field()
  VehicleType: string;
}
