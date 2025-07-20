import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeletePlotCommand } from './delete-plot.command';
import {
  PlotsRepository,
  PLOTS_REPOSITORY_TOKEN,
} from '../../ports/plots.repository';
import {
  PLOTS_CACHE_REPOSITORY_TOKEN,
  PlotsCacheRepository,
} from '../../ports/plots-cache.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { PlotNotFoundException } from '../../../domain/exceptions/plot-not-found/plot-not-found.exception';

/**
 * Command handler for DeletePlotCommand
 */
@CommandHandler(DeletePlotCommand)
export class DeletePlotCommandHandler
  implements ICommandHandler<DeletePlotCommand>
{
  constructor(
    @Inject(PLOTS_REPOSITORY_TOKEN)
    private readonly plotsRepository: PlotsRepository,
    @Inject(PLOTS_CACHE_REPOSITORY_TOKEN)
    private readonly plotsCacheRepository: PlotsCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
  ) {}

  /**
   * Handles the DeleteFarmCommand
   * @param command - The command to handle
   */
  async execute(command: DeletePlotCommand): Promise<boolean> {
    // 1. Find the plot by ID
    const plot = await this.plotsRepository.findById(command.plotId);
    if (!plot) {
      throw new PlotNotFoundException(command.plotId);
    }
    // 2. Mark as deleted (soft delete) and persist
    const deletedPlot = plot.delete();
    await this.plotsRepository.update(deletedPlot);
    // 3. Remove from cache
    await this.plotsCacheRepository.remove(deletedPlot.id.value);
    // 4. Publish domain events
    for (const event of deletedPlot.pullDomainEvents()) {
      await this.nestjsEventBus.publish(event);
    }
    return true;
  }
}
