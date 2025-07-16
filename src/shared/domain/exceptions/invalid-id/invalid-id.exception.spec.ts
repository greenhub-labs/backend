import { InvalidIdException } from './invalid-id.exception';

describe('InvalidIdException', () => {
  it('should create with value', () => {
    const ex = new InvalidIdException('bad-uuid', 'farm');
    expect(ex.message).toContain('bad-uuid');
    expect(ex).toBeInstanceOf(InvalidIdException);
  });
});
