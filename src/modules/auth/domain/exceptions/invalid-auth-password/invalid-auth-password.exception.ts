import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * InvalidAuthPasswordException
 * Thrown when an invalid password format is provided for authentication
 *
 * @author GreenHub Labs
 */
export class InvalidAuthPasswordException extends DomainException {
  /**
   * Creates a new InvalidAuthPasswordException
   * @param message Detailed error message about the invalid password
   */
  constructor(message: string) {
    super(`Invalid auth password: ${message}`);
  }
}
