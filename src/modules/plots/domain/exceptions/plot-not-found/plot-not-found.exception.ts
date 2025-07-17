import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a Plot is not found in the system.
 */
export class PlotNotFoundException extends DomainException {
  /**
   * Creates a new PlotNotFoundException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Plot not found.');
    this.name = 'PlotNotFoundException';
  }
}
