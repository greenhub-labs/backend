import { PLOT_STATUS } from '../../constants/plot-status.constant';
import { InvalidPlotStatusException } from '../../exceptions/invalid-plot-status/invalid-plot-status.exception';
import { PlotStatusValueObject } from './plot-status.value-object';

describe('PlotStatusValueObject', () => {
  it('should create a valid status', () => {
    const value = PLOT_STATUS.ACTIVE;
    const vo = new PlotStatusValueObject(value);
    expect(vo.value).toBe(value);
  });

  it('should throw if status is empty', () => {
    expect(() => new PlotStatusValueObject('')).toThrow(
      InvalidPlotStatusException,
    );
  });

  it('should throw if status is not valid', () => {
    expect(() => new PlotStatusValueObject('INVALID')).toThrow(
      InvalidPlotStatusException,
    );
  });

  it('should allow all valid enum values', () => {
    Object.values(PLOT_STATUS).forEach((status) => {
      expect(new PlotStatusValueObject(status).value).toBe(status);
    });
  });
});
