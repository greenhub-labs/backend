import { BaseValueObject } from 'src/shared/domain/value-objects/base.value-object';
import { InvalidUserNameException } from '../../exceptions/invalid-user-name/invalid-user-name.exception';

/**
 * UserNameValueObject
 * Represents a user's first or last name
 */
export class UserNameValueObject extends BaseValueObject<string> {
  /**
   * Validates the name (length and allowed characters)
   * @param value Name string
   * @throws InvalidUserNameException if invalid
   */
  protected validate(value: string): void {
    if (!value || value.trim().length < 2 || value.length > 50) {
      throw new InvalidUserNameException(
        'UserName must be between 2 and 50 characters',
      );
    }
    const nameRegex = /^[A-Za-z 0-9'\-\s]+$/;
    if (!nameRegex.test(value)) {
      throw new InvalidUserNameException(
        'UserName contains invalid characters',
      );
    }
  }
}
