import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when attempting to create a Farm that already exists.
 */
export class FarmAlreadyExistsException extends DomainException {
  /**
   * Creates a new FarmAlreadyExistsException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Farm already exists.');
    this.name = 'FarmAlreadyExistsException';
  }
}
