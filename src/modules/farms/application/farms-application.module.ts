import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
// Import command handlers
import { CreateFarmCommandHandler } from './commands/create-farm/create-farm.command-handler';
import { UpdateFarmCommandHandler } from './commands/update-farm/update-farm.command-handler';
import { DeleteFarmCommandHandler } from './commands/delete-farm/delete-farm.command-handler';
// Import query handlers
import { GetFarmByIdQueryHandler } from './queries/get-farm-by-id/get-farm-by-id.query-handler';
import { GetAllFarmsQueryHandler } from './queries/get-all-farms/get-all-farms.query-handler';
// Import event handlers
// import { FarmsCreatedIntegrationEventHandler } from './event-handlers/farms-created-integration.event-handler';
// Import services
import { NestjsEventBusService } from './services/nestjs-event-bus.service';
import { KafkaEventBusService } from './services/kafka-event-bus.service';
// Import domain and infrastructure modules
import { FarmsDomainModule } from '../domain/farms-domain.module';
import { FarmsInfrastructureModule } from '../infrastructure/farms-infrastructure.module';
import { AssignUserToFarmCommandHandler } from './commands/assign-user-to-farm/assign-user-to-farm.command-handler';
import { GetFarmsForUserQueryHandler } from './queries/get-farms-for-user/get-farms-for-user.query-handler';

/**
 * FarmsApplicationModule
 * Application layer for Farms (DDD Clean Architecture)
 * Add more handlers and services as needed
 */
@Module({
  imports: [CqrsModule, FarmsDomainModule, FarmsInfrastructureModule],
  providers: [
    CreateFarmCommandHandler,
    UpdateFarmCommandHandler,
    DeleteFarmCommandHandler,
    GetFarmByIdQueryHandler,
    GetAllFarmsQueryHandler,
    AssignUserToFarmCommandHandler,
    GetFarmsForUserQueryHandler,
    NestjsEventBusService,
    KafkaEventBusService,
    // FarmsCreatedIntegrationEventHandler,
  ],
  exports: [
    CreateFarmCommandHandler,
    UpdateFarmCommandHandler,
    DeleteFarmCommandHandler,
    GetFarmByIdQueryHandler,
    GetAllFarmsQueryHandler,
    AssignUserToFarmCommandHandler,
    GetFarmsForUserQueryHandler,
    NestjsEventBusService,
    KafkaEventBusService,
  ],
})
export class FarmsApplicationModule {}
