import { PLOT_SOIL_TYPES } from '../../constants/plot-soil-types.constant';
import { InvalidPlotSoilTypeException } from '../../exceptions/invalid-plot-soil-type/invalid-plot-soil-type.exception';
import { PlotSoilTypeValueObject } from './plot-soil-type.value-object';

describe('PlotSoilTypeValueObject', () => {
  it('should create a valid soil type', () => {
    const value = PLOT_SOIL_TYPES.SANDY;
    const vo = new PlotSoilTypeValueObject(value);
    expect(vo.value).toBe(value);
  });

  it('should throw if soil type is empty', () => {
    expect(() => new PlotSoilTypeValueObject('')).toThrow(
      InvalidPlotSoilTypeException,
    );
  });

  it('should throw if soil type is not valid', () => {
    expect(() => new PlotSoilTypeValueObject('INVALID')).toThrow(
      InvalidPlotSoilTypeException,
    );
  });

  it('should allow all valid enum values', () => {
    Object.values(PLOT_SOIL_TYPES).forEach((type) => {
      expect(new PlotSoilTypeValueObject(type).value).toBe(type);
    });
  });
});
