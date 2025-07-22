import { QueryBus } from '@nestjs/cqrs';
import { PlotEntity } from '../../../domain/entities/plot.entity';
import { PlotFactory } from '../../../domain/factories/plot.factory';
import { PlotsCacheRepository } from '../../ports/plots-cache.repository';
import { PlotsRepository } from '../../ports/plots.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { CreatePlotCommand } from './create-plot.command';
import { CreatePlotCommandHandler } from './create-plot.command-handler';

describe('CreatePlotCommandHandler', () => {
  let handler: CreatePlotCommandHandler;
  let plotsRepository: jest.Mocked<PlotsRepository>;
  let plotsCacheRepository: jest.Mocked<PlotsCacheRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;
  let plotFactory: jest.Mocked<PlotFactory>;
  let queryBus: jest.Mocked<QueryBus>;
  beforeEach(() => {
    plotsRepository = { save: jest.fn() } as any;
    plotsCacheRepository = { set: jest.fn() } as any;
    nestjsEventBus = { publish: jest.fn() } as any;
    plotFactory = { create: jest.fn() } as any;
    queryBus = {
      execute: jest.fn().mockResolvedValue({ id: 'farmId' }),
    } as any;
    handler = new CreatePlotCommandHandler(
      plotsRepository,
      plotsCacheRepository,
      nestjsEventBus,
      plotFactory,
      queryBus,
    );
  });

  it('should create, save, and publish events for a plot', async () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const command = new CreatePlotCommand({
      name: 'Plot',
      farmId: 'farmId',
    });
    const plot = {
      id: { value: uuid },
      pullDomainEvents: jest.fn().mockReturnValue(['event']),
    } as any as PlotEntity;
    plotFactory.create.mockReturnValue(plot);
    await handler.execute(command);
    expect(plotFactory.create).toHaveBeenCalledWith({
      name: 'Plot',
      description: undefined,
      status: undefined,
      soilType: undefined,
      soilPh: undefined,
      width: undefined,
      length: undefined,
      height: undefined,
      unitMeasurement: undefined,
      farmId: 'farmId',
    });
    expect(plotsRepository.save).toHaveBeenCalledWith(plot);
    expect(nestjsEventBus.publish).toHaveBeenCalledWith('event');
  });
});
