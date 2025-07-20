import { GetPlotByIdQueryHandler } from './get-plot-by-id.query-handler';
import { GetPlotByIdQuery } from './get-plot-by-id.query';
import { PlotsRepository } from '../../ports/plots.repository';
import { PlotNotFoundException } from '../../../domain/exceptions/plot-not-found/plot-not-found.exception';
import { PlotEntity } from '../../../domain/entities/plot.entity';
import { PlotIdValueObject } from '../../../domain/value-objects/plot-id/plot-id.value-object';
import { PlotNameValueObject } from '../../../domain/value-objects/plot-name/plot-name.value-object';
import { PlotsCacheRepository } from '../../ports/plots-cache.repository';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { PlotDimensionsValueObject } from 'src/modules/plots/domain/value-objects/plot-dimension/plot-dimension.value-object';
import { PlotStatusValueObject } from 'src/modules/plots/domain/value-objects/plot-status/plot-status.value-object';

describe('GetPlotByIdQueryHandler', () => {
  let handler: GetPlotByIdQueryHandler;
  let plotsRepository: jest.Mocked<PlotsRepository>;
  let plotsCacheRepository: jest.Mocked<PlotsCacheRepository>;
  beforeEach(() => {
    plotsRepository = {
      findById: jest.fn(),
    } as any;
    plotsCacheRepository = {
      get: jest.fn(),
    } as any;
    handler = new GetPlotByIdQueryHandler(
      plotsRepository,
      plotsCacheRepository,
    );
  });

  it('should return a plot if found', async () => {
    const plotId = 'plot-123';
    const plot = new PlotEntity({
      id: new PlotIdValueObject(plotId),
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
    plotsRepository.findById.mockResolvedValue(plot);
    const result = await handler.execute(new GetPlotByIdQuery(plotId));
    expect(result).toBe(plot);
    expect(plotsRepository.findById).toHaveBeenCalledWith(plotId);
  });

  it('should throw PlotNotFoundException if not found', async () => {
    plotsRepository.findById.mockResolvedValue(null);
    await expect(
      handler.execute(new GetPlotByIdQuery('not-found')),
    ).rejects.toBeInstanceOf(PlotNotFoundException);
  });
});
