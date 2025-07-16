import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Farm name is invalid.
 */
export class InvalidFarmNameException extends DomainException {
  /**
   * Creates a new InvalidFarmNameException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Invalid farm name.');
    this.name = 'InvalidFarmNameException';
  }
}
