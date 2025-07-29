import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Crop status is invalid.
 */
export class InvalidCropStatusException extends DomainException {
  /**
   * Creates a new InvalidCropStatusException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Invalid crop status.');
    this.name = 'InvalidCropStatusException';
  }
}
