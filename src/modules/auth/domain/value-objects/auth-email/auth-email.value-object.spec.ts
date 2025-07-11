import { AuthEmailValueObject } from './auth-email.value-object';
import { InvalidAuthEmailException } from '../../exceptions/invalid-auth-email/invalid-auth-email.exception';

describe('AuthEmailValueObject', () => {
  describe('Valid emails', () => {
    it('should create with valid simple email', () => {
      // Arrange
      const email = 'test@example.com';

      // Act
      const emailVO = new AuthEmailValueObject(email);

      // Assert
      expect(emailVO.value).toBe('test@example.com');
    });

    it('should create with valid complex email', () => {
      // Arrange
      const email = 'user.name+tag@example-domain.co.uk';

      // Act
      const emailVO = new AuthEmailValueObject(email);

      // Assert
      expect(emailVO.value).toBe('user.name+tag@example-domain.co.uk');
    });

    it('should convert email to lowercase', () => {
      // Arrange
      const email = 'Test.User@EXAMPLE.COM';

      // Act
      const emailVO = new AuthEmailValueObject(email);

      // Assert
      expect(emailVO.value).toBe('test.user@example.com');
    });
  });

  describe('Invalid emails', () => {
    it('should throw exception for empty email', () => {
      // Arrange
      const email = '';

      // Act & Assert
      expect(() => new AuthEmailValueObject(email)).toThrow(
        InvalidAuthEmailException,
      );
    });

    it('should throw exception for null email', () => {
      // Arrange
      const email = null as any;

      // Act & Assert
      expect(() => new AuthEmailValueObject(email)).toThrow(
        InvalidAuthEmailException,
      );
    });

    it('should throw exception for whitespace only email', () => {
      // Arrange
      const email = '   ';

      // Act & Assert
      expect(() => new AuthEmailValueObject(email)).toThrow(
        InvalidAuthEmailException,
      );
    });

    it('should throw exception for email without @', () => {
      // Arrange
      const email = 'userexample.com';

      // Act & Assert
      expect(() => new AuthEmailValueObject(email)).toThrow(
        InvalidAuthEmailException,
      );
    });

    it('should throw exception for email without domain', () => {
      // Arrange
      const email = 'user@';

      // Act & Assert
      expect(() => new AuthEmailValueObject(email)).toThrow(
        InvalidAuthEmailException,
      );
    });

    it('should throw exception for email without local part', () => {
      // Arrange
      const email = '@example.com';

      // Act & Assert
      expect(() => new AuthEmailValueObject(email)).toThrow(
        InvalidAuthEmailException,
      );
    });

    it('should throw exception for email too long', () => {
      // Arrange
      const longEmail = 'a'.repeat(250) + '@example.com'; // > 254 characters

      // Act & Assert
      expect(() => new AuthEmailValueObject(longEmail)).toThrow(
        InvalidAuthEmailException,
      );
    });

    it('should throw exception for invalid characters', () => {
      // Arrange
      const email = 'user@exam<ple.com';

      // Act & Assert
      expect(() => new AuthEmailValueObject(email)).toThrow(
        InvalidAuthEmailException,
      );
    });
  });

  describe('Equality', () => {
    it('should be equal when emails are the same', () => {
      // Arrange
      const email1 = new AuthEmailValueObject('test@example.com');
      const email2 = new AuthEmailValueObject('test@example.com');

      // Act & Assert
      expect(email1.equals(email2)).toBe(true);
    });

    it('should be equal when emails differ in case', () => {
      // Arrange
      const email1 = new AuthEmailValueObject('test@example.com');
      const email2 = new AuthEmailValueObject('Test@EXAMPLE.COM');

      // Act & Assert
      expect(email1.equals(email2)).toBe(true);
    });

    it('should not be equal when emails are different', () => {
      // Arrange
      const email1 = new AuthEmailValueObject('test1@example.com');
      const email2 = new AuthEmailValueObject('test2@example.com');

      // Act & Assert
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
