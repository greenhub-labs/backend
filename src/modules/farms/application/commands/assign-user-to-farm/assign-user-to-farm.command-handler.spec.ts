import { AssignUserToFarmCommandHandler } from './assign-user-to-farm.command-handler';
import { AssignUserToFarmCommand } from './assign-user-to-farm.command';
import { FarmsRepository } from '../../ports/farms.repository';
import { FarmAggregate } from '../../../domain/aggregates/farm.aggregate';
import { FarmIdValueObject } from '../../../domain/value-objects/farm-id/farm-id.value-object';
import { FarmNameValueObject } from 'src/modules/farms/domain/value-objects/farm-name/farm-name.value-object';
import { FarmAddressValueObject } from 'src/modules/farms/domain/value-objects/farm-address/farm-address.value-object';
import { FarmCoordinatesValueObject } from 'src/modules/farms/domain/value-objects/farm-coordinates/farm-coordinates.value-object';
import { FARM_MEMBERSHIP_ROLES } from 'src/shared/domain/constants/farm-membership-roles.constant';

describe('AssignUserToFarmCommandHandler', () => {
  let handler: AssignUserToFarmCommandHandler;
  let farmsRepository: jest.Mocked<FarmsRepository>;

  beforeEach(() => {
    farmsRepository = {
      findById: jest.fn(),
      assignUserToFarm: jest.fn(),
    } as any;
    handler = new AssignUserToFarmCommandHandler(farmsRepository);
  });

  it('should assign a user to a farm with the correct role', async () => {
    const farmId = 'farm-uuid';
    const userId = 'user-uuid';
    const command = new AssignUserToFarmCommand(
      farmId,
      userId,
      FARM_MEMBERSHIP_ROLES.OWNER,
    );
    const farmAggregate = new FarmAggregate({
      id: new FarmIdValueObject(farmId),
      name: new FarmNameValueObject('Test Farm'),
      address: new FarmAddressValueObject({
        country: '',
        state: '',
        city: '',
        postalCode: '',
        street: '',
      }),
      coordinates: new FarmCoordinatesValueObject({
        latitude: 0,
        longitude: 0,
      }),
    });
    farmsRepository.findById.mockResolvedValue(farmAggregate);
    await handler.execute(command);
    expect(farmsRepository.findById).toHaveBeenCalledWith(
      new FarmIdValueObject(farmId),
    );
    expect(farmsRepository.assignUserToFarm).toHaveBeenCalledWith(
      farmId,
      userId,
      'OWNER',
    );
  });
});
