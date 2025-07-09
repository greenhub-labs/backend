import { InvalidUserNameException } from './invalid-user-name.exception';

describe('InvalidUserNameException', () => {
  it('should create with reason', () => {
    const ex = new InvalidUserNameException('Too short');
    expect(ex.message).toContain('Too short');
    expect(ex).toBeInstanceOf(InvalidUserNameException);
  });
});
