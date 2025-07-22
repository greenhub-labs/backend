import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenCommand } from './refresh-token.command';
import {
  TokenService,
  TOKEN_SERVICE_TOKEN,
  TokenPair,
} from '../../ports/token.service';
import { RefreshTokenValueObject } from '../../../domain/value-objects/refresh-token/refresh-token.value-object';
import { GetUserByIdQuery } from '../../../../users/application/queries/get-user-by-id/get-user-by-id.query';
import { AuthPayload } from '../../dtos/auth-payload.dto';
import { UserDetailsResult } from 'src/modules/users/application/dtos/user-details.result';

/**
 * Command handler for refreshing access tokens
 * Validates refresh token and generates new token pair
 *
 * @author GreenHub Labs
 */
@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  private readonly logger = new Logger(RefreshTokenCommandHandler.name);

  constructor(
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: TokenService,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<AuthPayload> {
    this.logger.debug('Executing refresh token command');
    this.logger.debug(JSON.stringify(command));

    // 1. Create refresh token value object (validates format)
    const refreshTokenVO = RefreshTokenValueObject.create(command.refreshToken);

    // 2. Generate new token pair using existing refresh token
    const newTokenPair: TokenPair =
      await this.tokenService.refreshAccessToken(refreshTokenVO);

    // 3. Extract user ID from the refresh token to get user data
    const userId = this.tokenService.extractUserId(refreshTokenVO);
    if (!userId) {
      throw new UnauthorizedException('Invalid refresh token payload');
    }

    // 4. Get user entity
    const getUserQuery = new GetUserByIdQuery(userId);
    const userDetailsResult: UserDetailsResult =
      await this.queryBus.execute(getUserQuery);

    // 5. Check if user is still active
    if (!userDetailsResult.user.isActive || userDetailsResult.user.isDeleted) {
      throw new UnauthorizedException('User account is inactive');
    }

    // 6. Return new token pair with user data
    return {
      accessToken: newTokenPair.accessToken.value,
      refreshToken: newTokenPair.refreshToken.value,
      user: userDetailsResult,
    };
  }
}
