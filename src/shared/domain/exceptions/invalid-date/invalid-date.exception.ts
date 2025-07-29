import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when an id is invalid (not a valid UUID).
 */
export class InvalidDateException extends DomainException {
  constructor(value: string) {
    super(`Invalid date: '${value}'. Must be a valid date.`);
  }
}
