import { UpdatePlotCommand } from './update-plot.command';
import { UpdatePlotCommandHandler } from './update-plot.command-handler';
import { PlotsRepository } from '../../ports/plots.repository';
import { PlotsCacheRepository } from '../../ports/plots-cache.repository';
import { PlotEntity } from '../../../domain/entities/plot.entity';
import { PlotNotFoundException } from '../../../domain/exceptions/plot-not-found/plot-not-found.exception';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';

describe('UpdatePlotCommandHandler', () => {
  let handler: UpdatePlotCommandHandler;
  let plotsRepository: jest.Mocked<PlotsRepository>;
  let plotsCacheRepository: jest.Mocked<PlotsCacheRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;

  beforeEach(() => {
    plotsRepository = { findById: jest.fn(), update: jest.fn() } as any;
    plotsCacheRepository = { set: jest.fn() } as any;
    nestjsEventBus = { publish: jest.fn() } as any;
    handler = new UpdatePlotCommandHandler(
      plotsRepository,
      plotsCacheRepository,
      nestjsEventBus,
    );
  });

  it('should update, save, cache, and publish events for a farm', async () => {
    const command = new UpdatePlotCommand({ id: 'id', name: 'Updated' });
    const updatedPlot = {
      pullDomainEvents: jest.fn().mockReturnValue(['event']),
      id: { value: 'id' },
    } as any as PlotEntity;
    const plot = {
      update: jest.fn().mockReturnValue(updatedPlot),
    } as any as PlotEntity;
    plotsRepository.findById.mockResolvedValue(plot);
    await handler.execute(command);
    expect(plotsRepository.findById).toHaveBeenCalledWith('id');
    expect(plot.update).toHaveBeenCalledWith({
      name: 'Updated',
      description: undefined,
      status: undefined,
      soilType: undefined,
      soilPh: undefined,
      width: undefined,
      length: undefined,
      height: undefined,
      unitMeasurement: undefined,
    });
    expect(plotsRepository.update).toHaveBeenCalledWith(updatedPlot);
    expect(plotsCacheRepository.set).toHaveBeenCalledWith('id', updatedPlot);
    expect(nestjsEventBus.publish).toHaveBeenCalledWith('event');
  });

  it('should throw if plot does not exist', async () => {
    plotsRepository.findById.mockResolvedValue(null);
    const command = new UpdatePlotCommand({ id: 'id', name: 'Updated' });
    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      PlotNotFoundException,
    );
  });
});
