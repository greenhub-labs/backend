import { BaseValueObject } from 'src/shared/domain/value-objects/base.value-object';
import { InvalidUserIdException } from '../../exceptions/invalid-user-id/invalid-user-id.exception';

/**
 * UserIdValueObject
 * Represents a unique user identifier (UUID)
 */
export class UserIdValueObject extends BaseValueObject<string> {
  /**
   * Validates the UUID format
   * @param value UUID string
   * @throws InvalidUserIdException if not a valid UUID
   */
  protected validate(value: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new InvalidUserIdException(value);
    }
  }
}
