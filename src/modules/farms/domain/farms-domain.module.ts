import { Module } from '@nestjs/common';
import { FarmsFactory } from './factories/farm.factory';

@Module({
  imports: [],
  providers: [FarmsFactory],
  exports: [FarmsFactory],
})
export class FarmsDomainModule {}
