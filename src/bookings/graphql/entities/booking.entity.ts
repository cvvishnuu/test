import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Dealer } from './dealer.entity';
import { Vehicle } from './vehicle.entity';
import { PaymentDetail } from './payment-detail.entity';
import { BTODetails } from './bto-details.entity';

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

  @Field(() => Dealer)
  Dealer: Dealer;

  @Field(() => Vehicle)
  Vehicle: Vehicle;

  @Field(() => [PaymentDetail])
  PaymentDetails: PaymentDetail[];

  @Field(() => BTODetails)
  BTODetails: BTODetails;
}
