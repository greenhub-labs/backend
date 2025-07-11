import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * InvalidCredentialsException
 * Thrown when authentication credentials are invalid (wrong email/password combination)
 *
 * @author GreenHub Labs
 */
export class InvalidCredentialsException extends DomainException {
  /**
   * Creates a new InvalidCredentialsException
   * @param message Optional detailed error message
   */
  constructor(message: string = 'Invalid email or password') {
    super(`Authentication failed: ${message}`);
  }
}
