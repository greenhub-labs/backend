import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdatePlotCommand } from './update-plot.command';
import {
  PLOTS_REPOSITORY_TOKEN,
  PlotsRepository,
} from '../../ports/plots.repository';
import {
  PLOTS_CACHE_REPOSITORY_TOKEN,
  PlotsCacheRepository,
} from '../../ports/plots-cache.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { PlotDetailsResult } from '../../dtos/plot-details.result';
import { PlotNotFoundException } from '../../../domain/exceptions/plot-not-found/plot-not-found.exception';

/**
 * Command handler for UpdateFarmCommand
 */
@CommandHandler(UpdatePlotCommand)
export class UpdatePlotCommandHandler
  implements ICommandHandler<UpdatePlotCommand>
{
  constructor(
    @Inject(PLOTS_REPOSITORY_TOKEN)
    private readonly plotsRepository: PlotsRepository,
    @Inject(PLOTS_CACHE_REPOSITORY_TOKEN)
    private readonly plotsCacheRepository: PlotsCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
  ) {}

  /**
   * Handles the UpdateFarmCommand
   * @param command - The command to handle
   */
  async execute(command: UpdatePlotCommand): Promise<PlotDetailsResult> {
    // 1. Find the plot by ID
    const plot = await this.plotsRepository.findById(command.id);
    if (!plot) {
      throw new PlotNotFoundException();
    }
    // 2. Update the farm entity
    const updatedPlot = plot.update({
      name: command.name,
      description: command.description,
      status: command.status,
      soilType: command.soilType,
      soilPh: command.soilPh,
      width: command.width,
      length: command.length,
      height: command.height,
      unitMeasurement: command.unitMeasurement,
    });
    // 3. Persist the updated farm
    await this.plotsRepository.update(updatedPlot);
    // 4. Update the cache
    await this.plotsCacheRepository.set(updatedPlot.id.value, updatedPlot);
    // 5. Publish domain events
    for (const event of updatedPlot.pullDomainEvents()) {
      await this.nestjsEventBus.publish(event);
    }
    return new PlotDetailsResult(updatedPlot);
  }
}
