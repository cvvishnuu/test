import {
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from '../entities';

@Entity()
@Index('idx_customer_mobile_number', { synchronize: false })
@Index('idx_customer_user_id', { synchronize: false })
export class Customer {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ unique: true, nullable: true })
  UserID: string;

  @Column({ length: 30 })
  Name: string;

  @Column({ length: 10 })
  MobileNumber: string;

  @Column({ length: 40 })
  Email: string;

  @CreateDateColumn()
  CreatedOn: Date;

  @UpdateDateColumn({ nullable: true })
  UpdatedOn: Date;

  @Column({ nullable: true })
  UpdatedBy: number;

  @OneToMany(() => Booking, (booking) => booking.Customer)
  Bookings: Booking[];

  constructor(customer: Partial<Customer>) {
    Object.assign(this, customer);
  }
}
