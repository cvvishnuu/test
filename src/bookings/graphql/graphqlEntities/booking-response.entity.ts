import { Field, ObjectType } from '@nestjs/graphql';
import { Customer } from './customer.entity';
import { Booking } from './booking.entity';

@ObjectType()
export class BookingResponse {
  @Field(() => Customer)
  Customer: Customer;

  @Field(() => [Booking])
  Bookings: Booking[];
}
