import { BaseValueObject } from 'src/shared/domain/value-objects/base.value-object';
import { InvalidAuthEmailException } from '../../exceptions/invalid-auth-email/invalid-auth-email.exception';

/**
 * AuthEmailValueObject
 * Represents a valid email address for authentication purposes
 *
 * @author GreenHub Labs
 */
export class AuthEmailValueObject extends BaseValueObject<string> {
  /**
   * Validates the email format using RFC 5322 compliant regex
   * @param value Email string to validate
   * @throws InvalidAuthEmailException if not a valid email format
   */
  protected validate(value: string): void {
    // RFC 5322 compliant email regex
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!value || value.trim().length === 0) {
      throw new InvalidAuthEmailException('Email cannot be empty');
    }

    if (value.length > 254) {
      throw new InvalidAuthEmailException('Email cannot exceed 254 characters');
    }

    if (!emailRegex.test(value.toLowerCase())) {
      throw new InvalidAuthEmailException(`Invalid email format: ${value}`);
    }
  }

  /**
   * Returns the email in lowercase for consistency
   */
  public get value(): string {
    return this._value.toLowerCase();
  }
}
