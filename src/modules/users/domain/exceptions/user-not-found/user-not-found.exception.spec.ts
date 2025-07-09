import { UserNotFoundException } from './user-not-found.exception';

describe('UserNotFoundException', () => {
  it('should create with userId', () => {
    const ex = new UserNotFoundException('abc-123');
    expect(ex.message).toContain('abc-123');
    expect(ex).toBeInstanceOf(UserNotFoundException);
  });
});
