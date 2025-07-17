import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Plot name is invalid.
 */
export class InvalidPlotNameException extends DomainException {
  /**
   * Creates a new InvalidPlotNameException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Invalid plot name.');
    this.name = 'InvalidPlotNameException';
  }
}
