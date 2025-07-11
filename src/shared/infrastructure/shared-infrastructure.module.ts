import { Module } from '@nestjs/common';
import { KafkaProviderModule } from './providers/kafka/kafka.provider.module';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [KafkaProviderModule, PrismaModule, RedisModule],
  exports: [KafkaProviderModule, PrismaModule, RedisModule],
})
export class SharedInfrastructureModule {}
