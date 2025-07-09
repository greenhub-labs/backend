import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a user's id is invalid (not a valid UUID).
 */
export class InvalidUserIdException extends DomainException {
  constructor(value: string) {
    super(`Invalid user id: '${value}'. Must be a valid UUID.`);
  }
}
