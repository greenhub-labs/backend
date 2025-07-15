import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AssignUserToFarmCommand } from './assign-user-to-farm.command';
import { FarmsRepository } from '../../ports/farms.repository';
import { FARMS_REPOSITORY_TOKEN } from '../../ports/farms.repository';
import { FarmAggregate } from '../../../domain/aggregates/farm.aggregate';
import { FarmIdValueObject } from '../../../domain/value-objects/farm-id/farm-id.value-object';
import { UserIdValueObject } from 'src/modules/users/domain/value-objects/user-id/user-id.value-object';
import { FarmMembershipsRepository } from '../../ports/farm-memberships.repository';

/**
 * Command handler for assigning a user to a farm.
 */
@CommandHandler(AssignUserToFarmCommand)
export class AssignUserToFarmCommandHandler
  implements ICommandHandler<AssignUserToFarmCommand>
{
  constructor(
    @Inject(FARMS_REPOSITORY_TOKEN)
    private readonly farmsRepository: FarmsRepository,
    @Inject('FARM_MEMBERSHIPS_REPOSITORY_TOKEN')
    private readonly farmMembershipsRepository: FarmMembershipsRepository,
  ) {}

  /**
   * Executes the command to assign a user to a farm.
   * @param command - AssignUserToFarmCommand
   */
  async execute(command: AssignUserToFarmCommand): Promise<FarmAggregate> {
    const farmId = new FarmIdValueObject(command.farmId);
    const userId = new UserIdValueObject(command.userId);
    const farm = await this.farmsRepository.findById(farmId.value);
    if (!farm) {
      throw new Error('Farm not found');
    }
    const farmAggregate = FarmAggregate.fromPrimitives(farm.toPrimitives());
    farmAggregate.assignUser(userId.value, command.role);
    await this.farmsRepository.assignUserToFarm(
      farmId.value,
      userId.value,
      command.role,
    );
    // Obtener los miembros actualizados y poblar el aggregate
    const members = await this.farmMembershipsRepository.getUsersByFarmId(
      farmId.value,
    );
    if (
      'setMembers' in farmAggregate &&
      typeof farmAggregate.setMembers === 'function'
    ) {
      (farmAggregate as any).setMembers(members);
    }
    return farmAggregate;
  }
}
