import {
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
@Index('idx_payment_booking_id', { synchronize: false })
export class Payment {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ length: 30 })
  OrderID: string;

  @Column({ length: 30 })
  TransactionID: string;

  @Column({ length: 20 })
  PaymentStatus: string;

  @Column({ length: 20 })
  PaymentType: string;

  @Column('decimal', { precision: 10, scale: 2 })
  AmountPaid: number;

  @Column()
  OnlinePayment: boolean;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column({ length: 20 })
  BookingUUID: string;

  @ManyToOne(() => Booking, (booking) => booking.Payments)
  @JoinColumn({ name: 'BookingUUID', referencedColumnName: 'UUID' })
  Booking: Booking;

  constructor(payment: Partial<Payment>) {
    Object.assign(this, payment);
  }
}
