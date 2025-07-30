import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Crop variety water requirements is invalid.
 */
export class InvalidCropVarietyWaterRequirementsException extends DomainException {
  /**
   * Creates a new InvalidCropVarietyWaterRequirementsException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Invalid crop variety water requirements.');
    this.name = 'InvalidCropVarietyWaterRequirementsException';
  }
}
