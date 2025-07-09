import { InvalidUserIdException } from './invalid-user-id.exception';

describe('InvalidUserIdException', () => {
  it('should create with value', () => {
    const ex = new InvalidUserIdException('bad-uuid');
    expect(ex.message).toContain('bad-uuid');
    expect(ex).toBeInstanceOf(InvalidUserIdException);
  });
});
