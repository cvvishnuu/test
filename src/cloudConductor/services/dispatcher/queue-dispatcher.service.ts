import { Injectable } from '@nestjs/common';
import { ServiceBusClient } from '@azure/service-bus';
import { QueueModelDto } from '../../../bookings/dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueDispatcherService {
  private connectionString: string = this.configService.getOrThrow<string>(
    'SERVICE_BUS_ENDPOINT',
  );
  private serviceBusClient: ServiceBusClient = new ServiceBusClient(
    this.connectionString,
  );

  constructor(private readonly configService: ConfigService) {}

  async dispatchConfirmation(dto: QueueModelDto): Promise<void> {
    const queueName = 'email_preprod';
    console.log(dto);
    try {
      const sender = this.serviceBusClient.createSender(queueName);

      await sender.sendMessages({
        body: JSON.stringify(dto),
      });
    } catch (error) {
      throw new Error('Failed to dispatch the message');
    } finally {
      console.log('dispatch done');
      await this.serviceBusClient.close();
    }
  }
}
