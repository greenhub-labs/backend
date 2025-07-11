import { AuthPasswordValueObject } from './auth-password.value-object';
import { InvalidAuthPasswordException } from '../../exceptions/invalid-auth-password/invalid-auth-password.exception';

describe('AuthPasswordValueObject', () => {
  describe('Valid hashed passwords', () => {
    it('should create with valid bcrypt hash', () => {
      // Arrange - Valid bcrypt hash (example)
      const hashedPassword =
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewqyBcBVj6M5XQ2u';

      // Act
      const passwordVO = AuthPasswordValueObject.fromHash(hashedPassword);

      // Assert
      expect(passwordVO.value).toBe(hashedPassword);
    });

    it('should create with different bcrypt variants', () => {
      // Arrange - Different bcrypt algorithm variants
      const variants = [
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewqyBcBVj6M5XQ2u',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewqyBcBVj6M5XQ2u',
        '$2x$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewqyBcBVj6M5XQ2u',
        '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewqyBcBVj6M5XQ2u',
      ];

      // Act & Assert
      variants.forEach((hash) => {
        expect(() => AuthPasswordValueObject.fromHash(hash)).not.toThrow();
      });
    });
  });

  describe('Invalid hashed passwords', () => {
    it('should throw exception for empty hash', () => {
      // Arrange
      const hashedPassword = '';

      // Act & Assert
      expect(() => AuthPasswordValueObject.fromHash(hashedPassword)).toThrow(
        InvalidAuthPasswordException,
      );
    });

    it('should throw exception for invalid bcrypt format', () => {
      // Arrange
      const invalidHash = 'invalid-hash-format';

      // Act & Assert
      expect(() => AuthPasswordValueObject.fromHash(invalidHash)).toThrow(
        InvalidAuthPasswordException,
      );
    });

    it('should throw exception for wrong prefix', () => {
      // Arrange
      const invalidHash =
        '$3b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewqyBcBVj6M5XQ2u';

      // Act & Assert
      expect(() => AuthPasswordValueObject.fromHash(invalidHash)).toThrow(
        InvalidAuthPasswordException,
      );
    });

    it('should throw exception for wrong length', () => {
      // Arrange
      const shortHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCO';

      // Act & Assert
      expect(() => AuthPasswordValueObject.fromHash(shortHash)).toThrow(
        InvalidAuthPasswordException,
      );
    });
  });

  describe('Plain password validation', () => {
    it('should validate strong password', () => {
      // Arrange
      const strongPassword = 'MyStr0ng!Password';

      // Act & Assert
      expect(() =>
        AuthPasswordValueObject.validatePlainPassword(strongPassword),
      ).not.toThrow();
    });

    it('should throw exception for empty password', () => {
      // Arrange
      const password = '';

      // Act & Assert
      expect(() =>
        AuthPasswordValueObject.validatePlainPassword(password),
      ).toThrow(InvalidAuthPasswordException);
    });

    it('should throw exception for short password', () => {
      // Arrange
      const password = 'Short1!';

      // Act & Assert
      expect(() =>
        AuthPasswordValueObject.validatePlainPassword(password),
      ).toThrow(InvalidAuthPasswordException);
    });

    it('should throw exception for password without uppercase', () => {
      // Arrange
      const password = 'lowercase123!';

      // Act & Assert
      expect(() =>
        AuthPasswordValueObject.validatePlainPassword(password),
      ).toThrow(InvalidAuthPasswordException);
    });

    it('should throw exception for password without lowercase', () => {
      // Arrange
      const password = 'UPPERCASE123!';

      // Act & Assert
      expect(() =>
        AuthPasswordValueObject.validatePlainPassword(password),
      ).toThrow(InvalidAuthPasswordException);
    });

    it('should throw exception for password without numbers', () => {
      // Arrange
      const password = 'NoNumbers!';

      // Act & Assert
      expect(() =>
        AuthPasswordValueObject.validatePlainPassword(password),
      ).toThrow(InvalidAuthPasswordException);
    });

    it('should throw exception for password without special characters', () => {
      // Arrange
      const password = 'NoSpecial123';

      // Act & Assert
      expect(() =>
        AuthPasswordValueObject.validatePlainPassword(password),
      ).toThrow(InvalidAuthPasswordException);
    });

    it('should throw exception for password too long', () => {
      // Arrange
      const longPassword = 'A'.repeat(120) + '1!a'; // > 128 characters

      // Act & Assert
      expect(() =>
        AuthPasswordValueObject.validatePlainPassword(longPassword),
      ).toThrow(InvalidAuthPasswordException);
    });
  });

  describe('Equality', () => {
    it('should be equal when hashes are the same', () => {
      // Arrange
      const hash =
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewqyBcBVj6M5XQ2u';
      const password1 = AuthPasswordValueObject.fromHash(hash);
      const password2 = AuthPasswordValueObject.fromHash(hash);

      // Act & Assert
      expect(password1.equals(password2)).toBe(true);
    });

    it('should not be equal when hashes are different', () => {
      // Arrange
      const hash1 =
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewqyBcBVj6M5XQ2u';
      const hash2 =
        '$2b$12$DifferentHashHereXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
      const password1 = AuthPasswordValueObject.fromHash(hash1);
      const password2 = AuthPasswordValueObject.fromHash(hash2);

      // Act & Assert
      expect(password1.equals(password2)).toBe(false);
    });
  });
});
