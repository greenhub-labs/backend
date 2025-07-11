import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * TokenExpiredException
 * Thrown when a JWT token has expired or is invalid
 *
 * @author GreenHub Labs
 */
export class TokenExpiredException extends DomainException {
  /**
   * Creates a new TokenExpiredException
   * @param message Optional detailed error message
   */
  constructor(message: string = 'Token has expired') {
    super(`Token validation failed: ${message}`);
  }
}
