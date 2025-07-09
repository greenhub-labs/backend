import { InvalidUserAvatarUrlException } from './invalid-user-avatar-url.exception';

describe('InvalidUserAvatarUrlException', () => {
  it('should create with value', () => {
    const ex = new InvalidUserAvatarUrlException('not-a-url');
    expect(ex.message).toContain('not-a-url');
    expect(ex).toBeInstanceOf(InvalidUserAvatarUrlException);
  });
});
