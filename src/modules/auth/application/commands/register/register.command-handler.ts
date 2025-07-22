import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { Inject, ConflictException, Logger } from '@nestjs/common';
import { RegisterCommand } from './register.command';
import { AuthFactory } from '../../../domain/factories/auth/auth.factory';
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
import { CreateUserCommand } from '../../../../users/application/commands/create-user/create-user.command';
import { AuthPasswordValueObject } from '../../../domain/value-objects/auth-password/auth-password.value-object';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import {
  AuthCacheRepository,
  AUTH_CACHE_REPOSITORY_TOKEN,
} from '../../ports/auth-cache.repository';
import { UserDetailsResult } from '../../../../users/application/dtos/user-details.result';
import { AuthPayload } from '../../dtos/auth-payload.dto';

/**
 * Command handler for user registration
 * Creates both User and Auth entities, validates email uniqueness,
 * caches the created auth record, publishes events to both NestJS CQRS
 * and Kafka event bus, and returns JWT tokens for immediate authentication
 *
 * @author GreenHub Labs
 */
@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  private readonly logger = new Logger(RegisterCommandHandler.name);

  constructor(
    private readonly authFactory: AuthFactory,
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: AuthRepository,
    @Inject(AUTH_CACHE_REPOSITORY_TOKEN)
    private readonly authCacheRepository: AuthCacheRepository,
    @Inject(HASHING_SERVICE_TOKEN)
    private readonly hashingService: HashingService,
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: TokenService,
    private readonly commandBus: CommandBus,
    private readonly nestjsEventBus: NestjsEventBusService,
  ) {}

  async execute(command: RegisterCommand): Promise<AuthPayload> {
    this.logger.debug('Executing register command');

    // 1. Validate password requirements
    AuthPasswordValueObject.validatePlainPassword(command.password);

    // 2. Check if email already exists
    const emailExists = await this.authRepository.emailExists(command.email);
    if (emailExists) {
      throw new ConflictException('Email already registered');
    }

    // 3. Create User entity first (through Users module)
    const createUserCommand = new CreateUserCommand(
      command.firstName,
      command.lastName,
      undefined, // avatar
      undefined, // bio
    );
    const userDetails: UserDetailsResult =
      await this.commandBus.execute(createUserCommand);

    // 4. Hash the password
    const hashedPassword = await this.hashingService.hash(command.password);

    // 5. Create Auth entity
    const auth = this.authFactory.createForRegistration({
      userId: userDetails.user.id,
      email: command.email,
      hashedPassword: hashedPassword,
      phone: command.phone,
    });

    // 6. Record registration event with user info
    auth.recordRegistration(
      {
        firstName: command.firstName,
        lastName: command.lastName,
        bio: undefined, // Not provided in registration
        avatar: undefined, // Not provided in registration
      },
      {
        ipAddress: undefined, // TODO: Extract from request context
        userAgent: undefined, // TODO: Extract from request context
        source: 'web', // TODO: Make this configurable
      },
    );

    // 7. Save Auth entity
    await this.authRepository.save(auth);

    // 8. Cache the newly created auth record
    await this.authCacheRepository.cacheAuth(auth);

    // 9. Publish domain events to event bus
    const events = auth.pullDomainEvents();
    for (const event of events) {
      await this.nestjsEventBus.publish(event); // For internal event handlers
    }

    // 10. Generate JWT tokens
    const tokenPair: TokenPair = await this.tokenService.generateTokenPair({
      sub: userDetails.user.id,
      email: command.email,
      sessionId: crypto.randomUUID(),
    });

    userDetails.user.email = command.email;
    userDetails.user.phone = command.phone;

    // 11. Return auth payload
    return {
      accessToken: tokenPair.accessToken.value,
      refreshToken: tokenPair.refreshToken.value,
      user: new UserDetailsResult(userDetails.user, userDetails.farms),
    };
  }
}
