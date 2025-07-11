import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * InvalidAuthEmailException
 * Thrown when an invalid email format is provided for authentication
 *
 * @author GreenHub Labs
 */
export class InvalidAuthEmailException extends DomainException {
  /**
   * Creates a new InvalidAuthEmailException
   * @param message Detailed error message about the invalid email
   */
  constructor(message: string) {
    super(`Invalid auth email: ${message}`);
  }
}
