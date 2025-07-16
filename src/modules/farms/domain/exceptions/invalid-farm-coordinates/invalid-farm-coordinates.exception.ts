import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when Farm coordinates are invalid.
 */
export class InvalidFarmCoordinatesException extends DomainException {
  /**
   * Creates a new InvalidFarmCoordinatesException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Invalid farm coordinates.');
    this.name = 'InvalidFarmCoordinatesException';
  }
}
