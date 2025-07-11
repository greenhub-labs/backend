import { InvalidAuthEmailException } from './invalid-auth-email.exception';

describe('InvalidAuthEmailException', () => {
  it('should create an exception with correct message', () => {
    // Arrange
    const message = 'Email format is incorrect';

    // Act
    const exception = new InvalidAuthEmailException(message);

    // Assert
    expect(exception).toBeInstanceOf(Error);
    expect(exception).toBeInstanceOf(InvalidAuthEmailException);
    expect(exception.message).toBe(
      'Invalid auth email: Email format is incorrect',
    );
    expect(exception.name).toBe('InvalidAuthEmailException');
  });

  it('should handle empty message', () => {
    // Arrange
    const message = '';

    // Act
    const exception = new InvalidAuthEmailException(message);

    // Assert
    expect(exception.message).toBe('Invalid auth email: ');
  });
});
