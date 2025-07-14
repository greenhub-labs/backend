import { Module } from '@nestjs/common';
import { FarmsDomainModule } from './domain/farms-domain.module';
import { FarmsApplicationModule } from './application/farms-application.module';
import { FarmsInfrastructureModule } from './infrastructure/farms-infrastructure.module';
import { FarmsPresentersModule } from './presenters/farms-presenters.module';

@Module({
  imports: [
    FarmsDomainModule,
    FarmsApplicationModule,
    FarmsInfrastructureModule,  
    FarmsPresentersModule,
  ],
})
export class FarmsModule {} 