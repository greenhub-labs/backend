import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
// Import command handlers
import { CreateFarmsCommandHandler } from './commands/create-farms/create-farms.command-handler';
import { UpdateFarmsCommandHandler } from './commands/update-farms/update-farms.command-handler';
import { DeleteFarmsCommandHandler } from './commands/delete-farms/delete-farms.command-handler';
// Import query handlers
import { GetFarmsByIdQueryHandler } from './queries/get-farms-by-id/get-farms-by-id.query-handler';
// Import event handlers
// import { FarmsCreatedIntegrationEventHandler } from './event-handlers/farms-created-integration.event-handler';
// Import services
import { NestjsEventBusService } from './services/nestjs-event-bus.service';
import { KafkaEventBusService } from './services/kafka-event-bus.service';
// Import domain and infrastructure modules
import { FarmsDomainModule } from '../domain/farms-domain.module';
import { FarmsInfrastructureModule } from '../infrastructure/farms-infrastructure.module';

/**
 * FarmsApplicationModule
 * Application layer for Farms (DDD Clean Architecture)
 * Add more handlers and services as needed
 */
@Module({
  imports: [CqrsModule, FarmsDomainModule, FarmsInfrastructureModule],
  providers: [
    CreateFarmsCommandHandler,
    UpdateFarmsCommandHandler,
    DeleteFarmsCommandHandler,
    GetFarmsByIdQueryHandler,
    NestjsEventBusService,
    KafkaEventBusService,
    // FarmsCreatedIntegrationEventHandler,
  ],
  exports: [
    CreateFarmsCommandHandler,
    UpdateFarmsCommandHandler,
    DeleteFarmsCommandHandler,
    GetFarmsByIdQueryHandler,
    NestjsEventBusService,
    KafkaEventBusService,
  ],
})
export class FarmsApplicationModule {}
