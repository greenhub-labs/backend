import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { GetFarmByIdQuery } from 'src/modules/farms/application/queries/get-farm-by-id/get-farm-by-id.query';
import { PlotFactory } from '../../../domain/factories/plot.factory';
import { PlotDetailsResult } from '../../dtos/plot-details.result';
import {
  PLOTS_CACHE_REPOSITORY_TOKEN,
  PlotsCacheRepository,
} from '../../ports/plots-cache.repository';
import {
  PLOTS_REPOSITORY_TOKEN,
  PlotsRepository,
} from '../../ports/plots.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { CreatePlotCommand } from './create-plot.command';

/**
 * Command handler for CreatePlotCommand
 */
@CommandHandler(CreatePlotCommand)
export class CreatePlotCommandHandler
  implements ICommandHandler<CreatePlotCommand>
{
  private readonly logger = new Logger(CreatePlotCommandHandler.name);
  constructor(
    @Inject(PLOTS_REPOSITORY_TOKEN)
    private readonly plotsRepository: PlotsRepository,
    @Inject(PLOTS_CACHE_REPOSITORY_TOKEN)
    private readonly plotsCacheRepository: PlotsCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
    private readonly plotFactory: PlotFactory,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the CreatePlotCommand
   * @param command - The command to handle
   */
  async execute(command: CreatePlotCommand): Promise<PlotDetailsResult> {
    this.logger.debug('Executing create plot command');
    this.logger.debug(JSON.stringify(command));

    // 1. Check if the farm exists using QueryBus
    const farm = await this.queryBus.execute(
      new GetFarmByIdQuery(command.farmId),
    );

    if (!farm) {
      throw new Error(`Farm with id ${command.farmId} not found`);
    }

    // 2. Create the plot
    const plot = this.plotFactory.create({
      name: command.name,
      description: command.description,
      status: command.status,
      soilType: command.soilType,
      soilPh: command.soilPh,
      width: command.width,
      length: command.length,
      height: command.height,
      unitMeasurement: command.unitMeasurement,
      farmId: command.farmId,
    });

    await this.plotsRepository.save(plot);
    await this.plotsCacheRepository.set(plot.id.value, plot);

    // 3. Publish domain events
    for (const event of plot.pullDomainEvents()) {
      await this.nestjsEventBus.publish(event);
    }

    return new PlotDetailsResult(plot);
  }
}
