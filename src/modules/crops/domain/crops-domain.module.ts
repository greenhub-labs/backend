import { Module } from '@nestjs/common';
import { CropFactory } from './factories/crop.factory';

@Module({
  imports: [],
  providers: [CropFactory],
  exports: [CropFactory],
})
export class CropsDomainModule {}
