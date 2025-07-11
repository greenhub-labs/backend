import { Module } from '@nestjs/common';
import { RedisProvider } from './provider/redis.provider';
import { Global } from '@nestjs/common';

@Global()
@Module({
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}
