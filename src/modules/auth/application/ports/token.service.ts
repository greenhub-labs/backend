import { AccessTokenValueObject } from '../../domain/value-objects/access-token/access-token.value-object';
import { RefreshTokenValueObject } from '../../domain/value-objects/refresh-token/refresh-token.value-object';

/**
 * Token for TokenService dependency injection
 */
export const TOKEN_SERVICE_TOKEN = Symbol('TokenService');

/**
 * JWT Token payload interface
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  iat?: number; // Issued at
  exp?: number; // Expiration time
  type: 'access' | 'refresh';
  sessionId?: string;
}

/**
 * Token pair interface
 */
export interface TokenPair {
  accessToken: AccessTokenValueObject;
  refreshToken: RefreshTokenValueObject;
}

/**
 * TokenService port for JWT token operations
 * Defines the contract for token generation and validation
 *
 * @author GreenHub Labs
 */
export interface TokenService {
  /**
   * Generates a new access token
   * @param payload - Token payload
   * @returns Access token value object
   */
  generateAccessToken(
    payload: Omit<JwtPayload, 'type'>,
  ): Promise<AccessTokenValueObject>;

  /**
   * Generates a new refresh token
   * @param payload - Token payload
   * @returns Refresh token value object
   */
  generateRefreshToken(
    payload: Omit<JwtPayload, 'type'>,
  ): Promise<RefreshTokenValueObject>;

  /**
   * Generates both access and refresh tokens
   * @param payload - Token payload
   * @returns Token pair
   */
  generateTokenPair(payload: Omit<JwtPayload, 'type'>): Promise<TokenPair>;

  /**
   * Validates and decodes an access token
   * @param token - Access token to validate
   * @returns Decoded payload if valid
   * @throws TokenExpiredException if invalid or expired
   */
  verifyAccessToken(token: AccessTokenValueObject): Promise<JwtPayload>;

  /**
   * Validates and decodes a refresh token
   * @param token - Refresh token to validate
   * @returns Decoded payload if valid
   * @throws TokenExpiredException if invalid or expired
   */
  verifyRefreshToken(token: RefreshTokenValueObject): Promise<JwtPayload>;

  /**
   * Refreshes an access token using a refresh token
   * @param refreshToken - Valid refresh token
   * @returns New token pair
   * @throws TokenExpiredException if refresh token is invalid
   */
  refreshAccessToken(refreshToken: RefreshTokenValueObject): Promise<TokenPair>;

  /**
   * Extracts user ID from token without full validation
   * @param token - Token to extract from
   * @returns User ID or null if extraction fails
   */
  extractUserId(
    token: AccessTokenValueObject | RefreshTokenValueObject,
  ): string | null;
}
