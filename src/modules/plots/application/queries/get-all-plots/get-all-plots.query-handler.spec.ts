import { QueryBus } from '@nestjs/cqrs';
import { PLOT_SOIL_TYPES } from 'src/modules/plots/domain/constants/plot-soil-types.constant';
import { PLOT_STATUS } from 'src/modules/plots/domain/constants/plot-status.constant';
import { PlotDimensionValueObject } from 'src/modules/plots/domain/value-objects/plot-dimension/plot-dimension.value-object';
import { PlotSoilTypeValueObject } from 'src/modules/plots/domain/value-objects/plot-soil-type/plot-soil-type.value-object';
import { PlotStatusValueObject } from 'src/modules/plots/domain/value-objects/plot-status/plot-status.value-object';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { PlotEntity } from '../../../domain/entities/plot.entity';
import { PlotIdValueObject } from '../../../domain/value-objects/plot-id/plot-id.value-object';
import { PlotNameValueObject } from '../../../domain/value-objects/plot-name/plot-name.value-object';
import { PlotDetailsResult } from '../../dtos/plot-details.result';
import { PlotsRepository } from '../../ports/plots.repository';
import { GetAllPlotsQuery } from './get-all-plots.query';
import { GetAllPlotsQueryHandler } from './get-all-plots.query-handler';

describe('GetAllPlotsQueryHandler', () => {
  let handler: GetAllPlotsQueryHandler;
  let plotsRepository: jest.Mocked<PlotsRepository>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(() => {
    plotsRepository = {
      findAll: jest.fn(),
    } as any;
    queryBus = {
      execute: jest.fn(),
    } as any;
    handler = new GetAllPlotsQueryHandler(
      plotsRepository,
      {} as any, // Mock cache repository
      queryBus,
    );
  });

  it('should return all plots', async () => {
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

    plotsRepository.findAll.mockResolvedValue([plot]);
    queryBus.execute.mockResolvedValue([]); // Mock empty crops array

    const result = await handler.execute(new GetAllPlotsQuery());

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(PlotDetailsResult);
    expect(result[0].plot).toEqual(plot);
    expect(result[0].crops).toEqual([]);
    expect(plotsRepository.findAll).toHaveBeenCalled();
  });
});
