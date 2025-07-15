import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { CreateFarmCommand } from './create-farm.command';
import {
  FarmsRepository,
  FARMS_REPOSITORY_TOKEN,
} from '../../ports/farms.repository';
import { EventBus } from '../../ports/event-bus.service';
import { FarmFactory } from '../../../domain/factories/farm.factory';
import {
  FARMS_CACHE_REPOSITORY_TOKEN,
  FarmsCacheRepository,
} from '../../ports/farms-cache.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { FarmEntity } from 'src/modules/farms/domain/entities/farm.entity';
import { FarmMembershipsRepository } from '../../ports/farm-memberships.repository';
import { FARM_MEMBERSHIP_ROLES } from 'src/shared/domain/constants/farm-membership-roles.constant';
import { FarmDetailsResult } from '../../dtos/farm-details.result';
import { GetUserByIdQuery } from 'src/modules/users/application/queries/get-user-by-id/get-user-by-id.query';

/**
 * Command handler for CreateFarmCommand
 */
@CommandHandler(CreateFarmCommand)
export class CreateFarmCommandHandler
  implements ICommandHandler<CreateFarmCommand>
{
  private readonly logger = new Logger(CreateFarmCommandHandler.name);
  constructor(
    @Inject(FARMS_REPOSITORY_TOKEN)
    private readonly farmsRepository: FarmsRepository,
    @Inject(FARMS_CACHE_REPOSITORY_TOKEN)
    private readonly farmsCacheRepository: FarmsCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
    private readonly farmFactory: FarmFactory,
    @Inject('FARM_MEMBERSHIPS_REPOSITORY_TOKEN')
    private readonly farmMembershipsRepository: FarmMembershipsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the CreateFarmCommand
   * @param command - The command to handle
   */
  async execute(command: CreateFarmCommand): Promise<FarmDetailsResult> {
    this.logger.debug('Executing create farm command');
    this.logger.debug(JSON.stringify(command));

    // 1. Check if the user exists using QueryBus
    const user = await this.queryBus.execute(
      new GetUserByIdQuery(command.userId),
    );

    if (!user) {
      throw new Error(`User with id ${command.userId} not found`);
    }

    // 2. Create the farm
    const farm = this.farmFactory.create({
      name: command.name,
      description: command.description,
      country: command.country,
      state: command.state,
      city: command.city,
      postalCode: command.postalCode,
      street: command.street,
      latitude: command.latitude,
      longitude: command.longitude,
      isActive: command.isActive,
    });

    await this.farmsRepository.save(farm);
    await this.farmsCacheRepository.set(farm.id.value, farm);

    // 3. Assign the user as OWNER
    await this.farmMembershipsRepository.assignUserToFarm(
      farm.id.value,
      command.userId,
      FARM_MEMBERSHIP_ROLES.OWNER,
    );

    // 4. Publish domain events
    for (const event of farm.pullDomainEvents()) {
      await this.nestjsEventBus.publish(event);
    }

    // 5. Get the members of the farm
    const members = await this.farmMembershipsRepository.getUsersByFarmId(
      farm.id.value,
    );
    return new FarmDetailsResult(farm, members);
  }
}
