import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Crop variety season is invalid.
 */
export class InvalidCropVarietySeasonException extends DomainException {
  /**
   * Creates a new InvalidCropVarietySeasonException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Invalid crop variety season.');
    this.name = 'InvalidCropVarietySeasonException';
  }
}
