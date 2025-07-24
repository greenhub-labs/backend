import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CropsDomainModule } from '../domain/crops-domain.module';
import { CropsInfrastructureModule } from '../infrastructure/crops-infrastructure.module';
import { AssignCropVarietyCommandHandler } from './commands/assign-crop-variety/assign-crop-variety.command-handler';
import { CreateCropCommandHandler } from './commands/create-crop/create-crop.command-handler';
import { DeleteCropCommandHandler } from './commands/delete-crop/delete-crop.command-handler';
import { UnassignCropVarietyCommandHandler } from './commands/unassign-crop-variety/unassign-crop-variety.command-handler';
import { UpdateCropCommandHandler } from './commands/update-crop/update-crop.command-handler';
import { GetAllCropsQueryHandler } from './queries/get-all-crops/get-all-crops.query-handler';
import { GetCropByIdQueryHandler } from './queries/get-crop-by-id/get-crop-by-id.query-handler';
import { GetCropsByPlotIdQueryHandler } from './queries/get-crops-by-plot-id/get-crops-by-plot-id.query-handler';
import { NestjsEventBusService } from './services/nestjs-event-bus.service';

/**
 * CropsApplicationModule
 * Application layer for Crops (DDD Clean Architecture)
 * Add more handlers and services as needed
 */
@Module({
  imports: [CqrsModule, CropsDomainModule, CropsInfrastructureModule],
  providers: [
    CreateCropCommandHandler,
    UpdateCropCommandHandler,
    DeleteCropCommandHandler,
    GetCropByIdQueryHandler,
    GetAllCropsQueryHandler,
    GetCropsByPlotIdQueryHandler,
    AssignCropVarietyCommandHandler,
    UnassignCropVarietyCommandHandler,
    NestjsEventBusService,
  ],
  exports: [
    CreateCropCommandHandler,
    UpdateCropCommandHandler,
    DeleteCropCommandHandler,
    GetCropByIdQueryHandler,
    GetAllCropsQueryHandler,
    GetCropsByPlotIdQueryHandler,
    AssignCropVarietyCommandHandler,
    UnassignCropVarietyCommandHandler,
    NestjsEventBusService,
  ],
})
export class CropsApplicationModule {}
