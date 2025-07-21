import { Module } from '@nestjs/common';
import { CropsApplicationModule } from './application/crops-application.module';
import { CropsDomainModule } from './domain/crops-domain.module';
import { CropsInfrastructureModule } from './infrastructure/crops-infrastructure.module';
import { CropsPresentersModule } from './presenters/crops-presenters.module';

@Module({
  imports: [
    CropsDomainModule,
    CropsApplicationModule,
    CropsInfrastructureModule,
    CropsPresentersModule,
  ],
})
export class CropsModule {}
