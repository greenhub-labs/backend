import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when an id is invalid (not a valid UUID).
 */
export class InvalidIdException extends DomainException {
  constructor(value: string, entity: string) {
    super(`Invalid ${entity} id: '${value}'. Must be a valid UUID.`);
  }
}
