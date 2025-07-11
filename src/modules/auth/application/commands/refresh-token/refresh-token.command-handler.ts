import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenCommand } from './refresh-token.command';
import {
  TokenService,
  TOKEN_SERVICE_TOKEN,
  TokenPair,
} from '../../ports/token.service';
import { RefreshTokenValueObject } from '../../../domain/value-objects/refresh-token/refresh-token.value-object';
import { GetUserByIdQuery } from '../../../../users/application/queries/get-user-by-id/get-user-by-id.query';
import { User } from '../../../../users/domain/entities/user.entity';

/**
 * Auth payload response for token refresh
 */
export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

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
  constructor(
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: TokenService,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<AuthPayload> {
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
    const user: User = await this.queryBus.execute(getUserQuery);

    // 5. Check if user is still active
    if (!user.isActive || user.isDeleted) {
      throw new UnauthorizedException('User account is inactive');
    }

    // 6. Return new token pair with user data
    return {
      accessToken: newTokenPair.accessToken.value,
      refreshToken: newTokenPair.refreshToken.value,
      user: user,
    };
  }
}
