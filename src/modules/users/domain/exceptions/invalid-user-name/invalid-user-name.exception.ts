import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a user's name is invalid.
 */
export class InvalidUserNameException extends DomainException {
  constructor(reason?: string) {
    super(`Invalid user name.${reason ? ' ' + reason : ''}`);
  }
}
