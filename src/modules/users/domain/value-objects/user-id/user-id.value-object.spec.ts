import { UserIdValueObject } from './user-id.value-object';
import { InvalidUserIdException } from '../../exceptions/invalid-user-id/invalid-user-id.exception';

describe('UserIdValueObject', () => {
  it('should create with valid UUID', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const vo = new UserIdValueObject(uuid);
    expect(vo.value).toBe(uuid);
  });

  it('should throw InvalidUserIdException with invalid UUID', () => {
    expect(() => new UserIdValueObject('invalid-uuid')).toThrow(
      InvalidUserIdException,
    );
  });

  it('should be equal to another with same value', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const vo1 = new UserIdValueObject(uuid);
    const vo2 = new UserIdValueObject(uuid);
    expect(vo1.equals(vo2)).toBe(true);
  });

  it('should not be equal to another with different value', () => {
    const vo1 = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000');
    const vo2 = new UserIdValueObject('223e4567-e89b-12d3-a456-426614174000');
    expect(vo1.equals(vo2)).toBe(false);
  });

  it('should be immutable', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const vo = new UserIdValueObject(uuid);
    expect(() => {
      (vo as any)._value = 'other';
    }).toThrow();
  });
});
