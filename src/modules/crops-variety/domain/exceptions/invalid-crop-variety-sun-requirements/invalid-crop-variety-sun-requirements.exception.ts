import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Crop variety sun requirements is invalid.
 */
export class InvalidCropVarietySunRequirementsException extends DomainException {
  /**
   * Creates a new InvalidCropVarietySunRequirementsException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Invalid crop variety sun requirements.');
    this.name = 'InvalidCropVarietySunRequirementsException';
  }
}
