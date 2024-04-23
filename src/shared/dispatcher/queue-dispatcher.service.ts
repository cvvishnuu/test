import { Injectable } from '@nestjs/common';
import { ServiceBusClient } from '@azure/service-bus';
import { QueueModelDto } from '../../bookings/dto';

@Injectable()
export class QueueDispatcherService {
  private serviceBusClient: ServiceBusClient;
  private connectionString: string;

  constructor() {
    this.connectionString=process.env.SERVICE_BUS_ENDPOINT;
    this.serviceBusClient = new ServiceBusClient(this.connectionString);
  }

  async dispatchConfirmation(dto: QueueModelDto): Promise<void> {
    const queueName = 'email_preprod';
    console.log(dto)
    try {
      const sender = this.serviceBusClient.createSender(queueName);

      await sender.sendMessages({
        body: JSON.stringify(dto),
      });
    } catch (error) {
      throw new Error('Failed to dispatch the message');
    } finally {
      console.log("dispatch done")
      await this.serviceBusClient.close();
    }
  }
}
