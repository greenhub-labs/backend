import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a user is not found in the system.
 */
export class UserNotFoundException extends DomainException {
  constructor(userId: string) {
    super(`User with id '${userId}' was not found.`);
  }
}
