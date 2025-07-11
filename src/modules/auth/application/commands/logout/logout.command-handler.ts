import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { LogoutCommand } from './logout.command';
import {
  AuthRepository,
  AUTH_REPOSITORY_TOKEN,
} from '../../ports/auth.repository';
import {
  AuthCacheRepository,
  AUTH_CACHE_REPOSITORY_TOKEN,
} from '../../ports/auth-cache.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { KafkaEventBusService } from '../../services/kafka-event-bus.service';

/**
 * LogoutCommandHandler
 *
 * Command handler for user logout operations.
 * Records the logout event, clears cache and session data, triggers domain events
 * for analytics and monitoring, and publishes events to both NestJS CQRS and Kafka event bus.
 *
 * @author GreenHub Labs
 */
@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: AuthRepository,
    @Inject(AUTH_CACHE_REPOSITORY_TOKEN)
    private readonly authCacheRepository: AuthCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
    private readonly kafkaEventBus: KafkaEventBusService,
  ) {}

  /**
   * Executes the logout command
   *
   * @param command - Logout command containing user and session information
   * @returns Promise<boolean> - True if logout was successful
   * @throws {NotFoundException} When user auth record is not found
   */
  async execute(command: LogoutCommand): Promise<boolean> {
    // 1. Find auth record by user ID
    const auth = await this.authRepository.findByUserId(command.userId);
    if (!auth) {
      throw new NotFoundException('Authentication record not found');
    }

    // 2. Record logout event
    auth.recordLogout({
      sessionId: command.sessionId,
      ipAddress: undefined, // TODO: Extract from request context
      userAgent: undefined, // TODO: Extract from request context
      logoutMethod: command.logoutMethod,
      reason: command.reason,
    });

    // 3. Save auth entity
    await this.authRepository.save(auth);

    // 4. Clear session cache if sessionId is provided
    if (command.sessionId) {
      await this.authCacheRepository.deleteSession(command.sessionId);
    }

    // 5. Optionally clear auth cache to force fresh data on next login
    // This can be useful for security reasons or if auth data might be stale
    // Uncomment if you want to clear auth cache on logout:
    // await this.authCacheRepository.deleteAuth(command.userId, auth.email.value);

    // 6. Publish domain events to both event buses
    const events = auth.pullDomainEvents();
    for (const event of events) {
      await this.nestjsEventBus.publish(event); // For internal event handlers
      await this.kafkaEventBus.publish(event); // For external systems
    }

    // 7. Return success
    return true;
  }
}
