import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Plot status is invalid.
 */
export class InvalidPlotStatusException extends DomainException {
  /**
   * Creates a new InvalidPlotStatusException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Invalid plot status.');
    this.name = 'InvalidPlotStatusException';
  }
}
