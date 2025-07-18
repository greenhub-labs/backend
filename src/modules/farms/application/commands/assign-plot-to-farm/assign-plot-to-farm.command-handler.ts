import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { GetPlotByIdQuery } from 'src/modules/plots/application/queries/get-plot-by-id/get-plot-by-id.query';
import { GetPlotsByFarmIdQuery } from 'src/modules/plots/application/queries/get-plots-by-farm-id/get-plots-by-farm-id.query';
import { FarmAggregate } from '../../../domain/aggregates/farm.aggregate';
import { FarmDetailsResult } from '../../dtos/farm-details.result';
import { FarmMembershipsRepository } from '../../ports/farm-memberships.repository';
import {
  FARMS_REPOSITORY_TOKEN,
  FarmsRepository,
} from '../../ports/farms.repository';
import { AssignPlotToFarmCommand } from './assign-plot-to-farm.command';

/**
 * Command handler for assigning a plot to a farm.
 */
@CommandHandler(AssignPlotToFarmCommand)
export class AssignPlotToFarmCommandHandler
  implements ICommandHandler<AssignPlotToFarmCommand>
{
  constructor(
    @Inject(FARMS_REPOSITORY_TOKEN)
    private readonly farmsRepository: FarmsRepository,
    @Inject('FARM_MEMBERSHIPS_REPOSITORY_TOKEN')
    private readonly farmMembershipsRepository: FarmMembershipsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Executes the command to assign a plot to a farm.
   * @param command - AssignPlotToFarmCommand
   */
  async execute(command: AssignPlotToFarmCommand): Promise<FarmDetailsResult> {
    // 1. Get the farm
    const farm = await this.farmsRepository.findById(command.farmId);
    if (!farm) {
      throw new Error('Farm not found');
    }

    // 2. Get the plot using QueryBus
    const plot = await this.queryBus.execute(
      new GetPlotByIdQuery(command.plotId),
    );
    if (!plot) {
      throw new Error('Plot not found');
    }

    // 3. Create farm aggregate and assign the plot
    const farmAggregate = FarmAggregate.fromPrimitives(farm.toPrimitives());
    farmAggregate.addPlot(plot);

    // 4. Get the members of the farm
    const members = await this.farmMembershipsRepository.getUsersByFarmId(
      command.farmId,
    );

    // 5. Get the plots of the farm
    const plots = await this.queryBus.execute(
      new GetPlotsByFarmIdQuery(command.farmId),
    );

    return new FarmDetailsResult(farmAggregate, members, plots);
  }
}
