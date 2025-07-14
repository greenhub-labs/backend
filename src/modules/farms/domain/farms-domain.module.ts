import { Module } from '@nestjs/common';
import { FarmsFactory } from './factories/farms.factory';

@Module({
  imports: [],
  providers: [FarmsFactory],
  exports: [FarmsFactory],
})
export class FarmsDomainModule {} 