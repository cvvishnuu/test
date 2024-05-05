import {
  Entity,
  Index,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Customer, BookingJournal, Vehicle, Payment } from '../entities';

@Entity()
@Index('idx_booking_customer_id', { synchronize: false })
@Index('idx_booking_dealer_code', { synchronize: false })
export class Booking {
  @PrimaryColumn({ length: 20 })
  UUID: string;

  @Column({ unique: true, length: 20 })
  CustomerID: string;

  @ManyToOne(() => Customer, (customer) => customer.Bookings)
  @JoinColumn({ name: 'CustomerID', referencedColumnName: 'ID' })
  Customer: Customer;

  @Column()
  Location: string;

  @Column()
  HomeDeliverySelected: boolean;

  @Column()
  DealerCode: number;

  @Column()
  BranchCode: number;

  @Column({ length: 15 })
  DealerPincode: string;

  @Column()
  OnlineBooking: boolean;

  @Column({ length: 20 })
  BookingSource: string;

  @Column()
  PreBooked: boolean;

  @Column({ nullable: true })
  MerchandiseAndAccessories: string;

  @Column({ length: 20 })
  BookingStatus: string;

  @Column({ length: 20, nullable: true })
  FrameNumber: string;

  @Column({ length: 20, nullable: true })
  OrderNumber: string;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column({ nullable: true })
  BookingConfirmedDate: Date;

  @Column({ nullable: true })
  OrderManufacturedDate: Date;

  @Column({ nullable: true })
  OrderPackedDate: Date;

  @Column({ nullable: true })
  OrderDispatchedDate: Date;

  @Column({ nullable: true })
  BookingNumber: number;

  @OneToMany(() => Payment, (payment) => payment.Booking)
  Payments: Payment[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.Booking)
  Vehicles: Vehicle[];

  @OneToMany(() => BookingJournal, (bookingJournal) => bookingJournal.Booking)
  BookingJournals: BookingJournal[];

  constructor(booking?: Partial<Booking>) {
    if (booking) {
      Object.assign(this, booking);
    }
  }
}
