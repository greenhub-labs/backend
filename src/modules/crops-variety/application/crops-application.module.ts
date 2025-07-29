import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CropsVarietyDomainModule } from '../domain/crops-domain.module';
import { CropsVarietyInfrastructureModule } from '../infrastructure/crops-infrastructure.module';
import { CreateCropVarietyCommandHandler } from './commands/create-crop-variety/create-crop-variety.command-handler';
import { DeleteCropVarietyCommandHandler } from './commands/delete-crop-variety/delete-crop-variety.command-handler';
import { UpdateCropVarietyCommandHandler } from './commands/update-crop-variety/update-crop-variety.command-handler';
import { GetAllCropsVarietiesQueryHandler } from './queries/get-all-crops-varieties/get-all-crops-varieties.query-handler';
import { GetCropVarietyByIdQueryHandler } from './queries/get-crop-variety-by-id/get-crop-variety-by-id.query-handler';
import { GetCropVarietyByScientificNameQueryHandler } from './queries/get-crop-variety-by-scientific-name/get-crop-variety-by-scientific-name.query-handler';
import { NestjsEventBusService } from './services/nestjs-event-bus.service';

/**
 * CropsApplicationModule
 * Application layer for Crops (DDD Clean Architecture)
 * Add more handlers and services as needed
 */
@Module({
  imports: [
    CqrsModule,
    CropsVarietyDomainModule,
    CropsVarietyInfrastructureModule,
  ],
  providers: [
    CreateCropVarietyCommandHandler,
    UpdateCropVarietyCommandHandler,
    DeleteCropVarietyCommandHandler,
    GetCropVarietyByIdQueryHandler,
    GetAllCropsVarietiesQueryHandler,
    GetCropVarietyByScientificNameQueryHandler,
    NestjsEventBusService,
  ],
  exports: [
    CreateCropVarietyCommandHandler,
    UpdateCropVarietyCommandHandler,
    DeleteCropVarietyCommandHandler,
    GetCropVarietyByIdQueryHandler,
    GetAllCropsVarietiesQueryHandler,
    GetCropVarietyByScientificNameQueryHandler,
    NestjsEventBusService,
  ],
})
export class CropsVarietyApplicationModule {}
