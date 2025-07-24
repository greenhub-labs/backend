import { Module } from '@nestjs/common';
import { CropsVarietyApplicationModule } from './application/crops-application.module';
import { CropsVarietyDomainModule } from './domain/crops-domain.module';
import { CropsVarietyInfrastructureModule } from './infrastructure/crops-infrastructure.module';
import { CropsVarietyPresentersModule } from './presenters/crops-presenters.module';

@Module({
  imports: [
    CropsVarietyDomainModule,
    CropsVarietyApplicationModule,
    CropsVarietyInfrastructureModule,
    CropsVarietyPresentersModule,
  ],
})
export class CropsVarietyModule {}
