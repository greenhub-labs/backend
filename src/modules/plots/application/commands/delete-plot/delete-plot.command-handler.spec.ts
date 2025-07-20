import { DeletePlotCommandHandler } from './delete-plot.command-handler';
import { DeletePlotCommand } from './delete-plot.command';
import { PlotsRepository } from '../../ports/plots.repository';
import { PlotsCacheRepository } from '../../ports/plots-cache.repository';
import { PlotNotFoundException } from '../../../domain/exceptions/plot-not-found/plot-not-found.exception';
import { PlotEntity } from '../../../domain/entities/plot.entity';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { PlotIdValueObject } from 'src/modules/plots/domain/value-objects/plot-id/plot-id.value-object';
import { PlotNameValueObject } from 'src/modules/plots/domain/value-objects/plot-name/plot-name.value-object';
import { PlotStatusValueObject } from 'src/modules/plots/domain/value-objects/plot-status/plot-status.value-object';
import { PlotDimensionsValueObject } from 'src/modules/plots/domain/value-objects/plot-dimension/plot-dimension.value-object';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';

describe('DeletePlotCommandHandler', () => {
  let handler: DeletePlotCommandHandler;
  let plotsRepository: jest.Mocked<PlotsRepository>;
  let plotsCacheRepository: jest.Mocked<PlotsCacheRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;

  beforeEach(() => {
    plotsRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      // ...other methods not used
    } as any;
    plotsCacheRepository = {
      remove: jest.fn(),
      // ...other methods not used
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
    plotsRepository.update.mockResolvedValue(undefined);
    plotsCacheRepository.remove.mockResolvedValue(undefined);
    nestjsEventBus.publish.mockResolvedValue(undefined);

    await handler.execute(new DeletePlotCommand(plotId));

    expect(plotsRepository.findById).toHaveBeenCalledWith(plotId);
    expect(plotsRepository.update).toHaveBeenCalled();
    expect(plotsCacheRepository.remove).toHaveBeenCalledWith(plotId);
    expect(nestjsEventBus.publish).toHaveBeenCalled();
  });

  it('should throw PlotNotFoundException if plot does not exist', async () => {
    plotsRepository.findById.mockResolvedValue(null);
    await expect(
      handler.execute(new DeletePlotCommand('not-found')),
    ).rejects.toBeInstanceOf(PlotNotFoundException);
  });
});
