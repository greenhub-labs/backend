import { GetAllPlotsQueryHandler } from './get-all-plots.query-handler';
import { GetAllPlotsQuery } from './get-all-plots.query';
import { PlotsRepository } from '../../ports/plots.repository';
import { PlotEntity } from '../../../domain/entities/plot.entity';
import { PlotIdValueObject } from '../../../domain/value-objects/plot-id/plot-id.value-object';
import { PlotNameValueObject } from '../../../domain/value-objects/plot-name/plot-name.value-object';
import { PlotsCacheRepository } from '../../ports/plots-cache.repository';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { PlotDimensionsValueObject } from 'src/modules/plots/domain/value-objects/plot-dimension/plot-dimension.value-object';
import { PlotStatusValueObject } from 'src/modules/plots/domain/value-objects/plot-status/plot-status.value-object';

describe('GetAllPlotsQueryHandler', () => {
  let handler: GetAllPlotsQueryHandler;
  let plotsRepository: jest.Mocked<PlotsRepository>;
  let plotsCacheRepository: jest.Mocked<PlotsCacheRepository>;
  beforeEach(() => {
    plotsRepository = {
      findAll: jest.fn(),
    } as any;
    plotsCacheRepository = {
      get: jest.fn(),
    } as any;
    handler = new GetAllPlotsQueryHandler(
      plotsRepository,
      plotsCacheRepository,
    );
  });

  it('should return an array of plots', async () => {
    const plot = new PlotEntity({
      id: new PlotIdValueObject('plot-123'),
      name: new PlotNameValueObject('Test Plot'),
      status: new PlotStatusValueObject('active'),
      soilType: 'soil',
      soilPh: 7,
      dimensions: new PlotDimensionsValueObject(
        10,
        20,
        1,
        UNIT_MEASUREMENT.METRIC,
      ),
      farmId: 'farm-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    plotsRepository.findAll.mockResolvedValue([plot]);
    const result = await handler.execute(new GetAllPlotsQuery());
    expect(result).toEqual([plot]);
    expect(plotsRepository.findAll).toHaveBeenCalled();
  });

  it('should return an empty array if no plots exist', async () => {
    plotsRepository.findAll.mockResolvedValue([]);
    const result = await handler.execute(new GetAllPlotsQuery());
    expect(result).toEqual([]);
    expect(plotsRepository.findAll).toHaveBeenCalled();
  });
});
