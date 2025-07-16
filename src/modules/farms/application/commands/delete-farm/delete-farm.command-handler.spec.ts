import { DeleteFarmCommandHandler } from './delete-farm.command-handler';
import { DeleteFarmCommand } from './delete-farm.command';
import { FarmsRepository } from '../../ports/farms.repository';
import { FarmsCacheRepository } from '../../ports/farms-cache.repository';
import { FarmNotFoundException } from '../../../domain/exceptions/farm-not-found/farm-not-found.exception';
import { FarmEntity } from '../../../domain/entities/farm.entity';
import { FarmIdValueObject } from '../../../domain/value-objects/farm-id/farm-id.value-object';
import { FarmNameValueObject } from '../../../domain/value-objects/farm-name/farm-name.value-object';
import { FarmAddressValueObject } from '../../../domain/value-objects/farm-address/farm-address.value-object';
import { FarmCoordinatesValueObject } from '../../../domain/value-objects/farm-coordinates/farm-coordinates.value-object';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';

describe('DeleteFarmCommandHandler', () => {
  let handler: DeleteFarmCommandHandler;
  let farmsRepository: jest.Mocked<FarmsRepository>;
  let farmsCacheRepository: jest.Mocked<FarmsCacheRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;

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
    nestjsEventBus = {
      publish: jest.fn(),
    } as any;
    handler = new DeleteFarmCommandHandler(
      farmsRepository,
      farmsCacheRepository,
      nestjsEventBus,
    );
  });

  it('should delete a farm and publish event', async () => {
    const farmId = 'farm-123';
    const farm = new FarmEntity({
      id: new FarmIdValueObject(farmId),
      name: new FarmNameValueObject('Test Farm'),
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
    nestjsEventBus.publish.mockResolvedValue(undefined);

    await handler.execute(new DeleteFarmCommand(farmId));

    expect(farmsRepository.findById).toHaveBeenCalledWith(farmId);
    expect(farmsRepository.update).toHaveBeenCalled();
    expect(farmsCacheRepository.remove).toHaveBeenCalledWith(farmId);
    expect(nestjsEventBus.publish).toHaveBeenCalled();
  });

  it('should throw FarmNotFoundException if farm does not exist', async () => {
    farmsRepository.findById.mockResolvedValue(null);
    await expect(
      handler.execute(new DeleteFarmCommand('not-found')),
    ).rejects.toBeInstanceOf(FarmNotFoundException);
  });
});
