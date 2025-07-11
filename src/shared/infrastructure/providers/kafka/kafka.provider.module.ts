import { Module } from '@nestjs/common';
import { KafkaProvider } from './kafka.provider';

@Module({
  providers: [KafkaProvider],
  exports: [KafkaProvider],
})
export class KafkaProviderModule {}
