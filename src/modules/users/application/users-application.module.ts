import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from './commands/create-user/create-user.command-handler';
import { UpdateUserCommandHandler } from './commands/update-user/update-user.command-handler';
import { DeleteUserCommandHandler } from './commands/delete-user/delete-user.command-handler';
import { RestoreUserCommandHandler } from './commands/restore-user/restore-user.command-handler';
import { GetUserByIdQueryHandler } from './queries/get-user-by-id/get-user-by-id.query-handler';
import { UsersDomainModule } from '../domain/users-domain.module';
import { UsersInfrastructureModule } from '../infrastructure/users-infrastructure.module';
import { NestjsEventBusService } from './services/nestjs-event-bus.service';
import { KafkaEventBusService } from './services/kafka-event-bus.service';

/**
 * UsersApplicationModule
 * Application layer for Users (DDD Clean Architecture)
 * Includes caching capabilities for improved performance
 */
@Module({
  imports: [CqrsModule, UsersDomainModule, UsersInfrastructureModule],
  providers: [
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    DeleteUserCommandHandler,
    RestoreUserCommandHandler,
    GetUserByIdQueryHandler,
    NestjsEventBusService,
    KafkaEventBusService,
  ],
  exports: [
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    DeleteUserCommandHandler,
    RestoreUserCommandHandler,
    GetUserByIdQueryHandler,
    NestjsEventBusService,
    KafkaEventBusService,
  ],
})
export class UsersApplicationModule {}
