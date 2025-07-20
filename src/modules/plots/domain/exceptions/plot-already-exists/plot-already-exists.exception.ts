import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when attempting to create a Plot that already exists.
 */
export class PlotAlreadyExistsException extends DomainException {
  /**
   * Creates a new PlotAlreadyExistsException
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Plot already exists.');
    this.name = 'PlotAlreadyExistsException';
  }
}
