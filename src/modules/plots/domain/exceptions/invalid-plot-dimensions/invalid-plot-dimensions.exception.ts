import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Plot dimensions are invalid.
 */
export class InvalidPlotDimensionsException extends DomainException {
  /**
   * Creates a new InvalidPlotNameException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Invalid plot dimensions.');
    this.name = 'InvalidPlotDimensionsException';
  }
}
