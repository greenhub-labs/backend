import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginCommand } from './login.command';
import {
  AuthRepository,
  AUTH_REPOSITORY_TOKEN,
} from '../../ports/auth.repository';
import {
  HashingService,
  HASHING_SERVICE_TOKEN,
} from '../../ports/hashing.service';
import {
  TokenService,
  TOKEN_SERVICE_TOKEN,
  TokenPair,
} from '../../ports/token.service';
import { InvalidCredentialsException } from '../../../domain/exceptions/invalid-credentials/invalid-credentials.exception';
import { GetUserByIdQuery } from '../../../../users/application/queries/get-user-by-id/get-user-by-id.query';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import {
  AuthCacheRepository,
  AUTH_CACHE_REPOSITORY_TOKEN,
} from '../../ports/auth-cache.repository';
import { UserDetailsResult } from '../../../../users/application/dtos/user-details.result';

/**
 * Auth payload response for login
 */
export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: UserDetailsResult;
}

/**
 * Command handler for user login
 * Validates credentials, checks cache for fast auth retrieval, records login activity,
 * caches updated auth, publishes events to both NestJS CQRS and Kafka event bus,
 * and returns JWT tokens
 *
 * @author GreenHub Labs
 */
@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  private readonly logger = new Logger(LoginCommandHandler.name);

  constructor(
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: AuthRepository,
    @Inject(AUTH_CACHE_REPOSITORY_TOKEN)
    private readonly authCacheRepository: AuthCacheRepository,
    @Inject(HASHING_SERVICE_TOKEN)
    private readonly hashingService: HashingService,
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: TokenService,
    private readonly queryBus: QueryBus,
    private readonly nestjsEventBus: NestjsEventBusService,
  ) {}

  async execute(command: LoginCommand): Promise<AuthPayload> {
    this.logger.debug('Executing login command');
    this.logger.debug(JSON.stringify(command));

    // 1. Try to find auth record by email in cache first
    let auth = await this.authCacheRepository.getByEmail(command.email);

    // 2. If not in cache, get from database
    if (!auth) {
      auth = await this.authRepository.findByEmail(command.email);
      if (!auth) {
        throw new InvalidCredentialsException('Invalid email or password');
      }
      // Cache for future requests
      await this.authCacheRepository.cacheAuth(auth);
    }

    // 3. Verify password
    const isPasswordValid = await this.hashingService.compare(
      command.password,
      auth.password.value,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsException('Invalid email or password');
    }

    // 4. Get user entity
    const getUserQuery = new GetUserByIdQuery(auth.userId);
    const userDetails: UserDetailsResult =
      await this.queryBus.execute(getUserQuery);

    // 5. Check if user is active
    if (!userDetails.user.isActive || userDetails.user.isDeleted) {
      throw new UnauthorizedException('User account is inactive');
    }

    // 6. Record login activity
    const sessionId = crypto.randomUUID();
    const updatedAuth = auth.recordLogin({
      ipAddress: command.ipAddress,
      userAgent: command.userAgent,
      sessionId: sessionId,
    });

    // 7. Update auth record with login timestamp
    await this.authRepository.update(updatedAuth);

    // 8. Update cache with login timestamp
    await this.authCacheRepository.updateAuth(updatedAuth);

    // 9. Cache session information
    await this.authCacheRepository.setSession(sessionId, {
      userId: userDetails.user.id,
      email: auth.email.value,
      loginAt: new Date().toISOString(),
      ipAddress: command.ipAddress,
      userAgent: command.userAgent,
    });

    // 10. Publish domain events to event bus
    const events = updatedAuth.pullDomainEvents();
    this.logger.debug(`Publishing ${events.length} domain events to event bus`);
    for (const event of events) {
      await this.nestjsEventBus.publish(event); // For internal event handlers
    }

    // 11. Generate JWT tokens
    const tokenPair: TokenPair = await this.tokenService.generateTokenPair({
      sub: userDetails.user.id,
      email: auth.email.value,
      sessionId: sessionId,
    });

    // 12. Return auth payload
    return {
      accessToken: tokenPair.accessToken.value,
      refreshToken: tokenPair.refreshToken.value,
      user: userDetails,
    };
  }
}
