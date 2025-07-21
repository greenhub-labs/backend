import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Crop is not found in the system.
 */
export class CropNotFoundException extends DomainException {
  /**
   * Creates a new CropNotFoundException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Crop not found.');
    this.name = 'CropNotFoundException';
  }
}
