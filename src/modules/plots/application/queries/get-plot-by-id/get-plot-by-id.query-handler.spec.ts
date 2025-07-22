import { QueryBus } from '@nestjs/cqrs';
import { PLOT_SOIL_TYPES } from 'src/modules/plots/domain/constants/plot-soil-types.constant';
import { PLOT_STATUS } from 'src/modules/plots/domain/constants/plot-status.constant';
import { PlotDimensionValueObject } from 'src/modules/plots/domain/value-objects/plot-dimension/plot-dimension.value-object';
import { PlotSoilTypeValueObject } from 'src/modules/plots/domain/value-objects/plot-soil-type/plot-soil-type.value-object';
import { PlotStatusValueObject } from 'src/modules/plots/domain/value-objects/plot-status/plot-status.value-object';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { PlotEntity } from '../../../domain/entities/plot.entity';
import { PlotNotFoundException } from '../../../domain/exceptions/plot-not-found/plot-not-found.exception';
import { PlotIdValueObject } from '../../../domain/value-objects/plot-id/plot-id.value-object';
import { PlotNameValueObject } from '../../../domain/value-objects/plot-name/plot-name.value-object';
import { PlotDetailsResult } from '../../dtos/plot-details.result';
import { PlotsCacheRepository } from '../../ports/plots-cache.repository';
import { PlotsRepository } from '../../ports/plots.repository';
import { GetPlotByIdQuery } from './get-plot-by-id.query';
import { GetPlotByIdQueryHandler } from './get-plot-by-id.query-handler';

describe('GetPlotByIdQueryHandler', () => {
  let handler: GetPlotByIdQueryHandler;
  let plotsRepository: jest.Mocked<PlotsRepository>;
  let plotsCacheRepository: jest.Mocked<PlotsCacheRepository>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(() => {
    plotsRepository = {
      findById: jest.fn(),
    } as any;
    plotsCacheRepository = {
      get: jest.fn(),
      set: jest.fn(),
    } as any;
    queryBus = {
      execute: jest.fn(),
    } as any;
    handler = new GetPlotByIdQueryHandler(
      plotsRepository,
      plotsCacheRepository,
      queryBus,
    );
  });

  it('should return a plot if found', async () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const plot = new PlotEntity({
      id: new PlotIdValueObject(uuid),
      name: new PlotNameValueObject('Test Plot'),
      status: new PlotStatusValueObject(PLOT_STATUS.ACTIVE),
      soilType: new PlotSoilTypeValueObject(PLOT_SOIL_TYPES.SANDY),
      soilPh: 7,
      dimensions: new PlotDimensionValueObject(
        10,
        20,
        1,
        UNIT_MEASUREMENT.METERS,
      ),
      farmId: 'farm-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    plotsRepository.findById.mockResolvedValue(plot);
    queryBus.execute.mockResolvedValue([]); // Mock empty crops array

    const result = await handler.execute(new GetPlotByIdQuery(uuid));

    expect(result).toBeInstanceOf(PlotDetailsResult);
    expect(result.plot).toEqual(plot);
    expect(result.crops).toEqual([]);
    expect(plotsRepository.findById).toHaveBeenCalledWith(uuid);
  });

  it('should throw PlotNotFoundException if not found', async () => {
    plotsRepository.findById.mockResolvedValue(null);
    plotsCacheRepository.get.mockResolvedValue(null);

    await expect(
      handler.execute(new GetPlotByIdQuery('not-found')),
    ).rejects.toBeInstanceOf(PlotNotFoundException);
  });
});
