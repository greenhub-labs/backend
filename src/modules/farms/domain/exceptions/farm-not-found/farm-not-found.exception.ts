import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Farm is not found in the system.
 */
export class FarmNotFoundException extends DomainException {
  /**
   * Creates a new FarmNotFoundException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Farm not found.');
    this.name = 'FarmNotFoundException';
  }
}
