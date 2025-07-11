import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DomainExceptionFilter } from './filters/domain-exception.filter';
import { KafkaProviderModule } from './providers/kafka/kafka.provider.module';

@Module({
  imports: [KafkaProviderModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class SharedInfrastructureModule {}
