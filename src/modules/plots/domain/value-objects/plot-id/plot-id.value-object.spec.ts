import { PlotIdValueObject } from './plot-id.value-object';

describe('PlotIdValueObject', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';
  const anotherUuid = '123e4567-e89b-12d3-a456-426614174001';

  it('should create with valid UUID', () => {
    const vo = new PlotIdValueObject(validUuid);
    expect(vo.value).toBe(validUuid);
  });

  it('should throw exception with invalid UUID', () => {
    expect(() => new PlotIdValueObject('invalid-uuid')).toThrow('Invalid UUID');
  });

  it('should be equal to another with same value', () => {
    const vo1 = new PlotIdValueObject(validUuid);
    const vo2 = new PlotIdValueObject(validUuid);
    expect(vo1.equals(vo2)).toBe(true);
  });

  it('should not be equal to another with different value', () => {
    const vo1 = new PlotIdValueObject(validUuid);
    const vo2 = new PlotIdValueObject(anotherUuid);
    expect(vo1.equals(vo2)).toBe(false);
  });
});
