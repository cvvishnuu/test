import { Module, Scope } from '@nestjs/common';
import { BookingsModule } from './bookings/bookings.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { DecimalScalar } from './scalars';
import { LoggingModule } from './logger/logging.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { CloudConductorModule } from './cloudConductor/cloud-conductor.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    BookingsModule,
    PrismaModule,
    LoggingModule,
    CloudConductorModule,
  ],
  providers: [
    DecimalScalar,
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
