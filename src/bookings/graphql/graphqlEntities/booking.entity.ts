import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Dealer } from './dealer.entity';
import { Vehicle } from './vehicle.entity';
import { PaymentDetail } from './payment-detail.entity';

@ObjectType()
export class Booking {
  @Field()
  UUID: string;

  @Field(() => Int)
  BookingNumber: number;

  @Field()
  BookingSource: string;

  @Field()
  BookingReceivedDate: Date;

  @Field()
  CurrentStage?: string;

  @Field({ nullable: true })
  OrderConfirmedDate?: Date;

  @Field({ nullable: true })
  OrderManufacturedDate?: Date;

  @Field({ nullable: true })
  OrderPackedDate?: Date;

  @Field({ nullable: true })
  OrderDispatchedDate?: Date;

  @Field()
  City: string;

  @Field()
  State: string;

  @Field()
  Pincode: string;

  @Field()
  BookingAddress: string;

  @Field(() => Dealer)
  Dealer: Dealer;

  @Field(() => Vehicle)
  Vehicle: Vehicle;

  @Field(() => [PaymentDetail])
  PaymentDetails: PaymentDetail[];
}
