import {
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
@Index('idx_vehicle_booking_id', { synchronize: false })
export class Vehicle {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ length: 30 })
  Model: string;

  @Column({ length: 30 })
  Variant: string;

  @Column({ length: 20 })
  Color: string;

  @Column({ length: 20 })
  PartID: string;

  @Column({ length: 20 })
  ModelID: string;

  @Column('decimal', { precision: 10, scale: 2 })
  ExShowRoomPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  OnRoadPrice: number;

  @Column({ length: 10 })
  VehicleType: string;

  @Column({ length: 20, nullable: true })
  BTOKit: string;

  @Column()
  IsBTO: boolean;

  @Column({ length: 5, nullable: true })
  FavouriteNumber: string;

  @Column({ unique: true, length: 20 })
  BookingUUID: string;

  @ManyToOne(() => Booking, (booking) => booking.Vehicles)
  @JoinColumn({ name: 'UUID', referencedColumnName: 'BookingUUID' })
  Booking: Booking;

  @CreateDateColumn()
  CreatedOn: Date;

  @UpdateDateColumn({ nullable: true })
  UpdatedOn: Date;

  constructor(vehicle: Partial<Vehicle>) {
    Object.assign(this, vehicle);
  }
}
