import { DeleteFarmCommandHandler } from './delete-farm.command-handler';
import { DeleteFarmCommand } from './delete-farm.command';
import { FarmsRepositoryPort } from '../../ports/farms.repository';
import { FarmsCacheRepository } from '../../ports/farms-cache.repository';
import { EventBusServicePort } from '../../ports/event-bus.service';
import { FarmNotFoundException } from '../../../domain/exceptions/farm-not-found/farm-not-found.exception';
import { FarmEntity } from '../../../domain/entities/farm.entity';
import { FarmIdValueObject } from '../../../domain/value-objects/farm-id/farm-id.value-object';
import { FarmNameValueObject } from '../../../domain/value-objects/farm-name/farm-name.value-object';
import { FarmAddressValueObject } from '../../../domain/value-objects/farm-address/farm-address.value-object';
import { FarmCoordinatesValueObject } from '../../../domain/value-objects/farm-coordinates/farm-coordinates.value-object';

describe('DeleteFarmCommandHandler', () => {
  let handler: DeleteFarmCommandHandler;
  let farmsRepository: jest.Mocked<FarmsRepositoryPort>;
  let farmsCacheRepository: jest.Mocked<FarmsCacheRepository>;
  let eventBus: jest.Mocked<EventBusServicePort>;

  beforeEach(() => {
    farmsRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      // ...other methods not used
    } as any;
    farmsCacheRepository = {
      remove: jest.fn(),
      // ...other methods not used
    } as any;
    eventBus = {
      publish: jest.fn(),
    } as any;
    handler = new DeleteFarmCommandHandler(
      farmsRepository,
      farmsCacheRepository,
      eventBus,
    );
  });

  it('should delete a farm and publish event', async () => {
    const farmId = 'farm-123';
    const farm = new FarmEntity({
      id: new FarmIdValueObject(farmId),
      name: new FarmNameValueObject({ value: 'Test Farm' }),
      address: new FarmAddressValueObject({
        country: 'ES',
        state: 'Madrid',
        city: 'Madrid',
        postalCode: '28001',
        street: 'Calle Falsa 123',
      }),
      coordinates: new FarmCoordinatesValueObject({
        latitude: 1,
        longitude: 2,
      }),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    farmsRepository.findById.mockResolvedValue(farm);
    farmsRepository.update.mockResolvedValue(undefined);
    farmsCacheRepository.remove.mockResolvedValue(undefined);
    eventBus.publish.mockResolvedValue(undefined);

    await handler.execute(new DeleteFarmCommand(farmId));

    expect(farmsRepository.findById).toHaveBeenCalledWith(farmId);
    expect(farmsRepository.update).toHaveBeenCalled();
    expect(farmsCacheRepository.remove).toHaveBeenCalledWith(farmId);
    expect(eventBus.publish).toHaveBeenCalled();
  });

  it('should throw FarmNotFoundException if farm does not exist', async () => {
    farmsRepository.findById.mockResolvedValue(null);
    await expect(
      handler.execute(new DeleteFarmCommand('not-found')),
    ).rejects.toBeInstanceOf(FarmNotFoundException);
  });
});
