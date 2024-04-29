import { Global, Module } from '@nestjs/common';
import { QueueDispatcherService } from './services/dispatcher/queue-dispatcher.service';
import { QueueModelTransformerService } from './services/model-transformer/queue-model-transformer.service';

@Global()
@Module({
  providers: [QueueDispatcherService, QueueModelTransformerService],
  exports: [QueueDispatcherService, QueueModelTransformerService],
})
export class BusConductorModule {}
