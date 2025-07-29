import { Module } from '@nestjs/common';
import { CropVarietyFactory } from './factories/crop-variety.factory';

@Module({
  imports: [],
  providers: [CropVarietyFactory],
  exports: [CropVarietyFactory],
})
export class CropsVarietyDomainModule {}
