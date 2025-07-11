import { BaseValueObject } from 'src/shared/domain/value-objects/base.value-object';
import { TokenExpiredException } from '../../exceptions/token-expired/token-expired.exception';

/**
 * AccessTokenValueObject
 * Represents a JWT access token for authentication
 *
 * @author GreenHub Labs
 */
export class AccessTokenValueObject extends BaseValueObject<string> {
  /**
   * Validates the JWT token format (basic structure validation)
   * @param value JWT token string to validate
   * @throws TokenExpiredException if not a valid JWT format
   */
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new TokenExpiredException('Access token cannot be empty');
    }

    // Basic JWT structure validation (header.payload.signature)
    const jwtParts = value.split('.');
    if (jwtParts.length !== 3) {
      throw new TokenExpiredException('Invalid JWT token format');
    }

    // Validate each part is base64 encoded
    jwtParts.forEach((part, index) => {
      if (!part || part.length === 0) {
        throw new TokenExpiredException(
          `JWT part ${index + 1} cannot be empty`,
        );
      }

      // Check if it's valid base64url encoding
      const base64UrlRegex = /^[A-Za-z0-9_-]+$/;
      if (!base64UrlRegex.test(part)) {
        throw new TokenExpiredException(
          `JWT part ${index + 1} is not valid base64url`,
        );
      }
    });
  }

  /**
   * Creates a new AccessTokenValueObject
   * @param token The JWT access token
   */
  public static create(token: string): AccessTokenValueObject {
    return new AccessTokenValueObject(token);
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
      throw new TokenExpiredException('Cannot decode JWT payload');
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
}
