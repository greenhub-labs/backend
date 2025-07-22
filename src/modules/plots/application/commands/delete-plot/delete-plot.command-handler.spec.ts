import { PLOT_SOIL_TYPES } from 'src/modules/plots/domain/constants/plot-soil-types.constant';
import { PLOT_STATUS } from 'src/modules/plots/domain/constants/plot-status.constant';
import { PlotDimensionValueObject } from 'src/modules/plots/domain/value-objects/plot-dimension/plot-dimension.value-object';
import { PlotIdValueObject } from 'src/modules/plots/domain/value-objects/plot-id/plot-id.value-object';
import { PlotNameValueObject } from 'src/modules/plots/domain/value-objects/plot-name/plot-name.value-object';
import { PlotSoilTypeValueObject } from 'src/modules/plots/domain/value-objects/plot-soil-type/plot-soil-type.value-object';
import { PlotStatusValueObject } from 'src/modules/plots/domain/value-objects/plot-status/plot-status.value-object';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { PlotEntity } from '../../../domain/entities/plot.entity';
import { PlotNotFoundException } from '../../../domain/exceptions/plot-not-found/plot-not-found.exception';
import { PlotsCacheRepository } from '../../ports/plots-cache.repository';
import { PlotsRepository } from '../../ports/plots.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { DeletePlotCommand } from './delete-plot.command';
import { DeletePlotCommandHandler } from './delete-plot.command-handler';

describe('DeletePlotCommandHandler', () => {
  let handler: DeletePlotCommandHandler;
  let plotsRepository: jest.Mocked<PlotsRepository>;
  let plotsCacheRepository: jest.Mocked<PlotsCacheRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;

  beforeEach(() => {
    plotsRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;
    plotsCacheRepository = {
      remove: jest.fn(),
    } as any;
    nestjsEventBus = {
      publish: jest.fn(),
    } as any;
    handler = new DeletePlotCommandHandler(
      plotsRepository,
      plotsCacheRepository,
      nestjsEventBus,
    );
  });

  it('should delete a plot and publish event', async () => {
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
    plotsRepository.update.mockResolvedValue(undefined);
    plotsCacheRepository.remove.mockResolvedValue(undefined);
    nestjsEventBus.publish.mockResolvedValue(undefined);

    await handler.execute(new DeletePlotCommand(uuid));

    expect(plotsRepository.findById).toHaveBeenCalledWith(uuid);
    expect(plotsRepository.update).toHaveBeenCalled();
    expect(plotsCacheRepository.remove).toHaveBeenCalledWith(uuid);
    expect(nestjsEventBus.publish).toHaveBeenCalled();
  });

  it('should throw PlotNotFoundException if plot does not exist', async () => {
    plotsRepository.findById.mockResolvedValue(null);
    await expect(
      handler.execute(new DeletePlotCommand('not-found')),
    ).rejects.toBeInstanceOf(PlotNotFoundException);
  });
});
