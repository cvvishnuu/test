import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BookingJournal } from '../entities';

@Entity()
export class BookingJournalKey {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ length: 20 })
  Action: string;

  @Column()
  IsValid: boolean;

  @CreateDateColumn()
  CreatedOn: Date;

  @UpdateDateColumn({ nullable: true })
  UpdatedOn: Date;

  @OneToMany(() => BookingJournal, (bookingJournal) => bookingJournal.Action)
  BookingJournals: BookingJournal[];

  constructor(bookingJournalKey: Partial<BookingJournalKey>) {
    Object.assign(this, bookingJournalKey);
  }
}
