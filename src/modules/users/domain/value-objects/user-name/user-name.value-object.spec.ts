import { UserNameValueObject } from './user-name.value-object';
import { InvalidUserNameException } from '../../exceptions/invalid-user-name/invalid-user-name.exception';

describe('UserNameValueObject', () => {
  it('should create with valid name', () => {
    const vo = new UserNameValueObject('John');
    expect(vo.value).toBe('John');
  });

  it('should throw InvalidUserNameException with too short name', () => {
    expect(() => new UserNameValueObject('J')).toThrow(
      InvalidUserNameException,
    );
  });

  it('should throw InvalidUserNameException with invalid characters', () => {
    expect(() => new UserNameValueObject('J@hn!')).toThrow(
      InvalidUserNameException,
    );
  });

  it('should be equal to another with same value', () => {
    const vo1 = new UserNameValueObject('Jane');
    const vo2 = new UserNameValueObject('Jane');
    expect(vo1.equals(vo2)).toBe(true);
  });

  it('should not be equal to another with different value', () => {
    const vo1 = new UserNameValueObject('Jane');
    const vo2 = new UserNameValueObject('Janet');
    expect(vo1.equals(vo2)).toBe(false);
  });

  it('should be immutable', () => {
    const vo = new UserNameValueObject('Jane');
    expect(() => {
      (vo as any)._value = 'other';
    }).toThrow();
  });
});
