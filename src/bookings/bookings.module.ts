import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { BookingsController } from './controllers/bookings.controller';
import { BookingRetrievalResolver } from './graphql/booking-retrieval.resolver';
import { BookingRetrievalService } from './services/booking-retrieval.service';
import { NonCpgIntegratedService } from './services/non-cpg-integrated.service';
import { QueueDispatcherService } from '../shared/dispatcher/queue-dispatcher.service';
import * as winston from 'winston';

@Module({
  controllers: [BookingsController],
  providers: [
    BookingRetrievalResolver, 
    BookingRetrievalService,
    NonCpgIntegratedService,
    QueueDispatcherService,
    {
      provide: 'winston',
      useFactory: () => {
        return winston.createLogger({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
          transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log' })
          ]
        });
      }
    }
  ],
})
export class BookingsModule {}
