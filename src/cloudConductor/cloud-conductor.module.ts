import { Global, Module } from '@nestjs/common';
import { QueueDispatcherService } from './services/dispatcher/queue-dispatcher.service';
import { QueueModelTransformerService } from './services/model-transformer/queue-model-transformer.service';
import { SecretService } from './services/keyvault/secret.service';

@Global()
@Module({
  providers: [
    QueueDispatcherService,
    QueueModelTransformerService,
    SecretService,
  ],
  exports: [
    QueueDispatcherService,
    QueueModelTransformerService,
    SecretService,
  ],
})
export class CloudConductorModule {}
