import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
// Import command handlers
import { CreatePlotCommandHandler } from './commands/create-plot/create-plot.command-handler';
import { UpdatePlotCommandHandler } from './commands/update-plot/update-plot.command-handler';
import { DeletePlotCommandHandler } from './commands/delete-plot/delete-plot.command-handler';
// Import query handlers
import { GetPlotByIdQueryHandler } from './queries/get-plot-by-id/get-plot-by-id.query-handler';
import { GetAllPlotsQueryHandler } from './queries/get-all-plots/get-all-plots.query-handler';
// Import event handlers
// import { FarmsCreatedIntegrationEventHandler } from './event-handlers/farms-created-integration.event-handler';
// Import services
import { NestjsEventBusService } from './services/nestjs-event-bus.service';
// Import domain and infrastructure modules
import { PlotsDomainModule } from '../domain/plots-domain.module';
import { PlotsInfrastructureModule } from '../infrastructure/plots-infrastructure.module';
import { AssignUserToFarmCommandHandler } from 'src/modules/farms/application/commands/assign-user-to-farm/assign-user-to-farm.command-handler';

/**
 * FarmsApplicationModule
 * Application layer for Farms (DDD Clean Architecture)
 * Add more handlers and services as needed
 */
@Module({
  imports: [CqrsModule, PlotsDomainModule, PlotsInfrastructureModule],
  providers: [
    CreatePlotCommandHandler,
    UpdatePlotCommandHandler,
    DeletePlotCommandHandler,
    GetPlotByIdQueryHandler,
    GetAllPlotsQueryHandler,
    NestjsEventBusService,
    // FarmsCreatedIntegrationEventHandler,
  ],
  exports: [
    CreatePlotCommandHandler,
    UpdatePlotCommandHandler,
    DeletePlotCommandHandler,
    GetPlotByIdQueryHandler,
    GetAllPlotsQueryHandler,
    NestjsEventBusService,
  ],
})
export class PlotsApplicationModule {}
