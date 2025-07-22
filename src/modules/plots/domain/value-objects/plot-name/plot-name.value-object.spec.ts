import { InvalidPlotNameException } from '../../exceptions/invalid-plot-name/invalid-plot-name.exception';
import { PlotNameValueObject } from './plot-name.value-object';

describe('PlotNameValueObject', () => {
  it('should create a valid plot name', () => {
    const value = 'My Plot';
    const vo = new PlotNameValueObject(value);
    expect(vo.value).toBe(value);
  });

  it('should throw if name is empty', () => {
    expect(() => new PlotNameValueObject('')).toThrow(InvalidPlotNameException);
  });

  it('should throw if name exceeds 100 characters', () => {
    const longName = 'a'.repeat(101);
    expect(() => new PlotNameValueObject(longName)).toThrow(
      InvalidPlotNameException,
    );
  });

  it('should allow name with exactly 100 characters', () => {
    const name = 'a'.repeat(100);
    expect(new PlotNameValueObject(name).value).toBe(name);
  });
});
