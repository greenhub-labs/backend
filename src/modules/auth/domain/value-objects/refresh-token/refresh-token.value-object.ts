import { BaseValueObject } from 'src/shared/domain/value-objects/base.value-object';
import { TokenExpiredException } from '../../exceptions/token-expired/token-expired.exception';

/**
 * RefreshTokenValueObject
 * Represents a JWT refresh token for authentication
 *
 * @author GreenHub Labs
 */
export class RefreshTokenValueObject extends BaseValueObject<string> {
  /**
   * Validates the JWT refresh token format
   * @param value JWT refresh token string to validate
   * @throws TokenExpiredException if not a valid JWT format
   */
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new TokenExpiredException('Refresh token cannot be empty');
    }

    // Basic JWT structure validation (header.payload.signature)
    const jwtParts = value.split('.');
    if (jwtParts.length !== 3) {
      throw new TokenExpiredException('Invalid refresh token format');
    }

    // Validate each part is base64 encoded
    jwtParts.forEach((part, index) => {
      if (!part || part.length === 0) {
        throw new TokenExpiredException(
          `Refresh token part ${index + 1} cannot be empty`,
        );
      }

      // Check if it's valid base64url encoding
      const base64UrlRegex = /^[A-Za-z0-9_-]+$/;
      if (!base64UrlRegex.test(part)) {
        throw new TokenExpiredException(
          `Refresh token part ${index + 1} is not valid base64url`,
        );
      }
    });
  }

  /**
   * Creates a new RefreshTokenValueObject
   * @param token The JWT refresh token
   */
  public static create(token: string): RefreshTokenValueObject {
    return new RefreshTokenValueObject(token);
  }

  /**
   * Extracts the payload from the JWT without validation
   * Note: This is for informational purposes only, proper validation should be done by JWT service
   */
  public getPayload(): any {
    try {
      const payload = this.value.split('.')[1];
      const decodedPayload = Buffer.from(payload, 'base64url').toString(
        'utf-8',
      );
      return JSON.parse(decodedPayload);
    } catch (error) {
      throw new TokenExpiredException('Cannot decode refresh token payload');
    }
  }

  /**
   * Gets the expiration time from the token (if present)
   */
  public getExpirationTime(): Date | null {
    try {
      const payload = this.getPayload();
      if (payload.exp) {
        return new Date(payload.exp * 1000); // JWT exp is in seconds, Date expects milliseconds
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Checks if the token is expired based on its exp claim
   */
  public isExpired(): boolean {
    const expiration = this.getExpirationTime();
    if (!expiration) {
      return false; // If no expiration, consider it valid
    }
    return new Date() > expiration;
  }

  /**
   * Gets the user ID from the token payload
   */
  public getUserId(): string | null {
    try {
      const payload = this.getPayload();
      return payload.sub || payload.userId || null;
    } catch {
      return null;
    }
  }
}
