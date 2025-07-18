import { QueryBus } from '@nestjs/cqrs';
import { PlotEntity } from 'src/modules/plots/domain/entities/plot.entity';
import { FarmAggregate } from '../../../domain/aggregates/farm.aggregate';
import { FarmAddressValueObject } from '../../../domain/value-objects/farm-address/farm-address.value-object';
import { FarmCoordinatesValueObject } from '../../../domain/value-objects/farm-coordinates/farm-coordinates.value-object';
import { FarmIdValueObject } from '../../../domain/value-objects/farm-id/farm-id.value-object';
import { FarmNameValueObject } from '../../../domain/value-objects/farm-name/farm-name.value-object';
import { FarmMembershipsRepository } from '../../ports/farm-memberships.repository';
import { FarmsRepository } from '../../ports/farms.repository';
import { AssignPlotToFarmCommand } from './assign-plot-to-farm.command';
import { AssignPlotToFarmCommandHandler } from './assign-plot-to-farm.command-handler';

describe('AssignPlotToFarmCommandHandler', () => {
  let handler: AssignPlotToFarmCommandHandler;
  let farmsRepository: jest.Mocked<FarmsRepository>;
  let queryBus: jest.Mocked<QueryBus>;
  let farmMembershipsRepository: jest.Mocked<FarmMembershipsRepository>;

  beforeEach(() => {
    farmsRepository = {
      findById: jest.fn(),
    } as any;
    queryBus = {
      execute: jest.fn(),
    } as any;
    farmMembershipsRepository = {
      getUsersByFarmId: jest.fn(),
    } as any;
    handler = new AssignPlotToFarmCommandHandler(
      farmsRepository,
      farmMembershipsRepository,
      queryBus,
    );
  });

  it('should assign a plot to a farm successfully', async () => {
    const farmId = 'farm-uuid';
    const plotId = 'plot-uuid';
    const command = new AssignPlotToFarmCommand(farmId, plotId);

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

    const plot = {
      id: { value: plotId },
      name: { value: 'Test Plot' },
    } as any as PlotEntity;

    const members = [
      {
        user: {
          id: 'user-1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          isActive: true,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        } as any,
        role: 'OWNER',
      },
    ] as any;

    farmsRepository.findById.mockResolvedValue(farmAggregate);
    queryBus.execute.mockResolvedValue(plot);
    farmMembershipsRepository.getUsersByFarmId.mockResolvedValue(members);

    const result = await handler.execute(command);

    expect(farmsRepository.findById).toHaveBeenCalledWith(farmId);
    expect(queryBus.execute).toHaveBeenCalled();
    expect(farmMembershipsRepository.getUsersByFarmId).toHaveBeenCalledWith(
      farmId,
    );
    expect(result).toBeDefined();
  });

  it('should throw error if farm not found', async () => {
    const command = new AssignPlotToFarmCommand('farm-uuid', 'plot-uuid');
    farmsRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow('Farm not found');
  });

  it('should throw error if plot not found', async () => {
    const command = new AssignPlotToFarmCommand('farm-uuid', 'plot-uuid');
    const farmAggregate = new FarmAggregate({
      id: new FarmIdValueObject('farm-uuid'),
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
    queryBus.execute.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow('Plot not found');
  });
});
