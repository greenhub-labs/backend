import { BaseValueObject } from 'src/shared/domain/value-objects/base.value-object';
import { InvalidAuthPasswordException } from '../../exceptions/invalid-auth-password/invalid-auth-password.exception';

/**
 * AuthPasswordValueObject
 * Represents a hashed password for authentication purposes
 * This value object stores only hashed passwords, never plain text
 *
 * @author GreenHub Labs
 */
export class AuthPasswordValueObject extends BaseValueObject<string> {
  /**
   * Validates the hashed password format
   * @param value Hashed password string to validate
   * @throws InvalidAuthPasswordException if not a valid hash format
   */
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new InvalidAuthPasswordException('Password hash cannot be empty');
    }

    // Bcrypt hash validation (starts with $2a$, $2b$, $2x$, or $2y$ and has proper length)
    const bcryptRegex = /^\$2[abxy]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/;

    if (!bcryptRegex.test(value)) {
      throw new InvalidAuthPasswordException('Invalid password hash format');
    }
  }

  /**
   * Static method to validate plain text password requirements before hashing
   * @param plainPassword Plain text password to validate
   * @throws InvalidAuthPasswordException if password doesn't meet requirements
   */
  public static validatePlainPassword(plainPassword: string): void {
    if (!plainPassword || plainPassword.length === 0) {
      throw new InvalidAuthPasswordException('Password cannot be empty');
    }

    if (plainPassword.length < 8) {
      throw new InvalidAuthPasswordException(
        'Password must be at least 8 characters long',
      );
    }

    if (plainPassword.length > 128) {
      throw new InvalidAuthPasswordException(
        'Password cannot exceed 128 characters',
      );
    }

    // Password strength requirements
    const hasUpperCase = /[A-Z]/.test(plainPassword);
    const hasLowerCase = /[a-z]/.test(plainPassword);
    const hasNumbers = /\d/.test(plainPassword);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      plainPassword,
    );

    if (!hasUpperCase) {
      throw new InvalidAuthPasswordException(
        'Password must contain at least one uppercase letter',
      );
    }

    if (!hasLowerCase) {
      throw new InvalidAuthPasswordException(
        'Password must contain at least one lowercase letter',
      );
    }

    if (!hasNumbers) {
      throw new InvalidAuthPasswordException(
        'Password must contain at least one number',
      );
    }

    if (!hasSpecialChar) {
      throw new InvalidAuthPasswordException(
        'Password must contain at least one special character',
      );
    }
  }

  /**
   * Creates a new AuthPasswordValueObject from a hashed password
   * @param hashedPassword The bcrypt hashed password
   */
  public static fromHash(hashedPassword: string): AuthPasswordValueObject {
    return new AuthPasswordValueObject(hashedPassword);
  }
}
