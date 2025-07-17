import { Module } from '@nestjs/common';
import { PlotsDomainModule } from './domain/plots-domain.module';
import { PlotsApplicationModule } from './application/plots-application.module';
import { PlotsInfrastructureModule } from './infrastructure/plots-infrastructure.module';
import { PlotsPresentersModule } from './presenters/plots-presenters.module';

@Module({
  imports: [
    PlotsDomainModule,
    PlotsApplicationModule,
    PlotsInfrastructureModule,
    PlotsPresentersModule,
  ],
})
export class PlotsModule {}
