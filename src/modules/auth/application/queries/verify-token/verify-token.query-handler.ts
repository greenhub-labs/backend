import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { VerifyTokenQuery } from './verify-token.query';
import {
  TokenService,
  TOKEN_SERVICE_TOKEN,
  JwtPayload,
} from '../../ports/token.service';
import { AccessTokenValueObject } from '../../../domain/value-objects/access-token/access-token.value-object';
import { RefreshTokenValueObject } from '../../../domain/value-objects/refresh-token/refresh-token.value-object';
import { TokenVerificationResult } from '../../dtos/token-verification-result.dto';

/**
 * Query handler for verifying JWT tokens
 * Validates token signature, expiration, and format
 *
 * @author GreenHub Labs
 */
@QueryHandler(VerifyTokenQuery)
export class VerifyTokenQueryHandler
  implements IQueryHandler<VerifyTokenQuery>
{
  constructor(
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Execute the query to verify a JWT token
   * @param query - The query containing the token to verify
   * @returns Token verification result
   */
  async execute(query: VerifyTokenQuery): Promise<TokenVerificationResult> {
    try {
      let payload: JwtPayload;

      if (query.tokenType === 'access') {
        const accessToken = AccessTokenValueObject.create(query.token);
        payload = await this.tokenService.verifyAccessToken(accessToken);
      } else {
        const refreshToken = RefreshTokenValueObject.create(query.token);
        payload = await this.tokenService.verifyRefreshToken(refreshToken);
      }

      return {
        valid: true,
        payload: payload,
        expired: false,
        userId: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      // Check if it's an expiration error
      const isExpired =
        error.message?.includes('expired') ||
        error.message?.includes('exp') ||
        error.name === 'TokenExpiredError';

      return {
        valid: false,
        expired: isExpired,
        payload: undefined,
        userId: undefined,
        email: undefined,
      };
    }
  }
}
