import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Plot soil type is invalid.
 */
export class InvalidPlotSoilTypeException extends DomainException {
  /**
   * Creates a new InvalidPlotSoilTypeException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Invalid plot soil type.');
    this.name = 'InvalidPlotSoilTypeException';
  }
}
