import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { LogoutCommand } from './logout.command';
import {
  AuthRepository,
  AUTH_REPOSITORY_TOKEN,
} from '../../ports/auth.repository';

/**
 * LogoutCommandHandler
 *
 * Command handler for user logout operations.
 * Records the logout event and triggers domain events for analytics and monitoring.
 *
 * @author GreenHub Labs
 */
@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: AuthRepository,
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

    // 3. Save auth entity (this will publish domain events)
    await this.authRepository.save(auth);

    // 4. Return success
    return true;
  }
}
