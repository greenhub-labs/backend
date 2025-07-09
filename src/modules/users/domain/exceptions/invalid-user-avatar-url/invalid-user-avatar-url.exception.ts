import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a user's avatar URL is invalid.
 */
export class InvalidUserAvatarUrlException extends DomainException {
  constructor(value: string) {
    super(`Invalid user avatar URL: '${value}'. Must be a valid URL.`);
  }
}
