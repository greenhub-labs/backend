import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Crop variety type is invalid.
 */
export class InvalidCropVarietyTypeException extends DomainException {
  /**
   * Creates a new InvalidCropVarietyTypeException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Invalid crop variety type.');
    this.name = 'InvalidCropVarietyTypeException';
  }
}
