import { ObjectType, Field } from '@nestjs/graphql';
import Decimal from 'decimal.js';
import { DecimalScalar } from '../../../scalars';

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
  OnRoadPrice: Decimal;

  @Field()
  PartID: string;

  @Field()
  ModelID: string;

  @Field()
  VehicleType: string;

  @Field()
  IsBTO: boolean;
}
