import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Farm address is invalid.
 */
export class InvalidFarmAddressException extends DomainException {
  /**
   * Creates a new InvalidFarmAddressException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Invalid farm address.');
    this.name = 'InvalidFarmAddressException';
  }
}
