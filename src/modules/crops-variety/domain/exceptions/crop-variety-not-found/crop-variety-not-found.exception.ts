import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Crop variety is not found.
 */
export class CropVarietyNotFoundException extends DomainException {
  /**
   * Creates a new CropVarietyNotFoundException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Crop variety not found.');
    this.name = 'CropVarietyNotFoundException';
  }
}
