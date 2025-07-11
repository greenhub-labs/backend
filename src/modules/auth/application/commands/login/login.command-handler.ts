import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
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
import { User } from '../../../../users/domain/entities/user.entity';
import { Auth } from '../../../domain/entities/auth.entity';

/**
 * Auth payload response for login
 */
export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * Command handler for user login
 * Validates credentials, records login activity, and returns JWT tokens
 *
 * @author GreenHub Labs
 */
@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: AuthRepository,
    @Inject(HASHING_SERVICE_TOKEN)
    private readonly hashingService: HashingService,
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: TokenService,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: LoginCommand): Promise<AuthPayload> {
    // 1. Find auth record by email
    const auth = await this.authRepository.findByEmail(command.email);
    if (!auth) {
      throw new InvalidCredentialsException('Invalid email or password');
    }

    // 2. Verify password
    const isPasswordValid = await this.hashingService.compare(
      command.password,
      auth.password.value,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsException('Invalid email or password');
    }

    // 3. Get user entity
    const getUserQuery = new GetUserByIdQuery(auth.userId);
    const user: User = await this.queryBus.execute(getUserQuery);

    // 4. Check if user is active
    if (!user.isActive || user.isDeleted) {
      throw new UnauthorizedException('User account is inactive');
    }

    // 5. Record login activity
    const sessionId = crypto.randomUUID();
    const updatedAuth = auth.recordLogin({
      ipAddress: command.ipAddress,
      userAgent: command.userAgent,
      sessionId: sessionId,
    });

    // 6. Update auth record with login timestamp
    await this.authRepository.update(updatedAuth);

    // 7. Generate JWT tokens
    const tokenPair: TokenPair = await this.tokenService.generateTokenPair({
      sub: user.id.value,
      email: auth.email.value,
      sessionId: sessionId,
    });

    // 8. Return auth payload
    return {
      accessToken: tokenPair.accessToken.value,
      refreshToken: tokenPair.refreshToken.value,
      user: user,
    };
  }
}
