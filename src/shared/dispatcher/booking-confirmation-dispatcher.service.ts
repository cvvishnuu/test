import { Injectable } from '@nestjs/common';
import { ServiceBusClient } from '@azure/service-bus';
import { TopicModelDto } from '../data-models';

@Injectable()
export class BookingConfirmationDispatcherService {
  private serviceBusClient: ServiceBusClient;
  private connectionString: string;

  constructor() {
    this.connectionString=process.env.SERVICE_BUS_ENDPOINT;
    this.serviceBusClient = new ServiceBusClient(this.connectionString);
  }

  async dispatchConfirmation(dto: TopicModelDto): Promise<void> {
    const topicName = 'your_topic_name';

    try {
      const sender = this.serviceBusClient.createSender(topicName);

      await sender.sendMessages({
        body: JSON.stringify(dto),
      });
    } catch (error) {
      throw new Error('Failed to dispatch booking confirmation');
    } finally {
      await this.serviceBusClient.close();
    }
  }
}
