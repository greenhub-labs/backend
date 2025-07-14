import { Module } from '@nestjs/common';
import { FarmFactory } from './factories/farm.factory';

@Module({
  imports: [],
  providers: [FarmFactory],
  exports: [FarmFactory],
})
export class FarmsDomainModule {}
