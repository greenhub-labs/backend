import { BaseValueObject } from 'src/shared/domain/value-objects/base.value-object';
import { InvalidUserAvatarUrlException } from '../../exceptions/invalid-user-avatar-url/invalid-user-avatar-url.exception';

/**
 * UserAvatarUrlValueObject
 * Represents a user's avatar URL
 */
export class UserAvatarUrlValueObject extends BaseValueObject<string> {
  /**
   * Validates the avatar URL
   * @param value URL string
   * @throws InvalidUserAvatarUrlException if not a valid URL
   */
  protected validate(value: string): void {
    try {
      new URL(value);
    } catch {
      throw new InvalidUserAvatarUrlException(value);
    }
  }
}
