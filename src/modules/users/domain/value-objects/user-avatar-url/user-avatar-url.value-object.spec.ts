import { UserAvatarUrlValueObject } from './user-avatar-url.value-object';
import { InvalidUserAvatarUrlException } from '../../exceptions/invalid-user-avatar-url/invalid-user-avatar-url.exception';

describe('UserAvatarUrlValueObject', () => {
  it('should create with valid URL', () => {
    const vo = new UserAvatarUrlValueObject('https://example.com/avatar.png');
    expect(vo.value).toBe('https://example.com/avatar.png');
  });

  it('should throw InvalidUserAvatarUrlException with invalid URL', () => {
    expect(() => new UserAvatarUrlValueObject('not-a-url')).toThrow(
      InvalidUserAvatarUrlException,
    );
  });

  it('should be equal to another with same value', () => {
    const vo1 = new UserAvatarUrlValueObject('https://example.com/avatar.png');
    const vo2 = new UserAvatarUrlValueObject('https://example.com/avatar.png');
    expect(vo1.equals(vo2)).toBe(true);
  });

  it('should not be equal to another with different value', () => {
    const vo1 = new UserAvatarUrlValueObject('https://example.com/avatar.png');
    const vo2 = new UserAvatarUrlValueObject('https://example.com/other.png');
    expect(vo1.equals(vo2)).toBe(false);
  });

  it('should be immutable', () => {
    const vo = new UserAvatarUrlValueObject('https://avatar.com/john.png');
    // Intentar mutar la propiedad privada
    (vo as any)._value = 'other';
    // Comprobar que el valor no cambia
    expect(vo.value).toBe('https://avatar.com/john.png');
  });
});
