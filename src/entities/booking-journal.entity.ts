import {
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BookingJournalKey, Booking } from '../entities';

@Entity()
@Index('idx_booking_journal_booking_id', { synchronize: false })
export class BookingJournal {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ length: 20 })
  Source: string;

  @Column({ length: 100 })
  Request: string;

  @Column({ length: 100 })
  Response: string;

  @Column()
  Status: number;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column({ nullable: true, length: 20 })
  BookingUUID: string;

  @ManyToOne(() => Booking, (booking) => booking.BookingJournals)
  @JoinColumn({ name: 'BookingUUID', referencedColumnName: 'UUID' })
  Booking: Booking;

  @Column({ length: 32 })
  Version: string;

  @ManyToOne(() => BookingJournalKey, (key) => key.BookingJournals)
  @JoinColumn({ name: 'ActionID', referencedColumnName: 'ID' })
  Action: BookingJournalKey;

  constructor(bookingJournal: Partial<BookingJournal>) {
    Object.assign(this, bookingJournal);
  }
}
