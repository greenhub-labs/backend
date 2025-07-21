import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Crop planting method is invalid.
 */
export class InvalidCropPlantingMethodException extends DomainException {
  /**
   * Creates a new InvalidCropPlantingMethodException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Invalid crop planting method.');
    this.name = 'InvalidCropPlantingMethodException';
  }
}
