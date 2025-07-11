import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthDomainModule } from '../domain/auth-domain.module';
import { UsersApplicationModule } from '../../users/application/users-application.module';

// Command Handlers
import { RegisterCommandHandler } from './commands/register/register.command-handler';
import { LoginCommandHandler } from './commands/login/login.command-handler';
import { RefreshTokenCommandHandler } from './commands/refresh-token/refresh-token.command-handler';
import { LogoutCommandHandler } from './commands/logout/logout.command-handler';

// Query Handlers
import { MeQueryHandler } from './queries/me/me.query-handler';
import { VerifyTokenQueryHandler } from './queries/verify-token/verify-token.query-handler';

// Services
import { NestjsEventBusService } from './services/nestjs-event-bus.service';
import { KafkaEventBusService } from './services/kafka-event-bus.service';

/**
 * AuthApplicationModule
 * Application layer for Auth (DDD Clean Architecture)
 * Includes command and query handlers with CQRS pattern
 *
 * @author GreenHub Labs
 */
@Module({
  imports: [
    CqrsModule,
    AuthDomainModule,
    UsersApplicationModule, // For user creation and queries
  ],
  providers: [
    // Command Handlers
    RegisterCommandHandler,
    LoginCommandHandler,
    RefreshTokenCommandHandler,
    LogoutCommandHandler,

    // Query Handlers
    MeQueryHandler,
    VerifyTokenQueryHandler,

    // Event Bus Services
    NestjsEventBusService,
    KafkaEventBusService,
  ],
  exports: [
    // Command Handlers
    RegisterCommandHandler,
    LoginCommandHandler,
    RefreshTokenCommandHandler,
    LogoutCommandHandler,

    // Query Handlers
    MeQueryHandler,
    VerifyTokenQueryHandler,

    // Event Bus Services
    NestjsEventBusService,
    KafkaEventBusService,
  ],
})
export class AuthApplicationModule {}
