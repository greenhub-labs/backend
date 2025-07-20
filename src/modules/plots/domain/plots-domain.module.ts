import { Module } from '@nestjs/common';
import { PlotFactory } from './factories/plot.factory';

@Module({
  imports: [],
  providers: [PlotFactory],
  exports: [PlotFactory],
})
export class PlotsDomainModule {}
