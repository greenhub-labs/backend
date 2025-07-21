import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when attempting to create a Crop that already exists.
 */
export class CropAlreadyExistsException extends DomainException {
  /**
   * Creates a new CropAlreadyExistsException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Crop already exists.');
    this.name = 'CropAlreadyExistsException';
  }
}
