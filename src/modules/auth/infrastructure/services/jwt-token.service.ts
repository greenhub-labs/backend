import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  TokenService,
  JwtPayload,
  TokenPair,
} from '../../application/ports/token.service';
import { AccessTokenValueObject } from '../../domain/value-objects/access-token/access-token.value-object';
import { RefreshTokenValueObject } from '../../domain/value-objects/refresh-token/refresh-token.value-object';
import { TokenExpiredException } from '../../domain/exceptions/token-expired/token-expired.exception';

/**
 * JWT implementation of the TokenService interface
 * Provides JWT token generation and validation using @nestjs/jwt
 *
 * @author GreenHub Labs
 */
@Injectable()
export class JwtTokenService implements TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiresIn: string;
  private readonly refreshTokenExpiresIn: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Load JWT configuration from environment
    this.accessTokenSecret = this.configService.get<string>(
      'JWT_ACCESS_SECRET',
      'access-secret-key',
    );
    this.refreshTokenSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'refresh-secret-key',
    );
    this.accessTokenExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m',
    );
    this.refreshTokenExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );
  }

  /**
   * Generates a new access token
   * @param payload - Token payload
   * @returns Access token value object
   */
  async generateAccessToken(
    payload: Omit<JwtPayload, 'type'>,
  ): Promise<AccessTokenValueObject> {
    const tokenPayload: JwtPayload = {
      ...payload,
      type: 'access',
    };

    const token = await this.jwtService.signAsync(tokenPayload, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenExpiresIn,
    });

    return AccessTokenValueObject.create(token);
  }

  /**
   * Generates a new refresh token
   * @param payload - Token payload
   * @returns Refresh token value object
   */
  async generateRefreshToken(
    payload: Omit<JwtPayload, 'type'>,
  ): Promise<RefreshTokenValueObject> {
    const tokenPayload: JwtPayload = {
      ...payload,
      type: 'refresh',
    };

    const token = await this.jwtService.signAsync(tokenPayload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpiresIn,
    });

    return RefreshTokenValueObject.create(token);
  }

  /**
   * Generates both access and refresh tokens
   * @param payload - Token payload
   * @returns Token pair
   */
  async generateTokenPair(
    payload: Omit<JwtPayload, 'type'>,
  ): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Validates and decodes an access token
   * @param token - Access token to validate
   * @returns Decoded payload if valid
   * @throws TokenExpiredException if invalid or expired
   */
  async verifyAccessToken(token: AccessTokenValueObject): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token.value, {
        secret: this.accessTokenSecret,
      });

      if (payload.type !== 'access') {
        throw new TokenExpiredException('Invalid token type');
      }

      return payload as JwtPayload;
    } catch (error) {
      throw new TokenExpiredException(error.message || 'Invalid access token');
    }
  }

  /**
   * Validates and decodes a refresh token
   * @param token - Refresh token to validate
   * @returns Decoded payload if valid
   * @throws TokenExpiredException if invalid or expired
   */
  async verifyRefreshToken(
    token: RefreshTokenValueObject,
  ): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token.value, {
        secret: this.refreshTokenSecret,
      });

      if (payload.type !== 'refresh') {
        throw new TokenExpiredException('Invalid token type');
      }

      return payload as JwtPayload;
    } catch (error) {
      throw new TokenExpiredException(error.message || 'Invalid refresh token');
    }
  }

  /**
   * Refreshes an access token using a refresh token
   * @param refreshToken - Valid refresh token
   * @returns New token pair
   * @throws TokenExpiredException if refresh token is invalid
   */
  async refreshAccessToken(
    refreshToken: RefreshTokenValueObject,
  ): Promise<TokenPair> {
    // Verify the refresh token first
    const payload = await this.verifyRefreshToken(refreshToken);

    // Generate new token pair with same payload (excluding JWT metadata)
    const newPayload = {
      sub: payload.sub,
      email: payload.email,
      sessionId: payload.sessionId,
    };

    return this.generateTokenPair(newPayload);
  }

  /**
   * Extracts user ID from token without full validation
   * @param token - Token to extract from
   * @returns User ID or null if extraction fails
   */
  extractUserId(
    token: AccessTokenValueObject | RefreshTokenValueObject,
  ): string | null {
    try {
      // Decode without verification for quick extraction
      const decoded = this.jwtService.decode(token.value) as any;
      return decoded?.sub || null;
    } catch {
      return null;
    }
  }
}
