import { ObjectType, Field } from '@nestjs/graphql';
import Decimal from 'decimal.js';
import { DecimalScalar } from 'src/scalars';

@ObjectType()
export class Vehicle {
  @Field()
  Name: string;

  @Field()
  Variant: string;

  @Field()
  Color: string;

  @Field(() => DecimalScalar)
  ExShowRoomPrice: Decimal;

  @Field(() => DecimalScalar)
  onRoadPrice: Decimal;

  @Field()
  PartID: string;

  @Field()
  ModelID: string;

  @Field()
  VehicleType: string;
}
