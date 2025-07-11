import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { Inject, ConflictException } from '@nestjs/common';
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
import { User } from '../../../../users/domain/entities/user.entity';
import { Auth } from '../../../domain/entities/auth.entity';

/**
 * Auth payload response for registration
 */
export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * Command handler for user registration
 * Creates both User and Auth entities, validates email uniqueness
 * and returns JWT tokens for immediate authentication
 *
 * @author GreenHub Labs
 */
@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    private readonly authFactory: AuthFactory,
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: AuthRepository,
    @Inject(HASHING_SERVICE_TOKEN)
    private readonly hashingService: HashingService,
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: TokenService,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: RegisterCommand): Promise<AuthPayload> {
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
    const user: User = await this.commandBus.execute(createUserCommand);

    // 4. Hash the password
    const hashedPassword = await this.hashingService.hash(command.password);

    // 5. Create Auth entity
    const auth = this.authFactory.createForRegistration({
      userId: user.id.value,
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

    // 7. Save Auth entity (this will also publish domain events)
    await this.authRepository.save(auth);

    // 8. Generate JWT tokens
    const tokenPair: TokenPair = await this.tokenService.generateTokenPair({
      sub: user.id.value,
      email: command.email,
      sessionId: crypto.randomUUID(),
    });

    // 9. Return auth payload
    return {
      accessToken: tokenPair.accessToken.value,
      refreshToken: tokenPair.refreshToken.value,
      user: user,
    };
  }
}
