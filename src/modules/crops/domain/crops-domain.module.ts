import { Module } from '@nestjs/common';
import { CropVarietyFactory } from './factories/crop-variety.factory';
import { CropFactory } from './factories/crop.factory';

@Module({
  imports: [],
  providers: [CropFactory, CropVarietyFactory],
  exports: [CropFactory, CropVarietyFactory],
})
export class CropsDomainModule {}
